'use client';

import { useEffect } from 'react';
import { useFetch } from '../helper/hooks';
import { fetchPublicSettings } from '../helper/backend';

const DynamicFavicon = () => {
  const [data, getData] = useFetch(fetchPublicSettings);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data?.fav_icon) {
      const link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement('link');
      link.rel = 'icon';
      link.href = data?.fav_icon; 
      document.head.appendChild(link);
    }
  }, [data]);

  return null; 
};

export default DynamicFavicon;
