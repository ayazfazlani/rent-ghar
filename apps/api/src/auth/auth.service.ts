import {
  BadGatewayException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@rent-ghar/db/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

export interface TokenResponse {
  token: string;
  user: { name: string; email: string; role: string };
  status: number;
  message: string;
}

export interface LoginResponse extends TokenResponse {
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto): Promise<TokenResponse> {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) throw new BadGatewayException('User already exists');
    const user = new this.userModel(dto);
    await user.save();

    const token = this.generateToken(user);
    return {
      token,
      user: {
        name: user.name || '',
        email: user.email,
        role: user.role || 'user',
      },
      status: 201,
      message: 'Registered successfully',
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // generate access token and refresh token
    const accessToken = this.generateToken(user);
    const refreshPayload = { sub: user._id.toString() };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    } as any);

    // store refresh token on user record
    user.refreshToken = refreshToken;
    await user.save();

    return {
      token: accessToken,
      refreshToken,
      user: {
        name: user.name || '',
        email: user.email,
        role: user.role || 'user',
      },
      status: 200,
      message: 'Login successful',
    };
  }
  private generateToken(user: UserDocument): string {
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };

    return this.jwtService.sign(payload as any);
  }

  async refreshToken(oldRefreshToken: string): Promise<TokenResponse> {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      }) as { sub: string };
      const user = await this.userModel.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Invalid token');
      if (user.refreshToken !== oldRefreshToken)
        throw new UnauthorizedException('Invalid token');
      return {
        token: this.generateToken(user),
        user: {
          name: user.name || '',
          email: user.email,
          role: user.role || 'user',
        },
        status: 200,
        message: 'Refresh token successful',
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async invalidateRefreshToken(
    oldRefreshToken: string,
  ): Promise<{ status: number; message: string }> {
    if (!oldRefreshToken) return { status: 200, message: 'Logged out' };
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      }) as { sub: string };
      const user = await this.userModel.findById(payload.sub);
      if (user && user.refreshToken === oldRefreshToken) {
        user.refreshToken = undefined;
        await user.save();
      }
    } catch (err) {
      // token invalid/expired → already logged out
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('Invalid refresh token during logout:', errMsg);
    }
    return { status: 200, message: 'Logged out' };
  }
}
