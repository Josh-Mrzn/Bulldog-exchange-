import { useRef } from 'react';
import Icon from '../Icon';
import { icons } from '../data';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

const trackerSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const paymentChips = ['Cash on delivery', 'GCash', 'Card'];

const Card = ({ icon, title, text, className = '', children }) => (
  <article className={`bx-card ${className}`}>
    <span className="bx-card__icon">
      <Icon path={icon} />
    </span>
    <h3>{title}</h3>
    <p>{text}</p>
    {children}
  </article>
);

const Features = () => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from('.bx-features__head > *', {
      y: 30,
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.bx-features__head', start: 'top 85%' },
    });

    gsap.utils.toArray('.bx-card', rootRef.current).forEach((card) => {
      gsap.fromTo(
        card,
        { y: 120, rotateX: 18, opacity: 0, transformPerspective: 1000, transformOrigin: '50% 0%' },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 70%', scrub: 1 },
        },
      );
    });

    // Order tracker: the bar fills and each step turns gold in turn.
    const tracker = gsap.timeline({
      scrollTrigger: { trigger: '.bx-tracker', start: 'top 80%', end: 'bottom 40%', scrub: 1 },
    });
    tracker.fromTo('.bx-tracker__fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 3 }, 0);
    gsap.utils.toArray('.bx-tracker__on', rootRef.current).forEach((dot, index) => {
      tracker.fromTo(dot, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3 }, index);
    });
  }, { scope: rootRef });

  return (
    <section id="features" ref={rootRef} className="bx-features">
      <div className="bx-container">
        <div className="bx-features__head">
          <p className="bx-pill">Why BulldogEx</p>
          <h2 className="bx-h2">
            Built for campus life,
            <br />
            <em>simple from cart to door</em>
          </h2>
          <p className="bx-sub">Everything a student order needs, from the price on the tag to the rating after it arrives.</p>
        </div>

        <div className="bx-bento">
          <Card
            icon={icons.truck}
            title="Follow your order"
            text="Every order gets its own page, so you always know where it is."
            className="bx-card--wide bx-card--tracker"
          >
            <div className="bx-tracker">
              <span className="bx-tracker__bar" aria-hidden="true">
                <span className="bx-tracker__fill" />
              </span>
              <ol>
                {trackerSteps.map((step) => (
                  <li key={step} className="bx-tracker__step">
                    <span className="bx-tracker__dot">
                      <span className="bx-tracker__on">
                        <Icon path={icons.check} />
                      </span>
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          <Card
            icon={icons.tag}
            title="Clear prices and stock"
            text="Every product shows its price and how many are left before you add it to your cart."
          />

          <Card
            icon={icons.campus}
            title="Straight from the campus store"
            text="Apparel, school supplies and daily essentials sold by the store itself, not resellers."
          />

          <Card
            icon={icons.card}
            title="Pay your way"
            text="Choose how you pay at checkout, whichever works for you."
            className="bx-card--wide"
          >
            <ul className="bx-chips">
              {paymentChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </Card>

          <Card
            icon={icons.cancel}
            title="Changed your mind?"
            text="Cancel an order yourself while it is still pending, no need to message anyone."
          />

          <Card
            icon={icons.star}
            title="Honest ratings"
            text="Only shoppers who received the item can rate it, so the stars actually mean something."
            className="bx-card--wide-lg"
          >
            <div className="bx-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Icon key={index} path={icons.star} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
