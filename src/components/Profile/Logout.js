import React, { useState, useEffect } from "react";

const Login = (props) => {
  useEffect(() => {
    props.history.push("/login");
  }, []);

  return <></>;
};

export default Login;
