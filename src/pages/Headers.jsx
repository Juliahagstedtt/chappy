import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Headers.css';


function Headers () {



return (
    <header className='head-menu'>
      <nav className="links">
        <Link to="/">
          <button className="logo">
            <img src={logo} alt="logo" className="chappy" />
          </button>
        </Link>

        <button>
          <NavLink to="/register">Registrera</NavLink>
        </button>
      </nav>
    </header>

);
}

export default Headers;