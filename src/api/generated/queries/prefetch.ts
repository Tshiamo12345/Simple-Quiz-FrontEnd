// generated with @7nohe/openapi-react-query-codegen@3.0.2 

import { type FetchQueryOptions, type QueryClient } from "@tanstack/react-query";
import { getAllQuizQuestions, getQuizzes, type Options } from "../requests/sdk.gen";
import type { GetAllQuizQuestionsData, GetQuizzesData } from "../requests/types.gen";
import * as Common from "./common";

export const prefetchUseGetQuizzes = (queryClient: QueryClient, clientOptions: Options<GetQuizzesData, true> = {}, options?: Omit<FetchQueryOptions<Common.GetQuizzesDefaultResponse>, "queryKey" | "queryFn">) => queryClient.prefetchQuery({ queryKey: Common.UseGetQuizzesKeyFn(clientOptions), queryFn: ({ signal }) => getQuizzes({ ...clientOptions, signal, throwOnError: true }).then(response => response.data), ...options });
export const prefetchUseGetAllQuizQuestions = (queryClient: QueryClient, clientOptions: Options<GetAllQuizQuestionsData, true>, options?: Omit<FetchQueryOptions<Common.GetAllQuizQuestionsDefaultResponse>, "queryKey" | "queryFn">) => queryClient.prefetchQuery({ queryKey: Common.UseGetAllQuizQuestionsKeyFn(clientOptions), queryFn: ({ signal }) => getAllQuizQuestions({ ...clientOptions, signal, throwOnError: true }).then(response => response.data), ...options });
