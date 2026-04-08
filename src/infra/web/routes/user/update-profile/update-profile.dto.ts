import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
}).strict();

export type UpdateProfileRouteRequest = z.infer<typeof updateProfileSchema>;

export type UpdateProfileRouteResponse = {
  id: string;
  name: string | null;
  email: string;
  access_token: string;
};
