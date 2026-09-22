// generated with @7nohe/openapi-react-query-codegen@3.0.2 

import { type UseQueryResult } from "@tanstack/react-query";
import { getAllQuizQuestions, getQuizzes, login, me, type Options, signup, submitAnswers, verifyOpt } from "../requests/sdk.gen";
import type { GetAllQuizQuestionsData, GetQuizzesData, MeData } from "../requests/types.gen";

export type GetQuizzesDefaultResponse = Awaited<ReturnType<typeof getQuizzes>>["data"];
export type GetQuizzesQueryResult<TData = GetQuizzesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;

export const useGetQuizzesKey = "GetQuizzes";
export const UseGetQuizzesKeyFn = (clientOptions: Options<GetQuizzesData, true> = {}, queryKey?: Array<unknown>) => [useGetQuizzesKey, ...(queryKey ?? [clientOptions])];

export type GetAllQuizQuestionsDefaultResponse = Awaited<ReturnType<typeof getAllQuizQuestions>>["data"];
export type GetAllQuizQuestionsQueryResult<TData = GetAllQuizQuestionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;

export const useGetAllQuizQuestionsKey = "GetAllQuizQuestions";
export const UseGetAllQuizQuestionsKeyFn = (clientOptions: Options<GetAllQuizQuestionsData, true>, queryKey?: Array<unknown>) => [useGetAllQuizQuestionsKey, ...(queryKey ?? [clientOptions])];

export type MeDefaultResponse = Awaited<ReturnType<typeof me>>["data"];
export type MeQueryResult<TData = MeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;

export const useMeKey = "Me";
export const UseMeKeyFn = (clientOptions: Options<MeData, true> = {}, queryKey?: Array<unknown>) => [useMeKey, ...(queryKey ?? [clientOptions])];

export type SubmitAnswersMutationResult = Awaited<ReturnType<typeof submitAnswers>>;

export const useSubmitAnswersKey = "SubmitAnswers";
export const UseSubmitAnswersKeyFn = (mutationKey?: Array<unknown>) => [useSubmitAnswersKey, ...(mutationKey ?? [])];

export type VerifyOptMutationResult = Awaited<ReturnType<typeof verifyOpt>>;

export const useVerifyOptKey = "VerifyOpt";
export const UseVerifyOptKeyFn = (mutationKey?: Array<unknown>) => [useVerifyOptKey, ...(mutationKey ?? [])];

export type SignupMutationResult = Awaited<ReturnType<typeof signup>>;

export const useSignupKey = "Signup";
export const UseSignupKeyFn = (mutationKey?: Array<unknown>) => [useSignupKey, ...(mutationKey ?? [])];

export type LoginMutationResult = Awaited<ReturnType<typeof login>>;

export const useLoginKey = "Login";
export const UseLoginKeyFn = (mutationKey?: Array<unknown>) => [useLoginKey, ...(mutationKey ?? [])];
