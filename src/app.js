import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Buy from "./components/pages/Buy";
import Orders from "./components/pages/Orders";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buy />} />
        <Route path="/pedidos" element={<Orders />} />
      </Routes>
    </Router>
  );
};

export default App;
