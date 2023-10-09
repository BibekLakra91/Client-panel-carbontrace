import React, { useState, useEffect, useContext } from "react";
import * as collaboratorApi from "../../api/collaboratorApi";
import { CreateNotification } from "../../Utils/notification";
import { userContext } from "../../context/userContext";
import { Helmet } from "react-helmet";

const Login = (props) => {
  var context = useContext(userContext);

  const [error, setError] = useState({});
  const [data, setData] = useState({});
  const [category, setCategory] = useState({});
  const [licence, setLicence] = useState({});

  const isFormValid = () => {
    const domain_regx = /^[A-Za-z0-9-]+$/;

    var regex_email =
      /^(([^!<>#$%^&*()[\]\\.,;:\s@\"]+(\.[^#$%^&*!<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!data.current_password) {
      setError({ current_password: "Current password is required!" });
      return false;
    } else if (!data.new_password) {
      setError({ new_password: "New password is required!" });
      return false;
    } else if (!data.verify_password) {
      setError({ verify_password: "Verify password is required!" });
      return false;
    } else if (data.verify_password != data.new_password) {
      setError({
        verify_password: "New password and verify password do not match",
      });
      return false;
    } else {
      setError({});
      return true;
    }
  };
  const handleSubmit = async () => {
    console.log(data, "data");
    const isValid = await isFormValid();
    console.log(props.history, "121212");
    if (isValid) {
      let id = "";
      const Response = await collaboratorApi.changePwAPI(data, id);
      if (Response.data.status === 200) {
        CreateNotification("success", Response.data.message);
        let userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
          userData.first_name = data.first_name;
          userData.last_name = data.last_name;
          localStorage.setItem("userData", JSON.stringify(userData));
        }
        context.UpdateUserContext({
          ...context.user,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      } else if (Response.data.status === 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification("danger", Response.data.message);
      }
    }
  };

  const getSingleCLient = async () => {
    let id = "";
    const Response = await collaboratorApi.getSingleCollaboratorAPI(id);

    if (Response.data.status === 200) {
      setData(Response.data.data);
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

  const onchange = async (event) => {
    setError({});

    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onImageChange = async (event) => {
    setError({});
    const Response = await collaboratorApi.uploadImages(event.target.files);
    console.log(Response.data.data[0], "Response.data.data");
    if (Response.data.status == 200) {
      const profile_img = "profile_img";
      context.UpdateUserContext({
        ...context.user,
        profile_img: Response.data.data[0].filename,
      });
      setData((prevState) => ({
        ...prevState,
        [profile_img]: Response.data.data[0].filename,
      }));
      let userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        userData.profile_img = Response.data.data[0].filename;
        localStorage.setItem("userData", JSON.stringify(userData));
      }
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

  useEffect(() => {
    getSingleCLient();
  }, []);

  return (
    <div className="container-fluid p-0">
      <Helmet>
        <title>
          {context.user.role == 2
            ? "Admin - Change Password"
            : "Collaborator - Change Password"}
        </title>
      </Helmet>
      <h1 className="h3 mb-3">Setting</h1>
      <div className="row">
        <div className="col-md-12 col-xl-12">
          <div className="tab-content">
            <div
              className="tab-pane fade  show active"
              id="password"
              role="tabpanel">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Password</h5>
                  <div className="row">
                    <div className="col-md-8 col-sm-12">
                      <div className="mb-3">
                        <label
                          htmlFor="current_password"
                          className="form-label">
                          Current password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="current_password"
                          placeholder="Current password"
                          name="current_password"
                          onChange={(e) => {
                            onchange(e);
                          }}
                        />
                        <span className="form-error">
                          {error.current_password}
                        </span>
                        {/* <small><a href="#">Forgot your password?</a></small> */}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="new_password" className="form-label">
                          New password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="new_password"
                          placeholder="New password"
                          name="new_password"
                          onChange={(e) => {
                            onchange(e);
                          }}
                        />
                        <span className="form-error">{error.new_password}</span>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="verify_password" className="form-label">
                          Verify password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="verify_password"
                          placeholder="Verify password"
                          name="verify_password"
                          onChange={(e) => {
                            onchange(e);
                          }}
                        />
                        <span className="form-error">
                          {error.verify_password}
                        </span>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          handleSubmit();
                        }}>
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
