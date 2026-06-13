import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@dev-dga/react';
import { useT, type I18nKey } from '@/i18n';

const PARAGRAPHS: I18nKey[] = ['help.termsP1', 'help.termsP2', 'help.termsP3', 'help.termsP4'];

export function TermsModal() {
  const t = useT();
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline" size="sm">
          {t('help.terms')}
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('help.termsTitle')}</ModalTitle>
          <ModalDescription>{t('help.termsIntro')}</ModalDescription>
        </ModalHeader>
        <ModalBody data-testid="terms-body">
          {PARAGRAPHS.map((key) => (
            <div key={key} className="flex flex-col gap-3">
              <p>{t(key)}</p>
              <p>{t(key)}</p>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="primary">{t('common.close')}</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
