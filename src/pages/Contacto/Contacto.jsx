import React, { useState, useEffect } from 'react'
import Mensaje from '../../components/Mensaje/Mensaje.jsx'
import './Contacto.scss'

const FORM_VACIO = { nombre: '', correo: '', asunto: '', mensaje: '' }
const ERR_VACIO  = { nombre: '', correo: '', asunto: '', mensaje: '' }

const ASUNTOS = [
  '',
  'Solicitar reporte de tránsito',
  'Problema con sensor / zona',
  'Consulta sobre layout de tienda',
  'Acceso al sistema',
  'Otro',
]

/**
 * Contacto — Formulario para jefe de tienda o marketero visual.
 * Controlado con useState. Muestra <Mensaje /> al enviar.
 */
export default function Contacto() {
  const [form,     setForm]     = useState(FORM_VACIO)
  const [errores,  setErrores]  = useState(ERR_VACIO)
  const [enviando, setEnviando] = useState(false)
  const [respuesta,setRespuesta]= useState(null) // { tipo, texto }

  useEffect(() => {
    document.title = 'Contacto · VCM Cencosud'
    return () => { document.title = 'VCM Cencosud · Mapa de Calor' }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errores[name]) setErrores(p => ({ ...p, [name]: '' }))
  }

  const validar = () => {
    const e = { ...ERR_VACIO }
    let ok = true
    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      e.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).'; ok = false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      e.correo = 'Ingresa un correo electrónico válido.'; ok = false
    }
    if (!form.asunto) {
      e.asunto = 'Selecciona un asunto.'; ok = false
    }
    if (!form.mensaje.trim() || form.mensaje.trim().length < 15) {
      e.mensaje = 'El mensaje debe tener al menos 15 caracteres.'; ok = false
    }
    setErrores(e)
    return ok
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRespuesta(null)
    if (!validar()) {
      setRespuesta({ tipo: 'error', texto: 'Por favor corrige los campos marcados antes de enviar.' })
      return
    }
    setEnviando(true)
    // no tenemos API todavía, así que simulo el envío con un setTimeout
    setTimeout(() => {
      setEnviando(false)
      setForm(FORM_VACIO)
      setErrores(ERR_VACIO)
      setRespuesta({
        tipo: 'exito',
        texto: `Mensaje enviado. El equipo VCM se contactará con ${form.nombre.split(' ')[0]} a la brevedad.`,
      })
    }, 1500)
  }

  return (
    <>
      {/* título de la página */}
      <section className="page-header" aria-labelledby="contacto-h1">
        <h1 className="page-header__h1" id="contacto-h1">Contacto</h1>
        <p className="page-header__desc">
          ¿Eres jefe de tienda o marketero visual? Envíanos tu consulta sobre el
          sistema de mapa de calor y te responderemos a la brevedad.
        </p>
      </section>

      <div className="contacto-layout">

        {/* formulario principal */}
        <section className="form-seccion" aria-labelledby="form-h2">
          <h2 className="form-seccion__titulo" id="form-h2">Enviar Consulta</h2>

          {/* muestra el mensaje de éxito o error después de enviar */}
          {respuesta && (
            <Mensaje
              tipo={respuesta.tipo}
              texto={respuesta.texto}
              onCerrar={() => setRespuesta(null)}
            />
          )}

          <form
            className="cform"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de contacto VCM Cencosud"
          >
            {/* campo nombre */}
            <div className={`cfield ${errores.nombre ? 'cfield--error' : ''}`}>
              <label htmlFor="nombre" className="cfield__label">
                Nombre completo
                <span className="cfield__req" aria-label="campo obligatorio"> *</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="cfield__input"
                placeholder="Ej: María González Soto"
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errores.nombre}
                aria-describedby={errores.nombre ? 'err-nombre' : undefined}
              />
              {errores.nombre && (
                <p id="err-nombre" className="cfield__error" role="alert">{errores.nombre}</p>
              )}
            </div>

            {/* campo correo */}
            <div className={`cfield ${errores.correo ? 'cfield--error' : ''}`}>
              <label htmlFor="correo" className="cfield__label">
                Correo electrónico corporativo
                <span className="cfield__req" aria-label="campo obligatorio"> *</span>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className="cfield__input"
                placeholder="usuario@cencosud.cl"
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!errores.correo}
                aria-describedby={errores.correo ? 'err-correo' : undefined}
              />
              {errores.correo && (
                <p id="err-correo" className="cfield__error" role="alert">{errores.correo}</p>
              )}
            </div>

            {/* select de asunto, tuve que usar disabled en la opción vacía para forzar selección */}
            <div className={`cfield ${errores.asunto ? 'cfield--error' : ''}`}>
              <label htmlFor="asunto" className="cfield__label">
                Asunto
                <span className="cfield__req" aria-label="campo obligatorio"> *</span>
              </label>
              <select
                id="asunto"
                name="asunto"
                value={form.asunto}
                onChange={handleChange}
                className="cfield__input cfield__select"
                aria-required="true"
                aria-invalid={!!errores.asunto}
                aria-describedby={errores.asunto ? 'err-asunto' : undefined}
              >
                {ASUNTOS.map(a => (
                  <option key={a} value={a} disabled={a === ''}>
                    {a === '' ? '— Selecciona un asunto —' : a}
                  </option>
                ))}
              </select>
              {errores.asunto && (
                <p id="err-asunto" className="cfield__error" role="alert">{errores.asunto}</p>
              )}
            </div>

            {/* textarea del mensaje */}
            <div className={`cfield ${errores.mensaje ? 'cfield--error' : ''}`}>
              <label htmlFor="mensaje" className="cfield__label">
                Mensaje
                <span className="cfield__req" aria-label="campo obligatorio"> *</span>
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                className="cfield__input cfield__textarea"
                placeholder="Describe tu consulta con el mayor detalle posible: zona afectada, tipo de problema, tienda, etc."
                rows={5}
                aria-required="true"
                aria-invalid={!!errores.mensaje}
                aria-describedby={errores.mensaje ? 'err-mensaje' : undefined}
              />
              {errores.mensaje && (
                <p id="err-mensaje" className="cfield__error" role="alert">{errores.mensaje}</p>
              )}
            </div>

            {/* botones de enviar y limpiar */}
            <div className="cform__acciones">
              <button
                type="submit"
                className="cform__enviar"
                disabled={enviando}
                aria-busy={enviando}
              >
                {enviando
                  ? <><span className="cform__spinner" aria-hidden="true" /> Enviando…</>
                  : 'Enviar Consulta'
                }
              </button>
              <button
                type="button"
                className="cform__limpiar"
                onClick={() => { setForm(FORM_VACIO); setErrores(ERR_VACIO); setRespuesta(null) }}
                disabled={enviando}
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>

        {/* panel lateral con datos de contacto del equipo */}
        <aside className="contacto-info" aria-label="Información del equipo VCM">
          <div className="cinfo-bloque">
            <h2 className="cinfo-bloque__titulo">Equipo VCM Cencosud</h2>
            <ul className="cinfo-lista" role="list">
              <li className="cinfo-item">
                <span class="cinfo-item__icono" aria-hidden="true">✉</span>
                <div>
                  <strong>Correo</strong>
                  <a href="mailto:vcm@cencosud.cl">vcm@cencosud.cl</a>
                </div>
              </li>
              <li className="cinfo-item">
                <span class="cinfo-item__icono" aria-hidden="true">☎</span>
                <div>
                  <strong>Soporte técnico</strong>
                  <a href="tel:+56222001234">+56 2 2200 1234</a>
                </div>
              </li>
              <li className="cinfo-item">
                <span class="cinfo-item__icono" aria-hidden="true">◷</span>
                <div>
                  <strong>Horario</strong>
                  <p>Lunes a viernes · 8:00 – 18:00 hrs.</p>
                </div>
              </li>
              <li className="cinfo-item">
                <span class="cinfo-item__icono" aria-hidden="true">◎</span>
                <div>
                  <strong>Oficina central</strong>
                  <address>Av. Kennedy 9001, Las Condes, Santiago</address>
                </div>
              </li>
            </ul>
          </div>

          <div className="cinfo-bloque cinfo-bloque--tip">
            <h2 className="cinfo-bloque__titulo">¿Qué puedes reportar?</h2>
            <ul className="cinfo-tips" role="list">
              <li>Sensor con falla o señal perdida</li>
              <li>Zona con datos inconsistentes</li>
              <li>Solicitar exportación de reporte</li>
              <li>Propuesta de nueva zona a monitorear</li>
              <li>Acceso de nuevo usuario al sistema</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}
