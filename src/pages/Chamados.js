import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

function Chamados() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    api.get('/chamados').then(res => setChamados(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Chamados</h2>
      <ul className="list-group">
        {chamados.map(c => (
          <li key={c.id} className="list-group-item">
            <Link to={`/chamados/${c.id}`}>{c.titulo || 'Chamado sem título'}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chamados;
