import { IsNotEmpty, IsMongoId, IsOptional, IsString } from "class-validator";
export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsMongoId()
    @IsOptional()
    parentId?: string;
    @IsString()
    slug?: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
