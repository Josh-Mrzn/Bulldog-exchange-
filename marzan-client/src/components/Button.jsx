import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  brand: 'bg-blue-600 text-white hover:bg-blue-700',
  soft: 'bg-slate-50 text-slate-900 hover:bg-slate-100',
};

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'secondary',
  className = '',
  onClick,
  disabled = false,
}) => {
  const classes = [
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant] ?? variantClasses.secondary,
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
