import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PromptInteractionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onSend: () => void
}

export default function PromptInteraction({ prompt, setPrompt, onSend }: PromptInteractionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <>
      <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
        Prompt Interaction
      </h2>
      <div className="flex items-end gap-2 sm:gap-3 p-2 sm:p-4">
        <Avatar className="w-8 sm:w-10 shrink-0">
          <AvatarImage 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfs-givPrfvb_RkQW1h8F00s2DrzCL_YugssDijIprTC8VyZIRoRdtLQs48lJCJHI081bhK0SZUAa6OpYwAbxXo1GlMITMqn_HFqzz485xssZStpHzFLXqu7dbNmZp4W8xw208fiUCv97ZBO9bW6Ny5kCYJfeBjcXtfqnBtd_ni1vXKmd7kmmwUXXkkjITs9zuITYI8oGQO7KEBScKF5lFaZ3PQ7L5SZI3FkyQpI7sMHLxVAqScSifjs66dL88vSDFit7EaVQnBEXn"
            alt="AI Assistant"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1 items-start">
          <p className="text-[#46a080] text-xs sm:text-[13px] font-normal leading-normal max-w-[360px]">
            AI Assistant
          </p>
          <p className="text-sm sm:text-base font-normal leading-normal flex max-w-[360px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-[#e6f4ef] text-[#0c1c17]">
            Hi there! How can I help you refine your image prompt today?
          </p>
        </div>
      </div>
      <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3">
        <div className="flex flex-col min-w-32 sm:min-w-40 h-10 sm:h-12 flex-1">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <Input
              placeholder="Type your prompt or refine existing prompt..."
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0c1c17] focus:outline-0 focus:ring-0 border-none bg-[#e6f4ef] focus:border-none h-full placeholder:text-[#46a080] px-3 sm:px-4 rounded-r-none border-r-0 pr-2 text-sm sm:text-base font-normal leading-normal"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex border-none bg-[#e6f4ef] items-center justify-center pr-2 sm:pr-4 rounded-r-lg border-l-0">
              <div className="flex items-center gap-2 sm:gap-4 justify-end">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center justify-center p-1 sm:p-1.5 text-[#46a080] hover:bg-[#d1e8e0]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
                    </svg>
                  </Button>
                </div>
                <Button
                  className="min-w-[50px] sm:min-w-[84px] max-w-[480px] h-7 sm:h-8 px-2 sm:px-4 bg-[#019863] text-[#f8fcfa] text-xs sm:text-sm font-medium leading-normal block hover:bg-[#017a4f]"
                  onClick={onSend}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
