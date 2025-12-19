import { z } from 'zod';

export const prioridadeEnum = z.enum(['urgente', 'alta', 'média', 'baixa']);
export const statusEnum = z.enum(['pendente', 'em andamento', 'concluída', 'cancelada']);

export const createTaskSchema = z.object({
  titulo: z.string().min(1).max(200),
  descricao: z.string().optional(),
  categoria_id: z.number().int().positive(),
  prioridade: prioridadeEnum,
  status: statusEnum,
  data_vencimento: z.string().optional(),
});

export const updateTaskSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descricao: z.string().optional(),
  categoria_id: z.number().int().positive().optional(),
  prioridade: prioridadeEnum.optional(),
  status: statusEnum.optional(),
  data_vencimento: z.string().optional(),
});

export const taskParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export const taskQuerySchema = z.object({
  status: statusEnum.optional(),
  categoria_id: z.string().transform((val) => parseInt(val, 10)).optional(),
  prioridade: prioridadeEnum.optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
});

export const createCategorySchema = z.object({
  nome: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const updateCategorySchema = z.object({
  nome: z.string().min(1).max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const categoryParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
