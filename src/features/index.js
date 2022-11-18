import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dataApi = createApi({
    reducerPath: "dataApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/users?userData" }),
    endpoints: (builder) => ({
        getAllData: builder.query({
            query: () => "data",
        }),
    }),
});

export const { useGetAllDataQuery } = dataApi;
