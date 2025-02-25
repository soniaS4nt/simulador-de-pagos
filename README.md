# Simulador de Pagos con Tarjetas 💳

Simulador de pagos desarrollado en un monorepo con **Next.js** y el backend con **NestJS**, utilizando Firebase/Firestore como base de datos.

## Tabla de Contenidos

- [Características](#características-)
- [Tecnologías Utilizadas](#tecnologías-utilizadas-️)
- [Estructura del Monorepo](#estructura-del-monorepo-)
- [Prerrequisitos](#prerrequisitos-)
- [Configuración de Firebase](#configuración-de-firebase-)
- [Instalación](#instalación-️)

## Características 🚀 

- Simulación de pagos con tarjetas 
- Interfaz intuitiva y fácil de usar.
- Validación de datos de pago.
- Integración con un backend robusto en NestJS.

## Tecnologías Utilizadas 🛠️ 

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [NestJS](https://nestjs.com/)
- **Base de Datos**: [Firestore Database](https://firebase.google.com/) 
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) 
- **Gestión de Paquetes**: [pnpm](https://pnpm.io/)

## Estructura del Monorepo ✨

Este proyecto está organizado como un **monorepo**, lo que significa que tanto el frontend como el backend se encuentran en la misma estructura de repositorio. Esto facilita la gestión de dependencias y la colaboración entre diferentes partes de la aplicación.

## Prerrequisitos 🧐

- Node.js (v18+)
- pnpm
- Cuenta de Firebase

## Configuración de Firebase 🔑 

1️⃣ Ve a [Firebase Console](https://console.firebase.google.com/)
2️⃣ Crea un proyecto o selecciona uno existente
3️⃣ En ⚙️ Configuración del proyecto > Cuentas de servicio:
   - Selecciona Node.js
   - Genera nueva clave privada
   - Guarda el archivo JSON generado
4️⃣ Utiliza los datos del archivo para configurar tus variables de entorno

## Instalación ⚙️

Sigue estos pasos para configurar el proyecto en tu máquina local:

1️⃣ Descomprime el archivo ZIP

2️⃣ Instala las dependencias

```bash
pnpm install
```

3️⃣ Configura las variables de entorno

Renombra el archivo .env.example a .env 
Completa con tus credenciales de Firebase ([Configuración de Firebase](#Configuración)):

📄 .env para la API (Nest.js):
```bash
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-Clave-Privada\n-----END PRIVATE KEY-----\n"
```

4️⃣ Ejecuta el proyecto en modo desarrollo

```bash
pnpm run dev
```

🏃‍♂️ Ejecución

✅ Frontend: http://localhost:3000
🔄 Backend: http://localhost:4000
📄 Swagger: http://localhost:4000/api



