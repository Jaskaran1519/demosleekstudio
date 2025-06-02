"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

/**
 * Hook to preload data from specified endpoints
 * @param endpoints Array of API endpoints to preload
 * @param options Additional options
 * @returns Object containing loading state and any errors
 */
export function usePreloadData(
  endpoints: string[],
  options: {
    enabled?: boolean;
    delay?: number;
    onSuccess?: (data: Record<string, any>) => void;
  } = {}
) {
  const { enabled = true, delay = 1000, onSuccess } = options;
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadErrors, setPreloadErrors] = useState<Record<string, Error>>({});
  const [preloadedData, setPreloadedData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!enabled) return;

    // Delay preloading to ensure it doesn't compete with critical resources
    const timer = setTimeout(() => {
      setIsPreloading(true);
      
      // Preload all endpoints
      // Define proper types for our results
      type SuccessResult = { endpoint: string; data: any; success: true };
      type ErrorResult = { endpoint: string; error: Error; success: false };
      type PreloadResult = SuccessResult | ErrorResult;
      
      const preloadPromises = endpoints.map(endpoint => 
        fetcher(endpoint)
          .then(data => ({ endpoint, data, success: true } as SuccessResult))
          .catch(error => ({ endpoint, error, success: false } as ErrorResult))
      );
      
      Promise.all(preloadPromises).then(results => {
        const errors: Record<string, Error> = {};
        const data: Record<string, any> = {};
        
        results.forEach((result: PreloadResult) => {
          if (result.success) {
            data[result.endpoint] = result.data;
          } else {
            errors[result.endpoint] = result.error;
          }
        });
        
        setPreloadedData(data);
        setPreloadErrors(errors);
        setIsPreloading(false);
        
        if (Object.keys(data).length > 0 && onSuccess) {
          onSuccess(data);
        }
      });
    }, delay);
    
    return () => clearTimeout(timer);
  }, [enabled, delay, onSuccess]);

  return {
    isPreloading,
    preloadErrors,
    preloadedData
  };
}

/**
 * Hook specifically for preloading products data
 */
export function usePreloadProducts(options: {
  enabled?: boolean;
  delay?: number;
} = {}) {
  return usePreloadData(
    [
      '/api/products?page=1&limit=12',
      '/api/products/metadata'
    ],
    options
  );
}
