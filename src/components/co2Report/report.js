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
import { SummaryExportCsvAPI } from "../../api/reportApi";
import { Spinner } from "reactstrap";

var dateFormat = require("dateformat");

const Report = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({ email: "", password: "" });
  const [activePage, setactivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [importedReports, setImportedReports] = useState([]);
  const history = useHistory();

  useEffect(() => {
    console.log("data ============> ", data);
  }, [data]);
  const getReport = async (pagenumber = 1) => {
    const Response = await reportApi.getReportAPI(pagenumber, perPage);

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

  const uploadReport = async (file) => {
    try {
      if (file) {
        const form = new FormData();
        form.append("image", file);
        const Response = await reportApi.ImportCsvAPI(form);

        if (Response.status === 200) {
          const data = Response.data.data;
          CreateNotification("success", Response.message);

          setImportedReports(data);

          getReport();
          setIsOpen(true);
        } else if (Response.data.status === 400) {
          CreateNotification("danger", Response.message);
        }
      } else {
        throw new Error("Please Upload File");
      }
    } catch (error) {
      CreateNotification("danger", error.message);
    }
  };

  const ExportReport = async () => {
    const Response = await reportApi.ExportCsvAPI(startDate, endDate);

    if (Response.data.status === 200) {
      // setData(Response.data.data);
      const anchor = document.createElement("a");
      anchor.href = Response.data.data;
      anchor.download = "data.csv";
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

  let [loading, setLoading] = useState(false);
  const exportSummaryReport = async () => {
    setLoading(true);
    const Response = await reportApi.SummaryExportCsvAPI(startDate, endDate);
    setLoading(false);
    if (Response.data.status == 200) {
      // setData(Response.data.data);

      const anchor = document.createElement("a");
      anchor.href = Response.data.data;
      anchor.download = "data.csv";

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

  const handleFiles = (e) => {
    const file = e.target.files[0];

    uploadReport(file);
  };

  useEffect(() => {
    getReport();
  }, [importedReports.length]);

  let countError = 0,
    countCorrect = 0;
  if (
    importedReports &&
    Array.isArray(importedReports) &&
    importedReports.length
  ) {
    countError = importedReports.filter((val) => val.isError).length;
    countCorrect = importedReports.length - countError;
  }

  return (
    <div className="container-fluid p-0">
      <div className="tp-box">
        <div className="row">
          <div className="col-auto d-none d-sm-block">
            <h3>CO2 Report</h3>
          </div>
          <div className="col-auto ms-auto text-end mt-n1">
            <div className="dropdown me-2 d-inline-block">
              <div className="row">
                <div className="col-md-6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                  />
                </div>
                <div className="col-md-6">
                  <DatePicker
                    placeholderText="End Date"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary shadow-sm me-2"
              onClick={() => {
                ExportReport();
              }}>
              <i className="align-middle me-2 fa fa-download"></i>Export
            </button>
            <span className="btn btn-primary shadow-sm me-2">
              <label>
                <i className="align-middle me-2 fa fa-upload"></i>Import
                <input
                  type="file"
                  accept=".csv"
                  encType="multipart/form-data"
                  onChange={handleFiles}
                  style={{ display: "none" }}
                />
              </label>
            </span>
            <button
              className="ml-2 btn btn-primary shadow-sm"
              onClick={() => {
                exportSummaryReport();
              }}>
              <i className="align-middle me-2 fa fa-download"></i>Summary Export
            </button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="spinner-wrapper">
          <Spinner color={"success"}>loading...</Spinner>
        </div>
      )}
      <div className="row">
        <div className="col-12 modal">
          <Modal open={isOpen} onClose={() => setIsOpen(false)} center>
            <div className="customModal">
              <h4 className="green" style={{ color: "green" }}>
                {countCorrect} Reports are successfully added
              </h4>
              <h4 className="red" style={{ color: "red" }}>
                {countError} Reports are Failed to add
              </h4>
            </div>
            <button
              style={{ display: countError > 0 ? "inline-block" : "none" }}
              className="btn btn-primary shadow-sm me-2"
              onClick={(e) => history.push("/error-report")}>
              View Errors
            </button>
          </Modal>
        </div>
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
                    <th width="80px">Sr. No.</th>
                    <th width="100px">Facility id</th>
                    <th width="100px">Scope</th>
                    <th>Category</th>
                    <th>Name</th>
                    <th>CO2 Equivalent</th>
                    <th>Status</th>
                    <th width="100px">Entry Date</th>
                    <th className="text-center">Approved Date</th>
                    <th className="text-center">Approved By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((value, index) => (
                      <tr key={"report " + index}>
                        <td className="py-1">{index + 1}</td>
                        <td>{value.facility_id.facility_id}</td>
                        <td>{value.scope_id.name}</td>
                        <td>{value.category.name}</td>
                        <td>{value.name.name}</td>
                        <td>{value.equivalent}</td>
                        <td>
                          <span
                            className={
                              value.status == 1
                                ? "Accepted"
                                : value.status == 2
                                ? "Rejected"
                                : "Pending"
                            }>
                            {" "}
                            {value.status == 1
                              ? "Accepted"
                              : value.status == 2
                              ? "Rejected"
                              : "Pending"}
                          </span>
                        </td>
                        <td>{dateFormat(value.date, "mm-dd-yyyy")}</td>
                        <td>
                          {value.approved_at !== undefined
                            ? dateFormat(value.approved_at, "mm-dd-yyyy")
                            : ""}
                        </td>
                        <td>
                          {value.verifier == "Yes"
                            ? value.verifier_name
                            : "Self Verified"}
                        </td>
                        <td className="table-action">
                          <Link to={`/edit-report/${value._id}`}>
                            <i
                              className="align-middle fa fa-pencil-square"
                              data-feather="edit-2"
                            />
                          </Link>
                          <span className="remove-icon">
                            <i class="fa fa-trash"></i>
                          </span>
                          {/* <a href="#"><i className="align-middle" data-feather="trash" /></a> */}
                        </td>
                      </tr>
                    ))}
                  {data && data.length == 0 && (
                    <tr>
                      <td className="centre" colSpan={10}>
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
                    getReport(e);
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

export default Report;
