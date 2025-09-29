import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";
import Insercao from "./pages/Insercao";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ margin: 20 }}>
        <Link to="/">Login</Link> |{" "}
        <Link to="/cadastro">Cadastro</Link> |{" "}
        <Link to="/insercao">Inserção</Link> |{" "}
        <Link to="/ranking">Ranking</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/insercao" element={<Insercao />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
