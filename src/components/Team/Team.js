/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";
import { Link } from "react-router-dom";
const Dashboard = (props) => {
  const [data, setData] = useState({ email: "", password: "" });

  const getClient = async () => {
    const Response = await USERAPI.getTeamAPI(data);

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

  useEffect(() => {
    getClient();
  }, []);

  return (
    <div className="container-fluid p-0 ">
      <div className="tp-box">
        <h3 className="h3">Team List</h3>
      </div>
      <div className="tp-box">
        <div className="row">
          <div className="col-12 col-xl-12">
            <div className="card">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone no.</th>
                    <th>Type</th>

                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((value, index) => (
                      <tr>
                        <td className="py-1">{index + 1}</td>
                        <td>
                          {value.first_name} {value.last_name}
                        </td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>
                          {value.role === 2
                            ? "Admin"
                            : value.role === 3
                            ? "Collaborator"
                            : "Verifier"}
                        </td>

                        <td>{value.created_at}</td>
                        <td className="table-action">
                          <Link to={`/edit-team/${value._id}`}>
                            <i
                              className="align-middle fa fa-pencil"
                              data-feather="edit-2"
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
