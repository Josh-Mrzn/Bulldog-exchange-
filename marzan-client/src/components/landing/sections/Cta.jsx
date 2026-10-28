import { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/nubdexchange_logo.png';
import Icon from '../Icon';
import { icons } from '../data';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

// Parallax speed for each floating thumbnail; bigger moves farther while scrolling.
const thumbSpeeds = [1.4, -1, 0.8, -1.6];

const Cta = ({ products, signInPath, signUpPath }) => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      '.bx-cta__card',
      { scale: 0.86, opacity: 0.4 },
      { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.bx-cta__card', start: 'top bottom', end: 'top 40%', scrub: 1 } },
    );

    gsap.utils.toArray('.bx-thumb', rootRef.current).forEach((thumb, index) => {
      const speed = thumbSpeeds[index % thumbSpeeds.length];
      gsap.fromTo(
        thumb,
        { y: speed * 70 },
        { y: speed * -70, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } },
      );
    });

    gsap.from('.bx-cta__logo', {
      y: -80,
      opacity: 0,
      duration: 1.1,
      ease: 'bounce.out',
      scrollTrigger: { trigger: '.bx-cta__card', start: 'top 70%' },
    });
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="bx-cta">
      <div className="bx-container bx-cta__wrap">
        {products.slice(0, 4).map((product, index) => (
          <div key={index} className={`bx-thumb bx-thumb--${index + 1}`} aria-hidden="true">
            <span className="bx-thumb__inner">
              <img src={product.image} alt="" />
            </span>
          </div>
        ))}

        <div className="bx-cta__card">
          <div className="bx-floor bx-floor--soft" aria-hidden="true">
            <div className="bx-floor__grid" />
          </div>
          <div className="bx-cta__glow" aria-hidden="true" />

          <div className="bx-cta__content">
            <img src={logo} alt="" className="bx-cta__logo" />
            <h2 className="bx-h2">
              Ready, <em>Bulldog?</em>
            </h2>
            <p className="bx-sub">Sign in to start shopping, or create an account in under a minute.</p>
            <div className="bx-actions bx-actions--center">
              <Link to={signInPath} className="bx-btn bx-btn--primary">
                Sign in
                <Icon path={icons.arrow} className="bx-btn__arrow" />
              </Link>
              <Link to={signUpPath} className="bx-btn bx-btn--gold">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
