# Sistema web para la gestión y seguimiento de casos de adicciones

Aplicación web desarrollada para apoyar la gestión y seguimiento de casos relacionados con el consumo de sustancias psicoactivas.

El sistema permite registrar y consultar casos, realizar seguimientos, visualizar información e indicadores y gestionar el acceso de los usuarios según su rol.

## Tecnologías

- Angular 22
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient
- JWT

## Funcionalidades

- Inicio de sesión.
- Gestión de casos.
- Registro y consulta de información de los casos.
- Registro y consulta de seguimientos.
- Dashboard con información general.
- Reportes e indicadores.
- Gestión de usuarios.
- Control de acceso según el rol del usuario.

## Roles

### Administrador

Puede gestionar los usuarios y acceder a la información general del sistema, incluyendo casos, seguimientos y reportes.

### Profesional

Puede registrar y consultar sus casos, registrar seguimientos y acceder a la información correspondiente a los casos bajo su responsabilidad.

## Requisitos

Para ejecutar el proyecto localmente se necesita:

- Node.js
- npm
- Angular CLI

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/JEduardo7/sistema-de-adicciones-frontend.git
```

Ingresar a la carpeta del proyecto:

```bash
cd sistema-de-adicciones-frontend
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

Iniciar el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en:

```text
http://localhost:4200/
```

## Compilación

Para generar la versión de producción:

```bash
ng build
```

## Backend

Este frontend se comunica con una API REST desarrollada con Spring Boot.

Repositorio del backend:

https://github.com/JEduardo7/sistema-de-adicciones-backend

## Aplicación desplegada

Frontend:

https://sistema-de-adicciones.vercel.app/

## Documentación de la API

Swagger:

https://sistema-de-adicciones-api-rest.onrender.com/swagger-ui/index.html

## Curso

**Soluciones Web y Aplicaciones Distribuidas**

Facultad de Ingeniería  
Carrera de Ingeniería de Sistemas Computacionales

Cajamarca – Perú  
2026
