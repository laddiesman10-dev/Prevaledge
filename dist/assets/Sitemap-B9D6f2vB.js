import{r as o,S as h,X as m,a1 as y}from"./index-BJm5hHGn.js";const f=()=>{const{projects:r,blogPosts:a}=o.useContext(h),n=y,i=new Date().toISOString().split("T")[0],s=[{path:"",priority:"1.0",changefreq:"weekly"},{path:"/ai-toolkit",priority:"0.9",changefreq:"monthly"},{path:"/blog",priority:"0.9",changefreq:"weekly"},{path:"/careers",priority:"0.8",changefreq:"monthly"},{path:"/privacy-policy",priority:"0.3",changefreq:"yearly"},{path:"/terms-and-conditions",priority:"0.3",changefreq:"yearly"}],l=m.map(t=>({path:`/ai-toolkit/${t.id}`,priority:"0.7",changefreq:"monthly"})),p=r.map(t=>({path:`/project/${t.slug}`,priority:"0.7",changefreq:"monthly"})),c=a.map(t=>({path:`/blog/${t.slug}`,priority:"0.8",changefreq:"monthly",lastmod:new Date(t.date).toISOString().split("T")[0]})),e=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...s,...l,...p,...c].map(t=>`
  <url>
    <loc>${n}${t.path}</loc>
    <lastmod>${t.lastmod||i}</lastmod>
    <changefreq>${t.changefreq}</changefreq>
    <priority>${t.priority}</priority>
  </url>
`).join("")}
</urlset>`;return o.useEffect(()=>{document.head.innerHTML="",document.body.innerHTML="";const t=document.createElement("pre");t.style.margin="0",t.style.fontFamily="monospace",t.textContent=e,document.body.appendChild(t)},[e]),null};export{f as default};
