import { useNavigate } from 'react-router-dom'
import type { RegionData } from '../../types/pokemon'

interface RegionCardProps {
  region: RegionData
}

export function RegionCard({ region }: RegionCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/category/region/${region.name}`)
  }

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${region.starterId}.png`

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${region.gradientClass} p-5 text-white shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group min-h-[130px] flex flex-col justify-between`}
    >
      <div className="z-10">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
          {region.generation}
        </span>
        <h3 className="text-2xl font-extrabold capitalize drop-shadow-md">
          {region.displayName}
        </h3>
      </div>

      <img
        src={imageUrl}
        alt={`${region.displayName} Starter`}
        className="absolute -right-4 -bottom-4 w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-xl z-0 pointer-events-none opacity-90 group-hover:opacity-100"
      />
    </div>
  )
}
