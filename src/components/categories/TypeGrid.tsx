import { TypeCard } from './TypeCard'
import type { PokemonTypeData } from '../../types/pokemon'

interface TypeGridProps {
  types: PokemonTypeData[]
}

export function TypeGrid({ types }: TypeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {types.map((type) => (
        <TypeCard key={type.name} name={type.name} />
      ))}
    </div>
  )
}
