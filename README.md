# 💊 Asusalud — Sistema de Gestión de Inventario Farmacéutico

Aplicación web **Full Stack** desarrollada para la gestión de inventario farmacéutico, diseñada bajo principios de **consistencia fuerte**, trazabilidad e integridad de los datos.

El sistema garantiza un manejo seguro del stock mediante transacciones ACID, bloqueo pesimista y un historial inmutable de movimientos de inventario.

---

# 📌 Características principales

- Gestión completa de medicamentos.
- Administración de lotes por medicamento.
- Registro de entradas de inventario mediante transacciones.
- Historial de movimientos **Append-Only**.
- Alertas de vencimiento de medicamentos.
- Arquitectura preparada para operaciones concurrentes.
- API REST desarrollada con NestJS.
- Frontend moderno construido con Next.js.

---

# 🏗 Arquitectura

El proyecto sigue una arquitectura **Monolito Modular** basada en principios de **Clean Architecture**, permitiendo una clara separación de responsabilidades y facilitando el crecimiento del sistema.

```text
Frontend (Next.js)
        │
        ▼
 REST API (NestJS)
        │
        ▼
 Application Layer
        │
        ▼
 Domain
        │
        ▼
 Infrastructure
        │
        ▼
 PostgreSQL
```

---

# ⚙ Principios de Diseño

## Modelo CAP

El sistema prioriza el modelo **CP (Consistency + Partition Tolerance)**.

Esto significa que, ante escenarios de concurrencia o fallos de red, la prioridad siempre será mantener la consistencia del inventario, incluso si temporalmente se sacrifica la disponibilidad.

## Consistencia del Inventario

Cada operación que modifica existencias se ejecuta mediante:

- Transacciones ACID.
- Bloqueo pesimista (`SELECT ... FOR UPDATE`).
- Validación por clave de idempotencia.
- Registro inmutable del movimiento realizado.

Con este enfoque se evita:

- Sobregiros de inventario.
- Condiciones de carrera.
- Duplicidad de operaciones.
- Estados inconsistentes.

---

# 🛠 Stack Tecnológico

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand

## Backend

- NestJS
- TypeScript
- Prisma ORM

## Base de Datos

- PostgreSQL

## Infraestructura

- Docker
- Docker Compose

---

# 📁 Estructura del Proyecto

```text
Asusalud/
│
├── backend/
│   ├── prisma/
│   └── src/
│       ├── modules/
│       │   └── inventory/
│       │       ├── application/
│       │       ├── domain/
│       │       ├── infrastructure/
│       │       └── presentation/
│       └── shared/
│
├── frontend/
│   └── src/
│       ├── app/
│       ├── features/
│       │   └── inventory/
│       └── shared/
│
└── docker-compose.yml
```

---

# 🚀 Ejecución Local

## 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoSerpa58/Asusalud.git
cd Asusalud
```

## 2. Instalar dependencias

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

## 3. Configurar variables de entorno

Si existen archivos de ejemplo, crea los archivos `.env`.

```bash
cp .env.example .env
```

Configura las variables correspondientes a:

- Base de datos.
- Puerto.
- URL del backend.
- Variables adicionales del proyecto.

## 4. Ejecutar el Backend

```bash
cd backend
npm run dev
```

Si el script no existe:

```bash
npm run start:dev
```

## 5. Ejecutar el Frontend

```bash
cd frontend
npm run dev
```

## 6. Acceder a la aplicación

| Servicio | URL |
| --------- | -------------------------- |
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001/api |

---

# 🐳 Ejecución con Docker

```bash
docker compose up --build
```

| Servicio | URL |
| --------- | -------------------------- |
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001/api |

---

# 📡 API REST

## Medicamentos

| Método | Endpoint |
| ------ | -------------------------- |
| POST | `/api/medications` |
| GET | `/api/medications` |
| PATCH | `/api/medications/:id` |
| DELETE | `/api/medications/:id` |

## Lotes

| Método | Endpoint |
| ------ | -------------------------- |
| POST | `/api/medications/batches` |

## Inventario

| Método | Endpoint |
| ------ | -------------------------- |
| POST | `/api/inventory/entries` |

## Alertas

| Método | Endpoint |
| ------ | ---------------------------------------- |
| GET | `/api/alerts` |
| POST | `/api/alerts/scan?daysToExpire=30` |

---

# 🔒 Control de Concurrencia

El endpoint `POST /api/inventory/entries` implementa un flujo transaccional para garantizar la consistencia de los datos.

Proceso ejecutado:

1. Validación de la clave de idempotencia.
2. Inicio de la transacción.
3. Bloqueo del lote mediante `SELECT ... FOR UPDATE`.
4. Recalculo del stock.
5. Actualización del inventario.
6. Registro del movimiento en `inventory_movement`.
7. Confirmación (`COMMIT`) de la transacción.

Si ocurre un error:

- Se ejecuta un `ROLLBACK`.
- No se almacenan cambios parciales.
- Se preserva la consistencia del inventario.

---

# 🛡 Inmutabilidad de Movimientos

La tabla `inventory_movement` implementa el patrón **Append-Only**.

Esto significa que:

- Los registros nunca se actualizan.
- Los registros nunca se eliminan.
- Cada operación queda registrada permanentemente.

Un trigger en PostgreSQL bloquea cualquier intento de:

- `UPDATE`
- `DELETE`

garantizando la trazabilidad completa del inventario.

---

# 📅 Registro de Avances

## 2026-08-04

### Backend

- Configuración de CORS para permitir solicitudes desde `http://localhost:3000`.
- Integración entre frontend y backend.

### Frontend

- Implementación del cliente HTTP.
- Funciones para:
  - Obtener medicamentos.
  - Crear medicamentos.
  - Actualizar medicamentos.
  - Eliminar medicamentos.
  - Crear lotes.
- Integración del estado global mediante Zustand.
- Carga automática de medicamentos y lotes.
- Formularios para creación y edición.
- Acciones para actualización y eliminación de registros.

---

# 🚧 Próximas Mejoras
- CRUD completo de lotes.
- Registro de salidas de inventario.
- Dashboard con métricas.
- Búsqueda y filtros avanzados.
- Toasts para notificaciones.
- Modales de confirmación.
- Pruebas unitarias.
- Pruebas de integración.
- Autenticación y autorización por roles.

---

# 👨‍💻 Autor

**Diego Andrés Serpa**

Proyecto desarrollado como parte del aprendizaje y fortalecimiento de competencias en desarrollo Full Stack, arquitectura de software, concurrencia, transacciones ACID y gestión de inventarios farmacéuticos.