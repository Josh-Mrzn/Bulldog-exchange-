import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

// Words wrapped in *asterisks* render as italic royal blue accents.
const statement =
  'One campus store for *every* *Bulldog,* with prices you can *see* before checkout, payment the *way* *you* *like,* and an order you can *follow* from the shelf to your door.';

const words = statement.split(' ').map((word) => ({
  text: word.replaceAll('*', ''),
  accent: word.startsWith('*'),
}));

const Statement = () => {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      '.bx-word',
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '.bx-statement__text', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
      },
    );
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="bx-statement">
      <div className="bx-container">
        <p className="bx-statement__text">
          {words.map((word, index) => (
            <span key={index}>
              {word.accent ? <em className="bx-word">{word.text}</em> : <span className="bx-word">{word.text}</span>}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Statement;
