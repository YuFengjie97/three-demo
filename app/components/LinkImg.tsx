import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { asset } from '~/utils/asset'

export default function main({ to, img }: { to: string; img: string }) {
  const imgUrl = asset(`${img}`)
  const [isLoading, setIsLoading] = useState(true)

  const imgRef = useRef<HTMLImageElement>(null!)
  useEffect(() => {
    // 如果图片存在，且浏览器报告它已经加载完毕 (.complete 为 true)
    if (imgRef.current && imgRef.current.complete) {
      console.log('图片来自缓存，已直接加载完成')
      setIsLoading(false)
    }
  }, [])

  return (
    <div className='inline-block w-40 h-30 transition-all duration-300
      m-2
      rounded-md overflow-hidden
      hover:shadow-lg hover:shadow-emerald-100
      hover:translate-y-1
    '>
      <NavLink
        className='inline-block relative w-full h-full  mr-4 mb-2'
        to={to}
      >
        {isLoading && (
          <div className='absolute inset-0 bg-white flex items-center justify-center text-gray-500 z-10'>
            {/* 你也可以在这里放一个 SVG Loading 图标 */}
            <span>预览图加载中...</span>
          </div>
        )}
        <img
          className={`
            block w-full h-full object-cover object-center transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
          ref={imgRef}
          src={imgUrl}
          onLoad={() => {
            console.log('previewImg ok')
            setIsLoading(false)
          }}
          onError={(e) => {
            console.log('预览图加载失败Error', e)
            setIsLoading(false)
          }}
        />
      </NavLink>
    </div>
  )
}
