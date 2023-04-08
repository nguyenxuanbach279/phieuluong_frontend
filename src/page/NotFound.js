import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      rowGap: 20
    }}
  >
    <img
      src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
      alt="not-found"
      style={{ width: "90%", height: "90%" }}
    />
    <Link to="/appointment" style={{textDecoration: "none", fontSize: 28, fontWeight: 700}}>
      Go Home
    </Link>
  </div>
);

export default NotFound;
