import { useEffect, useState } from 'react'
import { Leva, useControls } from 'leva'
import * as THREE from 'three'

export default function main() {
  let val = 1

  function addVal() {
    console.log('click')

    val += 1
  }

  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(2)

  function addCount() {
    setCount(count + 1)
  }
  function addCount2() {
    setCount2(count2 + 1)
  }

  const { pos, color, show, num, name } = useControls({
    pos: { x: 0, y: 0 },
    color: '#fff',
    show: true,
    num: {
      value: 1,
      min: 0,
      max: 4,
      step: 0.1,
    },
    name: 'ligoudan',
  })

  let a = num
  console.log(pos)

  const { myImage } = useControls({
    myImage: { image: undefined },
  })
  console.log(myImage)

  const { pos3D } = useControls({
    pos3D: {
      value: { x: 0, y: 0, z: 0 },
      lock: true,
    },
  })
  console.log(pos3D)
  const { showAdvanced, advancedValue } = useControls({
    showAdvanced: false,
    advancedValue: {
      value: 0,
      render: (get) => get('showAdvanced'),
    },
  })

  const { color2 } = useControls({
    color2: {
      value: '#f00',
      optional: false,
    },
  })

  useEffect(() => {
    console.log('useEffect')
    setCount(10)

    return () => {
      console.log('page out')
    }
  }, [count2])

  return (
    <>
      <Leva />
      <div onClick={addVal}>addVal</div>
      val: {val}
      <div onClick={addCount}>addCount</div>
      count: {count}
      <div onClick={addCount2}>addCount2</div>
      count2: {count2}
    </>
  )
}
