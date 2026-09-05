/* Chuva digital cyber — canvas 2D, pointer-events:none, otimizada para móvel. */
(function(){
  const canvas = document.getElementById('cyber-rain');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
  const isSmall = window.innerWidth < 700;
  const isWeak = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let COUNT = isSmall ? 45 : 90;
  if(isWeak) COUNT = Math.round(COUNT * 0.6);
  if(reduceMotion) COUNT = Math.round(COUNT * 0.3);

  const COLORS = ['#35f2a0', '#22d3ee', '#5b8cff'];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeDot(){
    return {
      x: Math.random() * w,
      y: Math.random() * -h,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 1.1 + 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.25
    };
  }
  for(let i=0;i<COUNT;i++) dots.push(makeDot());

  let lastVisible = true;
  document.addEventListener('visibilitychange', ()=>{ lastVisible = !document.hidden; });

  function tick(){
    requestAnimationFrame(tick);
    if(!lastVisible) return;
    ctx.clearRect(0,0,w,h);
    for(const d of dots){
      d.y += d.speed * (reduceMotion ? 0.3 : 1);
      if(d.y > h + 10){ d.y = -10; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.alpha;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 4;
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  tick();

  // reduz partículas ainda mais se o frame rate cair (dispositivos fracos)
  let frames = 0, lastCheck = performance.now();
  function perfWatch(){
    frames++;
    const now = performance.now();
    if(now - lastCheck > 2000){
      const fps = frames / ((now-lastCheck)/1000);
      if(fps < 30 && dots.length > 20){
        dots = dots.slice(0, Math.floor(dots.length*0.6));
      }
      frames = 0; lastCheck = now;
    }
    requestAnimationFrame(perfWatch);
  }
  requestAnimationFrame(perfWatch);
})();
