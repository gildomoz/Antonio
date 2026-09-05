/* CYBER MARKET TERMINAL — dados reais via APIs públicas, sem chave.
   Nunca inventa valores: se uma fonte falhar, o ativo é marcado como indisponível. */
(function(){
  const body = document.getElementById('market-terminal-body');
  const tickerTrack = document.getElementById('ticker-track');
  if(!body) return;

  const ASSETS = [
    { id:'btc', label:'BTC/USD', full:'Bitcoin' },
    { id:'eth', label:'ETH/USD', full:'Ethereum' },
    { id:'eurusd', label:'EUR/USD', full:'Euro / Dólar' },
    { id:'usdmzn', label:'USD/MZN', full:'Dólar / Metical' }
  ];
  const state = {};

  function fmt(n, decimals){
    if(n === null || n === undefined || isNaN(n)) return null;
    return n.toLocaleString('pt-PT', { minimumFractionDigits:decimals, maximumFractionDigits:decimals });
  }

  async function fetchCrypto(){
    try{
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
      if(!res.ok) throw new Error('coingecko ' + res.status);
      const data = await res.json();
      state.btc = {
        price: data.bitcoin?.usd ?? null,
        change: data.bitcoin?.usd_24h_change ?? null,
        source: 'CoinGecko API', time: new Date()
      };
      state.eth = {
        price: data.ethereum?.usd ?? null,
        change: data.ethereum?.usd_24h_change ?? null,
        source: 'CoinGecko API', time: new Date()
      };
    }catch(e){
      state.btc = { unavailable:true };
      state.eth = { unavailable:true };
    }
  }

  async function fetchFx(){
    try{
      const res = await fetch('https://open.er-api.com/v6/latest/EUR');
      if(!res.ok) throw new Error('er-api ' + res.status);
      const data = await res.json();
      state.eurusd = {
        price: data.rates?.USD ?? null,
        source: 'open.er-api.com (Open Exchange Rates data)',
        time: data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date()
      };
    }catch(e){ state.eurusd = { unavailable:true }; }

    try{
      const res2 = await fetch('https://open.er-api.com/v6/latest/USD');
      if(!res2.ok) throw new Error('er-api ' + res2.status);
      const data2 = await res2.json();
      state.usdmzn = {
        price: data2.rates?.MZN ?? null,
        source: 'open.er-api.com (Open Exchange Rates data)',
        time: data2.time_last_update_utc ? new Date(data2.time_last_update_utc) : new Date()
      };
    }catch(e){ state.usdmzn = { unavailable:true }; }
  }

  function renderRow(asset){
    const s = state[asset.id];
    if(!s || s.unavailable){
      return `<div class="asset-row unavailable">
        <div class="asset-name"><b>${asset.label}</b><span>${asset.full}</span></div>
        <div class="asset-price"><b>Indisponível</b><span class="src">Sem fonte gratuita verificável no momento</span></div>
      </div>`;
    }
    const decimals = asset.id === 'usdmzn' || asset.id === 'eurusd' ? 4 : 2;
    const priceStr = fmt(s.price, decimals);
    const changeStr = (s.change !== undefined && s.change !== null) ? `${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}%` : '';
    const changeClass = s.change >= 0 ? 'up' : 'down';
    const timeStr = s.time ? s.time.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'}) : '';
    return `<div class="asset-row">
      <div class="asset-name"><b>${asset.label}</b><span>${asset.full}</span></div>
      <div class="asset-price">
        <b>${priceStr ?? 'Indisponível'}</b>
        ${changeStr ? `<span class="chg ${changeClass}">${changeStr} (24h)</span>` : ''}
        <span class="src">${s.source} · ${timeStr}</span>
      </div>
    </div>`;
  }

  function render(){
    body.innerHTML = ASSETS.map(renderRow).join('');
    if(tickerTrack){
      const items = ASSETS.map(a=>{
        const s = state[a.id];
        if(!s || s.unavailable) return `<span class="tick">${a.label}: <b>indisponível</b></span>`;
        const decimals = a.id === 'usdmzn' || a.id === 'eurusd' ? 4 : 2;
        const cls = s.change >= 0 ? 'up' : 'down';
        return `<span class="tick">${a.label}: <b>${fmt(s.price, decimals)}</b> ${s.change!==undefined && s.change!==null ? `<span class="${cls}">${s.change>=0?'+':''}${s.change.toFixed(2)}%</span>` : ''}</span>`;
      });
      tickerTrack.innerHTML = items.join('') + items.join(''); // duplicado para loop contínuo
    }
  }

  async function refresh(){
    await Promise.all([fetchCrypto(), fetchFx()]);
    render();
  }

  refresh();
  setInterval(refresh, 60000); // atualiza a cada 60s — respeita limites gratuitos das APIs
})();
