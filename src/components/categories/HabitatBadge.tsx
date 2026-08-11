import type { HabitatBadgeProps } from '../../types/pokemon'
import { HABITAT_CONFIG } from '../../utils/constants'

export function HabitatBadge({ name, onClick }: HabitatBadgeProps) {
  const config = HABITAT_CONFIG[name.toLowerCase()] || {
    gradient: 'from-slate-700 to-slate-900',
    pokemonId: 25,
  }

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${config.pokemonId}.png`

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-slate-900 dark:text-slate-100 font-bold capitalize tracking-wide shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-slate-800 group w-full h-[40px] box-border border border-slate-200 dark:border-slate-700"
    >
      <span className="z-10 text-xs font-semibold text-slate-800 dark:text-slate-100">
        {name.replace('-', ' ')}
      </span>
      <img
        src={spriteUrl}
        alt={`${name} habitat pokemon`}
        className="absolute -right-1 -bottom-1 w-8 h-8 object-contain opacity-40 group-hover:opacity-85 transition-all duration-300 group-hover:scale-110 pointer-events-none z-0 filter drop-shadow-sm"
      />
    </button>
  )
}
