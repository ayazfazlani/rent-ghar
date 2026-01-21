import { IsOptional, IsString } from "class-validator";

export class UpdateCityDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;
}