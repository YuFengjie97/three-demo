import{w as q,o as S,r as R}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{e as X,C as J}from"./extends-BiVYuz_A.js";import"./three-custom-shader-material.es-5wyYUYSP.js";import{O as K}from"./OrbitControls-CNEd5UP6.js";import{L as Q}from"./Loader-BBMetSDN.js";import{L as Y,a as V}from"./LineGeometry-COuM5tlu.js";import{l as Z,r as L,s as N,t as $,u as M,j as ee,V as y,v as te,w as P,x as ie,y as ne,z,L as ae,o as re,i as se,H as oe}from"./three.module-_piUs-D2.js";import"./index-7OC5HNn7.js";M.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new $(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};L.line={uniforms:N.merge([M.common,M.fog,M.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class T extends Z{constructor(e){super({type:"LineMaterial",uniforms:N.clone(L.line.uniforms),vertexShader:L.line.vertexShader,fragmentShader:L.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const D=new z,B=new y,W=new y,a=new z,r=new z,h=new z,A=new y,O=new re,s=new ae,I=new y,U=new ne,E=new ie,v=new z;let w,_;function H(o,e,t){return v.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),v.multiplyScalar(1/v.w),v.x=_/t.width,v.y=_/t.height,v.applyMatrix4(o.projectionMatrixInverse),v.multiplyScalar(1/v.w),Math.abs(Math.max(v.x,v.y))}function le(o,e){const t=o.matrixWorld,d=o.geometry,n=d.attributes.instanceStart,l=d.attributes.instanceEnd,c=Math.min(d.instanceCount,n.count);for(let i=0,f=c;i<f;i++){s.start.fromBufferAttribute(n,i),s.end.fromBufferAttribute(l,i),s.applyMatrix4(t);const u=new y,m=new y;w.distanceSqToSegment(s.start,s.end,m,u),m.distanceTo(u)<_*.5&&e.push({point:m,pointOnLine:u,distance:w.origin.distanceTo(m),object:o,face:null,faceIndex:i,uv:null,uv1:null})}}function de(o,e,t){const d=e.projectionMatrix,l=o.material.resolution,c=o.matrixWorld,i=o.geometry,f=i.attributes.instanceStart,u=i.attributes.instanceEnd,m=Math.min(i.instanceCount,f.count),p=-e.near;w.at(1,h),h.w=1,h.applyMatrix4(e.matrixWorldInverse),h.applyMatrix4(d),h.multiplyScalar(1/h.w),h.x*=l.x/2,h.y*=l.y/2,h.z=0,A.copy(h),O.multiplyMatrices(e.matrixWorldInverse,c);for(let g=0,F=m;g<F;g++){if(a.fromBufferAttribute(f,g),r.fromBufferAttribute(u,g),a.w=1,r.w=1,a.applyMatrix4(O),r.applyMatrix4(O),a.z>p&&r.z>p)continue;if(a.z>p){const b=a.z-r.z,x=(a.z-p)/b;a.lerp(r,x)}else if(r.z>p){const b=r.z-a.z,x=(r.z-p)/b;r.lerp(a,x)}a.applyMatrix4(d),r.applyMatrix4(d),a.multiplyScalar(1/a.w),r.multiplyScalar(1/r.w),a.x*=l.x/2,a.y*=l.y/2,r.x*=l.x/2,r.y*=l.y/2,s.start.copy(a),s.start.z=0,s.end.copy(r),s.end.z=0;const j=s.closestPointToPointParameter(A,!0);s.at(j,I);const C=se.lerp(a.z,r.z,j),G=C>=-1&&C<=1,k=A.distanceTo(I)<_*.5;if(G&&k){s.start.fromBufferAttribute(f,g),s.end.fromBufferAttribute(u,g),s.start.applyMatrix4(c),s.end.applyMatrix4(c);const b=new y,x=new y;w.distanceSqToSegment(s.start,s.end,x,b),t.push({point:x,pointOnLine:b,distance:w.origin.distanceTo(x),object:o,face:null,faceIndex:g,uv:null,uv1:null})}}}class ce extends ee{constructor(e=new Y,t=new T({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,d=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let c=0,i=0,f=t.count;c<f;c++,i+=2)B.fromBufferAttribute(t,c),W.fromBufferAttribute(d,c),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+B.distanceTo(W);const l=new te(n,2,1);return e.setAttribute("instanceDistanceStart",new P(l,1,0)),e.setAttribute("instanceDistanceEnd",new P(l,1,1)),this}raycast(e,t){const d=this.material.worldUnits,n=e.camera;n===null&&!d&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const l=e.params.Line2!==void 0&&e.params.Line2.threshold||0;w=e.ray;const c=this.matrixWorld,i=this.geometry,f=this.material;_=f.linewidth+l,i.boundingSphere===null&&i.computeBoundingSphere(),E.copy(i.boundingSphere).applyMatrix4(c);let u;if(d)u=_*.5;else{const p=Math.max(n.near,E.distanceToPoint(w.origin));u=H(n,p,f.resolution)}if(E.radius+=u,w.intersectsSphere(E)===!1)return;i.boundingBox===null&&i.computeBoundingBox(),U.copy(i.boundingBox).applyMatrix4(c);let m;if(d)m=_*.5;else{const p=Math.max(n.near,U.distanceToPoint(w.origin));m=H(n,p,f.resolution)}U.expandByScalar(m),w.intersectsBox(U)!==!1&&(d?le(this,t):de(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(D),this.material.uniforms.resolution.value.set(D.z,D.w))}}class fe extends ce{constructor(e=new V,t=new T({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}X({Line2:fe});function pe(){const{geo:o,mat:e}=R.useMemo(()=>{const t=new V,n=new oe().getAttribute("position").array;t.setPositions(n);const l=new T({linewidth:5});return l.onBeforeCompile=c=>{console.log(c.fragmentShader)},{geo:t,mat:l}},[]);return S.jsx("line2",{geometry:o,material:e})}const _e=q(function(){return S.jsxs("div",{className:"h-screen",children:[S.jsxs(J,{children:[S.jsx(K,{}),S.jsx(R.Suspense,{fallback:null,children:S.jsx(pe,{})})]}),S.jsx(Q,{})]})});export{_e as default};
