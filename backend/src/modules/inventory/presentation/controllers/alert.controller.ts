import { Controller, Get, Post, Query } from "@nestjs/common";
import { InventoryAlertsService } from "../../application/use-cases/inventory-alerts.service";

@Controller("alerts")
export class AlertController {
  constructor(private readonly inventoryAlertsService: InventoryAlertsService) {}

  @Get()
  listOpenAlerts() {
    return this.inventoryAlertsService.listOpenAlerts();
  }

  @Post("scan")
  scan(@Query("daysToExpire") daysToExpire?: string) {
    const days = Number(daysToExpire ?? "30");
    return this.inventoryAlertsService.scanForExpiringAndLowStock(days);
  }
}
