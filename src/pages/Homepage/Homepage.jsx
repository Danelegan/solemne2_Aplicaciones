import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ESTADISTICAS, ZONAS } from '../../data/zonas.js'
import MapaCalor from '../../components/MapaCalor/MapaCalor.jsx'
import './Homepage.scss'

/**
 * Homepage — Página de bienvenida del Sistema VCM Cencosud.
 * RF-01: Resumen estadístico estático contextualizado al mapa de calor.
 * Layout principal con CSS Grid obligatorio.
 */
export default function Homepage() {
  useEffect(() => {
    document.title = 'Inicio · VCM Cencosud — Mapa de Calor'
    return () => { document.title = 'VCM Cencosud · Mapa de Calor' }
  }, [])

  // agarro las 3 zonas con más tránsito para el ranking
  const topZonas = [...ZONAS]
    .sort((a, b) => b.transitos - a.transitos)
    .slice(0, 3)

  // filtro las zonas frías para la sección de alertas
  const zonasFrias = ZONAS.filter(z => z.tipo === 'fria')

  return (
    <>
      {/* sección hero con el título y la preview del mapa */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="hero__contenido">
          <p className="hero__eyebrow">Sistema VCM · Cencosud</p>
          <h1 className="hero__h1" id="hero-h1">
            Mapa de Calor<br />
            <span className="hero__acento">Tránsito en Tienda</span>
          </h1>
          <p className="hero__desc">
            Visualiza la intensidad de tránsito de clientes en cada zona de la tienda.
            Detecta zonas calientes, templadas e invisibles para optimizar
            el layout, las exhibiciones y el rendimiento comercial.
          </p>
          <div className="hero__ctas">
            <Link to="/mapa"    className="hero__cta hero__cta--primario">Ver Mapa en Vivo</Link>
            <Link to="/zonas"   className="hero__cta hero__cta--secundario">Gestionar Zonas</Link>
          </div>
          <p className="hero__actualizacion">
            <span className="hero__dot" aria-hidden="true"></span>
            Última actualización: {ESTADISTICAS.ultima_actualizacion}
          </p>
        </div>

        {/* mini preview del mapa en el hero, solo visual */}
        <div className="hero__visual" aria-hidden="true" role="presentation">
          <div className="mapa-demo">
            <div className="mapa-demo__titulo">Jumbo Providencia · Vista rápida</div>
            <div className="mapa-demo__grid">
              {ZONAS.slice(0, 9).map(z => (
                <div
                  key={z.id}
                  className={`celda celda--${z.tipo}`}
                  title={`${z.nombre}: ${z.transitos} tránsitos`}
                  style={{
                    opacity: 0.5 + (z.transitos / 2000) * 0.5,
                  }}
                >
                  {z.id.replace('Z-', '')}
                </div>
              ))}
            </div>
            <div className="mapa-demo__leyenda">
              <span className="md-lnda md-lnda--cal">Caliente</span>
              <span className="md-lnda md-lnda--tem">Templada</span>
              <span className="md-lnda md-lnda--fri">Fría</span>
            </div>
          </div>
        </div>
      </section>

      {/* componente del mapa de calor interactivo */}
      <MapaCalor />

      {/* estadísticas del día en tarjetas */}
      <section className="estadisticas" aria-labelledby="est-h2">
        <h2 className="seccion-titulo" id="est-h2">Resumen del Día</h2>
        <p className="seccion-subtitulo">
          Tienda: Jumbo Providencia · {ESTADISTICAS.ultima_actualizacion}
        </p>

        {/* grilla de tarjetas, uso CSS Grid acá */}
        <div className="stats-grid" role="list">

          <article className="stat-card stat-card--total" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">◈</div>
            <strong className="stat-card__numero">{ESTADISTICAS.total_zonas}</strong>
            <p className="stat-card__label">Zonas Monitoreadas</p>
            <p className="stat-card__meta">Sensores activos en la tienda</p>
          </article>

          <article className="stat-card stat-card--caliente" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">🔥</div>
            <strong className="stat-card__numero">{ESTADISTICAS.zonas_calientes}</strong>
            <p className="stat-card__label">Zonas Calientes</p>
            <p className="stat-card__meta">Alto tránsito de clientes</p>
          </article>

          <article className="stat-card stat-card--templada" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">〰</div>
            <strong className="stat-card__numero">{ESTADISTICAS.zonas_templadas}</strong>
            <p className="stat-card__label">Zonas Templadas</p>
            <p className="stat-card__meta">Tránsito medio o moderado</p>
          </article>

          <article className="stat-card stat-card--fria" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">❄</div>
            <strong className="stat-card__numero">{ESTADISTICAS.zonas_frias}</strong>
            <p className="stat-card__label">Zonas Frías</p>
            <p className="stat-card__meta">Zonas "invisibles" · bajo tránsito</p>
          </article>

          <article className="stat-card stat-card--transito" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">↑↓</div>
            <strong className="stat-card__numero stat-card__numero--grande">
              {ESTADISTICAS.transito_total_dia.toLocaleString('es-CL')}
            </strong>
            <p className="stat-card__label">Tránsito Total del Día</p>
            <p className="stat-card__meta">Suma de todos los sensores</p>
          </article>

          <article className="stat-card stat-card--destacada" role="listitem">
            <div className="stat-card__icono" aria-hidden="true">★</div>
            <strong className="stat-card__numero stat-card__numero--texto">
              {ESTADISTICAS.zona_mas_activa}
            </strong>
            <p className="stat-card__label">Zona más activa</p>
            <p className="stat-card__meta">Mayor conteo de tránsito</p>
          </article>

        </div>
      </section>

      {/* ── RANKING TOP ZONAS ────────────────────────────────────────────── */}
      <section className="ranking" aria-labelledby="rank-h2">
        <h2 className="seccion-titulo" id="rank-h2">Top Zonas — Mayor Tránsito</h2>

        <ol className="ranking-lista" role="list">
          {topZonas.map((zona, i) => {
            const pct = Math.round((zona.transitos / zona.capacidad_max) * 100)
            return (
              <li key={zona.id} className="ranking-item">
                <article className={`ranking-card ranking-card--${zona.tipo}`}
                  aria-label={`Zona ${i + 1}: ${zona.nombre}`}>
                  <span className="ranking-card__pos" aria-label={`Posición ${i + 1}`}>
                    #{i + 1}
                  </span>
                  <div className="ranking-card__info">
                    <header>
                      <p className="ranking-card__id">{zona.id}</p>
                      <h3 className="ranking-card__nombre">{zona.nombre}</h3>
                    </header>
                    <p className="ranking-card__desc">{zona.descripcion}</p>
                    <div className="ranking-card__barra-wrap">
                      <div
                        className={`ranking-card__barra ranking-card__barra--${zona.tipo}`}
                        role="progressbar"
                        aria-valuenow={zona.transitos}
                        aria-valuemin={0}
                        aria-valuemax={zona.capacidad_max}
                        aria-label={`${zona.transitos} tránsitos, ${pct}% de capacidad`}
                        style={{ '--pct': `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ranking-card__meta">
                    <strong className="ranking-card__transitos">
                      {zona.transitos.toLocaleString('es-CL')}
                    </strong>
                    <span className="ranking-card__unidad">tránsitos</span>
                    <span className={`badge badge--${zona.tipo}`}>{zona.tipo}</span>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ── ALERTAS — ZONAS FRÍAS ────────────────────────────────────────── */}
      <section className="alertas" aria-labelledby="alertas-h2">
        <h2 className="seccion-titulo seccion-titulo--alerta" id="alertas-h2">
          ⚠ Zonas con Bajo Tránsito
        </h2>
        <p className="seccion-subtitulo">
          Estas zonas requieren intervención en layout o comunicación visual.
        </p>

        <div className="alertas-grid">
          {zonasFrias.map(zona => (
            <article key={zona.id} className="alerta-card" aria-label={`Alerta zona fría: ${zona.nombre}`}>
              <header className="alerta-card__header">
                <span className="alerta-card__id">{zona.id}</span>
                <h3 className="alerta-card__nombre">{zona.nombre}</h3>
                <span className="badge badge--fria">Fría</span>
              </header>
              <p className="alerta-card__transitos">
                <strong>{zona.transitos}</strong> tránsitos hoy
              </p>
              <p className="alerta-card__recomendacion">
                <span aria-hidden="true">→ </span>{zona.recomendacion}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── PROPÓSITO DEL SISTEMA ─────────────────────────────────────────── */}
      <section className="proposito" aria-labelledby="prop-h2">
        <h2 className="seccion-titulo" id="prop-h2">¿Para qué sirve este sistema?</h2>

        <div className="proposito-grid">
          <article className="prop-card">
            <span className="prop-card__num" aria-hidden="true">01</span>
            <h3 className="prop-card__titulo">Optimización de Layout</h3>
            <p className="prop-card__texto">
              Identifica zonas de bajo tránsito y toma decisiones sobre reubicación
              de productos y categorías para aumentar la exposición.
            </p>
          </article>
          <article className="prop-card">
            <span className="prop-card__num" aria-hidden="true">02</span>
            <h3 className="prop-card__titulo">Exhibiciones Efectivas</h3>
            <p className="prop-card__texto">
              Ubica las exhibiciones y puntas de góndola en las zonas con mayor
              tráfico para maximizar el impacto de las campañas.
            </p>
          </article>
          <article className="prop-card">
            <span className="prop-card__num" aria-hidden="true">03</span>
            <h3 className="prop-card__titulo">Reportes para Gerencia</h3>
            <p className="prop-card__texto">
              Genera reportes de tránsito por zona y período para fundamentar
              decisiones comerciales con datos concretos.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
