import{r as L,w as Bt,o as G}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{R as Lt,M as Er,I as Gr,S as Mr,D as kt,a as Zr,H as Me,F as De,b as Ge,L as Re,c as tr,d as zt,C as Le,e as Wr,O as Pt,P as Xr,W as jr,U as pr,f as Ht,g as Gt,h as wr,T as Ze,i as Zt,j as Wt,k as Xt,B as jt,l as Yt,m as _r,n as $t,o as qt,p as zr,q as Vt,r as hr,N as Kt,V as Ke,u as ar,s as nr,t as Qt,E as Jt,v as ea,w as ra,_ as ta,x as aa,y as vr,z as na,A as Pr,G as ia,J as oa,K as sa,Q as la,X as ca,Y as ua}from"./OrbitControls-CIYDMInU.js";import{j as ha}from"./three-custom-shader-material.es-BBoU3hlk.js";import{L as pa,u as er}from"./leva.esm-rd6fLeBd.js";import{m as va}from"./BufferGeometryUtils-BdaFPgzX.js";import{a as da}from"./asset-BvcpElq9.js";import{u as ma}from"./Helper-C9U5mWbx.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DomXwfiO.js";import"./index-XD7JBPcQ.js";import"./client-Cu2R2QOy.js";import"./index-C_sia4Et.js";const Yr=parseInt(Lt.replace(/\D+/g,""));var Ee=Uint8Array,ke=Uint16Array,yr=Uint32Array,$r=new Ee([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),qr=new Ee([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ga=new Ee([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Vr=function(i,t){for(var n=new ke(31),s=0;s<31;++s)n[s]=t+=1<<i[s-1];for(var u=new yr(n[30]),s=1;s<30;++s)for(var h=n[s];h<n[s+1];++h)u[h]=h-n[s]<<5|s;return[n,u]},Kr=Vr($r,2),Qr=Kr[0],fa=Kr[1];Qr[28]=258,fa[258]=28;var wa=Vr(qr,0),_a=wa[0],xr=new ke(32768);for(var ee=0;ee<32768;++ee){var Be=(ee&43690)>>>1|(ee&21845)<<1;Be=(Be&52428)>>>2|(Be&13107)<<2,Be=(Be&61680)>>>4|(Be&3855)<<4,xr[ee]=((Be&65280)>>>8|(Be&255)<<8)>>>1}var rr=(function(i,t,n){for(var s=i.length,u=0,h=new ke(t);u<s;++u)++h[i[u]-1];var p=new ke(t);for(u=0;u<t;++u)p[u]=p[u-1]+h[u-1]<<1;var x;if(n){x=new ke(1<<t);var d=15-t;for(u=0;u<s;++u)if(i[u])for(var m=u<<4|i[u],A=t-i[u],b=p[i[u]-1]++<<A,T=b|(1<<A)-1;b<=T;++b)x[xr[b]>>>d]=m}else for(x=new ke(s),u=0;u<s;++u)i[u]&&(x[u]=xr[p[i[u]-1]++]>>>15-i[u]);return x}),or=new Ee(288);for(var ee=0;ee<144;++ee)or[ee]=8;for(var ee=144;ee<256;++ee)or[ee]=9;for(var ee=256;ee<280;++ee)or[ee]=7;for(var ee=280;ee<288;++ee)or[ee]=8;var Jr=new Ee(32);for(var ee=0;ee<32;++ee)Jr[ee]=5;var ya=rr(or,9,1),xa=rr(Jr,5,1),gr=function(i){for(var t=i[0],n=1;n<i.length;++n)i[n]>t&&(t=i[n]);return t},Ce=function(i,t,n){var s=t/8|0;return(i[s]|i[s+1]<<8)>>(t&7)&n},fr=function(i,t){var n=t/8|0;return(i[n]|i[n+1]<<8|i[n+2]<<16)>>(t&7)},Ea=function(i){return(i/8|0)+(i&7&&1)},Ma=function(i,t,n){(n==null||n>i.length)&&(n=i.length);var s=new(i instanceof ke?ke:i instanceof yr?yr:Ee)(n-t);return s.set(i.subarray(t,n)),s},Sa=function(i,t,n){var s=i.length;if(!s||n&&!n.l&&s<5)return t||new Ee(0);var u=!t||n,h=!n||n.i;n||(n={}),t||(t=new Ee(s*3));var p=function(Y){var Ae=t.length;if(Y>Ae){var Fe=new Ee(Math.max(Ae*2,Y));Fe.set(t),t=Fe}},x=n.f||0,d=n.p||0,m=n.b||0,A=n.l,b=n.d,T=n.m,z=n.n,W=s*8;do{if(!A){n.f=x=Ce(i,d,1);var pe=Ce(i,d+1,3);if(d+=3,pe)if(pe==1)A=ya,b=xa,T=9,z=5;else if(pe==2){var ve=Ce(i,d,31)+257,le=Ce(i,d+10,15)+4,P=ve+Ce(i,d+5,31)+1;d+=14;for(var N=new Ee(P),re=new Ee(19),E=0;E<le;++E)re[ga[E]]=Ce(i,d+E*3,7);d+=le*3;for(var S=gr(re),k=(1<<S)-1,X=rr(re,S,1),E=0;E<P;){var B=X[Ce(i,d,k)];d+=B&15;var j=B>>>4;if(j<16)N[E++]=j;else{var H=0,R=0;for(j==16?(R=3+Ce(i,d,3),d+=2,H=N[E-1]):j==17?(R=3+Ce(i,d,7),d+=3):j==18&&(R=11+Ce(i,d,127),d+=7);R--;)N[E++]=H}}var te=N.subarray(0,ve),D=N.subarray(ve);T=gr(te),z=gr(D),A=rr(te,T,1),b=rr(D,z,1)}else throw"invalid block type";else{var j=Ea(d)+4,oe=i[j-4]|i[j-3]<<8,se=j+oe;if(se>s){if(h)throw"unexpected EOF";break}u&&p(m+oe),t.set(i.subarray(j,se),m),n.b=m+=oe,n.p=d=se*8;continue}if(d>W){if(h)throw"unexpected EOF";break}}u&&p(m+131072);for(var Se=(1<<T)-1,ze=(1<<z)-1,Ie=d;;Ie=d){var H=A[fr(i,d)&Se],Q=H>>>4;if(d+=H&15,d>W){if(h)throw"unexpected EOF";break}if(!H)throw"invalid length/literal";if(Q<256)t[m++]=Q;else if(Q==256){Ie=d,A=null;break}else{var Ne=Q-254;if(Q>264){var E=Q-257,ae=$r[E];Ne=Ce(i,d,(1<<ae)-1)+Qr[E],d+=ae}var he=b[fr(i,d)&ze],Te=he>>>4;if(!he)throw"invalid distance";d+=he&15;var D=_a[Te];if(Te>3){var ae=qr[Te];D+=fr(i,d)&(1<<ae)-1,d+=ae}if(d>W){if(h)throw"unexpected EOF";break}u&&p(m+131072);for(var Xe=m+Ne;m<Xe;m+=4)t[m]=t[m-D],t[m+1]=t[m+1-D],t[m+2]=t[m+2-D],t[m+3]=t[m+3-D];m=Xe}}n.l=A,n.p=Ie,n.b=m,A&&(x=1,n.m=T,n.d=b,n.n=z)}while(!x);return m==t.length?t:Ma(t,0,m)},Ia=new Ee(0),Ca=function(i){if((i[0]&15)!=8||i[0]>>>4>7||(i[0]<<8|i[1])%31)throw"invalid zlib data";if(i[1]&32)throw"invalid zlib data: preset dictionaries not supported"};function cr(i,t){return Sa((Ca(i),i.subarray(2,-4)),t)}var Ta=typeof TextDecoder<"u"&&new TextDecoder,ba=0;try{Ta.decode(Ia,{stream:!0}),ba=1}catch{}const Ra=i=>i&&i.isCubeTexture;class Aa extends Er{constructor(t,n){var s,u;const h=Ra(t),x=((u=h?(s=t.image[0])==null?void 0:s.width:t.image.width)!=null?u:1024)/4,d=Math.floor(Math.log2(x)),m=Math.pow(2,d),A=3*Math.max(m,112),b=4*m,T=[h?"#define ENVMAP_TYPE_CUBE":"",`#define CUBEUV_TEXEL_WIDTH ${1/A}`,`#define CUBEUV_TEXEL_HEIGHT ${1/b}`,`#define CUBEUV_MAX_MIP ${d}.0`],z=`
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,W=T.join(`
`)+`
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${Yr>=154?"colorspace_fragment":"encodings_fragment"}>
        }
        `,pe={map:{value:t},height:{value:n?.height||15},radius:{value:n?.radius||100}},j=new Gr(1,16),oe=new Mr({uniforms:pe,fragmentShader:W,vertexShader:z,side:kt});super(j,oe)}set radius(t){this.material.uniforms.radius.value=t}get radius(){return this.material.uniforms.radius.value}set height(t){this.material.uniforms.height.value=t}get height(){return this.material.uniforms.height.value}}class Fa extends Zr{constructor(t){super(t),this.type=Me}parse(t){const p=function(E,S){switch(E){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(S||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(S||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(S||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(S||""))}},b=function(E,S,k){S=S||1024;let B=E.pos,H=-1,R=0,te="",D=String.fromCharCode.apply(null,new Uint16Array(E.subarray(B,B+128)));for(;0>(H=D.indexOf(`
`))&&R<S&&B<E.byteLength;)te+=D,R+=D.length,B+=128,D+=String.fromCharCode.apply(null,new Uint16Array(E.subarray(B,B+128)));return-1<H?(E.pos+=R+H+1,te+D.slice(0,H)):!1},T=function(E){const S=/^#\?(\S+)/,k=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,X=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,B=/^\s*FORMAT=(\S+)\s*$/,H=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,R={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let te,D;for((E.pos>=E.byteLength||!(te=b(E)))&&p(1,"no header found"),(D=te.match(S))||p(3,"bad initial token"),R.valid|=1,R.programtype=D[1],R.string+=te+`
`;te=b(E),te!==!1;){if(R.string+=te+`
`,te.charAt(0)==="#"){R.comments+=te+`
`;continue}if((D=te.match(k))&&(R.gamma=parseFloat(D[1])),(D=te.match(X))&&(R.exposure=parseFloat(D[1])),(D=te.match(B))&&(R.valid|=2,R.format=D[1]),(D=te.match(H))&&(R.valid|=4,R.height=parseInt(D[1],10),R.width=parseInt(D[2],10)),R.valid&2&&R.valid&4)break}return R.valid&2||p(3,"missing format specifier"),R.valid&4||p(3,"missing image size specifier"),R},z=function(E,S,k){const X=S;if(X<8||X>32767||E[0]!==2||E[1]!==2||E[2]&128)return new Uint8Array(E);X!==(E[2]<<8|E[3])&&p(3,"wrong scanline width");const B=new Uint8Array(4*S*k);B.length||p(4,"unable to allocate buffer space");let H=0,R=0;const te=4*X,D=new Uint8Array(4),Se=new Uint8Array(te);let ze=k;for(;ze>0&&R<E.byteLength;){R+4>E.byteLength&&p(1),D[0]=E[R++],D[1]=E[R++],D[2]=E[R++],D[3]=E[R++],(D[0]!=2||D[1]!=2||(D[2]<<8|D[3])!=X)&&p(3,"bad rgbe scanline format");let Ie=0,Q;for(;Ie<te&&R<E.byteLength;){Q=E[R++];const ae=Q>128;if(ae&&(Q-=128),(Q===0||Ie+Q>te)&&p(3,"bad scanline data"),ae){const he=E[R++];for(let Te=0;Te<Q;Te++)Se[Ie++]=he}else Se.set(E.subarray(R,R+Q),Ie),Ie+=Q,R+=Q}const Ne=X;for(let ae=0;ae<Ne;ae++){let he=0;B[H]=Se[ae+he],he+=X,B[H+1]=Se[ae+he],he+=X,B[H+2]=Se[ae+he],he+=X,B[H+3]=Se[ae+he],H+=4}ze--}return B},W=function(E,S,k,X){const B=E[S+3],H=Math.pow(2,B-128)/255;k[X+0]=E[S+0]*H,k[X+1]=E[S+1]*H,k[X+2]=E[S+2]*H,k[X+3]=1},pe=function(E,S,k,X){const B=E[S+3],H=Math.pow(2,B-128)/255;k[X+0]=Ge.toHalfFloat(Math.min(E[S+0]*H,65504)),k[X+1]=Ge.toHalfFloat(Math.min(E[S+1]*H,65504)),k[X+2]=Ge.toHalfFloat(Math.min(E[S+2]*H,65504)),k[X+3]=Ge.toHalfFloat(1)},j=new Uint8Array(t);j.pos=0;const oe=T(j),se=oe.width,ve=oe.height,le=z(j.subarray(j.pos),se,ve);let P,N,re;switch(this.type){case De:re=le.length/4;const E=new Float32Array(re*4);for(let k=0;k<re;k++)W(le,k*4,E,k*4);P=E,N=De;break;case Me:re=le.length/4;const S=new Uint16Array(re*4);for(let k=0;k<re;k++)pe(le,k*4,S,k*4);P=S,N=Me;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:se,height:ve,data:P,header:oe.string,gamma:oe.gamma,exposure:oe.exposure,type:N}}setDataType(t){return this.type=t,this}load(t,n,s,u){function h(p,x){switch(p.type){case De:case Me:"colorSpace"in p?p.colorSpace="srgb-linear":p.encoding=3e3,p.minFilter=Re,p.magFilter=Re,p.generateMipmaps=!1,p.flipY=!0;break}n&&n(p,x)}return super.load(t,h,s,u)}}const Qe=Yr>=152;class Ua extends Zr{constructor(t){super(t),this.type=Me}parse(t){const S=Math.pow(2.7182818,2.2);function k(e,r){for(var a=0,o=0;o<65536;++o)(o==0||e[o>>3]&1<<(o&7))&&(r[a++]=o);for(var l=a-1;a<65536;)r[a++]=0;return l}function X(e){for(var r=0;r<16384;r++)e[r]={},e[r].len=0,e[r].lit=0,e[r].p=null}const B={l:0,c:0,lc:0};function H(e,r,a,o,l){for(;a<e;)r=r<<8|Lr(o,l),a+=8;a-=e,B.l=r>>a&(1<<e)-1,B.c=r,B.lc=a}const R=new Array(59);function te(e){for(var r=0;r<=58;++r)R[r]=0;for(var r=0;r<65537;++r)R[e[r]]+=1;for(var a=0,r=58;r>0;--r){var o=a+R[r]>>1;R[r]=a,a=o}for(var r=0;r<65537;++r){var l=e[r];l>0&&(e[r]=l|R[l]++<<6)}}function D(e,r,a,o,l,c,g){for(var v=a,_=0,w=0;l<=c;l++){if(v.value-a.value>o)return!1;H(6,_,w,e,v);var y=B.l;if(_=B.c,w=B.lc,g[l]=y,y==63){if(v.value-a.value>o)throw"Something wrong with hufUnpackEncTable";H(8,_,w,e,v);var f=B.l+6;if(_=B.c,w=B.lc,l+f>c+1)throw"Something wrong with hufUnpackEncTable";for(;f--;)g[l++]=0;l--}else if(y>=59){var f=y-59+2;if(l+f>c+1)throw"Something wrong with hufUnpackEncTable";for(;f--;)g[l++]=0;l--}}te(g)}function Se(e){return e&63}function ze(e){return e>>6}function Ie(e,r,a,o){for(;r<=a;r++){var l=ze(e[r]),c=Se(e[r]);if(l>>c)throw"Invalid table entry";if(c>14){var g=o[l>>c-14];if(g.len)throw"Invalid table entry";if(g.lit++,g.p){var v=g.p;g.p=new Array(g.lit);for(var _=0;_<g.lit-1;++_)g.p[_]=v[_]}else g.p=new Array(1);g.p[g.lit-1]=r}else if(c)for(var w=0,_=1<<14-c;_>0;_--){var g=o[(l<<14-c)+w];if(g.len||g.p)throw"Invalid table entry";g.len=c,g.lit=r,w++}}return!0}const Q={c:0,lc:0};function Ne(e,r,a,o){e=e<<8|Lr(a,o),r+=8,Q.c=e,Q.lc=r}const ae={c:0,lc:0};function he(e,r,a,o,l,c,g,v,_,w){if(e==r){o<8&&(Ne(a,o,l,g),a=Q.c,o=Q.lc),o-=8;var y=a>>o,y=new Uint8Array([y])[0];if(_.value+y>w)return!1;for(var f=v[_.value-1];y-- >0;)v[_.value++]=f}else if(_.value<w)v[_.value++]=e;else return!1;ae.c=a,ae.lc=o}function Te(e){return e&65535}function Xe(e){var r=Te(e);return r>32767?r-65536:r}const Y={a:0,b:0};function Ae(e,r){var a=Xe(e),o=Xe(r),l=o,c=a+(l&1)+(l>>1),g=c,v=c-l;Y.a=g,Y.b=v}function Fe(e,r){var a=Te(e),o=Te(r),l=a-(o>>1)&65535,c=o+l-32768&65535;Y.a=c,Y.b=l}function ot(e,r,a,o,l,c,g){for(var v=g<16384,_=a>l?l:a,w=1,y;w<=_;)w<<=1;for(w>>=1,y=w,w>>=1;w>=1;){for(var f=0,ie=f+c*(l-y),I=c*w,C=c*y,F=o*w,U=o*y,$,V,ce,ge;f<=ie;f+=C){for(var K=f,be=f+o*(a-y);K<=be;K+=U){var J=K+F,ue=K+I,Ue=ue+F;v?(Ae(e[K+r],e[ue+r]),$=Y.a,ce=Y.b,Ae(e[J+r],e[Ue+r]),V=Y.a,ge=Y.b,Ae($,V),e[K+r]=Y.a,e[J+r]=Y.b,Ae(ce,ge),e[ue+r]=Y.a,e[Ue+r]=Y.b):(Fe(e[K+r],e[ue+r]),$=Y.a,ce=Y.b,Fe(e[J+r],e[Ue+r]),V=Y.a,ge=Y.b,Fe($,V),e[K+r]=Y.a,e[J+r]=Y.b,Fe(ce,ge),e[ue+r]=Y.a,e[Ue+r]=Y.b)}if(a&w){var ue=K+I;v?Ae(e[K+r],e[ue+r]):Fe(e[K+r],e[ue+r]),$=Y.a,e[ue+r]=Y.b,e[K+r]=$}}if(l&w)for(var K=f,be=f+o*(a-y);K<=be;K+=U){var J=K+F;v?Ae(e[K+r],e[J+r]):Fe(e[K+r],e[J+r]),$=Y.a,e[J+r]=Y.b,e[K+r]=$}y=w,w>>=1}return f}function st(e,r,a,o,l,c,g,v,_,w){for(var y=0,f=0,ie=v,I=Math.trunc(l.value+(c+7)/8);l.value<I;)for(Ne(y,f,a,l),y=Q.c,f=Q.lc;f>=14;){var C=y>>f-14&16383,F=r[C];if(F.len)f-=F.len,he(F.lit,g,y,f,a,o,l,_,w,ie),y=ae.c,f=ae.lc;else{if(!F.p)throw"hufDecode issues";var U;for(U=0;U<F.lit;U++){for(var $=Se(e[F.p[U]]);f<$&&l.value<I;)Ne(y,f,a,l),y=Q.c,f=Q.lc;if(f>=$&&ze(e[F.p[U]])==(y>>f-$&(1<<$)-1)){f-=$,he(F.p[U],g,y,f,a,o,l,_,w,ie),y=ae.c,f=ae.lc;break}}if(U==F.lit)throw"hufDecode issues"}}var V=8-c&7;for(y>>=V,f-=V;f>0;){var F=r[y<<14-f&16383];if(F.len)f-=F.len,he(F.lit,g,y,f,a,o,l,_,w,ie),y=ae.c,f=ae.lc;else throw"hufDecode issues"}return!0}function Fr(e,r,a,o,l,c){var g={value:0},v=a.value,_=fe(r,a),w=fe(r,a);a.value+=4;var y=fe(r,a);if(a.value+=4,_<0||_>=65537||w<0||w>=65537)throw"Something wrong with HUF_ENCSIZE";var f=new Array(65537),ie=new Array(16384);X(ie);var I=o-(a.value-v);if(D(e,r,a,I,_,w,f),y>8*(o-(a.value-v)))throw"Something wrong with hufUncompress";Ie(f,_,w,ie),st(f,ie,e,r,a,y,w,c,l,g)}function lt(e,r,a){for(var o=0;o<a;++o)r[o]=e[r[o]]}function Ur(e){for(var r=1;r<e.length;r++){var a=e[r-1]+e[r]-128;e[r]=a}}function Dr(e,r){for(var a=0,o=Math.floor((e.length+1)/2),l=0,c=e.length-1;!(l>c||(r[l++]=e[a++],l>c));)r[l++]=e[o++]}function Nr(e){for(var r=e.byteLength,a=new Array,o=0,l=new DataView(e);r>0;){var c=l.getInt8(o++);if(c<0){var g=-c;r-=g+1;for(var v=0;v<g;v++)a.push(l.getUint8(o++))}else{var g=c;r-=2;for(var _=l.getUint8(o++),v=0;v<g+1;v++)a.push(_)}}return a}function ct(e,r,a,o,l,c){var J=new DataView(c.buffer),g=a[e.idx[0]].width,v=a[e.idx[0]].height,_=3,w=Math.floor(g/8),y=Math.ceil(g/8),f=Math.ceil(v/8),ie=g-(y-1)*8,I=v-(f-1)*8,C={value:0},F=new Array(_),U=new Array(_),$=new Array(_),V=new Array(_),ce=new Array(_);for(let q=0;q<_;++q)ce[q]=r[e.idx[q]],F[q]=q<1?0:F[q-1]+y*f,U[q]=new Float32Array(64),$[q]=new Uint16Array(64),V[q]=new Uint16Array(y*64);for(let q=0;q<f;++q){var ge=8;q==f-1&&(ge=I);var K=8;for(let ne=0;ne<y;++ne){ne==y-1&&(K=ie);for(let Z=0;Z<_;++Z)$[Z].fill(0),$[Z][0]=l[F[Z]++],ut(C,o,$[Z]),ht($[Z],U[Z]),pt(U[Z]);vt(U);for(let Z=0;Z<_;++Z)dt(U[Z],V[Z],ne*64)}let me=0;for(let ne=0;ne<_;++ne){const Z=a[e.idx[ne]].type;for(let xe=8*q;xe<8*q+ge;++xe){me=ce[ne][xe];for(let Pe=0;Pe<w;++Pe){const we=Pe*64+(xe&7)*8;J.setUint16(me+0*Z,V[ne][we+0],!0),J.setUint16(me+2*Z,V[ne][we+1],!0),J.setUint16(me+4*Z,V[ne][we+2],!0),J.setUint16(me+6*Z,V[ne][we+3],!0),J.setUint16(me+8*Z,V[ne][we+4],!0),J.setUint16(me+10*Z,V[ne][we+5],!0),J.setUint16(me+12*Z,V[ne][we+6],!0),J.setUint16(me+14*Z,V[ne][we+7],!0),me+=16*Z}}if(w!=y)for(let xe=8*q;xe<8*q+ge;++xe){const Pe=ce[ne][xe]+8*w*2*Z,we=w*64+(xe&7)*8;for(let Oe=0;Oe<K;++Oe)J.setUint16(Pe+Oe*2*Z,V[ne][we+Oe],!0)}}}for(var be=new Uint16Array(g),J=new DataView(c.buffer),ue=0;ue<_;++ue){a[e.idx[ue]].decoded=!0;var Ue=a[e.idx[ue]].type;if(a[ue].type==2)for(var Ve=0;Ve<v;++Ve){const q=ce[ue][Ve];for(var ye=0;ye<g;++ye)be[ye]=J.getUint16(q+ye*2*Ue,!0);for(var ye=0;ye<g;++ye)J.setFloat32(q+ye*2*Ue,M(be[ye]),!0)}}}function ut(e,r,a){for(var o,l=1;l<64;)o=r[e.value],o==65280?l=64:o>>8==255?l+=o&255:(a[l]=o,l++),e.value++}function ht(e,r){r[0]=M(e[0]),r[1]=M(e[1]),r[2]=M(e[5]),r[3]=M(e[6]),r[4]=M(e[14]),r[5]=M(e[15]),r[6]=M(e[27]),r[7]=M(e[28]),r[8]=M(e[2]),r[9]=M(e[4]),r[10]=M(e[7]),r[11]=M(e[13]),r[12]=M(e[16]),r[13]=M(e[26]),r[14]=M(e[29]),r[15]=M(e[42]),r[16]=M(e[3]),r[17]=M(e[8]),r[18]=M(e[12]),r[19]=M(e[17]),r[20]=M(e[25]),r[21]=M(e[30]),r[22]=M(e[41]),r[23]=M(e[43]),r[24]=M(e[9]),r[25]=M(e[11]),r[26]=M(e[18]),r[27]=M(e[24]),r[28]=M(e[31]),r[29]=M(e[40]),r[30]=M(e[44]),r[31]=M(e[53]),r[32]=M(e[10]),r[33]=M(e[19]),r[34]=M(e[23]),r[35]=M(e[32]),r[36]=M(e[39]),r[37]=M(e[45]),r[38]=M(e[52]),r[39]=M(e[54]),r[40]=M(e[20]),r[41]=M(e[22]),r[42]=M(e[33]),r[43]=M(e[38]),r[44]=M(e[46]),r[45]=M(e[51]),r[46]=M(e[55]),r[47]=M(e[60]),r[48]=M(e[21]),r[49]=M(e[34]),r[50]=M(e[37]),r[51]=M(e[47]),r[52]=M(e[50]),r[53]=M(e[56]),r[54]=M(e[59]),r[55]=M(e[61]),r[56]=M(e[35]),r[57]=M(e[36]),r[58]=M(e[48]),r[59]=M(e[49]),r[60]=M(e[57]),r[61]=M(e[58]),r[62]=M(e[62]),r[63]=M(e[63])}function pt(e){const r=.5*Math.cos(.7853975),a=.5*Math.cos(3.14159/16),o=.5*Math.cos(3.14159/8),l=.5*Math.cos(3*3.14159/16),c=.5*Math.cos(5*3.14159/16),g=.5*Math.cos(3*3.14159/8),v=.5*Math.cos(7*3.14159/16);for(var _=new Array(4),w=new Array(4),y=new Array(4),f=new Array(4),ie=0;ie<8;++ie){var I=ie*8;_[0]=o*e[I+2],_[1]=g*e[I+2],_[2]=o*e[I+6],_[3]=g*e[I+6],w[0]=a*e[I+1]+l*e[I+3]+c*e[I+5]+v*e[I+7],w[1]=l*e[I+1]-v*e[I+3]-a*e[I+5]-c*e[I+7],w[2]=c*e[I+1]-a*e[I+3]+v*e[I+5]+l*e[I+7],w[3]=v*e[I+1]-c*e[I+3]+l*e[I+5]-a*e[I+7],y[0]=r*(e[I+0]+e[I+4]),y[3]=r*(e[I+0]-e[I+4]),y[1]=_[0]+_[3],y[2]=_[1]-_[2],f[0]=y[0]+y[1],f[1]=y[3]+y[2],f[2]=y[3]-y[2],f[3]=y[0]-y[1],e[I+0]=f[0]+w[0],e[I+1]=f[1]+w[1],e[I+2]=f[2]+w[2],e[I+3]=f[3]+w[3],e[I+4]=f[3]-w[3],e[I+5]=f[2]-w[2],e[I+6]=f[1]-w[1],e[I+7]=f[0]-w[0]}for(var C=0;C<8;++C)_[0]=o*e[16+C],_[1]=g*e[16+C],_[2]=o*e[48+C],_[3]=g*e[48+C],w[0]=a*e[8+C]+l*e[24+C]+c*e[40+C]+v*e[56+C],w[1]=l*e[8+C]-v*e[24+C]-a*e[40+C]-c*e[56+C],w[2]=c*e[8+C]-a*e[24+C]+v*e[40+C]+l*e[56+C],w[3]=v*e[8+C]-c*e[24+C]+l*e[40+C]-a*e[56+C],y[0]=r*(e[C]+e[32+C]),y[3]=r*(e[C]-e[32+C]),y[1]=_[0]+_[3],y[2]=_[1]-_[2],f[0]=y[0]+y[1],f[1]=y[3]+y[2],f[2]=y[3]-y[2],f[3]=y[0]-y[1],e[0+C]=f[0]+w[0],e[8+C]=f[1]+w[1],e[16+C]=f[2]+w[2],e[24+C]=f[3]+w[3],e[32+C]=f[3]-w[3],e[40+C]=f[2]-w[2],e[48+C]=f[1]-w[1],e[56+C]=f[0]-w[0]}function vt(e){for(var r=0;r<64;++r){var a=e[0][r],o=e[1][r],l=e[2][r];e[0][r]=a+1.5747*l,e[1][r]=a-.1873*o-.4682*l,e[2][r]=a+1.8556*o}}function dt(e,r,a){for(var o=0;o<64;++o)r[a+o]=Ge.toHalfFloat(mt(e[o]))}function mt(e){return e<=1?Math.sign(e)*Math.pow(Math.abs(e),2.2):Math.sign(e)*Math.pow(S,Math.abs(e)-1)}function Or(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function gt(e){var r=e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size),a=new Uint8Array(Nr(r)),o=new Uint8Array(a.length);return Ur(a),Dr(a,o),new DataView(o.buffer)}function mr(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),a=cr(r),o=new Uint8Array(a.length);return Ur(a),Dr(a,o),new DataView(o.buffer)}function ft(e){for(var r=e.viewer,a={value:e.offset.value},o=new Uint16Array(e.width*e.scanlineBlockSize*(e.channels*e.type)),l=new Uint8Array(8192),c=0,g=new Array(e.channels),v=0;v<e.channels;v++)g[v]={},g[v].start=c,g[v].end=g[v].start,g[v].nx=e.width,g[v].ny=e.lines,g[v].size=e.type,c+=g[v].nx*g[v].ny*g[v].size;var _=Ye(r,a),w=Ye(r,a);if(w>=8192)throw"Something is wrong with PIZ_COMPRESSION BITMAP_SIZE";if(_<=w)for(var v=0;v<w-_+1;v++)l[v+_]=He(r,a);var y=new Uint16Array(65536),f=k(l,y),ie=fe(r,a);Fr(e.array,r,a,ie,o,c);for(var v=0;v<e.channels;++v)for(var I=g[v],C=0;C<g[v].size;++C)ot(o,I.start+C,I.nx,I.size,I.ny,I.nx*I.size,f);lt(y,o,c);for(var F=0,U=new Uint8Array(o.buffer.byteLength),$=0;$<e.lines;$++)for(var V=0;V<e.channels;V++){var I=g[V],ce=I.nx*I.size,ge=new Uint8Array(o.buffer,I.end*2,ce*2);U.set(ge,F),F+=ce*2,I.end+=ce}return new DataView(U.buffer)}function wt(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),a=cr(r);const o=e.lines*e.channels*e.width,l=e.type==1?new Uint16Array(o):new Uint32Array(o);let c=0,g=0;const v=new Array(4);for(let _=0;_<e.lines;_++)for(let w=0;w<e.channels;w++){let y=0;switch(e.type){case 1:v[0]=c,v[1]=v[0]+e.width,c=v[1]+e.width;for(let f=0;f<e.width;++f){const ie=a[v[0]++]<<8|a[v[1]++];y+=ie,l[g]=y,g++}break;case 2:v[0]=c,v[1]=v[0]+e.width,v[2]=v[1]+e.width,c=v[2]+e.width;for(let f=0;f<e.width;++f){const ie=a[v[0]++]<<24|a[v[1]++]<<16|a[v[2]++]<<8;y+=ie,l[g]=y,g++}break}}return new DataView(l.buffer)}function Br(e){var r=e.viewer,a={value:e.offset.value},o=new Uint8Array(e.width*e.lines*(e.channels*e.type*2)),l={version:_e(r,a),unknownUncompressedSize:_e(r,a),unknownCompressedSize:_e(r,a),acCompressedSize:_e(r,a),dcCompressedSize:_e(r,a),rleCompressedSize:_e(r,a),rleUncompressedSize:_e(r,a),rleRawSize:_e(r,a),totalAcUncompressedCount:_e(r,a),totalDcUncompressedCount:_e(r,a),acCompression:_e(r,a)};if(l.version<2)throw"EXRLoader.parse: "+qe.compression+" version "+l.version+" is unsupported";for(var c=new Array,g=Ye(r,a)-2;g>0;){var v=sr(r.buffer,a),_=He(r,a),w=_>>2&3,y=(_>>4)-1,f=new Int8Array([y])[0],ie=He(r,a);c.push({name:v,index:f,type:ie,compression:w}),g-=v.length+3}for(var I=qe.channels,C=new Array(e.channels),F=0;F<e.channels;++F){var U=C[F]={},$=I[F];U.name=$.name,U.compression=0,U.decoded=!1,U.type=$.pixelType,U.pLinear=$.pLinear,U.width=e.width,U.height=e.lines}for(var V={idx:new Array(3)},ce=0;ce<e.channels;++ce)for(var U=C[ce],F=0;F<c.length;++F){var ge=c[F];U.name==ge.name&&(U.compression=ge.compression,ge.index>=0&&(V.idx[ge.index]=ce),U.offset=ce)}if(l.acCompressedSize>0)switch(l.acCompression){case 0:var J=new Uint16Array(l.totalAcUncompressedCount);Fr(e.array,r,a,l.acCompressedSize,J,l.totalAcUncompressedCount);break;case 1:var K=e.array.slice(a.value,a.value+l.totalAcUncompressedCount),be=cr(K),J=new Uint16Array(be.buffer);a.value+=l.totalAcUncompressedCount;break}if(l.dcCompressedSize>0){var ue={array:e.array,offset:a,size:l.dcCompressedSize},Ue=new Uint16Array(mr(ue).buffer);a.value+=l.dcCompressedSize}if(l.rleRawSize>0){var K=e.array.slice(a.value,a.value+l.rleCompressedSize),be=cr(K),Ve=Nr(be.buffer);a.value+=l.rleCompressedSize}for(var ye=0,q=new Array(C.length),F=0;F<q.length;++F)q[F]=new Array;for(var me=0;me<e.lines;++me)for(var ne=0;ne<C.length;++ne)q[ne].push(ye),ye+=C[ne].width*e.type*2;ct(V,q,C,J,Ue,o);for(var F=0;F<C.length;++F){var U=C[F];if(!U.decoded)switch(U.compression){case 2:for(var Z=0,xe=0,me=0;me<e.lines;++me){for(var Pe=q[F][Z],we=0;we<U.width;++we){for(var Oe=0;Oe<2*U.type;++Oe)o[Pe++]=Ve[xe+Oe*U.width*U.height];xe++}Z++}break;default:throw"EXRLoader.parse: unsupported channel compression"}}return new DataView(o.buffer)}function sr(e,r){for(var a=new Uint8Array(e),o=0;a[r.value+o]!=0;)o+=1;var l=new TextDecoder().decode(a.slice(r.value,r.value+o));return r.value=r.value+o+1,l}function _t(e,r,a){var o=new TextDecoder().decode(new Uint8Array(e).slice(r.value,r.value+a));return r.value=r.value+a,o}function yt(e,r){var a=je(e,r),o=fe(e,r);return[a,o]}function xt(e,r){var a=fe(e,r),o=fe(e,r);return[a,o]}function je(e,r){var a=e.getInt32(r.value,!0);return r.value=r.value+4,a}function fe(e,r){var a=e.getUint32(r.value,!0);return r.value=r.value+4,a}function Lr(e,r){var a=e[r.value];return r.value=r.value+1,a}function He(e,r){var a=e.getUint8(r.value);return r.value=r.value+1,a}const _e=function(e,r){let a;return"getBigInt64"in DataView.prototype?a=Number(e.getBigInt64(r.value,!0)):a=e.getUint32(r.value+4,!0)+Number(e.getUint32(r.value,!0)<<32),r.value+=8,a};function de(e,r){var a=e.getFloat32(r.value,!0);return r.value+=4,a}function Et(e,r){return Ge.toHalfFloat(de(e,r))}function M(e){var r=(e&31744)>>10,a=e&1023;return(e>>15?-1:1)*(r?r===31?a?NaN:1/0:Math.pow(2,r-15)*(1+a/1024):6103515625e-14*(a/1024))}function Ye(e,r){var a=e.getUint16(r.value,!0);return r.value+=2,a}function Mt(e,r){return M(Ye(e,r))}function St(e,r,a,o){for(var l=a.value,c=[];a.value<l+o-1;){var g=sr(r,a),v=je(e,a),_=He(e,a);a.value+=3;var w=je(e,a),y=je(e,a);c.push({name:g,pixelType:v,pLinear:_,xSampling:w,ySampling:y})}return a.value+=1,c}function It(e,r){var a=de(e,r),o=de(e,r),l=de(e,r),c=de(e,r),g=de(e,r),v=de(e,r),_=de(e,r),w=de(e,r);return{redX:a,redY:o,greenX:l,greenY:c,blueX:g,blueY:v,whiteX:_,whiteY:w}}function Ct(e,r){var a=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],o=He(e,r);return a[o]}function Tt(e,r){var a=fe(e,r),o=fe(e,r),l=fe(e,r),c=fe(e,r);return{xMin:a,yMin:o,xMax:l,yMax:c}}function bt(e,r){var a=["INCREASING_Y"],o=He(e,r);return a[o]}function Rt(e,r){var a=de(e,r),o=de(e,r);return[a,o]}function At(e,r){var a=de(e,r),o=de(e,r),l=de(e,r);return[a,o,l]}function Ft(e,r,a,o,l){if(o==="string"||o==="stringvector"||o==="iccProfile")return _t(r,a,l);if(o==="chlist")return St(e,r,a,l);if(o==="chromaticities")return It(e,a);if(o==="compression")return Ct(e,a);if(o==="box2i")return Tt(e,a);if(o==="lineOrder")return bt(e,a);if(o==="float")return de(e,a);if(o==="v2f")return Rt(e,a);if(o==="v3f")return At(e,a);if(o==="int")return je(e,a);if(o==="rational")return yt(e,a);if(o==="timecode")return xt(e,a);if(o==="preview")return a.value+=l,"skipped";a.value+=l}function Ut(e,r,a){const o={};if(e.getUint32(0,!0)!=20000630)throw"THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.";o.version=e.getUint8(4);const l=e.getUint8(5);o.spec={singleTile:!!(l&2),longName:!!(l&4),deepFormat:!!(l&8),multiPart:!!(l&16)},a.value=8;for(var c=!0;c;){var g=sr(r,a);if(g==0)c=!1;else{var v=sr(r,a),_=fe(e,a),w=Ft(e,r,a,v,_);w===void 0?console.warn(`EXRLoader.parse: skipped unknown header attribute type '${v}'.`):o[g]=w}}if((l&-5)!=0)throw console.error("EXRHeader:",o),"THREE.EXRLoader: provided file is currently unsupported.";return o}function Dt(e,r,a,o,l){const c={size:0,viewer:r,array:a,offset:o,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,channels:e.channels.length,bytesPerLine:null,lines:null,inputSize:null,type:e.channels[0].pixelType,uncompress:null,getter:null,format:null,[Qe?"colorSpace":"encoding"]:null};switch(e.compression){case"NO_COMPRESSION":c.lines=1,c.uncompress=Or;break;case"RLE_COMPRESSION":c.lines=1,c.uncompress=gt;break;case"ZIPS_COMPRESSION":c.lines=1,c.uncompress=mr;break;case"ZIP_COMPRESSION":c.lines=16,c.uncompress=mr;break;case"PIZ_COMPRESSION":c.lines=32,c.uncompress=ft;break;case"PXR24_COMPRESSION":c.lines=16,c.uncompress=wt;break;case"DWAA_COMPRESSION":c.lines=32,c.uncompress=Br;break;case"DWAB_COMPRESSION":c.lines=256,c.uncompress=Br;break;default:throw"EXRLoader.parse: "+e.compression+" is unsupported"}if(c.scanlineBlockSize=c.lines,c.type==1)switch(l){case De:c.getter=Mt,c.inputSize=2;break;case Me:c.getter=Ye,c.inputSize=2;break}else if(c.type==2)switch(l){case De:c.getter=de,c.inputSize=4;break;case Me:c.getter=Et,c.inputSize=4}else throw"EXRLoader.parse: unsupported pixelType "+c.type+" for "+e.compression+".";c.blockCount=(e.dataWindow.yMax+1)/c.scanlineBlockSize;for(var g=0;g<c.blockCount;g++)_e(r,o);c.outputChannels=c.channels==3?4:c.channels;const v=c.width*c.height*c.outputChannels;switch(l){case De:c.byteArray=new Float32Array(v),c.channels<c.outputChannels&&c.byteArray.fill(1,0,v);break;case Me:c.byteArray=new Uint16Array(v),c.channels<c.outputChannels&&c.byteArray.fill(15360,0,v);break;default:console.error("THREE.EXRLoader: unsupported type: ",l);break}return c.bytesPerLine=c.width*c.inputSize*c.channels,c.outputChannels==4?c.format=tr:c.format=zt,Qe?c.colorSpace="srgb-linear":c.encoding=3e3,c}const lr=new DataView(t),Nt=new Uint8Array(t),$e={value:0},qe=Ut(lr,t,$e),O=Dt(qe,lr,Nt,$e,this.type),kr={value:0},Ot={R:0,G:1,B:2,A:3,Y:0};for(let e=0;e<O.height/O.scanlineBlockSize;e++){const r=fe(lr,$e);O.size=fe(lr,$e),O.lines=r+O.scanlineBlockSize>O.height?O.height-r:O.scanlineBlockSize;const o=O.size<O.lines*O.bytesPerLine?O.uncompress(O):Or(O);$e.value+=O.size;for(let l=0;l<O.scanlineBlockSize;l++){const c=l+e*O.scanlineBlockSize;if(c>=O.height)break;for(let g=0;g<O.channels;g++){const v=Ot[qe.channels[g].name];for(let _=0;_<O.width;_++){kr.value=(l*(O.channels*O.width)+g*O.width+_)*O.inputSize;const w=(O.height-1-c)*(O.width*O.outputChannels)+_*O.outputChannels+v;O.byteArray[w]=O.getter(o,kr)}}}}return{header:qe,width:O.width,height:O.height,data:O.byteArray,format:O.format,[Qe?"colorSpace":"encoding"]:O[Qe?"colorSpace":"encoding"],type:this.type}}setDataType(t){return this.type=t,this}load(t,n,s,u){function h(p,x){Qe?p.colorSpace=x.colorSpace:p.encoding=x.encoding,p.minFilter=Re,p.magFilter=Re,p.generateMipmaps=!1,p.flipY=!1,n&&n(p,x)}return super.load(t,h,s,u)}}const et=(i,t,n)=>{let s;switch(i){case _r:s=new Uint8ClampedArray(t*n*4);break;case Me:s=new Uint16Array(t*n*4);break;case Yt:s=new Uint32Array(t*n*4);break;case jt:s=new Int8Array(t*n*4);break;case Xt:s=new Int16Array(t*n*4);break;case Wt:s=new Int32Array(t*n*4);break;case De:s=new Float32Array(t*n*4);break;default:throw new Error("Unsupported data type")}return s};let ur;const Da=(i,t,n,s)=>{if(ur!==void 0)return ur;const u=new jr(1,1,s);t.setRenderTarget(u);const h=new Er(new Xr,new Zt({color:16777215}));t.render(h,n),t.setRenderTarget(null);const p=et(i,u.width,u.height);return t.readRenderTargetPixels(u,0,0,u.width,u.height,p),u.dispose(),h.geometry.dispose(),h.material.dispose(),ur=p[0]!==0,ur};class Sr{_renderer;_rendererIsDisposable=!1;_material;_scene;_camera;_quad;_renderTarget;_width;_height;_type;_colorSpace;_supportsReadPixels=!0;constructor(t){this._width=t.width,this._height=t.height,this._type=t.type,this._colorSpace=t.colorSpace;const n={format:tr,depthBuffer:!1,stencilBuffer:!1,type:this._type,colorSpace:this._colorSpace,anisotropy:t.renderTargetOptions?.anisotropy!==void 0?t.renderTargetOptions?.anisotropy:1,generateMipmaps:t.renderTargetOptions?.generateMipmaps!==void 0?t.renderTargetOptions?.generateMipmaps:!1,magFilter:t.renderTargetOptions?.magFilter!==void 0?t.renderTargetOptions?.magFilter:Re,minFilter:t.renderTargetOptions?.minFilter!==void 0?t.renderTargetOptions?.minFilter:Re,samples:t.renderTargetOptions?.samples!==void 0?t.renderTargetOptions?.samples:void 0,wrapS:t.renderTargetOptions?.wrapS!==void 0?t.renderTargetOptions?.wrapS:Le,wrapT:t.renderTargetOptions?.wrapT!==void 0?t.renderTargetOptions?.wrapT:Le};if(this._material=t.material,t.renderer?this._renderer=t.renderer:(this._renderer=Sr.instantiateRenderer(),this._rendererIsDisposable=!0),this._scene=new Wr,this._camera=new Pt,this._camera.position.set(0,0,10),this._camera.left=-.5,this._camera.right=.5,this._camera.top=.5,this._camera.bottom=-.5,this._camera.updateProjectionMatrix(),!Da(this._type,this._renderer,this._camera,n)){let s;this._type===Me&&(s=this._renderer.extensions.has("EXT_color_buffer_float")?De:void 0),s!==void 0?(console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${De}`),this._type=s):(this._supportsReadPixels=!1,console.warn("This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown"))}this._quad=new Er(new Xr,this._material),this._quad.geometry.computeBoundingBox(),this._scene.add(this._quad),this._renderTarget=new jr(this.width,this.height,n),this._renderTarget.texture.mapping=t.renderTargetOptions?.mapping!==void 0?t.renderTargetOptions?.mapping:pr}static instantiateRenderer(){const t=new Ht;return t.setSize(128,128),t}render=()=>{this._renderer.setRenderTarget(this._renderTarget);try{this._renderer.render(this._scene,this._camera)}catch(t){throw this._renderer.setRenderTarget(null),t}this._renderer.setRenderTarget(null)};toArray(){if(!this._supportsReadPixels)throw new Error("Can't read pixels in this browser");const t=et(this._type,this._width,this._height);return this._renderer.readRenderTargetPixels(this._renderTarget,0,0,this._width,this._height,t),t}toDataTexture(t){const n=new Gt(this.toArray(),this.width,this.height,tr,this._type,t?.mapping||pr,t?.wrapS||Le,t?.wrapT||Le,t?.magFilter||Re,t?.minFilter||Re,t?.anisotropy||1,wr);return n.generateMipmaps=t?.generateMipmaps!==void 0?t?.generateMipmaps:!1,n}disposeOnDemandRenderer(){this._renderer.setRenderTarget(null),this._rendererIsDisposable&&(this._renderer.dispose(),this._renderer.forceContextLoss())}dispose(t){this.disposeOnDemandRenderer(),t&&this.renderTarget.dispose(),this.material instanceof Mr&&Object.values(this.material.uniforms).forEach(n=>{n.value instanceof Ze&&n.value.dispose()}),Object.values(this.material).forEach(n=>{n instanceof Ze&&n.dispose()}),this.material.dispose(),this._quad.geometry.dispose()}get width(){return this._width}set width(t){this._width=t,this._renderTarget.setSize(this._width,this._height)}get height(){return this._height}set height(t){this._height=t,this._renderTarget.setSize(this._width,this._height)}get renderer(){return this._renderer}get renderTarget(){return this._renderTarget}set renderTarget(t){this._renderTarget=t,this._width=t.width,this._height=t.height}get material(){return this._material}get type(){return this._type}get colorSpace(){return this._colorSpace}}class rt extends Error{}class tt extends Error{}const Je=(i,t,n)=>{const s=new RegExp(`${t}="([^"]*)"`,"i").exec(i);if(s)return s[1];const u=new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`,"i").exec(i);if(u){const h=u[1].match(/<rdf:li>([^<]*)<\/rdf:li>/g);return h&&h.length===3?h.map(p=>p.replace(/<\/?rdf:li>/g,"")):u[1].trim()}if(n!==void 0)return n;throw new Error(`Can't find ${t} in gainmap metadata`)},Na=i=>{let t;typeof TextDecoder<"u"?t=new TextDecoder().decode(i):t=i.toString();let n=t.indexOf("<x:xmpmeta");for(;n!==-1;){const s=t.indexOf("x:xmpmeta>",n),u=t.slice(n,s+10);try{const h=Je(u,"hdrgm:GainMapMin","0"),p=Je(u,"hdrgm:GainMapMax"),x=Je(u,"hdrgm:Gamma","1"),d=Je(u,"hdrgm:OffsetSDR","0.015625"),m=Je(u,"hdrgm:OffsetHDR","0.015625"),A=/hdrgm:HDRCapacityMin="([^"]*)"/.exec(u),b=A?A[1]:"0",T=/hdrgm:HDRCapacityMax="([^"]*)"/.exec(u);if(!T)throw new Error("Incomplete gainmap metadata");const z=T[1];return{gainMapMin:Array.isArray(h)?h.map(W=>parseFloat(W)):[parseFloat(h),parseFloat(h),parseFloat(h)],gainMapMax:Array.isArray(p)?p.map(W=>parseFloat(W)):[parseFloat(p),parseFloat(p),parseFloat(p)],gamma:Array.isArray(x)?x.map(W=>parseFloat(W)):[parseFloat(x),parseFloat(x),parseFloat(x)],offsetSdr:Array.isArray(d)?d.map(W=>parseFloat(W)):[parseFloat(d),parseFloat(d),parseFloat(d)],offsetHdr:Array.isArray(m)?m.map(W=>parseFloat(W)):[parseFloat(m),parseFloat(m),parseFloat(m)],hdrCapacityMin:parseFloat(b),hdrCapacityMax:parseFloat(z)}}catch{}n=t.indexOf("<x:xmpmeta",s)}};class Oa{options;constructor(t){this.options={debug:t&&t.debug!==void 0?t.debug:!1,extractFII:t&&t.extractFII!==void 0?t.extractFII:!0,extractNonFII:t&&t.extractNonFII!==void 0?t.extractNonFII:!0}}extract(t){return new Promise((n,s)=>{const u=this.options.debug,h=new DataView(t.buffer);if(h.getUint16(0)!==65496){s(new Error("Not a valid jpeg"));return}const p=h.byteLength;let x=2,d=0,m;for(;x<p;){if(++d>250){s(new Error(`Found no marker after ${d} loops 😵`));return}if(h.getUint8(x)!==255){s(new Error(`Not a valid marker at offset 0x${x.toString(16)}, found: 0x${h.getUint8(x).toString(16)}`));return}if(m=h.getUint8(x+1),u&&console.log(`Marker: ${m.toString(16)}`),m===226){u&&console.log("Found APP2 marker (0xffe2)");const A=x+4;if(h.getUint32(A)===1297106432){const b=A+4;let T;if(h.getUint16(b)===18761)T=!1;else if(h.getUint16(b)===19789)T=!0;else{s(new Error("No valid endianness marker found in TIFF header"));return}if(h.getUint16(b+2,!T)!==42){s(new Error("Not valid TIFF data! (no 0x002A marker)"));return}const z=h.getUint32(b+4,!T);if(z<8){s(new Error("Not valid TIFF data! (First offset less than 8)"));return}const W=b+z,pe=h.getUint16(W,!T),j=W+2;let oe=0;for(let P=j;P<j+12*pe;P+=12)h.getUint16(P,!T)===45057&&(oe=h.getUint32(P+8,!T));const ve=W+2+pe*12+4,le=[];for(let P=ve;P<ve+oe*16;P+=16){const N={MPType:h.getUint32(P,!T),size:h.getUint32(P+4,!T),dataOffset:h.getUint32(P+8,!T),dependantImages:h.getUint32(P+12,!T),start:-1,end:-1,isFII:!1};N.dataOffset?(N.start=b+N.dataOffset,N.isFII=!1):(N.start=0,N.isFII=!0),N.end=N.start+N.size,le.push(N)}if(this.options.extractNonFII&&le.length){const P=new Blob([h]),N=[];for(const re of le){if(re.isFII&&!this.options.extractFII)continue;const E=P.slice(re.start,re.end+1,"image/jpeg");N.push(E)}n(N)}}}x+=2+h.getUint16(x+2)}})}}const Ba=async i=>{const t=Na(i);if(!t)throw new tt("Gain map XMP metadata not found");const s=await new Oa({extractFII:!0,extractNonFII:!0}).extract(i);if(s.length!==2)throw new rt("Gain map recovery image not found");return{sdr:new Uint8Array(await s[0].arrayBuffer()),gainMap:new Uint8Array(await s[1].arrayBuffer()),metadata:t}},Hr=i=>new Promise((t,n)=>{const s=document.createElement("img");s.onload=()=>{t(s)},s.onerror=u=>{n(u)},s.src=URL.createObjectURL(i)});class La extends $t{_renderer;_renderTargetOptions;_internalLoadingManager;_config;constructor(t,n){super(n),this._config=t,t.renderer&&(this._renderer=t.renderer),this._internalLoadingManager=new qt}setRenderer(t){return this._renderer=t,this}setRenderTargetOptions(t){return this._renderTargetOptions=t,this}prepareQuadRenderer(){this._renderer||console.warn("WARNING: A Renderer was not passed to this Loader constructor or in setRenderer, the result of this Loader will need to be converted to a Data Texture with toDataTexture() before you can use it in your renderer.");const t=this._config.createMaterial({gainMapMax:[1,1,1],gainMapMin:[0,0,0],gamma:[1,1,1],offsetHdr:[1,1,1],offsetSdr:[1,1,1],hdrCapacityMax:1,hdrCapacityMin:0,maxDisplayBoost:1,gainMap:new Ze,sdr:new Ze});return this._config.createQuadRenderer({width:16,height:16,type:Me,colorSpace:wr,material:t,renderer:this._renderer,renderTargetOptions:this._renderTargetOptions})}async processImages(t,n,s){const u=n?new Blob([n],{type:"image/jpeg"}):void 0,h=new Blob([t],{type:"image/jpeg"});let p,x,d=!1;if(typeof createImageBitmap>"u"){const m=await Promise.all([u?Hr(u):Promise.resolve(void 0),Hr(h)]);x=m[0],p=m[1],d=s==="flipY"}else{const m=await Promise.all([u?createImageBitmap(u,{imageOrientation:s||"flipY"}):Promise.resolve(void 0),createImageBitmap(h,{imageOrientation:s||"flipY"})]);x=m[0],p=m[1]}return{sdrImage:p,gainMapImage:x,needsFlip:d}}createTextures(t,n,s){const u=new Ze(n||new ImageData(2,2),pr,Le,Le,Re,zr,tr,_r,1,wr);u.flipY=s,u.needsUpdate=!0;const h=new Ze(t,pr,Le,Le,Re,zr,tr,_r,1,Vt);return h.flipY=s,h.needsUpdate=!0,{gainMap:u,sdr:h}}updateQuadRenderer(t,n,s,u,h){t.width=n.width,t.height=n.height,t.material.gainMap=s,t.material.sdr=u,t.material.gainMapMin=h.gainMapMin,t.material.gainMapMax=h.gainMapMax,t.material.offsetHdr=h.offsetHdr,t.material.offsetSdr=h.offsetSdr,t.material.gamma=h.gamma,t.material.hdrCapacityMin=h.hdrCapacityMin,t.material.hdrCapacityMax=h.hdrCapacityMax,t.material.maxDisplayBoost=Math.pow(2,h.hdrCapacityMax),t.material.needsUpdate=!0}}const ka=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,za=`
// min half float value
#define HALF_FLOAT_MIN vec3( -65504, -65504, -65504 )
// max half float value
#define HALF_FLOAT_MAX vec3( 65504, 65504, 65504 )

uniform sampler2D sdr;
uniform sampler2D gainMap;
uniform vec3 gamma;
uniform vec3 offsetHdr;
uniform vec3 offsetSdr;
uniform vec3 gainMapMin;
uniform vec3 gainMapMax;
uniform float weightFactor;

varying vec2 vUv;

void main() {
  vec3 rgb = texture2D( sdr, vUv ).rgb;
  vec3 recovery = texture2D( gainMap, vUv ).rgb;
  vec3 logRecovery = pow( recovery, gamma );
  vec3 logBoost = gainMapMin * ( 1.0 - logRecovery ) + gainMapMax * logRecovery;
  vec3 hdrColor = (rgb + offsetSdr) * exp2( logBoost * weightFactor ) - offsetHdr;
  vec3 clampedHdrColor = max( HALF_FLOAT_MIN, min( HALF_FLOAT_MAX, hdrColor ));
  gl_FragColor = vec4( clampedHdrColor , 1.0 );
}
`;class Pa extends Mr{_maxDisplayBoost;_hdrCapacityMin;_hdrCapacityMax;constructor({gamma:t,offsetHdr:n,offsetSdr:s,gainMapMin:u,gainMapMax:h,maxDisplayBoost:p,hdrCapacityMin:x,hdrCapacityMax:d,sdr:m,gainMap:A}){super({name:"GainMapDecoderMaterial",vertexShader:ka,fragmentShader:za,uniforms:{sdr:{value:m},gainMap:{value:A},gamma:{value:new Ke(1/t[0],1/t[1],1/t[2])},offsetHdr:{value:new Ke().fromArray(n)},offsetSdr:{value:new Ke().fromArray(s)},gainMapMin:{value:new Ke().fromArray(u)},gainMapMax:{value:new Ke().fromArray(h)},weightFactor:{value:(Math.log2(p)-x)/(d-x)}},blending:Kt,depthTest:!1,depthWrite:!1}),this._maxDisplayBoost=p,this._hdrCapacityMin=x,this._hdrCapacityMax=d,this.needsUpdate=!0,this.uniformsNeedUpdate=!0}get sdr(){return this.uniforms.sdr.value}set sdr(t){this.uniforms.sdr.value=t}get gainMap(){return this.uniforms.gainMap.value}set gainMap(t){this.uniforms.gainMap.value=t}get offsetHdr(){return this.uniforms.offsetHdr.value.toArray()}set offsetHdr(t){this.uniforms.offsetHdr.value.fromArray(t)}get offsetSdr(){return this.uniforms.offsetSdr.value.toArray()}set offsetSdr(t){this.uniforms.offsetSdr.value.fromArray(t)}get gainMapMin(){return this.uniforms.gainMapMin.value.toArray()}set gainMapMin(t){this.uniforms.gainMapMin.value.fromArray(t)}get gainMapMax(){return this.uniforms.gainMapMax.value.toArray()}set gainMapMax(t){this.uniforms.gainMapMax.value.fromArray(t)}get gamma(){const t=this.uniforms.gamma.value;return[1/t.x,1/t.y,1/t.z]}set gamma(t){const n=this.uniforms.gamma.value;n.x=1/t[0],n.y=1/t[1],n.z=1/t[2]}get hdrCapacityMin(){return this._hdrCapacityMin}set hdrCapacityMin(t){this._hdrCapacityMin=t,this.calculateWeight()}get hdrCapacityMax(){return this._hdrCapacityMax}set hdrCapacityMax(t){this._hdrCapacityMax=t,this.calculateWeight()}get maxDisplayBoost(){return this._maxDisplayBoost}set maxDisplayBoost(t){this._maxDisplayBoost=Math.max(1,Math.min(65504,t)),this.calculateWeight()}calculateWeight(){const t=(Math.log2(this._maxDisplayBoost)-this._hdrCapacityMin)/(this._hdrCapacityMax-this._hdrCapacityMin);this.uniforms.weightFactor.value=Math.max(0,Math.min(1,t))}}class at extends La{constructor(t,n){super({renderer:t,createMaterial:s=>new Pa(s),createQuadRenderer:s=>new Sr(s)},n)}async render(t,n,s,u){const{sdrImage:h,gainMapImage:p,needsFlip:x}=await this.processImages(s,u,"flipY"),{gainMap:d,sdr:m}=this.createTextures(h,p,x);this.updateQuadRenderer(t,h,d,m,n),t.render()}}class Ha extends at{load([t,n,s],u,h,p){const x=this.prepareQuadRenderer();let d,m,A;const b=async()=>{if(d&&m&&A){try{await this.render(x,A,d,m)}catch(S){this.manager.itemError(t),this.manager.itemError(n),this.manager.itemError(s),typeof p=="function"&&p(S),x.disposeOnDemandRenderer();return}typeof u=="function"&&u(x),this.manager.itemEnd(t),this.manager.itemEnd(n),this.manager.itemEnd(s),x.disposeOnDemandRenderer()}};let T=!0,z=0,W=0,pe=!0,j=0,oe=0,se=!0,ve=0,le=0;const P=()=>{if(typeof h=="function"){const S=z+j+ve,k=W+oe+le,X=T&&pe&&se;h(new ProgressEvent("progress",{lengthComputable:X,loaded:k,total:S}))}};this.manager.itemStart(t),this.manager.itemStart(n),this.manager.itemStart(s);const N=new hr(this._internalLoadingManager);N.setResponseType("arraybuffer"),N.setRequestHeader(this.requestHeader),N.setPath(this.path),N.setWithCredentials(this.withCredentials),N.load(t,async S=>{if(typeof S=="string")throw new Error("Invalid sdr buffer");d=S,await b()},S=>{T=S.lengthComputable,W=S.loaded,z=S.total,P()},S=>{this.manager.itemError(t),typeof p=="function"&&p(S)});const re=new hr(this._internalLoadingManager);re.setResponseType("arraybuffer"),re.setRequestHeader(this.requestHeader),re.setPath(this.path),re.setWithCredentials(this.withCredentials),re.load(n,async S=>{if(typeof S=="string")throw new Error("Invalid gainmap buffer");m=S,await b()},S=>{pe=S.lengthComputable,oe=S.loaded,j=S.total,P()},S=>{this.manager.itemError(n),typeof p=="function"&&p(S)});const E=new hr(this._internalLoadingManager);return E.setRequestHeader(this.requestHeader),E.setPath(this.path),E.setWithCredentials(this.withCredentials),E.load(s,async S=>{if(typeof S!="string")throw new Error("Invalid metadata string");A=JSON.parse(S),await b()},S=>{se=S.lengthComputable,le=S.loaded,ve=S.total,P()},S=>{this.manager.itemError(s),typeof p=="function"&&p(S)}),x}}class Ga extends at{load(t,n,s,u){const h=this.prepareQuadRenderer(),p=new hr(this._internalLoadingManager);return p.setResponseType("arraybuffer"),p.setRequestHeader(this.requestHeader),p.setPath(this.path),p.setWithCredentials(this.withCredentials),this.manager.itemStart(t),p.load(t,async x=>{if(typeof x=="string")throw new Error("Invalid buffer, received [string], was expecting [ArrayBuffer]");const d=new Uint8Array(x);let m,A,b;try{const T=await Ba(d);m=T.sdr,A=T.gainMap,b=T.metadata}catch(T){if(T instanceof tt||T instanceof rt)console.warn(`Failure to reconstruct an HDR image from ${t}: Gain map metadata not found in the file, HDRJPGLoader will render the SDR jpeg`),b={gainMapMin:[0,0,0],gainMapMax:[1,1,1],gamma:[1,1,1],hdrCapacityMin:0,hdrCapacityMax:1,offsetHdr:[0,0,0],offsetSdr:[0,0,0]},m=d;else throw T}try{await this.render(h,b,m.buffer,A?.buffer)}catch(T){this.manager.itemError(t),typeof u=="function"&&u(T),h.disposeOnDemandRenderer();return}typeof n=="function"&&n(h),this.manager.itemEnd(t),h.disposeOnDemandRenderer()},s,x=>{this.manager.itemError(t),typeof u=="function"&&u(x)}),h}}const ir={apartment:"lebombo_1k.hdr",city:"potsdamer_platz_1k.hdr",dawn:"kiara_1_dawn_1k.hdr",forest:"forest_slope_1k.hdr",lobby:"st_fagans_interior_1k.hdr",night:"dikhololo_night_1k.hdr",park:"rooitou_park_1k.hdr",studio:"studio_small_03_1k.hdr",sunset:"venice_sunset_1k.hdr",warehouse:"empty_warehouse_01_1k.hdr"},nt="https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/",We=i=>Array.isArray(i),Ir=["/px.png","/nx.png","/py.png","/ny.png","/pz.png","/nz.png"];function dr({files:i=Ir,path:t="",preset:n=void 0,colorSpace:s=void 0,extensions:u}={}){n&&(Cr(n),i=ir[n],t=nt);const h=We(i),{extension:p,isCubemap:x}=Tr(i),d=br(p);if(!d)throw new Error("useEnvironment: Unrecognized file extension: "+i);const m=ar(z=>z.gl);L.useLayoutEffect(()=>{if(p!=="webp"&&p!=="jpg"&&p!=="jpeg")return;function z(){nr.clear(d,h?[i]:i)}m.domElement.addEventListener("webglcontextlost",z,{once:!0})},[i,m.domElement]);const A=nr(d,h?[i]:i,z=>{(p==="webp"||p==="jpg"||p==="jpeg")&&z.setRenderer(m),z.setPath==null||z.setPath(t),u&&u(z)});let b=h?A[0]:A;if(p==="jpg"||p==="jpeg"||p==="webp"){var T;b=(T=b.renderTarget)==null?void 0:T.texture}return b.mapping=x?Qt:Jt,b.colorSpace=s??(x?"srgb":"srgb-linear"),b}const Za={files:Ir,path:"",preset:void 0,extensions:void 0};dr.preload=i=>{const t={...Za,...i};let{files:n,path:s=""}=t;const{preset:u,extensions:h}=t;u&&(Cr(u),n=ir[u],s=nt);const{extension:p}=Tr(n);if(p==="webp"||p==="jpg"||p==="jpeg")throw new Error("useEnvironment: Preloading gainmaps is not supported");const x=br(p);if(!x)throw new Error("useEnvironment: Unrecognized file extension: "+n);nr.preload(x,We(n)?[n]:n,d=>{d.setPath==null||d.setPath(s),h&&h(d)})};const Wa={files:Ir,preset:void 0};dr.clear=i=>{const t={...Wa,...i};let{files:n}=t;const{preset:s}=t;s&&(Cr(s),n=ir[s]);const{extension:u}=Tr(n),h=br(u);if(!h)throw new Error("useEnvironment: Unrecognized file extension: "+n);nr.clear(h,We(n)?[n]:n)};function Cr(i){if(!(i in ir))throw new Error("Preset must be one of: "+Object.keys(ir).join(", "))}function Tr(i){var t;const n=We(i)&&i.length===6,s=We(i)&&i.length===3&&i.some(p=>p.endsWith("json")),u=We(i)?i[0]:i;return{extension:n?"cube":s?"webp":u.startsWith("data:application/exr")?"exr":u.startsWith("data:application/hdr")?"hdr":u.startsWith("data:image/jpeg")?"jpg":(t=u.split(".").pop())==null||(t=t.split("?"))==null||(t=t.shift())==null?void 0:t.toLowerCase(),isCubemap:n,isGainmap:s}}function br(i){return i==="cube"?ea:i==="hdr"?Fa:i==="exr"?Ua:i==="jpg"||i==="jpeg"?Ga:i==="webp"?Ha:null}const Xa=i=>i.current&&i.current.isScene,ja=i=>Xa(i)?i.current:i;function Rr(i,t,n,s,u={}){var h,p,x,d;u={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...u};const m=ja(t||n),A=m.background,b=m.environment,T={backgroundBlurriness:m.backgroundBlurriness,backgroundIntensity:m.backgroundIntensity,backgroundRotation:(h=(p=m.backgroundRotation)==null||p.clone==null?void 0:p.clone())!==null&&h!==void 0?h:[0,0,0],environmentIntensity:m.environmentIntensity,environmentRotation:(x=(d=m.environmentRotation)==null||d.clone==null?void 0:d.clone())!==null&&x!==void 0?x:[0,0,0]};return i!=="only"&&(m.environment=s),i&&(m.background=s),Pr(m,u),()=>{i!=="only"&&(m.environment=b),i&&(m.background=A),Pr(m,T)}}function Ar({scene:i,background:t=!1,map:n,...s}){const u=ar(h=>h.scene);return L.useLayoutEffect(()=>{if(n)return Rr(t,i,u,n,s)}),null}function it({background:i=!1,scene:t,blur:n,backgroundBlurriness:s,backgroundIntensity:u,backgroundRotation:h,environmentIntensity:p,environmentRotation:x,...d}){const m=dr(d),A=ar(b=>b.scene);return L.useLayoutEffect(()=>Rr(i,t,A,m,{backgroundBlurriness:n??s,backgroundIntensity:u,backgroundRotation:h,environmentIntensity:p,environmentRotation:x})),L.useEffect(()=>()=>{m.dispose()},[m]),null}function Ya({children:i,near:t=.1,far:n=1e3,resolution:s=256,frames:u=1,map:h,background:p=!1,blur:x,backgroundBlurriness:d,backgroundIntensity:m,backgroundRotation:A,environmentIntensity:b,environmentRotation:T,scene:z,files:W,path:pe,preset:j=void 0,extensions:oe}){const se=ar(E=>E.gl),ve=ar(E=>E.scene),le=L.useRef(null),[P]=L.useState(()=>new Wr),N=L.useMemo(()=>{const E=new aa(s);return E.texture.type=Me,E},[s]);L.useEffect(()=>()=>{N.dispose()},[N]),L.useLayoutEffect(()=>{if(u===1){const E=se.autoClear;se.autoClear=!0,le.current.update(se,P),se.autoClear=E}return Rr(p,z,ve,N.texture,{backgroundBlurriness:x??d,backgroundIntensity:m,backgroundRotation:A,environmentIntensity:b,environmentRotation:T})},[i,P,N.texture,z,ve,p,u,se]);let re=1;return vr(()=>{if(u===1/0||re<u){const E=se.autoClear;se.autoClear=!0,le.current.update(se,P),se.autoClear=E,re++}}),L.createElement(L.Fragment,null,na(L.createElement(L.Fragment,null,i,L.createElement("cubeCamera",{ref:le,args:[t,n,N]}),W||j?L.createElement(it,{background:!0,files:W,preset:j,path:pe,extensions:oe}):h?L.createElement(Ar,{background:!0,map:h,extensions:oe}):null),P))}function $a(i){var t,n,s,u;const h=dr(i),p=i.map||h;L.useMemo(()=>ra({GroundProjectedEnvImpl:Aa}),[]),L.useEffect(()=>()=>{h.dispose()},[h]);const x=L.useMemo(()=>[p],[p]),d=(t=i.ground)==null?void 0:t.height,m=(n=i.ground)==null?void 0:n.radius,A=(s=(u=i.ground)==null?void 0:u.scale)!==null&&s!==void 0?s:1e3;return L.createElement(L.Fragment,null,L.createElement(Ar,ta({},i,{map:p})),L.createElement("groundProjectedEnvImpl",{args:x,scale:A,height:d,radius:m}))}function qa(i){return i.ground?L.createElement($a,i):i.map?L.createElement(Ar,i):i.children?L.createElement(Ya,i):L.createElement(it,i)}const Va=`#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

#define T uTime

uniform float uTime;
uniform bool uUseNoise4D;

attribute vec4 tangent;

varying vec3 aColor;

vec3 getDistortion(vec3 p){
  

  if(uUseNoise4D) {
    float v = snoise(vec4(p, T))*.5;
    v += snoise(vec4(p*2., T)) * .2;
    v += snoise(vec4(p*4., T)) * .1;
    p += v * normal;
  }else{
    p += (sin(p.zxy*1.*2. + T * 2.))*1.*.3;
    p += (sin(p.zxy*2.*2. - T * 2.))*.5*.3;
    p += (sin(p.zxy*4.*2. + T * 2.))*.2*.3;
  }
  

  return p;
}

void main(){
  float e = .01;

  vec3 pos = csm_Position.xyz;

  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  pos = getDistortion(pos);
  posA = getDistortion(posA);
  posB = getDistortion(posB);
  
  // 新的切线与副切线
  vec3 toA = normalize(posA - pos);
  vec3 toB = normalize(posB - pos);

  vec3 normal_new = normalize(cross(toA, toB));

  aColor = sin(vec3(3,2,1) + T + dot(cos(pos), vec3(1.1))) * .5 + .5;

  csm_Position.xyz = pos;
  csm_Normal = normal_new;
}`,Ka=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;

varying vec3 aColor;

void main(){
  // float t = uTime;

  // vec3 col = vec3(0);
  // col = sin(vec3(3,2,1) + t);

  csm_DiffuseColor = vec4(aColor, 1.);
  // csm_DiffuseColor = vec4(col, 1);
}`;function Qa({castShadow:i}){const t=L.useRef(null);vr((s,u)=>{t.current.rotation.y+=u*1,t.current.rotation.x+=u*1});const n=nr(la,da("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png"));return G.jsx(G.Fragment,{children:G.jsxs("mesh",{ref:t,castShadow:i,position:[4,0,0],children:[G.jsx("boxGeometry",{}),G.jsx("meshMatcapMaterial",{matcap:n})]})})}function Ja(){const i=L.useRef(null),{intensity:t}=er({intensity:{value:1,min:0,max:10,step:.1}});return vr(n=>{const{clock:s}=n,u=s.getElapsedTime();i.current.position.x=Math.sin(u)*2,i.current.position.z=Math.cos(u)*2}),ma(i,ua,1),G.jsx(G.Fragment,{children:G.jsx("directionalLight",{ref:i,position:[3,3,0],castShadow:!0,intensity:t,"shadow-mapSize":[1024,1024]})})}function en(){return G.jsx(G.Fragment,{children:G.jsxs("mesh",{position:[0,-2,0],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[G.jsx("planeGeometry",{args:[20,10]}),G.jsx("meshPhongMaterial",{color:16777215})]})})}function rn(){const i=L.useRef(null),t={uTime:{value:0},uDelta:{value:0},uUseNoise4D:{value:!0}};vr((d,m)=>{const{clock:A}=d,b=A.getElapsedTime();t.uDelta.value=m,t.uTime.value=b});const n=er({wireframe:!1,flatShading:!1,metalness:{value:0,min:0,max:1},roughness:{value:.2,min:0,max:1},ior:{value:1.5,min:0,max:2.33},transparent:!1,opacity:{value:0,min:0,max:1,render:d=>d("transparent")},transmission:{value:0,min:0,max:1}}),{detail:s}=er({detail:{value:20,min:4,max:40,step:1,order:-2}}),u=L.useMemo(()=>{const d=new Gr(2,s),m=va(d);return m.computeTangents(),m},[s]),h=u.attributes.position.count,[,p]=er(()=>({vertices:{value:0,disabled:!0,order:-1}}));L.useEffect(()=>{p({vertices:h})},[h]);const{shape:x}=er({shape:{options:{turbulance:!1,noise4D:!0},value:!0}});return t.uUseNoise4D.value=x,G.jsx(G.Fragment,{children:G.jsx("mesh",{geometry:u,children:G.jsx(ha,{baseMaterial:ca,ref:i,uniforms:t,vertexShader:Va,fragmentShader:Ka,wireframe:n.wireframe,metalness:n.metalness,roughness:n.roughness,ior:n.ior,transparent:n.transparent,opacity:n.opacity,transmission:n.transmission})})})}const mn=Bt(function(){return G.jsxs(G.Fragment,{children:[G.jsx(pa,{}),G.jsx("div",{className:"h-screen",children:G.jsxs(ia,{shadows:{type:oa,enabled:!0},children:[G.jsx(qa,{files:"/img/env/hdr/sunny_rose_garden_1k.hdr",background:!0}),G.jsx(sa,{}),G.jsx("ambientLight",{intensity:1}),G.jsx(Ja,{}),G.jsx("axesHelper",{args:[20]}),G.jsx(Qa,{castShadow:!0}),G.jsx(en,{}),G.jsx(rn,{})]})})]})});export{mn as default};
