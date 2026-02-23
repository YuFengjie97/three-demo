import { NavLink } from 'react-router'
import { asset } from '~/utils/asset'

export default function main({ to, img }: { to: string; img: string }) {
  const imgUrl = asset(`${img}`)

  return (
    <div className='inline-block w-2xs h-2xs'>
      <NavLink
        className='inline-block h-full overflow-hidden mr-4 mb-2 rounded-md'
        to={to}
      >
        <img className='block w-full object-cover object-center' src={imgUrl} />
      </NavLink>
    </div>
  )
}
