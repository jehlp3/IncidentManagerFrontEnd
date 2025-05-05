import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Button,
  Grid,
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

export default function VisualizarUsuarioModal({
  open,
  handleClose,
  usuarioId,
}) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (usuarioId && open) {
      api
        .get(`/usuarios/${usuarioId}`)
        .then((res) => setUsuario(res.data))
        .catch((err) => console.error(err));


    }
  }, [usuarioId, open]);

 



  if (!usuario) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Detalhes do Usuário
        </Typography>
        <Divider />

        <Grid container spacing={0} mt={2}>
          {/* LADO ESQUERDO */}
          <Grid item xs={12} md={6} sx={{ pr: 2 }}>
            <Typography variant="subtitle1">
              <strong>Username:</strong> {usuario.username}
            </Typography>
            <Typography variant="body1" mt={1}>
              <strong>Nome:</strong> {usuario.nome}
            </Typography>
            <Typography mt={2}>
              <strong>Telefone:</strong> {usuario.telefone}
            </Typography>
            <Typography>
              <strong>E-mail:</strong> {usuario.email}
            </Typography>
            <Typography>
              <strong>Criado Em:</strong> {usuario.criadoEm}
            </Typography>
            <Typography>
              <strong>Ativo:</strong> {usuario.ativo}
            </Typography>


          </Grid>



       

            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Voltar
              </Button>
            </Box>
          </Grid>
       
      </Box>
    </Modal>
  );
}
