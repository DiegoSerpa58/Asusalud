import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  sku!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;
}
