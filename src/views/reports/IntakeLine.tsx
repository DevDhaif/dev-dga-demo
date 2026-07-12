import { LineChart } from '@dev-dga/react';

export function IntakeLine({ data, label }: { data: number[]; label: string }) {
  return (
    <LineChart
      title={label}
      legend={false}
      height={220}
      series={[{ label, data }]}
      categories={data.map((_, i) => (i + 1).toLocaleString('en-US'))}
    />
  );
}
