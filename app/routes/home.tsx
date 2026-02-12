import type { Route } from "./+types/home";
import Link from '~/components/Link'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
    <div className="py-20 px-10">
      <Link to='/reactTest'>test</Link>
      <Link to='/three/some-test'>test</Link>

      <h1 className="text-7xl mb-10">THREE.js</h1>
      <Link to='/three/csm'>custom shader material</Link>
      <Link to='/three/sea'>海洋</Link>
      <Link to='/three/points'>点云与线</Link>
      <Link to='/three/planet'>行星</Link>
      <Link to='/three/real-earth'>地球</Link>
      <Link to='/three/trail'>尾迹</Link>
      <Link to='/three/cloth-pattern'>自定义衣服图案</Link>
      <Link to='/three/china-3d'>中国3D</Link>
      <Link to='/three/flow-point-line'>flow point line</Link>
      <Link to='/three/hexagon-vertex-offset'>蜂巢顶点偏移</Link>
      <Link to='/three/boxframes'>boxFrames</Link>
      <Link to='/three/swords'>飞剑 instances gpu</Link>
      <Link to='/three/fulu'>符箓</Link>
      <Link to='/three/line'>线</Link>
      <Link to='/three/zuowangdao'>坐忘道</Link>
      <Link to='/three/particle1'>particle 1</Link>
      <Link to='/three/particle2'>particle 2</Link>
      <Link to='/three/particle3'>particle 3</Link>

      <Link to='/three/model-vertex-col'>模型顶点色</Link>


      <h1 className="text-5xl my-10">Music Visual</h1>
      <Link to='/three/mv1'>music visual 1</Link>
    </div>
    </>
  )
}
