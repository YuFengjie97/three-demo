import { NavLink } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  console.log(import.meta.env);
  
  return (
    <>
    <div className="py-20 px-10">
      <h1 className="text-7xl">THREE.js</h1>
      <NavLink to="/three/csm">CSM</NavLink>
    </div>
    </>
  )
}
