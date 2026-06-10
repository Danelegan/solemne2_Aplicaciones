import React, { useState, useEffect } from 'react'
import { ZONAS, ESTADISTICAS } from '../../data/zonas.js'
import './ReportesPage.scss'

// página de reportes
// muestra un resumen generado con los datos estáticos de zonas.js
// en el avance 2 acá se podrá exportar a CSV/PDF y filtrar por fecha

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('hoy')

  useEffect(() => {
    document.title = 'Reportes · VCM Cencosud'
    return () => { document.title = 'VCM Cencosud · Mapa de Calor' }
  }, [])

  // los períodos son estáticos por ahora, en avance 2 se conecta con una API real
  const periodos = [
    { id: 'hoy',    label: 'Hoy' },
    { id: 'semana', label: 'Esta Semana' },
    { id: 'mes',    label: 'Este Mes' },
  ]

  // genera datos simulados según el período (multiplicadores estáticos)
  const factores = { hoy: 1, semana: 6.8, mes: 28.3 }
  const factor = factores[periodoSeleccionado]

  const totalTransitos = Math.round(ESTADISTICAS.transito_total_dia * factor)

  // ordena las zonas de mayor a menor tránsito para el ranking
  const zonasOrdenadas = [...ZONAS].sort((a, b) => b.transitos - a.transitos)

  return (
    <>
      <section className="page-header" aria-labelledby="reportes-h1">
        <div className="page-header__contenido">
          <h1 className="page-header__h1" id="reportes-h1">Reportes</h1>
          <p className="page-header__desc">
            Análisis de tránsito por período. Exporta los datos o revisa
            el rendimiento de cada zona en el tiempo.
          </p>
        </div>
        <div className="page-header__meta">
          <span className="meta-badge">Jumbo Providencia · Sucursal #0142</span>
        </div>
      </section>

      {/* selector de período */}
      <div className="reportes-periodo">
        <span className="reportes-periodo__label">Ver datos de:</span>
        <div className="reportes-periodo__opciones" role="group" aria-label="Seleccionar período">
          {periodos.map(p => (
            <button
              key={p.id}
              className={`periodo-btn${periodoSeleccionado === p.id ? ' periodo-btn--activo' : ''}`}
              onClick={() => setPeriodoSeleccionado(p.id)}
              aria-pressed={periodoSeleccionado === p.id}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* botón de exportar deshabilitado por ahora */}
        <button className="exportar-btn" disabled title="Disponible en el avance 2">
          ↓ Exportar CSV
        </button>
      </div>

      {/* tarjetas de resumen del período */}
      <div className="reporte-resumen-grid">
        <div className="reporte-card reporte-card--principal">
          <span className="reporte-card__icono" aria-hidden="true">↑↓</span>
          <strong className="reporte-card__numero">
            {totalTransitos.toLocaleString('es-CL')}
          </strong>
          <p className="reporte-card__label">Tránsitos Totales</p>
          <p className="reporte-card__periodo">Período: {periodos.find(p => p.id === periodoSeleccionado)?.label}</p>
        </div>

        <div className="reporte-card">
          <span className="reporte-card__icono" aria-hidden="true">🔥</span>
          <strong className="reporte-card__numero">{ESTADISTICAS.zonas_calientes}</strong>
          <p className="reporte-card__label">Zonas Calientes</p>
          <p className="reporte-card__meta">&gt; 70% de capacidad</p>
        </div>

        <div className="reporte-card">
          <span className="reporte-card__icono" aria-hidden="true">〰</span>
          <strong className="reporte-card__numero">{ESTADISTICAS.zonas_templadas}</strong>
          <p className="reporte-card__label">Zonas Templadas</p>
          <p className="reporte-card__meta">30–70% de capacidad</p>
        </div>

        <div className="reporte-card">
          <span className="reporte-card__icono" aria-hidden="true">❄</span>
          <strong className="reporte-card__numero">{ESTADISTICAS.zonas_frias}</strong>
          <p className="reporte-card__label">Zonas Frías</p>
          <p className="reporte-card__meta">&lt; 30% · requieren atención</p>
        </div>
      </div>

      {/* ranking completo de zonas */}
      <section className="reporte-ranking" aria-labelledby="ranking-rep-h2">
        <h2 className="seccion-titulo" id="ranking-rep-h2">
          Ranking Completo — {periodos.find(p => p.id === periodoSeleccionado)?.label}
        </h2>
        <p className="seccion-subtitulo">
          Zona más activa: <strong>{ESTADISTICAS.zona_mas_activa}</strong> ·
          Zona menos activa: <strong>{ESTADISTICAS.zona_menos_activa}</strong>
        </p>

        <div className="reporte-tabla-wrap">
          <table className="reporte-tabla" aria-label="Ranking de zonas por tránsito">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Zona</th>
                <th scope="col">Sector</th>
                <th scope="col">Tipo</th>
                <th scope="col">Tránsitos</th>
                <th scope="col">Ocupación</th>
                <th scope="col">Tiempo Prom.</th>
              </tr>
            </thead>
            <tbody>
              {zonasOrdenadas.map((zona, i) => {
                const pct = Math.round((zona.transitos / zona.capacidad_max) * 100)
                const transitosPeriodo = Math.round(zona.transitos * factor)
                return (
                  <tr key={zona.id}>
                    <td className="reporte-tabla__pos">
                      <span className={`pos-badge${i < 3 ? ` pos-badge--top${i + 1}` : ''}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="reporte-tabla__zona">
                      <span className="reporte-tabla__id">{zona.id}</span>
                      <strong>{zona.nombre}</strong>
                    </td>
                    <td>
                      <span className="sector-badge">Sector {zona.sector}</span>
                    </td>
                    <td>
                      <span className={`badge badge--${zona.tipo}`}>{zona.tipo}</span>
                    </td>
                    <td className="reporte-tabla__num">
                      {transitosPeriodo.toLocaleString('es-CL')}
                    </td>
                    <td>
                      <div className="reporte-pct">
                        <div className="mini-barra">
                          <div
                            className={`mini-barra__fill mini-barra__fill--${zona.tipo}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span>{pct}%</span>
                      </div>
                    </td>
                    <td>{zona.tiempo_prom_min} min</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* nota de datos simulados */}
      <div className="reporte-nota">
        <span aria-hidden="true">ℹ</span>
        <p>
          Datos simulados con fines académicos. Los valores de semana y mes se calculan
          aplicando un multiplicador fijo sobre los datos del día.
          En el avance 2 se conectará con datos históricos reales.
        </p>
      </div>
    </>
  )
}
