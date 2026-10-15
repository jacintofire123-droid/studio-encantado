import { Character } from '../types';
import { CHARACTERS as DEFAULT_CHARACTERS } from '../data/characters';

const STORAGE_KEY = 'studio_encantado_characters';
const DELETED_KEY = 'studio_encantado_deleted_characters';

const getDeletedCharacterIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

/**
 * Retorna a lista completa de personagens (originais + cadastrados pelo Admin, excluindo os deletados)
 */
export const getStoredCharacters = (): Character[] => {
  try {
    const deletedIds = getDeletedCharacterIds();
    const raw = localStorage.getItem(STORAGE_KEY);

    let baseList: Character[];
    if (raw) {
      const parsed: Character[] = JSON.parse(raw);
      const idMap = new Map<string, Character>();

      // Carregar padrão primeiro
      DEFAULT_CHARACTERS.forEach(c => {
        if (!deletedIds.has(c.id)) {
          idMap.set(c.id, c);
        }
      });

      // Sobrescrever com customizações salvas
      parsed.forEach(c => {
        if (!deletedIds.has(c.id)) {
          const def = idMap.get(c.id);
          idMap.set(c.id, {
            ...def,
            ...c,
            occasionVideos: {
              ...(def?.occasionVideos || {}),
              ...(c.occasionVideos || {})
            }
          });
        }
      });

      baseList = Array.from(idMap.values());
    } else {
      baseList = DEFAULT_CHARACTERS.filter(c => !deletedIds.has(c.id));
    }

    return baseList;
  } catch (e) {
    console.error('Erro ao ler personagens salvos:', e);
    return DEFAULT_CHARACTERS;
  }
};

/**
 * Salva ou atualiza um personagem
 */
export const saveStoredCharacter = (character: Character): void => {
  try {
    // Se estava na lista de deletados, remove dos deletados
    const deletedIds = getDeletedCharacterIds();
    if (deletedIds.has(character.id)) {
      deletedIds.delete(character.id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deletedIds)));
    }

    const currentList = getStoredCharacters();
    const index = currentList.findIndex(c => c.id === character.id);
    
    let updatedList: Character[];
    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = { ...currentList[index], ...character };
    } else {
      updatedList = [character, ...currentList];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('studio_characters_updated'));
  } catch (e) {
    console.error('Erro ao salvar personagem:', e);
  }
};

/**
 * Remove um personagem definitivamente (inclusive se for default)
 */
export const deleteStoredCharacter = (id: string): void => {
  try {
    const deletedIds = getDeletedCharacterIds();
    deletedIds.add(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deletedIds)));

    const currentList = getStoredCharacters();
    const filtered = currentList.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    window.dispatchEvent(new CustomEvent('studio_characters_updated'));
  } catch (e) {
    console.error('Erro ao excluir personagem:', e);
  }
};

/**
 * Restaura todos os personagens originais
 */
export const resetStoredCharacters = (): void => {
  try {
    localStorage.removeItem(DELETED_KEY);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('studio_characters_updated'));
  } catch (e) {
    console.error('Erro ao resetar personagens:', e);
  }
};
