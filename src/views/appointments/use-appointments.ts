import { useState } from 'react';
import { toast } from '@dev-dga/react';
import { useStore } from '@/store/store-context';
import { makeActivity } from '@/store/actions';
import { DEMO_TODAY } from '@/data/fixtures';
import type { Appointment } from '@/data/types';
import { useT } from '@/i18n';
import {
  weekStartOf,
  filterByCenter,
  blankBooking,
  bookingValid,
  toAppointment,
  type BookingDraft,
} from './appointments-logic';

export function useAppointments() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(DEMO_TODAY);
  const [centerEn, setCenterEn] = useState('all');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [booking, setBooking] = useState<BookingDraft>(blankBooking);

  const visible = filterByCenter(state.appointments, centerEn);

  const cancel = (id: string) => {
    dispatch({
      type: 'appointment/setStatus',
      id,
      status: 'cancelled',
      activity: makeActivity('booked', { en: `${id} cancelled`, ar: `تم إلغاء الموعد ${id}` }),
    });
    setCancelOpen(false);
    setSelected(null);
    toast.success(t('apt.toast.cancelled'));
  };

  const book = () => {
    if (!bookingValid(booking)) return;
    const id = `apt-live-${state.appointments.length + 1}`;
    const apt = toAppointment(booking, id);
    dispatch({
      type: 'appointment/book',
      appointment: apt,
      activity: makeActivity('booked', {
        en: `Appointment ${id} booked`,
        ar: `تم حجز الموعد ${id}`,
      }),
    });
    setBookOpen(false);
    setBooking(blankBooking());
    toast.success(t('apt.toast.booked'));
  };

  return {
    weekStart: weekStartOf(selectedDate),
    view,
    setView,
    selectedDate,
    setSelectedDate,
    centerEn,
    setCenterEn,
    visible,
    selected,
    setSelected,
    cancelOpen,
    setCancelOpen,
    bookOpen,
    setBookOpen,
    booking,
    setBooking,
    cancel,
    book,
  };
}

export type AppointmentsController = ReturnType<typeof useAppointments>;
