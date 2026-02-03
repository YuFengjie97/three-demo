import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('/three/csm', 'routes/three/CSM/index.tsx'),
  route('/three/sea', 'routes/three/sea/index.tsx'),
  route('/three/points', 'routes/three/points/index.tsx'),
  route('/three/planet', 'routes/three/planet/index.tsx'),
  route('/three/skull-csm', 'routes/three/skullCSM/index.tsx'),
  route('/three/instanced-mesh', 'routes/three/instancedMesh/index.tsx'),
  route('/three/real-earth', 'routes/three/realEarth/index.tsx'),
  route('/three/trail', 'routes/three/trail/index.tsx'),
  route('/three/cloth-pattern', 'routes/three/clothPattern/index.tsx'),
  route('/three/china-3d', 'routes/three/china3D/index.tsx'),
  route('/three/flow-point-line', 'routes/three/flowPointLine/index.tsx'),
  route('/three/hexagon-vertex-offset', 'routes/three/hexagonVS/index.tsx'),
  route('/three/boxframes', 'routes/three/boxFrame/index.tsx'),
  route('/three/swords', 'routes/three/swords/index.tsx'),
  route('/three/fulu', 'routes/three/fulu/index.tsx'),




  route('/three/mv1', 'routes/three/mv1/index.tsx'),


  route('/three/some-test', 'routes/three/someTest/index.tsx'),
  route('/reactTest', 'routes/reactTest.tsx')
] satisfies RouteConfig;
