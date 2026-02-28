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

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;

    @IsOptional()
    @IsString()
    canonicalUrl?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    rentContent?: string;

    @IsOptional()
    @IsString()
    saleContent?: string;

    @IsOptional()
    @IsString()
    buyContent?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;
}