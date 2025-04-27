import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function ChamadoDetalhes() {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [interacoes, setInteracoes] = useState([]);

  useEffect(() => {
    api.get(`/chamados/${id}`).then(res => setChamado(res.data));
    api.get(`/chamados/${id}/interacoes`).then(res => setInteracoes(res.data));
  }, [id]);

  return (
    <div className="container mt-5">
      <h2>Detalhes do Chamado</h2>
      {chamado && (
        <div className="mb-4">
          <strong>ID:</strong> {chamado.id}
          <br />
          <strong>Status:</strong> {chamado.status}
          {/* outros campos */}
        </div>
      )}

      <h3>Interações</h3>
      <ul className="list-group">
        {interacoes.map((i, index) => (
          <li key={index} className="list-group-item">
            {i.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChamadoDetalhes;
