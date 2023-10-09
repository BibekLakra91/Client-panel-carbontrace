import React, { useState, useEffect, useContext } from "react";

import Header from "../common/header";
import Sidebar from "../common/sidebar";
import Footer from "../common/footer";
import { Helmet } from "react-helmet";
import { userContext } from "../../context/userContext";
import { ThemeContext } from "../../theme";
const Dashboard = (props) => {
  var user_data = JSON.parse(localStorage.getItem("userData"));

  var context = useContext(userContext);
  const [error, setError] = useState({});
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user_data) {
      context.UpdateUserContext(user_data);
    }
  }, []);

  const { theme, toggleTheme } = useContext(ThemeContext); // added theme

  return (
    <>
      <Helmet>
        <title>
          {context.user.role === 2
            ? `${process.env.REACT_APP_A_TITLE} - Profile`
            : `${process.env.REACT_APP_C_TITLE} - Profile`}
        </title>
      </Helmet>
      <div className="wrapper">
        <Sidebar location_props={props} />
        <div className={`main main-color-${theme}`}>
          <Header location_props={props} />
          <main className="content">{props.children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
