import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
}).strict();

export type LoginUserRequest = z.infer<typeof loginUserSchema>;

export type LoginUserResponse = {
  authToken: string;
  refreshToken: string;
};
