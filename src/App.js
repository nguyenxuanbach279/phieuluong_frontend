import { Route, Routes } from "react-router-dom";
import { LoginPage, HomePage } from "./page";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/" element={<HomePage />} />
      </Routes>
      
    </>
  );
}

export default App;
