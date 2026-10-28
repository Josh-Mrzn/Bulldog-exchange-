import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { icons } from '../data';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

const steps = [
  { title: 'Create your account', text: 'Sign up with your email and you are signed in right away.' },
  { title: 'Browse the catalog', text: 'Filter by category, search by name and open any product for details.' },
  { title: 'Check out', text: 'Add items to your cart, enter your address and pick how you will pay.' },
  { title: 'Track and rate', text: 'Follow the order until it arrives, then leave a rating for what you bought.' },
];

const HowToShop = ({ signUpPath }) => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      '.bx-how__card',
      { rotateX: 30, scale: 0.84, opacity: 0.35, transformPerspective: 1400, transformOrigin: '50% 0%' },
      {
        rotateX: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.bx-how__card', start: 'top bottom', end: 'top 20%', scrub: 1 },
      },
    );

    // The gold line draws down; each step wakes up as the line reaches it.
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: '.bx-timeline', start: 'top 75%', end: 'bottom 50%', scrub: 1 },
    });
    timeline.fromTo('.bx-timeline__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: steps.length - 1 }, 0);
    gsap.utils.toArray('.bx-step', rootRef.current).forEach((step, index) => {
      timeline
        .fromTo(step.querySelector('.bx-step__num'), { scale: 0.6 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' }, index)
        .fromTo(step.querySelector('.bx-step__glow'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, index)
        .fromTo(step.querySelector('.bx-step__body'), { opacity: 0.35 }, { opacity: 1, duration: 0.25 }, index);
    });
  }, { scope: rootRef });

  return (
    <section id="how-it-works" ref={rootRef} className="bx-how">
      <div className="bx-container">
        <div className="bx-how__card">
          <div className="bx-how__intro">
            <p className="bx-eyebrow">Getting started</p>
            <h2 className="bx-h2">
              How to shop
              <br />
              <em>at BulldogEx</em>
            </h2>
            <p>One path from sign up to delivery. Follow the four steps, then start shopping.</p>
            <Link to={signUpPath} className="bx-btn bx-btn--light">
              Create an account
              <Icon path={icons.arrow} className="bx-btn__arrow" />
            </Link>
          </div>

          <div className="bx-timeline">
            <span className="bx-timeline__track" aria-hidden="true">
              <span className="bx-timeline__fill" />
            </span>
            <ol>
              {steps.map((step, index) => (
                <li key={step.title} className="bx-step">
                  <span className="bx-step__num">
                    <span className="bx-step__glow" aria-hidden="true" />
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="bx-step__body">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToShop;
