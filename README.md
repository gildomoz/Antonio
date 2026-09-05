# Cyber Market Real

Site estático (HTML/CSS/JS puro, sem build) sobre **Finanças**, **Casino** e **Imóveis**, com estética cyber-hacker: globo 3D real (Three.js), chuva digital em canvas, terminal de mercado com dados ao vivo e agregador de notícias reais.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub e envie esta pasta:
   ```bash
   cd cyber-market-real
   git init
   git add .
   git commit -m "Cyber Market Real — versão inicial"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
2. No GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `/root`**.
3. O site fica disponível em `https://SEU-USUARIO.github.io/SEU-REPO/`.

## Estrutura

```
index.html          — página principal (todas as secções)
css/style.css        — identidade visual cyber
js/globe.js          — globo 3D real (Three.js, 1 volta = 3s)
js/particles.js       — chuva digital em canvas
js/market.js          — dados reais de BTC, ETH, EUR/USD, USD/MZN
js/news.js            — notícias reais via Google News RSS
js/images.js          — createImageRotator() / setupImageFallbacks()
js/main.js            — menu mobile, pesquisa, filtros
pages/*.html          — Sobre, Contacto, Privacidade, Cookies, Termos, Aviso Legal, Política Editorial
```

## Antes de publicar, personalize

- **Email de contacto**: troque `contacto@cybermarketreal.example` (em `index.html` e `pages/contacto.html`) pelo email real do seu domínio.
- **Portais de imóveis**: a secção Imóveis liga a portais reais (Idealista, Imovirtual, OLX, ZAP Imóveis) — ajuste à sua região-alvo.
- **Domínio/marca**: o nome "Cyber Market Real" e o email de exemplo podem ser trocados livremente pelo footer e pelas páginas institucionais.

## Limites técnicos assumidos deliberadamente (para não inventar dados)

- Ouro, petróleo e índices bolsistas **não são mostrados**: exigem APIs pagas para dados fiáveis; em vez de inventar valores, o componente foi removido.
- As notícias são manchetes reais agregadas (título, fonte, data, link) — não há resumos longos nem reprodução de artigos, por direitos de autor.
- Os "anúncios" de imóveis são substituídos por ligações diretas a portais reais, em vez de listagens fictícias.
- A API pública de notícias (`rss2json.com`, sem chave) tem um limite de pedidos gratuito; se for excedido, a secção mostra uma ligação direta ao Google News em vez de falhar silenciosamente.

Para dados de ouro/petróleo/índices em tempo real, ou para um feed de notícias sem limites, será necessário contratar uma API paga (ex: Twelve Data, Alpha Vantage, NewsAPI.org) e adicionar a chave em `js/market.js` / `js/news.js`.
