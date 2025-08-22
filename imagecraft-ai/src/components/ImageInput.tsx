'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ImageInputProps {
  onImageUpload?: (imageFile: File, imageBase64: string) => void
  onRemoveImage?: () => void
  imageName?: string
  uploadedImageUrl?: string
}

export default function ImageInput({ onImageUpload, onRemoveImage, imageName: propImageName, uploadedImageUrl }: ImageInputProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(uploadedImageUrl || null)
  const [imageName, setImageName] = useState<string>(propImageName || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    // 检查文件大小 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件大小不能超过10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setImageName(file.name)
      onImageUpload?.(file, result.split(',')[1]) // 移除data:image/...;base64,前缀
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImageName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemoveImage?.()
  }

  return (
    <>
      <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
        Image Input
      </h2>
      <div className="flex flex-col p-2 sm:p-4">
        {!uploadedImage ? (
          <div 
            className={`flex flex-col items-center gap-4 sm:gap-6 rounded-lg border-2 border-dashed px-4 sm:px-6 py-8 sm:py-14 transition-colors ${
              dragActive 
                ? 'border-[#019863] bg-[#e6f4ef]' 
                : 'border-[#cde9df] hover:border-[#019863]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-[#0c1c17] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                {dragActive ? '释放文件以上传' : 'Upload Image'}
              </p>
              <p className="text-[#0c1c17] text-xs sm:text-sm font-normal leading-normal max-w-[480px] text-center">
                {dragActive ? '拖拽图片到此处' : 'Drag and drop or browse to upload an image'}
              </p>
            </div>
            <Button 
              variant="outline"
              className="min-w-[60px] sm:min-w-[84px] max-w-[480px] h-8 sm:h-10 px-2 sm:px-4 bg-[#e6f4ef] text-[#0c1c17] text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] border-[#cde9df] hover:bg-[#d1e8e0]"
              onClick={handleFileSelect}
            >
              Browse
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-[#cde9df] p-4">
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="max-w-full max-h-64 rounded-lg object-contain"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[#0c1c17] text-sm font-medium">{imageName}</p>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                移除图片
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
