import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@dev-dga/react';
import { serviceVolumes } from '@/store/selectors';
import { serviceById } from '@/data/fixtures';
import type { ServiceRequest } from '@/data/types';
import { tField, useLang, useT } from '@/i18n';

export function VolumesTable({ requests }: { requests: ServiceRequest[] }) {
  const t = useT();
  const lang = useLang();
  const volumes = serviceVolumes(requests);
  const total = requests.length || 1;

  return (
    <Table aria-label={t('reports.volumes')}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('queue.col.service')}</TableHead>
          <TableHead align="end">{t('reports.count')}</TableHead>
          <TableHead align="end">{t('reports.share')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {volumes.map((v) => (
          <TableRow key={v.serviceId}>
            <TableCell>
              {tField(serviceById(v.serviceId)?.name ?? { en: v.serviceId, ar: v.serviceId }, lang)}
            </TableCell>
            <TableCell align="end">{v.count.toLocaleString('en-US')}</TableCell>
            <TableCell align="end">{((v.count / total) * 100).toFixed(1)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
