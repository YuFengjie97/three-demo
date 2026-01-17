import { NavLink } from "react-router";
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
      <Link to='/three/skull-csm'>自定义材质骷髅头</Link>
      <Link to='/three/instanced-mesh'>骷髅头 instancedMesh</Link>
      <Link to='/three/real-earth'>地球</Link>
      <Link to='/three/trail'>尾迹</Link>
      <Link to='/three/cloth-pattern'>自定义衣服图案</Link>
    </div>
    </>
  )
}
