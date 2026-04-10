import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { SearchItemFields } from './index';

type SearchItemTitleProps = {
  text: SearchItemFields['subTitle'];
} & HTMLAttributes<HTMLHeadingElement>;

export const SearchItemSubTitle = ({ className, text, ...props }: SearchItemTitleProps) => {
  return (
    text && (
      <h3
        className={cn('text-base font-light text-gray-900 mb-3 line-clamp-2', className)}
        {...props}
      >
        {text.value}
      </h3>
    )
  );
};
