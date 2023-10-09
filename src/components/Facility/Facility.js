import React, { useState, useEffect } from "react";
import * as facilityApi from "../../api/facilityApi";
import { CreateNotification } from "../../Utils/notification";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";

const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({ email: "", password: "" });
  const [activePage, setactivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const getFacilty = async (pagenumber = 1) => {
    const Response = await facilityApi.getFacilityAPI(pagenumber, perPage);

    if (Response.data.status === 200) {
      setData(Response.data.data);
      setTotal(Response.data.total);
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
    getFacilty();
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="tp-box">
        <h1 className="h3">Facility List</h1>
      </div>
      <div className="tp-box">
        <div className="row">
          <div className="col-12 col-xl-12">
            <div className="card">
              {/* <div className="card-header">
              <h5 className="card-title">Striped Rows</h5>
              <h6 className="card-subtitle text-muted">Use <code>.table-striped</code> to add zebra-striping to any
                table row within the <code>&lt;tbody&gt;</code>.</h6>
            </div> */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Facility id</th>
                    <th>Facility Info</th>
                    <th>City</th>

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
                        <td>{value.facility_id}</td>
                        <td>{value.info}</td>
                        <td>{value.city ? value.city : ""}</td>

                        <td>{value.created_at}</td>
                        <td className="table-action">
                          <Link to={`/edit-facility/${value._id}`}>
                            <i
                              className="align-middle fa fa-pencil"
                              data-feather="edit-2"
                            />
                          </Link>
                          {/* <a href="#"><i className="align-middle" data-feather="trash" /></a> */}
                        </td>
                      </tr>
                    ))}
                  {data && data.length === 0 && (
                    <tr>
                      <td className="centre" colSpan={7}>
                        No Data Found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div id="pagination">
                <Pagination
                  itemClass="page-item"
                  linkClass="page-link"
                  activePage={activePage}
                  itemsCountPerPage={perPage}
                  totalItemsCount={total}
                  pageRangeDisplayed={5}
                  onChange={(e) => {
                    getFacilty(e);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
