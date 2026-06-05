import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listDocs,
  getDocBySlug,
  getDocById,
  createDoc,
  updateDoc,
  updateDocStatus,
  deleteDoc,
  uploadAttachment,
  downloadAttachment,
} from "./api/docs.functions";
import {
  getRoadmapOverrides,
  updatePhaseOverride,
  updateSubStepOverride,
} from "./api/roadmap.functions";
import {
  createCaseSuccess,
  deleteCaseSuccess,
  listCaseSuccess,
  updateCaseSuccess,
} from "./api/case-success.functions";
import type { CaseSuccessInput } from "./case-success.types";
import type { DocInput } from "./types";

export const docKeys = {
  all: ["docs"] as const,
  detail: (slug: string) => ["docs", "slug", slug] as const,
  byId: (id: string) => ["docs", "id", id] as const,
};

export const caseKeys = {
  all: ["case-success"] as const,
};

export const roadmapKeys = {
  all: ["roadmap-overrides"] as const,
};

export function useDocs() {
  return useQuery({
    queryKey: docKeys.all,
    queryFn: () => listDocs(),
  });
}

export function useDocBySlug(slug: string) {
  return useQuery({
    queryKey: docKeys.detail(slug),
    queryFn: () => getDocBySlug({ data: { slug } }),
    enabled: !!slug,
  });
}

export function useCreateDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DocInput) => createDoc({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: docKeys.all }),
  });
}

export function useUpdateDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DocInput }) =>
      updateDoc({ data: { id, input } }),
    onSuccess: (doc) => {
      qc.invalidateQueries({ queryKey: docKeys.all });
      qc.invalidateQueries({ queryKey: docKeys.detail(doc.slug) });
      qc.invalidateQueries({ queryKey: docKeys.byId(doc.id) });
    },
  });
}

export function useUpdateDocStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocInput["status"] }) =>
      updateDocStatus({ data: { id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: docKeys.all }),
  });
}

export function useDeleteDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoc({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: docKeys.all }),
  });
}

export function useRoadmapOverrides() {
  return useQuery({
    queryKey: roadmapKeys.all,
    queryFn: () => getRoadmapOverrides(),
  });
}

export function useSavePhaseOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updatePhaseOverride>[0]["data"]) =>
      updatePhaseOverride({ data: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roadmapKeys.all }),
  });
}

export function useSaveSubStepOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateSubStepOverride>[0]["data"]) =>
      updateSubStepOverride({ data: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roadmapKeys.all }),
  });
}

export function useCaseSuccessList() {
  return useQuery({
    queryKey: caseKeys.all,
    queryFn: () => listCaseSuccess(),
  });
}

export function useCreateCaseSuccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CaseSuccessInput) => createCaseSuccess({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: caseKeys.all }),
  });
}

export function useUpdateCaseSuccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CaseSuccessInput }) =>
      updateCaseSuccess({ data: { id, input } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: caseKeys.all }),
  });
}

export function useDeleteCaseSuccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCaseSuccess({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: caseKeys.all }),
  });
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "file") : "file";
}

export async function uploadFiles(files: File[]) {
  const results = await Promise.all(
    files.map(async (file) => {
      const base64 = await fileToBase64(file);
      return uploadAttachment({
        data: {
          fileName: file.name,
          fileType: getFileExtension(file.name),
          base64,
          sizeKb: Math.round(file.size / 1024),
        },
      });
    }),
  );
  return results;
}

export async function downloadStoredFile(storageKey: string, fileName: string) {
  const { base64 } = await downloadAttachment({ data: { storageKey } });
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function openAttachmentLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
