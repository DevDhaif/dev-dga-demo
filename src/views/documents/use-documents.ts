import { useRef, useState } from 'react';
import { toast, type UploadFile } from '@dev-dga/react';
import { useStore } from '@/store/store-context';
import { filterDocuments } from '@/store/document-selectors';
import { makeActivity } from '@/store/actions';
import type { DocumentAsset, DocumentKind } from '@/data/types';
import { useLang, useT } from '@/i18n';
import { toDocument } from './documents-logic';

const PAGE_SIZE = 8;

export function useDocuments() {
  const { state, dispatch } = useStore();
  const lang = useLang();
  const t = useT();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<DocumentKind | 'all'>('all');
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<DocumentAsset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const { rows, total, pageCount } = filterDocuments(state.documents, {
    query,
    lang,
    kind,
    page,
    pageSize: PAGE_SIZE,
  });

  const startUpload = () => {
    if (files.length === 0 || progress !== null) return;
    setProgress(0);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = (p ?? 0) + 25;
        if (next >= 100) {
          clearInterval(timer.current);
          files.forEach((f, i) => {
            const doc = toDocument(f.file, state.documents.length + i + 1);
            dispatch({
              type: 'document/add',
              document: doc,
              activity: makeActivity('uploaded', {
                en: `${doc.title.en} uploaded`,
                ar: `تم رفع ${doc.title.ar}`,
              }),
            });
          });
          toast.success(t('docs.toast.uploaded'));
          setFiles([]);
          setUploadOpen(false);
          return null;
        }
        return next;
      });
    }, 60);
  };

  const remove = (id: string) => {
    dispatch({ type: 'document/remove', ids: [id] });
    setSelected(null);
    toast.success(t('docs.toast.deleted'));
  };

  const onFilesAdded = (accepted: File[]) =>
    setFiles((prev) => [
      ...prev,
      ...accepted.map(
        (f): UploadFile => ({ id: `${f.name}-${f.size}`, file: f, status: 'success' }),
      ),
    ]);

  return {
    rows,
    total,
    pageCount,
    query,
    setQuery: (v: string) => (setQuery(v), setPage(1)),
    kind,
    setKind: (v: DocumentKind | 'all') => (setKind(v), setPage(1)),
    page,
    setPage,
    zoom,
    setZoom,
    selected,
    setSelected,
    uploadOpen,
    setUploadOpen,
    files,
    onFilesAdded,
    onRemoveFile: (id: string) => setFiles((p) => p.filter((f) => f.id !== id)),
    progress,
    startUpload,
    remove,
  };
}

export type DocumentsController = ReturnType<typeof useDocuments>;
