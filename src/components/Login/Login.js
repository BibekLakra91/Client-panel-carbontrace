import React, { useState, useEffect } from "react";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";
import { Link } from "react-router-dom";

const Login = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({
    email: "",
    password: "",
    subdomain:
      window.location.hostname === "localhost" ||
      window.location.hostname === "3.6.114.118"
        ? "hello"
        : window.location.hostname.split(".")[0],
  });

  const isFormValid = () => {
    const { email, password } = data;

    var regex_email =
      /^(([^!<>#$%^&*()[\]\\.,;:\s@\"]+(\.[^#$%^&*!<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      setError({ email: "Email field is required!" });
      return false;
    } else if (email && !email.match(regex_email)) {
      setError({ email: "Enter a valid email" });
      return false;
    } else if (!password) {
      setError({ password: "Password field is required!" });
      return false;
    } else if (password && password.length < 4) {
      setError({ password: "Enter a valid Password." });
      return false;
    } else {
      setError({});
      return true;
    }
  };

  const handleSubmit = async () => {
    const isValid = await isFormValid();

    if (isValid) {
      console.log(data);
      const loginResponse = await USERAPI.LoginAPI(data);

      if (loginResponse.data.status === 200 && loginResponse.data.data) {
        CreateNotification("success", "Login Successfully");
        localStorage.setItem("token", loginResponse.data.data.jwt);
        localStorage.setItem(
          "userData",
          JSON.stringify(loginResponse.data.data)
        );
        props.history.push("/");
      } else {
        CreateNotification("danger", loginResponse.data.message);
      }
    }
  };

  const onchange = async (event) => {
    setError({});

    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="main d-flex justify-content-center w-100 authPage">
      <main className="content d-flex p-0">
        <div className="container d-flex flex-column">
          <div className="row h-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2">Login</h1>
                  <p className="lead">Sign in to your account to continue</p>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-4">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          name="email"
                          onChange={(e) => {
                            onchange(e);
                          }}
                          placeholder="Enter your email"
                        />
                        <span className="form-error">{error.email}</span>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          name="password"
                          onChange={(e) => {
                            onchange(e);
                          }}
                          placeholder="Enter your password"
                        />
                        <span className="form-error">{error.password}</span>

                        <small>
                          <Link to="/forgot">Forgot password?</Link>
                        </small>
                      </div>
                      <div>
                        <div className="form-check align-items-center">
                          <input
                            id="customControlInline"
                            type="checkbox"
                            className="form-check-input"
                            defaultValue="remember-me"
                            name="remember-me"
                            defaultChecked
                          />
                          <label
                            className="form-check-label text-small"
                            htmlFor="customControlInline">
                            Remember me next time
                          </label>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            handleSubmit();
                          }}>
                          Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
