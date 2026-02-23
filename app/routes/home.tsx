import type { Route } from "./+types/home";
import Link from '~/components/Link'
import LinkImg from '~/components/LinkImg'

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
      {/* <Link to=''>custom shader material</Link> */}
      <LinkImg to='/three/csm' img='/img/preview/1.png'/>

      <LinkImg to='/three/sea' img='/img/preview/2.png' />
      <LinkImg to='/three/points' img='/img/preview/3.png' />
      <LinkImg to='/three/planet' img='/img/preview/4.png' />
      <LinkImg to='/three/real-earth' img='/img/preview/5.png'/>
      <LinkImg to='/three/trail'img='/img/preview/6.png'/>
      <LinkImg to='/three/cloth-pattern'img='/img/preview/7.png' />
      <LinkImg to='/three/china-3d'img='/img/preview/8.png' />
      <LinkImg to='/three/flow-point-line'img='/img/preview/9.png'/>
      <LinkImg to='/three/hexagon-vertex-offset'img='/img/preview/10.png'/>
      <LinkImg to='/three/boxframes'img='/img/preview/11.png'/>
      <LinkImg to='/three/swords'img='/img/preview/12.png' />
      <LinkImg to='/three/fulu'img='/img/preview/13.png'/>
      <LinkImg to='/three/line'img='/img/preview/14.png'/>
      <LinkImg to='/three/line2'img='/img/preview/15.png'/>
      <LinkImg to='/three/tube-line'img='/img/preview/16.png'/>
      <LinkImg to='/three/tube-line2'img='/img/preview/17.png'/>
      <LinkImg to='/three/zuowangdao'img='/img/preview/18.png'/>
      <LinkImg to='/three/particle1'img='/img/preview/19.png'/>
      <LinkImg to='/three/particle2'img='/img/preview/20.png'/>
      <LinkImg to='/three/particle4-universe'img='/img/preview/21.png'/>
      {/* <LinkImg to='/three/curve'img='/img/preview/23.png'/> */}
      <LinkImg to='/three/ball'img='/img/preview/22.png'/>
      <LinkImg to='/three/tree'img='/img/preview/23.png'/>
      <LinkImg to='/three/growTree'img='/img/preview/24.png'/>
      <LinkImg to='/three/model-vertex-col'img='/img/preview/25.png'/>
      <h1 className="text-5xl my-10">Music Visual</h1>
      <LinkImg to='/three/mv1'img='/img/preview/26.png'/>
    </div>
    </>
  )
}
