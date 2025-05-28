// jyula-email-frontend-clean-code/src/pages/createTemplates.tsx
import { useState } from "react";
import MonacoEditorComponent from "../components/common/MonacoEditorComponent.tsx"; 
import { Box, Typography, TextField, InputAdornment, Button, Snackbar } from "@mui/material";
import ExampleTemplate from "../components/templatesComponents/ExampleTemplate"; 
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

import { useApiFeedback } from "../hooks/useApiFeedback"; 

// import { createTemplate } from "../models/templates";

function CreateTemplatesPage() { // Nome do componente alterado para clareza
  const [templateName, setTemplateName] = useState(""); // Nome da variável alterado
  const [templateSubject, setTemplateSubject] = useState(""); // Nome da variável alterado
  const [templateContent, setTemplateContent] = useState(ExampleTemplate()); // Nome da variável alterado
  
  const { feedback, showSuccess, showError, showWarning, handleClose: handleFeedbackClose } = useApiFeedback(); // NOVO
  const navigate = useNavigate();

  const handleSaveTemplate = async () => {
    if (!templateSubject.trim() || !templateName.trim() || !templateContent.trim()) {
      showWarning("Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      //   Substitua pelo seu model real de criação de template
      //   const newTemplate = await createTemplate({
      //     name: templateName,
      //     subject: templateSubject,
      //     content: templateContent,
      //   });
      console.log("Simulando salvamento:", { name: templateName, subject: templateSubject, content: templateContent });
      // Simular sucesso da API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API
      // throw new Error("Simulated API Error"); // Descomente para testar erro
      
      showSuccess("Template salvo com sucesso!");
      // Limpar campos ou navegar após sucesso
      // setTemplateName("");
      // setTemplateSubject("");
      // setTemplateContent(ExampleTemplate());
      setTimeout(() => navigate("/app/selecionar-template"), 1500); // Navegar após mostrar msg
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      showError(error instanceof Error && error.message !== "" ? error.message : "Erro ao salvar, tente novamente mais tarde");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <TextField
          sx={{ width: "100%", height: "30px" }}
          variant="standard"
          size="small"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: "#2D3C42", fontWeight: "bold" }}>Nome do template:</Typography>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          sx={{ width: "100%", height: "30px", margin: "5px 0px 10px 0px" }}
          variant="standard"
          size="small"
          value={templateSubject}
          onChange={(e) => setTemplateSubject(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: "#2D3C42", fontWeight: "bold" }}>Assunto:</Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <MonacoEditorComponent initialContent={templateContent} onContentChange={setTemplateContent} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
          width: "100%",
        }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2D3C42",
            "&:hover": {
              backgroundColor: "#1D2C34",
            },
            textTransform: "capitalize",
            width: "150px",
          }}
          onClick={handleSaveTemplate}>
          <Typography variant="body2">Salvar template</Typography>
        </Button>
        <Snackbar
          open={feedback.isOpen}
          autoHideDuration={6000}
          onClose={handleFeedbackClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert
            variant="filled"
            onClose={handleFeedbackClose}
            severity={feedback.severity}>
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default CreateTemplatesPage;