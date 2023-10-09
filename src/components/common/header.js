/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useRef, useState } from "react";
import { userContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import $ from "jquery";
import ReactSwitch from "react-switch";
import { ThemeContext } from "../../theme";

const Header = (props) => {
  var context = useContext(userContext);
  var user_data = JSON.parse(localStorage.getItem("userData"));

  const dropdownRef = useRef(null); // Ref for the dropdown menu
  const toggleRef = useRef(null); // Ref for the toggle element

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user_data) {
      context.UpdateUserContext(user_data);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        // Click occurred outside the open dropdown menu
        setIsDropdownOpen(false); // Close the dropdown menu
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  const onToggleSidebar = async () => {
    $("#sidebar").toggleClass("collapsed");
  };

  const onToggleProfile = async () => {
    // $("#profile_toggle").toggleClass("show");
    setIsDropdownOpen((prevState) => !prevState);
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`navbar navbar-${theme} navbar-expand bg-${theme}`}>
      <a
        className="sidebar-toggle"
        onClick={() => {
          onToggleSidebar();
        }}>
        <i className="hamburger align-self-center" />
      </a>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
          <div className="switch ">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"></path>
            </svg>
            <ReactSwitch
              onChange={toggleTheme}
              checked={theme === "dark"}
              defaultChecked
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={30}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
              id="material-switch"
            />
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
            </svg>
          </div>
          <li className="nav-item dropdown">
            <a
              className="nav-icon dropdown-toggle d-inline-block d-sm-none"
              href="#"
              data-bs-toggle="dropdown">
              <i className="align-middle" data-feather="settings" />
            </a>
            <a
              onClick={() => {
                onToggleProfile();
              }}
              ref={toggleRef}
              className="nav-link dropdown-toggle d-none d-sm-inline-block"
              data-bs-toggle="dropdown">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${context.user.profile_img}`}
                className="avatar img-fluid rounded-circle me-1"
                alt="Chris Wood"
              />{" "}
              <span className="text-dark">
                {context.user.first_name} {context.user.last_name}
              </span>
            </a>
            <div
              // onClick={() => {
              //   onToggleProfile();
              // }}
              ref={dropdownRef}
              id="profile_toggle"
              className={`dropdown-menu dropdown-menu-end ${
                isDropdownOpen ? "show" : ""
              }`}>
              <Link className="dropdown-item" to="/profile">
                <i className="align-middle me-1 fa fa-user" />
                Profile
              </Link>
              <Link className="dropdown-item" to="/change-password">
                <i className="align-middle me-1 fa fa-cogs" />
                Setting
              </Link>

              <a
                onClick={() => {
                  handleLogout();
                }}
                className="dropdown-item">
                <i className="align-middle me-1 fa fa-sign-out" />
                Sign out
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
