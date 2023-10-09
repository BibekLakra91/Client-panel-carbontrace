import React, { useState, useEffect } from "react";
import * as collaboratorApi from "../../api/collaboratorApi";
import { CreateNotification } from "../../Utils/notification";
const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({});
  const [category, setCategory] = useState({});
  const [licence, setLicence] = useState({});

  const isFormValid = () => {
    const domain_regx = /^[A-Za-z0-9-]+$/;

    var regex_email =
      /^(([^!<>#$%^&*()[\]\\.,;:\s@\"]+(\.[^#$%^&*!<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!data.first_name) {
      setError({ first_name: "First name is required!" });
      return false;
    } else if (!data.last_name) {
      setError({ last_name: "Last name is required!" });
      return false;
    } else if (!data.phone) {
      setError({ phone: "Phone no. is required!" });
      return false;
    } else {
      setError({});
      return true;
    }
  };

  const handleSubmit = async () => {
    const isValid = await isFormValid();
    console.log(props.history, "121212");
    if (isValid) {
      let id = props.match.params.id;
      const Response = await collaboratorApi.UpdateCollaboratorAPI(data, id);
      if (Response.data.status == 200) {
        CreateNotification("success", "Collaborator updated Successfully.");
      } else if (Response.data.status == 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification("danger", Response.data.message);
      }
    }
  };

  const getSingleCollaborator = async () => {
    let id = props.match.params.id;
    const Response = await collaboratorApi.getSingleCollaboratorAPI(id);

    if (Response.data.status == 200) {
      setData(Response.data.data);
      setCategory(Response.data.category);
      setLicence(Response.data.licence);
    } else if (Response.data.status == 401) {
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

  const onchange = async (event) => {
    setError({});

    const value = event.target.value.trimStart().replace(/ {2,}/g, " ");
    const name = event.target.name;
    if (event.target.name == "subdomain") {
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

  useEffect(() => {
    getSingleCollaborator();
  }, []);

  console.log(data, "11111");
  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Edit Collaborator</h1>
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
                  <label className="form-label" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={data.first_name}
                    id="first_name"
                    placeholder="First Name"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.first_name}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={data.last_name}
                    id="last_name"
                    placeholder="Last Name"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.last_name}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    placeholder="Email"
                    className="form-control"
                    readOnly
                  />
                  <span className="form-error">{error.email}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="phone">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={data.phone}
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
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
