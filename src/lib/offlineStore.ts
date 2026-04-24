import { openDB } from 'idb';

const DB_NAME = 'SafaricomGamingHub';
const STORE_NAME = 'outbox';

// Initialize the Database
export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
}

// Save a pending registration
export async function saveToOutbox(data: any) {
  const db = await initDB();
  return db.add(STORE_NAME, { ...data, timestamp: Date.now() });
}

// Get all pending items
export async function getOutbox() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

// Clear item after successful upload
export async function removeFromOutbox(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}