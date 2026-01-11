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
