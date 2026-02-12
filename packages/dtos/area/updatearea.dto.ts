import { IsOptional, IsString, IsMongoId } from "class-validator";

export class UpdateAreaDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsMongoId()
    city?: string; // City ID

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
}
