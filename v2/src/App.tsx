import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useAppContext } from "./context/AppContext";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import PainelAnalises from "./pages/Dashboard/PainelAnalises";
import NovoProduto from "./pages/NovoProduto/NovoProduto";
import ListaCompras from "./pages/ListaCompras/ListaCompras";
import InfoImpostos from "./pages/Impostos/InfoImpostos";
import UserProfiles from "./pages/UserProfiles";
import AccountSettings from "./pages/Settings/AccountSettings";
import Support from "./pages/Support/Support";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? <>{children}</> : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />

        {/* App protegido com layout TailAdmin */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index path="/" element={<PainelAnalises />} />
          <Route path="/add" element={<NovoProduto />} />
          <Route path="/list" element={<ListaCompras />} />
          <Route path="/taxes" element={<InfoImpostos />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

