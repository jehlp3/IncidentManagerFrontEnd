import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import api from "../api/api";
import "../pages/Login.css"; // << Importa seu Login.css aqui para aplicar o novo visual

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  //bgcolor: 'background.paper',
  //borderRadius: '16px',
  //boxShadow: 24,
  //p: 4,
};

const tiposSolicitacao = [
  { value: "REQUISICAO_SUPORTE_TI", label: "Requisição de Suporte TI" },
  {
    value: "SOLICITACAO_ACESSO_SISTEMAS",
    label: "Solicitação de Acesso a Sistemas",
  },
  { value: "OBTER_VPN", label: "Obter VPN" },
  {
    value: "REQUISICAO_ACESSO_PRIVILEGIADO",
    label: "Requisição de Acesso Privilegiado",
  },
  { value: "REPORTAR_PROBLEMA_SISTEMA", label: "Reportar Problema em Sistema" },
  { value: "REINICIALIZACAO_DE_SENHA", label: "Reinicialização de Senha" },
  { value: "OBTER_ACESSO_WIFI", label: "Obter Acesso Wi-Fi" },
  { value: "REQUISICAO_HARDWARE", label: "Requisição de Hardware" },
  { value: "OUTRO", label: "Outro" },
];

const criticidades = [
  { value: "CRITICA", label: "Crítica" },
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Média" },
  { value: "BAIXA", label: "Baixa" },
];

const impactos = [
  { value: "GERAL", label: "Geral" },
  { value: "CONJUNTO_SISTEMAS", label: "Conjunto de Sistemas" },
  { value: "SISTEMA_ESPECIFICO", label: "Sistema Específico" },
  { value: "LOCAL", label: "Local" },
];

export default function NovoChamadoModal({ open, handleClose }) {
  const [form, setForm] = useState({
    assunto: "",
    descricao: "",
    tipo_solicitacao: "",
    criticidade: "",
    impacto: "",
    ativo: true,
    foi_escalado: false,
    anexos: [],
    requisitante: "",
    responsavel: "",
    status: "ABERTO",
    criadoEm: "",
  });

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (open) {
      const username = localStorage.getItem("username") || "Usuário";
      const now = new Date();
      const formattedDate = now.toLocaleDateString("pt-BR");
      const formattedTime = now.toLocaleTimeString("pt-BR");

      setForm((prev) => ({
        ...prev,
        requisitante: username,
        responsavel: "Aguardando solicitante",
        status: "ABERTO",
        criadoEm: `${formattedDate}, ${formattedTime}`,
      }));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setForm((prev) => ({
        ...prev,
        anexos: [{ filename: file.name, content: base64 }],
      }));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (
      !form.assunto ||
      !form.descricao ||
      !form.tipo_solicitacao ||
      !form.criticidade ||
      !form.impacto
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Se a validação falhar, não envia.

    const data = {
      ...form,
      responsavel: null,
    };

    try {
      await api.post("/chamados", data);
      alert("Chamado criado com sucesso!");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar chamado.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Título + Status */}
        <Typography
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" className="modal-title">
            Abrir Chamado
          </Typography>
          <Button variant="contained" disabled className="status-button">
            {form.status}
          </Button>
        </Typography>

        <Divider className="divider" />

        <TextField
          fullWidth
          margin="normal"
          label="Assunto"
          name="assunto"
          value={form.assunto}
          onChange={handleChange}
          required
        />

        <Grid container spacing={2}>
          <Grid item sx={{ width: 'calc(64%)' }}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Tipo de Solicitação"
              name="tipo_solicitacao"
              value={form.tipo_solicitacao}
              onChange={handleChange}

              required
            >
              <MenuItem value="" disabled>
                Escolha o tipo de solicitação
              </MenuItem>
              {tiposSolicitacao.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item sx={{ width: 'calc(33%)' }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ height: "56px", mt: 2 }}
            >
              {fileName ? fileName : "Escolher Arquivo"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={4}
          label="Descrição"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          required
        />

        <Grid container spacing={2}>
          <Grid item  sx={{ width: 'calc(49%)' }}>
            <TextField
              fullWidth
              margin="normal"
              label="Requisitante"
              name="requisitante"
              value={form.requisitante}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item  sx={{ width: 'calc(48%)' }}>
            <TextField
              fullWidth
              margin="normal"
              label="Responsável"
              name="responsavel"
              value={form.responsavel}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item sx={{ width: 'calc(49%)' }}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Criticidade"
              name="criticidade"
              value={form.criticidade}
              onChange={handleChange}
              required
            >
              <MenuItem value="" disabled>
                Selecione a criticidade
              </MenuItem>
              {criticidades.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item sx={{ width: 'calc(48%)' }}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Impacto"
              name="impacto"
              value={form.impacto}
              onChange={handleChange}
              required
            >
              <MenuItem value="" disabled>
                Selecione o impacto
              </MenuItem>
              {impactos.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.ativo}
              onChange={handleChange}
              name="ativo"
            />
          }
          label="Ativo"
          sx={{ mt: 2 }}
        />

        <Typography variant="body2" className="data-abertura">
          Data da abertura: {form.criadoEm}
        </Typography>

        <Typography mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Voltar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Salvar
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
}
