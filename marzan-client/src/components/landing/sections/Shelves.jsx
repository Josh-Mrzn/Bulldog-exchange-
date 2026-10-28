import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../gsap';

const pad = (value) => String(value).padStart(2, '0');

const Shelves = ({ products, shopPath }) => {
  const rootRef = useRef(null);
  const counterRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const viewport = root.querySelector('.bx-shelves__viewport');
    const track = root.querySelector('.bx-shelves__track');
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.bx-shelves__head > *', {
        y: 30,
        opacity: 0,
        filter: 'blur(8px)',
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.bx-shelves__head', start: 'top 85%' },
      });
    });

    // Wide screens: pin the section and slide the row of cards sideways.
    mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      viewport.classList.add('is-pinned');
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            counterRef.current.textContent = pad(Math.min(products.length, Math.floor(self.progress * products.length) + 1));
          },
        },
      });
      return () => viewport.classList.remove('is-pinned');
    });

    // Small screens: the cards stack and fade up one by one.
    mm.add('(max-width: 820px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.bx-product', root).forEach((card) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });
    });

    return () => mm.revert();
  }, { scope: rootRef, dependencies: [products], revertOnUpdate: true });

  return (
    <section id="store" ref={rootRef} className="bx-shelves">
      <div className="bx-container bx-shelves__head">
        <div>
          <p className="bx-eyebrow">What's in store</p>
          <h2 className="bx-h2">
            A look at the <em>shelves</em>
          </h2>
        </div>
        <p className="bx-sub">A few of the items you will find inside. Sign in to see prices, stock and the full catalog.</p>
        <p className="bx-shelves__counter" aria-hidden="true">
          <span ref={counterRef}>01</span> / {pad(products.length)}
        </p>
      </div>

      <div className="bx-shelves__viewport">
        <ul className="bx-shelves__track">
          {products.map((product) => (
            <li key={product._id} className="bx-product">
              <Link to={product.slug ? `${shopPath}/${product.slug}` : shopPath}>
                <span className="bx-product__photo">
                  <img src={product.image} alt={product.name} />
                </span>
                <span className="bx-product__info">
                  <span className="bx-product__category">{product.category}</span>
                  <span className="bx-product__name">{product.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Shelves;
