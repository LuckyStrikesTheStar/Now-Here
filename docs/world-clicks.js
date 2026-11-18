(() => {
  const stage = document.querySelector('.world-stage');
  const layer = document.createElement('div');
  layer.className = 'what-else-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  function protectCharacter() {
    const box = stage.getBoundingClientRect();
    // Leave room for the character's animated lean, head, hands and feet.
    const left = box.left + box.width * 1035 / 1920;
    const right = box.left + box.width * 1165 / 1920;
    const top = box.top + box.height * 140 / 1080;
    const bottom = box.top + box.height * 350 / 1080;
    // The inner polygon is a permanent opening through every accumulated block.
    layer.style.clipPath = `polygon(evenodd, 0px 0px, ${innerWidth}px 0px, ${innerWidth}px ${innerHeight}px, 0px ${innerHeight}px, 0px 0px, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px, 0px 0px)`;
  }

  document.addEventListener('click', event => {
    // Pointer clicks/taps anywhere on this page; keyboard activation keeps its normal behavior.
    if (event.button !== 0 || event.detail === 0) return;
    const block = document.createElement('span');
    block.className = 'what-else-stamp';
    block.textContent = 'WHAT ELSE';
    block.style.left = `${event.clientX / innerWidth * 100}%`;
    block.style.top = `${event.clientY / innerHeight * 100}%`;
    layer.append(block);
  });

  new ResizeObserver(protectCharacter).observe(stage);
  window.addEventListener('resize', protectCharacter);
  protectCharacter();
})();
