import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuNav from './components/MenuNav/MenuNav.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Contacto from './pages/Contacto/Contacto.jsx'
import MapaCalorPage from './pages/MapaCalorPage/MapaCalorPage.jsx'
import ZonasPage from './pages/ZonasPage/ZonasPage.jsx'
import ReportesPage from './pages/ReportesPage/ReportesPage.jsx'

// rutas que le paso al nav como props
const NAV_LINKS = [
  { label: 'Inicio',        path: '/' },
  { label: 'Mapa de Calor', path: '/mapa' },
  { label: 'Zonas',         path: '/zonas' },
  { label: 'Reportes',      path: '/reportes' },
  { label: 'Contacto',      path: '/contacto' },
]

function Layout() {
  // controla si el aside está expandido o colapsado
  const [asideAbierto, setAsideAbierto] = useState(true)

  return (
    <div className={`app-wrapper${asideAbierto ? '' : ' aside-cerrado'}`}>

      {/* header pegado arriba */}
      <header className="app-header" role="banner">
        <div className="app-header__brand">
          <img
            src="/logo-cencosud.svg"
            alt="Logotipo Cencosud"
            className="app-header__logo"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div className="app-header__titles">
            <span className="app-header__name">VCM Cencosud</span>
            <span className="app-header__sub">Mapa de Calor · Tránsito en Tienda</span>
          </div>
        </div>

        <MenuNav links={NAV_LINKS} />

        <div className="app-header__meta" aria-label="Estado del sistema">
          <span className="pulse-dot" aria-hidden="true"></span>
          <span className="app-header__live">EN VIVO</span>
        </div>
      </header>

      {/* contenido principal con CSS Grid: aside izquierda + main derecha */}
      <div className="app-body">

        {/* aside izquierdo, colapsable */}
        <aside className="app-aside" aria-label="Panel de estado de tienda">

          {/* botón para abrir/cerrar el panel */}
          <button
            className="aside-toggle"
            onClick={() => setAsideAbierto(p => !p)}
            aria-expanded={asideAbierto}
            aria-label={asideAbierto ? 'Colapsar panel lateral' : 'Expandir panel lateral'}
            title={asideAbierto ? 'Colapsar panel' : 'Expandir panel'}
          >
            {asideAbierto ? '◀' : '▶'}
          </button>

          {/* contenido del aside, solo visible cuando está abierto */}
          <div className="aside-contenido">
            <div className="aside-bloque">
              <h2 className="aside-bloque__titulo">Tienda activa</h2>
              <p className="aside-bloque__valor">Jumbo Providencia</p>
              <p className="aside-bloque__meta">Sucursal #0142</p>
            </div>

            <div className="aside-bloque">
              <h2 className="aside-bloque__titulo">Sensores</h2>
              <ul className="aside-sensores" role="list">
                <li><span className="sensor sensor--ok"  aria-label="Sensor activo"></span> Sector A <strong>Activo</strong></li>
                <li><span className="sensor sensor--ok"  aria-label="Sensor activo"></span> Sector B <strong>Activo</strong></li>
                <li><span className="sensor sensor--warn" aria-label="Sensor con advertencia"></span> Sector C <strong>Fluctuante</strong></li>
                <li><span className="sensor sensor--ok"  aria-label="Sensor activo"></span> Sector D <strong>Activo</strong></li>
                <li><span className="sensor sensor--off" aria-label="Sensor inactivo"></span> Sector E <strong>Sin señal</strong></li>
              </ul>
            </div>

            <div className="aside-bloque aside-bloque--leyenda">
              <h2 className="aside-bloque__titulo">Leyenda de Calor</h2>
              <ul className="leyenda" role="list">
                <li><span className="leyenda__muestra leyenda__muestra--caliente" aria-hidden="true"></span> Zona Caliente</li>
                <li><span className="leyenda__muestra leyenda__muestra--templada" aria-hidden="true"></span> Zona Templada</li>
                <li><span className="leyenda__muestra leyenda__muestra--fria"     aria-hidden="true"></span> Zona Fría</li>
              </ul>
            </div>

            <div className="aside-bloque aside-bloque--accesos">
              <h2 className="aside-bloque__titulo">Acceso rápido</h2>
              <nav aria-label="Atajos del panel">
                <ul role="list">
                  <li><a href="/mapa">→ Ver mapa en vivo</a></li>
                  <li><a href="/reportes">→ Descargar reporte</a></li>
                  <li><a href="/contacto">→ Soporte técnico</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        <main className="app-main" id="contenido-principal" role="main" tabIndex={-1}>
          <Routes>
            <Route path="/"         element={<Homepage />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/mapa"     element={<MapaCalorPage />} />
            <Route path="/zonas"    element={<ZonasPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="*"         element={<PaginaNoEncontrada />} />
          </Routes>
        </main>
      </div>

      {/* footer abajo */}
      <footer className="app-footer" role="contentinfo">
        <p>© {new Date().getFullYear()} Cencosud S.A. — Sistema VCM · Datos simulados con fines académicos</p>
        <p className="app-footer__stack">React · SCSS · Vite · React Router v6</p>
      </footer>

    </div>
  )
}

// página de 404, por si alguien escribe una ruta que no existe
function PaginaNoEncontrada() {
  return (
    <section className="placeholder-page">
      <h1>404 · Página no encontrada</h1>
      <p>La ruta que buscas no existe. Usa el menú de navegación para volver al inicio.</p>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
