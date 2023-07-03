import { apiRequest } from "@/helpers/api";
import { ApiGetItemResponse } from "@/helpers/types/common";
import { ExchangeSchemaType, responseExchangeSchema } from "@/helpers/utils/schema/Admin";
import React from "react";
import { useQuery } from "react-query";

const QUERY_URL = {
    getAllExchanges: (limit: number, page: number) => `/exchanges?limit=${limit}&offset=${page}`,
}

const token = localStorage.getItem('token')

const requestAllExchanges = (limit: number, page: number) => apiRequest({
    url: QUERY_URL.getAllExchanges(limit, page),
    method: 'GET',
    token: !!token ? token : undefined
}, responseExchangeSchema)

export const useGetAllExchanges = (limit?: number, page?: number) => {
    const { data, isLoading, error, refetch } = useQuery<ApiGetItemResponse<ExchangeSchemaType[]>>(['getAllExchanges', limit, page], () => requestAllExchanges(limit!, page!))

    return React.useMemo(() => ({ data, isLoading, error, refetch }), [data, isLoading, error])
}