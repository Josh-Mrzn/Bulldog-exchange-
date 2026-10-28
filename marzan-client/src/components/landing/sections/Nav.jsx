import { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/nubdexchange_logo.png';
import { gsap, prefersReducedMotion, scrollToId, ScrollTrigger, useGSAP } from '../gsap';

const links = [
  { label: 'Features', id: 'features' },
  { label: 'Up close', id: 'up-close' },
  { label: 'How it works', id: 'how-it-works' },
  { label: "What's in store", id: 'store' },
];

const goTo = (id) => (event) => {
  event.preventDefault();
  scrollToId(id);
};

const Nav = ({ signInPath }) => {
  const navRef = useRef(null);

  useGSAP(() => {
    const nav = navRef.current;
    ScrollTrigger.create({
      start: 20,
      end: 'max',
      onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
    });
    if (!prefersReducedMotion()) {
      gsap.from(nav, { yPercent: -100, opacity: 0, duration: 0.9, ease: 'power3.out' });
    }
  }, { scope: navRef });

  return (
    <header ref={navRef} className="bx-nav">
      <div className="bx-container bx-nav__inner">
        <a href="#top" onClick={goTo('top')} className="bx-nav__brand">
          <img src={logo} alt="" />
          <span>BulldogEx</span>
        </a>

        <nav aria-label="Landing page sections" className="bx-nav__links">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={goTo(link.id)}>
              {link.label}
            </a>
          ))}
        </nav>

        <Link to={signInPath} className="bx-btn bx-btn--primary bx-btn--sm">
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Nav;
