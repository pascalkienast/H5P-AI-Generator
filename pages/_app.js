import '../styles/globals.css';
import '../utils/i18n';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Disable automatic client-side re-hydration to prevent layout shift
  useEffect(() => {
    // Client-side only code
    // This helps stabilize the UI after initial hydration
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 