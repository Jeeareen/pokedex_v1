import type { RegionData } from '../types/pokemon'

export const REGIONS_DATA: RegionData[] = [
  {
    name: 'kanto',
    displayName: 'Kanto',
    generation: 'Gen I',
    starterId: 4, // Charmander (was 6 - Charizard)
    gradientClass: 'from-red-500 to-amber-500',
  },
  {
    name: 'johto',
    displayName: 'Johto',
    generation: 'Gen II',
    starterId: 155, // Cyndaquil (was 157 - Typhlosion)
    gradientClass: 'from-amber-400 to-yellow-600',
  },
  {
    name: 'hoenn',
    displayName: 'Hoenn',
    generation: 'Gen III',
    starterId: 252, // Treecko (was 254 - Sceptile)
    gradientClass: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'sinnoh',
    displayName: 'Sinnoh',
    generation: 'Gen IV',
    starterId: 390, // Chimchar (was 392 - Infernape)
    gradientClass: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'unova',
    displayName: 'Unova',
    generation: 'Gen V',
    starterId: 495, // Snivy (was 497 - Serperior)
    gradientClass: 'from-teal-500 to-cyan-600',
  },
  {
    name: 'kalos',
    displayName: 'Kalos',
    generation: 'Gen VI',
    starterId: 656, // Froakie (was 658 - Greninja)
    gradientClass: 'from-sky-500 to-blue-700',
  },
  {
    name: 'alola',
    displayName: 'Alola',
    generation: 'Gen VII',
    starterId: 725, // Litten (was 727 - Incineroar)
    gradientClass: 'from-orange-400 to-rose-500',
  },
  {
    name: 'galar',
    displayName: 'Galar',
    generation: 'Gen VIII',
    starterId: 813, // Scorbunny (was 815 - Cinderace)
    gradientClass: 'from-violet-500 to-purple-700',
  },
  {
    name: 'hisui',
    displayName: 'Hisui',
    generation: 'Gen VIII (Ancient)',
    starterId: 501, // Oshawott (was 503 - Samurott)
    gradientClass: 'from-stone-600 to-slate-800',
  },
  {
    name: 'paldea',
    displayName: 'Paldea',
    generation: 'Gen IX',
    starterId: 906, // Sprigatito (was 908 - Meowscarada)
    gradientClass: 'from-rose-500 to-red-700',
  },
]

export const POKEMON_TYPE_COLORS: Record<string, { bg: string; gradient: string; hex: string }> = {
  normal: { bg: 'bg-[#A8A77A]', gradient: 'from-[#A8A77A] to-[#8C8B5F]', hex: '#A8A77A' },
  fire: { bg: 'bg-[#EE8130]', gradient: 'from-[#EE8130] to-[#F05A28]', hex: '#EE8130' },
  water: { bg: 'bg-[#6390F0]', gradient: 'from-[#6390F0] to-[#386CEB]', hex: '#6390F0' },
  electric: { bg: 'bg-[#F7D02C]', gradient: 'from-[#F7D02C] to-[#E5B80B]', hex: '#F7D02C' },
  grass: { bg: 'bg-[#7AC74C]', gradient: 'from-[#7AC74C] to-[#59AC2C]', hex: '#7AC74C' },
  ice: { bg: 'bg-[#96D9D6]', gradient: 'from-[#96D9D6] to-[#59C2BE]', hex: '#96D9D6' },
  fighting: { bg: 'bg-[#C22E28]', gradient: 'from-[#C22E28] to-[#9C1C17]', hex: '#C22E28' },
  poison: { bg: 'bg-[#A33EA1]', gradient: 'from-[#A33EA1] to-[#7D267B]', hex: '#A33EA1' },
  ground: { bg: 'bg-[#E2BF65]', gradient: 'from-[#E2BF65] to-[#C9A038]', hex: '#E2BF65' },
  flying: { bg: 'bg-[#A98FF3]', gradient: 'from-[#A98FF3] to-[#7E5BF0]', hex: '#A98FF3' },
  psychic: { bg: 'bg-[#F95587]', gradient: 'from-[#F95587] to-[#E3205B]', hex: '#F95587' },
  bug: { bg: 'bg-[#A6B91A]', gradient: 'from-[#A6B91A] to-[#84950D]', hex: '#A6B91A' },
  rock: { bg: 'bg-[#B6A136]', gradient: 'from-[#B6A136] to-[#8E7C20]', hex: '#B6A136' },
  ghost: { bg: 'bg-[#735797]', gradient: 'from-[#735797] to-[#4E376E]', hex: '#735797' },
  dragon: { bg: 'bg-[#6F35FC]', gradient: 'from-[#6F35FC] to-[#460CEE]', hex: '#6F35FC' },
  dark: { bg: 'bg-[#705746]', gradient: 'from-[#705746] to-[#4D3A2C]', hex: '#705746' },
  steel: { bg: 'bg-[#B7B7CE]', gradient: 'from-[#B7B7CE] to-[#8F8FA8]', hex: '#B7B7CE' },
  fairy: { bg: 'bg-[#D685AD]', gradient: 'from-[#D685AD] to-[#B85787]', hex: '#D685AD' },
}

export const POKEMON_COLOR_HEX: Record<string, string> = {
  black: '#2D3748',
  blue: '#3182CE',
  brown: '#975A16',
  gray: '#718096',
  green: '#38A169',
  pink: '#ED64A6',
  purple: '#805AD5',
  red: '#E53E3E',
  white: '#EDF2F7',
  yellow: '#D69E2E',
}

export const HABITAT_CONFIG: Record<
  string,
  { gradient: string; pokemonId: number }
> = {
  cave: { gradient: 'from-slate-700 to-indigo-900', pokemonId: 41 }, // Zubat
  forest: { gradient: 'from-emerald-600 to-teal-800', pokemonId: 10 }, // Caterpie
  grassland: { gradient: 'from-lime-500 to-emerald-700', pokemonId: 19 }, // Rattata
  mountain: { gradient: 'from-amber-700 to-stone-800', pokemonId: 66 }, // Machop
  rare: { gradient: 'from-purple-600 to-pink-800', pokemonId: 147 }, // Dratini
  'rough-terrain': { gradient: 'from-amber-600 to-orange-800', pokemonId: 27 }, // Sandshrew
  sea: { gradient: 'from-blue-600 to-cyan-800', pokemonId: 116 }, // Horsea
  urban: { gradient: 'from-slate-600 to-blue-900', pokemonId: 81 }, // Magnemite
  'waters-edge': { gradient: 'from-sky-500 to-blue-700', pokemonId: 54 }, // Psyduck
}

export const COLOR_CONFIG: Record<
  string,
  { gradient: string; hex: string; pokemonId: number }
> = {
  black: { gradient: 'from-zinc-800 to-slate-950', hex: '#2D3748', pokemonId: 197 }, // Umbreon
  blue: { gradient: 'from-blue-500 to-indigo-700', hex: '#3182CE', pokemonId: 7 }, // Squirtle
  brown: { gradient: 'from-amber-800 to-stone-900', hex: '#975A16', pokemonId: 133 }, // Eevee
  gray: { gradient: 'from-slate-500 to-zinc-700', hex: '#718096', pokemonId: 67 }, // Machoke
  green: { gradient: 'from-emerald-500 to-green-700', hex: '#38A169', pokemonId: 1 }, // Bulbasaur
  pink: { gradient: 'from-pink-400 to-rose-600', hex: '#ED64A6', pokemonId: 39 }, // Jigglypuff
  purple: { gradient: 'from-purple-600 to-violet-900', hex: '#805AD5', pokemonId: 94 }, // Gengar
  red: { gradient: 'from-red-500 to-rose-700', hex: '#E53E3E', pokemonId: 4 }, // Charmander
  white: { gradient: 'from-slate-300 to-gray-500', hex: '#EDF2F7', pokemonId: 87 }, // Dewgong
  yellow: { gradient: 'from-amber-400 to-yellow-600', hex: '#D69E2E', pokemonId: 25 }, // Pikachu
}

export const SHAPE_CONFIG: Record<
  string,
  { gradient: string; pokemonId: number; displayName: string }
> = {
  ball: { gradient: 'from-red-500 to-amber-500', pokemonId: 100, displayName: 'Ball' }, // Voltorb
  squiggle: { gradient: 'from-purple-500 to-indigo-700', pokemonId: 23, displayName: 'Squiggle' }, // Ekans
  fish: { gradient: 'from-blue-500 to-cyan-700', pokemonId: 129, displayName: 'Fish' }, // Magikarp
  arms: { gradient: 'from-teal-500 to-emerald-700', pokemonId: 64, displayName: 'Arms Only' }, // Kadabra
  blob: { gradient: 'from-pink-500 to-rose-700', pokemonId: 132, displayName: 'Blob' }, // Ditto
  upright: { gradient: 'from-emerald-500 to-teal-700', pokemonId: 1, displayName: 'Upright' }, // Bulbasaur
  legs: { gradient: 'from-sky-500 to-blue-700', pokemonId: 116, displayName: 'Legs Only' }, // Horsea
  quadruped: { gradient: 'from-amber-600 to-yellow-700', pokemonId: 58, displayName: 'Quadruped' }, // Growlithe
  wings: { gradient: 'from-indigo-500 to-purple-700', pokemonId: 17, displayName: 'Wings' }, // Pidgeotto
  tentacles: { gradient: 'from-blue-600 to-indigo-800', pokemonId: 72, displayName: 'Tentacles' }, // Tentacool
  heads: { gradient: 'from-yellow-500 to-amber-700', pokemonId: 84, displayName: 'Multiple Heads' }, // Doduo
  humanoid: { gradient: 'from-rose-500 to-red-700', pokemonId: 106, displayName: 'Humanoid' }, // Hitmonlee
  bug_wings: { gradient: 'from-lime-500 to-emerald-700', pokemonId: 12, displayName: 'Bug Wings' }, // Butterfree
  armor: { gradient: 'from-slate-600 to-stone-800', pokemonId: 140, displayName: 'Armor' }, // Kabuto
}

