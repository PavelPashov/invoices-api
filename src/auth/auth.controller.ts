import { LoginUserDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Body() body: LoginUserDto) {
    const user = await this.authService.getAuthenticatedUser(
      body.email,
      body.password,
    );
    const token = this.authService.getJwtToken(user.id);
    return { user, token };
  }
}
