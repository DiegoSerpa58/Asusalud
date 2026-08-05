import { Body, Controller, Headers, Post } from "@nestjs/common";
import { InventoryEntryDto } from "../../application/dto/inventory-entry.dto";
import { RegisterInventoryEntryService } from "../../application/use-cases/register-inventory-entry.service";

@Controller("inventory")
export class InventoryController {
  constructor(
    private readonly registerInventoryEntryService: RegisterInventoryEntryService,
  ) {}

  @Post("entries")
  async createEntry(
    @Body() dto: InventoryEntryDto,
    @Headers("x-user-id") userId?: string,
  ) {
    return this.registerInventoryEntryService.execute(
      dto,
      userId ?? "00000000-0000-0000-0000-000000000001",
    );
  }
}
