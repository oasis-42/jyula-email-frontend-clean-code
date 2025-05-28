import React from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { Box, Typography } from "@mui/material";

interface MonacoEditorComponentProps {
  initialContent: string;
  onContentChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
  showPreview?: boolean;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({
  initialContent,
  onContentChange,
  language = "html",
  height = "72vh",
  showPreview = true,
}) => {
  const editorOptions = {
    fontSize: 14,
    wordWrap: "on" as const,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth: "5px",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    height: height,
    maxWidth: "1094px",
  };

  const editorContainerStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    maxWidth: showPreview ? "50%" : "100%",
    maxHeight: height,
  };

  const previewContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderLeft: showPreview ? "1px solid #e0e0e0" : "none",
  };

  const visualizationStyle = {
    overflowY: "auto" as const,
    overflowX: "auto" as const,
    width: "100%",
    maxHeight: `calc(${height} - 30px)`, // Adjust based on Typography height
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    "&::-webkit-scrollbar": {
      width: "13px",
      height: "13px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#fff",
      borderLeft: "0.1px solid #c3c3c2",
    },
    "&::-webkit-scrollbar-track-piece": {
      borderTop: "1px solid #c3c3c2",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c3c3c2",
      borderRadius: "0px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#929292",
    },
  };

  const handleEditorChange: OnChange = (value) => {
    if (onContentChange) {
      onContentChange(value);
    }
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={editorContainerStyle}>
        <Typography variant="body2" sx={{ margin: "5px 0px 5px 10px", fontWeight: "bold", color: "#2D3C42" }}>
          {language.toUpperCase()}
        </Typography>
        <Editor
          height={`calc(${height} - 30px)`} // Adjust based on Typography height
          defaultLanguage={language}
          defaultValue={initialContent}
          onChange={handleEditorChange}
          options={editorOptions}
          path={Date.now().toString()} // Unique path to avoid model conflicts if multiple editors are on one page
        />
      </Box>
      {showPreview && (
        <Box sx={previewContainerStyle}>
          <Box sx={{ boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.08)", position: "sticky", top: 0, zIndex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                margin: "5px 0px 5px 10px",
                fontWeight: "bold",
                color: "#2D3C42",
                backgroundColor: "white",
              }}>
              Visualização
            </Typography>
          </Box>
          <Box sx={visualizationStyle}>
            <div dangerouslySetInnerHTML={{ __html: initialContent }} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MonacoEditorComponent;