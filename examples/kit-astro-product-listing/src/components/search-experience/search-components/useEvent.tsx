import { useCallback } from 'react';

/**
 * This hook is used to send events to SitecoreCloud.
 * Adapted from the Next.js version - uses the @sitecore-content-sdk/events package.
 */
export const useEvent = ({
  query,
  uid,
  isEditing,
  isPreview,
  siteName,
  routeName,
  routeLanguage,
}: {
  query: string;
  uid?: string;
  isEditing: boolean;
  isPreview: boolean;
  siteName: string;
  routeName?: string;
  routeLanguage?: string;
}) => {
  const sendEvent = useCallback(
    async (type: 'clicked' | 'viewed') => {
      if (isEditing || isPreview) return;

      // Dynamically import to avoid SSR issues
      try {
        const { event } = await import('@sitecore-content-sdk/events');
        event({
          type: 'search',
          siteId: siteName,
          channel: 'web',
          name: routeName,
          language: routeLanguage,
          core: {
            componentId: uid ?? '',
            interactionType: type,
            keyword: query ?? '',
            nullResults: false,
          },
        });
      } catch {
        // Cloud SDK events may not be available in all environments
      }
    },
    [uid, query, isEditing, isPreview, siteName, routeName, routeLanguage]
  );

  return sendEvent;
};
