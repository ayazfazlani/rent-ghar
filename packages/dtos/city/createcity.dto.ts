import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCityDto {
    @IsNotEmpty({ message: 'City name is required' })
    @IsString({ message: 'City name must be a string' })
    name: string;

    @IsOptional()
    @IsString({ message: 'State must be a string' })
    state?: string;

    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    country?: string;
}