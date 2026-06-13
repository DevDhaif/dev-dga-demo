import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  Button,
} from '@dev-dga/react';
import { useT } from '@/i18n';

interface Props {
  open: boolean;
  count: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RejectModal({ open, count, onOpenChange, onConfirm }: Props) {
  const t = useT();
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('queue.confirmReject.title')}</ModalTitle>
          <ModalDescription>{t('queue.confirmReject.body', { count })}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">{t('common.cancel')}</Button>
          </ModalClose>
          <Button variant="destructive" onClick={onConfirm}>
            {t('queue.actions.reject')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
