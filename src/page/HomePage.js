import React from "react";
import { Button } from "react-bootstrap";
import { AiOutlineLogout, AiOutlineUpload } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import { SideBar } from "../components";
import "../css/HomePage.css";

export default function HomePage() {
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
              <button>
                <AiOutlineLogout style={{ width: 28, height: 28 }} />
              </button>
            </div>
          </div>
          {/* <div className="uploadFileBtnBox">
            <Button>
              Upload file <AiOutlineUpload style={{ width: 24, height: 24 }} />
            </Button>
          </div> */}
        </div>
        <div className="mainContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
