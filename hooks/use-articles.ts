"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import {
  getArticlesAction,
  getArticleByIdAction,
  createArticleAction,
  updateArticleAction,
  toggleArticleStatusAction,
  deleteArticlesAction,
} from "@/services/articles";
import type { Article } from "@/schemas/dashboard";

export const ARTICLES_QUERY_KEY = ["articles"];

export function useArticlesQuery() {
  return useQuery({
    queryKey: ARTICLES_QUERY_KEY,
    queryFn: async () => {
      const res = await getArticlesAction();
      if (!res.success || !res.articles) {
        throw new Error(res.error || "Failed to load articles.");
      }
      return res.articles as Article[];
    },
  });
}

export function useArticleDetailQuery(id: string) {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getArticleByIdAction(id);
      if (!res.success || !res.article) {
        throw new Error(res.error || "Failed to load article details.");
      }
      return res.article as Article;
    },
    enabled: !!id,
  });
}

export function useCreateArticleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: Omit<Article, "id">) => {
      // Look up what type the action explicitly expects for its first argument
      type CreateParam = Parameters<typeof createArticleAction>[0];

      const res = await createArticleAction(article as CreateParam);
      if (!res.success || !res.article) {
        throw new Error(res.error || "Failed to create article.");
      }
      return res.article;
    },
    onSuccess: () => {
      toast.success("Article created successfully.");
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to create article."));
    },
  });
}

export function useUpdateArticleMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Article> & { isDraftSave?: boolean } }) => {
      // Look up what type the action explicitly expects for its second argument
      type UpdateParam = Parameters<typeof updateArticleAction>[1];

      const res = await updateArticleAction(payload.id, payload.data as UpdateParam);
      if (!res.success || !res.article) {
        throw new Error(res.error || "Failed to update article.");
      }
      return res.article;
    },
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [...ARTICLES_QUERY_KEY, id] });
      }
      queryClient.invalidateQueries({ queryKey: [...ARTICLES_QUERY_KEY, updatedArticle.id] });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update article."));
    },
  });
}

export function useToggleArticleStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleArticleStatusAction(id);
      if (!res.success) {
        throw new Error(res.error || "Failed to update status.");
      }
      return { id, status: res.status };
    },
    onSuccess: (data) => {
      toast.success(`Article status updated to ${data.status}.`);
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ARTICLES_QUERY_KEY, data.id] });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update status."));
    },
  });
}

export function useDeleteArticlesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteArticlesAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete articles.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Selected article(s) deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to delete articles."));
    },
  });
}