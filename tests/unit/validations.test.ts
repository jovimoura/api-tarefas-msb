import { describe, it, expect } from 'vitest';
import {
  createTaskSchema,
  updateTaskSchema,
  createCategorySchema,
  updateCategorySchema,
  taskParamsSchema,
  categoryParamsSchema,
  taskQuerySchema,
  prioridadeEnum,
  statusEnum,
} from '../../src/lib/validations';

describe('Validations', () => {
  describe('createTaskSchema', () => {
    it('deve validar uma tarefa válida', () => {
      const validTask = {
        titulo: 'Tarefa de teste',
        descricao: 'Descrição da tarefa',
        categoria_id: 1,
        prioridade: 'alta',
        status: 'pendente',
        data_vencimento: '2024-12-31T23:59:59Z',
      };

      expect(() => createTaskSchema.parse(validTask)).not.toThrow();
    });

    it('deve validar tarefa sem descrição', () => {
      const validTask = {
        titulo: 'Tarefa sem descrição',
        categoria_id: 1,
        prioridade: 'média',
        status: 'em andamento',
      };

      expect(() => createTaskSchema.parse(validTask)).not.toThrow();
    });

    it('deve rejeitar tarefa sem título', () => {
      const invalidTask = {
        categoria_id: 1,
        prioridade: 'alta',
        status: 'pendente',
      };

      expect(() => createTaskSchema.parse(invalidTask)).toThrow();
    });

    it('deve rejeitar título muito longo', () => {
      const invalidTask = {
        titulo: 'a'.repeat(201),
        categoria_id: 1,
        prioridade: 'alta',
        status: 'pendente',
      };

      expect(() => createTaskSchema.parse(invalidTask)).toThrow();
    });

    it('deve rejeitar categoria_id inválido', () => {
      const invalidTask = {
        titulo: 'Tarefa',
        categoria_id: -1,
        prioridade: 'alta',
        status: 'pendente',
      };

      expect(() => createTaskSchema.parse(invalidTask)).toThrow();
    });

    it('deve rejeitar prioridade inválida', () => {
      const invalidTask = {
        titulo: 'Tarefa',
        categoria_id: 1,
        prioridade: 'muito alta',
        status: 'pendente',
      };

      expect(() => createTaskSchema.parse(invalidTask)).toThrow();
    });

    it('deve rejeitar status inválido', () => {
      const invalidTask = {
        titulo: 'Tarefa',
        categoria_id: 1,
        prioridade: 'alta',
        status: 'finalizada',
      };

      expect(() => createTaskSchema.parse(invalidTask)).toThrow();
    });

    it('deve aceitar todas as prioridades válidas', () => {
      const prioridades = ['urgente', 'alta', 'média', 'baixa'];
      
      prioridades.forEach((prioridade) => {
        const task = {
          titulo: 'Tarefa',
          categoria_id: 1,
          prioridade,
          status: 'pendente',
        };
        expect(() => createTaskSchema.parse(task)).not.toThrow();
      });
    });

    it('deve aceitar todos os status válidos', () => {
      const statuses = ['pendente', 'em andamento', 'concluída', 'cancelada'];
      
      statuses.forEach((status) => {
        const task = {
          titulo: 'Tarefa',
          categoria_id: 1,
          prioridade: 'alta',
          status,
        };
        expect(() => createTaskSchema.parse(task)).not.toThrow();
      });
    });
  });

  describe('updateTaskSchema', () => {
    it('deve validar atualização com todos os campos', () => {
      const update = {
        titulo: 'Título atualizado',
        descricao: 'Nova descrição',
        categoria_id: 2,
        prioridade: 'urgente',
        status: 'concluída',
        data_vencimento: '2025-01-01T00:00:00Z',
      };

      expect(() => updateTaskSchema.parse(update)).not.toThrow();
    });

    it('deve validar atualização parcial', () => {
      const update = {
        status: 'concluída',
      };

      expect(() => updateTaskSchema.parse(update)).not.toThrow();
    });

    it('deve validar objeto vazio', () => {
      expect(() => updateTaskSchema.parse({})).not.toThrow();
    });

    it('deve rejeitar título muito longo', () => {
      const update = {
        titulo: 'a'.repeat(201),
      };

      expect(() => updateTaskSchema.parse(update)).toThrow();
    });
  });

  describe('createCategorySchema', () => {
    it('deve validar categoria válida', () => {
      const category = {
        nome: 'Trabalho',
        color: '#FF5733',
      };

      expect(() => createCategorySchema.parse(category)).not.toThrow();
    });

    it('deve rejeitar nome vazio', () => {
      const category = {
        nome: '',
        color: '#FF5733',
      };

      expect(() => createCategorySchema.parse(category)).toThrow();
    });

    it('deve rejeitar nome muito longo', () => {
      const category = {
        nome: 'a'.repeat(201),
        color: '#FF5733',
      };

      expect(() => createCategorySchema.parse(category)).toThrow();
    });

    it('deve rejeitar cor inválida', () => {
      const category = {
        nome: 'Categoria',
        color: 'FF5733',
      };

      expect(() => createCategorySchema.parse(category)).toThrow();
    });

    it('deve rejeitar cor com formato inválido', () => {
      const category = {
        nome: 'Categoria',
        color: '#GGGGGG',
      };

      expect(() => createCategorySchema.parse(category)).toThrow();
    });

    it('deve aceitar cores hexadecimais válidas', () => {
      const validColors = ['#FF5733', '#000000', '#FFFFFF', '#123ABC', '#abc123'];
      
      validColors.forEach((color) => {
        const category = {
          nome: 'Categoria',
          color,
        };
        expect(() => createCategorySchema.parse(category)).not.toThrow();
      });
    });
  });

  describe('updateCategorySchema', () => {
    it('deve validar atualização completa', () => {
      const update = {
        nome: 'Novo nome',
        color: '#00FF00',
      };

      expect(() => updateCategorySchema.parse(update)).not.toThrow();
    });

    it('deve validar atualização parcial', () => {
      const update = {
        nome: 'Novo nome',
      };

      expect(() => updateCategorySchema.parse(update)).not.toThrow();
    });

    it('deve validar objeto vazio', () => {
      expect(() => updateCategorySchema.parse({})).not.toThrow();
    });
  });

  describe('taskParamsSchema', () => {
    it('deve transformar string em número', () => {
      const result = taskParamsSchema.parse({ id: '123' });
      expect(result.id).toBe(123);
    });

    it('deve transformar string não numérica em NaN', () => {
      const result = taskParamsSchema.parse({ id: 'abc' });
      expect(Number.isNaN(result.id)).toBe(true);
    });

    it('deve transformar string vazia em NaN', () => {
      const result = taskParamsSchema.parse({ id: '' });
      expect(Number.isNaN(result.id)).toBe(true);
    });
  });

  describe('categoryParamsSchema', () => {
    it('deve transformar string em número', () => {
      const result = categoryParamsSchema.parse({ id: '456' });
      expect(result.id).toBe(456);
    });
  });

  describe('taskQuerySchema', () => {
    it('deve validar query vazia', () => {
      expect(() => taskQuerySchema.parse({})).not.toThrow();
    });

    it('deve validar query com todos os filtros', () => {
      const query = {
        status: 'pendente',
        categoria_id: '1',
        prioridade: 'alta',
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
      };

      const result = taskQuerySchema.parse(query);
      expect(result.categoria_id).toBe(1);
    });

    it('deve transformar categoria_id string em número', () => {
      const query = {
        categoria_id: '5',
      };

      const result = taskQuerySchema.parse(query);
      expect(result.categoria_id).toBe(5);
    });
  });
});
