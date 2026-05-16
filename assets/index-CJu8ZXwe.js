import{w as ee,o as x,r as q}from"./chunk-EPOLDU6W-D-U-5P6E.js";import"./leva.esm-CD9oxMAJ.js";import{J as b,aL as te,a0 as ie,F as j,i as I,an as se,ad as re,a8 as oe,b as ae,n as de}from"./three.tsl-CTbA1yiX.js";import{W as le}from"./WebGpuCanvas-BU9BkIBK.js";import{a as ne}from"./asset-BvcpElq9.js";import"./tsl-AU3jedcy.js";import"./curlNoise3d-5p7NJerc.js";import"./tweakpane-ZayJk8yu.js";import{$ as ce,al as ue,N as A,I as he}from"./three.module-_piUs-D2.js";import{O as pe}from"./OrbitControls-CNEd5UP6.js";import{E as me}from"./Environment-Db5rsHSj.js";import{b as xe,u as ge}from"./extends-BiVYuz_A.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-7OC5HNn7.js";import"./index-n5PR1bfd.js";import"./Loader-BBMetSDN.js";import"./constants-3BDCSyz7.js";const ye={performance:{simResolution:128,dyeResolution:256,pressureIterations:6},balanced:{simResolution:256,dyeResolution:512,pressureIterations:12},quality:{simResolution:384,dyeResolution:1024,pressureIterations:20}},p=8,m=8,K=16,ve=K*4,g="rgba16float",y=`
struct Params {
  a: vec4<f32>,
  b: vec4<f32>,
  c: vec4<f32>,
  d: vec4<f32>,
};

@group(0) @binding(0) var<uniform> params: Params;

fn simWidth() -> u32 {
  return u32(params.a.x);
}

fn simHeight() -> u32 {
  return u32(params.a.y);
}

fn texelSize() -> vec2<f32> {
  return params.a.zw;
}

fn inBounds(coord: vec2<u32>) -> bool {
  return coord.x < simWidth() && coord.y < simHeight();
}

fn loadClamped(tex: texture_2d<f32>, x: i32, y: i32) -> vec4<f32> {
  let w = i32(simWidth());
  let h = i32(simHeight());
  let cx = clamp(x, 0, w - 1);
  let cy = clamp(y, 0, h - 1);
  return textureLoad(tex, vec2<i32>(cx, cy), 0);
}

fn normalizedUvYUp(coord: vec2<u32>) -> vec2<f32> {
  let size = vec2<f32>(f32(simWidth()), f32(simHeight()));
  let topDown = (vec2<f32>(coord) + vec2<f32>(0.5)) / size;
  return vec2<f32>(topDown.x, 1.0 - topDown.y);
}

fn sampleYUp(tex: texture_2d<f32>, texSampler: sampler, uvYUp: vec2<f32>) -> vec4<f32> {
  return textureSampleLevel(tex, texSampler, vec2<f32>(uvYUp.x, 1.0 - uvYUp.y), 0.0);
}
`,fe={fill:`
${y}
@group(0) @binding(1) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  textureStore(targetTex, coord, params.b);
}
`,decay:`
${y}
@group(0) @binding(1) var sourceTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let value = loadClamped(sourceTex, i32(coord.x), i32(coord.y)) * params.b.x;
  textureStore(targetTex, coord, value);
}
`,splat:`
${y}
@group(0) @binding(1) var sourceTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let vUv = normalizedUvYUp(coord);
  let center = params.c.xy;
  let halfSize = max(params.c.z, 0.000001);
  let aspect = params.c.w;
  let local = vec2<f32>(
    (vUv.x - center.x) * 2.0 * aspect / halfSize,
    (vUv.y - center.y) * 2.0 / halfSize
  );
  let amount = pow(clamp(1.0 - length(local), 0.0, 1.0), 2.0);
  let previous = loadClamped(sourceTex, i32(coord.x), i32(coord.y));
  let splatValue = vec4<f32>(params.b.xyz * amount, amount);

  textureStore(targetTex, coord, previous + splatValue);
}
`,curl:`
${y}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(velocityTex, x - 1, y).y;
  let R = loadClamped(velocityTex, x + 1, y).y;
  let T = loadClamped(velocityTex, x, y - 1).x;
  let B = loadClamped(velocityTex, x, y + 1).x;
  let vorticity = (R - L - T + B) * 0.5;

  textureStore(targetTex, coord, vec4<f32>(vorticity, 0.0, 0.0, 1.0));
}
`,vorticity:`
${y}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var curlTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(curlTex, x - 1, y).x;
  let R = loadClamped(curlTex, x + 1, y).x;
  let T = loadClamped(curlTex, x, y - 1).x;
  let B = loadClamped(curlTex, x, y + 1).x;
  let C = loadClamped(curlTex, x, y).x;
  let forceRaw = vec2<f32>(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;
  let forceN = forceRaw / (length(forceRaw) + 0.0001);
  let force = forceN * params.c.x * C;
  let velocity = loadClamped(velocityTex, x, y).xy;
  let outVelocity = velocity + vec2<f32>(force.x, -force.y) * params.c.y;

  textureStore(targetTex, coord, vec4<f32>(outVelocity, 0.0, 1.0));
}
`,divergence:`
${y}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let C = loadClamped(velocityTex, x, y).xy;
  var L = loadClamped(velocityTex, x - 1, y).x;
  var R = loadClamped(velocityTex, x + 1, y).x;
  var T = loadClamped(velocityTex, x, y - 1).y;
  var B = loadClamped(velocityTex, x, y + 1).y;

  if (params.c.x > 0.5) {
    if (coord.x == 0u) {
      L = -C.x;
    }
    if (coord.x == simWidth() - 1u) {
      R = -C.x;
    }
    if (coord.y == 0u) {
      T = -C.y;
    }
    if (coord.y == simHeight() - 1u) {
      B = -C.y;
    }
  }

  let div = (R - L + T - B) * 0.5;
  textureStore(targetTex, coord, vec4<f32>(div, 0.0, 0.0, 1.0));
}
`,pressure:`
${y}
@group(0) @binding(1) var pressureTex: texture_2d<f32>;
@group(0) @binding(2) var divergenceTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(pressureTex, x - 1, y).x;
  let R = loadClamped(pressureTex, x + 1, y).x;
  let T = loadClamped(pressureTex, x, y - 1).x;
  let B = loadClamped(pressureTex, x, y + 1).x;
  let div = loadClamped(divergenceTex, x, y).x;
  let value = (L + R + B + T - div) * 0.25;

  textureStore(targetTex, coord, vec4<f32>(value, 0.0, 0.0, 1.0));
}
`,gradientSubtract:`
${y}
@group(0) @binding(1) var pressureTex: texture_2d<f32>;
@group(0) @binding(2) var velocityTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(pressureTex, x - 1, y).x;
  let R = loadClamped(pressureTex, x + 1, y).x;
  let T = loadClamped(pressureTex, x, y - 1).x;
  let B = loadClamped(pressureTex, x, y + 1).x;
  let velocity = loadClamped(velocityTex, x, y).xy;
  let projected = velocity - vec2<f32>(R - L, T - B);

  textureStore(targetTex, coord, vec4<f32>(projected, 0.0, 1.0));
}
`,advect:`
${y}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var sourceTex: texture_2d<f32>;
@group(0) @binding(3) var linearSampler: sampler;
@group(0) @binding(4) var targetTex: texture_storage_2d<${g}, write>;

@compute @workgroup_size(${p}, ${m}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let vUv = normalizedUvYUp(coord);
  let dt = params.c.x;
  let dissipation = params.c.y;
  let useBFECC = select(0.0, 1.0, params.c.z >= 0.5);
  let velocity = sampleYUp(velocityTex, linearSampler, vUv).xy;
  let coordPlain = vUv - velocity * dt * texelSize();
  let samplePlain = sampleYUp(sourceTex, linearSampler, coordPlain);

  let spotOld = vUv - velocity * dt * texelSize();
  let velBack = sampleYUp(velocityTex, linearSampler, spotOld).xy;
  let spotForward = spotOld + velBack * dt * texelSize();
  let error = spotForward - vUv;
  let spotMid = vUv - error * 0.5;
  let velMid = sampleYUp(velocityTex, linearSampler, spotMid).xy;
  let coordBFECC = spotMid - velMid * dt * texelSize();
  let sampleBFECC = sampleYUp(sourceTex, linearSampler, coordBFECC);
  let result = (samplePlain * (1.0 - useBFECC) + sampleBFECC * useBFECC) * dissipation;

  textureStore(targetTex, coord, vec4<f32>(result.rgb, 1.0));
}
`};function L(d,t,e,s){const i=new te(d,t);return i.name=s,i.format=ce,i.type=ue,i.generateMipmaps=!1,i.mipmapsAutoUpdate=!1,e||(i.minFilter=A,i.magFilter=A),i}function $(d,t,e,s){return{read:L(d,t,e,`${s}.read`),write:L(d,t,e,`${s}.write`)}}function P(d,t,e){d.setSize(t,e,1)}function z(d,t,e){P(d.read,t,e),P(d.write,t,e)}function _(d){const t=d.read;d.read=d.write,d.write=t}function D(d){d.read.dispose(),d.write.dispose()}function C(d,t){const e=new Float32Array(K);return e[0]=d,e[1]=t,e[2]=1/d,e[3]=1/t,e}class be{simResolution;dyeResolution;pressureIterations;densityDissipation;velocityDissipation;pressureDissipation;curlStrength;splatRadius;splatForce;baseDelta;enableVorticity;bfecc;reflectWalls;enableDye=!1;dyeDissipation;densityNode;dyeNode;velocityNode;pressureNode;divergenceNode;curlNode;renderer;backend;device;velocity;density;dye;pressure;divergence;curl;pipelines;linearSampler;uniformBuffers=[];textureViews=new Map;bindGroups=new Map;splats=[];frameUniformIndex=0;targetsNeedClear=!0;viewportWidth=1;viewportHeight=1;simWidth;simHeight;dyeWidth;dyeHeight;constructor(t,e={}){this.renderer=t,this.backend=this.getWebGPUBackend(t),this.device=this.backend.device;const s=ye[e.profile??"balanced"];this.simResolution=e.simResolution??s.simResolution,this.dyeResolution=e.dyeResolution??s.dyeResolution,this.pressureIterations=e.pressureIterations??s.pressureIterations,this.densityDissipation=e.densityDissipation??.91,this.velocityDissipation=e.velocityDissipation??.985,this.pressureDissipation=e.pressureDissipation??.8,this.curlStrength=e.curlStrength??.55,this.splatRadius=e.splatRadius??42e-5,this.splatForce=e.splatForce??6,this.baseDelta=e.baseDelta??1/60,this.enableVorticity=e.enableVorticity??!1,this.bfecc=e.bfecc??!0,this.reflectWalls=e.reflectWalls??!0,this.dyeDissipation=e.dyeDissipation??this.densityDissipation,this.simWidth=this.simResolution,this.simHeight=this.simResolution,this.dyeWidth=this.dyeResolution,this.dyeHeight=this.dyeResolution,this.velocity=$(this.simWidth,this.simHeight,!0,"fluid.wgsl.velocity"),this.density=$(this.dyeWidth,this.dyeHeight,!0,"fluid.wgsl.density"),this.dye=$(this.dyeWidth,this.dyeHeight,!0,"fluid.wgsl.dye"),this.pressure=$(this.simWidth,this.simHeight,!1,"fluid.wgsl.pressure"),this.divergence=L(this.simWidth,this.simHeight,!1,"fluid.wgsl.divergence"),this.curl=L(this.simWidth,this.simHeight,!1,"fluid.wgsl.curl"),this.initGpuTextures(),this.densityNode=b(this.density.read),this.dyeNode=b(this.dye.read),this.velocityNode=b(this.velocity.read),this.pressureNode=b(this.pressure.read),this.divergenceNode=b(this.divergence),this.curlNode=b(this.curl),this.linearSampler=this.device.createSampler({label:"fluid.wgsl.linearSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.pipelines=this.createPipelines()}get velocityTexture(){return this.velocity.read}get velocityProjectedTexture(){return this.velocity.write}get densityTexture(){return this.density.read}get dyeTexture(){return this.dye.read}resize(t,e){this.viewportWidth=Math.max(1,t),this.viewportHeight=Math.max(1,e);const s=this.viewportWidth/this.viewportHeight;let i,o,l,r;s>=1?(i=this.simResolution,o=Math.max(1,Math.round(this.simResolution/s)),l=this.dyeResolution,r=Math.max(1,Math.round(this.dyeResolution/s))):(i=Math.max(1,Math.round(this.simResolution*s)),o=this.simResolution,l=Math.max(1,Math.round(this.dyeResolution*s)),r=this.dyeResolution);let a=!1;(i!==this.simWidth||o!==this.simHeight)&&(this.simWidth=i,this.simHeight=o,z(this.velocity,i,o),z(this.pressure,i,o),P(this.divergence,i,o),P(this.curl,i,o),this.targetsNeedClear=!0,a=!0),(l!==this.dyeWidth||r!==this.dyeHeight)&&(this.dyeWidth=l,this.dyeHeight=r,z(this.density,l,r),z(this.dye,l,r),this.targetsNeedClear=!0,a=!0),a&&(this.initGpuTextures(),this.textureViews.clear(),this.bindGroups.clear())}addSplat(t,e,s,i,o={}){this.splats.push({x:Math.min(1,Math.max(0,t)),y:Math.min(1,Math.max(0,e)),dx:s,dy:i,radius:o.radius??this.splatRadius,color:o.color,dyeColor:o.dyeColor})}step(t){const e=Math.min(Math.max(t,1e-6),.016666666666666666),s=this.baseDelta>0?e/this.baseDelta:1,i=this.device.createCommandEncoder({label:"fluid.wgsl.step"});this.frameUniformIndex=0,this.targetsNeedClear&&(this.clearTargets(i),this.targetsNeedClear=!1);for(let a=0;a<this.splats.length;a+=1)this.applySplat(i,this.splats[a]);if(this.splats.length=0,this.enableVorticity&&this.dispatch(i,"curl",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.curl}]),this.enableVorticity){const a=C(this.simWidth,this.simHeight);a[8]=this.curlStrength,a[9]=e,this.dispatch(i,"vorticity",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.curl},{binding:3,texture:this.velocity.write}],a),_(this.velocity)}const o=C(this.simWidth,this.simHeight);o[8]=this.reflectWalls?1:0,this.dispatch(i,"divergence",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.divergence}],o);const l=C(this.simWidth,this.simHeight);l[4]=Math.pow(this.pressureDissipation,s),this.dispatch(i,"decay",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.pressure.write}],l),_(this.pressure);for(let a=0;a<this.pressureIterations;a+=1)this.dispatch(i,"pressure",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.divergence},{binding:3,texture:this.pressure.write}]),_(this.pressure);this.dispatch(i,"gradientSubtract",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.velocity.read},{binding:3,texture:this.velocity.write}]),_(this.velocity);const r=this.bfecc?1:0;this.advectTexture(i,this.velocity,this.simWidth,this.simHeight,Math.pow(this.velocityDissipation,s),e,r),this.advectTexture(i,this.density,this.dyeWidth,this.dyeHeight,Math.pow(this.densityDissipation,s),e,r),this.enableDye&&this.advectTexture(i,this.dye,this.dyeWidth,this.dyeHeight,Math.pow(this.dyeDissipation,s),e,r),this.device.queue.submit([i.finish()]),this.refreshPublicNodes()}dispose(){D(this.velocity),D(this.density),D(this.dye),D(this.pressure),this.divergence.dispose(),this.curl.dispose();for(const t of this.uniformBuffers)t.destroy();this.uniformBuffers.length=0,this.textureViews.clear(),this.bindGroups.clear()}getWebGPUBackend(t){const e=t.backend;if(!e?.isWebGPUBackend||!e.device)throw new Error("WGSLFluidSimulation requires WebGPURenderer with the WebGPU backend.");return e}createPipelines(){return Object.entries(fe).reduce((e,[s,i])=>{const o=this.device.createShaderModule({label:`fluid.wgsl.${s}.module`,code:i});return e[s]=this.device.createComputePipeline({label:`fluid.wgsl.${s}.pipeline`,layout:"auto",compute:{module:o,entryPoint:"main"}}),e},{})}initGpuTextures(){for(const t of this.allTextures())this.renderer.initTexture(t)}allTextures(){return[this.velocity.read,this.velocity.write,this.density.read,this.density.write,this.dye.read,this.dye.write,this.pressure.read,this.pressure.write,this.divergence,this.curl]}getGpuTexture(t){const e=this.backend.get(t).texture;if(!e)throw new Error(`Missing GPUTexture for ${t.name||"StorageTexture"}.`);return e}getTextureView(t){let e=this.textureViews.get(t.id);return e||(e=this.getGpuTexture(t).createView(),this.textureViews.set(t.id,e)),e}writeUniform(t){const e=this.frameUniformIndex;this.frameUniformIndex+=1;let s=this.uniformBuffers[e];return s||(s=this.device.createBuffer({label:`fluid.wgsl.uniform.${e}`,size:ve,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.uniformBuffers[e]=s),this.device.queue.writeBuffer(s,0,t.buffer,t.byteOffset,t.byteLength),{index:e,buffer:s}}getBindGroup(t,e,s,i){const o=[t,e,...i.map(r=>"texture"in r?`${r.binding}:texture:${r.texture.id}`:`${r.binding}:sampler:${r.sampler}`)].join("|");let l=this.bindGroups.get(o);if(!l){const r=[{binding:0,resource:{buffer:s}}];for(const a of i)r.push("texture"in a?{binding:a.binding,resource:this.getTextureView(a.texture)}:{binding:a.binding,resource:this.linearSampler});l=this.device.createBindGroup({label:`fluid.wgsl.${t}.bindGroup`,layout:this.pipelines[t].getBindGroupLayout(0),entries:r}),this.bindGroups.set(o,l)}return l}dispatch(t,e,s,i,o,l=C(s,i)){const r=this.writeUniform(l),a=t.beginComputePass({label:`fluid.wgsl.${e}`});a.setPipeline(this.pipelines[e]),a.setBindGroup(0,this.getBindGroup(e,r.index,r.buffer,o)),a.dispatchWorkgroups(Math.ceil(s/p),Math.ceil(i/m),1),a.end()}clearTargets(t){this.clearTexture(t,this.velocity.read,this.simWidth,this.simHeight),this.clearTexture(t,this.velocity.write,this.simWidth,this.simHeight),this.clearTexture(t,this.pressure.read,this.simWidth,this.simHeight),this.clearTexture(t,this.pressure.write,this.simWidth,this.simHeight),this.clearTexture(t,this.divergence,this.simWidth,this.simHeight),this.clearTexture(t,this.curl,this.simWidth,this.simHeight),this.clearTexture(t,this.density.read,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.density.write,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.dye.read,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.dye.write,this.dyeWidth,this.dyeHeight)}clearTexture(t,e,s,i){this.dispatch(t,"fill",s,i,[{binding:1,texture:e}])}applySplat(t,e){const s=e.color??[e.dx,e.dy,1];this.applySplatToDouble(t,this.velocity,this.simWidth,this.simHeight,e,s),this.applySplatToDouble(t,this.density,this.dyeWidth,this.dyeHeight,e,s),this.enableDye&&e.dyeColor&&this.applySplatToDouble(t,this.dye,this.dyeWidth,this.dyeHeight,e,e.dyeColor)}applySplatToDouble(t,e,s,i,o,l){const r=C(s,i);r[4]=l[0],r[5]=l[1],r[6]=l[2],r[7]=1,r[8]=o.x,r[9]=o.y,r[10]=Math.max(1e-6,3*Math.sqrt(o.radius)),r[11]=this.viewportWidth/this.viewportHeight,this.dispatch(t,"splat",s,i,[{binding:1,texture:e.read},{binding:2,texture:e.write}],r),_(e)}advectTexture(t,e,s,i,o,l,r){const a=C(s,i);a[8]=l,a[9]=o,a[10]=r,this.dispatch(t,"advect",s,i,[{binding:1,texture:this.velocity.read},{binding:2,texture:e.read},{binding:3,sampler:"linear"},{binding:4,texture:e.write}],a),_(e)}refreshPublicNodes(){this.densityNode.value=this.density.read,this.dyeNode.value=this.dye.read,this.velocityNode.value=this.velocity.read,this.pressureNode.value=this.pressure.read,this.divergenceNode.value=this.divergence,this.curlNode.value=this.curl}}function X(d,t,e){const s=Math.floor(d*6),i=d*6-s,o=e*(1-t),l=e*(1-i*t),r=e*(1-(1-i)*t);switch(s%6){case 0:return[e,r,o];case 1:return[l,e,o];case 2:return[o,e,r];case 3:return[o,l,e];case 4:return[r,o,e];default:return[e,o,l]}}function Te(d,t,e={}){const s=e.coloredStrokes??!1,i=e.colorUpdateSpeed??10,o=e.colorize;let l=X(Math.random(),1,1),r=0;const a=n=>[n[0]*.3,n[1]*.3,n[2]*.3];let f=0,F=0,M=0,c=!1,T=0,w=0,u=-1,N=0,H=0,W=1,S=1;const h=()=>{const n=d.getBoundingClientRect();N=n.left,H=n.top,W=Math.max(1,n.width),S=Math.max(1,n.height)};h(),requestAnimationFrame(()=>{h(),requestAnimationFrame(h)});const B=new ResizeObserver(h);B.observe(d);const Y=n=>{if((W<4||S<4)&&(h(),W<4||S<4))return;const k=n.timeStamp||performance.now(),U=k-M;U>200&&(c=!1),u!==-1&&n.pointerId!==u&&(c=!1),u=n.pointerId,M=k;const J=!c;s&&(r+=Math.min(Math.max(U,0),100)/1e3*i,(J||r>=1)&&(r>=1&&(r%=1),l=X(Math.random(),1,1)));const Q=(n.clientX-N)/W,Z=1-(n.clientY-H)/S,G=c?n.movementX||n.clientX-f:0,E=c?-(n.movementY||n.clientY-F):0;if(f=n.clientX,F=n.clientY,c=!0,Math.abs(G)+Math.abs(E)<.25)return;const O=T||w?Math.hypot(n.clientX-T,n.clientY-w):0;if(U>0&&O/U>6.5&&O>200){c=!1,T=n.clientX,w=n.clientY;return}T=n.clientX,w=n.clientY;const V=t.splatForce;let R;o&&(R=o(G,E,k)),R===void 0&&s&&(R=a(l)),t.addSplat(Q,Z,G*V,E*V,R?{dyeColor:R}:void 0)},v=()=>{c=!1};return d.addEventListener("pointermove",Y),d.addEventListener("pointerout",v),d.addEventListener("pointercancel",v),window.addEventListener("blur",v),document.addEventListener("visibilitychange",v),window.addEventListener("resize",h),window.addEventListener("scroll",h,{passive:!0}),()=>{B.disconnect(),d.removeEventListener("pointermove",Y),d.removeEventListener("pointerout",v),d.removeEventListener("pointercancel",v),window.removeEventListener("blur",v),document.removeEventListener("visibilitychange",v),window.removeEventListener("resize",h),window.removeEventListener("scroll",h)}}function we(){const{gl:e,size:s}=xe(),i=e,{fluid:o,posNode:l,updatePos:r}=q.useMemo(()=>{const a=new be(i,{profile:"balanced",splatRadius:.001,splatForce:6});a.enableDye=!0,a.resize(s.width,s.height),Te(i.domElement,a);const f=5,M=new he(f,6).getAttribute("position").array,c=ie(M,"vec3"),T=j(()=>{const u=c.element(I).toVar();return se.add(u)})(),w=j(()=>{const u=c.element(I).toVar(),H=re(u.y,u.x).div(Math.PI*2).add(.5),S=oe(u.z.div(f).clamp(-1,1)).div(Math.PI),h=ae(H,S),B=b(a.velocityNode,h).xyz;u.addAssign(B.mul(de).mul(3)),c.element(I).assign(u)})().compute(1e4);return{fluid:a,posNode:T,updatePos:w}},[]);return ge((a,f)=>{o.step(f),i.compute(r)}),x.jsxs("instancedMesh",{args:[void 0,void 0,1e4],children:[x.jsx("icosahedronGeometry",{args:[.1,1]}),x.jsx("meshBasicNodeMaterial",{positionNode:l})]})}const Ee=ee(function(){return x.jsxs(le,{children:[x.jsx("ambientLight",{intensity:.4}),x.jsx("axesHelper",{args:[10]}),x.jsx(pe,{}),x.jsxs(q.Suspense,{fallback:null,children:[x.jsx(we,{}),x.jsx(me,{background:!0,blur:.4,backgroundIntensity:.1,path:ne("/img/skybox/sky_98_cubemap_2k")})]})]})});export{Ee as default};
