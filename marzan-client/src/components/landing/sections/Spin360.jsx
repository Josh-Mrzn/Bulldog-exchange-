import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildTumbler, loadTumblerFonts } from './tumblerModel';
import { gsap, prefersReducedMotion, useGSAP } from '../gsap';

const callouts = [
  { label: 'Front', title: 'The Bulldogs script', text: 'Gold lettering across the front, framed by gold and white stripes.' },
  { label: 'Side', title: 'NU on both sides', text: 'The NU letters sit on each side, so it reads from any angle.' },
  { label: 'Back', title: 'Go Bulldogs!', text: 'National University and the school cheer wrap around the back.' },
  { label: 'In store', title: 'Ready at the campus store', text: 'Sign in to see the price and stock before you add it to your cart.' },
];

const RING = 2 * Math.PI * 52;

const Spin360 = () => {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const degreeRef = useRef(null);
  // Shared between the scroll trigger and the render loop without re-rendering React.
  // drag/pitch: how far the mouse has turned it; flingX/flingY: the spin it keeps after a quick release.
  const spin = useRef({ progress: 0, drag: 0, pitch: 0, flingX: 0, flingY: 0, dragging: false, angle: 0, tilt: 0 });

  useGSAP(() => {
    const root = rootRef.current;
    const calloutEls = root.querySelectorAll('.bx-callout');
    const dashEls = root.querySelectorAll('.bx-dash__fill');

    const update = (progress) => {
      spin.current.progress = progress;
      degreeRef.current.textContent = `${Math.round(progress * 360)}°`;
      ringRef.current.style.strokeDashoffset = RING * (1 - progress);
      const active = Math.min(3, Math.floor(progress * 4));
      calloutEls.forEach((el, index) => el.classList.toggle('is-active', index === active));
      dashEls.forEach((el, index) => {
        el.style.transform = `scaleX(${gsap.utils.clamp(0, 1, progress * 4 - index)})`;
      });
    };

    if (prefersReducedMotion()) {
      root.classList.add('is-static');
      spin.current.angle = Math.PI * 2;
      update(1);
      return;
    }

    update(0);
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => update(self.progress),
        },
      })
      .fromTo('.bx-spin__stage', { scale: 0.85 }, { scale: 1.05, ease: 'none', duration: 0.5 }, 0)
      .to('.bx-spin__stage', { scale: 0.95, ease: 'none', duration: 0.5 }, 0.5);
  }, { scope: rootRef });

  useEffect(() => {
    const host = stageRef.current;
    const state = spin.current;
    let disposed = false;
    let frame = 0;
    let tumbler = null;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04).texture;
    scene.environment = environment;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.6, 11);
    camera.lookAt(0, 0, 0);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 5, 6);
    const rim = new THREE.DirectionalLight(0xf5c400, 1.6);
    rim.position.set(-5, 2, -4);
    const fill = new THREE.DirectionalLight(0x4b5bd6, 1);
    fill.position.set(-6, -1, 4);
    scene.add(new THREE.AmbientLight(0xffffff, 0.45), key, rim, fill);

    loadTumblerFonts()
      .catch(() => {})
      .then(() => {
        if (disposed) return;
        tumbler = buildTumbler(renderer.capabilities.getMaxAnisotropy());
        scene.add(tumbler.group);
      });

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Scroll and the mouse set the target turn; the model eases toward it every frame.
    const FULL_TURN = Math.PI * 2;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!state.dragging) {
        state.drag += state.flingX;
        state.pitch += state.flingY;
        state.flingX *= 0.95;
        state.flingY *= 0.95;
        // Once the flip slows down, settle back upright on the nearest full turn.
        if (Math.abs(state.flingY) < 0.002) {
          state.pitch += (Math.round(state.pitch / FULL_TURN) * FULL_TURN - state.pitch) * 0.05;
        }
      }
      state.angle += (state.progress * FULL_TURN + state.drag - state.angle) * 0.08;
      state.tilt += (Math.sin(state.progress * Math.PI) * 0.22 + state.pitch - state.tilt) * 0.08;
      if (tumbler) {
        tumbler.group.rotation.y = state.angle;
        tumbler.group.rotation.x = state.tilt;
      }
      renderer.render(scene, camera);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) tick();
    });
    visibility.observe(host);

    // Dragging sideways turns it, dragging up or down flips it; a quick release keeps it spinning.
    const canFling = !prefersReducedMotion();
    let last = null;
    const onDown = (event) => {
      last = { x: event.clientX, y: event.clientY, time: performance.now() };
      state.dragging = true;
      state.flingX = 0;
      state.flingY = 0;
      host.setPointerCapture(event.pointerId);
    };
    const onMove = (event) => {
      if (!last) return;
      const dx = (event.clientX - last.x) * 0.012;
      const dy = (event.clientY - last.y) * 0.012;
      state.drag += dx;
      state.pitch += dy;
      state.flingX = dx;
      state.flingY = dy;
      last = { x: event.clientX, y: event.clientY, time: performance.now() };
    };
    const onUp = () => {
      // Holding still before letting go means no fling.
      if (!canFling || !last || performance.now() - last.time > 80) {
        state.flingX = 0;
        state.flingY = 0;
      }
      last = null;
      state.dragging = false;
    };
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointercancel', onUp);
      tumbler?.dispose();
      environment.dispose();
      room.dispose?.();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

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
          <p className="bx-spin__hint">Scroll to spin the Bulldogs tumbler, or grab it and drag in any direction to flip it around.</p>
          <div className="bx-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="bx-ring__track" cx="60" cy="60" r="52" />
              <circle ref={ringRef} className="bx-ring__value" cx="60" cy="60" r="52" strokeDasharray={RING} strokeDashoffset={RING} />
            </svg>
            <span ref={degreeRef} className="bx-ring__label">0°</span>
          </div>
        </div>

        <div
          ref={stageRef}
          className="bx-spin__stage"
          role="img"
          aria-label="3D model of the Bulldogs tumbler. Scroll or drag to turn it around."
        />

        <div className="bx-spin__details">
          <div className="bx-callouts">
            {callouts.map((callout) => (
              <article key={callout.label} className="bx-callout">
                <p className="bx-callout__label">{callout.label}</p>
                <h3>{callout.title}</h3>
                <p>{callout.text}</p>
              </article>
            ))}
          </div>
          <div className="bx-dashes" aria-hidden="true">
            {callouts.map((callout) => (
              <span key={callout.label} className="bx-dash">
                <span className="bx-dash__fill" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spin360;
