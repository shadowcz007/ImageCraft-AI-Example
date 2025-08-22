import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4ef] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0c1c17]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em]">
          ImageCraft AI
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
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
        <Button className="min-w-[84px] max-w-[480px] h-10 px-4 bg-[#019863] text-[#f8fcfa] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#017a4f]">
          New Design
        </Button>
        <Avatar className="size-10">
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
