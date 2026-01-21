import { IsOptional, IsString, IsMongoId } from "class-validator";

export class UpdateAreaDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsMongoId()
    city?: string; // City ID
}
