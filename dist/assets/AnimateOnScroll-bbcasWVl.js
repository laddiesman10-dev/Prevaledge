import{j as b,r as l}from"./index-BJm5hHGn.js";const m=o=>{const[i,e]=l.useState(!1),t=l.useRef(null),{threshold:r,root:s,rootMargin:n,triggerOnce:a}=o;return l.useEffect(()=>{const c=t.current;if(!c)return;const u=new IntersectionObserver(([f])=>{f.isIntersecting?(e(!0),a&&u.unobserve(f.target)):a||e(!1)},{threshold:r,root:s,rootMargin:n});return u.observe(c),()=>{u.unobserve(c)}},[r,s,n,a]),[t,i]},v=({children:o,className:i="",delay:e=0,threshold:t=.1,triggerOnce:r=!0})=>{const[s,n]=m({threshold:t,triggerOnce:r});return b.jsx("div",{ref:s,className:`
        transition-all duration-700 ease-out will-change-[transform,opacity] ${i}
        ${n?"opacity-100 translate-y-0 blur-0":"opacity-0 translate-y-8 blur-sm"}
      `,style:{transitionDelay:`${e}ms`},children:o})};export{v as A};
