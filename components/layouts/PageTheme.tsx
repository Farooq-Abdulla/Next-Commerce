'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'

const PageTheme = () => {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()
    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        // <Image
        //     src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        //     width={26}
        //     height={26}
        //     sizes="26x26"
        //     alt="Loading Light/Dark Toggle"
        //     priority={false}
        //     title="Loading Light/Dark Toggle"
        // />
        <><Skeleton className="h-10 w-10 rounded-full" /> </>
    )
    if (resolvedTheme === 'dark') {
        return <Sun onClick={() => setTheme('light')} />
    }
    if (resolvedTheme === 'light') {
        return <Moon onClick={() => setTheme('dark')} />
    }
}

export default PageTheme