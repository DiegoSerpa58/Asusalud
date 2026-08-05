import { Module } from "@nestjs/common";
import { InventoryController } from "./presentation/controllers/inventory.controller";
import { RegisterInventoryEntryService } from "./application/use-cases/register-inventory-entry.service";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { MedicationController } from "./presentation/controllers/medication.controller";
import { MedicationCrudService } from "./application/use-cases/medication-crud.service";
import { AlertController } from "./presentation/controllers/alert.controller";
import { InventoryAlertsService } from "./application/use-cases/inventory-alerts.service";

@Module({
  controllers: [InventoryController, MedicationController, AlertController],
  providers: [
    RegisterInventoryEntryService,
    MedicationCrudService,
    InventoryAlertsService,
    PrismaService,
  ],
})
export class InventoryModule {}
