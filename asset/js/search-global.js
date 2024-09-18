async function fetchSearchData(){try{const e=await fetch("/search-data.json");return await e.json()}catch(e){return console.error("Error loading search data:",e),null}}function searchDataAcrossCategories(e,t,s){const a=[];return s.forEach((s=>{e[s]&&Array.isArray(e[s])&&e[s].forEach((e=>{(e.title.toLowerCase().includes(t)||e.description.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))&&a.push(e)}))})),a}function displaySearchResults(e){const t=document.getElementById("search-results");t.innerHTML="",e.forEach((e=>{const s=document.createElement("div");s.classList.add("the-result"),s.innerHTML=`\n      <p class="text-md sm:text-lg font-bold mb-2 text-primary">\n        <a class="link link-hover" href="${e.url}">${e.title}</a>\n      </p>\n      <p class="text-sm sm:text-md mb-2">${e.description}</p>\n      <p class="text-sm"><code class="bg-base-200 font-mono py-1 px-2 rounded-xl">${e.category}</code> - ${e.date}</p>\n    `,t.appendChild(s)}))}document.getElementById("search-input").addEventListener("input",(async function(){const e=this.value.toLowerCase(),t=await fetchSearchData(),s=document.getElementById("search-results");if(e.length>=3)if(t){const a=searchDataAcrossCategories(t,e,["blog","photos","unduhan","personil","visiMisi","profil"]);a.length>0?(displaySearchResults(a),s.classList.remove("hidden")):(s.innerHTML='<p class="text-error text-center">Tidak ditemukan apa-apa.</p>',s.classList.remove("hidden"))}else s.innerHTML='<p class="text-red-500 text-center">Error loading search data</p>',s.classList.remove("hidden");else s.classList.add("hidden")})),document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("search-results")}));