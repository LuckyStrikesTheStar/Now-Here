(() => {
 const canvas=document.querySelector('.world-canvas');
 const button=document.querySelector('.motion-control');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const ctx=canvas.getContext('2d');
 if(!ctx){button.hidden=true;return;}
  const regions = [
    // Flowers and tall foliage: slower, wider swaying arcs.
    [220,260,220,260,15,3,.95,0], [460,150,135,150,13,5,1.15,1],
    [450,365,145,175,17,4,1.05,2], [100,480,125,210,12,4,.9,3],
    [330,710,170,210,14,3,.85,1], [1265,165,95,220,12,3,1.2,2],
    [1440,270,115,155,13,4,1.1,4], [1750,90,150,170,14,5,1,3],
    [1805,440,110,260,15,4,.9,2], [1550,350,85,195,11,3,1.15,0],
    // Flags flutter faster, while the stone towers stay still.
    [1522,453,65,47,8,6,2.8,1], [1735,448,60,43,9,6,3.1,3],
    // Birds gently bob, with a separate flex through their wings.
    [780,135,180,105,7,10,1.5,0], [1080,63,155,74,8,8,1.65,2],
    [1350,37,130,60,6,7,1.7,4], [1575,88,105,85,7,9,1.5,1],
    [1740,162,100,77,6,8,1.8,3],
    // Yellow creatures: little alternating leans and bounces.
    [1100,240,65,105,7,7,2.2,0], [785,320,50,70,5,6,2.5,2],
    [921,330,50,58,5,6,2.2,4], [865,515,59,83,6,6,2.3,1],
    [980,520,55,80,6,7,2.1,3], [1330,472,82,58,4,4,1.7,2],
    [1305,623,51,61,6,6,2.3,0], [1390,626,50,62,5,7,2.4,3],
    [1240,765,60,93,6,7,2.0,2],
    [927,838,44,48,4,6,2.6,1], [993,834,40,48,4,7,2.4,3],
    [1060,835,38,50,4,6,2.5,5], [1130,840,40,48,4,7,2.3,2],
    [1397,969,52,58,4,6,2.2,1], [1470,967,46,59,4,5,2.4,3]
  ];
 const vertices=[], triangles=[], cols=48, rows=30;
 const smooth=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
 for(let row=0;row<=rows;row++) for(let col=0;col<=cols;col++){
   const x=col*1920/cols,y=row*1080/rows;
   const edge=smooth(x/28)*smooth((1920-x)/28)*smooth(y/24)*smooth((1080-y)/24);
   vertices.push({x,y,dx:x,dy:y,edge,weights:regions.map(r=>Math.exp(-2.5*(((x-r[0])/r[2])**2+((y-r[1])/r[3])**2)))});
 }
 for(let row=0;row<rows;row++) for(let col=0;col<cols;col++){
   const i=row*(cols+1)+col;
   triangles.push([i,i+1,i+cols+1],[i+1,i+cols+2,i+cols+1]);
 }
 const picture=new Image();
 let ready=false,paused=preference.matches,time=0,last=0,request=0;
 function render(){
   if(!ready)return;
   const ratio=Math.min(1.25,devicePixelRatio||1);
   const width=Math.min(1600,Math.round(canvas.clientWidth*ratio));
   const height=Math.round(width*1080/1920);
   if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
   const sx=width/1920,sy=height/1080;
   const ramp=Math.min(1,time/1.2);
   const shifts=regions.map(r=>[r[4]*Math.sin(time*r[6]+r[7]),r[5]*Math.sin(time*r[6]+r[7]+1.2)]);
   for(const v of vertices){
     let x=0,y=0;
     v.weights.forEach((w,i)=>{x+=w*shifts[i][0];y+=w*shifts[i][1];});
     const water=smooth((v.y-800)/250);
     x+=water*2.8*Math.sin(v.y*.045+time*1.3);
     y+=water*1.5*Math.sin(v.x*.025+time);
     v.dx=v.x+x*v.edge*ramp;v.dy=v.y+y*v.edge*ramp;
   }
   ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
   for(const indices of triangles){
     const [a,b,c]=indices.map(i=>vertices[i]);
     const ux=b.x-a.x,uy=b.y-a.y,vx=c.x-a.x,vy=c.y-a.y;
     const det=ux*vy-uy*vx;
     const A=((b.dx-a.dx)*vy-(c.dx-a.dx)*uy)/det;
     const C=((c.dx-a.dx)*ux-(b.dx-a.dx)*vx)/det;
     const B=((b.dy-a.dy)*vy-(c.dy-a.dy)*uy)/det;
     const D=((c.dy-a.dy)*ux-(b.dy-a.dy)*vx)/det;
     ctx.save();
     ctx.setTransform(A*sx,B*sy,C*sx,D*sy,(a.dx-A*a.x-C*a.y)*sx,(a.dy-B*a.x-D*a.y)*sy);
     // Slightly overlap triangle edges to avoid hairline seams.
     const mx=(a.x+b.x+c.x)/3,my=(a.y+b.y+c.y)/3;
     ctx.beginPath();
     [a,b,c].forEach((v,i)=>{const x=mx+(v.x-mx)*1.025,y=my+(v.y-my)*1.025;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
     ctx.closePath();ctx.clip();
     const left=Math.max(0,Math.min(a.x,b.x,c.x)-2),top=Math.max(0,Math.min(a.y,b.y,c.y)-2);
     const w=Math.min(1920-left,44),h=Math.min(1080-top,40);
     ctx.drawImage(picture,left,top,w,h,left,top,w,h);
     ctx.restore();
   }
 }
 function tick(now){
   request=0;if(paused||document.hidden||!ready)return;
   if(!last||now-last>=1000/24){if(last)time+=Math.min((now-last)/1000,.1);last=now;render();}
   request=requestAnimationFrame(tick);
 }
 function update(){
   cancelAnimationFrame(request);last=0;
   button.textContent=paused?'Play motion':'Pause motion';
   button.setAttribute('aria-pressed',String(paused));
   if(!paused&&!document.hidden&&ready)request=requestAnimationFrame(tick);else render();
 }
 button.addEventListener('click',()=>{paused=!paused;update();});
 preference.addEventListener('change',e=>{paused=e.matches;update();});
 document.addEventListener('visibilitychange',update);
 new ResizeObserver(render).observe(canvas);
 picture.onload=()=>{ready=true;render();canvas.style.opacity=1;update();};
 picture.onerror=()=>{button.hidden=true;};
 picture.src='assets/yellow-creature-world.png';update();
})();
