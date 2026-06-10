import React, { useState, useEffect } from 'react'
import { ZONAS } from '../../data/zonas.js'
import './MapaCalorPage.scss'

// esta página muestra el mapa de calor completo con todas las zonas
// por ahora los datos son estáticos, en el avance 2 conectamos con la API

export default function MapaCalorPage() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null)
  const [vistaActiva, setVistaActiva] = useState('calor') // 'calor' o 'transitos'

  useEffect(() => {
    document.title = 'Mapa de Calor · VCM Cencosud'
    return () => { document.title = 'VCM Cencosud · Mapa de Calor' }
  }, [])

  // agrupa las zonas por sector para mostrarlas en columnas
  const sectores = ['A', 'B', 'C', 'D']
  const zonasPorSector = sectores.map(s => ({
    sector: s,
    zonas: ZONAS.filter(z => z.sector === s),
  }))

  // calcula el porcentaje de ocupación de una zona
  const getPct = (zona) => Math.round((zona.transitos / zona.capacidad_max) * 100)

  return (
    <>
      {/* encabezado de la página */}
      <section className="page-header" aria-labelledby="mapa-h1">
        <div className="page-header__contenido">
          <h1 className="page-header__h1" id="mapa-h1">Mapa de Calor</h1>
          <p className="page-header__desc">
            Vista en tiempo real del tránsito de clientes por zona. Los colores
            indican la intensidad: rojo = alta actividad, azul = zona fría.
          </p>
        </div>
        <div className="page-header__meta">
          <span className="meta-badge meta-badge--live">
            <span className="pulse-dot" aria-hidden="true"></span>
            EN VIVO
          </span>
          <span className="meta-badge">Jumbo Providencia · Sucursal #0142</span>
        </div>
      </section>

      {/* controles de vista */}
      <div className="mapa-controles">
        <div className="mapa-controles__grupo">
          <button
            className={`mapa-ctrl-btn${vistaActiva === 'calor' ? ' mapa-ctrl-btn--activo' : ''}`}
            onClick={() => setVistaActiva('calor')}
          >
            🔥 Vista Calor
          </button>
          <button
            className={`mapa-ctrl-btn${vistaActiva === 'transitos' ? ' mapa-ctrl-btn--activo' : ''}`}
            onClick={() => setVistaActiva('transitos')}
          >
            ↑↓ Vista Tránsitos
          </button>
        </div>
        <p className="mapa-controles__hint">
          Haz clic en una zona para ver su detalle
        </p>
      </div>

      {/* grilla principal del mapa */}
      <div className="mapa-layout">
        <div className="mapa-grid" role="list" aria-label="Mapa de calor por sectores">
          {zonasPorSector.map(({ sector, zonas }) => (
            <div key={sector} className="mapa-sector">
              <h2 className="mapa-sector__titulo">Sector {sector}</h2>
              <div className="mapa-sector__zonas">
                {zonas.map(zona => {
                  const pct = getPct(zona)
                  const esSeleccionada = zonaSeleccionada?.id === zona.id
                  return (
                    <button
                      key={zona.id}
                      className={`zona-celda zona-celda--${zona.tipo}${esSeleccionada ? ' zona-celda--seleccionada' : ''}`}
                      onClick={() => setZonaSeleccionada(esSeleccionada ? null : zona)}
                      aria-pressed={esSeleccionada}
                      aria-label={`${zona.nombre}: ${zona.transitos} tránsitos, ${pct}% de ocupación`}
                    >
                      <span className="zona-celda__id">{zona.id}</span>
                      <span className="zona-celda__nombre">{zona.nombre}</span>
                      {vistaActiva === 'calor' ? (
                        <span className="zona-celda__pct">{pct}%</span>
                      ) : (
                        <span className="zona-celda__pct">{zona.transitos.toLocaleString('es-CL')}</span>
                      )}
                      {/* barra de progreso visual */}
                      <div className="zona-celda__barra">
                        <div
                          className={`zona-celda__fill zona-celda__fill--${zona.tipo}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* panel de detalle de zona seleccionada */}
        <aside className="zona-detalle" aria-live="polite">
          {zonaSeleccionada ? (
            <div className={`zona-detalle__card zona-detalle__card--${zonaSeleccionada.tipo}`}>
              <div className="zona-detalle__header">
                <span className="zona-detalle__id">{zonaSeleccionada.id}</span>
                <span className={`badge badge--${zonaSeleccionada.tipo}`}>{zonaSeleccionada.tipo}</span>
              </div>
              <h3 className="zona-detalle__nombre">{zonaSeleccionada.nombre}</h3>
              <p className="zona-detalle__desc">{zonaSeleccionada.descripcion}</p>

              <div className="zona-detalle__metricas">
                <div className="zona-detalle__metrica">
                  <strong>{zonaSeleccionada.transitos.toLocaleString('es-CL')}</strong>
                  <span>tránsitos hoy</span>
                </div>
                <div className="zona-detalle__metrica">
                  <strong>{getPct(zonaSeleccionada)}%</strong>
                  <span>de capacidad</span>
                </div>
                <div className="zona-detalle__metrica">
                  <strong>{zonaSeleccionada.tiempo_prom_min} min</strong>
                  <span>tiempo promedio</span>
                </div>
              </div>

              <div className="zona-detalle__recomendacion">
                <strong>Recomendación:</strong>
                <p>{zonaSeleccionada.recomendacion}</p>
              </div>

              <button
                className="zona-detalle__cerrar"
                onClick={() => setZonaSeleccionada(null)}
                aria-label="Cerrar detalle de zona"
              >
                Cerrar ✕
              </button>
            </div>
          ) : (
            <div className="zona-detalle__vacio">
              <span aria-hidden="true">◎</span>
              <p>Selecciona una zona del mapa para ver su detalle</p>
            </div>
          )}
        </aside>
      </div>

      {/* leyenda al fondo */}
      <div className="mapa-leyenda-footer">
        <div className="mapa-leyenda-footer__item">
          <span className="mapa-leyenda-footer__color mapa-leyenda-footer__color--caliente"></span>
          Zona Caliente &gt;70%
        </div>
        <div className="mapa-leyenda-footer__item">
          <span className="mapa-leyenda-footer__color mapa-leyenda-footer__color--templada"></span>
          Zona Templada 30–70%
        </div>
        <div className="mapa-leyenda-footer__item">
          <span className="mapa-leyenda-footer__color mapa-leyenda-footer__color--fria"></span>
          Zona Fría &lt;30%
        </div>
      </div>
    </>
  )
}
