import { NavLink } from 'react-router-dom'
import './Menu.css'
import buttonSvg from '../../assets/button1.svg'

export default function Menu(){
    const items = [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/signup', label: 'Sign Up' },
        { to: '/', label: 'Community' },
    ]

    return (
        <div className="sidebar" role="navigation" aria-label="Main menu">
            <nav>
                <ul className="menu-list">
                    {items.map((it) => (
                        <li key={it.label}>
                            <NavLink to={it.to} className={({isActive}) => isActive ? 'menu-pill active' : 'menu-pill'}>
                                <img src={buttonSvg} alt="menu button" className="menu-svg" />
                                <span className="menu-label">{it.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}