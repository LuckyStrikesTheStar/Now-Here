(() => {
  const tooltip=document.querySelector('#world-tooltip');
  const spots=[...document.querySelectorAll('.world-spot')];
  let active=null,mode='hover';
  function position(event){
    if(!active)return;
    const box=active.getBoundingClientRect();
    const pointer=event&&event.pointerType!=='touch';
    const x=pointer?event.clientX:box.left+box.width/2;
    const y=pointer?event.clientY:box.top;
    const bounds=tooltip.getBoundingClientRect();
    let left=pointer?x+16:x-bounds.width/2;
    let top=y-bounds.height-14;
    if(top<12)top=pointer?y+20:box.bottom+12;
    left=Math.max(12,Math.min(left,innerWidth-bounds.width-12));
    top=Math.max(12,Math.min(top,innerHeight-bounds.height-12));
    tooltip.style.left=left+'px';tooltip.style.top=top+'px';
  }
  function hide(){
    if(active)active.removeAttribute('aria-describedby');
    active=null;tooltip.hidden=true;
  }
  function show(spot,event){
    if(active&&active!==spot)active.removeAttribute('aria-describedby');
    tooltip.classList.toggle('is-red',spot.dataset.color==='red');
    active=spot;tooltip.textContent=spot.dataset.message;tooltip.hidden=false;
    spot.setAttribute('aria-describedby',tooltip.id);position(event);
  }
  spots.forEach(spot=>{
    spot.addEventListener('pointerenter',event=>{
      if(event.pointerType==='touch')return;
      mode='hover';show(spot,event);
    });
    spot.addEventListener('pointermove',event=>{if(active===spot&&mode==='hover')position(event);});
    spot.addEventListener('pointerleave',()=>{if(active===spot&&mode==='hover')hide();});
    spot.addEventListener('focus',()=>{mode='focus';show(spot);});
    spot.addEventListener('blur',()=>{if(active===spot)hide();});
    spot.addEventListener('click',event=>{
      mode=event.pointerType==='touch'?'tap':event.detail===0?'focus':'hover';
      show(spot,mode==='hover'?event:undefined);
    });
  });
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.world-spot'))hide();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
  window.addEventListener('resize',()=>{if(active)position();});
})();
