import React, { useEffect, useRef } from 'react'
import './Mensaje.scss'

/**
 * <Mensaje />
 * Muestra mensajes de confirmación o error en el formulario.
 *
 * Props:
 *   tipo     — 'exito' | 'error'
 *   texto    — string con el mensaje
 *   onCerrar — callback opcional para cerrar
 */
export default function Mensaje({ tipo = 'exito', texto = '', onCerrar }) {
  const ref = useRef(null)

  // Mover foco al mensaje al montarse (accesibilidad)
  useEffect(() => {
    ref.current?.focus()
  }, [])

  const config = {
    exito: { icono: '✓', roleAlerta: 'status',  ariaLive: 'polite' },
    error: { icono: '✕', roleAlerta: 'alert',   ariaLive: 'assertive' },
  }
  const { icono, roleAlerta, ariaLive } = config[tipo] ?? config.exito

  return (
    <div
      ref={ref}
      className={`mensaje mensaje--${tipo}`}
      role={roleAlerta}
      aria-live={ariaLive}
      aria-atomic="true"
      tabIndex={-1}
    >
      <span className="mensaje__icono" aria-hidden="true">{icono}</span>
      <p className="mensaje__texto">{texto}</p>
      {onCerrar && (
        <button
          className="mensaje__cerrar"
          onClick={onCerrar}
          type="button"
          aria-label="Cerrar mensaje"
        >×</button>
      )}
    </div>
  )
}
