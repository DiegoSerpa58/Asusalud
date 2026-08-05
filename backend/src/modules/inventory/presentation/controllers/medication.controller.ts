import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { MedicationCrudService } from "../../application/use-cases/medication-crud.service";
import { CreateMedicationDto } from "../../application/dto/create-medication.dto";
import { UpdateMedicationDto } from "../../application/dto/update-medication.dto";
import { CreateBatchDto } from "../../application/dto/create-batch.dto";

@Controller("medications")
export class MedicationController {
  constructor(private readonly medicationCrudService: MedicationCrudService) {}

  @Post()
  createMedication(@Body() dto: CreateMedicationDto) {
    return this.medicationCrudService.createMedication(dto);
  }

  @Get()
  listMedications() {
    return this.medicationCrudService.listMedications();
  }

  @Patch(":id")
  updateMedication(@Param("id") id: string, @Body() dto: UpdateMedicationDto) {
    return this.medicationCrudService.updateMedication(id, dto);
  }

  @Delete(":id")
  deleteMedication(@Param("id") id: string) {
    return this.medicationCrudService.deleteMedication(id);
  }

  @Post("batches")
  createBatch(@Body() dto: CreateBatchDto) {
    return this.medicationCrudService.createBatch(dto);
  }
}
