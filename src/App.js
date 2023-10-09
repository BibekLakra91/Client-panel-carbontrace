import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import ScrollToTop from "react-router-scroll-top";
import {ReactNotifications} from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import BeforeLoginRoute from "./components/common/BeforeLoginRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import Login from "./components/Login/Login";
import Forgot from "./components/Login/forgot";
import Reset from "./components/Login/reset";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/profile";
import editProfile from "./components/Profile/editProfile";
import changePassword from "./components/Profile/changePassword";
import Layout from "./components/common/Layout";
import "./css/custom.css";
import { userContext } from "./context/userContext";
import Team from "./components/Team/Team";
import Addteam from "./components/Team/addteam";
import Editteam from "./components/Team/editteam";
import Collaborator from "./components/Collaborator/Collaborator";
import AddCollaborator from "./components/Collaborator/addCollaborator";
import EditCollaborator from "./components/Collaborator/editCollaborator";
import Facility from "./components/Facility/Facility";
import addFacility from "./components/Facility/addfacility";
import EditFacility from "./components/Facility/EditFacility";
import Report from "./components/co2Report/report";
import ErrorReport from "./components/co2Report/ErrorReport";
import AddReport from "./components/co2Report/addCo2";
import EditReport from "./components/co2Report/EditCo2";
import MaterialityMap from "./components/MaterialityMap";
import ThemeContextProvider from "./theme";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";


import '../src/scss/main.scss';

const App = (props) => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_img: "",
  });

  const [data, setData] = useState({});
  const UpdateUserContext = (data) => {
    setUser(data);
  };
  useEffect(() => {
    var user_data = JSON.parse(localStorage.getItem("userData"));

    if (user_data) {
      setData(user_data);
    }
  }, []);

  return !data.role || data.role === 2 ? (
    <userContext.Provider
      value={{
        user: user,
        UpdateUserContext: UpdateUserContext,
      }}
    >
      <ThemeContextProvider>
      <Router>
        <ReactNotifications />
        <ScrollToTop>
          <Switch>
            <BeforeLoginRoute exact path="/login" component={Login} />
            <BeforeLoginRoute exact path="/forgot" component={Forgot} />
            <BeforeLoginRoute
              exact
              path="/reset/:user_id/:pw_token"
              component={Reset}
            />
            <Layout location_props={props}>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/materiality-map" component={MaterialityMap} />

              {/* <PrivateRoute
                exact
                path="/edit-profile"
                component={editProfile}
              /> */}
              <PrivateRoute
                exact
                path="/change-password"
                component={changePassword}
              />

              <PrivateRoute exact path="/team" component={Team} />
              <PrivateRoute exact path="/add-team" component={Addteam} />
              <PrivateRoute exact path="/edit-team/:id" component={Editteam} />

              <PrivateRoute
                exact
                path="/collaborator"
                component={Collaborator}
              />
              <PrivateRoute
                exact
                path="/add-collaborator"
                component={AddCollaborator}
              />

              <PrivateRoute
                exact
                path="/edit-collaborator/:id"
                component={EditCollaborator}
              />
              <PrivateRoute exact path="/facility" component={Facility} />
              <PrivateRoute
                exact
                path="/add-facility"
                component={addFacility}
              />
              <PrivateRoute
                exact
                path="/edit-facility/:id"
                component={EditFacility}
              />
              <PrivateRoute exact path="/report" component={Report} />
              <PrivateRoute
                exact
                path="/error-report"
                component={ErrorReport}
              />
              <PrivateRoute exact path="/add-report" component={AddReport} />
              <PrivateRoute
                exact
                path="/edit-report/:id"
                component={EditReport}
              />
            </Layout>
          </Switch>
        </ScrollToTop>
      </Router>
      </ThemeContextProvider>
    </userContext.Provider>
  ) : (
    <userContext.Provider
      value={{
        user: user,
        UpdateUserContext: UpdateUserContext,
      }}
    >
      <Router>
        <ReactNotifications />
        <ScrollToTop>
          <Switch>
            <BeforeLoginRoute exact path="/login" component={Login} />
            <Layout location_props={props}>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/materiality-map" component={MaterialityMap} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={editProfile}
              />
              <PrivateRoute
                exact
                path="/change-password"
                component={changePassword}
              />

              <PrivateRoute exact path="/team" component={Team} />
              <PrivateRoute exact path="/add-team" component={Addteam} />
              <PrivateRoute exact path="/edit-team/:id" component={Editteam} />
              <PrivateRoute
                exact
                path="/edit-collaborator/:id"
                component={EditCollaborator}
              />
              <PrivateRoute exact path="/facility" component={Facility} />
              <PrivateRoute
                exact
                path="/add-facility"
                component={addFacility}
              />
              <PrivateRoute
                exact
                path="/edit-facility/:id"
                component={EditFacility}
              />
              <PrivateRoute exact path="/report" component={Report} />
              <PrivateRoute
                exact
                path="/error-report"
                component={ErrorReport}
              />
              <PrivateRoute exact path="/add-report" component={AddReport} />
              <PrivateRoute
                exact
                path="/edit-report/:id"
                component={EditReport}
              />
            </Layout>
          </Switch>
        </ScrollToTop>
      </Router>
    </userContext.Provider>
  );
};

export default App;
