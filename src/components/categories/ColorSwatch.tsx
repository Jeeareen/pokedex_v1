import type { ColorSwatchProps } from '../../types/pokemon'
import { COLOR_CONFIG } from '../../utils/constants'

export function ColorSwatch({ name, hex, onClick }: ColorSwatchProps) {
  const config = COLOR_CONFIG[name.toLowerCase()] || {
    gradient: 'from-slate-700 to-slate-900',
    hex: hex || '#718096',
    pokemonId: 25,
  }

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${config.pokemonId}.png`

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white font-bold capitalize tracking-wide shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group w-full h-[40px] box-border border border-white/10`}
    >
      <div className="flex items-center gap-2 z-10">
        <span
          className="w-3 h-3 rounded-full border border-white/40 shadow-sm transition-transform group-hover:scale-110"
          style={{ backgroundColor: config.hex }}
        />
        <span className="drop-shadow-sm text-xs">{name}</span>
      </div>
      <img
        src={spriteUrl}
        alt={`${name} color pokemon`}
        className="absolute -right-1 -bottom-1 w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-110 pointer-events-none drop-shadow-md z-0"
      />
    </button>
  )
}
