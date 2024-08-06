import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'

const Header = () => {
    return (
        <>
            <nav
                className='flex justify-between items-center pt-4 px-4 z-10 border-b border-gray-300 dark:border-gray-700'
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background color
                    backdropFilter: 'blur(5px)', // Frosted glass effect
                    WebkitBackdropFilter: 'blur(10px)', // For Safari
                     // Rounded corners for glass effect
                }}
                
            >
                <div>
                    <DropdownMenu className='bg-black'>
                        <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="dp" />
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger >
                        <DropdownMenuContent>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-400'>
                                <LogOut className='mr-2 h-4 w-4' />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </>
    )
}

export default Header
