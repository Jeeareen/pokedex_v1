import {
  getPokedex,
  addToPokedex,
  removeFromPokedex,
} from '../../services/firebaseService';
import type { PokemonListItem } from '../../types/pokemon';

export type { PokemonListItem };

export class MyPokedexModel {
  static async loadPokedex(userId: string): Promise<PokemonListItem[]> {
    return loadPokedex(userId);
  }

  static async savePokedex(userId: string, pokemon: PokemonListItem): Promise<void> {
    return savePokedex(userId, pokemon);
  }

  static async deletePokedex(userId: string, pokemon: PokemonListItem | string): Promise<void> {
    return deletePokedex(userId, pokemon);
  }
}

export async function loadPokedex(userId: string): Promise<PokemonListItem[]> {
  return await getPokedex(userId);
}

export async function savePokedex(userId: string, pokemon: PokemonListItem): Promise<void> {
  await addToPokedex(userId, pokemon);
}

export async function deletePokedex(userId: string, pokemon: PokemonListItem | string): Promise<void> {
  await removeFromPokedex(userId, pokemon);
}
