import React from "react";
import { DropResult } from "react-beautiful-dnd";
import GameCardContext from "../../context/cards/GameCardContext";
import { IGameCard } from "../../types/cards";

export const GameCardProvider = ({ children }: { children: React.ReactNode }) => {
    const [cardSets, setCardSets] = React.useState<IGameCard[]>([]);

    const setIsDraggable = (cardSet: IGameCard, isDraggable: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, isDraggable };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setIsActive = (cardSet: IGameCard, isActive: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, isActive };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setIsHidden = (cardSet: IGameCard, isHidden: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, isHidden };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setIsFocused = (cardSet: IGameCard, isFocused: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, isFocused };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setCanPop = (cardSet: IGameCard, canPop: boolean, displayCardInfoOnPop: boolean, popScale: number = 1.75) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, canPop, displayCardInfoOnPop, popScale };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setCanFlip = (cardSet: IGameCard, canFlip: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, canFlip };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setCanActivate = (cardSet: IGameCard, canActivate: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, canActivate };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setCanInteract = (cardSet: IGameCard, canInteract: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, canInteract };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const setIsLoaded = (cardSet: IGameCard, isLoaded: boolean) => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                if (cardSet.id === updatedCardSet.id) {
                    return { ...updatedCardSet, isLoaded };
                }
                return updatedCardSet;
            });
            return updatedCardSets;
        });
    };

    const deactivateAllCardSets = () => {
        setCardSets((prevState) => {
            if (!prevState) return prevState;

            const updatedCardSets = prevState.map((updatedCardSet) => {
                return { ...updatedCardSet, isActive: false };
            });
            return updatedCardSets;
        });
    };

    const sortCardSets = (result: DropResult) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const sortedCardSets = [...cardSets]
        const [removed] = sortedCardSets.splice(result.source.index, 1);
        sortedCardSets.splice(result.destination.index, 0, removed);

        setCardSets(sortedCardSets);
    };

    const value = React.useMemo(() => ({
        cardSets,
        setCardSets,
        setIsDraggable,
        setIsActive,
        setIsHidden,
        setIsFocused,
        setCanPop,
        setCanFlip,
        setCanActivate,
        setCanInteract,
        setIsLoaded,
        deactivateAllCardSets,
        sortCardSets
    }), [cardSets,
        setCardSets,
        setIsDraggable,
        setIsActive,
        setIsHidden,
        setIsFocused,
        setCanPop,
        setCanFlip,
        setCanActivate,
        setCanInteract,
        setIsLoaded,
        deactivateAllCardSets,
        sortCardSets]);

    return (
        <GameCardContext.Provider value={value}>
            {children}
        </GameCardContext.Provider>
    );
}