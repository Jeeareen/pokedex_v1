import { useNavigate } from 'react-router-dom'
import { getTypeIcon } from '../../utils/typeIcons'
import { POKEMON_TYPE_COLORS } from '../../utils/constants'

interface TypeCardProps {
  name: string
}

export function TypeCard({ name }: TypeCardProps) {
  const navigate = useNavigate()
  const iconUrl = getTypeIcon(name)
  const colorData = POKEMON_TYPE_COLORS[name.toLowerCase()] || {
    bg: 'bg-slate-500',
    gradient: 'from-slate-500 to-slate-700',
    hex: '#64748B',
  }

  const handleClick = () => {
    navigate(`/category/type/${name.toLowerCase()}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorData.gradient} p-4 text-white shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-between group border border-white/10 h-[64px] box-border`}
    >
      <span className="text-lg font-bold capitalize tracking-wide drop-shadow-sm">
        {name}
      </span>
      {iconUrl && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <img src={iconUrl} alt={`${name} type icon`} className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
      )}
    </div>
  )
}
