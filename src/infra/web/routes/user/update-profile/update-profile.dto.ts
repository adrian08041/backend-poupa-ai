export type UpdateProfileRouteRequest = {
  name: string;
};

export type UpdateProfileRouteResponse = {
  id: string;
  name: string | null;
  email: string;
  access_token: string;
};
