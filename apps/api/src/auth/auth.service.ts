import { BadGatewayException, UnauthorizedException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../../../packages/db/src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ){}
    async register(dto: RegisterDto){
        const existingUser = await this.userModel.findOne({email: dto.email});
        if(existingUser) throw new BadGatewayException('User already exists');
        const user = new this.userModel(dto);
        await user.save();

        return this.generateToken(user);
    }


    async login(dto: LoginDto){
        const user = await this.userModel.findOne({email: dto.email}).select('+password');
    
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }
        // with token and user in response
        return {
            token: this.generateToken(user),
            user: {
                "name": user.name,
                "email": user.email,
                "role": user.role
            },
            status: 200,
            message: 'Login successful'
        }
    }
    private generateToken(user: UserDocument){
        const payload = {
            email: user.email,
            sub: user._id,
            role: user.role
        }

        return this.jwtService.sign(payload);
    }

    async refreshToken(oldRefreshToken: string) {
        try{
            const payload = this.jwtService.verify(oldRefreshToken , {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            })
            const user = await this.userModel.findById(payload.sub);
            if(!user) throw new UnauthorizedException('Invalid token');
            if(user.refreshToken !== oldRefreshToken) throw new UnauthorizedException('Invalid token');
            return {
                token: this.generateToken(user),
                user: {
                    "name": user.name,
                    "email": user.email,
                    "role": user.role
                },
                status: 200,
                message: 'Refresh token successful'
            }
        }catch(error){
            throw new UnauthorizedException('Invalid token');
        }
    }
}
