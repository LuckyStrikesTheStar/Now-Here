// The supplied restaurant sketch uses createCanvas(960, 660).
// Resize the whole iframe visually, rather than cropping its canvas viewport.
const slot = document.querySelector('.sketch-slot');
if (slot) {
  const fit = () => {
    const scale = Math.min(slot.clientWidth / 960, slot.clientHeight / 660);
    slot.style.setProperty('--sketch-scale', String(scale));
  };
  new ResizeObserver(fit).observe(slot);
  fit();
}
