import { Route, Routes } from "react-router-dom";
import {
  LoginPage,
  HomePage,
  Account,
  History,
  MakeAppointment,
  Setting,
  CreateAccount,
} from "./page";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppContextProvider, { AppContext } from "./contexts/app.context";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./page/ForgotPassword";
import SalaryView from "./page/SalaryView";
import { useContext, useEffect } from "react";
import EditEmployee from "./page/EditEmployee";
import NotFound from "./page/NotFound";
import { LoadingSpinner } from "./components";
import HistoryDetail from "./page/HistoryDetail";
import EmployeeList from "./page/EmployeeList";
import EditPerson from "./page/EditPerson";

function App() {
  const { appState, dispatch, isLoading } = useContext(AppContext);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/paycheck" element={<SalaryView />} />
        <Route exact path="/forgotPassword" element={<ForgotPassword />} />
        <Route exact path="/" element={<HomePage />}>
          <Route exact path="/account" element={<Account />} />
          <Route
            exact
            path="/appointment/employee/edit"
            element={<EditEmployee />}
          />
          <Route
            exact
            path="/appointment/employee/create"
            element={<EditEmployee />}
          />
          <Route exact path="/account/create" element={<CreateAccount />} />
          <Route exact path="/history" element={<History />} />
          <Route
            exact
            path="/history-detail/:idHistory"
            element={<HistoryDetail />}
          />
          <Route exact path="/appointment" element={<MakeAppointment />} />
          <Route exact path="/setting" element={<Setting />} />
          <Route exact path="/staff" element={<EmployeeList />} />
          <Route
            exact
            path="/staff/edit"
            element={<EditPerson />}
          />
          <Route
            exact
            path="/staff/create"
            element={<EditPerson />}
          />
        </Route>
        <Route exact path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        position="bottom-center"
      />
    </>
  );
}

export default App;
