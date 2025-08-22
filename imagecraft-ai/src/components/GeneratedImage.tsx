import { Button } from '@/components/ui/button'

export default function GeneratedImage() {
  return (
    <>
      <div className="flex flex-wrap justify-between gap-2 sm:gap-3 p-2 sm:p-4">
        <p className="text-[#0c1c17] tracking-light text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight min-w-48 sm:min-w-72">
          Generated Image
        </p>
      </div>
      <div className="flex w-full grow bg-[#f8fcfa] p-2 sm:p-4">
        <div className="w-full gap-1 sm:gap-2 overflow-hidden bg-[#f8fcfa] aspect-[3/2] rounded-lg flex">
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuMSU04oMkCfMiv24UXBe3-D_Zg8fEAiTHFBc9OXcG2o96F32AjP207dYP_J88SWtF02QGwp8L5OsTpjYK8QMxdjByTANGNJyMwwgWVml64lHyoYSIMTkpE_39qQohf30pFESKoRBrltcNSMFK7gwVPHijXsv4jOneeoNefo9JmaxeaUZBSrlLlXVj-DDLnWK5nYA-PJX-4FqqHkfu2QSZsUKjyyriDz32NWSwvfxbouwLbzGp7LNL2SSVkaXbTf15D4tB1xUfbI07")`
            }}
          />
        </div>
      </div>
      <div className="p-2 sm:p-4">
        <div className="gap-1 sm:gap-2 px-2 sm:px-4 flex flex-wrap justify-start">
          <div className="flex flex-col items-center gap-1 sm:gap-2 bg-[#f8fcfa] py-2 sm:py-2.5 text-center w-16 sm:w-20">
            <div className="rounded-full bg-[#e6f4ef] p-2 sm:p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L93.66,106.34a8,8,0,0,0-11.32,11.32Z" />
              </svg>
            </div>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-medium leading-normal">Download</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 bg-[#f8fcfa] py-2 sm:py-2.5 text-center w-16 sm:w-20">
            <div className="rounded-full bg-[#e6f4ef] p-2 sm:p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z" />
              </svg>
            </div>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-medium leading-normal">Add Text</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 bg-[#f8fcfa] py-2 sm:py-2.5 text-center w-16 sm:w-20">
            <div className="rounded-full bg-[#e6f4ef] p-2 sm:p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
              </svg>
            </div>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-medium leading-normal">Watermark</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 bg-[#f8fcfa] py-2 sm:py-2.5 text-center w-16 sm:w-20">
            <div className="rounded-full bg-[#e6f4ef] p-2 sm:p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z" />
              </svg>
            </div>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-medium leading-normal">Enhance</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 bg-[#f8fcfa] py-2 sm:py-2.5 text-center w-16 sm:w-20">
            <div className="rounded-full bg-[#e6f4ef] p-2 sm:p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z" />
              </svg>
            </div>
            <p className="text-[#0c1c17] text-xs sm:text-sm font-medium leading-normal">Share</p>
          </div>
        </div>
      </div>
    </>
  )
}
