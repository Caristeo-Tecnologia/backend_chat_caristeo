import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
} from "@material-ui/core";
import api from "../../services/api";

const TicketAbstractDialog = ({ ticketId, open, handleClose }) => {

  const [abstract, setAbstract] = useState([]);

  useEffect(async () => {
    if (open) {
      const res = await api.get(`/tickets/${ticketId}/abstract`);
      setAbstract(res.data);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Resumo</DialogTitle>
      <DialogContent>
        <List>
          {abstract.map((value, index) => (
            <ListItem key={index} style={{display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span><strong>Pergunta {index+1}:&nbsp;</strong>{value.question}</span>
              <span><strong>Resposta {index+1}:&nbsp;</strong>{value.answer}</span>
            </ListItem>
          ))}
        </List>
        {abstract.length === 0 && (<span>Nada para ver por aqui ainda</span>)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketAbstractDialog;
