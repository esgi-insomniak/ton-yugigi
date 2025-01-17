import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  SetMetadata,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  BaseWsExceptionFilter,
  WsException,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { IAuthorizedSocket } from './interfaces/websocket/socket/socket.interface';
import { ISocketMessage } from './interfaces/websocket/socket-message/socket-message.interface';
import { PermissionGuard } from './services/guard/permission.guard';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

import {
  ISocketEvent,
  ISocketEventType,
} from './interfaces/websocket/socket-emit/socket-event.interface';
import { IDuel } from './interfaces/duel-service/duel/duel.interface';
import {
  GetResponseArray,
  GetResponseOne,
} from './interfaces/common/common.response';
import { firstValueFrom } from 'rxjs';
import {
  AcceptUserExchangeByIdDto,
  CreateUserExchangeBodyDto,
  UpdateUserExchangeByIdDto,
} from './interfaces/user-service/userExchange/user-exchange.body.dto';
import { ICardSet } from './interfaces/card-service/set/set.interface';
import {
  IUser,
  IUserRoles,
} from './interfaces/user-service/user/user.interface';
import {
  IUserExchange,
  IUserExchangePartial,
} from './interfaces/user-service/userExchange/user-exchange.interface';
import {
  IUserCardSet,
  IUserCardSetPartial,
} from './interfaces/user-deck-service/userCardSet/user-card-set.interface';
import { IUserRelation } from './interfaces/user-service/userRelation/user-relation.interface';
import { GetItemByIdDto } from './interfaces/common/common.params.dto';
import { ICardCardSet } from './interfaces/card-service/cardSet/card-set.interface';
import { IUserDeckPartial } from './interfaces/user-deck-service/userDeck/user-deck.interface';
import { SelectedDeckBodyDto } from './interfaces/user-deck-service/userDeck/user-deck.body.dto';
import {
  IDuelCardInField,
  IDuelPlayer,
} from './interfaces/duel-service/duelPlayer/duel-player.interface';
import { DuelSendActionDataBodyDto } from './interfaces/duel-service/duel/duel.body.dto';
import { CreateAuctionBodyDto } from './interfaces/user-service/userAuction/user-auction.body.dto';
import { IAuction } from './interfaces/user-service/userAuction/user-auction.interface';
import { IAuctionHistory } from './interfaces/user-service/userAuctionHistory/user-auction.interface';

@Catch()
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  protected readonly logger = new Logger(WebsocketExceptionsFilter.name);

  constructor(private readonly eventName: string) {
    super();
  }

  // Catch all websocket exceptions and send them to the client
  catch(exception: HttpException | WsException, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client = ctx.getClient<IAuthorizedSocket>();
    const socketEventError: ISocketEvent = {
      event: this.eventName,
      type: ISocketEventType.ERROR,
      data: null,
    };
    this.logger.error(exception);

    // check if the exception is a HttpException or a WsException
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as ISocketMessage & {
        error: string;
      };
      delete exceptionResponse.error;
      socketEventError.data = {
        statusCode: exceptionResponse.statusCode,
        message: exceptionResponse.message,
      };
    } else if (exception instanceof WsException) {
      socketEventError.data = exception.getError();
    }

    client.emit(this.eventName, socketEventError);
  }
}

@UsePipes(
  new ValidationPipe(),
  new ValidationPipe({
    whitelist: true,
  }),
)
@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(WebsocketGateway.name);

  protected duelQueue: Array<{
    socket: IAuthorizedSocket;
    timeout?: NodeJS.Timeout;
    interval?: NodeJS.Timeout;
  }> = [];

  protected duelSelectedDeckCountdown: Array<{
    roomId: string;
    timeout?: NodeJS.Timeout;
    interval?: NodeJS.Timeout;
  }> = [];

  protected duelCountdown: Array<{
    roomId: string;
    timeout?: NodeJS.Timeout;
    interval?: NodeJS.Timeout;
  }> = [];

  protected auctionTimeout: NodeJS.Timeout;
  protected auctionInterval: NodeJS.Timeout;

  constructor(
    @Inject('USER_SERVICE') protected readonly userServiceClient: ClientProxy,
    @Inject('DUEL_SERVICE') protected readonly duelServiceClient: ClientProxy,
    @Inject('CARD_SERVICE') protected readonly cardServiceClient: ClientProxy,
    @Inject('USER_DECK_SERVICE')
    protected readonly userDeckServiceClient: ClientProxy,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: IAuthorizedSocket) {
    // disconnect if user is already connected
    // if (
    //   (await this.io.fetchSockets()).filter(
    //     (s: RemoteSocket<DefaultEventsMap, any> & IAuthorizedSocket) =>
    //       s.userId === client.userId,
    //   ).length > 1
    // ) {
    //   return client.disconnect();
    // }

    client.join(client.userId);

    this.userServiceClient.emit('set_user_is_online', {
      id: client.userId,
      isOnline: true,
    });

    // check if user is in duel
    const currentDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_user_id', {
        id: client.userId,
      }),
    );

    if (currentDuelResponse.status === HttpStatus.OK) {
      client.join(currentDuelResponse.item.roomId);
      if (!currentDuelResponse.item.hasStarted) {
        client.emit('duel__deck_selected', {
          event: 'duel__deck_selected',
          type: ISocketEventType.INFO,
          data: currentDuelResponse.item,
        } as ISocketEvent);
      }
      client.emit('duel__is_started', {
        event: 'duel__is_started',
        type: ISocketEventType.INFO,
        data: {
          roomId: currentDuelResponse.item.roomId,
          hasStarted: currentDuelResponse.item.hasStarted,
        },
      } as ISocketEvent);
    }

    this.io.emit('user__is_online', {
      event: 'user__is_online',
      type: ISocketEventType.INFO,
      data: {
        userId: client.userId,
        isOnline: true,
      },
    } as ISocketEvent);
  }

  async handleDisconnect(client: IAuthorizedSocket) {
    // not update user isOnline if user is still connected
    // if (
    //   (await this.io.fetchSockets()).filter(
    //     (s: RemoteSocket<DefaultEventsMap, any> & IAuthorizedSocket) =>
    //       s.userId === client.userId,
    //   ).length > 0
    // ) {
    //   return;
    // }

    this.duelQueue = this.duelQueue.filter(
      (user) => user.socket.userId !== client.userId,
    );

    this.userServiceClient.emit('set_user_is_online', {
      id: client.userId,
      isOnline: false,
    });

    this.io.emit('user__is_online', {
      event: 'user__is_online',
      type: ISocketEventType.INFO,
      data: {
        userId: client.userId,
        isOnline: false,
      },
    } as ISocketEvent);
  }

  filterDuelByUserId = (userId: string, duel: IDuel): IDuel => {
    const filteredDuel: IDuel = {
      ...duel,
      players: duel.players.map((user: IDuelPlayer) => {
        const updUser: IDuelPlayer = {
          ...user,
          cardsInDeck: (user.cardsInDeck as string[]).length,
          cardsInHand:
            user.userId === userId
              ? user.cardsInHand
              : (user.cardsInHand as string[]).length,
        };
        return updUser;
      }),
    };
    return filteredDuel;
  };

  initDuelTurnTimer = (duel: IDuel) => {
    // clear previous timeout
    const previousDuelCountDownTimeout = this.duelCountdown.find(
      (d) => d.roomId === duel.roomId,
    );

    if (previousDuelCountDownTimeout) {
      clearInterval(previousDuelCountDownTimeout?.interval);
      clearTimeout(previousDuelCountDownTimeout?.timeout);

      this.duelCountdown = this.duelCountdown.filter(
        (d) => d.roomId !== duel.roomId,
      );
    }

    // init the duel countDown
    const duelCountDownTimeout = setTimeout(async () => {
      clearTimeout(duelCountDownTimeout);
      const getDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
        this.duelServiceClient.send('get_duel_by_room_id', {
          params: {
            roomId: duel.roomId,
          },
        }),
      );

      if (getDuelResponse.status !== HttpStatus.OK) {
        throw new WsException({
          statusCode: getDuelResponse.status,
          message: getDuelResponse.message,
        } as ISocketMessage);
      }

      const updatedDuel = await this.drawCard(duel, duel.playerToPlay);

      updatedDuel.players.forEach((player) => {
        this.io.to(player.userId).emit('duel__current', {
          event: 'duel__current',
          type: ISocketEventType.INFO,
          data: this.filterDuelByUserId(player.userId, updatedDuel),
        });
      });

      this.initDuelTurnTimer(updatedDuel);
    }, duel.timePerTurn * 1000);

    let duelTurnToPlayCountDown = duel.timePerTurn;
    const duelCountDownInterval = setInterval(() => {
      duelTurnToPlayCountDown -= 1;
      this.io.to(duel.roomId).emit('duel__current', {
        event: 'duel__deck_playtime_countdown',
        type: ISocketEventType.INFO,
        data: {
          countDown: duelTurnToPlayCountDown,
        },
      });
      if (duelTurnToPlayCountDown === 0) clearInterval(duelCountDownInterval);
    }, 1000);

    this.duelCountdown.push({
      roomId: duel.roomId,
      timeout: duelCountDownTimeout,
      interval: duelCountDownInterval,
    });
  };

  drawCard = async (duel: IDuel, userId: string): Promise<IDuel> => {
    const duelToUpdate: IDuel = {
      ...duel,
      playerToPlay: duel.players.find(
        (player) => player.userId !== duel.playerToPlay,
      ).userId,
      turn: duel.turn + 1,
      players: duel.players.map((player: IDuelPlayer) => {
        if (player.userId === userId) {
          const playerToUpdate: IDuelPlayer = {
            ...player,
            cardsInHand: [
              ...(player.cardsInHand as string[]),
              player.cardsInDeck[0],
            ],
            cardsInDeck: (player.cardsInDeck as string[]).slice(1),
          };

          return playerToUpdate;
        }
        return player;
      }),
    };

    const updatedDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('update_duel_by_room_id', {
        params: {
          roomId: duel.roomId,
        },
        body: duelToUpdate,
      }),
    );

    if (updatedDuelResponse.status !== HttpStatus.OK) {
      this.logger.error(
        `Error while updating duel ${duel.roomId} with new turn`,
        updatedDuelResponse.message,
      );
      // throw new WsException({
      //   statusCode: updatedDuelResponse.status,
      //   message: updatedDuelResponse.message,
      // } as ISocketMessage);
    }

    return updatedDuelResponse.item;
  };

  handleTimer = (auction: IAuction) => {
    clearTimeout(this.auctionTimeout);
    clearInterval(this.auctionInterval);

    this.auctionTimeout = setTimeout(async () => {
      const getLastHistoryResponse: GetResponseArray<IAuctionHistory> =
        await firstValueFrom(
          this.userServiceClient.send('get_auction_history_by_auction_id', {
            params: {
              id: auction.id,
            },
            query: {
              limit: 1,
              offset: 0,
            },
          }),
        );

      // give the card to the winner
      this.userDeckServiceClient.emit('post_usercardset', {
        userId: getLastHistoryResponse.items[0].user.id,
        cardSetId: auction.cardSetId,
      });

      // disable the auction
      const updateAuctionResponse: GetResponseOne<IAuction> =
        await firstValueFrom(
          this.userServiceClient.send('update_auction_by_id', {
            params: {
              id: auction.id,
            },
            body: {
              isClosed: true,
              winner: getLastHistoryResponse.items[0].user.id,
            },
          }),
        );

      if (updateAuctionResponse.status !== HttpStatus.OK) {
        return;
      }

      const updatedAuctionSocketEvent: ISocketEvent = {
        event: 'auction__closed',
        type: ISocketEventType.UPDATE,
        data: updateAuctionResponse.item,
      };

      this.io.emit('auction__bids', updatedAuctionSocketEvent);

      clearTimeout(this.auctionTimeout);
    }, auction.duration * 1000);

    let defaultTime = auction.duration;
    this.auctionInterval = setInterval(() => {
      if (defaultTime === 0) {
        clearInterval(this.auctionInterval);
      }
      const intervalSocketEvent: ISocketEvent = {
        event: 'auction__interval',
        type: ISocketEventType.UPDATE,
        data: defaultTime,
      };
      defaultTime--;
      this.io.emit('auction__bids', intervalSocketEvent);
    }, 1000);
  };

  // Ping route for testing
  @SetMetadata('permission', { roles: ['admin'], areAuthorized: true })
  @UseGuards(PermissionGuard)
  @SubscribeMessage('ping')
  async ping(@ConnectedSocket() client: IAuthorizedSocket) {
    client.send({
      statusCode: HttpStatus.OK,
      message: 'pong',
    } as ISocketMessage);
  }

  // Duel Join Queue routes
  @SubscribeMessage('duel__join_queue')
  @UseFilters(new WebsocketExceptionsFilter('duel__queue'))
  async duelJoinQueue(@ConnectedSocket() client: IAuthorizedSocket) {
    const eventName = 'duel__queue';

    if (this.duelQueue.find((user) => user.socket.userId === client.userId)) {
      client.emit(eventName, {
        event: eventName,
        type: ISocketEventType.ERROR,
        data: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You are already in the queue.',
        } as ISocketMessage,
      } as ISocketEvent);
      return;
    }

    // check if user is already in a duel
    const duelResponse: GetResponseArray<IDuelPlayer> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_player_by_user_id', {
        params: {
          id: client.userId,
        },
      }),
    );

    if (duelResponse.status === HttpStatus.OK) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are already in a duel.',
      } as ISocketMessage);
    }

    // check if user has a deck
    const userDeckResponse: GetResponseArray<IUserDeckPartial> =
      await firstValueFrom(
        this.userDeckServiceClient.send('get_userdecks_by_user_id', {
          params: {
            id: client.userId,
          },
          query: {
            limit: 100,
            offset: 0,
          },
        }),
      );

    if (userDeckResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: userDeckResponse.status,
        message: userDeckResponse.message,
      } as ISocketMessage);
    }

    if (userDeckResponse.items.length === 0) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You need to create a deck first.',
      } as ISocketMessage);
    }

    const searchInterval = setInterval(async () => {
      if (this.duelQueue.length > 1) {
        const userFound = this.duelQueue.find(
          (user) => user.socket.userId !== client.userId,
        );

        if (!userFound) return;

        // remove both users from the queue
        this.duelQueue = this.duelQueue.filter(
          (user) =>
            user.socket.userId !== client.userId &&
            user.socket.userId !== userFound.socket.userId,
        );

        // remove timeouts and intervals
        clearTimeout(leaveQueueTimeout);
        clearInterval(searchInterval);
        clearTimeout(userFound.timeout);
        clearInterval(userFound.interval);

        const newDuelPartial: Partial<IDuel> = {
          roomId: uuidv4(),
          players: [
            {
              userId: client.userId,
              username: client.username,
            },
            {
              userId: userFound.socket.userId,
              username: userFound.socket.username,
            },
          ],
        };

        const newDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
          this.duelServiceClient.send('create_duel', newDuelPartial),
        );

        if (newDuelResponse.status !== HttpStatus.CREATED) {
          client.emit(eventName, {
            event: eventName,
            type: ISocketEventType.ERROR,
            data: {
              statusCode: newDuelResponse.status,
              message: newDuelResponse.message,
            } as ISocketMessage,
          } as ISocketEvent);
          return;
        }

        // add 2 users to the duel room
        client.join(newDuelResponse.item.roomId);
        userFound.socket.join(newDuelResponse.item.roomId);

        this.io.to(newDuelResponse.item.roomId).emit('duel__found', {
          event: 'duel__found',
          type: ISocketEventType.INFO,
          data: newDuelResponse.item,
        } as ISocketEvent);

        // start the duel countdown for selecting deck
        let deckSelectionCountdown = newDuelResponse.item.timeToSelectDeck;
        const deckSelectionInterval = setInterval(async () => {
          deckSelectionCountdown -= 1;
          this.io.to(newDuelResponse.item.roomId).emit('duel__deck_selected', {
            event: 'duel__deck_selected_countdown',
            type: ISocketEventType.INFO,
            data: {
              countDown: deckSelectionCountdown,
            },
          });
          if (deckSelectionCountdown === 0)
            clearInterval(deckSelectionInterval);
        }, 1000);

        const deckSelectionTimeout = setTimeout(() => {
          // delete the duel
          this.duelServiceClient.emit('delete_duel_by_room_id', {
            roomId: newDuelResponse.item.roomId,
          });
          // remove the countdown from the array
          this.duelSelectedDeckCountdown =
            this.duelSelectedDeckCountdown.filter(
              (countdown) => countdown.roomId !== newDuelResponse.item.roomId,
            );
          // emit the timeout to the room
          this.io.to(newDuelResponse.item.roomId).emit('duel__deck_selected', {
            event: 'duel__deck_selected',
            type: ISocketEventType.DELETE,
            data: {
              statusCode: HttpStatus.REQUEST_TIMEOUT,
              message: 'Deck selection timed out.',
            } as ISocketMessage,
          } as ISocketEvent);
        }, newDuelResponse.item.timeToSelectDeck * 1000);

        this.duelSelectedDeckCountdown.push({
          roomId: newDuelResponse.item.roomId,
          timeout: deckSelectionTimeout,
          interval: deckSelectionInterval,
        });
      }
    }, 5000);

    const leaveQueueTimeout = setTimeout(() => {
      this.duelQueue = this.duelQueue.filter(
        (user) => user.socket.userId !== client.userId,
      );

      clearInterval(searchInterval);
      clearTimeout(leaveQueueTimeout);

      client.emit(eventName, {
        event: eventName,
        type: ISocketEventType.ERROR,
        data: {
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'No duel found.',
        } as ISocketMessage,
      } as ISocketEvent);
    }, 60000);

    this.duelQueue.push({
      socket: client,
      timeout: leaveQueueTimeout,
      interval: searchInterval,
    });

    client.emit(eventName, {
      event: eventName,
      type: ISocketEventType.INFO,
      data: {
        statusCode: HttpStatus.OK,
        message: 'You joined the queue.',
      } as ISocketMessage,
    } as ISocketEvent);
  }

  // Duel Leave Queue routes
  @SubscribeMessage('duel__leave_queue')
  async duelLeaveQueue(@ConnectedSocket() client: IAuthorizedSocket) {
    const eventName = 'duel__queue';

    if (this.duelQueue.find((user) => user.socket.userId === client.userId)) {
      const userFound = this.duelQueue.find(
        (user) => user.socket.userId === client.userId,
      );

      if (!userFound) return;

      clearTimeout(userFound.timeout);
      clearInterval(userFound.interval);

      this.duelQueue = this.duelQueue.filter(
        (user) => user.socket.userId !== client.userId,
      );

      client.emit(eventName, {
        event: 'duel__queue',
        type: ISocketEventType.INFO,
        data: {
          statusCode: HttpStatus.OK,
          message: 'You left the queue.',
        } as ISocketMessage,
      } as ISocketEvent);
      return;
    }

    client.emit(eventName, {
      event: eventName,
      type: ISocketEventType.ERROR,
      data: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the queue.',
      } as ISocketMessage,
    } as ISocketEvent);
  }

  // Duel Select Deck routes
  @SubscribeMessage('duel__select_deck')
  @UseFilters(new WebsocketExceptionsFilter('duel__deck_selected'))
  async duelSelectDeck(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: SelectedDeckBodyDto,
  ) {
    const eventName = 'duel__deck_selected';
    // find duel room
    const duelRoomResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_room_id', {
        id: body.duelRoomId,
      }),
    );

    if (duelRoomResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: duelRoomResponse.status,
        message: duelRoomResponse.message,
      } as ISocketMessage);
    }

    // check if user is in the duel room
    const userFound = duelRoomResponse.item.players.find(
      (user) => user.userId === client.userId,
    );

    if (!userFound) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the duel room.',
      } as ISocketMessage);
    }

    // check if duel is not started and if user not already selected a deck
    if (duelRoomResponse.item.hasStarted || userFound.deckId !== null) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duel has already started.',
      } as ISocketMessage);
    }

    // check if deck exists
    const deckResponse: GetResponseOne<IUserDeckPartial> = await firstValueFrom(
      this.userDeckServiceClient.send('get_userdeck_by_id', {
        id: body.userDeckId,
      }),
    );

    if (deckResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: deckResponse.status,
        message: deckResponse.message,
      } as ISocketMessage);
    }

    // get cardSets by cardSetIds
    const cardSetsResponse: GetResponseArray<ICardCardSet> =
      await firstValueFrom(
        this.cardServiceClient.send('get_cardsets_by_ids', {
          ids: deckResponse.item.cardSets.map((item) => item.cardSetId),
        }),
      );

    if (cardSetsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        cardSetsResponse.message,
        cardSetsResponse.status,
      );
    }

    // create response with combined data of userDecks and cardSets
    const userCardSets: IUserCardSet[] = deckResponse.item.cardSets.map(
      (userCardSetPartial) => {
        const userCardSet: IUserCardSet = {
          id: userCardSetPartial.id,
          userId: userCardSetPartial.userId,
          cardSet: cardSetsResponse.items.find(
            (cardSet) => cardSet.id === userCardSetPartial.cardSetId,
          ),
        };
        return userCardSet;
      },
    );

    const duelUpdated: IDuel = {
      ...duelRoomResponse.item,
      hasStarted: duelRoomResponse.item.players.every((user) => {
        if (user.userId === client.userId) return true;
        return user.deckId === null ? false : true;
      }),
      playerToPlay: duelRoomResponse.item.players[0].userId,
      players: duelRoomResponse.item.players.map((user: IDuelPlayer) => {
        if (user.userId === client.userId) {
          return {
            ...user,
            deckId: body.userDeckId,
            deckUserCardSets: userCardSets,
            cardsInField: new Array(5).fill(null),
          } as IDuelPlayer;
        }
        return user;
      }),
    };

    const updatedDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('update_duel_by_room_id', {
        params: {
          roomId: body.duelRoomId,
        },
        body: duelUpdated,
      }),
    );

    if (updatedDuelResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updatedDuelResponse.status,
        message: updatedDuelResponse.message,
      } as ISocketMessage);
    }

    if (updatedDuelResponse.item.hasStarted) {
      const countDownTimeout = this.duelSelectedDeckCountdown.find(
        (countDown) => countDown.roomId === body.duelRoomId,
      );
      if (countDownTimeout) {
        clearTimeout(countDownTimeout.timeout);
        clearInterval(countDownTimeout.interval);
      }
    }

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.INFO,
      data: updatedDuelResponse.item,
    };

    // for the 2 players, shuffle the deck and draw 5 cards
    // store the userCardSetIds in cardsInDeck
    const playersUpdated: IDuelPlayer[] = updatedDuelResponse.item.players.map(
      (player: IDuelPlayer) => {
        const updPlayer: IDuelPlayer = {
          ...player,
          // randomize the player userCardSets and put in deck
          cardsInDeck: player.deckUserCardSets
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value.id),
        };
        // get the first 5 cards and put in hand and remove from deck
        updPlayer.cardsInHand = (updPlayer.cardsInDeck as string[]).splice(
          0,
          5,
        );
        updPlayer.cardsInDeck = (updPlayer.cardsInDeck as string[]).filter(
          (cardId) => !(updPlayer.cardsInHand as string[]).includes(cardId),
        );

        return updPlayer;
      },
    );

    this.duelServiceClient.emit('update_duel_by_room_id', {
      params: {
        roomId: body.duelRoomId,
      },
      body: {
        ...updatedDuelResponse.item,
        players: playersUpdated,
      },
    });

    // init turn timer
    this.initDuelTurnTimer(updatedDuelResponse.item);

    this.io
      .to(updatedDuelResponse.item.roomId)
      .emit(eventName, socketEventResponse);
  }

  // Duel Get Current Duel routes
  @SubscribeMessage('duel__get_current_game')
  @UseFilters(new WebsocketExceptionsFilter('duel__current'))
  async duelGetCurrentGame(@ConnectedSocket() client: IAuthorizedSocket) {
    const eventName = 'duel__current';
    // find duel room
    const duelRoomResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_user_id', {
        id: client.userId,
      }),
    );

    if (duelRoomResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: duelRoomResponse.status,
        message: duelRoomResponse.message,
      } as ISocketMessage);
    }

    // check if user is in the duel room
    const userFound = duelRoomResponse.item.players.find(
      (user) => user.userId === client.userId,
    );

    if (!userFound) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the duel room.',
      } as ISocketMessage);
    }

    // check if duel is started
    if (!duelRoomResponse.item.hasStarted) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duel has not started yet.',
      } as ISocketMessage);
    }

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.INFO,
      data: this.filterDuelByUserId(client.userId, duelRoomResponse.item),
    };

    client.emit(eventName, socketEventResponse);
  }

  // Duel Send Action routes
  @SubscribeMessage('duel__send_action')
  @UseFilters(new WebsocketExceptionsFilter('duel__current'))
  async duelSendAction(
    client: IAuthorizedSocket,
    body: DuelSendActionDataBodyDto,
  ) {
    // find duel room
    const duelRoomResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_user_id', {
        id: client.userId,
      }),
    );

    if (duelRoomResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: duelRoomResponse.status,
        message: duelRoomResponse.message,
      } as ISocketMessage);
    }

    // check if user is in the duel room
    const userFound = duelRoomResponse.item.players.find(
      (user) => user.userId === client.userId,
    );

    if (!userFound) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the duel room.',
      } as ISocketMessage);
    }

    // check if duel is started
    if (!duelRoomResponse.item.hasStarted) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duel has not started yet.',
      } as ISocketMessage);
    }

    // check if it is the user's turn
    if (duelRoomResponse.item.playerToPlay !== client.userId) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'It is not your turn.',
      } as ISocketMessage);
    }

    // check whats card has added to the field
    // get only the cards actually in the player hand
    const cardToAdd = body.cardsInField.find(
      (cardInField) =>
        cardInField !== null &&
        (userFound.cardsInHand as string[]).includes(
          cardInField.userCardSet.id,
        ),
    ) as IDuelCardInField;

    if (cardToAdd === undefined) return;

    const duelToUpdate: IDuel = {
      ...duelRoomResponse.item,
      players: duelRoomResponse.item.players.map((player: IDuelPlayer) => {
        if (player.userId !== client.userId) return player;
        const updatedCardsInField = player.cardsInField;
        updatedCardsInField[cardToAdd.position] = cardToAdd;

        const updatedPlayer: IDuelPlayer = {
          ...player,
          cardsInField: updatedCardsInField,
          cardsInHand: (player.cardsInHand as string[]).filter(
            (cardId) => cardId !== cardToAdd.userCardSet.id,
          ),
        };
        return updatedPlayer;
      }),
    };

    const updatedDuelResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('update_duel_by_room_id', {
        params: {
          roomId: duelToUpdate.roomId,
        },
        body: duelToUpdate,
      }),
    );

    if (updatedDuelResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updatedDuelResponse.status,
        message: updatedDuelResponse.message,
      } as ISocketMessage);
    }

    updatedDuelResponse.item.players.forEach((player) => {
      this.io.to(player.userId).emit('duel__current', {
        event: 'duel__current',
        type: ISocketEventType.INFO,
        data: this.filterDuelByUserId(player.userId, updatedDuelResponse.item),
      });
    });
  }

  // Duel Finish Turn routes
  @SubscribeMessage('duel__finish_turn')
  @UseFilters(new WebsocketExceptionsFilter('duel__current'))
  async duelFinishTurn(client: IAuthorizedSocket) {
    // find duel room
    const duelRoomResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_user_id', {
        id: client.userId,
      }),
    );

    if (duelRoomResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: duelRoomResponse.status,
        message: duelRoomResponse.message,
      } as ISocketMessage);
    }

    // check if user is in the duel room
    const userFound = duelRoomResponse.item.players.find(
      (user) => user.userId === client.userId,
    );

    if (!userFound) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the duel room.',
      } as ISocketMessage);
    }

    // check if duel is started
    if (!duelRoomResponse.item.hasStarted) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duel has not started yet.',
      } as ISocketMessage);
    }

    // check if it is the user's turn
    if (duelRoomResponse.item.playerToPlay !== client.userId) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'It is not your turn.',
      } as ISocketMessage);
    }

    const updatedDuel = await this.drawCard(
      duelRoomResponse.item,
      client.userId,
    );

    updatedDuel.players.forEach((player) => {
      this.io.to(player.userId).emit('duel__current', {
        event: 'duel__current',
        type: ISocketEventType.INFO,
        data: this.filterDuelByUserId(player.userId, updatedDuel),
      });
    });

    this.initDuelTurnTimer(updatedDuel);
  }

  // Duel Cancel routes
  @SubscribeMessage('duel__cancel')
  @UseFilters(new WebsocketExceptionsFilter('duel__canceled'))
  async duelCancel(@ConnectedSocket() client: IAuthorizedSocket) {
    // find duel room
    const duelRoomResponse: GetResponseOne<IDuel> = await firstValueFrom(
      this.duelServiceClient.send('get_duel_by_user_id', {
        id: client.userId,
      }),
    );

    if (duelRoomResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: duelRoomResponse.status,
        message: duelRoomResponse.message,
      } as ISocketMessage);
    }

    // check if user is in the duel room
    const userFound = duelRoomResponse.item.players.find(
      (user) => user.userId === client.userId,
    );

    if (!userFound) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You are not in the duel room.',
      } as ISocketMessage);
    }

    // stop select deck timer
    const selectDeckTimer = this.duelSelectedDeckCountdown.find(
      (timer) => timer.roomId === duelRoomResponse.item.roomId,
    );

    if (selectDeckTimer) {
      clearTimeout(selectDeckTimer.timeout);
      clearInterval(selectDeckTimer.interval);
      this.duelSelectedDeckCountdown = this.duelSelectedDeckCountdown.filter(
        (timer) => timer.roomId !== duelRoomResponse.item.roomId,
      );
    }

    // stop the duel timer
    const duelTimer = this.duelCountdown.find(
      (timer) => timer.roomId === duelRoomResponse.item.roomId,
    );

    if (duelTimer) {
      clearTimeout(duelTimer.timeout);
      clearInterval(duelTimer.interval);
      this.duelCountdown = this.duelCountdown.filter(
        (timer) => timer.roomId !== duelRoomResponse.item.roomId,
      );
    }

    // delete the duel room
    const deleteDuelResponse: GetResponseOne<boolean> = await firstValueFrom(
      this.duelServiceClient.send('delete_duel_by_room_id', {
        roomId: duelRoomResponse.item.roomId,
      }),
    );

    if (deleteDuelResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: deleteDuelResponse.status,
        message: deleteDuelResponse.message,
      } as ISocketMessage);
    }

    if (deleteDuelResponse.item) {
      const socketEventResponse: ISocketEvent = {
        event: 'duel__canceled',
        type: ISocketEventType.INFO,
        data: {
          message: 'Duel canceled.',
        },
      };

      this.io
        .to(duelRoomResponse.item.roomId)
        .emit('duel__canceled', socketEventResponse);
    }
  }

  // Exchange Create routes
  @SubscribeMessage('exchange__create')
  @UseFilters(new WebsocketExceptionsFilter('exchange__created'))
  async exchangeCreate(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: CreateUserExchangeBodyDto,
  ) {
    const eventName = 'exchange__created';

    if (body.userId === client.userId) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You cannot exchange with yourself.',
      } as ISocketMessage);
    }

    // check if target user exists
    const getExchangeTargetResponse: GetResponseOne<IUser> =
      await firstValueFrom(
        this.userServiceClient.send('get_user_by_id', {
          id: body.userId,
        }),
      );

    if (getExchangeTargetResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getExchangeTargetResponse.status,
        message: getExchangeTargetResponse.message,
      } as ISocketMessage);
    }

    // check if users relation is not blocked
    const usersRelationResponse: GetResponseOne<IUserRelation> =
      await firstValueFrom(
        this.userServiceClient.send('get_user_relation_by_users_ids', {
          currentUserId: client.userId,
          targetUserId: body.userId,
        }),
      );

    if (
      usersRelationResponse.status === HttpStatus.OK &&
      usersRelationResponse.item.isBlocked
    ) {
      throw new WsException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You cannot exchange with this user.',
      } as ISocketMessage);
    }

    // check if cardSet exists
    const getCardSetByIdResponse: GetResponseOne<ICardSet> =
      await firstValueFrom(
        this.cardServiceClient.send('get_cardset_by_id', {
          id: body.cardSetId,
        }),
      );

    if (getCardSetByIdResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getCardSetByIdResponse.status,
        message: getCardSetByIdResponse.message,
      } as ISocketMessage);
    }

    // check if target user has this card set
    const getUserCardSetResponse: GetResponseArray<IUserCardSet> =
      await firstValueFrom(
        this.userDeckServiceClient.send(
          'get_usercardsets_by_cardset_and_user_id',
          {
            cardSetId: body.cardSetId,
            userId: body.userId,
          },
        ),
      );

    if (getUserCardSetResponse.items.length <= 0) {
      throw new WsException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'This user does not have this card set.',
      } as ISocketMessage);
    }

    // check if already have an active exchange with this user
    const getActiveExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('get_active_user_exchange_between_users', {
          exchangeOwnerId: client.userId,
          exchangeTargetId: body.userId,
        }),
      );

    if (getActiveExchangeResponse.status !== HttpStatus.NOT_FOUND) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You already have an active exchange with this user.',
      } as ISocketMessage);
    }

    // create exchange
    const createdExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('create_user_exchange', {
          exchangeOwner: client.userId,
          exchangeTarget: body.userId,
          ownerCardSetsProposed: [],
          targetCardSetsProposed: [getUserCardSetResponse.items[0].id],
        }),
      );

    if (createdExchangeResponse.status !== HttpStatus.CREATED) {
      throw new WsException({
        statusCode: createdExchangeResponse.status,
        message: createdExchangeResponse.message,
      } as ISocketMessage);
    }

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.INFO,
      data: createdExchangeResponse.item,
    };
    client.emit(eventName, socketEventResponse);
    this.io.to(body.userId).emit('exchange__request', socketEventResponse);
  }

  // Exchange Cancel routes
  @SubscribeMessage('exchange__cancel')
  @UseFilters(new WebsocketExceptionsFilter('exchange__updated'))
  async exchangeCancel(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: GetItemByIdDto,
  ) {
    const eventName = 'exchange__updated';

    // check if exchange exists
    const getExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('get_user_exchange_by_id', {
          id: body.id,
        }),
      );

    if (getExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getExchangeResponse.status,
        message: getExchangeResponse.message,
      } as ISocketMessage);
    }

    // check if user is owner or target
    if (
      getExchangeResponse.item.exchangeOwner.id !== client.userId &&
      getExchangeResponse.item.exchangeTarget.id !== client.userId
    ) {
      throw new WsException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You cannot cancel this exchange.',
      } as ISocketMessage);
    }

    // check if exchange is already closed
    if (getExchangeResponse.item.isClosed) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'This exchange is already closed.',
      } as ISocketMessage);
    }

    // cancel exchange
    const updatedExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('update_user_exchange_by_id', {
          params: {
            id: body.id,
          },
          body: {
            isClosed: true,
          },
        }),
      );

    if (updatedExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updatedExchangeResponse.status,
        message: updatedExchangeResponse.message,
      } as ISocketMessage);
    }

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.UPDATE,
      data: updatedExchangeResponse.item,
    };

    const targetUserId =
      getExchangeResponse.item.exchangeOwner.id === client.userId
        ? getExchangeResponse.item.exchangeTarget.id
        : getExchangeResponse.item.exchangeOwner.id;

    client.emit(eventName, socketEventResponse);
    this.io.to(targetUserId).emit(eventName, socketEventResponse);
  }

  // Exchange Update routes
  @SubscribeMessage('exchange__update')
  @UseFilters(new WebsocketExceptionsFilter('exchange__updated'))
  async exchangeUpdated(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: UpdateUserExchangeByIdDto,
  ) {
    const eventName = 'exchange__updated';

    // check if exchange exists
    const getExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('get_user_exchange_by_id', {
          id: body.id,
        }),
      );

    if (getExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getExchangeResponse.status,
        message: getExchangeResponse.message,
      } as ISocketMessage);
    }

    // check if exchange is closed
    if (getExchangeResponse.item.isClosed) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You cannot update a closed exchange.',
      } as ISocketMessage);
    }

    // check if user is owner
    if (getExchangeResponse.item.exchangeOwner.id !== client.userId) {
      throw new WsException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You cannot update this exchange.',
      } as ISocketMessage);
    }

    // update exchange
    // remove all accepted propositions
    const updatedExchangeResponse: GetResponseOne<IUserExchangePartial> =
      await firstValueFrom(
        this.userServiceClient.send('update_user_exchange_by_id', {
          params: {
            id: body.id,
          },
          body: {
            ownerCardSetsProposed: body.ownerCardSetsProposed,
            ownerAccepted: false,
            targetAccepted: false,
          },
        }),
      );

    if (updatedExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updatedExchangeResponse.status,
        message: updatedExchangeResponse.message,
      } as ISocketMessage);
    }

    // store all userCardSets of owner & target
    const allUserCardSetsIds: string[] = [
      ...updatedExchangeResponse.item.ownerCardSetsProposed,
      ...updatedExchangeResponse.item.targetCardSetsProposed,
    ];

    // get userCardSets
    const userCardSetsResponse: GetResponseArray<IUserCardSetPartial> =
      await firstValueFrom(
        this.userDeckServiceClient.send('get_usercardsets_by_ids', {
          ids: allUserCardSetsIds,
        }),
      );

    if (userCardSetsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        userCardSetsResponse.message,
        userCardSetsResponse.status,
      );
    }

    // get cardSets
    const cardSetsResponse: GetResponseArray<ICardCardSet> =
      await firstValueFrom(
        this.cardServiceClient.send('get_cardsets_by_ids', {
          ids: userCardSetsResponse.items.map(
            (userCardSet) => userCardSet.cardSetId,
          ),
        }),
      );

    if (cardSetsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        cardSetsResponse.message,
        cardSetsResponse.status,
      );
    }

    const returnedExchange: IUserExchange = {
      ...updatedExchangeResponse.item,
      ownerCardSetsProposed:
        updatedExchangeResponse.item.ownerCardSetsProposed.map(
          (userCardSetId: string) => {
            const userCardSet: IUserCardSet = {
              id: userCardSetId,
              userId: updatedExchangeResponse.item.exchangeOwner.id,
              cardSet: cardSetsResponse.items.find(
                (cardSet) =>
                  cardSet.id ===
                  userCardSetsResponse.items.find(
                    (userCardSet) => userCardSet.id === userCardSetId,
                  ).cardSetId,
              ),
            };
            return userCardSet;
          },
        ),
      targetCardSetsProposed:
        updatedExchangeResponse.item.targetCardSetsProposed.map(
          (userCardSetId: string) => {
            const userCardSet: IUserCardSet = {
              id: userCardSetId,
              userId: updatedExchangeResponse.item.exchangeTarget.id,
              cardSet: cardSetsResponse.items.find(
                (cardSet) =>
                  cardSet.id ===
                  userCardSetsResponse.items.find(
                    (userCardSet) => userCardSet.id === userCardSetId,
                  ).cardSetId,
              ),
            };
            return userCardSet;
          },
        ),
    };

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.UPDATE,
      data: returnedExchange,
    };

    const targetUserId =
      getExchangeResponse.item.exchangeOwner.id === client.userId
        ? getExchangeResponse.item.exchangeTarget.id
        : getExchangeResponse.item.exchangeOwner.id;

    client.emit(eventName, socketEventResponse);
    this.io.to(targetUserId).emit(eventName, socketEventResponse);
  }

  // Exchange Accept routes
  @SubscribeMessage('exchange__accept')
  @UseFilters(new WebsocketExceptionsFilter('exchange__updated'))
  async exchangeAccepted(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: AcceptUserExchangeByIdDto,
  ) {
    const eventName = 'exchange__updated';

    // check if exchange exists
    const getExchangeResponse: GetResponseOne<IUserExchange> =
      await firstValueFrom(
        this.userServiceClient.send('get_user_exchange_by_id', {
          id: body.id,
        }),
      );

    if (getExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getExchangeResponse.status,
        message: getExchangeResponse.message,
      } as ISocketMessage);
    }

    // check if user is owner or target
    if (
      getExchangeResponse.item.exchangeOwner.id !== client.userId &&
      getExchangeResponse.item.exchangeTarget.id !== client.userId
    ) {
      throw new WsException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You cannot access this exchange.',
      } as ISocketMessage);
    }

    // check if exchange is closed
    if (getExchangeResponse.item.isClosed) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You cannot update a closed exchange.',
      } as ISocketMessage);
    }

    if (getExchangeResponse.item.ownerCardSetsProposed.length === 0) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You cannot accept the exchange',
      } as ISocketMessage);
    }

    const userAccepted =
      getExchangeResponse.item.exchangeOwner.id === client.userId
        ? {
            ownerAccepted: body.accept,
            isClosed: getExchangeResponse.item.targetAccepted,
          }
        : {
            targetAccepted: body.accept,
            isClosed: getExchangeResponse.item.ownerAccepted,
          };

    const updatedExchangeResponse: GetResponseOne<IUserExchangePartial> =
      await firstValueFrom(
        this.userServiceClient.send('update_user_exchange_by_id', {
          params: {
            id: body.id,
          },
          body: userAccepted,
        }),
      );

    if (updatedExchangeResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updatedExchangeResponse.status,
        message: updatedExchangeResponse.message,
      } as ISocketMessage);
    }

    // if exchange is closed, exchange cards of owner & target
    if (updatedExchangeResponse.item.isClosed) {
      // give to owner
      this.userDeckServiceClient.emit('change_usercardset_owner_by_ids', {
        ids: updatedExchangeResponse.item.targetCardSetsProposed,
        newOwnerId: updatedExchangeResponse.item.exchangeOwner.id,
      });
      // give to target
      this.userDeckServiceClient.emit('change_usercardset_owner_by_ids', {
        ids: updatedExchangeResponse.item.ownerCardSetsProposed,
        newOwnerId: updatedExchangeResponse.item.exchangeTarget.id,
      });
    }

    // store all userCardSets of owner & target
    const allUserCardSetsIds: string[] = [
      ...updatedExchangeResponse.item.ownerCardSetsProposed,
      ...updatedExchangeResponse.item.targetCardSetsProposed,
    ];

    // get userCardSets
    const userCardSetsResponse: GetResponseArray<IUserCardSetPartial> =
      await firstValueFrom(
        this.userDeckServiceClient.send('get_usercardsets_by_ids', {
          ids: allUserCardSetsIds,
        }),
      );

    if (userCardSetsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        userCardSetsResponse.message,
        userCardSetsResponse.status,
      );
    }

    // get cardSets
    const cardSetsResponse: GetResponseArray<ICardCardSet> =
      await firstValueFrom(
        this.cardServiceClient.send('get_cardsets_by_ids', {
          ids: userCardSetsResponse.items.map(
            (userCardSet) => userCardSet.cardSetId,
          ),
        }),
      );

    if (cardSetsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        cardSetsResponse.message,
        cardSetsResponse.status,
      );
    }

    const returnedExchange: IUserExchange = {
      ...updatedExchangeResponse.item,
      ownerCardSetsProposed:
        updatedExchangeResponse.item.ownerCardSetsProposed.map(
          (userCardSetId: string) => {
            const userCardSet: IUserCardSet = {
              id: userCardSetId,
              userId: updatedExchangeResponse.item.exchangeOwner.id,
              cardSet: cardSetsResponse.items.find(
                (cardSet) =>
                  cardSet.id ===
                  userCardSetsResponse.items.find(
                    (userCardSet) => userCardSet.id === userCardSetId,
                  ).cardSetId,
              ),
            };
            return userCardSet;
          },
        ),
      targetCardSetsProposed:
        updatedExchangeResponse.item.targetCardSetsProposed.map(
          (userCardSetId: string) => {
            const userCardSet: IUserCardSet = {
              id: userCardSetId,
              userId: updatedExchangeResponse.item.exchangeTarget.id,
              cardSet: cardSetsResponse.items.find(
                (cardSet) =>
                  cardSet.id ===
                  userCardSetsResponse.items.find(
                    (userCardSet) => userCardSet.id === userCardSetId,
                  ).cardSetId,
              ),
            };
            return userCardSet;
          },
        ),
    };

    const socketEventResponse: ISocketEvent = {
      event: eventName,
      type: ISocketEventType.UPDATE,
      data: returnedExchange,
    };

    const targetUserId =
      getExchangeResponse.item.exchangeOwner.id === client.userId
        ? getExchangeResponse.item.exchangeTarget.id
        : getExchangeResponse.item.exchangeOwner.id;

    client.emit(eventName, socketEventResponse);
    this.io.to(targetUserId).emit(eventName, socketEventResponse);
  }

  // Auction Create routes
  @SetMetadata('permission', { roles: [IUserRoles.admin], areAuthorized: true })
  @UseGuards(PermissionGuard)
  @UseFilters(new WebsocketExceptionsFilter('auction__created'))
  @SubscribeMessage('auction__create')
  async createAuction(
    @ConnectedSocket() client: IAuthorizedSocket,
    @MessageBody() body: CreateAuctionBodyDto,
  ) {
    const createAuctionResponse: GetResponseOne<IAuction> =
      await firstValueFrom(
        this.userServiceClient.send('create_auction', {
          body,
        }),
      );

    if (createAuctionResponse.status !== HttpStatus.CREATED) {
      throw new WsException({
        statusCode: createAuctionResponse.status,
        message: createAuctionResponse.message,
      } as ISocketMessage);
    }

    this.io.emit('auction__created', createAuctionResponse.item);
  }

  // Auction Update routes
  @SubscribeMessage('auction__make_bid')
  @UseFilters(new WebsocketExceptionsFilter('auction__bids'))
  async makeBid(@ConnectedSocket() client: IAuthorizedSocket) {
    const getAuctionResponse: GetResponseOne<IAuction> = await firstValueFrom(
      this.userServiceClient.send('get_actual_auction', {}),
    );

    if (getAuctionResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getAuctionResponse.status,
        message: getAuctionResponse.message,
      } as ISocketMessage);
    }

    const getUserResponse: GetResponseOne<IUser> = await firstValueFrom(
      this.userServiceClient.send('get_user_by_id', {
        id: client.userId,
      }),
    );

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getUserResponse.status,
        message: getUserResponse.message,
      } as ISocketMessage);
    }
    // if not history, start the timout
    const getAuctionHistoryResponse: GetResponseArray<IAuctionHistory> =
      await firstValueFrom(
        this.userServiceClient.send('get_auction_history_by_auction_id', {
          params: {
            id: getAuctionResponse.item.id,
          },
          query: {
            limit: 1,
            offset: 0,
          },
        }),
      );

    if (getAuctionHistoryResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: getAuctionHistoryResponse.status,
        message: getAuctionHistoryResponse.message,
      } as ISocketMessage);
    }

    this.handleTimer(getAuctionResponse.item);

    // check if user has enough money
    if (
      getUserResponse.item.coins <
      parseInt(getAuctionResponse.item.currentPrice.toString()) + 120
    ) {
      throw new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Not enough money',
      } as ISocketMessage);
    }

    // update the user coins
    const updateUserResponse: GetResponseOne<IUser> = await firstValueFrom(
      this.userServiceClient.send('update_user_by_id', {
        params: {
          id: client.userId,
        },
        body: {
          coins:
            parseInt(getUserResponse.item.coins.toString()) -
            parseInt(getAuctionResponse.item.currentPrice.toString()) -
            120,
        },
      }),
    );

    if (updateUserResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updateUserResponse.status,
        message: updateUserResponse.message,
      } as ISocketMessage);
    }

    const updateAuctionResponse: GetResponseOne<IAuction> =
      await firstValueFrom(
        this.userServiceClient.send('update_auction_by_id', {
          params: {
            id: getAuctionResponse.item.id,
          },
          body: {
            currentPrice:
              parseInt(getAuctionResponse.item.currentPrice.toString()) + 100,
          },
        }),
      );

    if (updateAuctionResponse.status !== HttpStatus.OK) {
      throw new WsException({
        statusCode: updateAuctionResponse.status,
        message: updateAuctionResponse.message,
      } as ISocketMessage);
    }

    const createAuctionHistoryResponse: GetResponseOne<IAuctionHistory> =
      await firstValueFrom(
        this.userServiceClient.send('create_auction_history', {
          user: client.userId,
          auction: getAuctionResponse.item.id,
          price:
            parseInt(getAuctionResponse.item.currentPrice.toString()) + 100,
        }),
      );

    const socketEventResponse: ISocketEvent = {
      event: 'auction__bids',
      type: ISocketEventType.CREATE,
      data: createAuctionHistoryResponse.item,
    };

    this.io.emit('auction__bids', socketEventResponse);
  }
}
