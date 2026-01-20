import { IsNotEmpty, IsString, isNotEmpty } from "class-validator";

export class CreateCityDto {
    @IsNotEmpty()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    state: string;

    @IsNotEmpty()
    country: string;

    
}