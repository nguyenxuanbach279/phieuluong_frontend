import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
import { BsCalendar3 } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineAccountCircle, MdOutlinePersonPin } from "react-icons/md";
import { AppContext } from "../contexts/app.context";

function SideBar() {
  const { appState, dispatch } = useContext(AppContext);
  const location = useLocation();
  const onClickItem = (index) => {
    dispatch({
      type: "SET_CHOOSE_SIDEBAR_ITEM",
      indexItem: index,
    });
  };

  const menuItemAdmin = [
    {
      path: "/appointment",
      name: "Bảng lương",
      icon: <BsCalendar3 />,
    },
    {
      path: "/history",
      name: "Lịch sử",
      icon: <BiHistory />,
    },
    {
      path: "/setting",
      name: "Cài đặt",
      icon: <AiOutlineSetting />,
    },
    {
      path: "/account",
      name: "Tài khoản",
      icon: <MdOutlineAccountCircle />,
    },
    {
      path: "/staff",
      name: "Nhân viên",
      icon: <MdOutlinePersonPin />,
    },
  ];

  const menuItemAccountant = [
    {
      path: "/appointment",
      name: "Bảng lương",
      icon: <BsCalendar3 />,
    },
    {
      path: "/history",
      name: "Lịch sử",
      icon: <BiHistory />,
    },
    {
      path: "/setting",
      name: "Cài đặt",
      icon: <AiOutlineSetting />,
    },
  ];

  return (
    <div className="sidebar">
      <div className="systemNameBox">
        {/* <img src={LogoIcon} alt="logo img" style={{width:"32px", height: "32x"}}/> */}
        <p className="systemName">Quản lý lương</p>
      </div>
      <div className="sidebarMenuBox">
        {appState.accountInfo.isAdmin == 1 ? (
          <>
            {menuItemAdmin.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    location.pathname.includes(item.path)
                      ? "itemBox active"
                      : "itemBox"
                  }
                  // onClick={() => onClickItem(index)}
                >
                  <Link to={item.path}>
                    <i>{item.icon}</i>
                    <div className="itemName">{item.name}</div>
                  </Link>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {menuItemAccountant.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    location.pathname.includes(item.path)
                      ? "itemBox active"
                      : "itemBox"
                  }
                  onClick={() => onClickItem(index)}
                >
                  <Link to={item.path}>
                    <i>{item.icon}</i>
                    <div className="itemName">{item.name}</div>
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default SideBar;
