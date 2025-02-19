import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroCliente from "./pages/HomePage/CadastroCliente.jsx";
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Clientes from "./pages/clientes";
import Perfil from "./pages/Perfil";
import ProtectedRoute from "./componentes/ProtectedRoute/ProtectedRoute.jsx"; // Importando a rota protegida
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Clientes />} />
          <Route path="/Cadastro-clientes" element={<CadastroCliente />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
