import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";

const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({});

  const getLicence = async () => {
    const Response = await USERAPI.getLicenceAPI(data);

    if (Response.data.status == 200) {
      setData(Response.data.data);
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
    getLicence();
  }, []);

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Licence List</h4>
          <p className="card-description">
            {/* Add class <code>.table-striped</code> */}
          </p>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>License name</th>
                  <th>No. of Client</th>
                  <th>No. of Collaborator</th>
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
                      <td>{value.name}</td>
                      <td>{value.no_client}</td>
                      <td>{value.no_collaborator}</td>
                      <td>{value.created_at}</td>
                      <td>
                        <span className="icon_act">
                          <Link to={`/edit-licence/${value._id}`}>
                            <i className="mdi mdi-pencil-box"></i>
                          </Link>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
