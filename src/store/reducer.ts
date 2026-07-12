import type { ActivityEvent, AppState } from './state';
import type { Action } from './actions';

const ACTIVITY_CAP = 30;

function withActivity(state: AppState, entry?: ActivityEvent): AppState {
  if (!entry) return state;
  return { ...state, activity: [entry, ...state.activity].slice(0, ACTIVITY_CAP) };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'request/submit':
      return withActivity(
        { ...state, requests: [action.request, ...state.requests] },
        action.activity,
      );
    case 'request/update':
      return withActivity(
        {
          ...state,
          requests: state.requests.map((r) => (r.id === action.id ? { ...r, ...action.patch } : r)),
        },
        action.activity,
      );
    case 'request/setStatus':
      return withActivity(
        {
          ...state,
          requests: state.requests.map((r) =>
            action.ids.includes(r.id) ? { ...r, status: action.status } : r,
          ),
        },
        action.activity,
      );
    case 'request/assign':
      return withActivity(
        {
          ...state,
          requests: state.requests.map((r) =>
            action.ids.includes(r.id) ? { ...r, assigneeId: action.assigneeId } : r,
          ),
        },
        action.activity,
      );
    case 'request/remove':
      return withActivity(
        { ...state, requests: state.requests.filter((r) => !action.ids.includes(r.id)) },
        action.activity,
      );
    case 'appointment/book':
      return withActivity(
        { ...state, appointments: [action.appointment, ...state.appointments] },
        action.activity,
      );
    case 'appointment/setStatus':
      return withActivity(
        {
          ...state,
          appointments: state.appointments.map((a) =>
            a.id === action.id ? { ...a, status: action.status } : a,
          ),
        },
        action.activity,
      );
    case 'document/add':
      return withActivity(
        { ...state, documents: [action.document, ...state.documents] },
        action.activity,
      );
    case 'document/remove':
      return withActivity(
        { ...state, documents: state.documents.filter((d) => !action.ids.includes(d.id)) },
        action.activity,
      );
    case 'request/comment':
      return withActivity(
        {
          ...state,
          requests: state.requests.map((r) =>
            r.id === action.id ? { ...r, comments: [...(r.comments ?? []), action.comment] } : r,
          ),
        },
        action.activity,
      );
    case 'activity/markRead':
      return {
        ...state,
        readActivity: [...new Set([...state.readActivity, ...action.ids])],
      };
    case 'activity/markAllRead':
      return { ...state, readActivity: state.activity.map((a) => a.id) };
  }
}
