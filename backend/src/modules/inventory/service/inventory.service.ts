import { inventoryRepository } from '../repository/inventory.repository.js';

export const inventoryService = {
  listInventory() {
    return inventoryRepository.list();
  },
  async createItem(name: string, quantity: number) {
    try {
      return await inventoryRepository.create({ name, quantity });
    } catch {
      throw { statusCode: 409, message: 'Item already exists' };
    }
  },
  async updateItem(id: string, payload: { name?: string; quantity?: number }) {
    try {
      return await inventoryRepository.update(id, payload);
    } catch {
      throw { statusCode: 404, message: 'Inventory item not found' };
    }
  },
  async deleteItem(id: string) {
    try {
      await inventoryRepository.remove(id);
      return { success: true };
    } catch {
      throw { statusCode: 404, message: 'Inventory item not found' };
    }
  },
};
