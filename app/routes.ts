import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('/three/csm', 'routes/three/CSM/index.tsx'),
  route('/three/sea', 'routes/three/sea/index.tsx'),
  route('/three/points', 'routes/three/points/index.tsx'),
  route('/reactTest', 'routes/reactTest.tsx')
] satisfies RouteConfig;
