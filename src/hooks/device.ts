import { useEffect, useState } from 'react';

export const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return width;
};

export const DEVICE_WIDTH_BOUNDARY = 1152;
export const useDevice = () => {
  const width = useWindowWidth();

  return width >= DEVICE_WIDTH_BOUNDARY ? 'desktop' : 'mobile';
};
