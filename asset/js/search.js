!function(){let e=-1;document.getElementById("search-input").addEventListener("input",(function(){const t=document.getElementById("search-input").value.toLowerCase(),n=document.querySelectorAll(".result-item");let o=!1;e=-1,t.length<3?(n.forEach((e=>{e.classList.remove("hidden")})),o=!0):n.forEach((e=>{e.textContent.toLowerCase().includes(t)?(e.classList.remove("hidden"),o=!0):e.classList.add("hidden")})),document.getElementById("no-results").classList.toggle("hidden",o)})),document.getElementById("search-input").addEventListener("keydown",(function(t){const n=document.querySelectorAll(".result-item:not(.hidden)");0!==n.length&&("ArrowDown"===t.key?e=(e+1)%n.length:"ArrowUp"===t.key&&(e=(e-1+n.length)%n.length),n.forEach(((t,n)=>{t.classList.toggle("active",n===e)})))})),document.addEventListener("keydown",(function(t){if("Enter"===t.key){const t=document.querySelectorAll(".result-item:not(.hidden)");e>=0&&e<t.length&&alert("Selected: "+t[e].textContent)}}))}();