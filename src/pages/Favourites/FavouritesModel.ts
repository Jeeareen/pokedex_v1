import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from '../../services/firebaseService';
import type { PokemonListItem } from '../../types/pokemon';

export type { PokemonListItem };

export class FavouritesModel {
  static async loadFavourites(userId: string): Promise<PokemonListItem[]> {
    return loadFavourites(userId);
  }

  static async saveFavourite(userId: string, pokemon: PokemonListItem): Promise<void> {
    return saveFavourite(userId, pokemon);
  }

  static async deleteFavourite(userId: string, pokemon: PokemonListItem | string): Promise<void> {
    return deleteFavourite(userId, pokemon);
  }
}

export async function loadFavourites(userId: string): Promise<PokemonListItem[]> {
  return await getFavourites(userId);
}

export async function saveFavourite(userId: string, pokemon: PokemonListItem): Promise<void> {
  await addFavourite(userId, pokemon);
}

export async function deleteFavourite(userId: string, pokemon: PokemonListItem | string): Promise<void> {
  await removeFavourite(userId, pokemon);
}
