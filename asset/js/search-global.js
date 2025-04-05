const searchWorker=new Worker("/searchWorker.js");function displaySearchResults(e){const t=document.getElementById("search-results");t.innerHTML="",e.forEach((e=>{const s=document.createElement("div");s.classList.add("the-result"),s.innerHTML=`\n      <p class="text-md sm:text-lg font-bold mb-2 text-primary">\n        <a class="link link-hover" href="${e.url}">${e.title}</a>\n      </p>\n      <p class="text-sm sm:text-md mb-2">${e.description}</p>\n      <p class="text-sm"><span class="badge badge-accent">${e.category}</span> - ${e.date}</p>\n    `,t.appendChild(s)}))}searchWorker.onmessage=function(e){const{type:t,results:s,message:n}=e.data,r=document.getElementById("search-results");"search-results"===t?s.length>0?(displaySearchResults(s),r.classList.remove("hidden")):(r.innerHTML='<p class="text-error text-center">Tidak ditemukan apa-apa.</p>',r.classList.remove("hidden")):"error"===t&&(r.innerHTML=`<p class="text-red-500 text-center">${n}</p>`,r.classList.remove("hidden"))},document.getElementById("search-input").addEventListener("input",(function(){const e=this.value.toLowerCase(),t=["blog","photos","unduhan","personil","visiMisi","profil"];e.length>=3?searchWorker.postMessage({type:"search",query:e,categories:t}):document.getElementById("search-results").classList.add("hidden")})),document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("search-results").classList.add("hidden")})),document.addEventListener("click",(function(e){const t=document.getElementById("search-input"),s=document.getElementById("search-results");t.contains(e.target)||s.contains(e.target)||(t.value="",s.classList.add("hidden"))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.documentElement,t=document.querySelector("#sticky-parent input");t&&(t.addEventListener("focus",(()=>{e.classList.remove("scroll-smooth","scroll-pt-[5rem]")})),t.addEventListener("blur-sm",(()=>{e.classList.add("scroll-smooth","scroll-pt-[5rem]")})))}));