import React, { useState } from 'react'
import { ZONAS } from '../../data/zonas.js'
import './MapaCalor.scss'

// mapa de calor interactivo — componente principal del avance 1





// posición de cada zona en el grid del supermercado (4 col x 3 fil)
// null significa que la celda está vacía (pasillo o depósito)
const LAYOUT_GRID = [
  // Fila 1: Entrada, Frutas, Panadería, Cajas
  { zoneId: 'Z-01', col: 1, row: 1 },
  { zoneId: 'Z-03', col: 2, row: 1 },
  { zoneId: 'Z-02', col: 3, row: 1 },
  { zoneId: 'Z-10', col: 4, row: 1 },
  // Fila 2: (vacío), Lácteos, Cecinas, Pasillo Central
  { zoneId: null,   col: 1, row: 2 }, // Pasillo de acceso
  { zoneId: 'Z-04', col: 2, row: 2 },
  { zoneId: 'Z-05', col: 3, row: 2 },
  { zoneId: 'Z-06', col: 4, row: 2 },
  // Fila 3: Bazar, Licores, Limpieza, (vacío)
  { zoneId: 'Z-09', col: 1, row: 3 },
  { zoneId: 'Z-07', col: 2, row: 3 },
  { zoneId: 'Z-08', col: 3, row: 3 },
  { zoneId: null,   col: 4, row: 3 }, // Depósito / área técnica
]

// Busca datos de zona por ID
const getZona = (id) => ZONAS.find(z => z.id === id) || null

// Porcentaje de ocupación
const getPct = (zona) => Math.round((zona.transitos / zona.capacidad_max) * 100)

// Etiqueta corta para la celda
const getAbrev = (nombre) => {
  const map = {
    'Entrada Principal':         'ENT',
    'Panadería & Delikatessen':  'PAN',
    'Frutas & Verduras':         'F&V',
    'Lácteos & Refrigerados':    'LÁC',
    'Cecinas & Carnicería':      'CEC',
    'Pasillo Central (Conservas)': 'PAS',
    'Licores & Bebidas':         'LIC',
    'Limpieza & Cuidado Hogar':  'LMP',
    'Bazar & Electro Hogar':     'BAZ',
    'Cajas (Checkouts)':         'CAJ',
  }
  return map[nombre] || nombre.slice(0, 3).toUpperCase()
}

export default function MapaCalor() {
  const [zonaActiva, setZonaActiva] = useState(null)
  const [modoVista, setModoVista] = useState('calor') // 'calor' | 'transitos'

  const zona = zonaActiva ? getZona(zonaActiva) : null

  return (
    <section className="mapa-calor" aria-labelledby="mapa-h2">
      <div className="mapa-calor__header">
        <div>
          <h2 className="mapa-calor__titulo" id="mapa-h2">
            Mapa de Calor — Tránsito en Tienda
          </h2>
          <p className="mapa-calor__subtitulo">
            Jumbo Providencia · Sucursal #0142 · Datos del día
          </p>
        </div>

        <div className="mapa-calor__controles" role="group" aria-label="Modo de visualización">
          <button
            className={`mapa-ctrl-btn ${modoVista === 'calor' ? 'mapa-ctrl-btn--activo' : ''}`}
            onClick={() => setModoVista('calor')}
            aria-pressed={modoVista === 'calor'}
          >
            🌡 Calor
          </button>
          <button
            className={`mapa-ctrl-btn ${modoVista === 'transitos' ? 'mapa-ctrl-btn--activo' : ''}`}
            onClick={() => setModoVista('transitos')}
            aria-pressed={modoVista === 'transitos'}
          >
            ↑↓ Tránsitos
          </button>
        </div>
      </div>

      <div className="mapa-calor__contenido">
        {/* ── Grid del mapa ─────────────────────────────────────── */}
        <div
          className="mapa-grid"
          role="grid"
          aria-label="Mapa de calor de tránsito por zona del supermercado"
        >
          {/* Cabecera del grid: sectores */}
          <div className="mapa-grid__label-col" aria-hidden="true">Sector A</div>
          <div className="mapa-grid__label-col" aria-hidden="true">Sector B</div>
          <div className="mapa-grid__label-col" aria-hidden="true">Sector C</div>
          <div className="mapa-grid__label-col" aria-hidden="true">Sector D</div>

          {/* Celdas del mapa */}
          {LAYOUT_GRID.map((celda, idx) => {
            if (!celda.zoneId) {
              // Celda vacía (pasillo / depósito)
              return (
                <div
                  key={`vacia-${idx}`}
                  className="mapa-celda mapa-celda--vacia"
                  aria-hidden="true"
                >
                  <span className="mapa-celda__vacia-label">···</span>
                </div>
              )
            }

            const z = getZona(celda.zoneId)
            if (!z) return null
            const pct = getPct(z)
            const estaActiva = zonaActiva === z.id

            return (
              <div
                key={z.id}
                className={`mapa-celda mapa-celda--${z.tipo} ${estaActiva ? 'mapa-celda--seleccionada' : ''}`}
                role="gridcell"
                aria-label={`Zona ${z.nombre}: ${z.transitos} tránsitos, estado ${z.tipo}`}
                aria-selected={estaActiva}
                tabIndex={0}
                onClick={() => setZonaActiva(estaActiva ? null : z.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setZonaActiva(estaActiva ? null : z.id)
                  }
                }}
              >
                {/* Overlay de intensidad de calor */}
                <div
                  className={`mapa-celda__heat mapa-celda__heat--${z.tipo}`}
                  style={{ opacity: 0.15 + (pct / 100) * 0.55 }}
                  aria-hidden="true"
                />

                <span className="mapa-celda__id" aria-hidden="true">{z.id}</span>
                <span className="mapa-celda__abrev" aria-hidden="true">
                  {getAbrev(z.nombre)}
                </span>

                {modoVista === 'transitos' ? (
                  <span className="mapa-celda__valor">{z.transitos.toLocaleString('es-CL')}</span>
                ) : (
                  <span className="mapa-celda__valor">{pct}%</span>
                )}

                {/* Barra de intensidad en la base de la celda */}
                <div className="mapa-celda__barra-base" aria-hidden="true">
                  <div
                    className={`mapa-celda__barra-fill mapa-celda__barra-fill--${z.tipo}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Badge de tipo */}
                <span
                  className={`mapa-celda__badge mapa-celda__badge--${z.tipo}`}
                  aria-hidden="true"
                >
                  {z.tipo === 'caliente' ? '🔥' : z.tipo === 'templada' ? '〰' : '❄'}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Panel de detalle de zona seleccionada ─────────────── */}
        <aside
          className={`mapa-detalle ${zona ? 'mapa-detalle--visible' : ''}`}
          aria-label="Detalle de zona seleccionada"
          aria-live="polite"
        >
          {zona ? (
            <>
              <button
                className="mapa-detalle__cerrar"
                onClick={() => setZonaActiva(null)}
                aria-label="Cerrar detalle de zona"
              >
                ✕
              </button>
              <header className="mapa-detalle__header">
                <span className="mapa-detalle__id">{zona.id}</span>
                <h3 className="mapa-detalle__nombre">{zona.nombre}</h3>
                <span className={`mapa-detalle__badge mapa-detalle__badge--${zona.tipo}`}>
                  {zona.tipo}
                </span>
              </header>

              <div className="mapa-detalle__metricas">
                <div className="mapa-det-metric">
                  <span className="mapa-det-metric__label">Tránsitos hoy</span>
                  <strong className={`mapa-det-metric__valor mapa-det-metric__valor--${zona.tipo}`}>
                    {zona.transitos.toLocaleString('es-CL')}
                  </strong>
                </div>
                <div className="mapa-det-metric">
                  <span className="mapa-det-metric__label">Capacidad</span>
                  <strong className="mapa-det-metric__valor">
                    {getPct(zona)}%
                  </strong>
                </div>
                <div className="mapa-det-metric">
                  <span className="mapa-det-metric__label">Tiempo prom.</span>
                  <strong className="mapa-det-metric__valor">
                    {zona.tiempo_prom_min} min
                  </strong>
                </div>
                <div className="mapa-det-metric">
                  <span className="mapa-det-metric__label">Sector</span>
                  <strong className="mapa-det-metric__valor">{zona.sector}</strong>
                </div>
              </div>

              {/* Barra de capacidad */}
              <div className="mapa-detalle__barra-wrap">
                <div className="mapa-detalle__barra-labels">
                  <span>Ocupación</span>
                  <span>{getPct(zona)}%</span>
                </div>
                <div className="mapa-detalle__barra-track">
                  <div
                    className={`mapa-detalle__barra-fill mapa-detalle__barra-fill--${zona.tipo}`}
                    style={{ width: `${getPct(zona)}%` }}
                    role="progressbar"
                    aria-valuenow={zona.transitos}
                    aria-valuemin={0}
                    aria-valuemax={zona.capacidad_max}
                  />
                </div>
              </div>

              <p className="mapa-detalle__desc">{zona.descripcion}</p>

              <div className="mapa-detalle__recomendacion">
                <span className="mapa-detalle__rec-label">Recomendación</span>
                <p>{zona.recomendacion}</p>
              </div>
            </>
          ) : (
            <div className="mapa-detalle__vacio">
              <span className="mapa-detalle__vacio-icono" aria-hidden="true">◎</span>
              <p>Selecciona una zona del mapa para ver su detalle</p>
            </div>
          )}
        </aside>
      </div>

      {/* ── Leyenda del mapa ──────────────────────────────────────── */}
      <footer className="mapa-calor__leyenda" role="note" aria-label="Leyenda del mapa de calor">
        <div className="mapa-leyenda-escala" aria-hidden="true">
          <span className="mapa-leyenda-escala__label">Baja intensidad</span>
          <div className="mapa-leyenda-escala__barra" />
          <span className="mapa-leyenda-escala__label">Alta intensidad</span>
        </div>
        <div className="mapa-leyenda-tipos">
          <span className="mapa-leyenda-item mapa-leyenda-item--fria">
            <span className="mapa-leyenda-item__muestra" aria-hidden="true" /> Fría (&lt;500 tráns.)
          </span>
          <span className="mapa-leyenda-item mapa-leyenda-item--templada">
            <span className="mapa-leyenda-item__muestra" aria-hidden="true" /> Templada (500–1.100)
          </span>
          <span className="mapa-leyenda-item mapa-leyenda-item--caliente">
            <span className="mapa-leyenda-item__muestra" aria-hidden="true" /> Caliente (&gt;1.100 tráns.)
          </span>
        </div>
      </footer>
    </section>
  )
}
