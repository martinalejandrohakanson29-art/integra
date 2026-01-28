# Integra - Sistema de Gestión Odontológica

Sistema de gestión para clínica odontológica "Integra". Desarrollado con Vite + React + Tailwind CSS.

## Instalación

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Iniciar servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Scripts

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Compila la aplicación para producción.
-   `npm run preview`: Previsualiza la build de producción.

## Despliegue en GitHub

1.  Inicializar repositorio git:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Crear repositorio en GitHub.
3.  Vincular y subir:
    ```bash
    git remote add origin <URL_DEL_REPO>
    git push -u origin main
    ```

## Despliegue en Railway

1.  Crear cuenta en Railway.
2.  Nuevo Proyecto -> "Deploy from GitHub repo".
3.  Seleccionar el repositorio de Integra.
4.  Railway detectará automáticamente que es un proyecto Vite.
5.  El comando de build será `npm run build` y el directorio de salida `dist`.
6.  ¡Listo!

## Estructura

-   `src/components`: Componentes reutilizables (Sidebar, DarkModeToggle).
-   `src/pages`: Pantallas principales de la aplicación.
