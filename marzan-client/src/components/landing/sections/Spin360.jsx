import { useRef } from 'react';
import tumbler from '../../../assets/img/bulldogs-tumbler.png';
import lanyard from '../../../assets/img/nu-lanyard.png';
import tshirt from '../../../assets/img/nu-tshirt.png';
import hoodie from '../../../assets/img/nu-hoodie.png';
import { createMorph } from './particleMorph';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

// One product per line. `edge` colours the thin sides seen while it turns.
const products = [
  {
    label: 'Tumbler',
    image: tumbler,
    title: 'Bulldogs tumbler',
    text: 'A navy tumbler with the Bulldogs script and the mascot on the front.',
    edge: '#16296c',
  },
  {
    label: 'Lanyard',
    image: lanyard,
    title: 'Bulldogs lanyard',
    text: 'Navy and gold, with the Bulldog, the NU mark and a detachable buckle.',
    edge: '#10163a',
  },
  {
    label: 'T-shirt',
    image: tshirt,
    title: 'National University tee',
    text: 'A white tee with the varsity National University arch and the NU mark.',
    edge: '#c8c8c4',
  },
  {
    label: 'Hoodie',
    image: hoodie,
    title: 'NU zip hoodie',
    text: 'A navy zip-up hoodie with the NU patch on the chest and front pockets.',
    edge: '#10142c',
  },
];

const COUNT = products.length;
const RING = 2 * Math.PI * 52;
const MORPH = 0.34; // share of the scroll, centred on each hand-over, spent turning one product into the next
const DEPTH = 10; // how thick each product looks while it turns, in pixels
const LAYERS = 6;
const PHOTO_PAD = 6;
const clamp01 = gsap.utils.clamp(0, 1);
const pad = (value) => String(value).padStart(2, '0');

// The stretch of scroll (in product units) where product `index` is fully on show and spinning.
const showWindow = (index) => [index === 0 ? 0 : index + MORPH / 2, index === COUNT - 1 ? COUNT : index + 1 - MORPH / 2];

const Spin360 = () => {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const degreeRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.bx-showcase');
    const cards = gsap.utils.toArray('.bx-pcard', root);
    const flips = cards.map((card) => card.querySelector('.bx-pcard__flip'));
    const calloutEls = root.querySelectorAll('.bx-callout');
    const labelEls = root.querySelectorAll('.bx-dash__label');
    const dashEls = root.querySelectorAll('.bx-dash__fill');
    let active = 0;

    // Mouse spin and flip on top of the scroll turn; a quick release keeps it spinning, then it settles facing front.
    const turn = { yaw: 0, pitch: 0, vx: 0, vy: 0, dragging: false };
    const settle = (angle) => angle + (Math.round(angle / 360) * 360 - angle) * 0.06;

    const update = (progress) => {
      const position = progress * COUNT;
      const current = Math.min(COUNT - 1, Math.floor(position));
      if (current !== active) {
        gsap.set(flips[active], { rotateY: 0, rotateX: 0 });
        Object.assign(turn, { yaw: 0, pitch: 0, vx: 0, vy: 0 });
        active = current;
      }
      const [from, to] = showWindow(current);
      const spun = clamp01((position - from) / (to - from));
      degreeRef.current.textContent = `${Math.round(spun * 360)}°`;
      ringRef.current.style.strokeDashoffset = RING * (1 - spun);
      calloutEls.forEach((el, index) => el.classList.toggle('is-active', index === current));
      labelEls.forEach((el, index) => el.classList.toggle('is-active', index === current));
      dashEls.forEach((el, index) => {
        el.style.transform = `scaleX(${clamp01(position - index)})`;
      });
    };

    if (prefersReducedMotion()) {
      root.classList.add('is-static');
      update(1);
      return undefined;
    }

    // Particle canvas for the hand-overs, matched to where the photos sit on screen.
    const canvas = root.querySelector('.bx-showcase__particles');
    const morph = createMorph(canvas);
    const images = products.map((product) => {
      const image = new Image();
      image.src = product.image;
      return image;
    });
    const photoBox = () => {
      const width = cards[0].offsetWidth;
      const height = cards[0].offsetHeight;
      return {
        x: stage.clientWidth / 2 - width / 2 + PHOTO_PAD,
        y: stage.clientHeight * 0.46 - height / 2 + PHOTO_PAD,
        width: width - PHOTO_PAD * 2,
        height: height - PHOTO_PAD * 2,
      };
    };
    const resizeObserver = new ResizeObserver(() => morph.resize(stage.clientWidth, stage.clientHeight));
    resizeObserver.observe(stage);

    // GSAP owns the centring (xPercent/yPercent -50); a CSS translate would be folded into it.
    gsap.set(cards, { xPercent: -50, yPercent: -50, rotateY: 0, transformPerspective: 1400 });
    gsap.set(cards.slice(1), { autoAlpha: 0 });
    const glow = root.querySelector('.bx-showcase__glow');

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: `+=${COUNT * 100}%`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => update(self.progress),
      },
    });

    cards.forEach((card, index) => {
      // One full turn while the product is on show; it is facing front again when the hand-over starts.
      const [from, to] = showWindow(index);
      timeline.fromTo(card, { rotateY: 0 }, { rotateY: 360, duration: to - from - 0.04, immediateRender: false }, from + 0.02);

      if (index < COUNT - 1) {
        const start = index + 1 - MORPH / 2;
        const handOver = { t: 0 };
        timeline
          .to(handOver, {
            t: 1,
            duration: MORPH,
            onUpdate: () => morph.draw(index, images[index], images[index + 1], photoBox(), handOver.t),
          }, start)
          // The real photos hand over to the particles at the start and take back over at the end.
          .to(card, { autoAlpha: 0, duration: MORPH * 0.14 }, start + MORPH * 0.04)
          .to(cards[index + 1], { autoAlpha: 1, duration: MORPH * 0.14 }, start + MORPH * 0.82)
          .fromTo(glow, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1.15, duration: MORPH * 0.4, immediateRender: false }, start + MORPH * 0.1)
          .to(glow, { autoAlpha: 0, scale: 0.6, duration: MORPH * 0.4 }, start + MORPH * 0.5);
      }
    });
    update(0);

    const spinLoop = () => {
      if (!turn.dragging) {
        turn.yaw += turn.vx;
        turn.pitch += turn.vy;
        turn.vx *= 0.94;
        turn.vy *= 0.94;
        if (Math.abs(turn.vx) < 0.05 && Math.abs(turn.vy) < 0.05) {
          turn.yaw = settle(turn.yaw);
          turn.pitch = settle(turn.pitch);
        }
      }
      gsap.set(flips[active], { rotateY: turn.yaw, rotateX: turn.pitch });
    };
    gsap.ticker.add(spinLoop);

    let last = null;
    const onDown = (event) => {
      last = { x: event.clientX, y: event.clientY, time: performance.now() };
      Object.assign(turn, { dragging: true, vx: 0, vy: 0 });
      stage.setPointerCapture(event.pointerId);
    };
    const onMove = (event) => {
      if (!last) return;
      const dx = (event.clientX - last.x) * 0.6;
      const dy = -(event.clientY - last.y) * 0.6;
      turn.yaw += dx;
      turn.pitch += dy;
      turn.vx = dx;
      turn.vy = dy;
      last = { x: event.clientX, y: event.clientY, time: performance.now() };
    };
    const onUp = () => {
      // Holding still before letting go means no fling.
      if (!last || performance.now() - last.time > 80) {
        turn.vx = 0;
        turn.vy = 0;
      }
      last = null;
      turn.dragging = false;
    };
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);

    return () => {
      gsap.ticker.remove(spinLoop);
      resizeObserver.disconnect();
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
    };
  }, { scope: rootRef });

  return (
    <section id="up-close" ref={rootRef} className="bx-spin">
      <div className="bx-floor bx-floor--gold" aria-hidden="true">
        <div className="bx-floor__grid" />
      </div>

      <div className="bx-container bx-spin__inner">
        <div className="bx-spin__intro">
          <p className="bx-pill bx-pill--dark">Up close</p>
          <h2 className="bx-h2">
            Turn it around <em>before you buy</em>
          </h2>
          <p className="bx-spin__hint">
            Scroll to spin each favorite all the way around, or grab it and drag in any direction to flip it.
          </p>
          <div className="bx-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="bx-ring__track" cx="60" cy="60" r="52" />
              <circle ref={ringRef} className="bx-ring__value" cx="60" cy="60" r="52" strokeDasharray={RING} strokeDashoffset={RING} />
            </svg>
            <span ref={degreeRef} className="bx-ring__label">0°</span>
          </div>
        </div>

        <div className="bx-showcase">
          <div className="bx-showcase__spot" aria-hidden="true" />
          <div className="bx-showcase__glow" aria-hidden="true" />
          <div className="bx-showcase__shadow" aria-hidden="true" />
          {products.map((product) => {
            const mask = { WebkitMaskImage: `url(${product.image})`, maskImage: `url(${product.image})` };
            return (
              <div key={product.label} className="bx-pcard">
                <div className="bx-pcard__flip">
                  {/* The photo again on the back, turned round so it reads the right way when the product faces away.
                      Back first, then the sides, then the front, so a flat (reduced-motion) layout shows the front on top. */}
                  <img
                    src={product.image}
                    alt=""
                    draggable="false"
                    className="bx-pcard__layer bx-pcard__photo bx-pcard__back"
                    style={{ transform: `rotateY(180deg) translateZ(${DEPTH / 2}px)` }}
                    aria-hidden="true"
                  />
                  {Array.from({ length: LAYERS }, (_, layer) => (
                    <span
                      key={layer}
                      className="bx-pcard__layer bx-pcard__edge"
                      style={{ ...mask, background: product.edge, transform: `translateZ(${DEPTH / 2 - ((layer + 1) * DEPTH) / (LAYERS + 1)}px)` }}
                      aria-hidden="true"
                    />
                  ))}
                  <img
                    src={product.image}
                    alt={product.title}
                    draggable="false"
                    className="bx-pcard__layer bx-pcard__photo"
                    style={{ transform: `translateZ(${DEPTH / 2}px)` }}
                  />
                </div>
              </div>
            );
          })}
          <canvas className="bx-showcase__particles" aria-hidden="true" />
        </div>

        <div className="bx-spin__details">
          <div className="bx-callouts">
            {products.map((product, index) => (
              <article key={product.label} className="bx-callout">
                <p className="bx-callout__label">
                  {pad(index + 1)} · {product.label}
                </p>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
              </article>
            ))}
          </div>
          <ol className="bx-dashes" aria-hidden="true">
            {products.map((product) => (
              <li key={product.label}>
                <span className="bx-dash">
                  <span className="bx-dash__fill" />
                </span>
                <span className="bx-dash__label">{product.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Spin360;
