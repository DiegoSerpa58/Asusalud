import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class InventoryEntryDto {
  @IsUUID()
  batchId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsUUID()
  idempotencyKey?: string;
}
