/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";

const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({});
  const [message, setMessage] = useState("");

  const isFormValid = () => {
    if (message) {
      CreateNotification("danger", message);
    } else {
      var regex_email = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";
      if (!data.role) {
        setError({ role: "Type is required!" });
        return false;
      } else if (!data.first_name) {
        setError({ first_name: "First name is required!" });
        return false;
      } else if (!data.last_name) {
        setError({ last_name: "Last name is required!" });
        return false;
      } else if (!data.email) {
        setError({ email: "Email is required!" });
        return false;
      } else if (data.email && !data.email.match(regex_email)) {
        setError({ email: "Enter a valid email" });
        CreateNotification("danger", "Please enter a valid email!");
        return false;
      } else if (!data.phone) {
        setError({ phone: "Phone no. is required!" });
        return false;
      } else {
        setError({});
        return true;
      }
    }
  };
  const handleSubmit = async () => {
    const isValid = isFormValid();

    if (isValid) {
      const Response = await USERAPI.CreateTeamAPI(data);
      if (Response.data.status === 200) {
        CreateNotification("success", "Team Member added Successfully.");
        props.history.push("/team");
      } else if (Response.data.status === 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification("danger", Response.data.message);
      }
    }
  };

  const onchange = async (event) => {
    setError({});

    const value = event.target.value.trimStart().replace(/ {2,}/g, " ");
    const name = event.target.name;
    if (event.target.name === "subdomain") {
      setData((prevState) => ({
        ...prevState,
        [name]: value
          .trim()
          .replace(/ {2,}/g, " ")
          .split(" ")
          .join("-")
          .toLowerCase(),
      }));
    } else {
      setData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const GetLicenceData = async () => {
    const Response = await USERAPI.getAddLicenceAPI();

    if (Response.data.status === 200) {
      if (Response.data.message) {
        setMessage(Response.data.message);
        CreateNotification("danger", Response.data.message);
      }
    } else if (Response.data.status === 401) {
      CreateNotification("danger", "Session has been expired!");
      localStorage.clear();
      props.history.push("/login");
    } else {
      CreateNotification(
        "danger",
        "Something went wrong, please try again later!"
      );
    }
  };

  useEffect(() => {
    GetLicenceData();
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setData({
        licence_type: userData.licence_type,
        subdomain: userData.subdomain,
        category: userData.category,
        company: userData.company,
        bio: userData.bio,
      });
    }
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="tp-box">
        <h3 className="h3">Add Team</h3>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            {/* <div className="card-header">
            <h5 className="card-title">Form row</h5>
            <h6 className="card-subtitle text-muted">Bootstrap column layout.</h6>
          </div> */}
            <div className="card-body">
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="role">
                    Select Type
                  </label>
                  <select
                    name="role"
                    id="role"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select Type..</option>
                    <option value="2">Admin</option>
                    <option value="3">Collaborator</option>
                  </select>
                  <span className="form-error">{error.role}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.first_name}</span>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.last_name}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.email}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="phone">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Phone No."
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.phone}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit();
                }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
