import { z } from 'zod';

export const authenticateWhatsappSchema = z.object({
  whatsappNumber: z.string().min(1, 'Número do WhatsApp é obrigatório'),
}).strict();

export type AuthenticateWhatsappRequest = z.infer<typeof authenticateWhatsappSchema>;

export type AuthenticateWhatsappResponse = {
  authToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};
