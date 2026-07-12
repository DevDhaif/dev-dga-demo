import type { ReactNode } from 'react';

interface RowListProps extends React.ComponentProps<'ul'> {
  divided?: boolean;
}

export function RowList({ divided = false, className, ...props }: RowListProps) {
  return (
    <ul
      className={`m-0 flex list-none flex-col p-0 ${divided ? 'divide-y divide-(--ddga-color-border)' : 'gap-1'} ${className ?? ''}`}
      {...props}
    />
  );
}

interface RowItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  icon?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  trailing?: ReactNode;
}

export function RowItem({ icon, primary, secondary, trailing, className, ...props }: RowItemProps) {
  return (
    <li className={`flex items-center gap-3 py-2 ${className ?? ''}`} {...props}>
      {icon != null && (
        <span className="flex shrink-0 text-(--ddga-color-muted-foreground)" aria-hidden>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div>{primary}</div>
        {secondary != null && (
          <div className="text-sm text-(--ddga-color-muted-foreground)">{secondary}</div>
        )}
      </div>
      {trailing != null && <div className="shrink-0">{trailing}</div>}
    </li>
  );
}
