// generated with @7nohe/openapi-react-query-codegen@3.0.2 

import { queryOptions } from "@tanstack/react-query";
import { getAllQuizQuestions, getQuizzes, me, type Options } from "../requests/sdk.gen";
import type { GetAllQuizQuestionsData, GetQuizzesData, MeData } from "../requests/types.gen";
import * as Common from "./common";

export const getQuizzesOptions = (clientOptions: Options<GetQuizzesData, true> = {}, queryKey?: Array<unknown>) => queryOptions({ queryKey: Common.UseGetQuizzesKeyFn(clientOptions, queryKey), queryFn: ({ signal }) => getQuizzes({ ...clientOptions, signal, throwOnError: true }).then(response => response.data) });
export const getAllQuizQuestionsOptions = (clientOptions: Options<GetAllQuizQuestionsData, true>, queryKey?: Array<unknown>) => queryOptions({ queryKey: Common.UseGetAllQuizQuestionsKeyFn(clientOptions, queryKey), queryFn: ({ signal }) => getAllQuizQuestions({ ...clientOptions, signal, throwOnError: true }).then(response => response.data) });
export const meOptions = (clientOptions: Options<MeData, true> = {}, queryKey?: Array<unknown>) => queryOptions({ queryKey: Common.UseMeKeyFn(clientOptions, queryKey), queryFn: ({ signal }) => me({ ...clientOptions, signal, throwOnError: true }).then(response => response.data) });
