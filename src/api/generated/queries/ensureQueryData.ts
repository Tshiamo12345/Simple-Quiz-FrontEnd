// generated with @7nohe/openapi-react-query-codegen@3.0.2 

import { type EnsureQueryDataOptions, type QueryClient } from "@tanstack/react-query";
import { getAllQuizQuestions, getQuizzes, type Options } from "../requests/sdk.gen";
import type { GetAllQuizQuestionsData, GetQuizzesData } from "../requests/types.gen";
import * as Common from "./common";

export const ensureUseGetQuizzesData = (queryClient: QueryClient, clientOptions: Options<GetQuizzesData, true> = {}, options?: Omit<EnsureQueryDataOptions<Common.GetQuizzesDefaultResponse>, "queryKey" | "queryFn">) => queryClient.ensureQueryData({ queryKey: Common.UseGetQuizzesKeyFn(clientOptions), queryFn: ({ signal }) => getQuizzes({ ...clientOptions, signal, throwOnError: true }).then(response => response.data), ...options });
export const ensureUseGetAllQuizQuestionsData = (queryClient: QueryClient, clientOptions: Options<GetAllQuizQuestionsData, true>, options?: Omit<EnsureQueryDataOptions<Common.GetAllQuizQuestionsDefaultResponse>, "queryKey" | "queryFn">) => queryClient.ensureQueryData({ queryKey: Common.UseGetAllQuizQuestionsKeyFn(clientOptions), queryFn: ({ signal }) => getAllQuizQuestions({ ...clientOptions, signal, throwOnError: true }).then(response => response.data), ...options });
