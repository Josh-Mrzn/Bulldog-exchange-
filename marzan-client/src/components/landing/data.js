import hoodie from '../../assets/img/hoddie.png';
import tumbler from '../../assets/img/tumbler.png';
import notebook from '../../assets/img/notebook.png';
import lanyard from '../../assets/img/lanyard.png';
import totebag from '../../assets/img/totebag.png';
import exampack from '../../assets/img/exampack.png';

// Shown until (or instead of, if the API fails) real products arrive.
export const sampleProducts = [
  { _id: 'sample-hoodie', name: 'Bulldogs hoodie', category: 'Apparel', image: hoodie },
  { _id: 'sample-tumbler', name: 'Bulldogs tumbler', category: 'Essentials', image: tumbler },
  { _id: 'sample-notebook', name: 'Spiral notebook', category: 'Stationery', image: notebook },
  { _id: 'sample-lanyard', name: 'NU lanyard', category: 'Accessories', image: lanyard },
  { _id: 'sample-totebag', name: 'Campus tote bag', category: 'Bags', image: totebag },
  { _id: 'sample-exampack', name: 'Exam survival kit', category: 'Study', image: exampack },
];

export const icons = {
  campus: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  truck: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  cancel: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  check: 'M5 13l4 4L19 7',
  arrow: 'M17 8l4 4m0 0l-4 4m4-4H3',
};
