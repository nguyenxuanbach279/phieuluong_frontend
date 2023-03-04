import { Route, Routes } from "react-router-dom";
import {
  LoginPage,
  HomePage,
  Account,
  History,
  MakeAppointment,
  Setting,
  CreateAccount
} from "./page";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/" element={<HomePage />}>
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/account/create" element={<CreateAccount />} />
          <Route exact path="/history" element={<History />} />
          <Route exact path="/appointment" element={<MakeAppointment />} />
          <Route exact path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
