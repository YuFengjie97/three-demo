import { useEffect, useMemo, useState } from 'react'
import { Leva, useControls } from 'leva'
import * as THREE from 'three'

function Foo(){
  const [count,setCount] = useState(1)
  console.log('child');
  useEffect(() => {
    console.log('child useEffect');
  },[])
  
  return (
    <>
      <div>child</div>
    </>
  )
}

export function Counter() {
  const [number, setNumber] = useState(0);
  console.log('Counter');
  

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}

export default function main() {
  const [count, setCount] = useState(0)
  console.log('main');
  useEffect(() => {
    console.log('main useEffect');
  }, [count])
  useMemo(() => {
    console.log('main useMemo');
  }, [count])
  
  return(
    <>
      {/* {count} */}
      {/* <button onClick={() => {setCount(count + 1)}}>main add count</button> */}
      {/* <Foo /> */}
      <Counter/>
    </>
  )
}
