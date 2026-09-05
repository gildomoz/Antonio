(function(){
  // ----- menu mobile -----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // marca o link ativo conforme a secção visível
  const sections = document.querySelectorAll('main [id]');
  const navLinks = document.querySelectorAll('.main-nav a');
  if(sections.length && navLinks.length && 'IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  // ----- pesquisa funcional (procura em títulos/textos de toda a página) -----
  const searchForm = document.getElementById('site-search');
  if(searchForm){
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchForm.querySelector('input').value.trim().toLowerCase();
      if(!q) return;
      const resultsEl = document.getElementById('search-results');
      const candidates = document.querySelectorAll('main h2, main h3, main p, main .asset-name b');
      let firstMatch = null;
      let count = 0;
      candidates.forEach(el => {
        el.classList.remove('search-hit');
        if(el.textContent.toLowerCase().includes(q)){
          el.classList.add('search-hit');
          count++;
          if(!firstMatch) firstMatch = el;
        }
      });
      if(resultsEl){
        resultsEl.textContent = count
          ? `${count} resultado(s) para "${q}" — a saltar para o primeiro.`
          : `Sem resultados diretos para "${q}" nesta página. A abrir pesquisa nas notícias reais…`;
      }
      if(firstMatch){
        firstMatch.scrollIntoView({ behavior:'smooth', block:'center' });
      } else {
        window.open(`https://news.google.com/search?q=${encodeURIComponent(q)}&hl=pt-PT&gl=PT&ceid=PT:pt`, '_blank');
      }
    });
  }

  // ----- filtros funcionais (notícias/artigos) -----
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const targetSelector = group.getAttribute('data-filter-target');
    const buttons = group.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll(targetSelector).forEach(card => {
          const cat = card.getAttribute('data-cat');
          card.style.display = (filter === 'todos' || cat === filter) ? '' : 'none';
        });
      });
    });
  });

  // rodapé: ano automático
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
