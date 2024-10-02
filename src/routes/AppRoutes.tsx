import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import AuthGuard from "../auth/AuthGuard";
import Spin from "../components/ui/Spin";
import Colors from "../pages/Colors/Colors";
import Brands from "../pages/Brands/Brands";
import Houses from "../pages/Houses/Houses";
import Images from "../pages/Images/Images";
import Widgets from "../pages/Widgets/Widgets";
import WidgetPreview from "../pages/Widgets/WidgetPreview";
import LanguageManager from "../pages/LanguageManager/LanguagesManager";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated }) => {
  if (isAuthenticated === null) {
    return <Spin />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/colors"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <Colors />
          </AuthGuard>
        }
      />
      <Route
        path="/brands"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <Brands />
          </AuthGuard>
        }
      />
      <Route
        path="/houses"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <Houses />
          </AuthGuard>
        }
      />
      <Route
        path="/images"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <Images />
          </AuthGuard>
        }
      />
      <Route
        path="/widgets"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <Widgets />
          </AuthGuard>
        }
      />
      <Route path="/widget-preview/:widgetId" element={<WidgetPreview />} />
      <Route
        path="/languages"
        element={
          <AuthGuard isAuthenticated={isAuthenticated}>
            <LanguageManager />
          </AuthGuard>
        }
      />
    </Routes>
  );
};

export default AppRoutes;