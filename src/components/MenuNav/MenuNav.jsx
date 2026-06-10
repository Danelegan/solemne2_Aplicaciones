import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './MenuNav.scss'

// componente de navegación principal
// recibe los links como props para no tenerlos hardcodeados acá
// el menú hamburguesa se activa solo en móvil (con CSS)

export default function MenuNav({ links = [] }) {
  // controla si el menú hamburguesa está abierto o cerrado
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="menu-nav" aria-label="Menú principal de navegación">

      {/* botón hamburguesa, solo aparece en móvil gracias al CSS */}
      <button
        className={`menu-nav__toggle ${abierto ? 'menu-nav__toggle--open' : ''}`}
        onClick={() => setAbierto(p => !p)}
        aria-expanded={abierto}
        aria-controls="menu-nav-lista"
        aria-label={abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {/* lista de links, en desktop se ve horizontal, en móvil se despliega */}
      <ul
        id="menu-nav-lista"
        className={`menu-nav__lista ${abierto ? 'menu-nav__lista--abierta' : ''}`}
        role="list"
      >
        {links.map(({ label, path }) => (
          <li key={path} className="menu-nav__item">
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `menu-nav__link${isActive ? ' menu-nav__link--activo' : ''}`
              }
              // al hacer clic en un link cerramos el menú móvil
              onClick={() => setAbierto(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
