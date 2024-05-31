'use client'
import * as React from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { CarousalNumber } from "@/lib/RecoilContextProvider"
import { useRecoilState } from "recoil"

export function Quantity() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = useRecoilState(CarousalNumber)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    // React.useEffect(() => {
    //     if (current === 0) {
    //         console.log("current is 0")
    //     }
    // }, [current, setCurrent])
    return (
        <div className=" mx-auto ">
            <Carousel setApi={setApi} className="max-w-14 flex justify-center items-center ">
                <CarouselContent >
                    {Array.from({ length: 9 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <span className=" dark:text-slate-100 text-black text-lg ml-5 flex items-center">{index}</span>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

        </div>
    )
}
