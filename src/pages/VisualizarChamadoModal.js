import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import api from "../api/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

export default function VisualizarChamadoModal({
  open,
  handleClose,
  chamadoId,
}) {
  const [chamado, setChamado] = useState(null);
  const [interacoes, setInteracoes] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [novoAnexo, setNovoAnexo] = useState(null);

  useEffect(() => {
    if (chamadoId && open) {
      api
        .get(`/chamados/${chamadoId}`)
        .then((res) => setChamado(res.data))
        .catch((err) => console.error(err));

      api
        .get(`/chamados/${chamadoId}/interacoes`)
        .then((res) => setInteracoes(res.data))
        .catch((err) => console.error(err));
    }
  }, [chamadoId, open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNovoAnexo({
        filename: file.name,
        content: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNovaInteracao = () => {
    if (!novaMensagem.trim()) {
      alert("Mensagem não pode estar vazia");
      return;
    }

    const payload = {
      mensagem: novaMensagem,
      anexos: novoAnexo ? [novoAnexo] : [],
    };

    api
      .post(`/chamados/${chamadoId}/interacao`, payload)
      .then(() => {
        setNovaMensagem("");
        setNovoAnexo(null);
        return Promise.all([
          api.get(`/chamados/${chamadoId}`),
          api.get(`/chamados/${chamadoId}/interacoes`),
        ]);
      })
      .then(([chamadoRes, interacoesRes]) => {
        setChamado(chamadoRes.data);
        setInteracoes(interacoesRes.data);
      })

      .catch((err) => console.error(err));
  };
const handleResolucaoDoChamado = () => {
  if (!novaMensagem.trim()) {
    toast.warning('Para resolver o chamado, preencha a mensagem da interação.');
    return;
  }

  const payload = {
    mensagem: novaMensagem,
    anexos: novoAnexo ? [novoAnexo] : [],
  };

  api
    .post(`/chamados/${chamadoId}/interacao`, payload)
    .then(() => {
      setNovaMensagem('');
      setNovoAnexo(null);
      return api.post(`/chamados/${chamadoId}/resolve`);
    })
    .then(() => {
      toast.success('Chamado resolvido com sucesso!');
      return Promise.all([
        api.get(`/chamados/${chamadoId}`),
        api.get(`/chamados/${chamadoId}/interacoes`),
      ]);
    })
    .then(([chamadoRes, interacoesRes]) => {
      setChamado(chamadoRes.data);
      setInteracoes(interacoesRes.data);
    })
    .catch((err) => {
      const mensagem =
        err.response?.data?.message || 'Erro ao resolver o chamado.';
      toast.error(mensagem);
      console.error(err);
    });
};



  if (!chamado) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <ToastContainer />

        <Typography variant="h5" mb={2}>
          Detalhes do Chamado
        </Typography>
        <Divider />

        <Grid container spacing={0} mt={2}>
          {/* LADO ESQUERDO */}
          <Grid item xs={12} md={6} sx={{ pr: 2 }}>
            <Typography variant="subtitle1">
              <strong>Assunto:</strong> {chamado.assunto}
            </Typography>
            <Typography variant="body1" mt={1}>
              <strong>Descrição:</strong> {chamado.descricao}
            </Typography>
            <Typography mt={2}>
              <strong>Tipo de Solicitação:</strong> {chamado.tipo_solicitacao}
            </Typography>
            <Typography>
              <strong>Status:</strong> {chamado.status}
            </Typography>
            <Typography>
              <strong>Criticidade:</strong> {chamado.criticidade}
            </Typography>
            <Typography>
              <strong>Impacto:</strong> {chamado.impacto}
            </Typography>
            <Typography>
              <strong>Atendente:</strong>{" "}
              {chamado.atendente?.nome || "Não atribuído"}
            </Typography>
            <Typography>
              <strong>Criado Em:</strong>{" "}
              {new Date(chamado.criadoEm).toLocaleString("pt-BR")}
            </Typography>
          </Grid>

          {/* Divisória vertical */}
          <Grid
            item
            sx={{
              width: "1px",
              backgroundColor: "#ccc",
              mx: 1, // espaço entre colunas
            }}
          />

          {/* LADO DIREITO */}
          <Grid item xs={12} md={5} sx={{ pl: 2 }}>
            <Typography variant="h6" gutterBottom>
              Interações
            </Typography>

            {/* NOVA INTERAÇÃO */}
            <TextField
              fullWidth
              label="Nova Interação"
              multiline
              rows={3}
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
            />

            {/* Container para o botão de anexo e salvar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              {/* Botão para adicionar o anexo */}
              <Button component="label">
                Adicionar Anexo
                <input type="file" hidden onChange={handleFileChange} />
              </Button>

              {/* Botão de salvar, alinhado à direita */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleNovaInteracao}
              >
                Salvar
              </Button>
            </Box>

            {/* Exibe o nome do arquivo anexado */}
            {novoAnexo && (
              <Typography variant="caption" mt={1}>
                {novoAnexo.filename}
              </Typography>
            )}

            <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
              {interacoes.length === 0 && (
                <Typography>Nenhuma interação registrada.</Typography>
              )}
              {interacoes.map((interacao, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Usuário:</strong>{" "}
                    {interacao.enviadoPeloUsuarioId?.nome}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mensagem:</strong> {interacao.mensagem}
                  </Typography>
                  {interacao.anexos && interacao.anexos.length > 0 && (
                    <Typography variant="body2">
                      <strong>Anexo:</strong>{" "}
                      {interacao.anexos.map((a) => a.filename).join(", ")}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block">
                    {new Date(interacao.criadoEm).toLocaleString("pt-BR")}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              {chamado.status !== "RESOLVIDO" &&
                chamado.status !== "CANCELADO" &&
                chamado.status !== "ABERTO" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleResolucaoDoChamado}
                  >
                    Resolver
                  </Button>
                )}

              <Button variant="outlined" color="error" onClick={handleClose}>
                Voltar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
