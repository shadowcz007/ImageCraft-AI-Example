'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  onComposedUpload: (imageFile: File, imageBase64: string) => void
  cachedComposedDataUrl?: string
  onRemove?: () => void
  showPreview?: boolean
  showImageSelection?: boolean
}

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const PRESET_AVATARS = [
  '/presets/avatars/578.png',
  '/presets/avatars/008.png',
  '/presets/avatars/384.png',
]

const PRESET_OUTFITS = [
  '/presets/outfits/120.png',
  '/presets/outfits/323.png',
  '/presets/outfits/333.png',
]

// 位置状态持久化键
const POSITION_STORAGE_KEY = 'avatar_outfit_position_state'
const IMAGE_URL_STORAGE_KEY = 'avatar_outfit_image_urls'

export default function AvatarOutfitComposer({ onComposedUpload, cachedComposedDataUrl, onRemove, showPreview = false, showImageSelection = true }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [outfitUrl, setOutfitUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(cachedComposedDataUrl || null)
  const [isAdjusting, setIsAdjusting] = useState(false)
  
  // 使用 useRef 来保持位置状态，避免重新渲染时被重置
  const positionStateRef = useRef({
    avatarPosition: { x: 0.5, y: 0.06 },
    outfitPosition: { x: 0.5, y: 0.4 },
    avatarSize: { width: 0.28, height: 0.28 },
    outfitSize: { width: 0.72, height: 0.72 }
  })
  
  // 状态同步，用于触发重新渲染
  const [avatarPosition, setAvatarPosition] = useState<Position>(positionStateRef.current.avatarPosition)
  const [outfitPosition, setOutfitPosition] = useState<Position>(positionStateRef.current.outfitPosition)
  const [avatarSize, setAvatarSize] = useState<Size>(positionStateRef.current.avatarSize)
  const [outfitSize, setOutfitSize] = useState<Size>(positionStateRef.current.outfitSize)
  
  const [isDragging, setIsDragging] = useState<'avatar' | 'outfit' | null>(null)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const outfitInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 保存图片URL到localStorage
  const saveImageUrls = useCallback(() => {
    console.log(`💾 保存图片URL到 localStorage:`, { avatarUrl: !!avatarUrl, outfitUrl: !!outfitUrl })
    try {
      const imageUrls = {
        avatarUrl,
        outfitUrl,
        timestamp: Date.now()
      }
      localStorage.setItem(IMAGE_URL_STORAGE_KEY, JSON.stringify(imageUrls))
      console.log(`✅ 图片URL保存成功`)
    } catch (error) {
      console.warn('❌ 保存图片URL失败:', error)
    }
  }, [avatarUrl, outfitUrl])

  // 加载图片URL从localStorage
  const loadImageUrls = useCallback(() => {
    console.log(`📂 从 localStorage 加载图片URL`)
    try {
      const savedUrls = localStorage.getItem(IMAGE_URL_STORAGE_KEY)
      if (savedUrls) {
        const parsedUrls = JSON.parse(savedUrls)
        console.log(`📊 解析的图片URL:`, { 
          avatarUrl: !!parsedUrls.avatarUrl, 
          outfitUrl: !!parsedUrls.outfitUrl,
          timestamp: parsedUrls.timestamp 
        })
        
        // 检查URL是否仍然有效（不超过24小时）
        const isExpired = Date.now() - parsedUrls.timestamp > 24 * 60 * 60 * 1000
        if (!isExpired) {
          setAvatarUrl(parsedUrls.avatarUrl)
          setOutfitUrl(parsedUrls.outfitUrl)
          console.log(`✅ 图片URL加载成功`)
        } else {
          console.log(`⏰ 图片URL已过期，清除缓存`)
          localStorage.removeItem(IMAGE_URL_STORAGE_KEY)
        }
      }
    } catch (error) {
      console.warn('❌ 加载图片URL失败:', error)
    }
  }, [])

  // 加载保存的位置状态
  useEffect(() => {
    console.log(`🚀 组件初始化，开始加载状态`)
    try {
      // 加载位置状态
      const savedState = localStorage.getItem(POSITION_STORAGE_KEY)
      console.log(`📂 从 localStorage 读取的位置状态:`, savedState)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        console.log(`📊 解析后的位置状态:`, parsedState)
        positionStateRef.current = {
          avatarPosition: parsedState.avatarPosition || { x: 0.5, y: 0.06 },
          outfitPosition: parsedState.outfitPosition || { x: 0.5, y: 0.4 },
          avatarSize: parsedState.avatarSize || { width: 0.28, height: 0.28 },
          outfitSize: parsedState.outfitSize || { width: 0.72, height: 0.72 }
        }
        // 同步到状态
        setAvatarPosition(positionStateRef.current.avatarPosition)
        setOutfitPosition(positionStateRef.current.outfitPosition)
        setAvatarSize(positionStateRef.current.avatarSize)
        setOutfitSize(positionStateRef.current.outfitSize)
        console.log(`✅ 位置状态加载完成:`, positionStateRef.current)
      } else {
        console.log(`ℹ️ 没有找到保存的位置状态，使用默认值`)
      }
      
      // 加载图片URL
      loadImageUrls()
    } catch (error) {
      console.warn('❌ 加载状态失败:', error)
    }
  }, [loadImageUrls])

  // 保存位置状态到 localStorage
  const savePositionState = useCallback(() => {
    console.log(`💾 保存位置状态到 localStorage:`, positionStateRef.current)
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positionStateRef.current))
      console.log(`✅ 位置状态保存成功`)
    } catch (error) {
      console.warn('❌ 保存位置状态失败:', error)
    }
  }, [])

  const pickLocal = (ref: React.RefObject<HTMLInputElement | null>) => ref.current?.click()

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleLocalSelect = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'avatar' | 'outfit') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件'); return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件大小不能超过10MB'); return
    }
    const url = await fileToDataUrl(file)
    console.log(`📁 选择了${kind}图片:`, file.name)
    if (kind === 'avatar') {
      setAvatarUrl(url)
    } else {
      setOutfitUrl(url)
    }
  }

  // 监听图片URL变化，自动保存到localStorage
  useEffect(() => {
    if (avatarUrl || outfitUrl) {
      console.log(`🔄 图片URL变化，保存到localStorage`)
      saveImageUrls()
    }
  }, [avatarUrl, outfitUrl, saveImageUrls])

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  const drawContain = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, boxW: number, boxH: number, dx: number, dy: number) => {
    const scale = Math.min(boxW / img.width, boxH / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = dx + (boxW - w) / 2
    const y = dy + (boxH - h) / 2
    ctx.drawImage(img, x, y, w, h)
    return { x, y, w, h }
  }

  const compose = useCallback(async () => {
    console.log(`🎨 compose 函数开始执行`)
    console.log(`📊 当前状态:`, {
      avatarUrl: !!avatarUrl,
      outfitUrl: !!outfitUrl,
      positionState: positionStateRef.current
    })
    
    if (!avatarUrl || !outfitUrl) {
      console.log(`❌ compose 失败: 缺少图片`, { avatarUrl: !!avatarUrl, outfitUrl: !!outfitUrl })
      alert('请先选择头像与服装图片')
      return
    }
    
    console.log(`🖼️ 开始创建 canvas...`)
    const canvas = document.createElement('canvas')
    const size = 1024
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // 背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    console.log(`📥 加载图片...`)
    const [avatarImg, outfitImg] = await Promise.all([loadImage(avatarUrl), loadImage(outfitUrl)])
    console.log(`✅ 图片加载完成:`, { avatarImg: !!avatarImg, outfitImg: !!outfitImg })

    // 使用当前的位置状态
    const currentState = positionStateRef.current
    console.log(`📍 使用位置状态:`, currentState)
    
    const headW = size * currentState.avatarSize.width
    const headH = size * currentState.avatarSize.height
    const headX = size * currentState.avatarPosition.x - headW / 2
    const headY = size * currentState.avatarPosition.y

    const outfitW = size * currentState.outfitSize.width
    const outfitH = size * currentState.outfitSize.height
    const outfitX = size * currentState.outfitPosition.x - outfitW / 2
    const outfitY = size * currentState.outfitPosition.y

    console.log(`🎯 计算的位置:`, {
      head: { x: headX, y: headY, w: headW, h: headH },
      outfit: { x: outfitX, y: outfitY, w: outfitW, h: outfitH }
    })

    // 绘制服装
    console.log(`👕 绘制服装...`)
    drawContain(ctx, outfitImg, outfitW, outfitH, outfitX, outfitY)

    // 以图片中心裁剪为正方形再绘制，避免变形
    const s = Math.min(avatarImg.width, avatarImg.height)
    const sx = (avatarImg.width - s) / 2
    const sy = (avatarImg.height - s) / 2

    // 添加头像阴影效果
    console.log(`👤 绘制头像...`)
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.08)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 2
    // 圆形裁剪
    ctx.beginPath()
    ctx.arc(headX + headW / 2, headY + headH / 2, headW / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatarImg, sx, sy, s, s, headX, headY, headW, headH)
    ctx.restore()

    console.log(`💾 生成预览URL...`)
    const url = canvas.toDataURL('image/png')
    console.log(`✅ 预览URL生成完成，长度:`, url.length)
    setPreviewUrl(url)
    console.log(`🎨 compose 函数执行完成`)
  }, [avatarUrl, outfitUrl])

  // 更新位置状态的统一函数
  const updatePositionState = useCallback((type: 'avatar' | 'outfit', newPosition: Position) => {
    console.log(`🔄 updatePositionState 被调用:`, { type, newPosition })
    console.log(`📊 更新前状态:`, {
      avatarPosition: positionStateRef.current.avatarPosition,
      outfitPosition: positionStateRef.current.outfitPosition
    })
    
    if (type === 'avatar') {
      positionStateRef.current.avatarPosition = newPosition
      setAvatarPosition(newPosition)
      console.log(`✅ 头像位置已更新:`, newPosition)
    } else {
      positionStateRef.current.outfitPosition = newPosition
      setOutfitPosition(newPosition)
      console.log(`✅ 服装位置已更新:`, newPosition)
    }
    
    console.log(`📊 更新后状态:`, {
      avatarPosition: positionStateRef.current.avatarPosition,
      outfitPosition: positionStateRef.current.outfitPosition
    })
    
    savePositionState()
    console.log(`💾 位置状态已保存到 localStorage`)
    
    // 立即触发重新合成
    if (avatarUrl && outfitUrl) {
      console.log(`🎨 准备调用 compose 函数...`)
      compose()
    } else {
      console.log(`⚠️ 无法调用 compose: avatarUrl=${!!avatarUrl}, outfitUrl=${!!outfitUrl}`)
    }
  }, [savePositionState, avatarUrl, outfitUrl, compose])

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent, type: 'avatar' | 'outfit') => {
    console.log(`🖱️ handleMouseDown 被调用:`, { type, isAdjusting })
    if (!isAdjusting) {
      console.log(`❌ 不在调整模式，忽略拖拽`)
      return
    }
    e.preventDefault()
    setIsDragging(type)
    console.log(`✅ 开始拖拽:`, type)
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const dragStartPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      setDragStart(dragStartPos)
      console.log(`📍 拖拽起始位置:`, dragStartPos)
    } else {
      console.log(`❌ 无法获取 canvas 位置信息`)
    }
  }

  // 处理拖拽移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) {
      console.log(`🖱️ handleMouseMove: 未在拖拽状态`)
      return
    }
    
    if (!canvasRef.current) {
      console.log(`❌ handleMouseMove: canvasRef 为空`)
      return
    }
    
    console.log(`🖱️ handleMouseMove 被调用:`, { isDragging, clientX: e.clientX, clientY: e.clientY })
    
    const rect = canvasRef.current.getBoundingClientRect()
    console.log(`📐 Canvas 尺寸:`, { width: rect.width, height: rect.height })
    
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    console.log(`📍 计算的位置:`, { x, y })
    
    // 限制在画布范围内
    const clampedX = Math.max(0.1, Math.min(0.9, x))
    const clampedY = Math.max(0.05, Math.min(0.9, y))
    
    console.log(`🔒 限制后的位置:`, { x: clampedX, y: clampedY })
    
    const newPosition = { x: clampedX, y: clampedY }
    console.log(`🔄 调用 updatePositionState:`, { type: isDragging, newPosition })
    updatePositionState(isDragging, newPosition)
  }, [isDragging, updatePositionState])

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    console.log(`🖱️ handleMouseUp 被调用，结束拖拽:`, isDragging)
    setIsDragging(null)
  }, [])

  // 添加和移除全局鼠标事件监听器
  useEffect(() => {
    console.log(`🔧 useEffect: 设置鼠标事件监听器`, { isDragging })
    if (isDragging) {
      console.log(`✅ 添加 mousemove 和 mouseup 事件监听器`)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        console.log(`🗑️ 移除 mousemove 和 mouseup 事件监听器`)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 当位置或尺寸改变时重新合成
  useEffect(() => {
    console.log(`🔄 useEffect: 位置变化监听`, { 
      avatarUrl: !!avatarUrl, 
      outfitUrl: !!outfitUrl,
      avatarPosition,
      outfitPosition,
      avatarSize,
      outfitSize
    })
    if (avatarUrl && outfitUrl) {
      console.log(`🎨 位置变化，触发重新合成`)
      compose()
    } else {
      console.log(`⚠️ 位置变化但缺少图片，跳过重新合成`)
    }
  }, [avatarPosition, outfitPosition, avatarSize, outfitSize, compose])

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, { type: 'image/png' })
  }

  const confirmUseAsInput = async () => {
    console.log(`🔘 confirmUseAsInput 被调用`)
    if (!previewUrl) {
      console.log(`❌ 没有预览图片，无法设为输入`)
      alert('请先点击"合成预览"'); return
    }
    console.log(`✅ 开始转换为文件...`)
    const file = await dataUrlToFile(previewUrl, 'composed.png')
    const base64 = previewUrl.split(',')[1] || ''
    console.log(`📤 调用 onComposedUpload:`, { fileName: file.name, base64Length: base64.length })
    onComposedUpload(file, base64)
  }

  const clearAll = () => {
    console.log(`🗑️ clearAll 被调用`)
    setAvatarUrl(null)
    setOutfitUrl(null)
    setPreviewUrl(null)
    setIsAdjusting(false)
    
    // 清除localStorage中的图片URL
    try {
      localStorage.removeItem(IMAGE_URL_STORAGE_KEY)
      console.log(`🗑️ 已清除localStorage中的图片URL`)
    } catch (error) {
      console.warn('❌ 清除图片URL失败:', error)
    }
    
    // 重置位置状态
    const defaultState = {
      avatarPosition: { x: 0.5, y: 0.06 },
      outfitPosition: { x: 0.5, y: 0.4 },
      avatarSize: { width: 0.28, height: 0.28 },
      outfitSize: { width: 0.72, height: 0.72 }
    }
    positionStateRef.current = defaultState
    setAvatarPosition(defaultState.avatarPosition)
    setOutfitPosition(defaultState.outfitPosition)
    setAvatarSize(defaultState.avatarSize)
    setOutfitSize(defaultState.outfitSize)
    savePositionState()
    console.log(`✅ 所有状态已重置`)
    onRemove?.()
  }

  const resetPositions = () => {
    console.log(`🔄 resetPositions 被调用`)
    const defaultState = {
      avatarPosition: { x: 0.5, y: 0.06 },
      outfitPosition: { x: 0.5, y: 0.4 },
      avatarSize: { width: 0.28, height: 0.28 },
      outfitSize: { width: 0.72, height: 0.72 }
    }
    positionStateRef.current = defaultState
    setAvatarPosition(defaultState.avatarPosition)
    setOutfitPosition(defaultState.outfitPosition)
    setAvatarSize(defaultState.avatarSize)
    setOutfitSize(defaultState.outfitSize)
    savePositionState()
    console.log(`✅ 位置已重置为默认值`)
  }

  return (
    <>
      {showImageSelection && (
        <>
          <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
            Input Images
          </h2>

          <div className="flex flex-col gap-4 p-2 sm:p-4">
            {/* 头像 */}
            <div className="rounded-lg border-2 border-[#cde9df] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#0c1c17] font-semibold">头像图片</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 px-3" onClick={() => pickLocal(avatarInputRef)}>上传</Button>
                  <input ref={avatarInputRef} className="hidden" type="file" accept="image/*" onChange={(e) => handleLocalSelect(e, 'avatar')} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_AVATARS.map((src) => (
                  <button key={src} className={`border rounded-md p-1 hover:border-[#019863] ${avatarUrl === src ? 'border-[#019863]' : 'border-[#cde9df]'}`} onClick={() => {
                    console.log(`📁 选择了预设头像:`, src)
                    setAvatarUrl(src)
                  }}>
                    <img src={src} alt="avatar preset" className="w-16 h-16 object-cover rounded-md" />
                  </button>
                ))}
                {avatarUrl && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-[#46a080]">已选择</span>
                  </div>
                )}
              </div>
            </div>

            {/* 服装 */}
            <div className="rounded-lg border-2 border-[#cde9df] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#0c1c17] font-semibold">服装图片</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 px-3" onClick={() => pickLocal(outfitInputRef)}>上传</Button>
                  <input ref={outfitInputRef} className="hidden" type="file" accept="image/*" onChange={(e) => handleLocalSelect(e, 'outfit')} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_OUTFITS.map((src) => (
                  <button key={src} className={`border rounded-md p-1 hover:border-[#019863] ${outfitUrl === src ? 'border-[#019863]' : 'border-[#cde9df]'}`} onClick={() => {
                    console.log(`📁 选择了预设服装:`, src)
                    setOutfitUrl(src)
                  }}>
                    <img src={src} alt="outfit preset" className="w-16 h-16 object-cover rounded-md" />
                  </button>
                ))}
                {outfitUrl && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-[#46a080]">已选择</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 合成操作按钮 */}
      <div className="rounded-lg border-2 border-[#cde9df] p-3 mx-2 sm:mx-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="h-9 px-4" onClick={() => {
            console.log(`🔘 合成预览按钮被点击`)
            compose()
          }}>合成预览</Button>
          <Button 
            className={`h-9 px-4 ${isAdjusting ? 'bg-blue-600' : 'bg-[#019863]'} text-white`} 
            onClick={() => {
              console.log(`🔘 调整位置按钮被点击，当前状态:`, { isAdjusting })
              setIsAdjusting(!isAdjusting)
              console.log(`✅ 调整模式已切换为:`, !isAdjusting)
            }}
          >
            {isAdjusting ? '完成调整' : '调整位置'}
          </Button>
          <Button variant="outline" className="h-9 px-4" onClick={() => {
            console.log(`🔘 重置位置按钮被点击`)
            resetPositions()
          }}>重置位置</Button>
          <Button className="h-9 px-4 bg-[#019863] text-white" onClick={() => {
            console.log(`🔘 设为输入按钮被点击`)
            confirmUseAsInput()
          }} disabled={!previewUrl}>设为输入</Button>
          <Button variant="outline" className="h-9 px-4 text-red-600 border-red-300 hover:bg-red-50" onClick={() => {
            console.log(`🔘 清除选择按钮被点击`)
            clearAll()
          }}>清除选择</Button>
        </div>
        
        {showPreview && previewUrl && (
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="relative" ref={canvasRef}>
              <img 
                src={previewUrl} 
                alt="composed preview" 
                className="max-w-full max-h-64 rounded-lg object-contain border border-[#cde9df]"
              />
              {isAdjusting && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* 头像拖拽区域 */}
                  <div 
                    className="absolute w-8 h-8 bg-blue-500 bg-opacity-50 rounded-full border-2 border-blue-600 cursor-move pointer-events-auto flex items-center justify-center"
                    style={{
                      left: `${avatarPosition.x * 100}%`,
                      top: `${avatarPosition.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'avatar')}
                  >
                    <span className="text-white text-xs font-bold">头</span>
                  </div>
                  {/* 服装拖拽区域 */}
                  <div 
                    className="absolute w-8 h-8 bg-green-500 bg-opacity-50 rounded-full border-2 border-green-600 cursor-move pointer-events-auto flex items-center justify-center"
                    style={{
                      left: `${outfitPosition.x * 100}%`,
                      top: `${outfitPosition.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'outfit')}
                  >
                    <span className="text-white text-xs font-bold">衣</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-[#46a080]">
              {isAdjusting 
                ? '拖拽蓝色圆点调整头像位置，绿色圆点调整服装位置' 
                : '已合成（1:1），点"设为输入"作为生成的输入图片'
              }
            </p>
          </div>
        )}
      </div>
    </>
  )
}
