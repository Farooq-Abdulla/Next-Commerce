"use client";
import { LayoutGrid } from "../ui/layout-grid";



export function LayoutGridDemo() {
    return (
        <div className="h-screen py-20 w-full">
            <LayoutGrid cards={cards} />
        </div>
    );
}

const SkeletonOne = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Bamboo Toothbrush Set</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                Take a step towards sustainability with our Bamboo Toothbrush Set. Crafted from biodegradable and renewable bamboo, these toothbrushes are a eco-friendly alternative to plastic. The soft bristles ensure a gentle yet effective clean for your teeth and gums. Each set includes four toothbrushes, perfect for the whole family. Make a positive impact on the environment while maintaining your oral hygiene.
            </p>
        </div>
    );
};

const SkeletonTwo = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Handmade Leather Wallet</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                Elevate your everyday style with our Handmade Leather Wallet. Meticulously crafted by skilled artisans, this wallet exudes luxury and sophistication. Made from genuine leather, it boasts durability and timeless elegance. With ample card slots, compartments, and a convenient coin pocket, it provides organization without sacrificing style. Treat yourself or surprise a loved one with a gift that&apos;s both practical and stylish.
            </p>
        </div>
    );
};
const SkeletonThree = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Organic Cotton Tote Bag</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                Say goodbye to single-use plastic bags and embrace sustainability with our Organic Cotton Tote Bag. Made from 100% organic cotton, this tote bag is not only environmentally friendly but also durable and versatile. Whether you&apos;re heading to the grocery store, farmers market, or simply running errands, this tote bag is the perfect companion. Available in a range of vibrant colors, it adds a pop of color to your daily routine while reducing your ecological footprint.

            </p>
        </div>
    );
};
const SkeletonFour = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Succulent Plant Collection</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                Bring a touch of nature into your home with our Succulent Plant Collection. These easy-to-care-for plants add a pop of greenery to any space and are perfect for both beginners and experienced gardeners. Each collection includes six assorted succulents, each with its own unique shape and color. Whether you&apos;re decorating your office desk, coffee table, or windowsill, these succulents brighten up your living space and purify the air.            </p>
        </div>
    );
};

const cards = [
    {
        id: 1,
        content: <SkeletonOne />,
        className: "md:col-span-2",
        thumbnail: `${process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN}/BamBoo-toothBrushset.jpeg`
    },
    {
        id: 2,
        content: <SkeletonTwo />,
        className: "col-span-1",
        thumbnail: `${process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN}/HandMade-Leather_wallet.jpeg`,
    },
    {
        id: 3,
        content: <SkeletonThree />,
        className: "col-span-1",
        thumbnail: `${process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN}/OrganicCottonBag.jpeg`
    },
    {
        id: 4,
        content: <SkeletonFour />,
        className: "md:col-span-2",
        thumbnail: `${process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN}/sustainablePlantCollection.jpeg`
    },
];
