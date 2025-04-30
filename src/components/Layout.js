// src/components/Layout.js
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Layout.css';
import headerLogo from '../assets/header.png'; // Logo do cabeçalho
import NovoChamadoModal from '../pages/NovoChamadoModal';

function Layout({ children }) {
  const [openMenu, setOpenMenu] = useState({
    chamados: false,
    usuarios: false,
    relatorios: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="layout">
      <header className="header">
        <img src={headerLogo} alt="Smartdesk Logo" className="header-logo" />
      </header>
      <div className="main">
        <aside className="sidebar">
        <button onClick={() => setOpenModal(true)} className="btn-novo-chamado">
          + Novo Chamado
          <NovoChamadoModal open={openModal} handleClose={() => setOpenModal(false)} />
        </button>
          <nav>
            <ul>
              <li>
                <div className="menu-title" onClick={() => toggleMenu('chamados')}>
                  Chamados
                </div>
                {openMenu.chamados && (
                  <ul className="submenu">
                    <li><Link to="/chamados">Listar Chamados</Link></li>
                  </ul>
                )}
              </li>
              <li>
                <div className="menu-title" onClick={() => toggleMenu('usuarios')}>
                  Usuários
                </div>
                {openMenu.usuarios && (
                  <ul className="submenu">
                    <li><Link to="/usuarios/novo">Cadastrar Usuário</Link></li>
                  </ul>
                )}
              </li>
              <li>
                <div className="menu-title" onClick={() => toggleMenu('relatorios')}>
                  Relatórios
                </div>
                {openMenu.relatorios && (
                  <ul className="submenu">
                    <li><Link to="/relatorios/chamados">Todos os Chamados</Link></li>
                    <li><Link to="/relatorios/usuarios">Todos os Usuários</Link></li>
                  </ul>
                )}
              </li>
              <li><Link to="/login">Sair</Link></li>
            </ul>
          </nav>
        </aside>
        <section className="content">
          {children}
        </section>
      </div>
    </div>
  );

  

}



export default Layout;
