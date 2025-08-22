import { Button } from '@/components/ui/button'

export default function ImageInput() {
  return (
    <>
      <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Image Input
      </h2>
      <div className="flex flex-col p-4">
        <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#cde9df] px-6 py-14">
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
              Upload Image
            </p>
            <p className="text-[#0c1c17] text-sm font-normal leading-normal max-w-[480px] text-center">
              Drag and drop or browse to upload an image
            </p>
          </div>
          <Button 
            variant="outline"
            className="min-w-[84px] max-w-[480px] h-10 px-4 bg-[#e6f4ef] text-[#0c1c17] text-sm font-bold leading-normal tracking-[0.015em] border-[#cde9df] hover:bg-[#d1e8e0]"
          >
            Browse
          </Button>
        </div>
      </div>
    </>
  )
}
