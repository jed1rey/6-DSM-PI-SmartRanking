import { useEffect } from 'react';

export function useBackground() {
  useEffect(() => {
    
    const img = new Image();
    img.src = '/background.png';
    
    img.onload = () => {
      console.log('Background image loaded successfully');
      document.body.style.backgroundImage = "url('/background.png')";
    };
    
    img.onerror = () => {
      console.warn('Background image not found, using fallback color');
      document.body.style.backgroundColor = '#f5f5f5';
    };

   
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

   
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundColor = '';
    };
  }, []);
}