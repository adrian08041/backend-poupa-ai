import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
}).strict();

export type ChangePasswordRouteRequest = z.infer<typeof changePasswordSchema>;

export type ChangePasswordRouteResponse = {
  success: boolean;
};
