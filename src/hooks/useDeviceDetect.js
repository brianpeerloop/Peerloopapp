import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting device type, OS, and browser
 * 
 * Returns an object with device information that updates on resize
 * 
 * Usage:
 *   const { isMobile, isIOS, isSafari, screenWidth } = useDeviceDetect();
 */
function useDeviceDetect() {
  const [deviceInfo, setDeviceInfo] = useState(() => getDeviceInfo());

  useEffect(() => {
    // Update on resize
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}

/**
 * Gather all device information
 */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // OS Detection
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isMac = /Macintosh/.test(ua);

  // Browser Detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edge|Edg/.test(ua);

  // Device Type (based on screen width)
  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  // Touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Specific combinations
  const isIOSSafari = isIOS && isSafari;
  const isIOSChrome = isIOS && isChrome;
  const isAndroidChrome = isAndroid && isChrome;

  // Standalone mode (PWA / added to home screen)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true;

  // Orientation
  const isPortrait = screenHeight > screenWidth;
  const isLandscape = screenWidth > screenHeight;

  return {
    // Screen
    screenWidth,
    screenHeight,
    isPortrait,
    isLandscape,

    // Device type
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,

    // Operating System
    isIOS,
    isAndroid,
    isWindows,
    isMac,

    // Browser
    isSafari,
    isChrome,
    isFirefox,
    isEdge,

    // Combinations
    isIOSSafari,
    isIOSChrome,
    isAndroidChrome,

    // PWA
    isStandalone,

    // Raw user agent (for debugging)
    userAgent: ua,

    // Friendly device name
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    os: isIOS ? 'iOS' : isAndroid ? 'Android' : isWindows ? 'Windows' : isMac ? 'Mac' : 'Unknown',
    browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isEdge ? 'Edge' : 'Unknown',
  };
}

export default useDeviceDetect;




















