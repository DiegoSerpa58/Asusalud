import { Module } from "@nestjs/common";
import { InventoryModule } from "./modules/inventory/inventory.module";

@Module({
  imports: [InventoryModule],
})
export class AppModule {}
