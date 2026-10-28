import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, prefersReducedMotion, ScrollTrigger, setLenis } from './gsap';
import { sampleProducts } from './data';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Perks from './sections/Perks';
import Statement from './sections/Statement';
import Features from './sections/Features';
import Spin360 from './sections/Spin360';
import HowToShop from './sections/HowToShop';
import Shelves from './sections/Shelves';
import Cta from './sections/Cta';
import Footer from './sections/Footer';
import './landing.css';

const LandingPage = ({ products, signInPath = '/auth/signin', signUpPath = '/auth/signup', shopPath = '/products' }) => {
  const items = products?.length ? products : sampleProducts;

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step with it.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.1 });
    const raf = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  // Pins change the page height, so measure again once everything (fonts, images) has loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const frame = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    document.fonts.ready.then(refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', refresh);
    };
  }, []);

  // The shelf pin is rebuilt when real products replace the samples; put the triggers back in page order.
  useEffect(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, [items]);

  return (
    <div className="bx-landing">
      <Nav signInPath={signInPath} />
      <main>
        <Hero products={items} shopPath={shopPath} signUpPath={signUpPath} />
        <Perks />
        <Statement />
        <Features />
        <Spin360 />
        <HowToShop signUpPath={signUpPath} />
        <Shelves products={items} shopPath={shopPath} />
        <Cta products={items} signInPath={signInPath} signUpPath={signUpPath} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
