import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { SearchItemFields } from './index';

type SearchItemSummaryProps = {
  summary: SearchItemFields['summary'];
} & HTMLAttributes<HTMLParagraphElement>;

export const SearchItemSummary = ({ className, summary, ...props }: SearchItemSummaryProps) => {
  return (
    summary && (
      <p className={cn('text-gray-600 mb-4', className)} {...props}>
        {summary.value}
      </p>
    )
  );
};
