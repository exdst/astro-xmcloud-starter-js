import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { SearchItemFields } from './index';
import type { SearchDictionary } from '../models';

type SearchItemLinkProps = {
  link: SearchItemFields['title'];
  onClick: () => void;
  dictionary?: SearchDictionary;
} & HTMLAttributes<HTMLAnchorElement>;

export const SearchItemLink = ({
  className,
  link,
  onClick,
  dictionary,
  ...props
}: SearchItemLinkProps) => {
  return (
    link && (
      <a
        href={link.value}
        className={cn(
          'inline-flex items-center text-primary hover:text-primary-hover font-medium',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {dictionary?.readMore || 'Read More'}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    )
  );
};
