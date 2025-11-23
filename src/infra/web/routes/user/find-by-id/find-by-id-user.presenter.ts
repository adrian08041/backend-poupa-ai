import { FindUserOutput } from 'src/usecases/user/find-by-id/find-user.usecase';
import { FindByIdUserResponse } from './find-by-id-user.dto';

export class FindByIdUserPresenter {
  public static toHttp(input: FindUserOutput): FindByIdUserResponse {
    const response: FindByIdUserResponse = {
      id: input.id,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };

    return response;
  }
}
