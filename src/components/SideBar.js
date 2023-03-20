import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Sidebar.css";
import { BsCalendar3 } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function SideBar() {
  const [clickItem, setClickItem] = useState(-1);

  const onClickItem = (index) => {
    setClickItem(index);
  };

  const menuItem = [
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

  return (
    <div className="sidebar">
      <div className="systemNameBox">
        <p className="systemName">Hệ thống ABC</p>
      </div>
      <div className="sidebarMenuBox">
        {menuItem.map((item, index) => {
          return (
            <div
              key={index}
              className={clickItem === index ? "itemBox active" : "itemBox"}
              onClick={() => onClickItem(index)}
            >
              <Link to={item.path}>
                <i>{item.icon}</i>
                <div className="itemName">{item.name}</div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
