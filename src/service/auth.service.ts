import { IUserResponse } from '@/interface/user.interface';
import { AuthRepository } from '@/repository/auth.repository';
import { ApiError } from '@/util/api.util';
import { verifySignature } from '@/util/etherValidation.util';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async authenticate(address: string): Promise<string> {
    const noance = await this.authRepository.authenticate(address);
    return noance;
  }

  async verify(address: string, signature: string, nonce: string): Promise<IUserResponse> {
    const isCorrect = verifySignature(address, signature, nonce);
    if (isCorrect == false) throw new ApiError(400, 'Signature mismatched');
    const userData: IUserResponse = await this.authRepository.verify(address, nonce);
    return userData;
  }

  async verifyUserByAddress(address: string): Promise<boolean> {
    return this.authRepository.verifyUserByAddress(address);
  }
}
