import { RegionCard } from './RegionCard'
import { REGIONS_DATA } from '../../utils/constants'

export function RegionGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {REGIONS_DATA.map((region) => (
        <RegionCard key={region.name} region={region} />
      ))}
    </div>
  )
}
