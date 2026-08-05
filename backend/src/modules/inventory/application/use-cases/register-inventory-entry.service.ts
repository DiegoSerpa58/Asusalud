import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../shared/prisma/prisma.service";
import { InventoryEntryDto } from "../dto/inventory-entry.dto";

@Injectable()
export class RegisterInventoryEntryService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: InventoryEntryDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.idempotencyKey) {
        const duplicated = await tx.inventoryMovement.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
        });
        if (duplicated) {
          return duplicated;
        }
      }

      await tx.$executeRaw`
        SELECT id
        FROM inventory_batch
        WHERE id = ${dto.batchId}::uuid
        FOR UPDATE
      `;

      const batch = await tx.inventoryBatch.findUnique({
        where: { id: dto.batchId },
      });

      if (!batch) {
        throw new NotFoundException("Lote no encontrado");
      }

      const newStock = batch.stockCurrent + dto.quantity;
      if (newStock < 0) {
        throw new ConflictException("Stock inválido tras la entrada");
      }

      const updatedBatch = await tx.inventoryBatch.update({
        where: { id: dto.batchId },
        data: {
          stockCurrent: newStock,
          version: {
            increment: 1,
          },
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          batchId: dto.batchId,
          type: "ENTRY",
          quantity: dto.quantity,
          reason: dto.reason ?? "Abastecimiento",
          balanceAfter: updatedBatch.stockCurrent,
          idempotencyKey: dto.idempotencyKey,
          createdBy: userId,
        },
      });

      if (updatedBatch.stockCurrent <= updatedBatch.stockMin) {
        await tx.inventoryAlert.create({
          data: {
            batchId: dto.batchId,
            type: "LOW_STOCK",
            message: `Stock bajo en lote ${updatedBatch.lot}. Actual: ${updatedBatch.stockCurrent}`,
          },
        });
      }

      return movement;
    });
  }
}
