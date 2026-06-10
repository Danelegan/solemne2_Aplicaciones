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
