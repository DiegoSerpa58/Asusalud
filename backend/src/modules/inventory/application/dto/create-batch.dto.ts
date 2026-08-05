import { IsDateString, IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from "class-validator";

export class CreateBatchDto {
  @IsUUID()
  medicationId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  lot!: string;

  @IsDateString()
  expirationDate!: string;

  @IsInt()
  @Min(0)
  stockCurrent!: number;

  @IsInt()
  @Min(0)
  stockMin!: number;
}
