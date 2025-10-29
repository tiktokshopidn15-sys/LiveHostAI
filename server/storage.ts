import type { Product, Config } from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  addProduct(product: Product): Promise<Product>;
  
  // Config operations
  getConfig(): Promise<Config>;
  updateConfig(config: Partial<Config>): Promise<Config>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private config: Config;

  constructor() {
    this.products = new Map();
    this.config = {
      developerMode: true,
      tokenLimit: 1000000,
      tokensUsed: 0,
      voice: "nova",
    };
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async addProduct(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async getConfig(): Promise<Config> {
    return { ...this.config };
  }

  async updateConfig(updates: Partial<Config>): Promise<Config> {
    this.config = { ...this.config, ...updates };
    return { ...this.config };
  }
}

export const storage = new MemStorage();
