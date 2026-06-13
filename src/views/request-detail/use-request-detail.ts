import { useParams } from 'react-router-dom';
import { toast } from '@dev-dga/react';
import { staffById } from '@/data/fixtures';
import type { RequestComment } from '@/data/types';
import { makeActivity } from '@/store/actions';
import { requestById } from '@/store/selectors';
import { useStore } from '@/store/store-context';
import { useT } from '@/i18n';
import { approvedActivity, rejectedActivity, assignedActivity } from '../queue/queue-activity';

const REVIEWER = { en: 'Operations reviewer', ar: 'مراجع العمليات' };

export function useRequestDetail() {
  const { id = '' } = useParams();
  const { state, dispatch } = useStore();
  const t = useT();
  const request = requestById(state, id);

  const approve = () => {
    dispatch({
      type: 'request/setStatus',
      ids: [id],
      status: 'approved',
      activity: approvedActivity([id]),
    });
    toast.success(t('queue.toast.approved'));
  };

  const reject = () => {
    dispatch({
      type: 'request/setStatus',
      ids: [id],
      status: 'rejected',
      activity: rejectedActivity([id]),
    });
    toast.success(t('queue.toast.rejected'));
  };

  const assign = (assigneeId: string) => {
    const member = staffById(assigneeId);
    dispatch({
      type: 'request/assign',
      ids: [id],
      assigneeId,
      activity: member ? assignedActivity([id], member.name) : undefined,
    });
    toast.success(t('queue.toast.assigned'));
  };

  const addComment = (text: string) => {
    const comment: RequestComment = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      author: REVIEWER,
      text,
    };
    dispatch({
      type: 'request/comment',
      id,
      comment,
      activity: makeActivity('commented', {
        en: `Comment added on ${id}`,
        ar: `تمت إضافة تعليق على ${id}`,
      }),
    });
    toast.success(t('detail.commentAdded'));
  };

  return { id, request, approve, reject, assign, addComment };
}

export type RequestDetailController = ReturnType<typeof useRequestDetail>;
