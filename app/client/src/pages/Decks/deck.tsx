import React from "react";
import { useGetAllUserDecks, useDeleteUserDeck } from "@/helpers/api/hooks/decks";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { GameCardProvider } from "@/helpers/providers/cards/cardsProvider";
import useModal from "@/helpers/api/hooks/modal";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { useAlert } from "@/helpers/providers/alerts/AlertProvider";
import { useGetCardDeckUser } from "@/helpers/api/hooks/decks"; // Import the hook
import { useMe } from "@/helpers/api/hooks/users";
import { PreviewSets } from "../Shop/previewSets";
import { CardICardSet } from "@/helpers/types/cards";

const Decks = () => {
    const { me } = useMe();
    const { data: decksData } = useGetAllUserDecks(me?.id!, 10, 0);
    const { toggle: previewDeckToggle, isShowing: previewDeckShowing } = useModal();
    const navigate = useNavigate();
    const deleteUserDeck = useDeleteUserDeck();
    const alert = useAlert();
    const { userCardsDeck, setUserDeckId } = useGetCardDeckUser();
    const [selectedDeck, setSelectedDeck] = React.useState<number>();

    const handlePreviewBooster = (myDeckId: string) => {
        try {
            setUserDeckId(myDeckId);
            previewDeckToggle();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteDeck = (id: string) => () => {
        if (confirm("Etes vous sur de vouloir supprimer ce deck ?")) {
            deleteUserDeck.mutate(id);
            alert?.success("Deck supprimé avec succès");
        }
    };

    return (
        <React.Fragment>
            <h1 className="m-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Création de mes decks
            </h1>
            <button onClick={() => navigate(-1)} className="btn m-4">
                Revenir en arrière
            </button>

            <div className="flex justify-around items-start mt-5">
                {
                    decksData?.data?.map((deck, index) => {
                        return (
                            <div className="h-full" key={index}>
                                <div className="card card-compact bg-base-300 shadow-xl">
                                    <figure>
                                        <img
                                            src={deck?.cardSets[0]?.cardSet?.card.imageUrlSmall}
                                            alt={`Deck ${deck?.name}`}
                                            className="h-fit"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title text-center">{deck?.name}</h2>
                                        <div className="flex justify-between items-center">
                                            <button
                                                className="btn btn-error"
                                                onClick={handleDeleteDeck(deck?.id)}
                                            >
                                                <BsFillTrashFill />
                                            </button>
                                            <div
                                                className="btn btn-primary"
                                                onClick={() => handlePreviewBooster(deck?.id)}
                                            >
                                                <AiFillEye onClick={() => setSelectedDeck(index)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                <a href="/decks/new" className="">
                    <div className="border-dashed border-2 border-sky-500 h-72 flex flex-col justify-center items-center px-3">
                        <span className="bg-sky-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mb-2 px-3 transform hover:scale-110 transition duration-300">
                            +
                        </span>
                        <p className="text-center text-sm font-semibold">
                            Créé un nouveaux decks
                        </p>
                    </div>
                </a>
            </div>
            <Modal
                isShowing={previewDeckShowing}
                toggle={previewDeckToggle}
                title="Aperçu du deck"
                content={
                    <GameCardProvider>
                        <PreviewSets cardSets={
                            decksData?.data?.[selectedDeck!]?.cardSets.map((cardSet) => {
                                return {
                                    set: cardSet?.cardSet?.set,
                                    rarity: cardSet?.cardSet?.rarity,
                                    id: cardSet?.cardSet?.id,
                                    card: cardSet?.cardSet?.card,
                                    price: cardSet?.cardSet?.price,
                                } as unknown as CardICardSet
                            }) || []
                        } />
                    </GameCardProvider>
                }
            />
        </React.Fragment>
    );
};

export default Decks;