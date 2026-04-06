import{w as He,r as ae,o as Oe}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{n as Ve,T as je,u as b,t as it,p as Ue,N as Ye,R as Mt,Q as _e,F as U,l as $e,s as Xe,m as Yt,v as K,a as Pt,b as At,f as nt,c as Ee,L as $t,i as re,d as Ze,I as qe,C as Ge,e as Ke,g as q,r as Qe,O as Je,h as Ce,j as bt,W as ti,k as ei,o as le,q as ii,w as gt,S as he,x as A,y as ni,z as ce,A as Tt,B as Wt,D as Ft,E as si,G as de,M as oi,H as ai,J as Ht,K as ri,P as pe,U as ue,V as li,X as me,Y as hi,Z as ci,_ as di}from"./three.tsl-Du_vVCpb.js";import{bA as pi,V as P,aG as lt,aH as rt,aa as fe,f as ge,a0 as S,aI as ui,aJ as ke,i as mi,bB as Ot,H as Vt,bC as Lt,bD as fi,bo as gi,aB as Te,v as bi,aM as xi,bE as wi,aw as yi,a1 as vi,q as _i,aN as Ei,aC as Ci,a as ki,A as be,aW as Ti,a7 as Li,B as Si,b as Pi,j as xe,I as Mi,a6 as zi,aU as Di}from"./three.module-DHYYXIKh.js";const we={type:"change"},Zt={type:"start"},Le={type:"end"},St=new ui,ye=new ke,Ii=Math.cos(70*mi.DEG2RAD),_=new P,D=2*Math.PI,f={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},jt=1e-6;class Ri extends pi{constructor(t,e=null){super(t,e),this.state=f.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:lt.ROTATE,MIDDLE:lt.DOLLY,RIGHT:lt.PAN},this.touches={ONE:rt.ROTATE,TWO:rt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new fe,this._lastTargetPosition=new P,this._quat=new fe().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ge,this._sphericalDelta=new ge,this._scale=1,this._panOffset=new P,this._rotateStart=new S,this._rotateEnd=new S,this._rotateDelta=new S,this._panStart=new S,this._panEnd=new S,this._panDelta=new S,this._dollyStart=new S,this._dollyEnd=new S,this._dollyDelta=new S,this._dollyDirection=new P,this._mouse=new S,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Bi.bind(this),this._onPointerDown=Ni.bind(this),this._onPointerUp=Ai.bind(this),this._onContextMenu=Ui.bind(this),this._onMouseWheel=Hi.bind(this),this._onKeyDown=Oi.bind(this),this._onTouchStart=Vi.bind(this),this._onTouchMove=ji.bind(this),this._onMouseDown=Wi.bind(this),this._onMouseMove=Fi.bind(this),this._interceptControlDown=Yi.bind(this),this._interceptControlUp=$i.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(we),this.update(),this.state=f.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;_.copy(e).sub(this.target),_.applyQuaternion(this._quat),this._spherical.setFromVector3(_),this.autoRotate&&this.state===f.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,n=this.maxAzimuthAngle;isFinite(i)&&isFinite(n)&&(i<-Math.PI?i+=D:i>Math.PI&&(i-=D),n<-Math.PI?n+=D:n>Math.PI&&(n-=D),i<=n?this._spherical.theta=Math.max(i,Math.min(n,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+n)/2?Math.max(i,this._spherical.theta):Math.min(n,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(_.setFromSpherical(this._spherical),_.applyQuaternion(this._quatInverse),e.copy(this.target).add(_),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=_.length();o=this._clampDistance(a*this._scale);const r=a-o;this.object.position.addScaledVector(this._dollyDirection,r),this.object.updateMatrixWorld(),s=!!r}else if(this.object.isOrthographicCamera){const a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=r!==this.object.zoom;const h=new P(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(a),this.object.updateMatrixWorld(),o=_.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(St.origin.copy(this.object.position),St.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(St.direction))<Ii?this.object.lookAt(this.target):(ye.setFromNormalAndCoplanarPoint(this.object.up,this.target),St.intersectPlane(ye,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>jt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>jt||this._lastTargetPosition.distanceToSquared(this.target)>jt?(this.dispatchEvent(we),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?D/60*this.autoRotateSpeed*t:D/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){_.setFromMatrixColumn(e,0),_.multiplyScalar(-t),this._panOffset.add(_)}_panUp(t,e){this.screenSpacePanning===!0?_.setFromMatrixColumn(e,1):(_.setFromMatrixColumn(e,0),_.crossVectors(this.object.up,_)),_.multiplyScalar(t),this._panOffset.add(_)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const n=this.object.position;_.copy(n).sub(this.target);let s=_.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*s/i.clientHeight,this.object.matrix),this._panUp(2*e*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),n=t-i.left,s=e-i.top,o=i.width,a=i.height;this._mouse.x=n/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(D*this._rotateDelta.x/e.clientHeight),this._rotateUp(D*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(D*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-D*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(D*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-D*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._rotateStart.set(i,n)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._panStart.set(i,n)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,n=t.pageY-e.y,s=Math.sqrt(i*i+n*n);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),n=.5*(t.pageX+i.x),s=.5*(t.pageY+i.y);this._rotateEnd.set(n,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(D*this._rotateDelta.x/e.clientHeight),this._rotateUp(D*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._panEnd.set(i,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,n=t.pageY-e.y,s=Math.sqrt(i*i+n*n);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new S,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Ni(l){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(l.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(l)&&(this._addPointer(l),l.pointerType==="touch"?this._onTouchStart(l):this._onMouseDown(l),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Bi(l){this.enabled!==!1&&(l.pointerType==="touch"?this._onTouchMove(l):this._onMouseMove(l))}function Ai(l){switch(this._removePointer(l),this._pointers.length){case 0:this.domElement.releasePointerCapture(l.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Le),this.state=f.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Wi(l){let t;switch(l.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case lt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(l),this.state=f.DOLLY;break;case lt.ROTATE:if(l.ctrlKey||l.metaKey||l.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(l),this.state=f.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(l),this.state=f.ROTATE}break;case lt.PAN:if(l.ctrlKey||l.metaKey||l.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(l),this.state=f.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(l),this.state=f.PAN}break;default:this.state=f.NONE}this.state!==f.NONE&&this.dispatchEvent(Zt)}function Fi(l){switch(this.state){case f.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(l);break;case f.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(l);break;case f.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(l);break}}function Hi(l){this.enabled===!1||this.enableZoom===!1||this.state!==f.NONE||(l.preventDefault(),this.dispatchEvent(Zt),this._handleMouseWheel(this._customWheelEvent(l)),this.dispatchEvent(Le))}function Oi(l){this.enabled!==!1&&this._handleKeyDown(l)}function Vi(l){switch(this._trackPointer(l),this._pointers.length){case 1:switch(this.touches.ONE){case rt.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(l),this.state=f.TOUCH_ROTATE;break;case rt.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(l),this.state=f.TOUCH_PAN;break;default:this.state=f.NONE}break;case 2:switch(this.touches.TWO){case rt.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(l),this.state=f.TOUCH_DOLLY_PAN;break;case rt.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(l),this.state=f.TOUCH_DOLLY_ROTATE;break;default:this.state=f.NONE}break;default:this.state=f.NONE}this.state!==f.NONE&&this.dispatchEvent(Zt)}function ji(l){switch(this._trackPointer(l),this.state){case f.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(l),this.update();break;case f.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(l),this.update();break;case f.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(l),this.update();break;case f.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(l),this.update();break;default:this.state=f.NONE}}function Ui(l){this.enabled!==!1&&l.preventDefault()}function Yi(l){l.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $i(l){l.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const j=new _e,Xi=new S,Zi=new S(1,0),qi=new S(0,1);let Ut;class Gi extends je{static get type(){return"BloomNode"}constructor(t,e=1,i=0,n=0){super("vec4"),this.inputNode=t,this.strength=b(e),this.radius=b(i),this.threshold=b(n),this.smoothWidth=b(.01),this._renderTargetsHorizontal=[],this._renderTargetsVertical=[],this._nMips=5,this._renderTargetBright=new Ot(1,1,{depthBuffer:!1,type:Vt}),this._renderTargetBright.texture.name="UnrealBloomPass.bright",this._renderTargetBright.texture.generateMipmaps=!1;for(let s=0;s<this._nMips;s++){const o=new Ot(1,1,{depthBuffer:!1,type:Vt});o.texture.name="UnrealBloomPass.h"+s,o.texture.generateMipmaps=!1,this._renderTargetsHorizontal.push(o);const a=new Ot(1,1,{depthBuffer:!1,type:Vt});a.texture.name="UnrealBloomPass.v"+s,a.texture.generateMipmaps=!1,this._renderTargetsVertical.push(a)}this._compositeMaterial=null,this._highPassFilterMaterial=null,this._separableBlurMaterials=[],this._textureNodeBright=it(this._renderTargetBright.texture),this._textureNodeBlur0=it(this._renderTargetsVertical[0].texture),this._textureNodeBlur1=it(this._renderTargetsVertical[1].texture),this._textureNodeBlur2=it(this._renderTargetsVertical[2].texture),this._textureNodeBlur3=it(this._renderTargetsVertical[3].texture),this._textureNodeBlur4=it(this._renderTargetsVertical[4].texture),this._textureOutput=Ue(this,this._renderTargetsHorizontal[0].texture),this.updateBeforeType=Ye.FRAME}getTextureNode(){return this._textureOutput}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this._renderTargetBright.setSize(i,n);for(let s=0;s<this._nMips;s++)this._renderTargetsHorizontal[s].setSize(i,n),this._renderTargetsVertical[s].setSize(i,n),this._separableBlurMaterials[s].invSize.value.set(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}updateBefore(t){const{renderer:e}=t;Ut=Mt.resetRendererState(e,Ut);const i=e.getDrawingBufferSize(Xi);this.setSize(i.width,i.height),e.setRenderTarget(this._renderTargetBright),j.material=this._highPassFilterMaterial,j.name="Bloom [ High Pass ]",j.render(e);let n=this._renderTargetBright;for(let s=0;s<this._nMips;s++)j.material=this._separableBlurMaterials[s],this._separableBlurMaterials[s].colorTexture.value=n.texture,this._separableBlurMaterials[s].direction.value=Zi,e.setRenderTarget(this._renderTargetsHorizontal[s]),j.name=`Bloom [ Blur Horizontal - ${s} ]`,j.render(e),this._separableBlurMaterials[s].colorTexture.value=this._renderTargetsHorizontal[s].texture,this._separableBlurMaterials[s].direction.value=qi,e.setRenderTarget(this._renderTargetsVertical[s]),j.name=`Bloom [ Blur Vertical - ${s} ]`,j.render(e),n=this._renderTargetsVertical[s];e.setRenderTarget(this._renderTargetsHorizontal[0]),j.material=this._compositeMaterial,j.name="Bloom [ Composite ]",j.render(e),Mt.restoreRendererState(e,Ut)}setup(t){const e=U(()=>{const r=this.inputNode,h=$e(r.rgb),c=Xe(this.threshold,this.threshold.add(this.smoothWidth),h);return Yt(K(0),r,c)});this._highPassFilterMaterial=this._highPassFilterMaterial||new Pt,this._highPassFilterMaterial.fragmentNode=e().context(t.getSharedContext()),this._highPassFilterMaterial.name="Bloom_highPass",this._highPassFilterMaterial.needsUpdate=!0;const i=[6,10,14,18,22];for(let r=0;r<this._nMips;r++)this._separableBlurMaterials.push(this._getSeparableBlurMaterial(t,i[r]));const n=At([1,.8,.6,.4,.2]),s=At([new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)]),o=U(([r,h])=>{const c=nt(1.2).sub(r);return Yt(r,c,h)}).setLayout({name:"lerpBloomFactor",type:"float",inputs:[{name:"factor",type:"float"},{name:"radius",type:"float"}]}),a=U(()=>{const r=o(n.element(0),this.radius).mul(K(s.element(0),1)).mul(this._textureNodeBlur0),h=o(n.element(1),this.radius).mul(K(s.element(1),1)).mul(this._textureNodeBlur1),c=o(n.element(2),this.radius).mul(K(s.element(2),1)).mul(this._textureNodeBlur2),d=o(n.element(3),this.radius).mul(K(s.element(3),1)).mul(this._textureNodeBlur3),p=o(n.element(4),this.radius).mul(K(s.element(4),1)).mul(this._textureNodeBlur4);return r.add(h).add(c).add(d).add(p).mul(this.strength)});return this._compositeMaterial=this._compositeMaterial||new Pt,this._compositeMaterial.fragmentNode=a().context(t.getSharedContext()),this._compositeMaterial.name="Bloom_comp",this._compositeMaterial.needsUpdate=!0,this._textureOutput}dispose(){for(let t=0;t<this._renderTargetsHorizontal.length;t++)this._renderTargetsHorizontal[t].dispose();for(let t=0;t<this._renderTargetsVertical.length;t++)this._renderTargetsVertical[t].dispose();this._renderTargetBright.dispose(),this._highPassFilterMaterial!==null&&this._highPassFilterMaterial.dispose(),this._compositeMaterial!==null&&this._compositeMaterial.dispose();for(let t=0;t<this._separableBlurMaterials.length;t++)this._separableBlurMaterials[t].dispose()}_getSeparableBlurMaterial(t,e){const i=[],n=e/3;for(let u=0;u<e;u++)i.push(.39894*Math.exp(-.5*u*u/(n*n))/n);const s=it(null),o=At(i),a=b(new S),r=b(new S(.5,.5)),h=Ee(),c=u=>s.sample(u),d=U(()=>{const u=c(h).rgb.mul(o.element(0)).toVar();return $t({start:re(1),end:re(e),type:"int",condition:"<"},({i:g})=>{const m=nt(g),v=o.element(g),w=r.mul(a).mul(m),E=c(h.add(w)).rgb,y=c(h.sub(w)).rgb;u.addAssign(Ze(E,y).mul(v))}),K(u,1)}),p=new Pt;return p.fragmentNode=d().context(t.getSharedContext()),p.name="Bloom_separable",p.needsUpdate=!0,p.colorTexture=s,p.direction=r,p.invSize=a,p}}const Ki=(l,t,e,i)=>new Gi(Ve(l),t,e,i);class Se{constructor(t,e){this.uid=t,this.cid=t.match(/^(.*):f(\d+)$/)[1],this.name=e,this.timestamp=0,this.cpu=0,this.gpu=0,this.fps=0,this.children=[],this.parent=null}}class Qi extends Se{constructor(t,e,i,n){let s=e.name;s===""&&(e.isScene?s="Scene":e.isQuadMesh&&(s="QuadMesh")),super(t,s),this.scene=e,this.camera=i,this.renderTarget=n,this.isRenderStats=!0}}class Ji extends Se{constructor(t,e){super(t,e.name),this.computeNode=e,this.isComputeStats=!0}}class tn extends qe{constructor(){super(),this.currentFrame=null,this.currentRender=null,this.currentNodes=null,this.lastFrame=null,this.frames=[],this.framesLib={},this.maxFrames=512,this._lastFinishTime=0,this._resolveTimestampPromise=null,this.isRendererInspector=!0}getParent(){return this.currentRender||this.getFrame()}begin(){this.currentFrame=this._createFrame(),this.currentRender=this.currentFrame,this.currentNodes=[]}finish(){const t=performance.now(),e=this.currentFrame;e.finishTime=t,e.deltaTime=t-(this._lastFinishTime>0?this._lastFinishTime:t),this.addFrame(e),this.fps=this._getFPS(),this.lastFrame=e,this.currentFrame=null,this.currentRender=null,this.currentNodes=null,this._lastFinishTime=t}_getFPS(){let t=0,e=0;for(let i=this.frames.length-1;i>=0;i--){const n=this.frames[i];if(t++,e+=n.deltaTime,e>=1e3)break}return t*1e3/e}_createFrame(){return{frameId:this.nodeFrame.frameId,resolvedCompute:!1,resolvedRender:!1,deltaTime:0,startTime:performance.now(),finishTime:0,miscellaneous:0,children:[],renders:[],computes:[]}}getFrame(){return this.currentFrame||this.lastFrame}getFrameById(t){return this.framesLib[t]||null}resolveViewer(){}resolveFrame(){}async resolveTimestamp(){return this._resolveTimestampPromise!==null?this._resolveTimestampPromise:(this._resolveTimestampPromise=new Promise(t=>{requestAnimationFrame(async()=>{const e=this.getRenderer();await e.resolveTimestampsAsync(Lt.COMPUTE),await e.resolveTimestampsAsync(Lt.RENDER);const i=e.backend.getTimestampFrames(Lt.COMPUTE),n=e.backend.getTimestampFrames(Lt.RENDER),s=[...new Set([...i,...n])];for(const o of s){const a=this.getFrameById(o);if(a!==null){if(a.resolvedCompute===!1)if(a.computes.length>0){if(i.includes(o)){for(const r of a.computes)e.backend.hasTimestamp(r.uid)?r.gpu=e.backend.getTimestamp(r.uid):(r.gpu=0,r.gpuNotAvailable=!0);a.resolvedCompute=!0}}else a.resolvedCompute=!0;if(a.resolvedRender===!1)if(a.renders.length>0){if(n.includes(o)){for(const r of a.renders)e.backend.hasTimestamp(r.uid)?r.gpu=e.backend.getTimestamp(r.uid):(r.gpu=0,r.gpuNotAvailable=!0);a.resolvedRender=!0}}else a.resolvedRender=!0;a.resolvedCompute===!0&&a.resolvedRender===!0&&this.resolveFrame(a)}}this._resolveTimestampPromise=null,t()})}),this._resolveTimestampPromise)}get isAvailable(){return this.getRenderer()!==null}addFrame(t){if(this.frames.length>=this.maxFrames){const e=this.frames.shift();delete this.framesLib[e.frameId]}this.frames.push(t),this.framesLib[t.frameId]=t,this.isAvailable&&(this.resolveViewer(),this.resolveTimestamp())}inspect(t){const e=this.currentNodes;e!==null?e.push(t):fi('RendererInspector: Unable to inspect node outside of frame scope. Use "renderer.setAnimationLoop()".')}beginCompute(t,e){const i=this.getFrame();if(!i)return;const n=new Ji(t,e);n.timestamp=performance.now(),n.parent=this.currentCompute||this.getParent(),i.computes.push(n),this.currentRender!==null?this.currentRender.children.push(n):i.children.push(n),this.currentCompute=n}finishCompute(){if(!this.getFrame())return;const e=this.currentCompute;e.cpu=performance.now()-e.timestamp,this.currentCompute=e.parent.isComputeStats?e.parent:null}beginRender(t,e,i,n){const s=this.getFrame();if(!s)return;const o=new Qi(t,e,i,n);o.timestamp=performance.now(),o.parent=this.getParent(),s.renders.push(o),this.currentRender!==null?this.currentRender.children.push(o):s.children.push(o),this.currentRender=o}finishRender(){if(!this.getFrame())return;const e=this.currentRender;e.cpu=performance.now()-e.timestamp,this.currentRender=e.parent}}class en{static init(){if(document.getElementById("profiler-styles"))return;const t=`
:root {
	--profiler-bg: #1e1e24f5;
	--profiler-header-bg: #2a2a33aa;
	--profiler-header: #2a2a33;
	--profiler-border: #4a4a5a;
	--text-primary: #e0e0e0;
	--text-secondary: #9a9aab;
	--accent-color: #00aaff;
	--color-green: #4caf50;
	--color-yellow: #ffc107;
	--color-red: #f44336;
	--font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	--font-mono: 'Fira Code', 'Courier New', Courier, monospace;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Fira+Code&display=swap');

#profiler-panel *, #profiler-toggle * {
	text-transform: initial;
	line-height: normal;
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#profiler-toggle {
	position: fixed;
	top: 15px;
	right: 15px;
	background-color: rgba(30, 30, 36, 0.85);
	border: 1px solid #4a4a5a54;
	border-radius: 12px 6px 6px 12px;
	color: var(--text-primary);
	cursor: pointer;
	z-index: 1001;
	transition: all 0.2s ease-in-out;
	/*font-size: 14px;*/
	font-size: 15px;
	backdrop-filter: blur(8px);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: stretch;
	padding: 0;
	overflow: hidden;
	font-family: var(--font-family);
}

#profiler-toggle:hover {
	border-color: var(--accent-color);
}

#profiler-toggle.hidden {
	opacity: 0;
	pointer-events: none;
}

#toggle-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	font-size: 20px;
	transition: background-color 0.2s;
}

#profiler-toggle:hover #toggle-icon {
	background-color: rgba(255, 255, 255, 0.05);
}

.toggle-separator {
	width: 1px;
	background-color: var(--profiler-border);
}

#toggle-text {
	display: flex;
	align-items: baseline;
	padding: 8px 14px;
	min-width: 80px;
	justify-content: right;
}

#toggle-text .fps-label {
	font-size: 0.7em;
	margin-left: 10px;
    color: #999;
}

#builtin-tabs-container {
	display: flex;
	align-items: stretch;
	gap: 0;
	border-right: 1px solid #262636;
	order: -1;
}

.builtin-tab-btn {
	background: transparent;
	border: none;
	color: var(--text-secondary);
	cursor: pointer;
	padding: 8px 14px;
	font-family: var(--font-family);
	font-size: 13px;
	font-weight: 600;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32px;
	position: relative;
}

.builtin-tab-btn svg {
	width: 20px;
	height: 20px;
	stroke: currentColor;
}

.builtin-tab-btn:hover {
	background-color: rgba(255, 255, 255, 0.08);
	color: var(--accent-color);
}

.builtin-tab-btn:active {
	background-color: rgba(255, 255, 255, 0.12);
}

.builtin-tab-btn.active {
	background-color: rgba(0, 170, 255, 0.2);
	color: var(--accent-color);
}

.builtin-tab-btn.active:hover {
	background-color: rgba(0, 170, 255, 0.3);
}

#profiler-mini-panel {
	position: fixed;
	top: 60px;
	right: 15px;
	background-color: rgba(30, 30, 36, 0.85);
	border: 1px solid #4a4a5a54;
	border-radius: 8px;
	color: var(--text-primary);
	z-index: 9999;
	backdrop-filter: blur(8px);
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
	font-family: var(--font-family);
	font-size: 11px;
	width: 350px;
	max-height: calc(100vh - 100px);
	overflow-y: auto;
	overflow-x: hidden;
	display: none;
	opacity: 0;
	transform: translateY(-10px) scale(0.98);
	transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
	            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

#profiler-mini-panel.visible {
	display: block;
	opacity: 1;
	transform: translateY(0) scale(1);
}

#profiler-mini-panel::-webkit-scrollbar {
	width: 6px;
}

#profiler-mini-panel::-webkit-scrollbar-track {
	background: transparent;
}

#profiler-mini-panel::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 3px;
	transition: background 0.2s;
}

#profiler-mini-panel::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.25);
}

.mini-panel-content {
	padding: 0;
	font-size: 11px;
	line-height: 1.5;
	font-family: var(--font-mono);
	letter-spacing: 0.3px;
	user-select: none;
	-webkit-user-select: none;
}

.mini-panel-content .profiler-content {
	display: block !important;
	background: transparent;
}

.mini-panel-content .list-scroll-wrapper {
	max-height: calc(100vh - 120px);
	overflow-y: auto;
	overflow-x: hidden;
}

.mini-panel-content .list-scroll-wrapper::-webkit-scrollbar {
	width: 4px;
}

.mini-panel-content .list-scroll-wrapper::-webkit-scrollbar-track {
	background: transparent;
}

.mini-panel-content .list-scroll-wrapper::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 2px;
}

.mini-panel-content .list-scroll-wrapper::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.2);
}

.mini-panel-content .parameters {
	background: transparent;
	border: none;
	box-shadow: none;
	padding: 4px;
}

.mini-panel-content .list-container.parameters {
	padding: 2px 6px 0px 6px !important;
}

.mini-panel-content .list-header {
	display: none;
	padding: 2px 4px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.mini-panel-content .list-item {
	border-bottom: 1px solid rgba(74, 74, 90, 0.2);
	transition: background-color 0.15s;
}

.mini-panel-content .list-item:last-child {
	border-bottom: none;
}

.mini-panel-content .list-item:hover {
	background-color: rgba(255, 255, 255, 0.04);
}

.mini-panel-content .list-item.actionable:hover {
	background-color: rgba(255, 255, 255, 0.06);
	cursor: pointer;
}

/* Style adjustments for lil-gui look */
.mini-panel-content .item-row {
	padding: 3px 8px;
	min-height: 24px;
}

.mini-panel-content .list-item-row {
	padding: 1px 4px;
	gap: 8px;
	min-height: 21px;
	align-items: center;
}

.mini-panel-content input[type="checkbox"] {
	width: 12px;
	height: 12px;
}

.mini-panel-content input[type="range"] {
	height: 18px;
}

.mini-panel-content .value-number input,
.mini-panel-content .value-slider input {
	background-color: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(74, 74, 90, 0.5);
	font-size: 10px;
}

.mini-panel-content .value-number input:focus,
.mini-panel-content .value-slider input:focus {
	border-color: var(--accent-color);
}

.mini-panel-content .value-slider {
	gap: 6px;
}

/* Compact nested items */
.mini-panel-content .list-item .list-item {
	margin-left: 8px;
}

.mini-panel-content .list-item .list-item .item-row,
.mini-panel-content .list-item .list-item .list-item-row {
	padding: 2px 6px;
	min-height: 22px;
}

/* Compact collapsible headers */
.mini-panel-content .collapsible .item-row,
.mini-panel-content .list-item-row.collapsible {
	padding: 2px 8px;
	font-weight: 600;
	min-height: 16px;
	display: flex;
	align-items: center;
}

.mini-panel-content .collapsible-icon {
	font-size: 10px;
	width: 14px;
	height: 14px;
}

.mini-panel-content .param-control input[type="range"] {
	height: 12px;
	margin-top: 1px;
	padding-top: 5px;
	user-select: none;
	-webkit-user-select: none;
	outline: none;
}

.mini-panel-content .param-control input[type="range"]::-webkit-slider-thumb {
	width: 14px;
	height: 14px;
	margin-top: -5px;
	user-select: none;
	-webkit-user-select: none;
}

.mini-panel-content .param-control input[type="range"]::-moz-range-thumb {
	width: 14px;
	height: 14px;
	user-select: none;
	-moz-user-select: none;
}

.mini-panel-content .list-children-container {
	padding-left: 0;
}

.mini-panel-content .param-control input[type="number"] {
	flex-basis: 60px !important;
}

.mini-panel-content .param-control {
	align-items: center;
}

.mini-panel-content .param-control select {
	font-size: 11px;
}

.mini-panel-content .list-item-wrapper {
	margin-top: 0;
	margin-bottom: 0;
}

#profiler-panel {
	position: fixed;
	z-index: 1001 !important;
	bottom: 0;
	left: 0;
	right: 0;
	height: 350px;
	background-color: var(--profiler-bg);
	backdrop-filter: blur(8px);
	border-top: 2px solid var(--profiler-border);
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	z-index: 1000;
	/*box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.5);*/
	transform: translateY(100%);
	transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.3s ease-out, width 0.3s ease-out;
	font-family: var(--font-mono);
}

#profiler-panel.resizing,
#profiler-panel.dragging {
	transition: none;
}

#profiler-panel.visible {
	transform: translateY(0);
}

#profiler-panel.maximized {
	height: 100vh;
}

/* Position-specific styles */
#profiler-panel.position-top {
	bottom: auto;
	top: 0;
	border-top: none;
	border-bottom: 2px solid var(--profiler-border);
	transform: translateY(-100%);
}

#profiler-panel.position-top.visible {
	transform: translateY(0);
}

#profiler-panel.position-bottom {
	/* Default position - already defined above */
}

#profiler-panel.position-left {
	top: 0;
	bottom: 0;
	left: 0;
	right: auto;
	width: 350px;
	height: 100%;
	border-top: none;
	border-right: 2px solid var(--profiler-border);
	transform: translateX(-100%);
}

#profiler-panel.position-left.visible {
	transform: translateX(0);
}

#profiler-panel.position-right {
	top: 0;
	bottom: 0;
	left: auto;
	right: 0;
	width: 350px;
	height: 100%;
	border-top: none;
	border-left: 2px solid var(--profiler-border);
	transform: translateX(100%);
}

#profiler-panel.position-right.visible {
	transform: translateX(0);
}

#profiler-panel.position-floating {
	border: 2px solid var(--profiler-border);
	border-radius: 8px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	transform: none !important;
	overflow: hidden;
}

#profiler-panel.position-floating.visible {
	transform: none !important;
}

#profiler-panel.position-floating .profiler-header {
	border-radius: 6px 6px 0 0;
}

#profiler-panel.position-floating .panel-resizer {
	bottom: 0;
	right: 0;
	top: auto;
	left: auto;
	width: 16px;
	height: 16px;
	cursor: nwse-resize;
	border-radius: 0 0 6px 0;
}

#profiler-panel.position-floating .panel-resizer::after {
	content: '';
	position: absolute;
	right: 2px;
	bottom: 2px;
	width: 10px;
	height: 10px;
	background: linear-gradient(135deg, transparent 0%, transparent 45%, var(--profiler-border) 45%, var(--profiler-border) 55%, transparent 55%);
}


.panel-resizer {
	position: absolute;
	top: -2px;
	left: 0;
	width: 100%;
	height: 5px;
	cursor: ns-resize;
	z-index: 1001;
	touch-action: none;
}

#profiler-panel.position-top .panel-resizer {
	top: auto;
	bottom: -2px;
}

#profiler-panel.position-left .panel-resizer {
	top: 0;
	left: auto;
	right: -2px;
	width: 5px;
	height: 100%;
	cursor: ew-resize;
}

#profiler-panel.position-right .panel-resizer {
	top: 0;
	left: -2px;
	right: auto;
	width: 5px;
	height: 100%;
	cursor: ew-resize;
}

.profiler-header {
	display: flex;
	background-color: var(--profiler-header-bg);
	border-bottom: 1px solid var(--profiler-border);
	flex-shrink: 0;
	justify-content: space-between;
	align-items: stretch;

	overflow-x: auto;
	overflow-y: hidden;
	width: calc(100% - 134px);
	height: 38px;
	user-select: none;
	-webkit-user-select: none;
}

/* Adjust header width based on panel position */
#profiler-panel.position-right .profiler-header,
#profiler-panel.position-left .profiler-header {
	width: calc(100% - 134px);
}

#profiler-panel.position-bottom .profiler-header,
#profiler-panel.position-top .profiler-header {
	width: calc(100% - 134px);
}

/* Adjust header width when position toggle button is hidden (mobile) */
#profiler-panel.hide-position-toggle .profiler-header {
	width: calc(100% - 90px);
}

/* ===== RULES FOR WHEN THERE ARE NO TABS ===== */

/* Horizontal mode (bottom/top) without tabs */
#profiler-panel.position-bottom.no-tabs:not(.maximized),
#profiler-panel.position-top.no-tabs:not(.maximized) {
	height: 38px !important;
	min-height: 38px !important;
}

#profiler-panel.position-bottom.no-tabs .profiler-header,
#profiler-panel.position-top.no-tabs .profiler-header {
	width: 100%;
	height: 38px;
	border-bottom: none;
}

#profiler-panel.position-bottom.no-tabs .profiler-content-wrapper,
#profiler-panel.position-top.no-tabs .profiler-content-wrapper {
	display: none;
}

#profiler-panel.position-bottom.no-tabs .panel-resizer,
#profiler-panel.position-top.no-tabs .panel-resizer {
	display: none;
}

/* Vertical mode (right/left) without tabs */
#profiler-panel.position-right.no-tabs:not(.maximized),
#profiler-panel.position-left.no-tabs:not(.maximized) {
	width: 45px !important;
	min-width: 45px !important;
}

/* Vertical layout for header when no tabs */
#profiler-panel.position-right.no-tabs .profiler-header,
#profiler-panel.position-left.no-tabs .profiler-header {
	width: 100%;
	flex-direction: column;
	height: 100%;
	border-bottom: none;
}

/* Vertical layout for controls when no tabs */
#profiler-panel.position-right.no-tabs .profiler-controls,
#profiler-panel.position-left.no-tabs .profiler-controls {
	position: static;
	flex-direction: column-reverse;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
	border-bottom: none;
	border-left: none;
	background: transparent;
}

#profiler-panel.position-right.no-tabs .profiler-controls button,
#profiler-panel.position-left.no-tabs .profiler-controls button {
	width: 100%;
	height: 45px;
	border-left: none;
	border-top: none;
	border-bottom: 1px solid var(--profiler-border);
}

#profiler-panel.position-right.no-tabs .profiler-content-wrapper,
#profiler-panel.position-left.no-tabs .profiler-content-wrapper {
	display: none;
}

#profiler-panel.position-right.no-tabs .profiler-tabs,
#profiler-panel.position-left.no-tabs .profiler-tabs {
	display: none;
}

#profiler-panel.position-right.no-tabs .panel-resizer,
#profiler-panel.position-left.no-tabs .panel-resizer {
	display: none;
}

/* Hide position toggle on mobile without tabs */
#profiler-panel.hide-position-toggle.position-right.no-tabs:not(.maximized),
#profiler-panel.hide-position-toggle.position-left.no-tabs:not(.maximized) {
	width: 45px !important;
	min-width: 45px !important;
}

/* Hide drag indicator on mobile devices */
#profiler-panel.hide-position-toggle .tab-btn.active::before {
	display: none;
}

.profiler-header::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.profiler-header::-webkit-scrollbar-track {
	background: transparent;
}

.profiler-header::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	transition: background 0.3s ease;
}

.profiler-header::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}

.profiler-header::-webkit-scrollbar-corner {
	background: transparent;
}

#profiler-panel.dragging .profiler-header {
	cursor: grabbing !important;
}

#profiler-panel.dragging {
	opacity: 0.8;
}

.profiler-tabs {
	display: flex;
	cursor: grab;
	position: relative;
}

.profiler-tabs:active {
	cursor: grabbing;
}

.profiler-tabs::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.profiler-tabs::-webkit-scrollbar-track {
	background: transparent;
}

.profiler-tabs::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	transition: background 0.3s ease;
}

.profiler-tabs::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}

.profiler-tabs::-webkit-scrollbar-corner {
	background: transparent;
}

.profiler-controls {
	display: flex;
	position: absolute;
	right: 0;
	top: 0;
	height: 38px;
	background: var(--profiler-header-bg);
	border-bottom: 1px solid var(--profiler-border);
}

.tab-btn {
	position: relative;
	background: transparent;
	border: none;
	/*border-right: 1px solid var(--profiler-border);*/
	color: var(--text-secondary);
	padding: 8px 18px;
	cursor: default;
	display: flex;
	align-items: center;
	font-family: var(--font-family);
	font-weight: 600;
	font-size: 14px;
	user-select: none;
	transition: opacity 0.2s, transform 0.2s;
	touch-action: none;
}

.tab-btn.active {
	border-bottom: 2px solid var(--accent-color);
	color: white;
}

.tab-btn.active::before {
	content: '⋮⋮';
	position: absolute;
	left: 3px;
	top: calc(50% - 2px);
	transform: translateY(-50%);
	color: var(--profiler-border);
	font-size: 18px;
	letter-spacing: -2px;
	opacity: 0.6;
}

.tab-btn.no-detach.active::before {
	display: none;
}

#floating-btn,
#maximize-btn,
#hide-panel-btn {
	background: transparent;
	border: none;
	border-left: 1px solid var(--profiler-border);
	color: var(--text-secondary);
	width: 45px;
	height: 100%;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

/* Disable transitions in vertical mode to avoid broken animations */
#profiler-panel.position-right #floating-btn,
#profiler-panel.position-right #maximize-btn,
#profiler-panel.position-right #hide-panel-btn,
#profiler-panel.position-left #floating-btn,
#profiler-panel.position-left #maximize-btn,
#profiler-panel.position-left #hide-panel-btn {
	transition: background-color 0.2s, color 0.2s;
}

#floating-btn:hover,
#maximize-btn:hover,
#hide-panel-btn:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: var(--text-primary);
}

/* Hide maximize button when there are no tabs */
#profiler-panel.position-right.no-tabs #maximize-btn,
#profiler-panel.position-left.no-tabs #maximize-btn,
#profiler-panel.position-bottom.no-tabs #maximize-btn,
#profiler-panel.position-top.no-tabs #maximize-btn {
	display: none !important;
}

.profiler-content-wrapper {
	flex-grow: 1;
	overflow: hidden;
	position: relative;
}

.profiler-content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	font-size: 13px;
	visibility: hidden;
	opacity: 0;
	transition: opacity 0.2s, visibility 0.2s;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	user-select: none;
	-webkit-user-select: none;
}

.profiler-content.active {
	visibility: visible;
	opacity: 1;
}

.profiler-content {
	overflow: auto; /* make sure scrollbars can appear */
}

.profiler-content::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.profiler-content::-webkit-scrollbar-track {
	background: transparent;
}

.profiler-content::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	transition: background 0.3s ease;
}

.profiler-content::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}

.profiler-content::-webkit-scrollbar-corner {
	background: transparent;
}

.profiler-content {
	scrollbar-width: thin; /* "auto" | "thin" */
	scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}

.list-item-row {
	display: grid;
	align-items: center;
	padding: 4px 8px;
	border-radius: 3px;
	transition: background-color 0.2s;
	gap: 10px;
	border-bottom: none;
	user-select: none;
	-webkit-user-select: none;
}

.parameters .list-item-row {
	min-height: 31px;
}

.mini-panel-content .parameters .list-item-row {
	min-height: 21px;
}

.list-item-wrapper {
	margin-top: 2px;
	margin-bottom: 2px;
	user-select: none;
	-webkit-user-select: none;
}

.list-item-wrapper:first-child {
	/*margin-top: 0;*/
}

.list-item-wrapper:not(.header-wrapper):nth-child(odd) > .list-item-row {
	background-color: rgba(0,0,0,0.1);
}

.list-item-wrapper.header-wrapper>.list-item-row {
	color: var(--accent-color);
	background-color: rgba(0, 170, 255, 0.1);
}

.list-item-wrapper.header-wrapper>.list-item-row>.list-item-cell:first-child {
	font-weight: 600;
	line-height: 1;
}

.list-item-row.collapsible,
.list-item-row.actionable {
	cursor: pointer;
}

.list-item-row.collapsible {
	background-color: rgba(0, 170, 255, 0.15) !important;
	min-height: 23px;
}

.list-item-row.collapsible.alert,
.list-item-row.alert {
	background-color: rgba(244, 67, 54, 0.1) !important;
}

@media (hover: hover) {

	.list-item-row:hover:not(.collapsible):not(.no-hover),
	.list-item-row:hover:not(.no-hover),
	.list-item-row.actionable:hover,
	.list-item-row.collapsible.actionable:hover {
		background-color: rgba(255, 255, 255, 0.05) !important;
	}

	.list-item-row.collapsible:hover {
		background-color: rgba(0, 170, 255, 0.25) !important;
	}

}

.list-item-cell {
	white-space: pre;
	display: flex;
	align-items: center;
	user-select: none;
	-webkit-user-select: none;
}

.list-item-cell:not(:first-child) {
	justify-content: flex-end;
	font-weight: 600;
}

.list-header {
	display: grid;
	align-items: center;
	padding: 4px 8px;
	font-weight: 600;
	color: var(--text-secondary);
	padding-bottom: 6px;
	border-bottom: 1px solid var(--profiler-border);
	margin-bottom: 5px;
	gap: 10px;
	user-select: none;
	-webkit-user-select: none;
}

.list-item-wrapper.section-start {
	margin-top: 5px;
	margin-bottom: 5px;
}

.list-header .list-header-cell:not(:first-child) {
	text-align: right;
}

.list-children-container {
	padding-left: 1.5em;
	overflow: hidden;
	transition: max-height 0.1s ease-out;
	margin-top: 2px;
}

.list-children-container.closed {
	max-height: 0;
}

.item-toggler {
	display: inline-block;
	margin-right: 0.8em;
	text-align: left;
}

.list-item-row.open .item-toggler::before {
	content: '-';
}

.list-item-row:not(.open) .item-toggler::before {
	content: '+';
}

.list-item-cell .value.good {
	color: var(--color-green);
}

.list-item-cell .value.warn {
	color: var(--color-yellow);
}

.list-item-cell .value.bad {
	color: var(--color-red);
}

.list-scroll-wrapper {
	overflow-x: auto;
	width: 100%;
	user-select: none;
	-webkit-user-select: none;
}

.list-container.parameters .list-item-row:not(.collapsible) {
}

.graph-container {
	width: 100%;
	box-sizing: border-box;
	padding: 8px 0;
	position: relative;
}

.graph-svg {
	width: 100%;
	height: 80px;
	background-color: var(--profiler-header);
	border: 1px solid var(--profiler-border);
	border-radius: 4px;
}

.graph-path {
	stroke-width: 2;
	fill-opacity: 0.4;
}

.console-header {
	padding: 10px;
	border-bottom: 1px solid var(--profiler-border);
	display: flex;
	gap: 20px;
	flex-shrink: 0;
	align-items: center;
	justify-content: space-between;
}

.console-buttons-group {
	display: flex;
	gap: 20px;
}

.console-filter-input {
	background-color: var(--profiler-bg);
	border: 1px solid var(--profiler-border);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 4px 8px;
	font-family: var(--font-mono);
	flex-grow: 1;
	max-width: 300px;
	border-radius: 15px;
}

.console-copy-button {
	background: transparent;
	border: none;
	color: var(--text-secondary);
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: color 0.2s, background-color 0.2s;
}

.console-copy-button:hover {
	color: var(--text-primary);
	background-color: var(--profiler-hover);
}

.console-copy-button.copied {
	color: var(--color-green);
}

#console-log {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 10px;
	overflow-y: auto;
	flex-grow: 1;
	user-select: text;
	-webkit-user-select: text;
}

.log-message {
	padding: 2px 5px;
	white-space: pre-wrap;
	word-break: break-all;
	border-radius: 3px;
	line-height: 1.5 !important;
}

.log-message.hidden {
	display: none;
}

.log-message.info {
	color: var(--text-primary);
}

.log-message.warn {
	color: var(--color-yellow);
}

.log-message.error {
	color: #f9dedc;
	background-color: rgba(244, 67, 54, 0.1);
}

.log-prefix {
	color: var(--text-secondary);
	margin-right: 8px;
}

.log-code {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 3px;
	padding: 1px 4px;
}

.thumbnail-container {
	display: flex;
	align-items: center;
}

.thumbnail-svg {
	width: 40px;
	height: 22.5px;
	flex-shrink: 0;
	margin-right: 8px;
}

.param-control {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
	width: 100%;
}

.param-control input,
.param-control select,
.param-control button {
	background-color: var(--profiler-bg);
	border: 1px solid var(--profiler-border);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 4px 6px;
	padding-bottom: 2px;
	font-family: var(--font-mono);
	width: 100%;
	box-sizing: border-box;
}

.param-control select {
	padding-top: 3px;
	padding-bottom: 1px;
}

.param-control input[type="number"] {
	cursor: ns-resize;
}

.param-control input[type="color"] {
	padding: 2px;
}

.param-control button {
	cursor: pointer;
	transition: background-color 0.2s;
}

.param-control button:hover {
	background-color: var(--profiler-header);
}

.param-control-vector {
	display: flex;
	gap: 5px;
}

.custom-checkbox {
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	gap: 8px;
	will-change: transform;
}

.custom-checkbox input {
	display: none;
}

.custom-checkbox .checkmark {
	width: 14px;
	height: 14px;
	border: 1px solid var(--accent-color);
	border-radius: 3px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.2s, border-color 0.2s;
}

.custom-checkbox .checkmark::after {
	content: '';
	width: 6px;
	height: 6px;
	background-color: var(--accent-color);
	border-radius: 1px;
	display: block;
	transform: scale(0);
	transition: transform 0.2s;
}

.custom-checkbox input:checked+.checkmark {
	border-color: var(--accent-color);
}

.custom-checkbox input:checked+.checkmark::after {
	transform: scale(1);
}

.param-control input[type="range"] {
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 16px;
	background: var(--profiler-header);
	border-radius: 5px;
	border: 1px solid var(--profiler-border);
	outline: none;
	padding: 0px;
	padding-top: 8px;
}

.param-control input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 18px;
	height: 18px;
	background: var(--profiler-bg);
	border: 1px solid var(--accent-color);
	border-radius: 3px;
	cursor: pointer;
	margin-top: -8px;
}

.param-control input[type="range"]::-moz-range-thumb {
	width: 18px;
	height: 18px;
	background: var(--profiler-bg);
	border: 2px solid var(--accent-color);
	border-radius: 3px;
	cursor: pointer;
}

.param-control input[type="range"]::-moz-range-track {
	width: 100%;
	height: 16px;
	background: var(--profiler-header);
	border-radius: 5px;
	border: 1px solid var(--profiler-border);
}

/* Override .param-control styles for mini-panel-content */
.mini-panel-content input,
.mini-panel-content select,
.mini-panel-content button {
	padding: 2px 4px;
	height: 21px;
	line-height: 1.4;
	padding-top: 4px;
}

.mini-panel-content .param-control input,
.mini-panel-content .param-control select,
.mini-panel-content .param-control button {
	background-color: #1e1e24c2;
	line-height: 1.0;
}

.mini-panel-content .param-control select {
	padding: 2px 2px;
	padding-top: 3px;
}

.mini-panel-content .param-control input[type="number"]::-webkit-outer-spin-button,
.mini-panel-content .param-control input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.mini-panel-content .param-control input[type="number"] {
	-moz-appearance: textfield;
}

.mini-panel-content .list-item-cell span {
	position: relative;
	top: 1px;
	margin-left: 2px;
}

.mini-panel-content .custom-checkbox .checkmark {
	width: 12px;
	height: 12px;
	margin-bottom: 2px;
	will-change: transform;
}

.mini-panel-content .list-container.parameters .list-item-row:not(.collapsible) {
	margin-bottom: 2px;
}

@media screen and (max-width: 450px) and (orientation: portrait) {

	.console-filter-input {
		max-width: 100px;
	}

}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {

	.panel-resizer {
		top: -10px !important;
		height: 20px !important;
	}

	#profiler-panel.position-top .panel-resizer {
		top: auto !important;
		bottom: -10px !important;
		height: 20px !important;
	}

	#profiler-panel.position-left .panel-resizer {
		right: -10px !important;
		width: 20px !important;
		height: 100% !important;
	}

	#profiler-panel.position-right .panel-resizer {
		left: -10px !important;
		width: 20px !important;
		height: 100% !important;
	}

	.detached-tab-resizer-top,
	.detached-tab-resizer-bottom {
		height: 10px !important;
	}

	.detached-tab-resizer-left,
	.detached-tab-resizer-right {
		width: 10px !important;
	}

}

.drag-preview-indicator {
	position: fixed;
	background-color: rgba(0, 170, 255, 0.2);
	border: 2px dashed var(--accent-color);
	z-index: 999;
	pointer-events: none;
	transition: all 0.2s ease-out;
}

/* Detached Tab Windows */
.detached-tab-panel {
	position: fixed;
	width: 500px;
	height: 400px;
	background: var(--profiler-bg);
	border: 1px solid var(--profiler-border);
	border-radius: 8px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	z-index: 1002;
	display: flex;
	flex-direction: column;
	backdrop-filter: blur(10px);
	overflow: hidden;
	opacity: 1;
	visibility: visible;
	transition: opacity 0.2s, visibility 0.2s;
}

#profiler-panel:not(.visible) ~ * .detached-tab-panel,
body:has(#profiler-panel:not(.visible)) .detached-tab-panel {
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
}

.detached-tab-header {
	background: var(--profiler-header-bg);
	padding: 0 7px 0 15px;
	font-family: var(--font-family);
	font-size: 14px;
	color: var(--text-primary);
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--profiler-border);
	cursor: grab;
	user-select: none;
	height: 38px;
	flex-shrink: 0;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	touch-action: none;
}

.detached-tab-header:active {
	cursor: grabbing;
}

.detached-header-controls {
	display: flex;
	gap: 5px;
}

.detached-reattach-btn {
	background: transparent;
	border: none;
	color: var(--text-secondary);
	font-family: var(--font-family);
	font-size: 18px;
	line-height: 1;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.detached-reattach-btn:hover {
	background: rgba(0, 170, 255, 0.2);
	color: var(--accent-color);
}

.detached-tab-content {
	flex: 1;
	overflow: auto;
	position: relative;
	background: var(--profiler-bg);
}

.detached-tab-content::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.detached-tab-content::-webkit-scrollbar-track {
	background: transparent;
}

.detached-tab-content::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	transition: background 0.3s ease;
}

.detached-tab-content::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}

.detached-tab-content::-webkit-scrollbar-corner {
	background: transparent;
}

.detached-tab-content .profiler-content {
	display: block !important;
	height: 100%;
	visibility: visible !important;
	opacity: 1 !important;
	position: relative !important;
}

.detached-tab-content .profiler-content > * {
	font-family: var(--font-mono);
	color: var(--text-primary);
}

.detached-tab-resizer {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 20px;
	height: 20px;
	cursor: nwse-resize;
	z-index: 10;
	touch-action: none;
}

.detached-tab-resizer::after {
	content: '';
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	border-right: 2px solid var(--profiler-border);
	border-bottom: 2px solid var(--profiler-border);
	border-bottom-right-radius: 6px;
	opacity: 0.5;
}

.detached-tab-resizer:hover::after {
	opacity: 1;
	border-color: var(--accent-color);
}

/* Edge resizers */
.detached-tab-resizer-top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 5px;
	cursor: ns-resize;
	z-index: 10;
	touch-action: none;
}

.detached-tab-resizer-right {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 5px;
	cursor: ew-resize;
	z-index: 10;
	touch-action: none;
}

.detached-tab-resizer-bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 5px;
	cursor: ns-resize;
	z-index: 10;
	touch-action: none;
}

.detached-tab-resizer-left {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 5px;
	cursor: ew-resize;
	z-index: 10;
	touch-action: none;
}

/* Input number spin buttons - hide arrows */
/* Chrome, Safari, Edge, Opera */
#profiler-panel input[type="number"]::-webkit-outer-spin-button,
#profiler-panel input[type="number"]::-webkit-inner-spin-button,
.detached-tab-content input[type="number"]::-webkit-outer-spin-button,
.detached-tab-content input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
#profiler-panel input[type="number"],
.detached-tab-content input[type="number"] {
	-moz-appearance: textfield;
}
`,e=document.createElement("style");e.id="profiler-styles",e.textContent=t,document.head.appendChild(e)}}class nn{constructor(){this.tabs={},this.activeTabId=null,this.isResizing=!1,this.lastHeightBottom=350,this.lastWidthRight=450,this.position="bottom",this.detachedWindows=[],this.isMobile=this.detectMobile(),this.maxZIndex=1002,this.nextTabOriginalIndex=0,en.init(),this.setupShell(),this.setupResizing(),this.isMobile&&this.setupOrientationListener(),this.setupWindowResizeListener()}detectMobile(){const t=navigator.userAgent||navigator.vendor||window.opera,e=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t),i="ontouchstart"in window||navigator.maxTouchPoints>0,n=window.innerWidth<=768;return e||i&&n}setupOrientationListener(){const t=()=>{const i=window.innerWidth>window.innerHeight?"right":"bottom";this.position!==i&&this.setPosition(i)};t(),window.addEventListener("orientationchange",t),window.addEventListener("resize",t)}setupWindowResizeListener(){const t=()=>{this.detachedWindows.forEach(i=>{this.constrainWindowToBounds(i.panel)})},e=()=>{if(this.panel.classList.contains("maximized"))return;const i=window.innerWidth,n=window.innerHeight;if(this.position==="bottom"){const s=this.panel.offsetHeight,o=n-50;s>o&&(this.panel.style.height=`${o}px`,this.lastHeightBottom=o)}else if(this.position==="right"){const s=this.panel.offsetWidth,o=i-50;s>o&&(this.panel.style.width=`${o}px`,this.lastWidthRight=o)}};window.addEventListener("resize",()=>{t(),e()})}constrainWindowToBounds(t){const e=window.innerWidth,i=window.innerHeight,n=t.offsetWidth,s=t.offsetHeight;let o=parseFloat(t.style.left)||t.offsetLeft||0,a=parseFloat(t.style.top)||t.offsetTop||0;const r=n/2,h=s/2;o+n>e+r&&(o=e+r-n),o<-r&&(o=-r),a+s>i+h&&(a=i+h-s),a<-h&&(a=-h),t.style.left=`${o}px`,t.style.top=`${a}px`}setupShell(){this.domElement=document.createElement("div"),this.domElement.id="profiler-shell",this.toggleButton=document.createElement("button"),this.toggleButton.id="profiler-toggle",this.toggleButton.innerHTML=`
<span id="builtin-tabs-container"></span>
<span id="toggle-text">
	<span id="fps-counter">-</span>
	<span class="fps-label">FPS</span>
</span>
<span id="toggle-icon">
	<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-ipad-horizontal-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v5.5" /><path d="M9 17h2" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
</span>
`,this.toggleButton.onclick=()=>this.togglePanel(),this.builtinTabsContainer=this.toggleButton.querySelector("#builtin-tabs-container"),this.miniPanel=document.createElement("div"),this.miniPanel.id="profiler-mini-panel",this.miniPanel.className="profiler-mini-panel",this.panel=document.createElement("div"),this.panel.id="profiler-panel";const t=document.createElement("div");t.className="profiler-header",this.tabsContainer=document.createElement("div"),this.tabsContainer.className="profiler-tabs";const e=document.createElement("div");e.className="profiler-controls",this.floatingBtn=document.createElement("button"),this.floatingBtn.id="floating-btn",this.floatingBtn.title="Switch to Right Side",this.floatingBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>',this.floatingBtn.onclick=()=>this.togglePosition(),this.isMobile&&(this.floatingBtn.style.display="none",this.panel.classList.add("hide-position-toggle")),this.maximizeBtn=document.createElement("button"),this.maximizeBtn.id="maximize-btn",this.maximizeBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',this.maximizeBtn.onclick=()=>this.toggleMaximize();const i=document.createElement("button");i.id="hide-panel-btn",i.textContent="-",i.onclick=()=>this.togglePanel(),e.append(this.floatingBtn,this.maximizeBtn,i),t.append(this.tabsContainer,e),this.contentWrapper=document.createElement("div"),this.contentWrapper.className="profiler-content-wrapper";const n=document.createElement("div");n.className="panel-resizer",this.panel.append(n,t,this.contentWrapper),this.domElement.append(this.toggleButton,this.miniPanel,this.panel),this.panel.classList.add(`position-${this.position}`)}setupResizing(){const t=this.panel.querySelector(".panel-resizer"),e=i=>{this.isResizing=!0,this.panel.classList.add("resizing"),t.setPointerCapture(i.pointerId);const n=i.clientX,s=i.clientY,o=this.panel.offsetHeight,a=this.panel.offsetWidth,r=c=>{if(!this.isResizing)return;c.preventDefault();const d=c.clientX,p=c.clientY;if(this.position==="bottom"){const u=o-(p-s);u>100&&u<window.innerHeight-50&&(this.panel.style.height=`${u}px`)}else if(this.position==="right"){const u=a-(d-n);u>200&&u<window.innerWidth-50&&(this.panel.style.width=`${u}px`)}},h=()=>{this.isResizing=!1,this.panel.classList.remove("resizing"),t.removeEventListener("pointermove",r),t.removeEventListener("pointerup",h),t.removeEventListener("pointercancel",h),this.panel.classList.contains("maximized")||(this.position==="bottom"?this.lastHeightBottom=this.panel.offsetHeight:this.position==="right"&&(this.lastWidthRight=this.panel.offsetWidth),this.saveLayout())};t.addEventListener("pointermove",r),t.addEventListener("pointerup",h),t.addEventListener("pointercancel",h)};t.addEventListener("pointerdown",e)}toggleMaximize(){this.panel.classList.contains("maximized")?(this.panel.classList.remove("maximized"),this.position==="bottom"?(this.panel.style.height=`${this.lastHeightBottom}px`,this.panel.style.width="100%"):this.position==="right"&&(this.panel.style.height="100%",this.panel.style.width=`${this.lastWidthRight}px`),this.maximizeBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'):(this.position==="bottom"?this.lastHeightBottom=this.panel.offsetHeight:this.position==="right"&&(this.lastWidthRight=this.panel.offsetWidth),this.panel.classList.add("maximized"),this.position==="bottom"?(this.panel.style.height="100vh",this.panel.style.width="100%"):this.position==="right"&&(this.panel.style.height="100%",this.panel.style.width="100vw"),this.maximizeBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>')}addTab(t){this.tabs[t.id]=t,t.originalIndex=this.nextTabOriginalIndex++,t.allowDetach===!1&&t.button.classList.add("no-detach"),t.onVisibilityChange=()=>this.updatePanelSize(),this.setupTabDragAndDrop(t),this.tabsContainer.appendChild(t.button),this.contentWrapper.appendChild(t.content),t.isVisible||(t.button.style.display="none",t.content.style.display="none"),t.builtin&&this.addBuiltinTab(t),this.updatePanelSize()}addBuiltinTab(t){const e=document.createElement("button");e.className="builtin-tab-btn",t.icon?e.innerHTML=t.icon:e.textContent=t.button.textContent.charAt(0).toUpperCase(),e.title=t.button.textContent;const i=document.createElement("div");i.className="mini-panel-content",i.style.display="none",t.builtinButton=e,t.miniContent=i,this.miniPanel.appendChild(i),e.onclick=n=>{if(n.stopPropagation(),this.panel.classList.contains("visible"))t.isVisible||t.show(),t.isDetached?t.detachedWindow&&this.bringWindowToFront(t.detachedWindow.panel):this.setActiveTab(t.id);else{const o=i.style.display!=="none"&&i.children.length>0;if(this.miniPanel.querySelectorAll(".mini-panel-content").forEach(a=>{a.style.display="none"}),this.builtinTabsContainer.querySelectorAll(".builtin-tab-btn").forEach(a=>{a.classList.remove("active")}),o)this.miniPanel.classList.remove("visible"),i.style.display="none",i.firstChild&&t.content.appendChild(i.firstChild);else{if(e.classList.add("active"),!i.firstChild){const a=t.content.querySelector(".list-scroll-wrapper")||t.content.firstElementChild;a&&i.appendChild(a)}i.style.display="block",this.miniPanel.classList.add("visible")}}},this.builtinTabsContainer.appendChild(e),t.builtinButton=e,t.miniContent=i,t.profiler=this,t.isVisible||(e.style.display="none",i.style.display="none",Array.from(this.builtinTabsContainer.querySelectorAll(".builtin-tab-btn")).some(s=>s.style.display!=="none")||(this.builtinTabsContainer.style.display="none"))}updatePanelSize(){Object.values(this.tabs).some(e=>!e.isDetached&&e.isVisible)?(this.panel.classList.remove("no-tabs"),Object.keys(this.tabs).length>0&&(this.position==="bottom"?parseInt(this.panel.style.height)===38&&(this.panel.style.height=`${this.lastHeightBottom}px`):this.position==="right"&&parseInt(this.panel.style.width)===45&&(this.panel.style.width=`${this.lastWidthRight}px`))):(this.panel.classList.add("no-tabs"),this.panel.classList.contains("maximized")&&(this.panel.classList.remove("maximized"),this.maximizeBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'),this.position==="bottom"?this.panel.style.height="38px":this.position==="right"&&(this.panel.style.width="45px"))}setupTabDragAndDrop(t){if(this.isMobile){t.button.addEventListener("click",()=>{this.setActiveTab(t.id)});return}if(t.allowDetach===!1){t.button.addEventListener("click",()=>{this.setActiveTab(t.id)}),t.button.style.cursor="default";return}let e=!1,i,n,s=!1,o=null;const a=10,r=d=>{i=d.clientX,n=d.clientY,e=!1,s=!1,t.button.setPointerCapture(d.pointerId)},h=d=>{const p=d.clientX,u=d.clientY,g=Math.abs(p-i),m=Math.abs(u-n);!e&&(g>a||m>a)&&(e=!0,t.button.style.cursor="grabbing",t.button.style.opacity="0.5",t.button.style.transform="scale(1.05)",o=this.createPreviewWindow(t,p,u),o.style.opacity="0.8"),e&&o&&(s=!0,d.preventDefault(),o.style.left=`${p-200}px`,o.style.top=`${u-20}px`)},c=()=>{if(e&&s&&o){o.parentNode&&o.parentNode.removeChild(o);const d=parseInt(o.style.left)+200,p=parseInt(o.style.top)+20;this.detachTab(t,d,p)}else s||this.setActiveTab(t.id),o&&o.parentNode&&o.parentNode.removeChild(o);t.button.style.opacity="",t.button.style.transform="",t.button.style.cursor="",e=!1,s=!1,o=null,t.button.removeEventListener("pointermove",h),t.button.removeEventListener("pointerup",c),t.button.removeEventListener("pointercancel",c)};t.button.addEventListener("pointerdown",d=>{r(d),t.button.addEventListener("pointermove",h),t.button.addEventListener("pointerup",c),t.button.addEventListener("pointercancel",c)}),t.button.style.cursor="grab"}createPreviewWindow(t,e,i){const n=document.createElement("div");n.className="detached-tab-panel",n.style.left=`${e-200}px`,n.style.top=`${i-20}px`,n.style.pointerEvents="none",this.maxZIndex++,n.style.setProperty("z-index",this.maxZIndex,"important");const s=document.createElement("div");s.className="detached-tab-header";const o=document.createElement("span");o.textContent=t.button.textContent.replace("⇱","").trim(),s.appendChild(o);const a=document.createElement("div");a.className="detached-header-controls";const r=document.createElement("button");r.className="detached-reattach-btn",r.innerHTML="↩",a.appendChild(r),s.appendChild(a);const h=document.createElement("div");h.className="detached-tab-content";const c=document.createElement("div");return c.className="detached-tab-resizer",n.appendChild(c),n.appendChild(s),n.appendChild(h),document.body.appendChild(n),n}detachTab(t,e,i){if(t.isDetached||t.allowDetach===!1)return;const s=Array.from(this.tabsContainer.children).map(h=>Object.keys(this.tabs).find(c=>this.tabs[c].button===h)).filter(h=>h!==void 0),o=s.indexOf(t.id);let a=null;if(this.activeTabId===t.id){t.setActive(!1);const h=s.filter(c=>c!==t.id&&!this.tabs[c].isDetached&&this.tabs[c].isVisible);if(h.length>0){for(let c=o-1;c>=0;c--)if(h.includes(s[c])){a=s[c];break}if(!a){for(let c=o+1;c<s.length;c++)if(h.includes(s[c])){a=s[c];break}}a||(a=h[0])}}t.button.parentNode&&t.button.parentNode.removeChild(t.button),t.content.parentNode&&t.content.parentNode.removeChild(t.content);const r=this.createDetachedWindow(t,e,i);this.detachedWindows.push(r),t.isDetached=!0,t.detachedWindow=r,a?this.setActiveTab(a):this.activeTabId===t.id&&(this.activeTabId=null),this.updatePanelSize(),this.saveLayout()}createDetachedWindow(t,e,i){const n=window.innerWidth,s=window.innerHeight,o=400,a=300;let r=e-200,h=i-20;r+o>n&&(r=n-o),r<0&&(r=0),h+a>s&&(h=s-a),h<0&&(h=0);const c=document.createElement("div");c.className="detached-tab-panel",c.style.left=`${r}px`,c.style.top=`${h}px`,this.panel.classList.contains("visible")||(c.style.opacity="0",c.style.visibility="hidden",c.style.pointerEvents="none"),t.isVisible||(c.style.display="none");const d=document.createElement("div");d.className="detached-tab-header";const p=document.createElement("span");p.textContent=t.button.textContent.replace("⇱","").trim(),d.appendChild(p);const u=document.createElement("div");u.className="detached-header-controls";const g=document.createElement("button");g.className="detached-reattach-btn",g.innerHTML="↩",g.title="Reattach to main panel",g.onclick=()=>this.reattachTab(t),u.appendChild(g),d.appendChild(u);const m=document.createElement("div");m.className="detached-tab-content",m.appendChild(t.content),t.content.style.display="block",t.content.classList.add("active");const v=document.createElement("div");v.className="detached-tab-resizer-top";const w=document.createElement("div");w.className="detached-tab-resizer-right";const E=document.createElement("div");E.className="detached-tab-resizer-bottom";const y=document.createElement("div");y.className="detached-tab-resizer-left";const N=document.createElement("div");return N.className="detached-tab-resizer",c.appendChild(v),c.appendChild(w),c.appendChild(E),c.appendChild(y),c.appendChild(N),c.appendChild(d),c.appendChild(m),document.body.appendChild(c),this.setupDetachedWindowDrag(c,d,t),this.setupDetachedWindowResize(c,v,w,E,y,N),c.style.setProperty("z-index",this.maxZIndex,"important"),{panel:c,tab:t}}bringWindowToFront(t){this.maxZIndex++,t.style.setProperty("z-index",this.maxZIndex,"important")}setupDetachedWindowDrag(t,e,i){let n=!1,s,o,a,r;t.addEventListener("pointerdown",()=>{this.bringWindowToFront(t)});const h=p=>{if(p.target.classList.contains("detached-reattach-btn"))return;this.bringWindowToFront(t),n=!0,e.style.cursor="grabbing",e.setPointerCapture(p.pointerId),s=p.clientX,o=p.clientY;const u=t.getBoundingClientRect();a=u.left,r=u.top},c=p=>{if(!n)return;p.preventDefault();const u=p.clientX,g=p.clientY,m=u-s,v=g-o;let w=a+m,E=r+v;const y=window.innerWidth,N=window.innerHeight,W=t.offsetWidth,C=t.offsetHeight,Y=W/2,F=C/2;w+W>y+Y&&(w=y+Y-W),w<-Y&&(w=-Y),E+C>N+F&&(E=N+F-C),E<-F&&(E=-F),t.style.left=`${w}px`,t.style.top=`${E}px`;const B=this.panel.getBoundingClientRect();u>=B.left&&u<=B.right&&g>=B.top&&g<=B.bottom?(t.style.opacity="0.5",this.panel.style.outline="2px solid var(--accent-color)"):(t.style.opacity="",this.panel.style.outline="")},d=p=>{if(!n)return;n=!1,e.style.cursor="",t.style.opacity="",this.panel.style.outline="";const u=p.clientX,g=p.clientY;if(u!==void 0&&g!==void 0){const m=this.panel.getBoundingClientRect();u>=m.left&&u<=m.right&&g>=m.top&&g<=m.bottom&&i?this.reattachTab(i):this.saveLayout()}e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",d),e.removeEventListener("pointercancel",d)};e.addEventListener("pointerdown",p=>{h(p),e.addEventListener("pointermove",c),e.addEventListener("pointerup",d),e.addEventListener("pointercancel",d)}),e.style.cursor="grab"}setupDetachedWindowResize(t,e,i,n,s,o){const h=(c,d)=>{let p=!1,u,g,m,v,w,E;const y=C=>{C.preventDefault(),C.stopPropagation(),p=!0,this.bringWindowToFront(t),c.setPointerCapture(C.pointerId),u=C.clientX,g=C.clientY,m=t.offsetWidth,v=t.offsetHeight,w=t.offsetLeft,E=t.offsetTop},N=C=>{if(!p)return;C.preventDefault();const Y=C.clientX,F=C.clientY,B=Y-u,Q=F-g,xt=window.innerWidth,wt=window.innerHeight;if(d==="right"||d==="corner"){const M=m+B,$=xt-w;M>=250&&M<=$&&(t.style.width=`${M}px`)}if(d==="bottom"||d==="corner"){const M=v+Q,$=wt-E;M>=150&&M<=$&&(t.style.height=`${M}px`)}if(d==="left"){const M=m-B,$=w+m-250;if(M>=250){const X=w+B;X>=0&&X<=$&&(t.style.width=`${M}px`,t.style.left=`${X}px`)}}if(d==="top"){const M=v-Q,$=E+v-150;if(M>=150){const X=E+Q;X>=0&&X<=$&&(t.style.height=`${M}px`,t.style.top=`${X}px`)}}},W=()=>{p=!1,c.removeEventListener("pointermove",N),c.removeEventListener("pointerup",W),c.removeEventListener("pointercancel",W),this.saveLayout()};c.addEventListener("pointerdown",C=>{y(C),c.addEventListener("pointermove",N),c.addEventListener("pointerup",W),c.addEventListener("pointercancel",W)})};h(e,"top"),h(i,"right"),h(n,"bottom"),h(s,"left"),h(o,"corner")}reattachTab(t){if(!t.isDetached)return;if(t.detachedWindow){const o=this.detachedWindows.indexOf(t.detachedWindow);o>-1&&this.detachedWindows.splice(o,1),t.detachedWindow.panel.parentNode&&t.detachedWindow.panel.parentNode.removeChild(t.detachedWindow.panel),t.detachedWindow=null}t.isDetached=!1;const i=Object.values(this.tabs).filter(o=>o.originalIndex!==void 0&&o.isVisible).sort((o,a)=>o.originalIndex-a.originalIndex),n=Array.from(this.tabsContainer.children);let s=0;for(const o of i){if(o.id===t.id)break;o.isDetached||s++}s>=n.length||n.length===0?this.tabsContainer.appendChild(t.button):this.tabsContainer.insertBefore(t.button,n[s]),this.contentWrapper.appendChild(t.content),this.setActiveTab(t.id),this.updatePanelSize(),this.saveLayout()}setActiveTab(t){this.activeTabId&&this.tabs[this.activeTabId]&&!this.tabs[this.activeTabId].isDetached&&this.tabs[this.activeTabId].setActive(!1),this.activeTabId=t,this.tabs[t]&&this.tabs[t].setActive(!0)}togglePanel(){this.panel.classList.toggle("visible"),this.toggleButton.classList.toggle("hidden");const t=this.panel.classList.contains("visible");if(t)this.savedMiniPanelState={isVisible:this.miniPanel.classList.contains("visible"),activeTabId:null,contentMap:{}},this.miniPanel.querySelectorAll(".mini-panel-content").forEach(e=>{e.style.display!=="none"&&e.firstChild&&Object.values(this.tabs).forEach(i=>{i.miniContent===e&&(this.savedMiniPanelState.activeTabId=i.id,i.content.appendChild(e.firstChild))})}),this.miniPanel.classList.remove("visible"),this.miniPanel.querySelectorAll(".mini-panel-content").forEach(e=>{e.style.display="none"}),this.builtinTabsContainer.querySelectorAll(".builtin-tab-btn").forEach(e=>{e.classList.remove("active")});else if(this.savedMiniPanelState&&this.savedMiniPanelState.isVisible&&this.savedMiniPanelState.activeTabId){const e=this.tabs[this.savedMiniPanelState.activeTabId];if(e&&e.miniContent&&e.builtinButton){this.miniPanel.classList.add("visible"),e.miniContent.style.display="block",e.builtinButton.classList.add("active");const i=e.content.querySelector(".list-scroll-wrapper, .profiler-content > *");i&&e.miniContent.appendChild(i)}}this.detachedWindows.forEach(e=>{t?(e.panel.style.opacity="",e.panel.style.visibility="",e.panel.style.pointerEvents=""):(e.panel.style.opacity="0",e.panel.style.visibility="hidden",e.panel.style.pointerEvents="none")})}togglePosition(){const t=this.position==="bottom"?"right":"bottom";this.setPosition(t)}setPosition(t){if(this.position===t)return;this.panel.style.transition="none";const e=this.panel.classList.contains("maximized");t==="right"?(this.position="right",this.floatingBtn.classList.add("active"),this.floatingBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M3 15h18"></path></svg>',this.floatingBtn.title="Switch to Bottom",this.panel.classList.remove("position-bottom"),this.panel.classList.add("position-right"),this.panel.style.bottom="",this.panel.style.top="0",this.panel.style.right="0",this.panel.style.left="",e?(this.panel.style.width="100vw",this.panel.style.height="100%"):(this.panel.style.width=`${this.lastWidthRight}px`,this.panel.style.height="100%")):(this.position="bottom",this.floatingBtn.classList.remove("active"),this.floatingBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>',this.floatingBtn.title="Switch to Right Side",this.panel.classList.remove("position-right"),this.panel.classList.add("position-bottom"),this.panel.style.top="",this.panel.style.right="",this.panel.style.bottom="0",this.panel.style.left="0",e?(this.panel.style.width="100%",this.panel.style.height="100vh"):(this.panel.style.width="100%",this.panel.style.height=`${this.lastHeightBottom}px`)),setTimeout(()=>{this.panel.style.transition=""},50),this.updatePanelSize(),this.saveLayout()}saveLayout(){const t={position:this.position,lastHeightBottom:this.lastHeightBottom,lastWidthRight:this.lastWidthRight,activeTabId:this.activeTabId,detachedTabs:[]};this.detachedWindows.forEach(e=>{const i=e.tab,n=e.panel,s=parseFloat(n.style.left)||n.offsetLeft||0,o=parseFloat(n.style.top)||n.offsetTop||0,a=n.offsetWidth,r=n.offsetHeight;t.detachedTabs.push({tabId:i.id,originalIndex:i.originalIndex!==void 0?i.originalIndex:0,left:s,top:o,width:a,height:r})});try{localStorage.setItem("profiler-layout",JSON.stringify(t))}catch(e){console.warn("Failed to save profiler layout:",e)}}loadLayout(){try{const t=localStorage.getItem("profiler-layout");if(!t)return;const e=JSON.parse(t);if(e.detachedTabs&&e.detachedTabs.length>0){const s=window.innerWidth,o=window.innerHeight;e.detachedTabs=e.detachedTabs.map(a=>{let{left:r,top:h,width:c,height:d}=a;c>s&&(c=s-100),d>o&&(d=o-100);const p=c/2,u=d/2;return r+c>s+p&&(r=s+p-c),r<-p&&(r=-p),h+d>o+u&&(h=o+u-d),h<-u&&(h=-u),{...a,left:r,top:h,width:c,height:d}})}e.position&&(this.position=e.position),e.lastHeightBottom&&(this.lastHeightBottom=e.lastHeightBottom),e.lastWidthRight&&(this.lastWidthRight=e.lastWidthRight);const i=window.innerWidth,n=window.innerHeight;this.lastHeightBottom>n-50&&(this.lastHeightBottom=n-50),this.lastWidthRight>i-50&&(this.lastWidthRight=i-50),this.position==="right"?(this.floatingBtn.classList.add("active"),this.floatingBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M3 15h18"></path></svg>',this.floatingBtn.title="Switch to Bottom",this.panel.classList.remove("position-bottom"),this.panel.classList.add("position-right"),this.panel.style.bottom="",this.panel.style.top="0",this.panel.style.right="0",this.panel.style.left="",this.panel.style.width=`${this.lastWidthRight}px`,this.panel.style.height="100%"):this.panel.style.height=`${this.lastHeightBottom}px`,e.activeTabId&&e.detachedTabs&&e.detachedTabs.some(o=>o.tabId===e.activeTabId)&&this.setActiveTab(e.activeTabId),e.detachedTabs&&e.detachedTabs.length>0&&(this.pendingDetachedTabs=e.detachedTabs,this.restoreDetachedTabs()),this.updatePanelSize()}catch(t){console.warn("Failed to load profiler layout:",t)}}restoreDetachedTabs(){if(!this.pendingDetachedTabs||this.pendingDetachedTabs.length===0)return;if(this.pendingDetachedTabs.forEach(e=>{const i=this.tabs[e.tabId];if(!i||i.isDetached)return;e.originalIndex!==void 0&&(i.originalIndex=e.originalIndex),i.button.parentNode&&i.button.parentNode.removeChild(i.button),i.content.parentNode&&i.content.parentNode.removeChild(i.content);const n=this.createDetachedWindow(i,0,0);n.panel.style.left=`${e.left}px`,n.panel.style.top=`${e.top}px`,n.panel.style.width=`${e.width}px`,n.panel.style.height=`${e.height}px`,this.constrainWindowToBounds(n.panel),this.detachedWindows.push(n),i.isDetached=!0,i.detachedWindow=n}),this.pendingDetachedTabs=null,this.detachedWindows.forEach(e=>{const i=parseInt(getComputedStyle(e.panel).zIndex)||0;i>this.maxZIndex&&(this.maxZIndex=i)}),!this.activeTabId||!this.tabs[this.activeTabId]||this.tabs[this.activeTabId].isDetached||!this.tabs[this.activeTabId].isVisible){const i=Object.keys(this.tabs).filter(n=>!this.tabs[n].isDetached&&this.tabs[n].isVisible);if(i.length>0){const s=Array.from(this.tabsContainer.children).map(o=>Object.keys(this.tabs).find(a=>this.tabs[a].button===o)).filter(o=>o!==void 0&&!this.tabs[o].isDetached&&this.tabs[o].isVisible);this.setActiveTab(s[0]||i[0])}else this.activeTabId=null}this.updatePanelSize()}}class zt{constructor(t,e={}){this.id=t.toLowerCase(),this.button=document.createElement("button"),this.button.className="tab-btn",this.button.textContent=t,this.content=document.createElement("div"),this.content.id=`${this.id}-content`,this.content.className="profiler-content",this.isActive=!1,this.isVisible=!0,this.isDetached=!1,this.detachedWindow=null,this.allowDetach=e.allowDetach!==void 0?e.allowDetach:!0,this.builtin=e.builtin!==void 0?e.builtin:!1,this.icon=e.icon||null,this.builtinButton=null,this.miniContent=null,this.profiler=null,this.onVisibilityChange=null}setActive(t){this.button.classList.toggle("active",t),this.content.classList.toggle("active",t),this.isActive=t}show(){this.content.style.display="",this.button.style.display="",this.isVisible=!0,this.isDetached&&this.detachedWindow&&(this.detachedWindow.panel.style.display=""),this.onVisibilityChange&&this.onVisibilityChange(),this.showBuiltin()}hide(){this.content.style.display="none",this.button.style.display="none",this.isVisible=!1,this.isDetached&&this.detachedWindow&&(this.detachedWindow.panel.style.display="none"),this.onVisibilityChange&&this.onVisibilityChange(),this.hideBuiltin()}showBuiltin(){if(this.builtin&&(this.profiler&&this.profiler.builtinTabsContainer&&(this.profiler.builtinTabsContainer.style.display=""),this.builtinButton&&(this.builtinButton.style.display=""),this.miniContent&&this.profiler)){if(this.profiler.miniPanel.querySelectorAll(".mini-panel-content").forEach(t=>{t.style.display="none"}),this.profiler.builtinTabsContainer.querySelectorAll(".builtin-tab-btn").forEach(t=>{t.classList.remove("active")}),this.builtinButton&&this.builtinButton.classList.add("active"),!this.miniContent.firstChild){const t=this.content.querySelector(".list-scroll-wrapper")||this.content.firstElementChild;t&&this.miniContent.appendChild(t)}this.miniContent.style.display="block",this.profiler.miniPanel.classList.add("visible")}}hideBuiltin(){this.builtin&&(this.builtinButton&&(this.builtinButton.style.display="none"),this.miniContent&&(this.miniContent.style.display="none",this.miniContent.firstChild&&this.content.appendChild(this.miniContent.firstChild)),this.builtinButton&&this.builtinButton.classList.remove("active"),this.profiler&&(Array.from(this.profiler.miniPanel.querySelectorAll(".mini-panel-content")).some(i=>i.style.display!=="none")||this.profiler.miniPanel.classList.remove("visible"),Array.from(this.profiler.builtinTabsContainer.querySelectorAll(".builtin-tab-btn")).some(i=>i.style.display!=="none")||(this.profiler.builtinTabsContainer.style.display="none")))}}class qt{constructor(...t){this.headers=t,this.children=[],this.domElement=document.createElement("div"),this.domElement.className="list-container",this.domElement.style.padding="10px",this.id=`list-${Math.random().toString(36).substr(2,9)}`,this.domElement.dataset.listId=this.id,this.gridStyleElement=document.createElement("style"),this.domElement.appendChild(this.gridStyleElement);const e=document.createElement("div");e.className="list-header",this.headers.forEach(i=>{const n=document.createElement("div");n.className="list-header-cell",n.textContent=i,e.appendChild(n)}),this.domElement.appendChild(e)}setGridStyle(t){this.gridStyleElement.textContent=`
[data-list-id="${this.id}"] > .list-header,
[data-list-id="${this.id}"] .list-item-row {
	grid-template-columns: ${t};
}
`}add(t){t.parent!==null&&t.parent.remove(t),t.domElement.classList.add("header-wrapper","section-start"),t.parent=this,this.children.push(t),this.domElement.appendChild(t.domElement)}remove(t){const e=this.children.indexOf(t);return e!==-1&&(this.children.splice(e,1),this.domElement.removeChild(t.domElement),t.parent=null),this}}class sn{constructor(t=512){this.maxPoints=t,this.lines={},this.limit=0,this.limitIndex=0,this.domElement=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.domElement.setAttribute("class","graph-svg")}addLine(t,e){const i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("class","graph-path"),i.style.stroke=`var(${e})`,i.style.fill=`var(${e})`,this.domElement.appendChild(i),this.lines[t]={path:i,color:e,points:[]}}addPoint(t,e){const i=this.lines[t];i&&(i.points.push(e),i.points.length>this.maxPoints&&i.points.shift(),e>this.limit&&(this.limit=e,this.limitIndex=0))}resetLimit(){this.limit=0,this.limitIndex=0}update(){const t=this.domElement.clientWidth,e=this.domElement.clientHeight;if(t===0)return;const i=t/(this.maxPoints-1);for(const n in this.lines){const s=this.lines[n];let o=`M 0,${e}`;for(let r=0;r<s.points.length;r++){const h=r*i,c=e-s.points[r]/this.limit*e;o+=` L ${h},${c}`}o+=` L ${(s.points.length-1)*i},${e} Z`;const a=t-(s.points.length-1)*i;s.path.setAttribute("transform",`translate(${a}, 0)`),s.path.setAttribute("d",o)}this.limitIndex++>this.maxPoints&&this.resetLimit()}}class z{constructor(...t){this.children=[],this.isOpen=!0,this.childrenContainer=null,this.parent=null,this.domElement=document.createElement("div"),this.domElement.className="list-item-wrapper",this.itemRow=document.createElement("div"),this.itemRow.className="list-item-row",this.userData={},this.data=t,this.data.forEach(e=>{const i=document.createElement("div");i.className="list-item-cell",e instanceof HTMLElement?i.appendChild(e):i.append(String(e)),this.itemRow.appendChild(i)}),this.domElement.appendChild(this.itemRow),this.onItemClick=this.onItemClick.bind(this)}onItemClick(t){t.target.closest("button, a, input, label")||this.toggle()}add(t,e=this.children.length){return t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.splice(e,0,t),this.itemRow.classList.add("collapsible"),this.childrenContainer||(this.childrenContainer=document.createElement("div"),this.childrenContainer.className="list-children-container",this.childrenContainer.classList.toggle("closed",!this.isOpen),this.domElement.appendChild(this.childrenContainer),this.itemRow.addEventListener("click",this.onItemClick)),this.childrenContainer.insertBefore(t.domElement,this.childrenContainer.children[e]||null),this.updateToggler(),this}remove(t){const e=this.children.indexOf(t);return e!==-1&&(this.children.splice(e,1),this.childrenContainer.removeChild(t.domElement),t.parent=null,this.children.length===0&&(this.itemRow.classList.remove("collapsible"),this.itemRow.removeEventListener("click",this.onItemClick),this.childrenContainer.remove(),this.childrenContainer=null),this.updateToggler()),this}updateToggler(){const t=this.itemRow.querySelector(".list-item-cell:first-child");let e=this.itemRow.querySelector(".item-toggler");this.children.length>0?(e||(e=document.createElement("span"),e.className="item-toggler",t.prepend(e)),this.isOpen&&this.itemRow.classList.add("open")):e&&e.remove()}toggle(){return this.isOpen=!this.isOpen,this.itemRow.classList.toggle("open",this.isOpen),this.childrenContainer&&this.childrenContainer.classList.toggle("closed",!this.isOpen),this}close(){return this.isOpen&&this.toggle(),this}}function T(l=null){const t=document.createElement("span");return t.className="value",l!==null&&(t.id=l),t}function R(l,t){const e=l instanceof HTMLElement?l:document.getElementById(l);e&&e.textContent!==t&&(e.textContent=t)}function on(l){const t=l.lastIndexOf("/");if(t===-1)return{path:"",name:l.trim()};const e=l.substring(0,t).trim(),i=l.substring(t+1).trim();return{path:e,name:i}}function an(l){return l.replace(/([a-z0-9])([A-Z])/g,"$1 $2").trim()}class rn extends zt{constructor(t={}){super("Performance",t);const e=new qt("Name","CPU","GPU","Total");e.setGridStyle("minmax(200px, 2fr) 80px 80px 80px"),e.domElement.style.minWidth="600px";const i=document.createElement("div");i.className="list-scroll-wrapper",i.appendChild(e.domElement),this.content.appendChild(i);const n=document.createElement("div");n.className="graph-container";const s=new sn;s.addLine("fps","--accent-color"),n.append(s.domElement);const o=new z("Graph Stats",T(),T(),T("graph-fps-counter"));e.add(o);const a=new z(n);a.itemRow.childNodes[0].style.gridColumn="1 / -1",o.add(a);const r=new z("Frame Stats",T(),T(),T());e.add(r);const h=new z("Miscellaneous & Idle",T(),T(),T());h.domElement.firstChild.style.backgroundColor="#00ff0b1a",h.domElement.firstChild.classList.add("no-hover"),r.add(h),this.notInUse=new Map,this.frameStats=r,this.graphStats=o,this.graph=s,this.miscellaneous=h,this.currentRender=null,this.currentItem=null,this.frameItems=new Map}resolveStats(t,e){const i=t.getStatsData(e.cid);let n=i.item;if(n===void 0)n=new z(T(),T(),T(),T()),e.name?e.isComputeStats===!0&&(e.name=`${e.name} [ Compute ]`):e.name=`Unnamed ${e.cid}`,n.userData.name=e.name,this.currentItem.add(n),i.item=n;else{n.userData.name=e.name,this.notInUse.has(e.cid)&&(n.domElement.firstElementChild.classList.remove("alert"),this.notInUse.delete(e.cid));const a=e.parent.children.indexOf(e);(n.parent===null||n.parent.children.indexOf(n)!==a)&&this.currentItem.add(n,a)}let s=n.userData.name;e.isComputeStats&&(s+=" [ Compute ]"),R(n.data[0],s),R(n.data[1],i.cpu.toFixed(2)),R(n.data[2],e.gpuNotAvailable===!0?"-":i.gpu.toFixed(2)),R(n.data[3],i.total.toFixed(2));const o=this.currentItem;this.currentItem=n;for(const a of e.children)this.resolveStats(t,a);this.currentItem=o,this.frameItems.set(e.cid,n)}updateGraph(t){this.graph.addPoint("fps",t.fps),this.graph.update()}addNotInUse(t,e){e.domElement.firstElementChild.classList.add("alert"),this.notInUse.set(t,{item:e,time:performance.now()}),this.updateNotInUse(t)}updateNotInUse(t){const{item:e,time:i}=this.notInUse.get(t),n=performance.now(),o=5-Math.floor((n-i)/1e3);if(o>=0){const a="*".repeat(Math.max(0,o)),r=e.domElement.querySelector(".list-item-cell .value");R(r,e.userData.name+" (not in use) "+a)}else e.domElement.firstElementChild.classList.remove("alert"),e.parent.remove(e),this.notInUse.delete(t)}updateText(t,e){const i=new Map(this.frameItems);this.frameItems.clear(),this.currentItem=this.frameStats;for(const n of e.children)this.resolveStats(t,n);for(const[n,s]of i)this.frameItems.has(n)||(this.addNotInUse(n,s),i.delete(n));for(const n of this.notInUse.keys())this.updateNotInUse(n);R("graph-fps-counter",t.fps.toFixed()+" FPS"),R(this.frameStats.data[1],e.cpu.toFixed(2)),R(this.frameStats.data[2],e.gpu.toFixed(2)),R(this.frameStats.data[3],e.total.toFixed(2)),R(this.miscellaneous.data[1],e.miscellaneous.toFixed(2)),R(this.miscellaneous.data[2],"-"),R(this.miscellaneous.data[3],e.miscellaneous.toFixed(2)),this.currentItem=null}}class ln extends zt{constructor(t={}){super("Console",t),this.filters={info:!0,warn:!0,error:!0},this.filterText="",this.buildHeader(),this.logContainer=document.createElement("div"),this.logContainer.id="console-log",this.content.appendChild(this.logContainer)}buildHeader(){const t=document.createElement("div");t.className="console-header";const e=document.createElement("input");e.type="text",e.className="console-filter-input",e.placeholder="Filter...",e.addEventListener("input",s=>{this.filterText=s.target.value.toLowerCase(),this.applyFilters()});const i=document.createElement("button");i.className="console-copy-button",i.title="Copy all",i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',i.addEventListener("click",()=>this.copyAll(i));const n=document.createElement("div");n.className="console-buttons-group",Object.keys(this.filters).forEach(s=>{const o=document.createElement("label");o.className="custom-checkbox",o.style.color=`var(--${s==="info"?"text-primary":"color-"+(s==="warn"?"yellow":"red")})`;const a=document.createElement("input");a.type="checkbox",a.checked=this.filters[s],a.dataset.type=s;const r=document.createElement("span");r.className="checkmark",o.appendChild(a),o.appendChild(r),o.append(s.charAt(0).toUpperCase()+s.slice(1)),n.appendChild(o)}),n.addEventListener("change",s=>{const o=s.target.dataset.type;o in this.filters&&(this.filters[o]=s.target.checked,this.applyFilters())}),n.appendChild(i),t.appendChild(e),t.appendChild(n),this.content.appendChild(t)}applyFilters(){this.logContainer.querySelectorAll(".log-message").forEach(e=>{const i=e.dataset.type,n=e.dataset.rawText.toLowerCase(),s=this.filters[i],o=n.includes(this.filterText);e.classList.toggle("hidden",!(s&&o))})}copyAll(t){const i=this.logContainer.ownerDocument.defaultView.getSelection(),n=i.toString(),s=n&&this.logContainer.contains(i.anchorNode);let o;if(s)o=n;else{const a=this.logContainer.querySelectorAll(".log-message:not(.hidden)");o=Array.from(a).map(r=>r.dataset.rawText).join(`
`)}navigator.clipboard.writeText(o),t.classList.add("copied"),setTimeout(()=>t.classList.remove("copied"),350)}_getIcon(t,e){let i;return e==="tip"?i="💭":e==="tsl"?i="✨":e==="webgpurenderer"?i="🎨":t==="warn"?i="⚠️":t==="error"?i="🔴":t==="info"&&(i="ℹ️"),i}_formatMessage(t,e){const i=document.createDocumentFragment(),n=e.match(/^([\w\.]+:\s)/);let s=e;if(n){const a=n[0],r=a.slice(0,-2).split("."),h=(r.length>1?r[r.length-1]:r[0])+":",c=this._getIcon(t,h.split(":")[0].toLowerCase());i.appendChild(document.createTextNode(c+" "));const d=document.createElement("span");d.className="log-prefix",d.textContent=h,i.appendChild(d),s=e.substring(a.length)}const o=s.split(/(".*?"|'.*?'|`.*?`)/g).map(a=>a.trim()).filter(Boolean);return o.forEach((a,r)=>{if(/^("|'|`)/.test(a)){const h=document.createElement("span");h.className="log-code",h.textContent=a.slice(1,-1),i.appendChild(h)}else r>0&&(a=" "+a),r<o.length-1&&(a+=" "),i.appendChild(document.createTextNode(a))}),i}addMessage(t,e){const i=document.createElement("div");i.className=`log-message ${t}`,i.dataset.type=t,i.dataset.rawText=e,i.appendChild(this._formatMessage(t,e));const n=this.filters[t],s=e.toLowerCase().includes(this.filterText);i.classList.toggle("hidden",!(n&&s)),this.logContainer.appendChild(i),this.logContainer.scrollTop=this.logContainer.scrollHeight,this.logContainer.children.length>200&&this.logContainer.removeChild(this.logContainer.firstChild)}}class ht extends gi{constructor(){super(),this.domElement=document.createElement("div"),this.domElement.className="param-control",this._onChangeFunction=null,this.addEventListener("change",t=>{requestAnimationFrame(()=>{this._onChangeFunction&&this._onChangeFunction(t.value)})})}setValue(){return this.dispatchChange(),this}getValue(){return null}dispatchChange(){this.dispatchEvent({type:"change",value:this.getValue()})}onChange(t){return this._onChangeFunction=t,this}}class Pe extends ht{constructor({value:t=0,step:e=.1,min:i=-1/0,max:n=1/0}){super(),this.input=document.createElement("input"),this.input.type="number",this.input.value=t,this.input.step=e,this.input.min=i,this.input.max=n,this.input.addEventListener("change",this._onChangeValue.bind(this)),this.domElement.appendChild(this.input),this.addDragHandler()}_onChangeValue(){const t=parseFloat(this.input.value),e=parseFloat(this.input.min),i=parseFloat(this.input.max);t>i?this.input.value=i:t<e?this.input.value=e:isNaN(t)&&(this.input.value=e),this.dispatchChange()}addDragHandler(){let t=!1,e,i;this.input.addEventListener("mousedown",n=>{t=!0,e=n.clientY,i=parseFloat(this.input.value),document.body.style.cursor="ns-resize"}),document.addEventListener("mousemove",n=>{if(t){const s=e-n.clientY,o=parseFloat(this.input.step)||1,a=parseFloat(this.input.min),r=parseFloat(this.input.max);let h=o;!isNaN(r)&&isFinite(a)&&(h=(r-a)/100);const c=s*h;let d=i+c;d=Math.max(a,Math.min(d,r));const p=(String(o).split(".")[1]||[]).length;this.input.value=d.toFixed(p),this.input.dispatchEvent(new Event("input")),this.dispatchChange()}}),document.addEventListener("mouseup",()=>{t&&(t=!1,document.body.style.cursor="default")})}setValue(t){return this.input.value=t,super.setValue(t)}getValue(){return parseFloat(this.input.value)}}class hn extends ht{constructor({value:t=!1}){super();const e=document.createElement("label");e.className="custom-checkbox";const i=document.createElement("input");i.type="checkbox",i.checked=t,this.checkbox=i;const n=document.createElement("span");n.className="checkmark",e.appendChild(i),e.appendChild(n),this.domElement.appendChild(e),i.addEventListener("change",()=>{this.dispatchChange()})}setValue(t){return this.checkbox.value=t,super.setValue(t)}getValue(){return this.checkbox.checked}}class cn extends ht{constructor({value:t=0,min:e=0,max:i=1,step:n=.01}){super(),this.slider=document.createElement("input"),this.slider.type="range",this.slider.min=e,this.slider.max=i,this.slider.step=n;const s=new Pe({value:t,min:e,max:i,step:n});this.numberInput=s.input,this.numberInput.style.flexBasis="80px",this.numberInput.style.flexShrink="0",this.slider.value=t,this.domElement.append(this.slider,this.numberInput),this.slider.addEventListener("input",()=>{this.numberInput.value=this.slider.value,this.dispatchChange()}),s.addEventListener("change",()=>{this.slider.value=parseFloat(this.numberInput.value),this.dispatchChange()})}setValue(t){return this.slider.value=t,this.numberInput.value=t,super.setValue(t)}getValue(){return parseFloat(this.slider.value)}step(t){return this.slider.step=t,this.numberInput.step=t,this}}class dn extends ht{constructor({options:t=[],value:e=""}){super();const i=document.createElement("select"),n=(s,o)=>{const a=document.createElement("option");return a.value=s,a.textContent=s,o==e&&(a.selected=!0),i.appendChild(a),a};Array.isArray(t)?t.forEach(s=>n(s,s)):Object.entries(t).forEach(([s,o])=>n(s,o)),this.domElement.appendChild(i),i.addEventListener("change",()=>{this.dispatchChange()}),this.options=t,this.select=i}getValue(){const t=this.options;return Array.isArray(t)?t[this.select.selectedIndex]:t[this.select.value]}}class pn extends ht{constructor({value:t="#ffffff"}){super();const e=document.createElement("input");e.type="color",e.value=this._getColorHex(t),this.colorInput=e,this._value=t,e.addEventListener("input",()=>{const i=e.value;this._value.isColor?this._value.setHex(parseInt(i.slice(1),16)):this._value=i,this.dispatchChange()}),this.domElement.appendChild(e)}_getColorHex(t){return t.isColor&&(t=t.getHex()),typeof t=="number"?t=`#${t.toString(16)}`:t[0]!=="#"&&(t="#"+t),t}getValue(){let t=this._value;return typeof t=="string"&&(t=parseInt(t.slice(1),16)),t}}class un extends ht{constructor({text:t="Button",value:e=()=>{}}){super();const i=document.createElement("button");i.textContent=t,i.onclick=e,this.domElement.appendChild(i)}}class Gt{constructor(t,e){this.parameters=t,this.name=e,this.paramList=new z(e),this.objects=[]}close(){return this.paramList.close(),this}add(t,e,...i){const s=typeof t[e];let o=null;return typeof i[0]=="object"?o=this.addSelect(t,e,i[0]):s==="number"?i.length>=2?o=this.addSlider(t,e,...i):o=this.addNumber(t,e,...i):s==="boolean"?o=this.addBoolean(t,e):s==="function"&&(o=this.addButton(t,e,...i)),o}_addParameter(t,e,i,n){i.name=s=>(n.data[0].textContent=s,i),i.listen=()=>{const s=()=>{const o=i.getValue(),a=t[e];o!==a&&i.setValue(a),requestAnimationFrame(s)};return requestAnimationFrame(s),i},this._registerParameter(t,e,i,n)}_registerParameter(t,e,i,n){this.objects.push({object:t,key:e,editor:i,subItem:n})}addFolder(t){const e=new Gt(this.parameters,t);return this.paramList.add(e.paramList),e}addBoolean(t,e){const i=t[e],n=new hn({value:i});n.addEventListener("change",({value:r})=>{t[e]=r});const s=T();s.textContent=e;const o=new z(s,n.domElement);this.paramList.add(o);const a=o.domElement.firstChild;return a.classList.add("actionable"),a.addEventListener("click",r=>{if(r.target.closest("label"))return;const h=a.querySelector('input[type="checkbox"]');h&&(h.checked=!h.checked,h.dispatchEvent(new Event("change")))}),this._addParameter(t,e,n,o),n}addSelect(t,e,i){const n=t[e],s=new dn({options:i,value:n});s.addEventListener("change",({value:h})=>{t[e]=h});const o=T();o.textContent=e;const a=new z(o,s.domElement);return this.paramList.add(a),a.domElement.firstChild.classList.add("actionable"),this._addParameter(t,e,s,a),s}addColor(t,e){const i=t[e],n=new pn({value:i});n.addEventListener("change",({value:r})=>{t[e]=r});const s=T();s.textContent=e;const o=new z(s,n.domElement);return this.paramList.add(o),o.domElement.firstChild.classList.add("actionable"),this._addParameter(t,e,n,o),n}addSlider(t,e,i=0,n=1,s=.01){const o=t[e],a=new cn({value:o,min:i,max:n,step:s});a.addEventListener("change",({value:d})=>{t[e]=d});const r=T();r.textContent=e;const h=new z(r,a.domElement);return this.paramList.add(h),h.domElement.firstChild.classList.add("actionable"),this._addParameter(t,e,a,h),a}addNumber(t,e,...i){const n=t[e],[s,o]=i,a=new Pe({value:n,min:s,max:o});a.addEventListener("change",({value:d})=>{t[e]=d});const r=T();r.textContent=e;const h=new z(r,a.domElement);return this.paramList.add(h),h.domElement.firstChild.classList.add("actionable"),this._addParameter(t,e,a,h),a}addButton(t,e){const i=t[e],n=new un({text:e,value:i});n.addEventListener("change",({value:a})=>{t[e]=a});const s=new z(n.domElement);return s.itemRow.childNodes[0].style.gridColumn="1 / -1",this.paramList.add(s),s.domElement.firstChild.classList.add("actionable"),n.name=a=>(n.domElement.childNodes[0].textContent=a,n),this._registerParameter(t,e,n,s),n}}class mn extends zt{constructor(t={}){super("Parameters",t);const e=new qt("Property","Value");e.domElement.classList.add("parameters"),e.setGridStyle(".5fr 1fr"),e.domElement.style.minWidth="300px";const i=document.createElement("div");i.className="list-scroll-wrapper",i.appendChild(e.domElement),this.content.appendChild(i),this.paramList=e,this.groups=[]}createGroup(t){const e=new Gt(this,t);return this.paramList.add(e.paramList),this.groups.push(e),e}}class fn extends zt{constructor(t={}){super("Viewer",t);const e=new qt("Viewer","Name");e.setGridStyle("150px minmax(200px, 2fr)"),e.domElement.style.minWidth="400px";const i=document.createElement("div");i.className="list-scroll-wrapper",i.appendChild(e.domElement),this.content.appendChild(i);const n=new z("Nodes");e.add(n),this.itemLibrary=new Map,this.folderLibrary=new Map,this.currentDataList=[],this.nodeList=e,this.nodes=n}getFolder(t){let e=this.folderLibrary.get(t);return e===void 0&&(e=new z(t),this.folderLibrary.set(t,e),this.nodeList.add(e)),e}addNodeItem(t){let e=this.itemLibrary.get(t.id);if(e===void 0){const i=t.name,n=t.canvasTarget.domElement;e=new z(n,i),e.itemRow.children[1].style["justify-content"]="flex-start",this.itemLibrary.set(t.id,e)}return e}update(t,e){if(!this.isActive&&!this.isDetached)return;const i=[...this.currentDataList];for(const s of i)if(this.itemLibrary.has(s.id)&&e.indexOf(s)===-1){const o=this.itemLibrary.get(s.id),a=o.parent;a.remove(o),this.folderLibrary.has(a.data[0])&&a.children.length===0&&(a.parent.remove(a),this.folderLibrary.delete(a.data[0])),this.itemLibrary.delete(s.id)}const n={};for(const s of e){const o=this.addNodeItem(s),a=t.getCanvasTarget(),r=s.path;if(r){const c=this.getFolder(r);n[r]===void 0&&(n[r]=0),(c.parent===null||o.parent!==c||c.children.indexOf(o)!==n[r])&&c.add(o),n[r]++}else o.parent||this.nodes.add(o);this.currentDataList=e;const h=Mt.resetRendererState(t);t.toneMapping=Te,t.outputColorSpace=bi,t.setCanvasTarget(s.canvasTarget),s.quad.render(t),t.setCanvasTarget(a),Mt.restoreRendererState(t,h)}}}const gn=U(([l,t])=>{const e=b(0);Je(()=>{const{width:a,height:r}=t.value;e.value=a/r});const i=l.sub(.5),s=Ce(i.x.div(e),i.y).add(.5),o=bt(0,s.x).mul(bt(s.x,1)).mul(bt(0,s.y)).mul(bt(s.y,1));return q(s,o)});class bn extends tn{constructor(){super();const t=new nn,e=new mn({builtin:!0,icon:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>'});e.hide(),t.addTab(e);const i=new fn;i.hide(),t.addTab(i);const n=new rn;t.addTab(n);const s=new ln;t.addTab(s),t.loadLayout(),t.activeTabId||t.setActiveTab(n.id),this.statsData=new Map,this.canvasNodes=new Map,this.profiler=t,this.performance=n,this.console=s,this.parameters=e,this.viewer=i,this.once={},this.displayCycle={text:{needsUpdate:!1,duration:.25,time:0},graph:{needsUpdate:!1,duration:.02,time:0}}}get domElement(){return this.profiler.domElement}resolveConsoleOnce(t,e){const i=t+e;this.once[i]!==!0&&(this.resolveConsole(t,e),this.once[i]=!0)}resolveConsole(t,e,i=null){switch(t){case"log":this.console.addMessage("info",e),console.log(e);break;case"warn":this.console.addMessage("warn",e),i&&i.isStackTrace?console.warn(i.getError(e)):console.warn(e);break;case"error":this.console.addMessage("error",e),i&&i.isStackTrace?console.error(i.getError(e)):console.error(e);break}}init(){const t=this.getRenderer();let e=`THREE.WebGPURenderer: ${xi} [ "`;t.backend.isWebGPUBackend?e+="WebGPU":t.backend.isWebGLBackend&&(e+="WebGL2"),e+='" ]',this.console.addMessage("info",e),t.inspector.domElement.parentElement===null&&t.domElement.parentElement!==null&&t.domElement.parentElement.appendChild(t.inspector.domElement)}setRenderer(t){return super.setRenderer(t),t!==null&&(wi(this.resolveConsole.bind(this)),this.isAvailable&&t.init().then(()=>{t.backend.trackTimestamp=!0,t.hasFeature("timestamp-query")!==!0&&this.console.addMessage("error","THREE.Inspector: GPU Timestamp Queries not available.")})),this}createParameters(t){return this.parameters.isVisible===!1&&(this.parameters.show(),this.parameters.isDetached===!1&&this.profiler.setActiveTab(this.parameters.id)),this.parameters.createGroup(t)}getStatsData(t){let e=this.statsData.get(t);return e===void 0&&(e={},this.statsData.set(t,e)),e}resolveStats(t){const e=this.getStatsData(t.cid);e.initialized!==!0&&(e.cpu=t.cpu,e.gpu=t.gpu,e.stats=[],e.initialized=!0),e.stats.length>this.maxFrames&&e.stats.shift(),e.stats.push(t),e.cpu=this.getAverageDeltaTime(e,"cpu"),e.gpu=this.getAverageDeltaTime(e,"gpu"),e.total=e.cpu+e.gpu;for(const i of t.children){this.resolveStats(i);const n=this.getStatsData(i.cid);e.cpu+=n.cpu,e.gpu+=n.gpu,e.total+=n.total}}getCanvasDataByNode(t){let e=this.canvasNodes.get(t);if(e===void 0){const i=this.getRenderer(),n=document.createElement("canvas"),s=new Ge(n);s.setPixelRatio(window.devicePixelRatio),s.setSize(140,140);const o=t.id,{path:a,name:r}=on(an(t.getName()||"(unnamed)")),h=t.context({getUV:u=>{const g=gn(Ke,u),m=g.xy,v=g.z;return m.mul(v)}});let c=K(q(h),1);c=Qe(c,Te,i.outputColorSpace),c=c.context({inspector:!0});const d=new Pt;d.outputNode=c;const p=new _e(d);p.name="Viewer - "+r,e={id:o,name:r,path:a,node:t,quad:p,canvasTarget:s,material:d},this.canvasNodes.set(t,e)}return e}resolveViewer(){const t=this.currentNodes,e=this.getRenderer();if(t.length===0)return;if(!e.backend.isWebGPUBackend){this.resolveConsoleOnce("warn","Inspector: Viewer is only available with WebGPU.");return}this.viewer.isVisible||this.viewer.show();const i=t.map(n=>this.getCanvasDataByNode(n));this.viewer.update(e,i)}getAverageDeltaTime(t,e,i=this.fps){const n=t.stats;let s=0,o=0;for(let a=n.length-1;a>=0&&o<i;a--){const h=n[a][e];h>0&&(s+=h,o++)}return o>0?s/o:0}resolveFrame(t){const e=this.getFrameById(t.frameId+1);if(e){t.cpu=0,t.gpu=0,t.total=0;for(const i of t.children){this.resolveStats(i);const n=this.getStatsData(i.cid);t.cpu+=n.cpu,t.gpu+=n.gpu,t.total+=n.total}t.deltaTime=e.startTime-t.startTime,t.miscellaneous=t.deltaTime-t.total,t.miscellaneous<0&&(t.miscellaneous=0),this.updateCycle(this.displayCycle.text),this.updateCycle(this.displayCycle.graph),this.displayCycle.text.needsUpdate&&(R("fps-counter",this.fps.toFixed()),this.performance.updateText(this,t)),this.displayCycle.graph.needsUpdate&&this.performance.updateGraph(this,t),this.displayCycle.text.needsUpdate=!1,this.displayCycle.graph.needsUpdate=!1}}updateCycle(t){t.time+=this.nodeFrame.deltaTime,t.time>=t.duration&&(t.needsUpdate=!0,t.time=0)}}let Xt=typeof navigator<"u"&&navigator.gpu!==void 0;typeof window<"u"&&Xt&&(Xt=!!await navigator.gpu.requestAdapter());class ve{static isAvailable(){return!!Xt}static getErrorMessage(){const t='Your browser does not support <a href="https://gpuweb.github.io/gpuweb/" style="color:blue">WebGPU</a> yet',e=document.createElement("div");return e.id="webgpumessage",e.style.fontFamily="monospace",e.style.fontSize="13px",e.style.fontWeight="normal",e.style.textAlign="center",e.style.background="#fff",e.style.color="#000",e.style.padding="1.5em",e.style.maxWidth="400px",e.style.margin="5em auto 0",e.innerHTML=t,e}}const _n=He(function(){const l=ae.useRef(null);return ae.useEffect(()=>{let t,e,i,n,s,o,a,r,h,c;const d=new S,p=new P,u=new ke(new P(0,0,1),0),g=new yi,m=Math.pow(2,13),v=b(1),w=b(.5),E=b(1),y=b(.005),N=b(0),W=b(2),C=b(1),Y=b(0),F=b(5),B=b(q(0)),Q=b(q(0)),xt=b(.5),wt=b(.5),M=b(2),$=b(2),X=b(.5),Kt=b(.01);Me();async function Me(){if(ve.isAvailable()===!1)throw document.body.appendChild(ve.getErrorMessage()),new Error("No WebGPU support");t=new vi(60,window.innerWidth/window.innerHeight,.1,200),t.position.set(0,0,10),e=new _i,o=new Ei,o.connect(document),i=new ti({antialias:!0}),i.setClearColor(1316634),i.setPixelRatio(window.devicePixelRatio),i.setSize(window.innerWidth,window.innerHeight),i.setAnimationLoop(Re),i.inspector=new bn,i.toneMapping=Ci,l.current.appendChild(i.domElement),await i.init(),c=U(([x])=>ei(le(255),N.add(ii(x.toFloat().mul(.1),2,2,.5,W))));const L=gt(new he(m,4),"vec4",m),Qt=gt(new he(m,4),"vec4",m);i.compute(U(()=>{L.element(A).xyz.assign(q(1e4)),L.element(A).w.assign(q(-1))})().compute(m));const Jt=.05,Ne=new ki(Jt,Jt),J=new ni;J.blending=be,J.depthWrite=!1,J.positionNode=L.toAttribute(),J.scaleNode=Ce(3),J.colorNode=U(()=>{const x=L.toAttribute().w,I=ce(x.oneMinus(),8,1),H=ce(Tt(Wt(A).mul(Ft).add(si.mul(.5).mul(Ft))).mul(.5).add(.5),.25,.25).mul(10).add(1);return c(A).mul(H.mul(I))})(),J.opacityNode=U(()=>{const x=bt(Ee().xy.sub(.5).length(),.5),I=L.toAttribute().w;return x.mul(I)})();const Dt=new Ti(Ne,J,m);Dt.instanceMatrix.setUsage(Li),Dt.frustumCulled=!1,e.add(Dt);const te=[];for(let x=0;x<m;x++){const I=x*8;for(let H=0;H<2;H++){const O=I+H*4;te.push(O,O+1,O+2,O,O+2,O+3)}}const ee=m*8,It=new de(ee,4),ct=new de(ee,4),yt=new Si;yt.setAttribute("position",It),yt.setAttribute("color",ct),yt.setIndex(te);const G=new oi;G.vertexColors=!0,G.side=Pi,G.transparent=!0,G.depthWrite=!1,G.depthTest=!1,G.blending=be,G.opacityNode=gt(ct,"vec4",ct.count).toAttribute().w;const ie=new xe(yt,G);ie.frustumCulled=!1,e.add(ie),r=U(()=>{const x=L.element(A).xyz,I=L.element(A).w,H=Qt.element(A).xyz,O=ai.mul(.1).mul(v);Ht(I.greaterThan(0),()=>{const Nt=ri(x.mul(xt),M,$,X,wt).mul(I.add(.01));H.addAssign(Nt),H.mulAssign(Kt.oneMinus()),x.addAssign(H.mul(O)),I.subAssign(O.mul(w.reciprocal()));const ot=nt(1e4).toVar(),at=q(0).toVar(),_t=nt(0).toVar(),Et=nt(1e4).toVar(),ut=q(0).toVar(),mt=nt(0).toVar();$t(m,({i:et})=>{const kt=L.element(et);Ht(et.notEqual(A).and(kt.w.greaterThan(0)),()=>{const Bt=kt.xyz,ft=x.sub(Bt).lengthSq(),oe=ft.greaterThan(0);Ht(ft.lessThan(ot).and(oe),()=>{ot.assign(ft),at.assign(Bt.xyz),_t.assign(kt.w)}).ElseIf(ft.lessThan(Et).and(oe),()=>{Et.assign(ft),ut.assign(Bt.xyz),mt.assign(kt.w)})})});const k=gt(It,"vec4",It.count),Ct=gt(ct,"vec4",ct.count),V=A.mul(8),Z=V.add(4);k.element(V).xyz.assign(x),k.element(V).y.addAssign(y),k.element(V.add(1)).xyz.assign(x),k.element(V.add(1)).y.addAssign(y.negate()),k.element(V.add(2)).xyz.assign(at),k.element(V.add(2)).y.addAssign(y.negate()),k.element(V.add(3)).xyz.assign(at),k.element(V.add(3)).y.addAssign(y),k.element(Z).xyz.assign(x),k.element(Z).y.addAssign(y),k.element(Z.add(1)).xyz.assign(x),k.element(Z.add(1)).y.addAssign(y.negate()),k.element(Z.add(2)).xyz.assign(ut),k.element(Z.add(2)).y.addAssign(y.negate()),k.element(Z.add(3)).xyz.assign(ut),k.element(Z.add(3)).y.addAssign(y);const se=c(A),We=pe(0,ue(_t,I)).pow(.8),Fe=pe(0,ue(mt,I)).pow(.8);$t(4,({i:et})=>{Ct.element(V.add(et)).xyz.assign(se),Ct.element(V.add(et)).w.assign(We),Ct.element(Z.add(et)).xyz.assign(se),Ct.element(Z.add(et)).w.assign(Fe)})})})().compute(m).setName("Update Particles"),h=U(()=>{const x=Y.add(A).mod(m).toInt(),I=L.element(x).xyz,H=L.element(x).w,O=Qt.element(x).xyz;H.assign(1);const Nt=nt(.01),ot=Wt(x).mul(Ft),at=Wt(x.add(1)).mul(li),_t=Tt(ot).mul(me(at)),Et=Tt(ot).mul(Tt(at)),ut=me(ot),mt=q(_t,Et,ut),k=Yt(Q,B,A.toFloat().div(F.sub(1).toFloat()).clamp());I.assign(k.add(mt.mul(Nt))),O.assign(mt.mul(5))})().compute(F.value).setName("Spawn Particles");const Be=new Mi(100,5).applyMatrix4(new zi().makeScale(-1,1,1)),dt=new hi;dt.roughness=.4,dt.metalness=.9,dt.flatShading=!0,dt.colorNode=le(4456448);const Ae=new xe(Be,dt);e.add(Ae),a=new Di(16777215,3e3),e.add(a),n=new ci(i);const ne=di(e,t).getTextureNode("output"),vt=Ki(ne,.75,.1,.5);n.outputNode=ne.add(vt),s=new Ri(t,i.domElement),s.enableDamping=!0,s.autoRotate=!0,s.maxDistance=75,window.addEventListener("resize",ze),window.addEventListener("pointermove",De);const pt=i.inspector.createParameters("Parameters");pt.add(s,"autoRotate").name("Auto Rotate"),pt.add(s,"autoRotateSpeed",-10,10,.01).name("Auto Rotate Speed");const tt=pt.addFolder("Particles");tt.add(v,"value",0,4,.01).name("timeScale"),tt.add(F,"value",1,100,1).name("Spawn rate"),tt.add(E,"value",.01,3,.01).name("Size"),tt.add(w,"value",.01,2,.01).name("Lifetime"),tt.add(y,"value",.001,.1,.001).name("Links width"),tt.add(W,"value",0,10,.01).name("Color variance"),tt.add(C,"value",0,5,.01).name("Color rotation speed");const st=pt.addFolder("Turbulence");st.add(Kt,"value",0,.3,.01).name("Friction"),st.add(xt,"value",0,1,.01).name("Frequency"),st.add(wt,"value",0,10,.01).name("Amplitude"),st.add(M,"value",1,9,1).name("Octaves"),st.add($,"value",1,5,.01).name("Lacunarity"),st.add(X,"value",0,1,.01).name("Gain");const Rt=pt.addFolder("bloom");Rt.add(vt.threshold,"value",0,2,.01).name("Threshold"),Rt.add(vt.strength,"value",0,10,.01).name("Strength"),Rt.add(vt.radius,"value",0,1,.01).name("Radius")}function ze(){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight)}function De(L){d.x=L.clientX/window.innerWidth*2-1,d.y=-(L.clientY/window.innerHeight)*2+1}function Ie(){g.setFromCamera(d,t),g.ray.intersectPlane(u,p)}function Re(){o.update(),i.compute(r),i.compute(h),Y.value=(Y.value+F.value)%m,u.normal.applyEuler(t.rotation),Ie(),Q.value.copy(B.value),B.value.lerp(p,.1),N.value+=o.getDelta()*C.value*v.value;const L=o.getElapsed();a.position.set(Math.sin(L*.5)*30,Math.cos(L*.3)*30,Math.sin(L*.2)*30),s.update(),n?.render()}},[]),Oe.jsx("div",{ref:l,className:"h-screen"})});export{_n as default};
