import { Button } from '@/components/ui/button'

export default function ImageInput() {
  return (
    <>
      <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
        Image Input
      </h2>
      <div className="flex flex-col p-2 sm:p-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6 rounded-lg border-2 border-dashed border-[#cde9df] px-4 sm:px-6 py-8 sm:py-14">
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-[#0c1c17] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
              Upload Image
            </p>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-normal leading-normal max-w-[480px] text-center">
              Drag and drop or browse to upload an image
            </p>
          </div>
          <Button 
            variant="outline"
            className="min-w-[60px] sm:min-w-[84px] max-w-[480px] h-8 sm:h-10 px-2 sm:px-4 bg-[#e6f4ef] text-[#0c1c17] text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] border-[#cde9df] hover:bg-[#d1e8e0]"
          >
            Browse
          </Button>
        </div>
      </div>
    </>
  )
}
