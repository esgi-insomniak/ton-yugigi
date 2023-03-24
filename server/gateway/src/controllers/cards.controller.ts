import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetCardByIdResponseDto,
  GetCardsResponseDto,
} from '../interfaces/card-service/card/card-response.dto';
import {
  ICardGetOneResponse,
  ICardGetResponse,
} from '../interfaces/card-service/card/card-response.interface';
import { GetCardsQueryDto } from '../interfaces/card-service/card/card-query.dto';
import { GetCardByIdDto } from '../interfaces/card-service/card/card-param.dto';

@Controller('cards')
@ApiTags('cards')
export class CardController {
  constructor(
    @Inject('CARD_SERVICE') private readonly cardServiceClient: ClientProxy,
  ) {}

  @Get()
  @ApiCreatedResponse({
    type: GetCardsResponseDto,
  })
  public async getCards(
    @Query() query: GetCardsQueryDto,
  ): Promise<GetCardsResponseDto> {
    const cardResponse: ICardGetResponse = await firstValueFrom(
      this.cardServiceClient.send('get_cards', {
        limit: query.limit,
        offset: query.offset,
      }),
    );

    return {
      data: {
        cards: cardResponse.cards,
      },
      errors: null,
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetCardByIdResponseDto,
  })
  public async getCardById(
    @Param() params: GetCardByIdDto,
  ): Promise<GetCardByIdResponseDto> {
    const cardResponse: ICardGetOneResponse = await firstValueFrom(
      this.cardServiceClient.send('get_card_by_id', {
        id: params.id,
      }),
    );

    return {
      data: {
        card: cardResponse.card,
      },
      errors: null,
    };
  }
}