import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
import { BsCalendar3 } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
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
      name: "Đặt lịch",
      icon: <BsCalendar3 />,
    },
    {
      path: "/history",
      name: "Lịch sử",
      icon: <BiHistory />,
    },
    {
      path: "/setting",
      name: "Cài đặt tài khoản",
      icon: <AiOutlineSetting />,
    },
    {
      path: "/account",
      name: "Tạo tài khoản",
      icon: <MdOutlineAccountCircle />,
    },
  ];

  const menuItemAccountant = [
    {
      path: "/appointment",
      name: "Đặt lịch",
      icon: <BsCalendar3 />,
    },
    {
      path: "/history",
      name: "Lịch sử",
      icon: <BiHistory />,
    },
    {
      path: "/setting",
      name: "Cài đặt tài khoản",
      icon: <AiOutlineSetting />,
    },
  ];

  return (
    <div className="sidebar">
      <div className="systemNameBox">
        <p className="systemName">Hệ thống ABC</p>
      </div>
      <div className="sidebarMenuBox">
        {appState.accountInfo.isAdmin == 1 ? (
          <>
            {menuItemAdmin.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    location.pathname.includes(item.path) ? "itemBox active" : "itemBox"
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
                    appState.indexItem === index ? "itemBox active" : "itemBox"
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
