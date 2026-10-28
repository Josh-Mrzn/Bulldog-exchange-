import * as THREE from 'three';

const W = 2048;
const H = 1024;
const NAVY_DARK = '#0b0f33';
const GOLD = '#f5c400';

// The cylinder wrap starts at the back, so the front is the middle of the canvas,
// the sides are at a quarter and three quarters, and the back straddles both edges.
const drawWrap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const body = ctx.createLinearGradient(0, 0, 0, H);
  body.addColorStop(0, '#262f82');
  body.addColorStop(0.55, '#1a2063');
  body.addColorStop(1, '#0e1240');
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, W, H);

  const stripes = (top) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, top, W, 10);
    ctx.fillRect(0, top + 52, W, 10);
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, top + 18, W, 26);
  };
  stripes(H * 0.1);
  stripes(H * 0.8);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Front: gold "Bulldogs" script.
  ctx.save();
  ctx.translate(W / 2, H * 0.47);
  ctx.rotate(-0.08);
  ctx.font = '170px Pacifico, cursive';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 16;
  ctx.strokeStyle = NAVY_DARK;
  ctx.strokeText('Bulldogs', 0, 0);
  ctx.fillStyle = GOLD;
  ctx.fillText('Bulldogs', 0, 0);
  ctx.restore();

  ctx.font = '800 30px Manrope, sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('EST. 1900', W / 2, H * 0.66);

  // Sides: outlined "NU".
  ctx.letterSpacing = '0px';
  ctx.font = '700 180px Fraunces, serif';
  ctx.lineWidth = 7;
  ctx.strokeStyle = GOLD;
  [W * 0.25, W * 0.75].forEach((x) => ctx.strokeText('NU', x, H * 0.46));

  // Back: drawn at both edges so the halves meet across the seam.
  [0, W].forEach((x) => {
    ctx.font = '800 32px Manrope, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NATIONAL UNIVERSITY', x, H * 0.38);
    ctx.letterSpacing = '0px';
    ctx.font = 'italic 700 96px Fraunces, serif';
    ctx.fillStyle = GOLD;
    ctx.fillText('Go Bulldogs!', x, H * 0.53);
  });

  return canvas;
};

export const loadTumblerFonts = () =>
  Promise.all(
    ['170px Pacifico', '800 32px Manrope', '700 180px Fraunces', 'italic 700 96px Fraunces'].map((font) =>
      document.fonts.load(font),
    ),
  ).then(() => document.fonts.ready);

export const buildTumbler = (anisotropy) => {
  const texture = new THREE.CanvasTexture(drawWrap());
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;

  const bodyMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.25, roughness: 0.38 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xd4d7df, metalness: 0.9, roughness: 0.25 });
  const black = new THREE.MeshStandardMaterial({ color: 0x16171d, metalness: 0.2, roughness: 0.45 });

  // The parts sit in an inner group shifted down so the outer group turns and flips around the tumbler's middle.
  const group = new THREE.Group();
  const parts = new THREE.Group();
  group.add(parts);
  const add = (geometry, material, y, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, y, z);
    parts.add(mesh);
  };

  add(new THREE.CylinderGeometry(1, 0.82, 3.2, 96, 1, true, Math.PI), bodyMaterial, 0); // body
  add(new THREE.CylinderGeometry(0.83, 0.79, 0.24, 96), steel, -1.72); // base
  add(new THREE.CylinderGeometry(1.04, 1.01, 0.22, 96), steel, 1.71); // ring
  add(new THREE.CylinderGeometry(0.98, 1.04, 0.34, 96), black, 1.99); // lid
  add(new THREE.CylinderGeometry(0.72, 0.98, 0.1, 96), black, 2.21); // lid top
  add(new THREE.CylinderGeometry(0.15, 0.2, 0.2, 32), black, 2.32, 0.6); // sip spout
  parts.position.y = -0.26;

  const dispose = () => {
    group.traverse((child) => child.geometry?.dispose());
    [bodyMaterial, steel, black, texture].forEach((item) => item.dispose());
  };

  return { group, dispose };
};
