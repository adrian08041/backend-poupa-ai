import { UpdateProfileOutput } from 'src/usecases/user/update-profile/update-profile.usecase';
import { UpdateProfileRouteResponse } from './update-profile.dto';

export class UpdateProfilePresenter {
  public static toHttp(output: UpdateProfileOutput): UpdateProfileRouteResponse {
    return {
      id: output.id,
      name: output.name,
      email: output.email,
      access_token: output.authToken,
    };
  }
}
