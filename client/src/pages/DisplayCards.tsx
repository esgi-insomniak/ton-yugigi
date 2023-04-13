import React from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import GameCard from "@/components/GameCard/GameCard"
import cardsJson from '@/assets/cards.json'
import GameCardContext from "../helpers/context/cards/GameCardContext"
import { v4 as uuidv4 } from "uuid"
import { CardAttribute, CardFrameType, CardRace, CardRarity, CardType } from "@/helpers/utils/enum/card"
import { GameCardType } from "@/helpers/types/cards"

const DisplayCards = () => {
    const { cards, setCards, sortCards } = React.useContext(GameCardContext)

    React.useEffect(() => {
        if (cards.length !== 0) return;

        const filteredCards = Object.values(cardsJson).filter((card) => {
            if (card.card_sets !== undefined)
                return card;
        }).map((card) => {

            return {
                uniqueId: uuidv4(),
                id: card.id,
                name: card.name,
                name_en: card.name_en,
                type: Object.values(CardType).find(type => type === card.type),
                frameType: Object.values(CardFrameType).find(frameType => frameType === card.frameType),
                rarity: Object.values(CardRarity).find(rarity => rarity === card.card_sets[0].set_rarity),
                attribute: Object.values(CardAttribute).find(attribute => attribute === card.attribute),
                setCode: card.card_sets[0].set_code,
                race: Object.values(CardRace).find(race => race === card.race),
                level: card.level,
                atk: card.atk,
                def: card.def,
                image_small: card.card_images[0].image_url_small,
                image_large: card.card_images[0].image_url,
                isDraggable: true,
                isActive: false,
                isHidden: card.id === 37478723,
                isFocused: false,
                canPop: true,
                canFlip: true
            } as unknown as GameCardType
        })

        setCards(filteredCards.slice(0, 10))
    }, [cards.length])

    return (
        <div className="w-full flex justify-center items-center px-32">
            <DragDropContext onDragEnd={sortCards}>
                <Droppable droppableId="drop_test">
                    {dropProvided => (
                        <div {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="grid grid-cols-3 grid-flow-dense gap-5">
                            {cards.map((card, index) => (
                                <div key={index}>
                                    <h2>{card.rarity.replace(/\W/g, '-').toLowerCase()}</h2>
                                    <Draggable key={card.id} draggableId={card.id.toString()} index={index} isDragDisabled={!card.isDraggable}>
                                        {dragProvided => (
                                            <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                                                <GameCard {...card} dragProvided={dragProvided} />
                                            </div>
                                        )}
                                    </Draggable>
                                </div>
                            ))}
                            {dropProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default DisplayCards