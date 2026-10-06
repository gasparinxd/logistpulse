# LogistPulse

Gestión de pedidos y logística — esqueleto ejecutable del **Sprint 1**.

- **Backend:** Node.js + Express (API REST, patrón MVC)
- **Frontend:** React + Vite (patrón MVC con hooks), servido por Nginx
- **Base de datos:** PostgreSQL 16 con volumen persistente
- **Orquestación:** Docker Compose

---

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose v2
- (Opcional, para desarrollo local sin Docker) Node.js 20+

## Levantar el entorno

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu-usuario>/logistpulse.git
cd logistpulse

# 2. Crear el archivo de entorno a partir de la plantilla y editar las credenciales
cp .env.example .env

# 3. Construir y levantar todos los servicios
docker compose up --build -d

# 4. Comprobar que todo está sano
docker compose ps
curl http://localhost:3001/health
```

| Servicio   | URL                            |
|------------|--------------------------------|
| Frontend   | http://localhost:8081          |
| Backend    | http://localhost:3001          |
| Health     | http://localhost:3001/health   |
| PostgreSQL | interno a la red de Docker (`db:5432`) |

> Los puertos por defecto (3001/8081) se pueden cambiar en `.env`.

### Orden de arranque

1. `db` tiene un `healthcheck` con `pg_isready`; `backend` usa `depends_on: condition: service_healthy`.
2. El backend además reintenta la conexión a PostgreSQL antes de abrir el puerto HTTP.
3. `frontend` espera a que el backend responda en `/health`.

### Persistencia de datos

Los datos de PostgreSQL se guardan en el volumen con nombre `pgdata`, por lo que sobreviven a `docker compose down` y a la recreación de contenedores. Para borrarlos por completo: `docker compose down -v`.

### Comandos Docker útiles

```bash
docker compose up --build -d      # construir y levantar en segundo plano
docker compose ps                 # estado de los contenedores (y su salud)
docker compose logs -f backend    # ver logs del backend
docker compose down               # detener los servicios (conserva los datos)
docker compose down -v            # detener y borrar el volumen de la base de datos
docker compose exec db psql -U logistpulse -d logistpulse   # consola SQL
```

## API

| Método | Ruta               | Descripción                    | Respuesta |
|--------|--------------------|--------------------------------|-----------|
| GET    | `/health`          | Estado de la API y de la BD    | `200 OK`  |
| POST   | `/api/pedidos`     | Crea un pedido                 | `201 Created` / `400 Bad Request` |
| GET    | `/api/pedidos`     | Lista los pedidos              | `200 OK`  |
| GET    | `/api/pedidos/:id` | Obtiene un pedido por id       | `200 OK` / `404 Not Found` |

### Ejemplos

```bash
curl -i http://localhost:3001/health

curl -i -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Ferretería Sur","producto":"Caja de tornillos","cantidad":20,"direccionDestino":"Av. Siempre Viva 742"}'

curl http://localhost:3001/api/pedidos
```

Respuesta de `POST /api/pedidos`:

```json
{
  "id": 1,
  "cliente": "Ferretería Sur",
  "producto": "Caja de tornillos",
  "cantidad": 20,
  "direccionDestino": "Av. Siempre Viva 742",
  "estado": "PENDIENTE",
  "creadoEn": "2026-10-05T12:00:00.000Z"
}
```

## Arquitectura MVC

```
logistpulse/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── server.js               # arranque: espera a la BD, crea tablas, abre el puerto
│       ├── app.js                  # configuración de Express y registro de rutas
│       ├── config/db.js            # pool de PostgreSQL + reintentos de conexión
│       ├── models/pedidoModel.js   # MODELO: tabla `pedidos`, validación y consultas SQL
│       ├── views/pedidoView.js     # VISTA: formato JSON de salida de un pedido
│       ├── controllers/            # CONTROLADOR: lógica de cada petición HTTP
│       │   ├── healthController.js
│       │   └── pedidoController.js
│       └── routes/                 # mapeo URL → controlador
│           ├── healthRoutes.js
│           └── pedidoRoutes.js
└── frontend/
    ├── Dockerfile                  # build con Vite + servido con Nginx
    ├── nginx.conf                  # proxy de /api y /health hacia el backend
    └── src/
        ├── models/pedidoModel.js               # MODELO: llamadas a la API REST
        ├── controllers/usePedidosController.js # CONTROLADOR: estado y acciones (hook)
        ├── views/                              # VISTA: componentes de presentación
        │   ├── HealthBadge.jsx
        │   ├── PedidoForm.jsx
        │   └── PedidoList.jsx
        └── App.jsx                             # compone controlador + vistas
```

**Backend.** `POST /api/pedidos` entra por `routes/pedidoRoutes.js` → `controllers/pedidoController.js`, que valida y persiste a través de `models/pedidoModel.js` (único lugar con SQL) y responde con el formato definido en `views/pedidoView.js`.

**Frontend.** Los componentes de `views/` solo reciben props y renderizan; el hook `usePedidosController` gestiona el estado y las acciones, y delega las llamadas HTTP en `models/pedidoModel.js`.

## Desarrollo local sin Docker

```bash
# Backend (requiere un PostgreSQL accesible)
cd backend
npm install
DB_HOST=localhost DB_USER=logistpulse DB_PASSWORD=... DB_NAME=logistpulse PORT=3001 npm run dev

# Frontend (otra terminal). Vite redirige /api y /health a localhost:3001
cd frontend
npm install
npm run dev     # http://localhost:5174
```

## Variables de entorno

Ver [`.env.example`](.env.example). El archivo `.env` real está en `.gitignore` y **nunca** debe subirse al repositorio.
