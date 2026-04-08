import { z } from 'zod';

export const linkWhatsappSchema = z.object({
  whatsappNumber: z.string().min(1, 'Número do WhatsApp é obrigatório'),
}).strict();

export type LinkWhatsappRequest = z.infer<typeof linkWhatsappSchema>;

export type LinkWhatsappResponse = {
  success: boolean;
  whatsappNumber: string;
};
