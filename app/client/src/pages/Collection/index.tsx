import GameCard from "@/components/GameCard/GameCard";
import { useGetCardSets } from "@/helpers/api/hooks/cards/card-set.hook";
import { useGetAllArchetypes } from "@/helpers/api/hooks/cards/archetype.hook";
import React from "react";
import { IGameCard } from "@/helpers/types/cards";
import { useGameCard } from "@/helpers/context/cards/GameCardContext";
import { useGetAllAttributes, useGetAllRarities } from "@/helpers/api/hooks/cards/attribute.hook";
import { Input, Select } from "@/components/Input";
import { set } from "react-hook-form";

interface FiltersProps {
    search: string;
    archetype: string;
    attributeId: string;
    rarity: string;
}

const Collection = () => {
    const [page, setPage] = React.useState<number>(0)
    const [filters, setFilters] = React.useState<FiltersProps>({
        attributeId: "",
        rarity: "",
        archetype: "",
        search: "",
    })

    const { data: cardSetsResponse, refetch } = useGetCardSets(page, 24, filters.attributeId, filters.rarity, filters.archetype, filters.search)
    const { cardSets, setCardSets, sortCardSets } = useGameCard()
    const { data: archetypes } = useGetAllArchetypes()
    const { data: rarities } = useGetAllRarities()
    const { data: attributes } = useGetAllAttributes()

    React.useEffect(() => {
        if (cardSetsResponse?.data === undefined || cardSetsResponse?.data.length === 0) return;
        const apiCardSets = cardSetsResponse.data.map<IGameCard>((cardSet) => {
            return {
                ...cardSet,
                isActive: false,
                isHidden: false,
                isFocused: false,
                isLoaded: false,
                isDraggable: false,
                canPop: true,
                canFlip: false,
            }
        })
        setCardSets(apiCardSets)
    }, [cardSetsResponse])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const search = formData.get("searchBar")
        const archetype = formData.get("archetype")
        const attributeId = formData.get("attributeId")
        const rarity = formData.get("rarities")

        setFilters({
            search: search as string,
            archetype: archetype as string,
            attributeId: attributeId as string,
            rarity: rarity as string,
        })
        setPage(0)
        refetch()
    }

    const handleClear = () => {
        setFilters({
            search: "",
            archetype: "",
            attributeId: "",
            rarity: "",
        })
        setPage(0)
        refetch()
    }

    return (
        <div className="flex gap-5 w-full overflow-scroll p-5 flex-col h-screen">
            <form className="flex w-full space-x-2 items-center justify-center" onSubmit={handleSearch}>
                <input type="text" className="input input-bordered" name="searchBar" placeholder="Rechercher" />
                <Select name="archetype" options={archetypes?.data} placeholder="Choisir un Archetype" />
                <Select name="rarities" options={rarities?.data} placeholder="Choisir une rareté" />
                <Select name="attributeId" options={attributes?.data} placeholder="Choisir un attribut" />
                <button className="btn" type="submit">Rechercher</button>
                <button className="btn" onClick={handleClear}>Vider</button>
            </form>
            <div className="grid grid-cols-8 px-3 w-full gap-2 scrollbar-none container mx-auto h-full">
                {cardSets
                    .map((cardSet, i) => (
                        <GameCard key={i} {...cardSet} />
                    ))}
            </div>
            <div className="w-full flex items-end justify-center h-fit">
                <div className="btn-group">
                    <button className="btn" onClick={() => setPage((prev) => prev - 1)} disabled={page - 1 < 0}>«</button>
                    <button className="btn">{page + 1}</button>
                    <button className="btn" onClick={() => setPage((prev) => prev + 1)}>»</button>
                </div>
            </div>
        </div>
    )
}

export default Collection;