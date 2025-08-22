'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  onComposedUpload: (imageFile: File, imageBase64: string) => void
  cachedComposedDataUrl?: string
  onRemove?: () => void
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

export default function AvatarOutfitComposer({ onComposedUpload, cachedComposedDataUrl, onRemove }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [outfitUrl, setOutfitUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(cachedComposedDataUrl || null)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [avatarPosition, setAvatarPosition] = useState<Position>({ x: 0.5, y: 0.06 })
  const [outfitPosition, setOutfitPosition] = useState<Position>({ x: 0.5, y: 0.4 })
  const [avatarSize, setAvatarSize] = useState<Size>({ width: 0.28, height: 0.28 })
  const [outfitSize, setOutfitSize] = useState<Size>({ width: 0.72, height: 0.72 })
  const [isDragging, setIsDragging] = useState<'avatar' | 'outfit' | null>(null)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const outfitInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

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
    if (kind === 'avatar') setAvatarUrl(url)
    else setOutfitUrl(url)
  }

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
    if (!avatarUrl || !outfitUrl) {
      alert('请先选择头像与服装图片')
      return
    }
    
    const canvas = document.createElement('canvas')
    const size = 1024
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // 背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    const [avatarImg, outfitImg] = await Promise.all([loadImage(avatarUrl), loadImage(outfitUrl)])

    // 使用可调整的位置和尺寸
    const headW = size * avatarSize.width
    const headH = size * avatarSize.height
    const headX = size * avatarPosition.x - headW / 2
    const headY = size * avatarPosition.y

    const outfitW = size * outfitSize.width
    const outfitH = size * outfitSize.height
    const outfitX = size * outfitPosition.x - outfitW / 2
    const outfitY = size * outfitPosition.y

    // 绘制服装
    drawContain(ctx, outfitImg, outfitW, outfitH, outfitX, outfitY)

    // 以图片中心裁剪为正方形再绘制，避免变形
    const s = Math.min(avatarImg.width, avatarImg.height)
    const sx = (avatarImg.width - s) / 2
    const sy = (avatarImg.height - s) / 2

    // 添加头像阴影效果
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

    const url = canvas.toDataURL('image/png')
    setPreviewUrl(url)
  }, [avatarUrl, outfitUrl, avatarPosition, outfitPosition, avatarSize, outfitSize])

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent, type: 'avatar' | 'outfit') => {
    if (!isAdjusting) return
    e.preventDefault()
    setIsDragging(type)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  // 处理拖拽移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    // 限制在画布范围内
    const clampedX = Math.max(0.1, Math.min(0.9, x))
    const clampedY = Math.max(0.05, Math.min(0.9, y))
    
    if (isDragging === 'avatar') {
      setAvatarPosition({ x: clampedX, y: clampedY })
    } else {
      setOutfitPosition({ x: clampedX, y: clampedY })
    }
  }, [isDragging])

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // 添加和移除全局鼠标事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 当位置或尺寸改变时重新合成
  useEffect(() => {
    if (avatarUrl && outfitUrl) {
      compose()
    }
  }, [avatarPosition, outfitPosition, avatarSize, outfitSize, compose])

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, { type: 'image/png' })
  }

  const confirmUseAsInput = async () => {
    if (!previewUrl) {
      alert('请先点击"合成预览"'); return
    }
    const file = await dataUrlToFile(previewUrl, 'composed.png')
    const base64 = previewUrl.split(',')[1] || ''
    onComposedUpload(file, base64)
  }

  const clearAll = () => {
    setAvatarUrl(null)
    setOutfitUrl(null)
    setPreviewUrl(null)
    setIsAdjusting(false)
    setAvatarPosition({ x: 0.5, y: 0.06 })
    setOutfitPosition({ x: 0.5, y: 0.4 })
    setAvatarSize({ width: 0.28, height: 0.28 })
    setOutfitSize({ width: 0.72, height: 0.72 })
    onRemove?.()
  }

  const resetPositions = () => {
    setAvatarPosition({ x: 0.5, y: 0.06 })
    setOutfitPosition({ x: 0.5, y: 0.4 })
    setAvatarSize({ width: 0.28, height: 0.28 })
    setOutfitSize({ width: 0.72, height: 0.72 })
  }

  return (
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
              <button key={src} className={`border rounded-md p-1 hover:border-[#019863] ${avatarUrl === src ? 'border-[#019863]' : 'border-[#cde9df]'}`} onClick={() => setAvatarUrl(src)}>
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
              <button key={src} className={`border rounded-md p-1 hover:border-[#019863] ${outfitUrl === src ? 'border-[#019863]' : 'border-[#cde9df]'}`} onClick={() => setOutfitUrl(src)}>
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

        {/* 合成与预览 */}
        <div className="rounded-lg border-2 border-[#cde9df] p-3">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="h-9 px-4" onClick={compose}>合成预览</Button>
            <Button 
              className={`h-9 px-4 ${isAdjusting ? 'bg-blue-600' : 'bg-[#019863]'} text-white`} 
              onClick={() => setIsAdjusting(!isAdjusting)}
            >
              {isAdjusting ? '完成调整' : '调整位置'}
            </Button>
            <Button variant="outline" className="h-9 px-4" onClick={resetPositions}>重置位置</Button>
            <Button className="h-9 px-4 bg-[#019863] text-white" onClick={confirmUseAsInput} disabled={!previewUrl}>设为输入</Button>
            <Button variant="outline" className="h-9 px-4 text-red-600 border-red-300 hover:bg-red-50" onClick={clearAll}>清除选择</Button>
          </div>
          
          {previewUrl && (
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
      </div>
    </>
  )
}
