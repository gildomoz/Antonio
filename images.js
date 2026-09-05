/* Sistema real de troca automática de imagens: preload, validação, fade,
   troca automática, deteção de erro, fallback, continuidade do slideshow.
   Nunca mostra uma imagem quebrada — se todas as opções de um slot falharem,
   o slot é ocultado em vez de mostrar um ícone quebrado. */

function setupImageFallbacks(imgEl, sources){
  let idx = 0;
  function tryNext(){
    if(idx >= sources.length){ imgEl.style.display = 'none'; return; }
    const testImg = new Image();
    testImg.onload = () => { imgEl.src = sources[idx]; imgEl.style.display = ''; };
    testImg.onerror = () => { idx++; tryNext(); };
    testImg.src = sources[idx];
  }
  tryNext();
}

function createImageRotator(imgEl, sources, intervalMs){
  if(!imgEl || !sources || !sources.length) return;
  let current = 0;
  const validated = [];

  function preloadAll(cb){
    let remaining = sources.length;
    sources.forEach(src => {
      const test = new Image();
      test.onload = () => { validated.push(src); remaining--; if(remaining===0) cb(); };
      test.onerror = () => { remaining--; if(remaining===0) cb(); };
      test.src = src;
    });
  }

  function showNext(){
    if(!validated.length){ imgEl.style.display = 'none'; return; }
    current = (current + 1) % validated.length;
    imgEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = validated[current];
      imgEl.style.opacity = 1;
    }, 260);
  }

  imgEl.style.transition = 'opacity .26s ease';
  preloadAll(() => {
    if(!validated.length){ imgEl.style.display = 'none'; return; }
    imgEl.src = validated[0];
    imgEl.style.opacity = 1;
    if(validated.length > 1){
      setInterval(showNext, intervalMs || 5000);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-rotate-images]').forEach(el => {
    const sources = el.getAttribute('data-rotate-images').split('|').map(s => s.trim()).filter(Boolean);
    createImageRotator(el, sources, 5500);
  });
});
