import { IsNotEmpty, IsString, IsMongoId } from "class-validator";

export class CreateAreaDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsMongoId()
    city: string; // City ID
}
