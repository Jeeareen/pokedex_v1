import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, remove, get } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import type { PokemonListItem } from '../types/pokemon'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)

function getPokedexNumber(url: string): string {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

function extractPokedexNumber(itemOrNum: PokemonListItem | string): string {
  if (typeof itemOrNum === 'string') {
    return itemOrNum
  }
  return getPokedexNumber(itemOrNum.url)
}

export async function addFavourite(userId: string, pokemon: PokemonListItem): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to add favourites.')
  }

  const pokedexNum = getPokedexNumber(pokemon.url)
  if (!pokedexNum) {
    throw new Error('Invalid Pokémon URL: Could not determine Pokédex number.')
  }

  try {
    const favRef = ref(db, `users/${userId}/favourites/${pokedexNum}`)
    await set(favRef, pokemon)
  } catch (error) {
    throw new Error(
      `Failed to add ${pokemon.name} to favourites: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function removeFavourite(
  userId: string,
  pokemonOrPokedexNum: PokemonListItem | string
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to remove favourites.')
  }

  const pokedexNum = extractPokedexNumber(pokemonOrPokedexNum)
  if (!pokedexNum) {
    throw new Error('Invalid Pokédex number.')
  }

  try {
    const favRef = ref(db, `users/${userId}/favourites/${pokedexNum}`)
    await remove(favRef)
  } catch (error) {
    throw new Error(
      `Failed to remove favourite: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function getFavourites(userId: string): Promise<PokemonListItem[]> {
  if (!userId) {
    throw new Error('User ID is required to fetch favourites.')
  }

  try {
    const favsRef = ref(db, `users/${userId}/favourites`)
    const snapshot = await get(favsRef)

    if (!snapshot.exists()) {
      return []
    }

    const data = snapshot.val()
    return Object.values(data) as PokemonListItem[]
  } catch (error) {
    throw new Error(
      `Failed to retrieve favourite Pokémon list: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function addToPokedex(userId: string, pokemon: PokemonListItem): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to add to Pokédex.')
  }

  const pokedexNum = getPokedexNumber(pokemon.url)
  if (!pokedexNum) {
    throw new Error('Invalid Pokémon URL: Could not determine Pokédex number.')
  }

  try {
    const pokedexRef = ref(db, `users/${userId}/mypokedex/${pokedexNum}`)
    await set(pokedexRef, pokemon)
  } catch (error) {
    throw new Error(
      `Failed to add ${pokemon.name} to My Pokédex: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function removeFromPokedex(
  userId: string,
  pokemonOrPokedexNum: PokemonListItem | string
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to remove from Pokédex.')
  }

  const pokedexNum = extractPokedexNumber(pokemonOrPokedexNum)
  if (!pokedexNum) {
    throw new Error('Invalid Pokédex number.')
  }

  try {
    const pokedexRef = ref(db, `users/${userId}/mypokedex/${pokedexNum}`)
    await remove(pokedexRef)
  } catch (error) {
    throw new Error(
      `Failed to remove from My Pokédex: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function getPokedex(userId: string): Promise<PokemonListItem[]> {
  if (!userId) {
    throw new Error('User ID is required to fetch Pokédex.')
  }

  try {
    const pokedexRef = ref(db, `users/${userId}/mypokedex`)
    const snapshot = await get(pokedexRef)

    if (!snapshot.exists()) {
      return []
    }

    const data = snapshot.val()
    return Object.values(data) as PokemonListItem[]
  } catch (error) {
    throw new Error(
      `Failed to retrieve My Pokédex list: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export async function getMyPokedex(userId: string): Promise<PokemonListItem[]> {
  return getPokedex(userId)
}

export default db
