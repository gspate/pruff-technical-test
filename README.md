# Pruff - Technical Test (Plataforma Inmobiliaria)

Este es un portal inmobiliario construido con **Next.js 16 (App Router)**, **Tailwind CSS**, y **Prisma 7 (PostgreSQL)**, enfocado en el scraping de propiedades de portales externos.

## ¿Cómo levantar el servidor en local?

Tienes dos formas de probar este proyecto: utilizando Docker para levantar todo en un solo comando (ideal para ver cómo correría en producción), o levantando el entorno de desarrollo local paso a paso.

### Opción 1: Todo mediante Docker (Recomendado)

Si tienes Docker y Docker Compose instalados, puedes levantar toda la infraestructura (Base de Datos + Aplicación) con un solo comando.

1. **Abre la terminal en la raíz del proyecto.**
2. **Ejecuta el siguiente comando:**
   ```bash
   docker compose up --build
   ```
3. Docker descargará la imagen de PostgreSQL 15, instalará las dependencias de la app, generará el build standalone de Next.js y levantará todo.
4. **Visita la aplicación:** Abre tu navegador en `http://localhost:3000`.
5. *(Opcional)* Si necesitas sembrar el usuario inicial mientras corre en Docker, puedes abrir otra terminal y ejecutar:
   ```bash
   docker compose exec app npx prisma db push
   docker compose exec app npx prisma db seed
   ```

### Opción 2: Modo Desarrollo (Next.js Local + DB en Docker)

Si vas a hacer cambios en el código y necesitas *Hot Reloading*, esta es la mejor opción.

1. **Clona o renombra el archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```
2. **Levanta únicamente la base de datos** usando Docker Compose:
   ```bash
   docker compose up postgres -d
   ```
3. **Instala las dependencias** de Node.js:
   ```bash
   npm install
   ```
4. **Sincroniza el esquema de Prisma y siembra el usuario inicial:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
6. **Visita la aplicación:** Abre tu navegador en `http://localhost:3000`.

---

## Usuarios de Prueba
Al ejecutar el comando `npx prisma db seed`, se creará automáticamente la siguiente cuenta para que puedas iniciar sesión de inmediato y probar las funcionalidades de autenticación y búsquedas:

- **Email:** `test@pruff.com`
- **Contraseña:** `password123`

---

## Despliegue a Producción (AWS Serverless + Terraform)

La arquitectura de producción está diseñada bajo el modelo **Infrastructure as Code (IaC)** utilizando Terraform. El diseño es altamente optimizado para minimizar costos y maximizar la seguridad (Zero Trust).

### Arquitectura de Despliegue
- **Cómputo:** Contenedores en **AWS ECS Fargate** (Serverless).
- **Base de Datos:** **Amazon RDS PostgreSQL** (Graviton, en subredes privadas).
- **Redes y Seguridad (Zero Trust):** En lugar de utilizar un Application Load Balancer (ALB) y un NAT Gateway costosos, el contenedor incluye un sidecar de **Cloudflare Tunnel (`cloudflared`)**. Esto permite exponer la aplicación al internet público (ej. `app.tudominio.com`) sin abrir puertos entrantes (Ingress 0.0.0.0/0 cerrado), encriptando el tráfico de extremo a extremo.
- **Cronjobs Automatizados:** **AWS EventBridge Scheduler** está configurado para llamar directamente a la API a través del túnel a las 08:00 AM hora de Chile para generar los reportes diarios.

### Pasos para Desplegar

La carpeta `terraform/` contiene todos los módulos necesarios (`networking`, `database`, `compute`, `events`).

1. **Crear el Repositorio de Imágenes (ECR):**
   ```bash
   cd terraform
   terraform init
   terraform apply -target="module.compute.aws_ecr_repository.app"
   ```

2. **Subir la Imagen de Docker:**
   Para facilitar el proceso de compilación transversal (hacia la arquitectura `linux/amd64` requerida por Fargate) y la subida a ECR, existe un script automatizado. Estando en la carpeta `terraform/`, ejecuta:
   ```bash
   ./deploy-image.sh
   ```

3. **Lanzar la Infraestructura (Fargate, RDS, Redes, Eventos):**
   Al igual que en el paso anterior, hay un script automatizado que se encarga de leer tus claves secretas desde el archivo `.env` e inyectarlas en Terraform para encender los servidores.
   ```bash
   ./deploy-infrastructure.sh
   ```
   *Nota: Terraform levantará la base de datos vacía, pero el `start.sh` dentro del contenedor se encargará automáticamente de ejecutar `npx prisma db push` antes de iniciar el servidor web. La conexión Zero Trust con Cloudflare y el Cronjob de EventBridge se auto-configurarán por ti.*

4. **Destruir la Infraestructura (Ahorro de Costos):**
   Dado que este es un proyecto de prueba técnica, es importante no mantener recursos ociosos generando cobros en AWS. Para apagar y eliminar de forma segura toda la base de datos, contenedores y redes, ejecuta el script de destrucción.
   ```bash
   ./destroy-infrastructure.sh
   ```
   *Nota: Esto eliminará permanentemente la base de datos de producción y bajará el sistema.*
