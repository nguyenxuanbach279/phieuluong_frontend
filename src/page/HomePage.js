import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineLogout, AiOutlineUpload } from "react-icons/ai";
import { Outlet, useNavigate } from "react-router-dom";
import { SideBar } from "../components";
import { AppContext } from "../contexts/app.context";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { appState, dispatch } = useContext(AppContext);

  useEffect(() => {
    if (appState == null || appState.loginUser == null) {
      navigate("/login");
    }
  }, []);

  const onLogout = () => {
    navigate("/login");
    dispatch({
      type: "SET_JWT_TOKEN_ACTION",
      jwtToken: null,
    });
    dispatch({
      type: "SET_LOGIN_USER_ACTION",
      loginUser: null,
    });
  };

  if (appState == null || appState.loginUser == null) {
    return null;
  }

  return (
    <div className="homeContainer">
      <div className="sidebarBox">
        <SideBar />
      </div>
      <div className="contentBox">
        <div className="userbox">
          <div className="userInfoBox">
            <div className="userInfo">
              <p className="userName">Nguyễn Văn A</p>
              <p className="userPosition">Kế toán</p>
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
