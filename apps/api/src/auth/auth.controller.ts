import { Body, Controller, Get, HttpCode, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // test api endpoint
    @Get('test')
    async test(){
        return {message: 'Hello World'};
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('register')
    async register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }
    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }
    @Post('refresh')
    async refresh(@Body() oldRefreshToken: string){
        return this.authService.refreshToken(oldRefreshToken);
    }
    @Post('logout')
    async logout(@Body() oldRefreshToken: string){
        return this.authService.refreshToken(oldRefreshToken);
    }
}
