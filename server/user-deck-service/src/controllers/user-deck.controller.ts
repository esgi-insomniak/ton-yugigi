import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserDeckService } from '../services/user-deck.service';
import {
  GetResponseArray,
  GetResponseOne,
  ParamGetItemById,
  QueryGetItems,
} from 'src/interfaces/common/common.response.interface';
import { UserDeck } from 'src/entities/user-deck.entity';

@Controller('user_deck')
export class UserDeckController {
  constructor(private readonly userDeckService: UserDeckService) {}

  @MessagePattern('post_userdeck')
  public async postUserDeck(query: {
    userId: string;
    name: string;
    userCardSetsIds: string[];
  }): Promise<GetResponseOne<UserDeck>> {
    const userDeck = await this.userDeckService.createUserDeck(query);
    const result: GetResponseOne<UserDeck> = {
      status: userDeck ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      message: userDeck ? null : 'UserDeck not created',
      item: userDeck,
    };

    return result;
  }

  @MessagePattern('update_userdeck_by_id')
  public async updateUserDeck(request: {
    params: ParamGetItemById;
    body: {
      name: string;
      userCardSetIds: string[];
    };
  }): Promise<GetResponseOne<UserDeck>> {
    const userDeck = await this.userDeckService.updateUserDeckById(
      request.params.id,
      request.body,
    );
    const result: GetResponseOne<UserDeck> = {
      status: userDeck ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: userDeck ? null : 'UserDeck not updated',
      item: userDeck,
    };

    return result;
  }

  @MessagePattern('delete_userdeck_by_id')
  public async deleteUserDeck(params: ParamGetItemById): Promise<boolean> {
    return await this.userDeckService.deleteUserDeckById(params.id);
  }

  @MessagePattern('add_cardset_to_userdeck')
  public async addCardSetToUserDeck(query: {
    userId: string;
    deckId: string;
    userCardSetsIds: string[];
  }): Promise<GetResponseOne<UserDeck>> {
    const userDeck = await this.userDeckService.addCardSetsToDeck(query);
    const result: GetResponseOne<UserDeck> = {
      status: userDeck ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: userDeck ? null : 'UserDeck not found',
      item: userDeck,
    };

    return result;
  }

  @MessagePattern('get_userdeck_by_id')
  public async getUserDeckById(
    params: ParamGetItemById,
  ): Promise<GetResponseOne<UserDeck>> {
    const userDeck = await this.userDeckService.getUserDeckById(params.id);
    const result: GetResponseOne<UserDeck> = {
      status: userDeck ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: userDeck ? null : 'UserDeck not found',
      item: userDeck,
    };

    return result;
  }

  @MessagePattern('get_userdecks_by_user_id')
  public async getUserDecksByUserId(request: {
    params: ParamGetItemById;
    query: QueryGetItems;
  }): Promise<GetResponseArray<UserDeck>> {
    const userDecks = await this.userDeckService.getUserDecksByUserId(
      request.params.id,
      request.query,
    );
    const result: GetResponseArray<UserDeck> = {
      status: HttpStatus.OK,
      message: null,
      items: userDecks,
    };

    return result;
  }

  @MessagePattern('get_userdecks_by_usercardset_id')
  public async getUserDecksByUserCardSetId(
    params: ParamGetItemById,
  ): Promise<GetResponseArray<UserDeck>> {
    const userDecks = await this.userDeckService.getUserDecksByUserCardSetId(
      params.id,
    );
    const result: GetResponseArray<UserDeck> = {
      status: HttpStatus.OK,
      message: null,
      items: userDecks,
    };

    return result;
  }

  @MessagePattern('get_userdecks_by_usercard_ids')
  public async getUserDecksByUserCardIds(params: {
    ids: string[];
  }): Promise<GetResponseArray<UserDeck>> {
    const userDecks = await this.userDeckService.getUserDecksByUserCardIds(
      params.ids,
    );

    const result: GetResponseArray<UserDeck> = {
      status: HttpStatus.OK,
      message: null,
      items: userDecks,
    };

    return result;
  }
}
