import{r as a,j as e}from"./react-a77fd2f7.js";import{a as C}from"./axios-439bb627.js";import{T as i,G as s,k as r,l as k,I,V as w,m as K,B as R}from"./@mui-8614f4c2.js";import"./classnames-bdcd0ee0.js";import"./clsx-5a9f8d06.js";import"./react-transition-group-a3d248ce.js";import"./@babel-591e0485.js";import"./react-dom-ea7d9bdf.js";import"./scheduler-765c72db.js";import"./@emotion-d65f2bd3.js";import"./hoist-non-react-statics-3f8ebaa8.js";import"./stylis-79144faa.js";const W="/assets/adminpage-25b220be.jpg",q=({onLogin:h})=>{const[l,p]=a.useState(""),[o,g]=a.useState(""),[c,j]=a.useState(""),[m,b]=a.useState(""),[d,v]=a.useState(""),[u,y]=a.useState(""),[n,f]=a.useState(!1),[x,N]=a.useState(""),S=async t=>{t.preventDefault();const A={bucketName:l,cloudFrontDomain:o,cloudAccessKeyId:c,secretAccessKey:m,regionName:d,rtspUrl:u};try{await C.post("http://localhost:5000/save-admin-details",A),h("/admin-dashboard")}catch{N("Error saving admin details")}};return e.jsx("div",{className:"flex min-h-screen",children:e.jsx("div",{className:"flex-1 flex items-center justify-center",style:{backgroundImage:`url(${W})`,backgroundSize:"cover",backgroundPosition:"center"},children:e.jsxs("div",{className:"backdrop-blur-md bg-white bg-opacity-50 p-8 rounded-lg shadow-lg max-w-md w-full",children:[e.jsx(i,{variant:"h4",component:"h2",className:"mb-6 text-center text-gray-800",children:"Admin Login"}),x&&e.jsx(i,{color:"error",className:"mb-4 text-center",children:x}),e.jsxs("form",{onSubmit:S,className:"space-y-6",children:[e.jsx(i,{variant:"h6",className:"text-gray-700 text-center pt-10",children:"Cloud Settings"}),e.jsxs(s,{container:!0,spacing:2,children:[e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"Bucket Name",variant:"outlined",fullWidth:!0,value:l,onChange:t=>p(t.target.value),className:"mb-4"})}),e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"CloudFront Domain URL",variant:"outlined",fullWidth:!0,value:o,onChange:t=>g(t.target.value),className:"mb-4"})})]}),e.jsxs(s,{container:!0,spacing:2,children:[e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"Cloud Access Key ID",variant:"outlined",fullWidth:!0,value:c,onChange:t=>j(t.target.value),className:"mb-4"})}),e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"Secret Access Key",variant:"outlined",fullWidth:!0,type:n?"text":"password",value:m,onChange:t=>b(t.target.value),InputProps:{endAdornment:e.jsx(k,{position:"end",children:e.jsx(I,{onClick:()=>f(!n),edge:"end",children:n?e.jsx(w,{}):e.jsx(K,{})})})},className:"mb-4"})})]}),e.jsxs(s,{container:!0,spacing:2,children:[e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"Region Name",variant:"outlined",fullWidth:!0,value:d,onChange:t=>v(t.target.value),className:"mb-4"})}),e.jsx(s,{item:!0,xs:12,sm:6,children:e.jsx(r,{label:"RTSP URL",variant:"outlined",fullWidth:!0,value:u,onChange:t=>y(t.target.value),className:"mb-4"})})]}),e.jsx(R,{type:"submit",variant:"contained",color:"primary",fullWidth:!0,className:"py-2",children:"Sign in"})]})]})})})};export{q as default};
