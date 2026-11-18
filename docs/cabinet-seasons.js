const scene = document.querySelector('.center-sketch');
const rabbits = [...document.querySelectorAll('[data-season]')];
let selectedSeason = 'winter';
function selectSeason(next) {
  selectedSeason = next;
  rabbits.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === next)));
  const sketch = scene.contentWindow;
  if (typeof sketch.setSeason === 'function') sketch.setSeason(next);
}
rabbits.forEach(button => button.addEventListener('click', () => selectSeason(button.dataset.season)));
scene.addEventListener('load', () => selectSeason(selectedSeason));
selectSeason(selectedSeason);
