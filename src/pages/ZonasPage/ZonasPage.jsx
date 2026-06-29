import React, { useState, useEffect } from 'react'
import './ZonasPage.scss'

// página de gestión de zonas
// muestra las zonas con sus datos, filtros por tipo y sector
// en el avance 2 acá se podrá editar el nombre/descripción de cada zona

export default function ZonasPage() {
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [filtroSector, setFiltroSector] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  // NUEVO: Estado para guardar los datos reales
  const [zonas, setZonas] = useState([])

  useEffect(() => {
    document.title = 'Gestión de Zonas · VCM Cencosud'

    fetch('http://127.0.0.1:8000/api/zonas/')
      .then(respuesta => respuesta.json())
      .then(datosDjango => {
        // TRADUCTOR: Transformamos los datos de Django al molde de React
        // TRADUCTOR: Transformamos los datos de Django al molde de React
        const datosAdaptados = datosDjango.map(item => {
          // Valores por defecto
          let transitosFicticios = 150;
          let tipoFicticio = 'fria';
          let sectorFicticio = 'A';

          // Asignamos datos realistas según el ID de la zona que viene de Django
          if (item.id_zona === 'Z-01') {
            transitosFicticios = 850; tipoFicticio = 'caliente'; sectorFicticio = 'A';
          } else if (item.id_zona === 'Z-02') {
            transitosFicticios = 420; tipoFicticio = 'templada'; sectorFicticio = 'B';
          } else if (item.id_zona === 'Z-03') {
            transitosFicticios = 120; tipoFicticio = 'fria'; sectorFicticio = 'C';
          } else if (item.id_zona === 'Z-04') {
            transitosFicticios = 750; tipoFicticio = 'caliente'; sectorFicticio = 'D';
          }

          return {
            id: item.id_zona,
            nombre: item.nombre,
            descripcion: 'Monitoreo activo',
            sector: sectorFicticio,
            tipo: tipoFicticio,
            transitos: transitosFicticios,
            capacidad_max: 1000,
            tiempo_prom_min: Math.floor(Math.random() * 20) + 5, // Tiempo aleatorio entre 5 y 25 min
            recomendacion: tipoFicticio === 'caliente' ? 'Despejar pasillo' : 'Monitorear flujo'
          }
        })

        setZonas(datosAdaptados) // Guardamos los datos ya traducidos
      })
      .catch(error => console.error("Error al cargar la API:", error))

    return () => { document.title = 'VCM Cencosud · Mapa de Calor' }
  }, [])

  // aplica los filtros seleccionados
  const zonasFiltradas = zonas.filter(z => {
    const matchTipo = filtroTipo === 'todas' || z.tipo === filtroTipo
    const matchSector = filtroSector === 'todos' || z.sector === filtroSector
    const matchSearch = z.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      z.id.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchSector && matchSearch
  })

  const sectores = ['A', 'B', 'C', 'D']

  return (
    <>
      <section className="page-header" aria-labelledby="zonas-h1">
        <div className="page-header__contenido">
          <h1 className="page-header__h1" id="zonas-h1">Gestión de Zonas</h1>
          <p className="page-header__desc">
            Vista completa de todas las zonas monitoreadas en la tienda.
            Consulta el estado, métricas y recomendaciones de cada sector.
          </p>
        </div>
        <div className="page-header__meta">
          <span className="meta-badge">
            {zonas.length} zonas en total
          </span>
          <span className="meta-badge">Jumbo Providencia</span>
        </div>
      </section>

      {/* barra de filtros */}
      <div className="zonas-filtros">
        {/* búsqueda por nombre */}
        <input
          type="search"
          className="zonas-filtros__busqueda"
          placeholder="Buscar zona por nombre o ID..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          aria-label="Buscar zona"
        />

        {/* filtro por tipo de calor */}
        <div className="zonas-filtros__grupo">
          <span className="zonas-filtros__label">Tipo:</span>
          {['todas', 'caliente', 'templada', 'fria'].map(tipo => (
            <button
              key={tipo}
              className={`filtro-btn filtro-btn--${tipo}${filtroTipo === tipo ? ' filtro-btn--activo' : ''}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {tipo === 'todas' ? 'Todas' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>

        {/* filtro por sector */}
        <div className="zonas-filtros__grupo">
          <span className="zonas-filtros__label">Sector:</span>
          {['todos', ...sectores].map(s => (
            <button
              key={s}
              className={`filtro-btn${filtroSector === s ? ' filtro-btn--activo' : ''}`}
              onClick={() => setFiltroSector(s)}
            >
              {s === 'todos' ? 'Todos' : `Sector ${s}`}
            </button>
          ))}
        </div>

        {/* contador de resultados */}
        <p className="zonas-filtros__resultado" aria-live="polite">
          Mostrando {zonasFiltradas.length} de {zonas.length} zonas
        </p>
      </div>

      {/* tabla de zonas */}
      {zonasFiltradas.length > 0 ? (
        <div className="zonas-tabla-wrap">
          <table className="zonas-tabla" aria-label="Listado de zonas monitoreadas">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Zona</th>
                <th scope="col">Sector</th>
                <th scope="col">Tipo</th>
                <th scope="col">Tránsitos</th>
                <th scope="col">Ocupación</th>
                <th scope="col">T. Promedio</th>
                <th scope="col">Recomendación</th>
              </tr>
            </thead>
            <tbody>
              {zonasFiltradas.map(zona => {
                const pct = Math.round((zona.transitos / zona.capacidad_max) * 100)
                return (
                  <tr key={zona.id} className={`zonas-tabla__fila zonas-tabla__fila--${zona.tipo}`}>
                    <td className="zonas-tabla__id">
                      <span>{zona.id}</span>
                    </td>
                    <td className="zonas-tabla__nombre">
                      <strong>{zona.nombre}</strong>
                      <p>{zona.descripcion}</p>
                    </td>
                    <td className="zonas-tabla__sector">
                      <span className="sector-badge">Sector {zona.sector}</span>
                    </td>
                    <td>
                      <span className={`badge badge--${zona.tipo}`}>{zona.tipo}</span>
                    </td>
                    <td className="zonas-tabla__num">
                      {zona.transitos.toLocaleString('es-CL')}
                    </td>
                    <td className="zonas-tabla__ocupacion">
                      <div className="mini-barra">
                        <div
                          className={`mini-barra__fill mini-barra__fill--${zona.tipo}`}
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <span>{pct}%</span>
                    </td>
                    <td className="zonas-tabla__tiempo">
                      {zona.tiempo_prom_min} min
                    </td>
                    <td className="zonas-tabla__rec">
                      {zona.recomendacion}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="zonas-vacio">
          <p>No se encontraron zonas con los filtros seleccionados.</p>
          <button onClick={() => { setFiltroTipo('todas'); setFiltroSector('todos'); setBusqueda('') }}>
            Limpiar filtros
          </button>
        </div>
      )}

      {/* resumen por sector al fondo */}
      <section className="zonas-resumen" aria-labelledby="resumen-h2">
        <h2 className="seccion-titulo" id="resumen-h2">Resumen por Sector</h2>
        <div className="zonas-resumen-grid">
          {sectores.map(s => {
            const zonasDelSector = zonas.filter(z => z.sector === s)
            const totalTransitos = zonasDelSector.reduce((acc, z) => acc + z.transitos, 0)
            const tipoMasFrecuente = zonasDelSector.sort((a, b) => b.transitos - a.transitos)[0]?.tipo
            return (
              <div key={s} className={`sector-card sector-card--${tipoMasFrecuente}`}>
                <h3 className="sector-card__titulo">Sector {s}</h3>
                <p className="sector-card__zonas">{zonasDelSector.length} zonas</p>
                <strong className="sector-card__total">
                  {totalTransitos.toLocaleString('es-CL')}
                </strong>
                <p className="sector-card__label">tránsitos totales</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
