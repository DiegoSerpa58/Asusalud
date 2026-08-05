import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../shared/prisma/prisma.service";

@Injectable()
export class InventoryAlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async scanForExpiringAndLowStock(daysToExpire = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysToExpire);

    const lowStockBatches = await this.prisma.$queryRaw<
      Array<{ id: string; lot: string; stock_current: number }>
    >`
      SELECT id, lot, stock_current
      FROM inventory_batch
      WHERE stock_current <= stock_min
    `;

    const expiringBatches = await this.prisma.inventoryBatch.findMany({
      where: {
        expirationDate: {
          lte: thresholdDate,
        },
      },
      select: {
        id: true,
        lot: true,
        expirationDate: true,
      },
    });

    for (const batch of lowStockBatches) {
      const existing = await this.prisma.inventoryAlert.findFirst({
        where: {
          batchId: batch.id,
          type: "LOW_STOCK",
          isResolved: false,
        },
      });

      if (!existing) {
        await this.prisma.inventoryAlert.create({
          data: {
            batchId: batch.id,
            type: "LOW_STOCK",
            message: `Stock bajo en lote ${batch.lot}. Actual: ${batch.stock_current}`,
          },
        });
      }
    }

    for (const batch of expiringBatches) {
      const isExpired = batch.expirationDate < new Date();
      const type = isExpired ? "EXPIRED" : "EXPIRING_SOON";
      const existing = await this.prisma.inventoryAlert.findFirst({
        where: {
          batchId: batch.id,
          type,
          isResolved: false,
        },
      });

      if (!existing) {
        await this.prisma.inventoryAlert.create({
          data: {
            batchId: batch.id,
            type,
            message: isExpired
              ? `Lote ${batch.lot} vencido`
              : `Lote ${batch.lot} próximo a vencer`,
          },
        });
      }
    }

    return { scanned: lowStockBatches.length + expiringBatches.length };
  }

  async listOpenAlerts() {
    return this.prisma.inventoryAlert.findMany({
      where: {
        isResolved: false,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
