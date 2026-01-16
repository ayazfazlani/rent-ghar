import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // test api endpoint
    @Get('test')
    async test(){
        return {message: 'Hello World'};
    }
    @Post('registers')
    async register(@Body() dto: RegisterDto){
        // return dto;
        return this.authService.register(dto);
    }
    @Post('login')
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
