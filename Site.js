const $=id=>document.getElementById(id),enc=encodeURIComponent,P=document.body.dataset.page,qs=new URLSearchParams(location.search),K=Object.keys(G);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join(""),out=$("out");
const NAV=[["index","Home"],["country","Search a country"],["destinations","Destinations"],["hotels","Hotels"],["transport","Transport"],["contact","Contact"]];
$("nav").innerHTML=`<nav aria-label="Main"><b>🌍 ExploreWorld</b>${NAV.map(n=>`<a href="${n[0]}.html"${n[0]===P?' aria-current="page"':""}>${n[1]}</a>`).join("")}</nav>`;
$("foot").textContent="© ExploreWorld. Built as a school project; check prices and entry rules before you travel.";
const head=(t,p)=>$("hd").innerHTML=`<h1>${t}</h1><p>${p}</p>`;
function hero(t,p,v){
  head(t,p);
  $("hd").insertAdjacentHTML("beforeend",`<form action="country.html" autocomplete="off"><input id="q" name="c" list="names" value="${esc(v||"")}" placeholder="e.g. Kenya" aria-label="Country name" required><datalist id="names">${K.map(n=>`<option value="${esc(n)}">`).join("")}</datalist><button>Show me</button><button type="button" class="alt" id="sur">Surprise me</button></form><div class="chips">${K.map(n=>`<a href="country.html?c=${enc(n)}">${esc(n)}</a>`).join("")}</div>`);
  $("sur").onclick=()=>{location.href="country.html?c="+enc(K[Math.floor(Math.random()*K.length)])};
  fetch("https://restcountries.com/v3.1/all?fields=name").then(r=>r.json()).then(l=>{l.map(c=>c.name.common).sort().forEach(n=>{if(!G[n])$("names").insertAdjacentHTML("beforeend",`<option value="${esc(n)}">`)})}).catch(()=>{});
}
const mapLinks=n=>`<section><h3>Plan your trip</h3><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/hotels+in+${enc(n)}">Hotels on the map</a><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/tourist+attractions+in+${enc(n)}">Attractions on the map</a><a class="btn" target="_blank" rel="noopener" href="https://en.wikivoyage.org/wiki/${enc(n.replace(/ /g,"_"))}">Travel guide</a></section>`;

if(P==="index"){
  hero("Where would you wake up next week?","Pick a country and ExploreWorld shows you its cities, must-see sights, places to stay and how to get around. Not sure where to start? Let us surprise you.");
  const rn=K[Math.floor(Math.random()*K.length)];
  out.innerHTML=`<p class="note"><b>Did you know?</b> ${esc(FACT[rn])} <a href="country.html?c=${enc(rn)}">Explore ${esc(rn)}</a></p><h3>Pick a country</h3><div class="grid">${K.map(n=>`<a class="card" href="country.html?c=${enc(n)}"><span class="flag" aria-hidden="true">${G[n].f}</span><b>${esc(n)}</b><br><small>${G[n].cities.length} regions to explore</small></a>`).join("")}</div><section style="margin-top:34px"><h3>How it works</h3><ol class="steps"><li><b>Search</b><br>Type a country, or tap Surprise me.</li><li><b>Discover</b><br>See its cities and the sights worth a visit.</li><li><b>Plan</b><br>Find places to stay and how to get around.</li></ol></section>`;
}
if(P==="country"){
  let q=(qs.get("c")||"").trim();
  hero("Search a country","Type a country name to open its guide.",q);
  const k=K.find(n=>n.toLowerCase()===(ALIAS[q.toLowerCase()]||q).toLowerCase());
  if(k){const d=G[k];
    out.innerHTML=`<div class="top"><span class="flag" aria-hidden="true">${d.f}</span><h2>${esc(k)}</h2></div>
    ${FACT[k]?`<p class="note"><b>Did you know?</b> ${esc(FACT[k])}</p>`:""}<div class="facts"><div><small>Capital</small>${esc(d.cap)}</div><div><small>Currency</small>${esc(d.cur)}</div><div><small>Languages</small>${esc(d.lang)}</div><div><small>Best time to visit</small>${esc(d.best)}</div></div>
    <section><h3>Cities and attractions</h3>${d.cities.map(c=>`<div class="city"><h4>${esc(c[0])}</h4><ul>${li(c[1])}</ul></div>`).join("")}</section>
    <section><h3>Where to stay</h3>${d.hotels.map(h=>`<div class="hotel"><div><b>${esc(h[0])}</b><br><span>${esc(h[1])}</span></div><span>${esc(h[2])}</span></div>`).join("")}<p><a href="hotels.html?c=${enc(k)}">See all hotels in ${esc(k)}</a></p></section>
    <section><h3>Getting around</h3><ul class="list">${li(d.tr)}</ul></section>${mapLinks(k)}`;
  }else if(q){
    out.innerHTML=`<p class="msg">Looking up ${esc(q)}…</p>`;
    fetch(`https://restcountries.com/v3.1/name/${enc(q)}?fields=name,capital,currencies,languages,flags,subregion,region,population`).then(r=>{if(!r.ok)throw 0;return r.json()}).then(async r=>{
      const c=r[0],n=c.name.common;let sum="";
      try{const w=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc(n.replace(/ /g,"_"))}`);if(w.ok)sum=(await w.json()).extract||""}catch(e){}
      out.innerHTML=`<div class="top"><img src="${esc(c.flags.png)}" alt="Flag of ${esc(n)}"><h2>${esc(n)}</h2></div><p class="note">There is no full guide for ${esc(n)} yet, so here are the basics and links to explore further.</p>
      <div class="facts"><div><small>Capital</small>${esc((c.capital||["n/a"]).join(", "))}</div><div><small>Region</small>${esc(c.subregion||c.region)}</div><div><small>Currency</small>${esc(Object.values(c.currencies||{}).map(x=>x.name).join(", ")||"n/a")}</div><div><small>Languages</small>${esc(Object.values(c.languages||{}).join(", ")||"n/a")}</div><div><small>Population</small>${c.population.toLocaleString()}</div></div>${sum?`<section><h3>About</h3><p>${esc(sum)}</p></section>`:""}${mapLinks(n)}`;
    }).catch(()=>{out.innerHTML=`<p class="msg">No country found for “${esc(q)}”. Check the spelling or pick one from the list above. Countries without a built-in guide need an internet connection.</p>`});
  }
}
if(P==="destinations"){
  head("Destinations","Every city and attraction in our guides. Filter by country, city or attraction.");
  $("hd").insertAdjacentHTML("beforeend",`<input id="flt" placeholder="Filter, e.g. beach, museum, Cape Town" aria-label="Filter destinations">`);
  const draw=()=>{const t=$("flt").value.toLowerCase();let h="";
    K.forEach(n=>G[n].cities.forEach(c=>{const a=c[1].filter(x=>!t||(n+c[0]+x).toLowerCase().includes(t));if(a.length)h+=`<div class="city"><h4>${G[n].f} ${esc(c[0])} <small><a href="country.html?c=${enc(n)}">${esc(n)}</a></small></h4><ul>${li(a)}</ul></div>`}));
    out.innerHTML=h||`<p class="msg">Nothing matches “${esc($("flt").value)}”. Try a country, city or place name.</p>`};
  $("flt").oninput=draw;draw();
}
if(P==="hotels"){
  head("Where to stay","Example hotels by country. Check current prices and availability before you book.");
  $("hd").insertAdjacentHTML("beforeend",`<select id="sel" aria-label="Country"><option value="">All countries</option>${K.map(n=>`<option>${esc(n)}</option>`).join("")}</select>`);
  const draw=()=>{const s=$("sel").value;out.innerHTML=K.filter(n=>!s||n===s).map(n=>`<section><h3>${G[n].f} ${esc(n)}</h3>${G[n].hotels.map(h=>`<div class="hotel"><div><b>${esc(h[0])}</b><br><span>${esc(h[1])}</span></div><span>${esc(h[2])}</span></div>`).join("")}<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/hotels+in+${enc(n)}">More hotels in ${esc(n)}</a></section>`).join("")};
  if(K.includes(qs.get("c")))$("sel").value=qs.get("c");$("sel").onchange=draw;draw();
}
if(P==="transport"){
  head("Getting around","How to travel between and within the cities in each guide.");
  out.innerHTML=K.map(n=>`<section><h3>${G[n].f} ${esc(n)}</h3><ul class="list">${li(G[n].tr)}</ul></section>`).join("");
}
if(P==="contact"){
  head("Contact us","Questions or a country you’d like added? Send us a message.");
  out.innerHTML=`<form class="cform" id="cf" novalidate><label for="nm">Name</label><input id="nm"><div class="err" id="e1"></div><label for="em">Email</label><input id="em" type="email"><div class="err" id="e2"></div><label for="ms">Message</label><textarea id="ms" rows="5"></textarea><div class="err" id="e3"></div><button>Send message</button></form><p id="ok" class="note" hidden></p>`;
  $("cf").onsubmit=e=>{e.preventDefault();const nm=$("nm").value.trim(),em=$("em").value.trim(),ms=$("ms").value.trim();
    $("e1").textContent=nm?"":"Enter your name.";$("e2").textContent=/^\S+@\S+\.\S+$/.test(em)?"":"Enter a valid email address.";$("e3").textContent=ms.length>=10?"":"Write at least 10 characters.";
    if(nm&&/^\S+@\S+\.\S+$/.test(em)&&ms.length>=10){$("cf").hidden=true;$("ok").hidden=false;$("ok").textContent=`Thanks, ${nm}. Your message is ready to send.`}};
}