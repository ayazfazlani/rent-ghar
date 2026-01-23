import { IsOptional, IsString, IsMongoId } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId()
    @IsOptional()
    parentId?: string;
}

