# VCM Cencosud — Sistema de Mapa de Calor de Tránsito en Tienda

Proyecto universitario Solemne 2 — Interfaz Frontend del sistema VCM ambientado
en supermercados Cencosud (Jumbo). Visualiza la intensidad de tránsito de clientes
por zona (caliente / templada / fría) para optimizar layout y exhibiciones.

---

## Stack tecnológico

- **React 18** + Vite 5
- **React Router DOM v6** — SPA con rutas `/`, `/contacto`, `/mapa`, `/zonas`, `/reportes`
- **SCSS modular** — partials: `_variables.scss`, `_mixins.scss`, `_reset.scss`, `_layout.scss`
- **HTML5 semántico** — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- **CSS Grid** — layout principal (header / body / footer)
- **Flexbox** — menú de navegación y elementos internos
- Responsive: Móvil (`<768px`), Tablet (`768–1023px`), Escritorio (`>1024px`)
- Accesibilidad WCAG 2.1 AA

---

## Instalación y ejecución

```bash
# 1. Descomprimir y entrar al proyecto
unzip vcm-cencosud.zip
cd vcm-cencosud

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── MenuNav/          # <MenuNav links={[]} />  — Flexbox, hamburger móvil
│   └── Mensaje/          # <Mensaje tipo="exito|error" texto="..." />
├── pages/
│   ├── Homepage/         # Ruta /  — hero, estadísticas, ranking, alertas
│   └── Contacto/         # Ruta /contacto — formulario controlado con useState
├── data/
│   └── zonas.js          # 10 zonas estáticas + ESTADISTICAS (sin API)
└── styles/
    ├── main.scss          # Entry point SCSS
    └── partials/
        ├── _variables.scss   # Paleta Cencosud + colores de calor (rojo/ámbar/azul)
        ├── _mixins.scss      # Botones, cards, inputs, media queries, badges
        ├── _reset.scss       # Reset + base
        └── _layout.scss      # CSS Grid app-wrapper, header, aside, footer
```

---

## Rutas

| Ruta         | Componente  | Estado         |
|--------------|-------------|----------------|
| `/`          | Homepage    | ✅ Avance 1    |
| `/contacto`  | Contacto    | ✅ Avance 1    |
| `/mapa`      | —           | 🔜 Avance 2    |
| `/zonas`     | —           | 🔜 Avance 2    |
| `/reportes`  | —           | 🔜 Avance 2    |

---

## Componentes

### `<MenuNav links={[]} />`
Recibe un array `{ label, path }[]`. Flexbox horizontal en desktop, menú vertical
desplegable (hamburguesa) en móvil.

### `<Mensaje tipo="exito|error" texto="..." onCerrar={fn} />`
Muestra confirmación verde (Cencosud verde) o error rojo (Cencosud rojo).
Accesible con `role="alert|status"` y `aria-live`.

---

## Variables SCSS de zonas

```scss
$zona-caliente: #E3000F;  // Rojo Cencosud — alto tránsito
$zona-templada: #F59E0B;  // Ámbar — tránsito medio
$zona-fria:     #3B82F6;  // Azul — bajo tránsito ("invisible")
```

# VCM Cencosud - Frontend (Mapa de Calor) 

Interfaz de usuario para el sistema de visualización de métricas de tráfico en las sucursales de Cencosud. Desarrollado con React y Vite, este frontend consume datos dinámicos desde nuestra API REST en Django para renderizar los mapas de calor y la tabla de gestión de zonas.

## Tecnologías Utilizadas
* **React** (Hooks: useState, useEffect)
* **Vite** (Build tool)
* **Sass** (Estilos y arquitectura CSS)
* **Fetch API** (Consumo de datos del backend)

## Guía de Instalación y Ejecución

**Importante:** Antes de levantar este frontend, asegúrate de tener el servidor Backend de Django corriendo en el puerto `8000` para que la conexión de datos funcione correctamente.

### 1. Clonar el repositorio e ingresar a la carpeta
git clone <URL_DEL_REPOSITORIO>
cd solemne2_Aplicaciones

### 2. instalar dependencias de Node en terminal
npm install

### 3. Levantar el servidor de desarrollo 
npm run dev

### 4. Arquitectura de integracion 
En esta fase del proyecto (Solemne 3), la vista principal de ZonasPage.jsx ha sido refactorizada para abandonar los datos estaticos (mock data) e implementar una conexion en tiempo real con la base de datos a traves de peticiones HTTP, utilizando un adaptador de datos para mantener la compatibilidad con los componentes visuales existentes.