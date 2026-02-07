import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest, Response, CookieOptions } from 'express';

type AuthRequest = ExpressRequest & { user?: unknown };
import { AuthService, TokenResponse, LoginResponse } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // test api endpoint
  @Get('test')
  test() {
    return { message: 'Hello World' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<TokenResponse> {
    return this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<LoginResponse, 'refreshToken'>> {
    const result = await this.authService.login(dto);
    // set HttpOnly refresh token cookie
    const { refreshToken, ...rest } = result;
    if (refreshToken) {
      const cookieOpts: CookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      };
      res.cookie('refreshToken', refreshToken, cookieOpts);
    }
    return rest;
  }
  @Post('refresh')
  async refresh(
    @Req() req: AuthRequest,
    @Body() oldRefreshToken?: string,
  ): Promise<TokenResponse> {
    const token =
      (typeof oldRefreshToken === 'string' ? oldRefreshToken : undefined) ||
      (req.cookies && (req.cookies.refreshToken as string)) ||
      (req.headers['x-refresh-token'] as string | undefined);

    if (!token) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: number; message: string }> {
    // clear refresh cookie and user refresh token
    const token =
      (req.cookies && (req.cookies.refreshToken as string)) ||
      (req.headers['x-refresh-token'] as string | undefined);
    res.clearCookie('refreshToken', { path: '/' });
    return this.authService.invalidateRefreshToken(token ?? '');
  }
}
