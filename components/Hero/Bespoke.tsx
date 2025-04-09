import { FactoryIcon as Fabric, Scissors, PinIcon as PinCushion } from "lucide-react"
import { anotherStylishFont } from "@/app/fonts"

export default function BespokeTailoring() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h2 className={`${anotherStylishFont.className} italic text-amber-700/80 text-3xl md:text-4xl lg:text-5xl font-light tracking-wide`}>
          The Art of Bespoke
        </h2>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-2 tracking-tight">Sartorial Craftsmanship</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
        {/* High-End Construction Materials */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <Fabric className="w-16 h-16 stroke-1" />
          </div>
          <h3 className="font-serif text-xl md:text-2xl mb-4">High-End Construction Materials</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Discover the pinnacle of luxury with our premium fabrics and horse hair linings, meticulously selected for
            durability and elegance.
          </p>
        </div>

        {/* Custom Patterns */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <Scissors className="w-16 h-16 stroke-1" />
          </div>
          <h3 className="font-serif text-xl md:text-2xl mb-4">Custom Patterns</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Embrace your individuality with custom patterns tailored to your unique style and fit, ensuring a
            distinctive and personal expression.
          </p>
        </div>

        {/* Expert Artisanal Techniques */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <PinCushion className="w-16 h-16 stroke-1" />
          </div>
          <h3 className="font-serif text-xl md:text-2xl mb-4">Expert Artisanal Techniques</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Experience the fusion of Neapolitan tradition and contemporary innovation, with each garment handcrafted to
            exemplify unparalleled quality.
          </p>
        </div>
      </div>
    </section>
  )
}
