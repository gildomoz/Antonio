/* Feed de notícias REAIS — agrega manchetes reais do Google News RSS
   (título, fonte e link verdadeiros). Nunca inventa notícias.
   Sem imagem própria do artigo, usa uma imagem editorial real da categoria (rotativa),
   nunca uma imagem falsamente apresentada como "foto do acontecimento". */
(function(){
  const grids = document.querySelectorAll('[data-news-grid]');
  if(!grids.length) return;

  const CATEGORY_IMAGES = {
    financas: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Marina%20Bay%20Sands%20and%20the%20skyline%20of%20the%20Central%20Business%20District%2C%20Singapore%2C%20at%20night%20-%2020120723.jpg',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Boston%20Financial%20District%20skyline.jpg'
    ],
    casino: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Slot%20machines%20in%20Venetian.jpg',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Monte%20Carlo%20Casino%20interior.jpg'
    ],
    imoveis: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Modern%20apartment%20building%20(Unsplash).jpg',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Apartment%20building-%20modern%20tower.jpg'
    ],
    geral: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Long%20Exposure%20of%20San%20Francisco%20Financial%20district.jpg'
    ]
  };

  const QUERIES = {
    financas: 'mercados financeiros OR bolsa de valores OR economia',
    casino: 'indústria do casino OR jogo online OR regulação de apostas',
    imoveis: 'mercado imobiliário OR habitação OR construção',
    geral: 'economia mundial OR banco central'
  };

  function imageFor(cat, i){
    const pool = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.geral;
    return pool[i % pool.length];
  }

  function splitSource(title){
    const idx = title.lastIndexOf(' - ');
    if(idx > -1) return { headline: title.slice(0, idx), source: title.slice(idx + 3) };
    return { headline: title, source: '' };
  }

  async function loadCategory(cat, grid){
    const query = QUERIES[cat] || QUERIES.geral;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-PT&gl=PT&ceid=PT:pt`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    grid.innerHTML = '<p class="loading-line">A carregar notícias reais…</p>';
    try{
      const res = await fetch(apiUrl);
      if(!res.ok) throw new Error('rss2json ' + res.status);
      const data = await res.json();
      if(data.status !== 'ok' || !data.items || !data.items.length) throw new Error('sem itens');
      const items = data.items.slice(0, 6);
      grid.innerHTML = items.map((item, i) => {
        const { headline, source } = splitSource(item.title || '');
        const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-PT', { day:'2-digit', month:'short', year:'numeric' }) : '';
        const img = imageFor(cat, i);
        return `<article class="card">
          <img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">
          <div class="card-body">
            <span class="card-cat">${cat.toUpperCase()}</span>
            <h3>${headline}</h3>
            <div class="card-meta">
              <span>${source || 'Fonte não identificada'}</span>
              <span>${date}</span>
            </div>
            <p><a href="${item.link}" target="_blank" rel="noopener">Ler notícia original →</a></p>
          </div>
        </article>`;
      }).join('');
    }catch(e){
      const fallbackUrl = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=pt-PT&gl=PT&ceid=PT:pt`;
      grid.innerHTML = `<p class="empty-line">Não foi possível carregar o feed em tempo real agora (limite da API pública atingido).
        <a href="${fallbackUrl}" target="_blank" rel="noopener">Ver notícias reais diretamente no Google News →</a></p>`;
    }
  }

  grids.forEach(grid => {
    const cat = grid.getAttribute('data-news-grid');
    loadCategory(cat, grid);
  });
})();
