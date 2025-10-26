import { Product, ProductInput, ProductUpdate } from "@/types";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("storekeeper.db");

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        price REAL NOT NULL DEFAULT 0.0,
        image_uri TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(
      "SELECT * FROM products ORDER BY updated_at DESC"
    );
    return result;
  } catch (error) {
    console.error("Error getting all products:", error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const result = await db.getFirstAsync<Product>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return result || null;
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
};

export const addProduct = async (product: ProductInput): Promise<number> => {
  try {
    const result = await db.runAsync(
      "INSERT INTO products (name, quantity, price, image_uri) VALUES (?, ?, ?, ?)",
      [product.name, product.quantity, product.price, product.image_uri]
    );
    console.log("Product added with ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (product: ProductUpdate): Promise<void> => {
  try {
    await db.runAsync(
      `UPDATE products 
       SET name = ?, quantity = ?, price = ?, image_uri = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        product.name,
        product.quantity,
        product.price,
        product.image_uri,
        product.id,
      ]
    );
    console.log("Product updated:", product.id);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await db.runAsync("DELETE FROM products WHERE id = ?", [id]);
    console.log("Product deleted:", id);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(
      "SELECT * FROM products WHERE name LIKE ? ORDER BY updated_at DESC",
      [`%${query}%`]
    );
    return result;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export default db;
