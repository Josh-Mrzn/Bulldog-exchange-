import { useRef } from 'react';
import Icon from '../Icon';
import { icons } from '../data';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

const perks = [
  { icon: icons.campus, title: 'NU campus store', text: 'Gear made for Bulldogs' },
  { icon: icons.card, title: 'Pay your way', text: 'Cash, GCash or card' },
  { icon: icons.truck, title: 'Tracked orders', text: 'From pending to delivered' },
  { icon: icons.star, title: 'Real reviews', text: 'Only from actual buyers' },
];

const Perks = () => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.bx-perk', {
      y: 40,
      opacity: 0,
      filter: 'blur(6px)',
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: rootRef.current, start: 'top bottom' },
    });
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="bx-perks" aria-label="Store highlights">
      <div className="bx-container">
        <ul className="bx-perks__bar">
          {perks.map((perk) => (
            <li key={perk.title} className="bx-perk">
              <span className="bx-perk__icon">
                <Icon path={perk.icon} />
              </span>
              <span>
                <strong>{perk.title}</strong>
                <small>{perk.text}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Perks;
