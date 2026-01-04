import{r as n,a1 as o}from"./index-BJm5hHGn.js";const l=()=>{const t=`User-agent: *
Disallow: /admin/
Disallow: /portal/
Disallow: /invoice/

Sitemap: ${o}/sitemap.xml
`;return n.useEffect(()=>{document.head.innerHTML="",document.body.innerHTML="";const e=document.createElement("pre");e.style.margin="0",e.style.fontFamily="monospace",e.textContent=t,document.body.appendChild(e)},[t]),null};export{l as default};
