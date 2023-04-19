import React, { useContext, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SideBar } from "../components";
import { AppContext } from "../contexts/app.context";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appState, dispatch } = useContext(AppContext);

  useEffect(() => {
    if (appState == null || appState.loginUser == null ) {
      navigate("/login");
    }
    else if(location.pathname === "/"){
      navigate("/appointment");
    }
  }, []);

  const onLogout = () => {
    navigate("/login");
    dispatch({
      type: "RESET_STATE",
    });
  };

  if (appState == null || appState.loginUser == null) {
    return null;
  }

  return (
    <div className="homeContainer">
      <SideBar />
      <div className="contentBox">
        <div className="userbox">
          <div className="userInfoBox">
            <div className="userInfo">
              <p className="userName">
                {appState.accountInfo
                  ? appState.accountInfo.name
                  : "User"}
              </p>
              <p className="userPosition">
                {appState.accountInfo && appState.accountInfo.isAdmin === 0 ? "Kế toán" : "Quản lý"}
              </p>
            </div>
            <div className="logoutButtonBox">
              <button onClick={onLogout}>
                <AiOutlineLogout style={{ width: 28, height: 28 }} />
              </button>
            </div>
          </div>
        </div>
        <div className="mainContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
