import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('/three/csm', 'routes/three/CSM/index.tsx'),
  route('/three/sea', 'routes/three/sea/index.tsx'),
  route('/three/points', 'routes/three/points/index.tsx'),
  route('/three/planet', 'routes/three/planet/index.tsx'),
  route('/three/real-earth', 'routes/three/realEarth/index.tsx'),
  route('/three/trail', 'routes/three/trail/index.tsx'),
  route('/three/cloth-pattern', 'routes/three/clothPattern/index.tsx'),
  route('/three/china-3d', 'routes/three/china3D/index.tsx'),
  route('/three/flow-point-line', 'routes/three/flowPointLine/index.tsx'),
  route('/three/hexagon-vertex-offset', 'routes/three/hexagonVS/index.tsx'),
  route('/three/boxframes', 'routes/three/boxFrame/index.tsx'),
  route('/three/swords', 'routes/three/swords/index.tsx'),
  route('/three/fulu', 'routes/three/fulu/index.tsx'),
  route('/three/zuowangdao', 'routes/three/zuoWangDao/index.tsx'),

  route('/three/line', 'routes/three/line/index.tsx'),
  route('/three/line2', 'routes/three/line2/index.tsx'),
  route('/three/particle1', 'routes/three/particle1/index.tsx'),
  route('/three/particle2', 'routes/three/particle2/index.tsx'),
  route('/three/particle3', 'routes/three/particle3/index.tsx'),


  route('/three/tree', 'routes/three/tree/index.tsx'),
  route('/three/growTree', 'routes/three/growTree/index.tsx'),


  route('/three/model-vertex-col', 'routes/three/modelVertexCol/index.tsx'),


  route('/three/mv1', 'routes/three/mv1/index.tsx'),


  route('/three/some-test', 'routes/three/someTest/index.tsx'),
  route('/reactTest', 'routes/reactTest.tsx')
] satisfies RouteConfig;
