export type UpdateProfileRouteRequest = {
  name: string;
  email: string;
};

export type UpdateProfileRouteResponse = {
  id: string;
  name: string | null;
  email: string;
};
