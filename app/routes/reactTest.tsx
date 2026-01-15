import { useEffect, useMemo, useRef, useState } from 'react'
import { Leva, useControls } from 'leva'


export default function main(){
  console.log('main');
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log('main effect');
  },[])

  const {val} = useControls({
    val: 0
  })
  useEffect(()=>{
    console.log('我用val', val);
  }, [val])

  const texRef = useRef(null!)

  const a = useMemo(() => {
    console.log('useMemo');
    return 10000
  }, [])

  console.log(a);
  
  
  return (
    <>
    <button  className='p-4 bg-amber-900 text-amber-50' onClick={() => setCount(count + 1)}>addCount</button>
    <span ref={texRef}>{count}</span>
    </>
  )
}