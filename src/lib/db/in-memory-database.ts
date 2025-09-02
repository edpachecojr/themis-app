// InMemoryDatabase.ts
export class InMemoryDatabase<T extends { id: string }> {
  private items: T[] = [];

  // Create
  add(item: T): T {
    this.items.push(item);
    return item;
  }

  // Read all
  getAll(): T[] {
    return [...this.items];
  }

  // Read by ID
  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Update
  update(id: string, updatedFields: Partial<Omit<T, "id">>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const current = this.items[index];
    const updated = { ...current, ...updatedFields } as T;
    this.items[index] = updated;
    return updated;
  }

  // Delete
  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  // Clear all
  clear(): void {
    this.items = [];
  }
}
