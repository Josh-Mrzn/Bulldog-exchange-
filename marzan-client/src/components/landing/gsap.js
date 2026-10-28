import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The Lenis instance owned by LandingPage; null when smooth scrolling is off (reduced motion).
let lenis = null;
export const setLenis = (instance) => {
  lenis = instance;
};

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const NAV_OFFSET = -72;

export const scrollToId = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: NAV_OFFSET });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET });
  }
};

export { gsap, ScrollTrigger, useGSAP };
