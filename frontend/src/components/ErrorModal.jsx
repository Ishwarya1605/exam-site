"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorModal = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Dialog
      open={!!error}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "error.light",
          color: "error.contrastText",
        }}
      >
        <Typography variant="h6" component="span" fontWeight={600}>
          Error
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "error.contrastText",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" color="text.primary">
          {error}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          sx={{ textTransform: "none" }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;

