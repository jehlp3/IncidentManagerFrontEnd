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

const initialFormState = {
  username: "",
  password: "",
  confirmPassword: "",
  nome: "",
  email: "",
  telefone: "",
  ativo: true,
  ehTecnicoTi: false,
  ehTecnicoNivelDois: false,
  ehAdministrador: false,
};


export default function NovoUsuarioModal({ open, handleClose }) {
  const [form, setForm] = useState(initialFormState);


  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
  };

  const cleanPhone = (value) => value.replace(/\D/g, "");

  useEffect(() => {
    if (open) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("pt-BR");
      const formattedTime = now.toLocaleTimeString("pt-BR");
  
      setForm((prev) => ({
        ...initialFormState,
        criadoEm: `${formattedDate}, ${formattedTime}`,
      }));
    } else {
      // Resetar o form quando o modal for fechado
      setForm(initialFormState);
    }
  }, [open]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "telefone") {
      setForm({ ...form, [name]: formatPhone(value) });
      return;
    }

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneNumerico = cleanPhone(form.telefone);

    if (
      !form.username ||
      !form.password ||
      !form.confirmPassword ||
      !form.nome ||
      !form.email ||
      !form.telefone
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Por favor, insira um e-mail válido.");
      return false;
    }

    if (telefoneNumerico.length !== 11) {
      alert("O telefone deve conter exatamente 11 dígitos numéricos.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { criadoEm, ...formSemCriadoEm } = form;

    const data = {
      ...formSemCriadoEm,
      telefone: cleanPhone(form.telefone),
    };

    try {
      await api.post("/usuarios", data);
      alert("Usuário criado com sucesso!");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar usuário.");
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
            Cadastro de Usuário
          </Typography>
        </Typography>

        <Divider className="divider" />

        <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.ehAdministrador}
                  name="ehAdministrador"
                  disabled
                />
              }
              label="Usuário Administrador"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.ehTecnicoTi}
                  name="ehTecnicoTi"
                  disabled
                />
              }
              label="Técnico nível I"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.ehTecnicoNivelDois}
                  name="ehTecnicoNivelDois"
                  disabled
                />
              }
              label="Técnico nível II"
            />
          </Grid>
        </Grid>

        {/* Nome + Nome de usuário */}
        <Grid container spacing={2}>
          <Grid item sx={{ width: "calc(49%)" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: "calc(48%)" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome de Usuário"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        {/* Email + Telefone */}
        <Grid container spacing={2}>
          <Grid item sx={{ width: "calc(49%)" }}>
            <TextField
              fullWidth
              margin="normal"
              label="E-mail"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: "calc(48%)" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        {/* Senha + Confirmação da senha */}
        <Grid container spacing={2}>
          <Grid item sx={{ width: "calc(49%)" }}>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Senha"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: "calc(48%)" }}>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Confirme a sua senha"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              error={
                form.confirmPassword !== "" &&
                form.confirmPassword !== form.password
              }
              helperText={
                form.confirmPassword !== "" &&
                form.confirmPassword !== form.password
                  ? "As senhas não coincidem"
                  : ""
              }
              required
            />
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
          label="Usuário Ativo"
          sx={{ mt: 2 }}
        />

        <Typography variant="body2" className="data-abertura">
          Data da criação: {form.criadoEm}
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
