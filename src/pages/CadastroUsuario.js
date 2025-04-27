import { useState } from 'react';
import api from '../api/api';

function CadastroUsuario() {
  const [form, setForm] = useState({
    username: '', senha: '', nome: '', telefone: '', email: '',
    ativo: true, ehTecnicoTi: false, ehTecnicoNivelDois: false, ehAdministrador: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/usuarios', form).then(() => alert('Usuário criado com sucesso'));
  };

  return (
    <div className="container mt-5">
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, val]) => (
          <div className="mb-3" key={key}>
            <label>{key}</label>
            <input
              className="form-control"
              name={key}
              type={typeof val === 'boolean' ? 'checkbox' : 'text'}
              checked={typeof val === 'boolean' ? val : undefined}
              value={typeof val !== 'boolean' ? val : undefined}
              onChange={handleChange}
            />
          </div>
        ))}
        <button className="btn btn-success">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroUsuario;
