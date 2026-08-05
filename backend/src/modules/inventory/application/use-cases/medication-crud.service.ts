import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../shared/prisma/prisma.service";
import { CreateMedicationDto } from "../dto/create-medication.dto";
import { UpdateMedicationDto } from "../dto/update-medication.dto";
import { CreateBatchDto } from "../dto/create-batch.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class MedicationCrudService {
  constructor(private readonly prisma: PrismaService) {}

  async createMedication(dto: CreateMedicationDto) {
    try {
      return await this.prisma.medication.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("SKU duplicado");
      }
      throw error;
    }
  }

  async listMedications() {
    return this.prisma.medication.findMany({
      include: {
        batches: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateMedication(id: string, dto: UpdateMedicationDto) {
    const found = await this.prisma.medication.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException("Medicamento no encontrado");
    }

    try {
      return await this.prisma.medication.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("SKU duplicado");
      }
      throw error;
    }
  }

  async deleteMedication(id: string) {
    const found = await this.prisma.medication.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException("Medicamento no encontrado");
    }

    await this.prisma.medication.delete({ where: { id } });
    return { deleted: true };
  }

  async createBatch(dto: CreateBatchDto) {
    try {
      return await this.prisma.inventoryBatch.create({
        data: {
          medicationId: dto.medicationId,
          lot: dto.lot,
          expirationDate: new Date(dto.expirationDate),
          stockCurrent: dto.stockCurrent,
          stockMin: dto.stockMin,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("El lote ya existe para el medicamento");
      }
      throw error;
    }
  }
}
