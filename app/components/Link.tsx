import { NavLink } from "react-router";

export default function main({to, children}: {to: string, children: any}){
  return (
    <>
      <NavLink
      className="inline-block px-4 py-2 mr-4 mb-2 rounded-md bg-amber-50 text-amber-950
        hover:bg-amber-950 hover:text-amber-50
        transition-all
        delay-150
        ease-in-out
      "
      to={to}>{children}</NavLink>
    </>
  )
}