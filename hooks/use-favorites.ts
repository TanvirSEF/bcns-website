"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import type { FavoriteTargetType } from "@/types/api";

/**
 * Fetches the current user's favorites for a specific target type and provides
 * an optimistic toggle with rollback. One fetch per page that uses it.
 */
export function useFavorites(targetType: FavoriteTargetType) {
  const [favoredIds, setFavoredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const all = await api.favorites.getFavorites();
      const ids = new Set(
        all.filter((f) => f.targetType === targetType).map((f) => f.targetId),
      );
      setFavoredIds(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [targetType]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (targetId: string) => {
      const isFavored = favoredIds.has(targetId);
      // Optimistic update
      setFavoredIds((prev) => {
        const next = new Set(prev);
        if (isFavored) next.delete(targetId);
        else next.add(targetId);
        return next;
      });

      try {
        if (isFavored) {
          await api.favorites.removeFavorite(targetType, targetId);
          toast.success("Removed from favorites");
        } else {
          await api.favorites.addFavorite(targetType, targetId);
          toast.success("Added to favorites");
        }
      } catch (error) {
        // Revert on failure
        setFavoredIds((prev) => {
          const next = new Set(prev);
          if (isFavored) next.add(targetId);
          else next.delete(targetId);
          return next;
        });
        toast.error(
          error instanceof Error ? error.message : "Failed to update favorites",
        );
      }
    },
    [favoredIds, targetType],
  );

  return { favoredIds, toggle, loading };
}
