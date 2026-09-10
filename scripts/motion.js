const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function motionAllowed() {
  return !window.matchMedia(REDUCED_MOTION).matches;
}

export async function loadMotion() {
  if (!motionAllowed()) return null;
  return import('./vendor/anime.esm.min.js');
}

export function whenVisible(element, callback) {
  if (!motionAllowed() || !('IntersectionObserver' in window)) {
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, { rootMargin: '0px 0px -10%', threshold: 0.15 });
  observer.observe(element);
  return () => observer.disconnect();
}
