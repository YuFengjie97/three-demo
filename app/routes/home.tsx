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

      <h1 className="text-7xl mb-10">THREE.js</h1>
      <Link to='/three/csm'>custom shader material</Link>
      <Link to='/three/sea'>海洋</Link>
      <Link to='/three/points'>点云</Link>
    </div>
    </>
  )
}
