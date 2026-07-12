import { useEffect, useReducer, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@dev-dga/react';
import { useStore } from '@/store/store-context';
import { filterRequests } from '@/store/selectors';
import { services, staffById } from '@/data/fixtures';
import { useLang, useT } from '@/i18n';
import {
  initialQueueState,
  queueReducer,
  statusFromParam,
  toRequestFilter,
  allOnPageSelected,
} from './queue-state';
import { approvedActivity, rejectedActivity, assignedActivity } from './queue-activity';

export function useQueue() {
  const { state: appState, dispatch } = useStore();
  const lang = useLang();
  const t = useT();
  const [params] = useSearchParams();
  const urlStatus = statusFromParam(params.get('status'));
  const [ui, send] = useReducer(queueReducer, initialQueueState, (s) =>
    urlStatus ? { ...s, status: urlStatus } : s,
  );

  const lastParam = useRef(urlStatus);
  useEffect(() => {
    if (urlStatus !== lastParam.current) {
      send({ type: 'setStatusTab', status: urlStatus ?? 'all' });
      lastParam.current = urlStatus;
    }
  }, [urlStatus]);

  const { rows, total, pageCount } = filterRequests(
    appState.requests,
    services,
    toRequestFilter(ui, lang),
  );
  const pageIds = rows.map((r) => r.id);

  const approve = (ids: string[]) => {
    dispatch({
      type: 'request/setStatus',
      ids,
      status: 'approved',
      activity: approvedActivity(ids),
    });
    send({ type: 'clearSelection' });
    toast.success(t('queue.toast.approved'));
  };

  const reject = (ids: string[]) => {
    dispatch({
      type: 'request/setStatus',
      ids,
      status: 'rejected',
      activity: rejectedActivity(ids),
    });
    send({ type: 'clearSelection' });
    toast.success(t('queue.toast.rejected'));
  };

  const assign = (ids: string[], assigneeId: string) => {
    const member = staffById(assigneeId);
    dispatch({
      type: 'request/assign',
      ids,
      assigneeId,
      activity: member ? assignedActivity(ids, member.name) : undefined,
    });
    send({ type: 'clearSelection' });
    toast.success(t('queue.toast.assigned'));
  };

  return {
    ui,
    send,
    rows,
    total,
    pageCount,
    pageIds,
    headerChecked: allOnPageSelected(ui.selected, pageIds),
    approve,
    reject,
    assign,
  };
}

export type QueueController = ReturnType<typeof useQueue>;
