const Star = ({ filled }) => (
  <svg className={`h-5 w-5 ${filled ? 'text-amber-400' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Read-only stars when `onChange` is omitted; clickable 1-5 picker when it is given.
const StarRating = ({ value = 0, onChange }) => {
  if (!onChange) {
    return (
      <span className="inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= Math.round(value)} />
        ))}
      </span>
    );
  }

  return (
    <span className="inline-flex" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="rounded transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Star filled={n <= value} />
        </button>
      ))}
    </span>
  );
};

export default StarRating;
