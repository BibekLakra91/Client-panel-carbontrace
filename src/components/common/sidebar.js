import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { ThemeContext } from "../../theme";
const sidebBar = {
  dashboard: false,
  facility: false,
  report: false,
  team: false,
};

const Sidebar = (props) => {
  var user_data = JSON.parse(localStorage.getItem("userData"));

  var context = useContext(userContext);
  const [toggle, setToggle] = useState(sidebBar);

  useEffect(() => {
    if (user_data) {
      context.UpdateUserContext(user_data);
    }
  }, []);
  const onToggle = (name) => {
    switch (name) {
      case "facility": {
        // $("#facility").toggleClass("show");
        let obj = { ...toggle };
        if (obj[name]) obj[name] = !obj[name];
        else {
          obj = { ...sidebBar };
          obj[name] = true;
        }
        setToggle(obj);
        break;
      }
      case "team": {
        // $("#pages").toggleClass("show");
        let obj = { ...toggle };
        if (obj[name]) obj[name] = !obj[name];
        else {
          obj = { ...sidebBar };
          obj[name] = true;
        }
        setToggle(obj);
        break;
      }
      case "report": {
        // $("#co2").toggleClass("show");
        let obj = { ...toggle };

        if (obj[name]) obj[name] = !obj[name];
        else {
          obj = { ...sidebBar };
          obj[name] = true;
        }

        setToggle(obj);
        break;
      }

      default:
        return;
    }
  };

  const location = useLocation();

  const active = location.pathname;

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav id="sidebar" className={`sidebar sidebar-${theme}`}>
      <div className="sidebar-content js-simplebar">
        <Link className={`sidebar-brand`} to="/">
          {/* <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
            <path d="M19.4,4.1l-9-4C10.1,0,9.9,0,9.6,0.1l-9,4C0.2,4.2,0,4.6,0,5s0.2,0.8,0.6,0.9l9,4C9.7,10,9.9,10,10,10s0.3,0,0.4-0.1l9-4
          C19.8,5.8,20,5.4,20,5S19.8,4.2,19.4,4.1z" />
            <path d="M10,15c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5
          c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,15,10.1,15,10,15z" />
            <path d="M10,20c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5
          c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,20,10.1,20,10,20z" />
          </svg> */}
          <span className="align-middle me-3">
            {context.user.role === 2
              ? `${process.env.REACT_APP_A_TITLE} Panel`
              : `${process.env.REACT_APP_C_TITLE} Panel`}
          </span>
        </Link>
        <ul className="sidebar-nav">
          <li className={"sidebar-item " + (active === "/" ? "active" : "")}>
            <Link to="/" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" />{" "}
              <span className="align-middle">Dashboards</span>
            </Link>
          </li>
          <li className={"sidebar-item " + (active === "/" ? "active" : "")}>
            <Link to="/" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" />{" "}
              <span className="align-middle">Advanced Analytics</span>
            </Link>
          </li>
          <li className={"sidebar-item " + (active === "/" ? "active" : "")}>
            <Link to="/" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" />{" "}
              <span className="align-middle">Recommendation Engine</span>
            </Link>
          </li>
          <li
            className={`sidebar-item ${
              active === "/facility" || active === "/add-facility"
                ? "active"
                : ""
            }`}>
            <a
              data-bs-toggle={"collapse "}
              className={
                "sidebar-link collapsed " + (toggle["facility"] ? "active" : "")
              }
              onClick={() => {
                onToggle("facility");
              }}>
              <i className="align-middle fa fa-building" />{" "}
              <span className="align-middle">Facility</span>
            </a>

            <ul
              id="facility"
              className={`sidebar-dropdown list-unstyled collapse ${
                toggle["facility"]
                  ? // active === "/facility" ||
                    // active === "/add-facility"
                    "show"
                  : ""
              }`}
              data-bs-parent="#sidebar">
              <li
                className={`sidebar-item ${
                  active === "/facility" ? "active" : ""
                }`}>
                <Link className="sidebar-link" to="/facility">
                  Facility
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  active === "/add-facility" ? "active" : ""
                }`}>
                <Link className="sidebar-link" to="/add-facility">
                  Add Facility
                </Link>
              </li>
            </ul>
          </li>
          <li
            className={`sidebar-item ${
              active == "/report" || active == "/add-report" ? "active" : ""
            }`}>
            <a
              data-bs-toggle={"collapse "}
              className={
                "sidebar-link collapsed " + (toggle["report"] ? "active" : "")
              }
              onClick={() => {
                onToggle("report");
              }}>
              <i className="align-middle fa fa-file" />{" "}
              <span className="align-middle">CO2 Report</span>
            </a>

            <ul
              id="CO2"
              className={`sidebar-dropdown list-unstyled collapse ${
                toggle["report"]
                  ? // active == "/report" ||
                    // active == "/add-report"
                    "show"
                  : ""
              }`}
              data-bs-parent="#sidebar">
              <li
                className={`sidebar-item ${
                  active == "/report" ? "active" : ""
                }`}>
                <Link className="sidebar-link" to="/report">
                  CO2 Report
                </Link>
              </li>
              <li
                className={`sidebar-item ${
                  active == "/add-report" ? "active" : ""
                }`}>
                <Link className="sidebar-link" to="/add-report">
                  Add CO2 Report
                </Link>
              </li>
            </ul>
          </li>
          <li
            className={
              "sidebar-item " + (active === "/materiality-map" ? "active" : "")
            }>
            <Link to="/materiality-map" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" />{" "}
              <span className="align-middle">Materiality Map</span>
            </Link>
          </li>
          {context.user.role == 2 && (
            <>
              <li
                className={`sidebar-item ${
                  active == "/team" || active == "/add-team" ? "active" : ""
                }`}>
                <a
                  data-bs-toggle={"collapse "}
                  className={
                    "sidebar-link collapsed " + (toggle["team"] ? "active" : "")
                  }
                  onClick={() => {
                    onToggle("team");
                  }}>
                  <i className="align-middle fa fa-user" />{" "}
                  <span className="align-middle">Team</span>
                </a>

                <ul
                  id="pages"
                  className={`sidebar-dropdown list-unstyled collapse ${
                    toggle["team"]
                      ? // || active == "/team" || active == "/add-team"
                        "show"
                      : ""
                  }`}
                  data-bs-parent="#sidebar">
                  <li
                    className={
                      active == "/team" ? "sidebar-item active" : "sidebar-item"
                    }>
                    <Link className="sidebar-link" to="/team">
                      Team list
                    </Link>
                  </li>
                  <li
                    className={`sidebar-item ${
                      active === "/add-team" ? "active" : ""
                    }`}>
                    <Link className="sidebar-link" to="/add-team">
                      Add Team
                    </Link>
                  </li>
                </ul>
              </li>

              {/* <li className={(active == '/collaborator' || active == '/add-collaborator') ?"sidebar-item active":"sidebar-item"} >
            <a data-bs-toggle="collapse" className="sidebar-link collapsed" onClick={()=>{onToggleCollaborator()}}>
              <i className="align-middle fa fa-users"/> <span className="align-middle">Collaborator</span>
            </a>
            <ul id="collaborator" className={(active == '/collaborator' || active == '/add-collaborator') ?"sidebar-dropdown list-unstyled collapse show":"sidebar-dropdown list-unstyled collapse"} data-bs-parent="#sidebar">
              <li className={(active == '/collaborator') ?"sidebar-item active":"sidebar-item"}>
                <Link className="sidebar-link" to="/collaborator">Collaborator list</Link>
                </li>
              <li className={(active == '/add-collaborator') ?"sidebar-item active":"sidebar-item"}>
                <Link className="sidebar-link" to="/add-collaborator">Add Collaborator</Link>
                </li>
            </ul>
          </li> */}
            </>
          )}
          {/* <li className="sidebar-item">
            <a href="basic-form.html" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h"/> <span className="align-middle">Basic Form</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="advance-form.html" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" /> <span className="align-middle">Advance Form</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="table.html" className="sidebar-link">
              <i className="align-middle fa fa-sliders-h" /> <span className="align-middle">Bootstrap Table</span>
            </a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
