import { ShapeCard } from './ShapeCard'
import type { NamedAPIResource } from '../../types/pokemon'

interface ShapeGridProps {
  shapes: NamedAPIResource[]
  onShapeClick: (name: string) => void
}

export function ShapeGrid({ shapes, onShapeClick }: ShapeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {shapes.map((shape) => (
        <ShapeCard
          key={shape.name}
          name={shape.name}
          onClick={() => onShapeClick(shape.name)}
        />
      ))}
    </div>
  )
}
