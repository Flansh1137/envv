import{r as m,a as Ht}from"./react-a77fd2f7.js";import{r as jt}from"./react-dom-ea7d9bdf.js";function ft(){return typeof window<"u"}function Z(t){return Ft(t)?(t.nodeName||"").toLowerCase():"#document"}function W(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function _(t){var e;return(e=(Ft(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ft(t){return ft()?t instanceof Node||t instanceof W(t).Node:!1}function M(t){return ft()?t instanceof Element||t instanceof W(t).Element:!1}function V(t){return ft()?t instanceof HTMLElement||t instanceof W(t).HTMLElement:!1}function Ct(t){return!ft()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof W(t).ShadowRoot}function tt(t){const{overflow:e,overflowX:o,overflowY:n,display:r}=I(t);return/auto|scroll|overlay|hidden|clip/.test(e+n+o)&&!["inline","contents"].includes(r)}function zt(t){return["table","td","th"].includes(Z(t))}function at(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function yt(t){const e=vt(),o=M(t)?I(t):t;return o.transform!=="none"||o.perspective!=="none"||(o.containerType?o.containerType!=="normal":!1)||!e&&(o.backdropFilter?o.backdropFilter!=="none":!1)||!e&&(o.filter?o.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(o.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(o.contain||"").includes(n))}function Xt(t){let e=j(t);for(;V(e)&&!U(e);){if(yt(e))return e;if(at(e))return null;e=j(e)}return null}function vt(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function U(t){return["html","body","#document"].includes(Z(t))}function I(t){return W(t).getComputedStyle(t)}function ut(t){return M(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function j(t){if(Z(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Ct(t)&&t.host||_(t);return Ct(e)?e.host:e}function Mt(t){const e=j(t);return U(e)?t.ownerDocument?t.ownerDocument.body:t.body:V(e)&&tt(e)?e:Mt(e)}function G(t,e,o){var n;e===void 0&&(e=[]),o===void 0&&(o=!0);const r=Mt(t),i=r===((n=t.ownerDocument)==null?void 0:n.body),s=W(r);if(i){const c=pt(s);return e.concat(s,s.visualViewport||[],tt(r)?r:[],c&&o?G(c):[])}return e.concat(r,G(r,[],o))}function pt(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}const K=Math.min,X=Math.max,rt=Math.round,nt=Math.floor,z=t=>({x:t,y:t}),Yt={left:"right",right:"left",bottom:"top",top:"bottom"},qt={start:"end",end:"start"};function Ut(t,e,o){return X(t,K(e,o))}function dt(t,e){return typeof t=="function"?t(e):t}function Q(t){return t.split("-")[0]}function et(t){return t.split("-")[1]}function Kt(t){return t==="x"?"y":"x"}function Rt(t){return t==="y"?"height":"width"}function J(t){return["top","bottom"].includes(Q(t))?"y":"x"}function bt(t){return Kt(J(t))}function Qt(t,e,o){o===void 0&&(o=!1);const n=et(t),r=bt(t),i=Rt(r);let s=r==="x"?n===(o?"end":"start")?"right":"left":n==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(s=it(s)),[s,it(s)]}function Zt(t){const e=it(t);return[ht(t),e,ht(e)]}function ht(t){return t.replace(/start|end/g,e=>qt[e])}function Gt(t,e,o){const n=["left","right"],r=["right","left"],i=["top","bottom"],s=["bottom","top"];switch(t){case"top":case"bottom":return o?e?r:n:e?n:r;case"left":case"right":return e?i:s;default:return[]}}function Jt(t,e,o,n){const r=et(t);let i=Gt(Q(t),o==="start",n);return r&&(i=i.map(s=>s+"-"+r),e&&(i=i.concat(i.map(ht)))),i}function it(t){return t.replace(/left|right|bottom|top/g,e=>Yt[e])}function te(t){return{top:0,right:0,bottom:0,left:0,...t}}function kt(t){return typeof t!="number"?te(t):{top:t,right:t,bottom:t,left:t}}function st(t){const{x:e,y:o,width:n,height:r}=t;return{width:n,height:r,top:o,left:e,right:e+n,bottom:o+r,x:e,y:o}}function Ot(t,e,o){let{reference:n,floating:r}=t;const i=J(e),s=bt(e),c=Rt(s),f=Q(e),a=i==="y",u=n.x+n.width/2-r.width/2,d=n.y+n.height/2-r.height/2,g=n[c]/2-r[c]/2;let l;switch(f){case"top":l={x:u,y:n.y-r.height};break;case"bottom":l={x:u,y:n.y+n.height};break;case"right":l={x:n.x+n.width,y:d};break;case"left":l={x:n.x-r.width,y:d};break;default:l={x:n.x,y:n.y}}switch(et(e)){case"start":l[s]-=g*(o&&a?-1:1);break;case"end":l[s]+=g*(o&&a?-1:1);break}return l}const ee=async(t,e,o)=>{const{placement:n="bottom",strategy:r="absolute",middleware:i=[],platform:s}=o,c=i.filter(Boolean),f=await(s.isRTL==null?void 0:s.isRTL(e));let a=await s.getElementRects({reference:t,floating:e,strategy:r}),{x:u,y:d}=Ot(a,n,f),g=n,l={},p=0;for(let h=0;h<c.length;h++){const{name:y,fn:x}=c[h],{x:b,y:w,data:v,reset:R}=await x({x:u,y:d,initialPlacement:n,placement:g,strategy:r,middlewareData:l,rects:a,platform:s,elements:{reference:t,floating:e}});u=b??u,d=w??d,l={...l,[y]:{...l[y],...v}},R&&p<=50&&(p++,typeof R=="object"&&(R.placement&&(g=R.placement),R.rects&&(a=R.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:r}):R.rects),{x:u,y:d}=Ot(a,g,f)),h=-1)}return{x:u,y:d,placement:g,strategy:r,middlewareData:l}};async function ne(t,e){var o;e===void 0&&(e={});const{x:n,y:r,platform:i,rects:s,elements:c,strategy:f}=t,{boundary:a="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:g=!1,padding:l=0}=dt(e,t),p=kt(l),y=c[g?d==="floating"?"reference":"floating":d],x=st(await i.getClippingRect({element:(o=await(i.isElement==null?void 0:i.isElement(y)))==null||o?y:y.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(c.floating)),boundary:a,rootBoundary:u,strategy:f})),b=d==="floating"?{x:n,y:r,width:s.floating.width,height:s.floating.height}:s.reference,w=await(i.getOffsetParent==null?void 0:i.getOffsetParent(c.floating)),v=await(i.isElement==null?void 0:i.isElement(w))?await(i.getScale==null?void 0:i.getScale(w))||{x:1,y:1}:{x:1,y:1},R=st(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:c,rect:b,offsetParent:w,strategy:f}):b);return{top:(x.top-R.top+p.top)/v.y,bottom:(R.bottom-x.bottom+p.bottom)/v.y,left:(x.left-R.left+p.left)/v.x,right:(R.right-x.right+p.right)/v.x}}const oe=t=>({name:"arrow",options:t,async fn(e){const{x:o,y:n,placement:r,rects:i,platform:s,elements:c,middlewareData:f}=e,{element:a,padding:u=0}=dt(t,e)||{};if(a==null)return{};const d=kt(u),g={x:o,y:n},l=bt(r),p=Rt(l),h=await s.getDimensions(a),y=l==="y",x=y?"top":"left",b=y?"bottom":"right",w=y?"clientHeight":"clientWidth",v=i.reference[p]+i.reference[l]-g[l]-i.floating[p],R=g[l]-i.reference[l],O=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a));let A=O?O[w]:0;(!A||!await(s.isElement==null?void 0:s.isElement(O)))&&(A=c.floating[w]||i.floating[p]);const S=v/2-R/2,B=A/2-h[p]/2-1,F=K(d[x],B),$=K(d[b],B),L=F,k=A-h[p]-$,C=A/2-h[p]/2+S,N=Ut(L,C,k),P=!f.arrow&&et(r)!=null&&C!==N&&i.reference[p]/2-(C<L?F:$)-h[p]/2<0,T=P?C<L?C-L:C-k:0;return{[l]:g[l]+T,data:{[l]:N,centerOffset:C-N-T,...P&&{alignmentOffset:T}},reset:P}}}),re=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,n;const{placement:r,middlewareData:i,rects:s,initialPlacement:c,platform:f,elements:a}=e,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:g,fallbackStrategy:l="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:h=!0,...y}=dt(t,e);if((o=i.arrow)!=null&&o.alignmentOffset)return{};const x=Q(r),b=J(c),w=Q(c)===c,v=await(f.isRTL==null?void 0:f.isRTL(a.floating)),R=g||(w||!h?[it(c)]:Zt(c)),O=p!=="none";!g&&O&&R.push(...Jt(c,h,p,v));const A=[c,...R],S=await ne(e,y),B=[];let F=((n=i.flip)==null?void 0:n.overflows)||[];if(u&&B.push(S[x]),d){const C=Qt(r,s,v);B.push(S[C[0]],S[C[1]])}if(F=[...F,{placement:r,overflows:B}],!B.every(C=>C<=0)){var $,L;const C=((($=i.flip)==null?void 0:$.index)||0)+1,N=A[C];if(N)return{data:{index:C,overflows:F},reset:{placement:N}};let P=(L=F.filter(T=>T.overflows[0]<=0).sort((T,E)=>T.overflows[1]-E.overflows[1])[0])==null?void 0:L.placement;if(!P)switch(l){case"bestFit":{var k;const T=(k=F.filter(E=>{if(O){const D=J(E.placement);return D===b||D==="y"}return!0}).map(E=>[E.placement,E.overflows.filter(D=>D>0).reduce((D,H)=>D+H,0)]).sort((E,D)=>E[1]-D[1])[0])==null?void 0:k[0];T&&(P=T);break}case"initialPlacement":P=c;break}if(r!==P)return{reset:{placement:P}}}return{}}}};async function ie(t,e){const{placement:o,platform:n,elements:r}=t,i=await(n.isRTL==null?void 0:n.isRTL(r.floating)),s=Q(o),c=et(o),f=J(o)==="y",a=["left","top"].includes(s)?-1:1,u=i&&f?-1:1,d=dt(e,t);let{mainAxis:g,crossAxis:l,alignmentAxis:p}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return c&&typeof p=="number"&&(l=c==="end"?p*-1:p),f?{x:l*u,y:g*a}:{x:g*a,y:l*u}}const se=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,n;const{x:r,y:i,placement:s,middlewareData:c}=e,f=await ie(e,t);return s===((o=c.offset)==null?void 0:o.placement)&&(n=c.arrow)!=null&&n.alignmentOffset?{}:{x:r+f.x,y:i+f.y,data:{...f,placement:s}}}}};function Wt(t){const e=I(t);let o=parseFloat(e.width)||0,n=parseFloat(e.height)||0;const r=V(t),i=r?t.offsetWidth:o,s=r?t.offsetHeight:n,c=rt(o)!==i||rt(n)!==s;return c&&(o=i,n=s),{width:o,height:n,$:c}}function Et(t){return M(t)?t:t.contextElement}function q(t){const e=Et(t);if(!V(e))return z(1);const o=e.getBoundingClientRect(),{width:n,height:r,$:i}=Wt(e);let s=(i?rt(o.width):o.width)/n,c=(i?rt(o.height):o.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!c||!Number.isFinite(c))&&(c=1),{x:s,y:c}}const ce=z(0);function Bt(t){const e=W(t);return!vt()||!e.visualViewport?ce:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function le(t,e,o){return e===void 0&&(e=!1),!o||e&&o!==W(t)?!1:e}function Y(t,e,o,n){e===void 0&&(e=!1),o===void 0&&(o=!1);const r=t.getBoundingClientRect(),i=Et(t);let s=z(1);e&&(n?M(n)&&(s=q(n)):s=q(t));const c=le(i,o,n)?Bt(i):z(0);let f=(r.left+c.x)/s.x,a=(r.top+c.y)/s.y,u=r.width/s.x,d=r.height/s.y;if(i){const g=W(i),l=n&&M(n)?W(n):n;let p=g,h=pt(p);for(;h&&n&&l!==p;){const y=q(h),x=h.getBoundingClientRect(),b=I(h),w=x.left+(h.clientLeft+parseFloat(b.paddingLeft))*y.x,v=x.top+(h.clientTop+parseFloat(b.paddingTop))*y.y;f*=y.x,a*=y.y,u*=y.x,d*=y.y,f+=w,a+=v,p=W(h),h=pt(p)}}return st({width:u,height:d,x:f,y:a})}function fe(t){let{elements:e,rect:o,offsetParent:n,strategy:r}=t;const i=r==="fixed",s=_(n),c=e?at(e.floating):!1;if(n===s||c&&i)return o;let f={scrollLeft:0,scrollTop:0},a=z(1);const u=z(0),d=V(n);if((d||!d&&!i)&&((Z(n)!=="body"||tt(s))&&(f=ut(n)),V(n))){const g=Y(n);a=q(n),u.x=g.x+n.clientLeft,u.y=g.y+n.clientTop}return{width:o.width*a.x,height:o.height*a.y,x:o.x*a.x-f.scrollLeft*a.x+u.x,y:o.y*a.y-f.scrollTop*a.y+u.y}}function ae(t){return Array.from(t.getClientRects())}function wt(t,e){const o=ut(t).scrollLeft;return e?e.left+o:Y(_(t)).left+o}function ue(t){const e=_(t),o=ut(t),n=t.ownerDocument.body,r=X(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),i=X(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight);let s=-o.scrollLeft+wt(t);const c=-o.scrollTop;return I(n).direction==="rtl"&&(s+=X(e.clientWidth,n.clientWidth)-r),{width:r,height:i,x:s,y:c}}function de(t,e){const o=W(t),n=_(t),r=o.visualViewport;let i=n.clientWidth,s=n.clientHeight,c=0,f=0;if(r){i=r.width,s=r.height;const a=vt();(!a||a&&e==="fixed")&&(c=r.offsetLeft,f=r.offsetTop)}return{width:i,height:s,x:c,y:f}}function me(t,e){const o=Y(t,!0,e==="fixed"),n=o.top+t.clientTop,r=o.left+t.clientLeft,i=V(t)?q(t):z(1),s=t.clientWidth*i.x,c=t.clientHeight*i.y,f=r*i.x,a=n*i.y;return{width:s,height:c,x:f,y:a}}function At(t,e,o){let n;if(e==="viewport")n=de(t,o);else if(e==="document")n=ue(_(t));else if(M(e))n=me(e,o);else{const r=Bt(t);n={...e,x:e.x-r.x,y:e.y-r.y}}return st(n)}function $t(t,e){const o=j(t);return o===e||!M(o)||U(o)?!1:I(o).position==="fixed"||$t(o,e)}function ge(t,e){const o=e.get(t);if(o)return o;let n=G(t,[],!1).filter(c=>M(c)&&Z(c)!=="body"),r=null;const i=I(t).position==="fixed";let s=i?j(t):t;for(;M(s)&&!U(s);){const c=I(s),f=yt(s);!f&&c.position==="fixed"&&(r=null),(i?!f&&!r:!f&&c.position==="static"&&!!r&&["absolute","fixed"].includes(r.position)||tt(s)&&!f&&$t(t,s))?n=n.filter(u=>u!==s):r=c,s=j(s)}return e.set(t,n),n}function pe(t){let{element:e,boundary:o,rootBoundary:n,strategy:r}=t;const s=[...o==="clippingAncestors"?at(e)?[]:ge(e,this._c):[].concat(o),n],c=s[0],f=s.reduce((a,u)=>{const d=At(e,u,r);return a.top=X(d.top,a.top),a.right=K(d.right,a.right),a.bottom=K(d.bottom,a.bottom),a.left=X(d.left,a.left),a},At(e,c,r));return{width:f.right-f.left,height:f.bottom-f.top,x:f.left,y:f.top}}function he(t){const{width:e,height:o}=Wt(t);return{width:e,height:o}}function we(t,e,o){const n=V(e),r=_(e),i=o==="fixed",s=Y(t,!0,i,e);let c={scrollLeft:0,scrollTop:0};const f=z(0);if(n||!n&&!i)if((Z(e)!=="body"||tt(r))&&(c=ut(e)),n){const l=Y(e,!0,i,e);f.x=l.x+e.clientLeft,f.y=l.y+e.clientTop}else r&&(f.x=wt(r));let a=0,u=0;if(r&&!n&&!i){const l=r.getBoundingClientRect();u=l.top+c.scrollTop,a=l.left+c.scrollLeft-wt(r,l)}const d=s.left+c.scrollLeft-f.x-a,g=s.top+c.scrollTop-f.y-u;return{x:d,y:g,width:s.width,height:s.height}}function mt(t){return I(t).position==="static"}function Pt(t,e){if(!V(t)||I(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return _(t)===o&&(o=o.ownerDocument.body),o}function It(t,e){const o=W(t);if(at(t))return o;if(!V(t)){let r=j(t);for(;r&&!U(r);){if(M(r)&&!mt(r))return r;r=j(r)}return o}let n=Pt(t,e);for(;n&&zt(n)&&mt(n);)n=Pt(n,e);return n&&U(n)&&mt(n)&&!yt(n)?o:n||Xt(t)||o}const xe=async function(t){const e=this.getOffsetParent||It,o=this.getDimensions,n=await o(t.floating);return{reference:we(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:n.width,height:n.height}}};function ye(t){return I(t).direction==="rtl"}const ve={convertOffsetParentRelativeRectToViewportRelativeRect:fe,getDocumentElement:_,getClippingRect:pe,getOffsetParent:It,getElementRects:xe,getClientRects:ae,getDimensions:he,getScale:q,isElement:M,isRTL:ye};function Re(t,e){let o=null,n;const r=_(t);function i(){var c;clearTimeout(n),(c=o)==null||c.disconnect(),o=null}function s(c,f){c===void 0&&(c=!1),f===void 0&&(f=1),i();const{left:a,top:u,width:d,height:g}=t.getBoundingClientRect();if(c||e(),!d||!g)return;const l=nt(u),p=nt(r.clientWidth-(a+d)),h=nt(r.clientHeight-(u+g)),y=nt(a),b={rootMargin:-l+"px "+-p+"px "+-h+"px "+-y+"px",threshold:X(0,K(1,f))||1};let w=!0;function v(R){const O=R[0].intersectionRatio;if(O!==f){if(!w)return s();O?s(!1,O):n=setTimeout(()=>{s(!1,1e-7)},1e3)}w=!1}try{o=new IntersectionObserver(v,{...b,root:r.ownerDocument})}catch{o=new IntersectionObserver(v,b)}o.observe(t)}return s(!0),i}function _e(t,e,o,n){n===void 0&&(n={});const{ancestorScroll:r=!0,ancestorResize:i=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:c=typeof IntersectionObserver=="function",animationFrame:f=!1}=n,a=Et(t),u=r||i?[...a?G(a):[],...G(e)]:[];u.forEach(x=>{r&&x.addEventListener("scroll",o,{passive:!0}),i&&x.addEventListener("resize",o)});const d=a&&c?Re(a,o):null;let g=-1,l=null;s&&(l=new ResizeObserver(x=>{let[b]=x;b&&b.target===a&&l&&(l.unobserve(e),cancelAnimationFrame(g),g=requestAnimationFrame(()=>{var w;(w=l)==null||w.observe(e)})),o()}),a&&!f&&l.observe(a),l.observe(e));let p,h=f?Y(t):null;f&&y();function y(){const x=Y(t);h&&(x.x!==h.x||x.y!==h.y||x.width!==h.width||x.height!==h.height)&&o(),h=x,p=requestAnimationFrame(y)}return o(),()=>{var x;u.forEach(b=>{r&&b.removeEventListener("scroll",o),i&&b.removeEventListener("resize",o)}),d==null||d(),(x=l)==null||x.disconnect(),l=null,f&&cancelAnimationFrame(p)}}const be=se,Ee=re,St=oe,Ce=(t,e,o)=>{const n=new Map,r={platform:ve,...o},i={...r.platform,_c:n};return ee(t,e,{...r,platform:i})};var ot=typeof document<"u"?m.useLayoutEffect:m.useEffect;function ct(t,e){if(t===e)return!0;if(typeof t!=typeof e)return!1;if(typeof t=="function"&&t.toString()===e.toString())return!0;let o,n,r;if(t&&e&&typeof t=="object"){if(Array.isArray(t)){if(o=t.length,o!==e.length)return!1;for(n=o;n--!==0;)if(!ct(t[n],e[n]))return!1;return!0}if(r=Object.keys(t),o=r.length,o!==Object.keys(e).length)return!1;for(n=o;n--!==0;)if(!{}.hasOwnProperty.call(e,r[n]))return!1;for(n=o;n--!==0;){const i=r[n];if(!(i==="_owner"&&t.$$typeof)&&!ct(t[i],e[i]))return!1}return!0}return t!==t&&e!==e}function Nt(t){return typeof window>"u"?1:(t.ownerDocument.defaultView||window).devicePixelRatio||1}function Lt(t,e){const o=Nt(t);return Math.round(e*o)/o}function gt(t){const e=m.useRef(t);return ot(()=>{e.current=t}),e}function Oe(t){t===void 0&&(t={});const{placement:e="bottom",strategy:o="absolute",middleware:n=[],platform:r,elements:{reference:i,floating:s}={},transform:c=!0,whileElementsMounted:f,open:a}=t,[u,d]=m.useState({x:0,y:0,strategy:o,placement:e,middlewareData:{},isPositioned:!1}),[g,l]=m.useState(n);ct(g,n)||l(n);const[p,h]=m.useState(null),[y,x]=m.useState(null),b=m.useCallback(E=>{E!==O.current&&(O.current=E,h(E))},[]),w=m.useCallback(E=>{E!==A.current&&(A.current=E,x(E))},[]),v=i||p,R=s||y,O=m.useRef(null),A=m.useRef(null),S=m.useRef(u),B=f!=null,F=gt(f),$=gt(r),L=gt(a),k=m.useCallback(()=>{if(!O.current||!A.current)return;const E={placement:e,strategy:o,middleware:g};$.current&&(E.platform=$.current),Ce(O.current,A.current,E).then(D=>{const H={...D,isPositioned:L.current!==!1};C.current&&!ct(S.current,H)&&(S.current=H,jt.flushSync(()=>{d(H)}))})},[g,e,o,$,L]);ot(()=>{a===!1&&S.current.isPositioned&&(S.current.isPositioned=!1,d(E=>({...E,isPositioned:!1})))},[a]);const C=m.useRef(!1);ot(()=>(C.current=!0,()=>{C.current=!1}),[]),ot(()=>{if(v&&(O.current=v),R&&(A.current=R),v&&R){if(F.current)return F.current(v,R,k);k()}},[v,R,k,F,B]);const N=m.useMemo(()=>({reference:O,floating:A,setReference:b,setFloating:w}),[b,w]),P=m.useMemo(()=>({reference:v,floating:R}),[v,R]),T=m.useMemo(()=>{const E={position:o,left:0,top:0};if(!P.floating)return E;const D=Lt(P.floating,u.x),H=Lt(P.floating,u.y);return c?{...E,transform:"translate("+D+"px, "+H+"px)",...Nt(P.floating)>=1.5&&{willChange:"transform"}}:{position:o,left:D,top:H}},[o,c,P.floating,u.x,u.y]);return m.useMemo(()=>({...u,update:k,refs:N,elements:P,floatingStyles:T}),[u,k,N,P,T])}const Ae=t=>{function e(o){return{}.hasOwnProperty.call(o,"current")}return{name:"arrow",options:t,fn(o){const{element:n,padding:r}=typeof t=="function"?t(o):t;return n&&e(n)?n.current!=null?St({element:n.current,padding:r}).fn(o):{}:n?St({element:n,padding:r}).fn(o):{}}}},He=(t,e)=>({...be(t),options:[t,e]}),je=(t,e)=>({...Ee(t),options:[t,e]}),ze=(t,e)=>({...Ae(t),options:[t,e]}),Vt={...Ht},Pe=Vt.useInsertionEffect,Se=Pe||(t=>t());function Le(t){const e=m.useRef(()=>{});return Se(()=>{e.current=t}),m.useCallback(function(){for(var o=arguments.length,n=new Array(o),r=0;r<o;r++)n[r]=arguments[r];return e.current==null?void 0:e.current(...n)},[])}var lt=typeof document<"u"?m.useLayoutEffect:m.useEffect;function xt(){return xt=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])}return t},xt.apply(this,arguments)}let Tt=!1,Te=0;const Dt=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+Te++;function De(){const[t,e]=m.useState(()=>Tt?Dt():void 0);return lt(()=>{t==null&&e(Dt())},[]),m.useEffect(()=>{Tt=!0},[]),t}const Fe=Vt.useId,_t=Fe||De,Xe=m.forwardRef(function(e,o){const{context:{placement:n,elements:{floating:r},middlewareData:{arrow:i,shift:s}},width:c=14,height:f=7,tipRadius:a=0,strokeWidth:u=0,staticOffset:d,stroke:g,d:l,style:{transform:p,...h}={},...y}=e,x=_t(),[b,w]=m.useState(!1);if(lt(()=>{if(!r)return;I(r).direction==="rtl"&&w(!0)},[r]),!r)return null;const[v,R]=n.split("-"),O=v==="top"||v==="bottom";let A=d;(O&&s!=null&&s.x||!O&&s!=null&&s.y)&&(A=null);const S=u*2,B=S/2,F=c/2*(a/-8+1),$=f/2*a/4,L=!!l,k=A&&R==="end"?"bottom":"top";let C=A&&R==="end"?"right":"left";A&&b&&(C=R==="end"?"left":"right");const N=(i==null?void 0:i.x)!=null?A||i.x:"",P=(i==null?void 0:i.y)!=null?A||i.y:"",T=l||"M0,0"+(" H"+c)+(" L"+(c-F)+","+(f-$))+(" Q"+c/2+","+f+" "+F+","+(f-$))+" Z",E={top:L?"rotate(180deg)":"",left:L?"rotate(90deg)":"rotate(-90deg)",bottom:L?"":"rotate(180deg)",right:L?"rotate(-90deg)":"rotate(90deg)"}[v];return m.createElement("svg",xt({},y,{"aria-hidden":!0,ref:o,width:L?c:c+S,height:c,viewBox:"0 0 "+c+" "+(f>c?f:c),style:{position:"absolute",pointerEvents:"none",[C]:N,[k]:P,[v]:O||L?"100%":"calc(100% - "+S/2+"px)",transform:[E,p].filter(D=>!!D).join(" "),...h}}),S>0&&m.createElement("path",{clipPath:"url(#"+x+")",fill:"none",stroke:g,strokeWidth:S+(l?0:1),d:T}),m.createElement("path",{stroke:S&&!l?y.fill:"none",d:T}),m.createElement("clipPath",{id:x},m.createElement("rect",{x:-B,y:B*(L?-1:1),width:c+S,height:c})))});function Me(){const t=new Map;return{emit(e,o){var n;(n=t.get(e))==null||n.forEach(r=>r(o))},on(e,o){t.set(e,[...t.get(e)||[],o])},off(e,o){var n;t.set(e,((n=t.get(e))==null?void 0:n.filter(r=>r!==o))||[])}}}const ke=m.createContext(null),We=m.createContext(null),Be=()=>{var t;return((t=m.useContext(ke))==null?void 0:t.id)||null},$e=()=>m.useContext(We);function Ie(t){const{open:e=!1,onOpenChange:o,elements:n}=t,r=_t(),i=m.useRef({}),[s]=m.useState(()=>Me()),c=Be()!=null,[f,a]=m.useState(n.reference),u=Le((l,p,h)=>{i.current.openEvent=l?p:void 0,s.emit("openchange",{open:l,event:p,reason:h,nested:c}),o==null||o(l,p,h)}),d=m.useMemo(()=>({setPositionReference:a}),[]),g=m.useMemo(()=>({reference:f||n.reference||null,floating:n.floating||null,domReference:n.reference}),[f,n.reference,n.floating]);return m.useMemo(()=>({dataRef:i,open:e,onOpenChange:u,elements:g,events:s,floatingId:r,refs:d}),[e,u,g,s,r,d])}function Ye(t){t===void 0&&(t={});const{nodeId:e}=t,o=Ie({...t,elements:{reference:null,floating:null,...t.elements}}),n=t.rootContext||o,r=n.elements,[i,s]=m.useState(null),[c,f]=m.useState(null),u=(r==null?void 0:r.reference)||i,d=m.useRef(null),g=$e();lt(()=>{u&&(d.current=u)},[u]);const l=Oe({...t,elements:{...r,...c&&{reference:c}}}),p=m.useCallback(w=>{const v=M(w)?{getBoundingClientRect:()=>w.getBoundingClientRect(),contextElement:w}:w;f(v),l.refs.setReference(v)},[l.refs]),h=m.useCallback(w=>{(M(w)||w===null)&&(d.current=w,s(w)),(M(l.refs.reference.current)||l.refs.reference.current===null||w!==null&&!M(w))&&l.refs.setReference(w)},[l.refs]),y=m.useMemo(()=>({...l.refs,setReference:h,setPositionReference:p,domReference:d}),[l.refs,h,p]),x=m.useMemo(()=>({...l.elements,domReference:u}),[l.elements,u]),b=m.useMemo(()=>({...l,...n,refs:y,elements:x,nodeId:e}),[l,y,x,e,n]);return lt(()=>{n.dataRef.current.floatingContext=b;const w=g==null?void 0:g.nodesRef.current.find(v=>v.id===e);w&&(w.context=b)}),m.useMemo(()=>({...l,context:b,refs:y,elements:x}),[l,y,x,b])}export{Xe as F,_e as a,ze as b,je as f,He as o,Ye as u};
