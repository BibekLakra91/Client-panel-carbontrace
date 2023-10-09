import React, { useState, useEffect } from "react";
import * as reportApi from "../../api/reportApi";
import { CreateNotification } from "../../Utils/notification";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

var dateFormat = require("dateformat");

const ErrorReport = (props) => {
  const [data, setData] = useState({ email: "", password: "" });
  const [activePage, setactivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [ErrorModal, setErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState([]);

  const history = useHistory();

  const getErrorReport = async (pagenumber = 1) => {
    const Response = await reportApi.getErrorReportAPI(pagenumber, perPage);

    if (Response.data.status == 200) {
      setactivePage(pagenumber);

      setData(Response.data.data);
      setTotal(Response.data.total);
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
  const ExportErrorReport = async () => {
    const Response = await reportApi.ExportErrorCsvAPI();

    if (Response.data.status == 200) {
      // setData(Response.data.data);
      const anchor = document.createElement("a");
      anchor.href = Response.data.data;
      anchor.download = "errorReport.csv";

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
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
    getErrorReport();
  }, []);

  const setModal = (idx) => {
    setErrorModal(true);
    if (data && data.length) {
      setCurrentError(data[idx].error);
    }
  };

  const getErrorList = () => {
    const data = currentError;
    return data && data.length ? (
      <dl>
        {data.map((val, idx) => {
          return (
            <React.Fragment key={idx}>
              <dt>{val.messageType}</dt>
              <dd>{val.messageText}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    ) : null;
  };

  return (
    <div className="container-fluid p-0">
      <div className="row mb-2 mb-xl-3">
        <div className="col-auto d-none d-sm-block">
          <h3>CO2 Error Report</h3>
        </div>
        {/* <div className="col-auto ms-auto text-end mt-n1">
          <button
            className="btn btn-primary shadow-sm me-2"
            onClick={() => {
              ExportErrorReport();
            }}
          >
            <i className="align-middle me-2 fa fa-download"></i>Export
          </button>
        </div> */}
      </div>

      <div className="row">
        <div className="col-12 col-xl-12">
          <Modal open={ErrorModal} onClose={() => setErrorModal(false)} center>
            {getErrorList()}
          </Modal>
        </div>
      </div>

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
                  <th>Scope</th>
                  <th>Category</th>
                  <th>Name</th>
                  {/* <th>CO2 Equivalent</th> */}
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((value, index) => (
                    <tr key={"report " + index}>
                      <td className="py-1">{index + 1}</td>
                      <td>{value.facility_id}</td>
                      <td>{value.scope_id}</td>
                      <td>{value.category}</td>
                      <td>{value.name}</td>
                      {/* <td>{value.equivalent}</td> */}
                      <td>
                        {value.status == 1
                          ? "Accepted"
                          : value.status == 2
                          ? "Rejected"
                          : "Pending"}
                      </td>

                      <td>{dateFormat(value.date, "mm-dd-yyyy")}</td>
                      {value.error && value.error.length ? (
                        <td
                          className="table-action"
                          onClick={() => setModal(index)}>
                          <i
                            className="align-middle fa fa-exclamation-triangle"
                            data-feather="edit-2"
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))}
                {data && data.length == 0 && (
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
                  getErrorReport(e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorReport;
