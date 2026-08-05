import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;
}
