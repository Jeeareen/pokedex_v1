import bugIcon from '../assets/type_icons/bug.svg'
import darkIcon from '../assets/type_icons/dark.svg'
import dragonIcon from '../assets/type_icons/dragon.svg'
import electricIcon from '../assets/type_icons/electric.svg'
import fairyIcon from '../assets/type_icons/fairy.svg'
import fightingIcon from '../assets/type_icons/fighting.svg'
import fireIcon from '../assets/type_icons/fire.svg'
import flyingIcon from '../assets/type_icons/flying.svg'
import ghostIcon from '../assets/type_icons/ghost.svg'
import grassIcon from '../assets/type_icons/grass.svg'
import groundIcon from '../assets/type_icons/ground.svg'
import iceIcon from '../assets/type_icons/ice.svg'
import normalIcon from '../assets/type_icons/normal.svg'
import poisonIcon from '../assets/type_icons/poison.svg'
import psychicIcon from '../assets/type_icons/psychic.svg'
import rockIcon from '../assets/type_icons/rock.svg'
import steelIcon from '../assets/type_icons/steel.svg'
import waterIcon from '../assets/type_icons/water.svg'

export const TYPE_ICONS: Record<string, string> = {
  bug: bugIcon,
  dark: darkIcon,
  dragon: dragonIcon,
  electric: electricIcon,
  fairy: fairyIcon,
  fighting: fightingIcon,
  fire: fireIcon,
  flying: flyingIcon,
  ghost: ghostIcon,
  grass: grassIcon,
  ground: groundIcon,
  ice: iceIcon,
  normal: normalIcon,
  poison: poisonIcon,
  psychic: psychicIcon,
  rock: rockIcon,
  steel: steelIcon,
  water: waterIcon,
}

export function getTypeIcon(type: string): string | undefined {
  return TYPE_ICONS[type.toLowerCase()]
}
