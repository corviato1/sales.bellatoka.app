import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const IS_PROD = import.meta.env.PROD;

function shouldTrack(path) {
  return !path.startsWith('/admin');
}

export function trackPageView(path) {
  if (!IS_PROD || !shouldTrack(path)) {
    if (!IS_PROD) console.log('[Analytics] Page view:', path);
    return;
  }

  const payload = JSON.stringify({
    action: 'pageview',
    path,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent
  });

  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    }).catch(() => {});
  } catch {
  }
}

export function trackListingView(listingId, listingAddress, listingCity, timeSpentSeconds) {
  if (!IS_PROD) {
    console.log('[Analytics] Listing view:', { listingId, listingAddress, listingCity, timeSpentSeconds });
    return;
  }

  const payload = JSON.stringify({
    action: 'listing_view',
    listingId,
    listingAddress,
    listingCity,
    timeSpent: timeSpentSeconds
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      '/api/analytics',
      new Blob([payload], { type: 'application/json' })
    );
  } else {
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    } catch {
    }
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
}

export function useListingTracking(listingId, listingAddress, listingCity) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!listingId) return;
    startTime.current = Date.now();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent >= 2) {
        trackListingView(listingId, listingAddress, listingCity, timeSpent);
      }
    };
  }, [listingId, listingAddress, listingCity]);
}
