import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/db/schema';

// Criar cliente de banco de dados em memória para testes
// Usar :memory: para evitar bloqueios de arquivo
let testClient: ReturnType<typeof createClient>;
let _testDb: ReturnType<typeof drizzle>;

export function getTestDb() {
  if (!testClient) {
    testClient = createClient({
      url: ':memory:',
    });
    _testDb = drizzle(testClient, { schema });
  }
  return _testDb;
}

// Exportar testDb para compatibilidade com código existente
export const testDb = getTestDb();

// Executar migrações antes dos testes
export async function setupTestDb() {
  // Como a migração está vazia, criar as tabelas diretamente
  const db = getTestDb();
  await createTables();
}

// Criar tabelas manualmente se necessário
async function createTables() {
  const db = getTestDb();
  const client = testClient!;
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT(200) NOT NULL,
      color TEXT(7) NOT NULL
    )
  `);
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT(200) NOT NULL,
      descricao TEXT,
      categoria_id INTEGER NOT NULL,
      prioridade TEXT(20) NOT NULL,
      status TEXT(20) NOT NULL,
      data_criacao TEXT NOT NULL,
      data_vencimento TEXT,
      data_conclusao TEXT,
      FOREIGN KEY (categoria_id) REFERENCES categories(id)
    )
  `);
}

// Limpar banco de dados após os testes
export async function cleanupTestDb() {
  try {
    const db = getTestDb();
    // Limpar todas as tabelas
    await db.delete(schema.tasksTable);
    await db.delete(schema.categoryTable);
  } catch (error) {
    // Ignorar erros de limpeza se as tabelas não existirem
    // ou se o banco estiver bloqueado
  }
}
