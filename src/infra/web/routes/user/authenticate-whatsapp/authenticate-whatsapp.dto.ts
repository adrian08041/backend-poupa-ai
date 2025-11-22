export type AuthenticateWhatsappRequest = {
  whatsappNumber: string;
};

export type AuthenticateWhatsappResponse = {
  authToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};
