// Analytics utility for tracking user behavior
// Supports Plausible Analytics (privacy-first) and Google Analytics 4

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Track analytics event
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  const { event: eventName, properties } = event;

  // Plausible Analytics (privacy-first)
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Google Analytics 4 (fallback)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }
};

/**
 * Track page view
 */
export const trackPageView = (route: string): void => {
  trackEvent({
    event: 'page_view',
    properties: {
      route,
      timestamp: Date.now(),
    },
  });
};

/**
 * Track mental model viewed
 */
export const trackMentalModelViewed = (modelCode: string, modelName: string): void => {
  trackEvent({
    event: 'mental_model_viewed',
    properties: {
      model_code: modelCode,
      model_name: modelName,
    },
  });
};

/**
 * Track narrative viewed
 */
export const trackNarrativeViewed = (narrativeId: string, narrativeTitle: string): void => {
  trackEvent({
    event: 'narrative_viewed',
    properties: {
      narrative_id: narrativeId,
      narrative_title: narrativeTitle,
    },
  });
};

/**
 * Track search performed
 */
export const trackSearchPerformed = (query: string, resultsCount: number): void => {
  trackEvent({
    event: 'search_performed',
    properties: {
      query,
      results_count: resultsCount,
    },
  });
};

/**
 * Track filter applied
 */
export const trackFilterApplied = (filterType: string, filterValue: string): void => {
  trackEvent({
    event: 'filter_applied',
    properties: {
      filter_type: filterType,
      filter_value: filterValue,
    },
  });
};

/**
 * Track bookmark added
 */
export const trackBookmarkAdded = (itemType: 'mental_model' | 'narrative', itemId: string): void => {
  trackEvent({
    event: 'bookmark_added',
    properties: {
      item_type: itemType,
      item_id: itemId,
    },
  });
};

/**
 * Track bookmark removed
 */
export const trackBookmarkRemoved = (itemType: 'mental_model' | 'narrative', itemId: string): void => {
  trackEvent({
    event: 'bookmark_removed',
    properties: {
      item_type: itemType,
      item_id: itemId,
    },
  });
};

/**
 * Track note created
 */
export const trackNoteCreated = (itemType: 'mental_model' | 'narrative', itemId: string): void => {
  trackEvent({
    event: 'note_created',
    properties: {
      item_type: itemType,
      item_id: itemId,
    },
  });
};

/**
 * Track export triggered
 */
export const trackExportTriggered = (format: string, itemCount: number): void => {
  trackEvent({
    event: 'export_triggered',
    properties: {
      format,
      item_count: itemCount,
    },
  });
};

/**
 * Track modal opened
 */
export const trackModalOpened = (modalType: string): void => {
  trackEvent({
    event: 'modal_opened',
    properties: {
      modal_type: modalType,
    },
  });
};

/**
 * Track citation clicked
 */
export const trackCitationClicked = (citationType: string): void => {
  trackEvent({
    event: 'citation_clicked',
    properties: {
      citation_type: citationType,
    },
  });
};

/**
 * Track hero CTA clicked
 */
export const trackHeroCTAClicked = (ctaType: string): void => {
  trackEvent({
    event: 'hero_cta_clicked',
    properties: {
      cta_type: ctaType,
    },
  });
};

/**
 * Initialize analytics
 */
export const initAnalytics = (): void => {
  // Check if Plausible is available
  if (typeof window !== 'undefined' && window.plausible) {
    console.log('[Analytics] Plausible Analytics initialized');
  } else if (typeof window !== 'undefined' && window.gtag) {
    console.log('[Analytics] Google Analytics initialized');
  } else if (import.meta.env.DEV) {
    console.log('[Analytics] Running in development mode - events logged to console');
  }
};
