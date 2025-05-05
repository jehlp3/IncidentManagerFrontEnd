import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Container, Typography } from "@mui/material";
import api from "../api/api";

import VisualizarUsuarioModal from "./VisualizarUsuarioModal"; 






function RelatorioUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  
  const handleRowClick = (params) => {
    setUsuarioSelecionado(params.row.id);
    setModalOpen(true);
  };

  useEffect(() => {
    api
      .get("/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  }, []);


  const columns = [
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 120,
      filterable: true,
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      minWidth: 120,

      filterable: true,
    },
    {
      field: "telefone",
      headerName: "Telefone",
      flex: 1,
      minWidth: 120,
      filterable: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1,
      minWidth: 150,

      filterable: true,
    },

    {
      field: "ativo",
      headerName: "Ativo",
      flex: 2,
      minWidth: 200,
      filterable: true,
    },
    {
      field: "ehTecnicoTi",
      headerName: "Técnico TI Nível I",
      flex: 2,
      minWidth: 200,

      filterable: true,
    },
    {
      field: "ehTecnicoNivelDois",
      headerName: "Técnico TI Nível II",
      flex: 1,
      minWidth: 180,

      filterable: false,
    },
    {
      field: "ehAdministrador",
      headerName: "Usuário Administrador",
      flex: 1,
      minWidth: 180,

      filterable: false,
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Listagem de Usuários
      </Typography>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={usuarios.map((c) => ({ id: c.idUsuario, ...c }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          autoHeight
          loading={usuarios.length === 0}
          onRowClick={handleRowClick}
        />
        <VisualizarUsuarioModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          usuarioId={usuarioSelecionado}
        />
      </div>
    </Container>
  );
}




  
  export default RelatorioUsuarios;
  