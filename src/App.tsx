// jyula-email-frontend-clean-code/src/App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from "./layouts/DefaultLayout";
import ToolBarLayout from "./layouts/ToolBarLayout";
import CreateTemplatesPage from "./pages/createTemplates"; // Nome do componente atualizado
import ViewerMonacoTemplatePage from './pages/viewerTemplate'; // Nome do componente atualizado
import SelectTemplatePage from "./pages/selectTemplate"; // Nome do componente atualizado
import SegmentsPage from "./pages/segments"; // Nome do componente atualizado
import AudiencesPage from "./pages/audiences"; // Nome do componente atualizado
import SentPage from "./pages/sent"; // Nome do componente atualizado
import FavoritesPage from "./pages/favorites"; // Nome do componente atualizado
import ReportsPage from "./pages/reports"; // Nome do componente atualizado
import CreateCampaignPage from "./pages/createCampaign"; // Nome do componente atualizado
import LoginPage from "./pages/login"; // Nome do componente atualizado
import RegisterPage from "./pages/register"; // Nome do componente atualizado
import { useState } from 'react';

const ProtectedRoute: React.FC<{ isAuthenticated: boolean; children: JSX.Element }> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock: true para testar rotas protegidas

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Poderia navegar para '/app/selecionar-template' aqui também se desejado
  };

  const handleLogout = () => { // Exemplo de função de logout
    setIsAuthenticated(false);
    // Limpar tokens, etc.
  };

  return (
    <Router>
      <Routes>
        {/* Rota raiz redireciona com base na autenticação */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/app/selecionar-template" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage onSuccessfulLogin={handleLoginSuccess} />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Rotas protegidas sob /app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          {/* Rotas com DefaultLayout */}
          <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
            <Route path="selecionar-template" element={<SelectTemplatePage />} />
            <Route path="segmentos" element={<SegmentsPage />} />
            <Route path="audiencia" element={<AudiencesPage />} />
            <Route path="enviados" element={<SentPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
          </Route>

          {/* Rotas com ToolBarLayout */}
          <Route element={<ToolBarLayout><Outlet /></ToolBarLayout>}>
            <Route path="criar-templates" element={<CreateTemplatesPage />} />
            <Route path="visualizar-template" element={<ViewerMonacoTemplatePage />} />
            <Route path="criar-campanha" element={<CreateCampaignPage />} />
          </Route>
        </Route>
        
        {/* Rota para lidar com caminhos não encontrados */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}