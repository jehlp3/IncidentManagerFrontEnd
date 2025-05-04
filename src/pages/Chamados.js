import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Container, Typography } from "@mui/material";
import api from "../api/api";

import VisualizarChamadoModal from "./VisualizarChamadoModal"; // Novo modal de visualização




// Cores de status
const statusColors = {
  ABERTO: "default",
  EM_PROGRESSO: "info",
  ATENCAO_REQUERIDA: "warning",
  AGUARDANDO_SOLICITANTE: "default",
  RESOLVIDO: "success",
  CANCELADO: "error",
};

// Cores de criticidade
const criticidadeColors = {
  CRITICA: "error",
  ALTA: "warning",
  MEDIA: "warning",
  BAIXA: "success",
};

// Formata status com Chip colorido
function formatStatus(status) {
  const label = status.replaceAll("_", " ");
  return (
    <Chip
      label={label}
      color={statusColors[status]}
      variant="outlined"
      sx={{ textTransform: "uppercase", fontWeight: "bold" }}
    />
  );
}

// Formata criticidade com Chip colorido
function formatCriticidade(criticidade) {
  return (
    <Chip
      label={criticidade}
      color={criticidadeColors[criticidade]}
      variant="outlined"
      sx={{ textTransform: "uppercase", fontWeight: "bold" }}
    />
  );
}

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  
  const handleRowClick = (params) => {
    setChamadoSelecionado(params.row.id);
    setModalOpen(true);
  };

  useEffect(() => {
    api
      .get("/chamados")
      .then((res) => setChamados(res.data))
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params?.value ? formatStatus(params.value) : ""),
      filterable: true,
    },
    {
      field: "criticidade",
      headerName: "Criticidade",
      flex: 1,
      minWidth: 120,
      renderCell: (params) =>
        params?.value ? formatCriticidade(params.value) : "",
      filterable: true,
    },
    {
      field: "impacto",
      headerName: "Impacto",
      flex: 1,
      minWidth: 120,
      filterable: true,
    },
    {
      field: "atendente",
      headerName: "Atendente",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const atendente = params.row?.atendente;
        return atendente ? atendente.nome : "Aguardando atendente";
      },
      filterable: true,
    },

    {
      field: "tipo_solicitacao",
      headerName: "Tipo de Solicitação",
      flex: 2,
      minWidth: 200,
      filterable: true,
    },
    {
      field: "assunto",
      headerName: "Assunto",
      flex: 2,
      minWidth: 200,

      filterable: true,
    },
    {
      field: "criadoEm",
      headerName: "Data de Criação",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });
        const formattedTime = date.toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });
        return `${formattedDate} ${formattedTime}`;
      },
      filterable: false,
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Listagem de Chamados
      </Typography>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={chamados.map((c) => ({ id: c.idChamado, ...c }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          autoHeight
          loading={chamados.length === 0}
          onRowClick={handleRowClick}
        />
        <VisualizarChamadoModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          chamadoId={chamadoSelecionado}
        />
      </div>
    </Container>
  );
}
