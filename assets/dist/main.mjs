import u from"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js";import{decrypt as g}from"./subtle.mjs";const m=()=>{const t=location.pathname.slice(1),[n,...c]=location.hash.slice(1).split(/(?=[:.])/),s=c.find(e=>e.startsWith("."))?.slice(1),r=c.find(e=>e.startsWith(":"))?.slice(1).split("-").map(e=>parseInt(e)||0)||[];return{uuid:t,k:n,forcedLanguage:s,selectedLines:r}},y=t=>{const{height:n}=t.getClientRects()[0],{lineHeight:c}=getComputedStyle(t),s=parseInt(n/parseFloat(c)),r=document.createElement("ol");for(let e=1;e<s;e++){const o=document.createElement("li");o.dataset.ln=e,r.appendChild(o)}r.addEventListener("click",({target:e,shiftKey:o})=>{const a=parseInt(e.dataset.ln),{k:d,forcedLanguage:i,selectedLines:f}=m();let[l,h=l]=f;a&&(a<l?l=a:h=a,location.hash=`${d}${i?`.${i}`:""}:${o&&l?`${l}-${h}`:a}`)}),t.insertBefore(r,t.firstChild)},p=t=>{const[n,c=n]=m().selectedLines;if(!n)return;const s=document.querySelector("mark")||document.createElement("mark");s.style.setProperty("--top",n-1),s.style.setProperty("--height",c-n+1),t.appendChild(s),setTimeout(()=>s.scrollIntoView(),200)};export const init=async(t,n)=>{const{uuid:c,k:s,forcedLanguage:r}=m(),e=document.createElement("pre");let o=document.createElement("code");try{const d=await(await fetch(`/data/${c}`)).arrayBuffer(),i=await g(n,s,d);t.startsWith("image/")?o=Object.assign(document.createElement("img"),{src:URL.createObjectURL(new Blob([i]))}):o.textContent=new TextDecoder().decode(i)||"empty \u{1F440}"}catch(a){console.error(a),o.textContent="failed \u{1F480}";return}finally{e.appendChild(o),document.body.innerHTML="",document.body.appendChild(e)}o.tagName.toLowerCase()==="code"&&(r&&u.configure({languages:[r]}),e.textContent.length<1e6&&u.highlightAll(),y(e),p(e),addEventListener("hashchange",()=>p(e)))};