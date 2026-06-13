import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
  Button,
  FileUpload,
  Progress,
  CircularProgress,
  Spinner,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import type { DocumentsController } from './use-documents';

export function UploadModal({ d }: { d: DocumentsController }) {
  const t = useT();
  const uploading = d.progress !== null;

  return (
    <Modal open={d.uploadOpen} onOpenChange={(o) => !uploading && d.setUploadOpen(o)}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('docs.uploadTitle')}</ModalTitle>
        </ModalHeader>
        <div className="flex flex-col gap-3 py-2">
          <FileUpload
            label={t('docs.upload')}
            files={d.files}
            onFilesAdded={d.onFilesAdded}
            onRemove={d.onRemoveFile}
            multiple
          />
          {uploading && (
            <div className="flex items-center gap-3" data-testid="upload-progress">
              <Spinner size="sm" aria-label={t('docs.uploading')} />
              <div className="flex-1">
                <Progress value={d.progress ?? 0} aria-label={t('docs.uploading')} />
              </div>
              <CircularProgress
                value={d.progress ?? 0}
                size="sm"
                aria-label={t('docs.uploading')}
              />
            </div>
          )}
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost" disabled={uploading}>
              {t('common.cancel')}
            </Button>
          </ModalClose>
          <Button
            variant="primary"
            onClick={d.startUpload}
            disabled={d.files.length === 0 || uploading}
          >
            {t('docs.upload')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
