import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4ef] px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex items-center gap-2 sm:gap-4 text-[#0c1c17]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#0c1c17] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
          ImageCraft AI
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-2 sm:gap-4 lg:gap-8">
        {/* 桌面端导航菜单 */}
        <div className="hidden md:flex items-center gap-6 lg:gap-9">
          <a className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#019863] transition-colors" href="#">
            Home
          </a>
          <a className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#019863] transition-colors" href="#">
            Templates
          </a>
          <a className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#019863] transition-colors" href="#">
            Features
          </a>
          <a className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#019863] transition-colors" href="#">
            Pricing
          </a>
        </div>
        {/* 移动端菜单按钮 */}
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden p-2 text-[#0c1c17] hover:bg-[#e6f4ef]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
          </svg>
        </Button>
        <Button className="min-w-[60px] sm:min-w-[84px] max-w-[480px] h-8 sm:h-10 px-2 sm:px-4 bg-[#019863] text-[#f8fcfa] text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#017a4f]">
          <span className="hidden sm:inline">New Design</span>
          <span className="sm:hidden">New</span>
        </Button>
        <Avatar className="size-8 sm:size-10">
          <AvatarImage 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9oS0wjZ-vcfIGJJafjZ0gmhGj0-txOq98iMHlUoIxXribMzq57bu0pXovzKpjb5Aj_4lJfLxnWQgCSpNKQywK9-ATMbhN3A2nH7FZXypSJD7YK5ZqG00-TbwlEyyDv7kyx5fLTi0c0iweC4bv-WCTtf6k29JfZt5my5mqfYE4zqhXh4p_DoGYQxkuAuCetKOn0Dq2geGwdgRP4MllvmK3yhsPnjfWTaMMMx-BEIBFJkgqx0_N3NmXY9iJJTpBo6Ni6DRAEcDnLBeN"
            alt="User avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
