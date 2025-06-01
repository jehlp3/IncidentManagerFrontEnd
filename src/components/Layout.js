// src/components/Layout.js
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Layout.css';
import headerLogo from '../assets/header.png'; // Logo do cabeçalho
import NovoChamadoModal from '../pages/NovoChamadoModal';
import NovoUsuarioModal from '../pages/NovoUsuarioModal'; // Novo modal de usuário

function Layout({ children }) {
  const [openMenu, setOpenMenu] = useState({
    chamados: false,
    usuarios: false,
    relatorios: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const [openChamadoModal, setOpenChamadoModal] = useState(false);
  const [openUsuarioModal, setOpenUsuarioModal] = useState(false); // novo estado

  return (
    <div className="layout">
      <header className="header">
        <img src={headerLogo} alt="Smartdesk Logo" className="header-logo" />
      </header>
      <div className="main">
        <aside className="sidebar">
          <button onClick={() => setOpenChamadoModal(true)} className="btn-novo-chamado">
            + Novo Chamado
          </button>
          <NovoChamadoModal open={openChamadoModal} handleClose={() => setOpenChamadoModal(false)} />
          <NovoUsuarioModal open={openUsuarioModal} handleClose={() => setOpenUsuarioModal(false)} />

          <nav>
            <ul>
              <li>
                <div className="menu-title" onClick={() => toggleMenu('chamados')}>
                  Chamados
                </div>
                {openMenu.chamados && (
                  <ul className="submenu">
                    <li><Link to="/chamados">Listar Chamados</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                  </ul>
                )}
              </li>
              <li>
                <div className="menu-title" onClick={() => toggleMenu('usuarios')}>
                  Usuários
                </div>
                {openMenu.usuarios && (
                  <ul className="submenu">
                    <li>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenUsuarioModal(true);
                        }}
                      >
                        Cadastrar Usuário
                      </Link>
                    </li>
                    <li><Link to="/relatorios/usuarios">Listar Usuários</Link></li>
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
