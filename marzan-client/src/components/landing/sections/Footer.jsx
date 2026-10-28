import logo from '../../../assets/img/nubdexchange_logo.png';

const Footer = () => (
  <footer className="bx-footer">
    <div className="bx-container bx-footer__inner">
      <div className="bx-footer__brand">
        <img src={logo} alt="" />
        <div>
          <p className="bx-footer__name">BulldogEx Shop</p>
          <p>National University campus store</p>
        </div>
      </div>
      <p>&copy; {new Date().getFullYear()} Bulldogs Exchange. Go Bulldogs!</p>
    </div>
  </footer>
);

export default Footer;
