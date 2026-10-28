// Turns one product photo into the next: every visible pixel of the first photo becomes a particle
// that swirls over to a pixel of the second, changing colour on the way.
const STEP = 2; // sample every second pixel; with 2×2 dots the photo stays solid before and after the morph
const WAVE = 0.45; // how far behind the top the bottom rows start moving, as a share of the morph
const ALPHA_MIN = 140;

// The photo's visible pixels, placed where the photo sits on screen (object-fit: contain inside `box`).
const samplePixels = (image, box) => {
  const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const left = box.x + (box.width - width) / 2;
  const top = box.y + (box.height - height) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const points = [];
  for (let y = 0; y < height; y += STEP) {
    for (let x = 0; x < width; x += STEP) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > ALPHA_MIN) points.push([left + x, top + y, data[i], data[i + 1], data[i + 2]]);
    }
  }
  // Top-to-bottom order pairs the top of one product with the top of the next, so the shape reforms instead of scrambling.
  return points.sort((a, b) => a[1] - b[1]);
};

const buildPairs = (from, to, box) => {
  const a = samplePixels(from, box);
  const b = samplePixels(to, box);
  const count = Math.max(a.length, b.length);
  const motion = new Float32Array(count * 6); // start x, start y, end x, end y, swirl phase, swirl size
  const colors = new Uint8ClampedArray(count * 6); // start rgb, end rgb
  for (let i = 0; i < count; i += 1) {
    const p = a[Math.floor((i * a.length) / count)];
    const q = b[Math.floor((i * b.length) / count)];
    motion.set([p[0], p[1], q[0], q[1], Math.random() * Math.PI * 2, 20 + Math.random() * 90], i * 6);
    colors.set([p[2], p[3], p[4], q[2], q[3], q[4]], i * 6);
  }
  return { count, motion, colors };
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export const createMorph = (canvas) => {
  const ctx = canvas.getContext('2d');
  const cache = new Map();
  let frame = null;

  const resize = (width, height) => {
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    frame = ctx.createImageData(canvas.width, canvas.height);
    cache.clear();
  };

  // t runs 0 → 1 across the hand-over; outside it the canvas stays empty and the real photos show.
  const draw = (key, from, to, box, t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!frame || t <= 0 || t >= 1 || !from.naturalWidth || !to.naturalWidth) return;
    let pairs = cache.get(key);
    if (!pairs) {
      pairs = buildPairs(from, to, box);
      cache.set(key, pairs);
    }

    const { width, height } = canvas;
    const { data } = frame;
    data.fill(0);
    const { count, motion, colors } = pairs;

    for (let i = 0; i < count; i += 1) {
      // Particles are in top-to-bottom order, so the top breaks up first and the bottom follows like a wave.
      const local = Math.min(1, Math.max(0, (t - (i / count) * WAVE) / (1 - WAVE)));
      const eased = easeInOut(local);
      const swirl = Math.sin(Math.PI * local);
      const m = i * 6;
      const phase = motion[m + 4] + local * 7;
      const x = (motion[m] + (motion[m + 2] - motion[m]) * eased + Math.cos(phase) * swirl * motion[m + 5]) | 0;
      const y = (motion[m + 1] + (motion[m + 3] - motion[m + 1]) * eased + Math.sin(phase * 1.3) * swirl * motion[m + 5] * 0.6) | 0;
      if (x < 0 || y < 0 || x >= width - 1 || y >= height - 1) continue;
      const r = colors[m] + (colors[m + 3] - colors[m]) * eased;
      const g = colors[m + 1] + (colors[m + 4] - colors[m + 1]) * eased;
      const b = colors[m + 2] + (colors[m + 5] - colors[m + 2]) * eased;
      // Each particle is a 2×2 dot.
      for (let dy = 0; dy < 2; dy += 1) {
        for (let dx = 0; dx < 2; dx += 1) {
          const p = ((y + dy) * width + x + dx) * 4;
          data[p] = r;
          data[p + 1] = g;
          data[p + 2] = b;
          data[p + 3] = 255;
        }
      }
    }
    ctx.putImageData(frame, 0, 0);
  };

  return { resize, draw };
};
