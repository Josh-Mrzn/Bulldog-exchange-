import { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/nubdexchange_logo.png';
import Icon from '../Icon';
import { icons } from '../data';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

const Hero = ({ shopPath, signUpPath }) => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.bx-hero__logo-wrap', { scale: 0.6, rotateY: -40, opacity: 0, transformPerspective: 900, duration: 1.4 }, 0.1)
      .from('.bx-line__in', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.2)
      .from(['.bx-pill', '.bx-hero__lead', '.bx-actions'], { y: 24, opacity: 0, filter: 'blur(8px)', duration: 0.8, stagger: 0.12 }, 0.45)
      .fromTo('.bx-underline', { '--u': 0 }, { '--u': 1, duration: 0.8, ease: 'power2.inOut' }, 0.9);

    gsap.timeline({
      scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
    })
      .to('.bx-hero__text', { y: -140, opacity: 0, filter: 'blur(10px)', ease: 'none' }, 0)
      .to('.bx-hero__visual', { y: 140, scale: 0.82, rotate: -6, ease: 'none' }, 0)
      .to('.bx-floor', { scaleY: 0.3, opacity: 0, ease: 'none' }, 0);

    // Mouse tilt: desktop pointers only.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 821px) and (hover: hover) and (pointer: fine)', () => {
      const tilt = rootRef.current.querySelector('.bx-hero__tilt');
      gsap.set(tilt, { transformPerspective: 900 });
      const rotX = gsap.quickTo(tilt, 'rotateX', { duration: 0.8, ease: 'power3.out' });
      const rotY = gsap.quickTo(tilt, 'rotateY', { duration: 0.8, ease: 'power3.out' });

      const onMove = (event) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        rotY(nx * 36);
        rotX(-ny * 36);
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    });
    return () => mm.revert();
  }, { scope: rootRef });

  return (
    <section id="top" ref={rootRef} className="bx-hero">
      <div className="bx-hero__bg" aria-hidden="true">
        <div className="bx-floor">
          <div className="bx-floor__grid" />
        </div>
        <div className="bx-glow bx-glow--blue" />
        <div className="bx-glow bx-glow--gold" />
      </div>

      <div className="bx-container bx-hero__inner">
        <div className="bx-hero__text">
          <p className="bx-pill">
            <span className="bx-pill__dot" />
            National University campus store
          </p>

          <h1 className="bx-hero__title">
            <span className="bx-line"><span className="bx-line__in">Campus gear,</span></span>
            <span className="bx-line"><span className="bx-line__in bx-accent">made for every</span></span>
            <span className="bx-line"><span className="bx-line__in bx-accent"><span className="bx-underline">Bulldog.</span></span></span>
          </h1>

          <p className="bx-hero__lead">
            BulldogEx brings NU apparel, school supplies and everyday essentials into one shop, with clear prices,
            simple checkout and orders you can follow until they reach you.
          </p>

          <div className="bx-actions">
            <Link to={shopPath} className="bx-btn bx-btn--primary">
              Start shopping
              <Icon path={icons.arrow} className="bx-btn__arrow" />
            </Link>
            <Link to={signUpPath} className="bx-btn bx-btn--ghost">
              Create an account
            </Link>
          </div>
        </div>

        <div className="bx-hero__visual">
          <div className="bx-hero__logo-wrap">
            <div className="bx-hero__tilt">
              <img src={logo} alt="NU Bulldogs Exchange logo" className="bx-hero__logo" />
            </div>
          </div>
          <div className="bx-hero__shadow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
