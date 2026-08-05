# Asusalud - Gestión de Inventario de Farmacia

Aplicación web full-stack orientada a consistencia fuerte para control de inventario farmacéutico.

## Principios de diseño

- **CAP:** prioridad **CP** (Consistencia + Tolerancia a Particiones).
- **BD:** PostgreSQL con transacciones ACID y bloqueo pesimista para evitar sobregiros.
- **Arquitectura:** Monolito Modular con enfoque Clean Architecture.
- **Movimiento inmutable:** `inventory_movement` con trigger de bloqueo de `UPDATE/DELETE`.

## Stack

- **Frontend:** Next.js + TypeScript + Tailwind + Zustand
- **Backend:** NestJS + TypeScript + Prisma
- **Infra:** Docker + Docker Compose + PostgreSQL

## Estructura

```txt
backend/
  prisma/
  src/
    modules/
      inventory/
        application/
        presentation/
    shared/
frontend/
  src/
    app/
    features/
      inventory/
    shared/
docker-compose.yml
```

## 🚀 Cómo iniciar el proyecto en local

Sigue estos pasos para ejecutar el proyecto localmente (frontend y backend en terminales separadas).

### 1) Clonar el repositorio
```bash
git clone https://github.com/DiegoSerpa58/Asusalud.git
cd Asusalud
```

### 2) Instalar dependencias
> Si el proyecto está dividido en carpetas `frontend` y `backend`, instala en cada una:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3) Configurar variables de entorno
Si existen archivos de ejemplo, crea tus `.env`:

```bash
# En frontend (si aplica)
cp .env.example .env

# En backend (si aplica)
cp .env.example .env
```

Edita los `.env` con tus valores (puerto, base de datos, llaves, etc.).

### 4) Iniciar el frontend (Terminal 1)
```bash
cd frontend
npm run dev
```

### 5) Iniciar el backend (Terminal 2)
```bash
cd backend
npm run dev
```

### 6) Verificar que esté corriendo
- Frontend: abre `http://localhost:3000` o el puerto que muestre la terminal.
- Backend: revisa en terminal el puerto/API (ej: `http://localhost:4000`).

---

## 🛠️ Comandos alternativos (si `npm run dev` no existe)

En algunos proyectos los scripts cambian. Prueba:

```bash
npm start
# o
npm run start:dev
```

Puedes revisar los scripts disponibles con:

```bash
npm run
```


## Ejecución con Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`

## Endpoints principales

- `POST /api/medications`
- `GET /api/medications`
- `PATCH /api/medications/:id`
- `DELETE /api/medications/:id`
- `POST /api/medications/batches`
- `POST /api/inventory/entries` (entrada con transacción + lock)
- `GET /api/alerts`
- `POST /api/alerts/scan?daysToExpire=30`

## Concurrencia de stock

En `POST /api/inventory/entries`, el backend ejecuta:

1. Validación de idempotencia (`idempotency_key`).
2. `SELECT ... FOR UPDATE` sobre el lote.
3. Re-cálculo y actualización de stock dentro de la misma transacción.
4. Registro append-only del movimiento.

Si hay conflicto, se aborta la transacción y no se persisten cambios parciales.

## Registro de progreso (2026-08-04)
Hoy se realizaron cambios y funciones para avanzar la interfaz y la integración frontend↔backend:

- Backend: habilitado CORS en backend/src/main.ts para permitir peticiones desde http://localhost:3000.
- Frontend (Next.js): añadido cliente HTTP y funciones en frontend/src/features/inventory/api/index.ts: fetchMedications, createMedication, createBatch, updateMedication, deleteMedication.
- Estado (Zustand): actualizado store en frontend/src/features/inventory/store/inventory.store.ts para cargar medicamentos (meds) y mapear lotes a items mostrables.
- UI: en frontend/src/app/inventory/page.tsx se añadieron:
  - Carga automática de medicamentos y lotes.
  - Formularios para crear medicamentos y lotes.
  - Edición y eliminación de medicamentos (formulario de edición y botones de acciones).
- Operaciones realizadas en el entorno de trabajo: los archivos modificados fueron guardados localmente. Se creó y posteriormente eliminó un repositorio Git local según preferencia del autor; los cambios permanecen en los archivos del proyecto.

### Cómo continuar
- Levantar servicios (Postgres, backend y frontend) y probar la UI en http://localhost:3000.
- Próximo objetivo sugerido: CRUD de lotes (editar/eliminar) y mejor manejo de errores/UI (toasts/modales).

(Actualizar este registro por cada sesión para mantener un historial de avances.)
