# Condaty Admin Web

Este es un proyecto de panel de administración construido con [Next.js](https://nextjs.org), diseñado para la gestión de encuestas dentro del ecosistema de Condaty.

## Alcance del Proyecto

### Funcionalidades Incluidas

-   **Autenticación Segura**: Implementación de un sistema de autenticación basado en JWT (JSON Web Tokens) con roles, utilizando cookies `HttpOnly` para mayor seguridad en el entorno web.
-   **Gestión de Encuestas**:
    -   **Creación**: Los administradores pueden crear nuevas encuestas.
    -   **Estados de Encuesta**: Las encuestas pueden tener los siguientes estados:
        -   `draft`: Borrador, no visible para los usuarios.
        -   `active`: Activa y disponible para ser respondida.
        -   `closed`: Cerrada, ya no acepta más respuestas.
    -   **Edición**: Modificación de encuestas existentes.
    -   **Cierre**: Posibilidad de cerrar una encuesta activa.
-   **Respuestas de Encuestas**:
    -   Los usuarios pueden responder a las encuestas activas.
    -   Visualización de resultados con gráficas para un análisis óptimo.

### Funcionalidades Excluidas

Para mantener el enfoque de esta versión, las siguientes funcionalidades no forman parte del alcance actual:

-   **Autenticación de Clientes/Guardias**: El login en esta plataforma está restringido a roles administrativos.
-   **Notificaciones en Tiempo Real**: No se implementarán notificaciones push ni WebSockets.
-   **Exportación de Datos**: No se incluye la funcionalidad para exportar resultados de encuestas a PDF u otros formatos.
-   **Bases de Datos Externas**: El proyecto no se conectará a bases de datos SQL o NoSQL; utiliza datos locales o simulados.
-   **Interceptores de Peticiones**: No se configurarán interceptores automáticos para inyectar cookies en todas las peticiones salientes.
-   **Permisos Granulares**: El manejo de permisos se limita a roles generales, sin un sistema de permisos detallado por acción.

## A Considerar

### Configuración del Entorno

Es crucial configurar las variables de entorno para el correcto funcionamiento de la autenticación.

1.  Crea un archivo `.env.local` en la raíz del proyecto.
2.  Añade la siguiente variable para definir el secreto del token JWT:

    ```env
    JWT_SECRET="tu_secreto_super_secreto_y_largo_aqui"
    ```

## Primeros Pasos (Getting Started)

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev