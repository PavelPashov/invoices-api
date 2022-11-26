import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { IncorrectCredentialsException } from './exceptions/auth.exceptions';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User | undefined> {
      const user = await this.userService.getByEmail(email);
      if (user && user.password) {
        await this.verifyPassword(plainTextPassword, user.password);
        return user;
      }
      throw new IncorrectCredentialsException();
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new IncorrectCredentialsException();
    }
  }

  public getJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload);
  }
}
