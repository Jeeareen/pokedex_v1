import type { ShapeCardProps } from '../../types/pokemon'
import { SHAPE_CONFIG } from '../../utils/constants'

export function ShapeCard({ name, onClick }: ShapeCardProps) {
  const key = name.toLowerCase().replace('-', '_')
  const config = SHAPE_CONFIG[key] || {
    gradient: 'from-slate-700 to-slate-900',
    pokemonId: 25,
    displayName: name.replace('-', ' '),
  }

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${config.pokemonId}.png`

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-slate-900 dark:text-slate-100 font-bold capitalize tracking-wide shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-slate-800 group w-full h-[40px] box-border border border-slate-200 dark:border-slate-700"
    >
      <span className="z-10 text-xs font-semibold text-slate-800 dark:text-slate-100">
        {config.displayName}
      </span>
      <img
        src={spriteUrl}
        alt={`${name} shape pokemon`}
        className="absolute -right-1 -bottom-1 w-8 h-8 object-contain opacity-40 group-hover:opacity-85 transition-all duration-300 group-hover:scale-110 pointer-events-none z-0 filter drop-shadow-sm"
      />
    </button>
  )
}
