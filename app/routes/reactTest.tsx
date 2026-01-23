import { useEffect, useMemo, useRef, useState } from 'react'
import { Leva, useControls } from 'leva'


function Hello({val}: {val: number}){
  console.log('child 冲渲染');
  

  useEffect(() => {
    console.log('useEffect child prop val change');
    
  }, [val])

  return <h1>child prop {val}</h1>
}

function useTest(url: string){
  useEffect(() => {
    console.log(11111, url);
  }, [])
}


export default function main(){
  console.log('重新渲染');

  useTest('hello1')
  useTest('hello2')
  useTest('hello3')
  useTest('hello4')
  useTest('hello5')

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('useEffect');
  }, [count])

  const p = {
    name: 111
  }
  useEffect(() => {
    console.log('p name update');
    p.name = 222
  }, [])

  function getP(){
    console.log(p);
  }
  
  return (
    <>
    <button  className='p-4 bg-amber-900 text-amber-50' onClick={() => setCount(count + 1)}>addCount {count}</button>
    <button onClick={getP}>dddd</button>
    </>
  )
}