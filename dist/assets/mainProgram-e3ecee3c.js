import{r as a,j as t}from"./react-a77fd2f7.js";import"./classnames-bdcd0ee0.js";const u=()=>{const[s,o]=a.useState(""),[n,c]=a.useState(!0),[r,l]=a.useState(null);return a.useEffect(()=>{(async()=>{try{const e=await fetch("http://localhost:5000/main-program");if(!e.ok)throw new Error("Network response was not ok");const i=await e.text();o(i)}catch(e){l(e.message)}finally{c(!1)}})()},[]),n?t.jsx("div",{className:"text-center text-blue-500",children:"Loading..."}):r?t.jsxs("div",{className:"text-center text-red-500",children:["Error: ",r]}):t.jsxs("div",{className:"max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md",children:[t.jsx("h1",{className:"text-2xl font-bold text-gray-800 mb-4",children:"Main Program Data"}),t.jsx("p",{className:"text-gray-700",children:s})]})};export{u as default};
