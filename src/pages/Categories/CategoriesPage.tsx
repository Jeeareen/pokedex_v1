import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegionGrid } from '../../components/categories/RegionGrid'
import { TypeGrid } from '../../components/categories/TypeGrid'
import { ShapeCard } from '../../components/categories/ShapeCard'
import { HabitatBadge } from '../../components/categories/HabitatBadge'
import { ColorSwatch } from '../../components/categories/ColorSwatch'
import { POKEMON_COLOR_HEX, REGIONS_DATA } from '../../utils/constants'
import type { NamedAPIResource, PokemonTypeData } from '../../types/pokemon'

export function CategoriesPage() {
    const navigate = useNavigate()
    const [types, setTypes] = useState<PokemonTypeData[]>([])
    const [shapes, setShapes] = useState<NamedAPIResource[]>([])
    const [habitats, setHabitats] = useState<NamedAPIResource[]>([])
    const [colors, setColors] = useState<NamedAPIResource[]>([])
    const [loadingTypes, setLoadingTypes] = useState(true)
    const [loadingShapes, setLoadingShapes] = useState(true)
    const [loadingHabitats, setLoadingHabitats] = useState(true)
    const [loadingColors, setLoadingColors] = useState(true)

    useEffect(() => {
        // Fetch Types
        fetch('https://pokeapi.co/api/v2/type')
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.results.filter(
                    (t: NamedAPIResource) => t.name !== 'unknown' && t.name !== 'shadow'
                )
                setTypes(filtered)
            })
            .catch((err) => console.error('Failed to fetch types:', err))
            .finally(() => setLoadingTypes(false))

        // Fetch Shapes
        fetch('https://pokeapi.co/api/v2/pokemon-shape')
            .then((res) => res.json())
            .then((data) => {
                setShapes(data.results || [])
            })
            .catch((err) => console.error('Failed to fetch shapes:', err))
            .finally(() => setLoadingShapes(false))

        // Fetch Habitats
        fetch('https://pokeapi.co/api/v2/pokemon-habitat')
            .then((res) => res.json())
            .then((data) => {
                setHabitats(data.results || [])
            })
            .catch((err) => console.error('Failed to fetch habitats:', err))
            .finally(() => setLoadingHabitats(false))

        // Fetch Colors
        fetch('https://pokeapi.co/api/v2/pokemon-color')
            .then((res) => res.json())
            .then((data) => {
                setColors(data.results || [])
            })
            .catch((err) => console.error('Failed to fetch colors:', err))
            .finally(() => setLoadingColors(false))
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Regions Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-black">
                        Regions
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                        {REGIONS_DATA.length}
                    </span>
                </div>
                <RegionGrid />
            </section>

            {/* Types Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-black">
                        Types
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        {types.length}
                    </span>
                </div>
                {loadingTypes ? (
                    <div className="text-slate-500 py-4 animate-pulse">Loading types...</div>
                ) : (
                    <TypeGrid types={types} />
                )}
            </section>

            {/* Bottom Section: Colors (Left), stacked Habitats & Shapes (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                {/* Colors Section (Left - 2 columns x 5 rows) */}
                <section className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-black">
                            Colors
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            {colors.length}
                        </span>
                    </div>
                    {loadingColors ? (
                        <div className="text-slate-500 py-4 animate-pulse">Loading colors...</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {colors.map((color) => {
                                const hex = POKEMON_COLOR_HEX[color.name.toLowerCase()] || '#94A3B8'
                                return (
                                    <ColorSwatch
                                        key={color.name}
                                        name={color.name}
                                        hex={hex}
                                        onClick={() => navigate(`/category/color/${color.name}`)}
                                    />
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* Right Stacked Column: Habitats on top, Shapes below */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                    {/* Habitats Section (Top, 5 columns x 2 rows) */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-black">
                                Habitats
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                {habitats.length}
                            </span>
                        </div>
                        {loadingHabitats ? (
                            <div className="text-slate-500 py-4 animate-pulse">Loading habitats...</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
                                {habitats.map((habitat) => (
                                    <HabitatBadge
                                        key={habitat.name}
                                        name={habitat.name}
                                        onClick={() => navigate(`/category/habitat/${habitat.name}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Shapes Section (Below Habitats, 7 columns x 2 rows) */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-black">
                                Shapes
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                {shapes.length}
                            </span>
                        </div>
                        {loadingShapes ? (
                            <div className="text-slate-500 py-4 animate-pulse">Loading shapes...</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
                                {shapes.map((shape) => (
                                    <ShapeCard
                                        key={shape.name}
                                        name={shape.name}
                                        onClick={() => navigate(`/category/shape/${shape.name}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CategoriesPage
