import { useMutation, useQuery } from "react-query";
import { apiRequest } from "@/helpers/api";
import React from "react";
import { PromoCodeSchema, PromoCodeSchemaType, responseArrayPromoCodeSchema, responseArrayPromoCodeSchemaType } from "@/helpers/utils/schema/shop";
import { sendPatchPromoCodeSchemaType } from "@/helpers/utils/schema/Admin";

const QUERY_URLS = {
    getAllPromos: (limit: number, offset: number) => `/promo_codes?limit=${limit}&offset=${offset}`,
    postPromoCode: () => `/promo_codes`,
    deletePromoCode: (id: string) => `/promo_codes/${id}`,
    patchPromoCode: (id: string) => `/promo_codes/${id}`,
} as const;

const token = localStorage.getItem('token')

const requestAllPromos = (limit: number, offset: number) => apiRequest({
    url: QUERY_URLS.getAllPromos(limit, offset),
    method: 'GET',
    token: !!token ? token : undefined
}, responseArrayPromoCodeSchema)

const requestPostPromoCode = (body: PromoCodeSchemaType) => apiRequest({
    url: QUERY_URLS.postPromoCode(),
    method: 'POST',
    body,
    token: !!token ? token : undefined
})

const requestDeletePromoCode = (id: string) => apiRequest({
    url: QUERY_URLS.deletePromoCode(id),
    method: 'DELETE',
    token: !!token ? token : undefined
})

const requestPatchPromoCode = (id: string, body: sendPatchPromoCodeSchemaType) => apiRequest({
    url: QUERY_URLS.patchPromoCode(id),
    method: 'PATCH',
    body,
    token: !!token ? token : undefined
})

export const useGetAllPromos = (limit: number, offset: number) => {
    const { data, isLoading, error, refetch } = useQuery<responseArrayPromoCodeSchemaType>(['getAllPromos', limit, offset], () => requestAllPromos(limit, offset))

    return React.useMemo(() => ({ data, isLoading, error, refetch }), [data, isLoading, error])
}

export const usePostPromoCode = () => useMutation((data: PromoCodeSchemaType) => requestPostPromoCode(data))

export const useDeletePromoCode = () => useMutation((id: string) => requestDeletePromoCode(id))

export const usePatchPromoCode = () => useMutation((data: { id: string, body: sendPatchPromoCodeSchemaType }) => requestPatchPromoCode(data.id, data.body))