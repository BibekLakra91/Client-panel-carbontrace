import React, { useState, useEffect } from "react";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Login = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({});

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
    } else {
      setError({});
      return true;
    }
  };
  const handleSubmit = async () => {
    const isValid = await isFormValid();

    if (isValid) {
      const loginResponse = await USERAPI.ForgotAPI(data);
      if (loginResponse.data.status === 200 && loginResponse.data.data) {
        CreateNotification("success", loginResponse.data.message);
        props.history.push("/login");
      } else {
        CreateNotification("danger", loginResponse.data.message);
      }
    }

    // props.history.push('/')
  };

  const onchange = async (event) => {
    setError({});

    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="main d-flex justify-content-center w-100 authPage">
      <Helmet>
        <title>{"Forgot Password"}</title>
      </Helmet>
      <main className="content d-flex p-0">
        <div className="container d-flex flex-column">
          <div className="row h-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2">Forgot password</h1>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-4">
                      {/* <div className="text-center">
                    <img src="img/avatars/avatar.jpg" alt="Chris Wood" className="img-fluid rounded-circle" width="132"
                      height="132" />
                  </div> */}

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
                        <small>
                          <Link to="/login">
                            Sign in to your account to continue
                          </Link>
                        </small>
                      </div>

                      <div className="text-center mt-3">
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={() => {
                            handleSubmit();
                          }}>
                          Forgot password
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
