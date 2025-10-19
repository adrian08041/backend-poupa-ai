export type ChangePasswordRouteRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordRouteResponse = {
  success: boolean;
};
