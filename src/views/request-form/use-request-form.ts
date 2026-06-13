import { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, type UploadFile } from '@dev-dga/react';
import { useStore } from '@/store/store-context';
import { requestById } from '@/store/selectors';
import { makeActivity } from '@/store/actions';
import { useT } from '@/i18n';
import { blankForm, toForm, formReducer, validateStep } from './form-state';
import { toRequest } from './form-request';

function nextSeq(ids: string[]): number {
  const max = ids.reduce((m, id) => {
    const n = Number(id.split('-').pop());
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return Math.max(max + 1, 101);
}

export function useRequestForm() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const t = useT();

  const existing = id ? requestById(state, id) : undefined;
  const isNew = !id;
  const [draft, send] = useReducer(formReducer, undefined, () =>
    existing ? toForm(existing) : blankForm(),
  );
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [loadedFor, setLoadedFor] = useState(id);
  if (loadedFor !== id) {
    setLoadedFor(id);
    send({ type: 'load', draft: existing ? toForm(existing) : blankForm() });
    setFiles([]);
    setDirty(false);
  }

  const mark =
    <A extends unknown[]>(fn: (...args: A) => void) =>
    (...args: A) => {
      setDirty(true);
      fn(...args);
    };

  const onFilesAdded = mark((accepted: File[]) => {
    const next: UploadFile[] = accepted.map((f) => ({
      id: `${f.name}-${f.size}`,
      file: f,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...next]);
  });

  const submit = () => {
    if (!validateStep(draft, 3)) return;
    const attachments = files.map((f, i) => ({
      id: `att-${Date.now()}-${i}`,
      name: f.file.name,
      sizeKB: Math.max(1, Math.round(f.file.size / 1024)),
    }));
    const request = toRequest(
      draft,
      existing,
      nextSeq(state.requests.map((r) => r.id)),
      attachments,
    );
    if (existing) {
      dispatch({
        type: 'request/update',
        id: existing.id,
        patch: request,
        activity: makeActivity('submitted', {
          en: `${request.id} updated`,
          ar: `تم تحديث ${request.id}`,
        }),
      });
      toast.success(t('form.toast.saved'));
    } else {
      dispatch({
        type: 'request/submit',
        request,
        activity: makeActivity('submitted', {
          en: `${request.id} submitted`,
          ar: `تم إرسال ${request.id}`,
        }),
      });
      toast.success(t('form.toast.submitted'));
    }
    navigate('/requests');
  };

  return {
    isNew,
    notFound: Boolean(id) && !existing,
    existing,
    draft,
    send,
    mark,
    files,
    onFilesAdded,
    onRemoveFile: mark((fileId: string) => setFiles((p) => p.filter((f) => f.id !== fileId))),
    dirty,
    discardOpen,
    setDiscardOpen,
    confirmDiscard: () => navigate('/requests'),
    submit,
    history: existing
      ? state.requests.filter(
          (r) => r.id !== existing.id && r.applicant.nationalId === existing.applicant.nationalId,
        )
      : [],
  };
}

export type RequestFormController = ReturnType<typeof useRequestForm>;
