import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SearchItemCategoryProps = {
  category: { value: string } | undefined;
} & HTMLAttributes<HTMLDivElement>;

export const SearchItemCategory = ({ category, className, ...props }: SearchItemCategoryProps) => {
  return (
    category && (
      <div className={cn('flex flex-wrap gap-2 mb-4', className)} {...props}>
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
          {category.value}
        </span>
      </div>
    )
  );
};
