
import { LayoutGridDemo } from "@/components/layouts/ProductsHome";
import { BentoGridDemo } from "@/components/layouts/ProductsSection";
import { SparklesLogo } from "@/components/layouts/SparkleLogo";

export default function Home() {
  return (
    <div>

      <SparklesLogo />

      <LayoutGridDemo />

      <BentoGridDemo />
    </div>
  );
}
