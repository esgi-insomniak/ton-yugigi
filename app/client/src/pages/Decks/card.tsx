import GameCard from "@/components/GameCard/GameCard";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/helpers/api/hooks";
import { useGetUserCardSets, useScrapCards } from "@/helpers/api/hooks/cards/card-set.hook";
import useModal from "@/helpers/api/hooks/modal";
import { useGameCard } from "@/helpers/context/cards/GameCardContext";
import { useAlert } from "@/helpers/providers/alerts/AlertProvider";
import { CardIPrice, CardIUserCardSet, IGameCard } from "@/helpers/types/cards";
import React from "react";

const CardCollection = () => {
    const { user } = useAuth()
    const { data: cardSetsResponse, refetch } = useGetUserCardSets(user.id, 0, 24, "", "", "", "")
    const { cardSets, setCardSets } = useGameCard()
    const [arrayOfCardDismantle, setArrayOfCardDismantle] = React.useState<{ id: string, selected: boolean }[]>([])
    const [arrayOfDuplicateCard, setArrayOfDuplicateCard] = React.useState<string[]>([])
    const [coinsEarned, setCoinsEarned] = React.useState<number>(0)
    const alert = useAlert()
    const { isShowing, toggle } = useModal()
    const scrapCards = useScrapCards()

    const filterDuplicatedIdSets = () => {
        const arrayOfDuplicateCardId: string[] = []
        cardSets.map((cardSet, i) => {
            if (cardSets.find((cardSetDuplicate) => cardSetDuplicate.id === cardSet.id && cardSetDuplicate !== cardSet)) {
                arrayOfDuplicateCardId.push(cardSet.id)
            }
        })
        setArrayOfDuplicateCard(arrayOfDuplicateCardId)
    }

    React.useEffect(() => {
        if (arrayOfCardDismantle.length <= 0) return;
        const cardsPrice = cardSets.filter((findCardSet) => arrayOfCardDismantle.find((cardDuplicate) => cardDuplicate.id === findCardSet.id)
        ).map((cardSet) => {
            const prices: Partial<CardIPrice> = cardSet.card.price;
            delete prices.id;
            return prices;
        });
        const coinsEarned = Math.round(
            cardsPrice.reduce((acc, curr) => {
                const maxPrice = Math.max(...Object.values(curr as CardIPrice));
                return maxPrice !== 0 ? acc + maxPrice : acc + 1;
            }, 0),
        );
        setCoinsEarned(coinsEarned)
    }, [arrayOfCardDismantle])

    React.useEffect(() => {
        if (cardSetsResponse?.data === undefined) return;
        const apiCardSets = cardSetsResponse.data.map<IGameCard>((userCardSet: CardIUserCardSet) => {
            return {
                ...userCardSet.cardSet,
                isActive: false,
                isHidden: false,
                isFocused: false,
                isLoaded: false,
                isDraggable: false,
                canPop: false,
                displayCardInfoOnPop: false,
                popScale: 1.75,
                canFlip: false,
            }
        })
        setCardSets(apiCardSets)
    }, [cardSetsResponse])

    const handleSelectCard = (cardId: string) => {
        if (arrayOfCardDismantle.find((cardDuplicate) => cardDuplicate.id === cardId)?.selected) {
            setArrayOfCardDismantle(arrayOfCardDismantle.filter((cardDuplicate) => cardDuplicate.id !== cardId))
        } else setArrayOfCardDismantle([...arrayOfCardDismantle, { id: cardId, selected: true }])
    }

    const handleRequestScrapCardsModal = (ids: string[]) => {
        scrapCards.mutate(ids, {
            onSuccess: (res) => {
                setArrayOfCardDismantle([])
                alert?.success(`Cartes démantelez avec succès !, ${res.data?.coinsEarned} coins ont été ajouté à votre compte !`)
                refetch()
            },
            onError: (error) => alert?.error('Une erreur est survenue lors du démantelement des cartes !')
        })
    }

    return (
        <div className={`w-full h-full px-20 py-10 flex flex-col space-y-10`}>
            <div className="flex w-full justify-between space-x-5">
                <button className="btn" onClick={filterDuplicatedIdSets}>Trouver les cartes en doubles</button>
                <button className="btn" onClick={toggle} disabled={arrayOfCardDismantle.length <= 0}>Démanteler les cartes contres des coins</button>
            </div>
            <div className="grid grid-cols-8 px-3 w-full gap-2 scrollbar-none container mx-auto h-full">
                {cardSets
                    .filter((cardSet) => !arrayOfDuplicateCard.includes(cardSet.id))
                    .map((cardSet, i) => (
                        <div className={`${arrayOfCardDismantle.find((cardDuplicate) => cardDuplicate.id === cardSet.id)?.selected && "border-[3px] border-yellow-500 h-fit p-0.5 rounded-md"}`} onClick={() => handleSelectCard(cardSet.id)} key={i}>
                            <GameCard {...cardSet} />
                        </div>
                    ))}
            </div>
            <Modal
                isShowing={isShowing}
                toggle={toggle}
                title="Démanteler les cartes"
                text={`Êtes-vous sûr de vouloir démantelez les cartes sélectionnées en échange de ${coinsEarned} coins ?`}
                yesNo
                yesNoAction={[
                    { text: 'Non', action: () => toggle(), type: 'no' },
                    { text: 'Oui', action: () => handleRequestScrapCardsModal(arrayOfDuplicateCard), type: 'yes' }
                ]}
            />
        </div>
    );
}

export default CardCollection;