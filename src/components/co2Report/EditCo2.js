import React, { useState, useEffect } from "react";
import * as reportApi from "../../api/reportApi";
import { CreateNotification } from "../../Utils/notification";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
var dateFormat = require("dateformat");

const Dashboard = (props) => {
  let userData = JSON.parse(localStorage.getItem("userData"));

  const [error, setError] = useState({});
  const [data, setData] = useState({ subdomain: userData.subdomain });
  const [facility, setFacility] = useState([]);
  const [unit, setUnit] = useState([]);
  const [scope, setScope] = useState([]);
  const [egrid, setEgrid] = useState([]);
  const [zip, setZip] = useState([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState([]);
  const [name, setFuel] = useState([]);
  const [sub_category, setSubCategory] = useState([]);

  useEffect(() => {
    console.log("data =>", data);
  }, [data]);
  const isFormValid = () => {
    if (!data.facility_id) {
      setError({ facility_id: "Facility id is required!" });
      return false;
    } else if (!data.name) {
      setError({ name: "This field is required!" });
      return false;
    } else if (data.co2_factor && data.co2_factor < 0) {
      setError({ co2_factor: "Please enter valid value!" });
      return false;
    } else if (data.co2_factor && !data.co2_unit) {
      setError({ co2_unit: "Please select CO2 unit!" });
      return false;
    } else if (data.ch4_factor && data.ch4_factor < 0) {
      setError({ ch4_factor: "Please enter valid value!" });
      return false;
    } else if (data.ch4_factor && !data.ch4_unit) {
      setError({ ch4_unit: "Please select CH4 unit!" });
      return false;
    } else if (data.n2o_factor && data.n2o_factor < 0) {
      setError({ n2o_factor: "Please enter valid value!" });
      return false;
    } else if (data.n2o_factor && !data.n2o_unit) {
      setError({ n2o_unit: "Please select N2O unit!" });
      return false;
    } else if (data.ar4 && data.ar4 < 0) {
      setError({ ar4: "Please enter valid value!" });
      return false;
    } else if (data.ar5 && data.ar5 < 0) {
      setError({ ar5: "Please enter valid value!" });
      return false;
    } else if (!data.quantity) {
      setError({ quantity: "This field is required!" });
      return false;
    } else if (data.quantity <= 0) {
      setError({ quantity: "Please enter valid value!" });
      return false;
    } else if (!data.date) {
      setError({ date: "Please select date!" });
      return false;
    } else {
      setError({});
      return true;
    }
  };

  const handleSubmit = async () => {
    const isValid = await isFormValid();

    if (isValid) {
      let id = props.match.params.id;

      const Response = await reportApi.updateReportAPI(data, id);
      if (Response.data.status == 200) {
        CreateNotification("success", Response.data.message);
      } else if (Response.data.status == 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification("danger", Response.data.message);
      }
    }

    // props.history.push('/')
  };

  const GetScopeCategoryData = async (id) => {
    const Response = await reportApi.GetScopeCategoryData(id);

    if (Response.data.status == 200) {
      setCategory(Response.data.data);
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

  const GetFuelData = async (id) => {
    const Response = await reportApi.GetFuelData(id);

    if (Response.data.status == 200) {
      setFuel(Response.data.data);
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
    if (event.target.name == "name") {
      setData((prevState) => ({
        ...prevState,
        heat_content: "",
        co2_factor: "",
        ch4_factor: "",
        n2o_factor: "",
        biogenic: "",
        biofuel: "",
        formula: "",
        gas: "",
        chemical_name: "",
        ar4: "",
        ar5: "",
        unit: "",
      }));

      GetEmissionData(event.target.value);
    }
    if (
      event.target.value == "611ba1fcfceb43977507521a" ||
      event.target.value == "611ba1fcfceb43977507525a"
    ) {
      setUnit([
        { _id: "Btu" },
        { _id: "mmBtu" },
        { _id: "therm" },
        { _id: "kWh" },
        { _id: "MWh" },
        { _id: "MJ" },
        { _id: "GJ" },
      ]);
    } else if (event.target.value == "611ba1fcfceb43977507523a") {
      setUnit([
        { _id: "gal (US)" },
        { _id: "L" },
        { _id: "bbl" },
        { _id: "scf" },
        { _id: "ccf" },
        { _id: "m3" },
      ]);
    } else if (event.target.value == "611ba1fcfceb43977507526a") {
      setUnit([
        { _id: "passenger-mile" },
        { _id: "passenger-km" },
        { _id: "nautical mile" },
        { _id: "mile" },
        { _id: "km" },
        { _id: "vehicle-mile" },
        { _id: "vehicle-km" },
        { _id: "ton-mile" },
        { _id: "tonne-km" },
      ]);
    } else {
      GetReportData();
    }

    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const GetEmissionData = async (id) => {
    const Response = await reportApi.GetEmissionData(id);

    if (Response.data.status == 200) {
      console.log(Response.data.data, "subcat");
      Response.data.data.name = id;
      Response.data.data.category = data.category;
      Response.data.data.sub_category = data.sub_category;
      Response.data.data.scope_id = data.scope_id;
      Response.data.data.custom_factor = data.custom_factor;
      let final = Object.assign(data, Response.data.data);
      setData(final);
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

  const GetReportData = async () => {
    let id = props.match.params.id;
    const Response = await reportApi.GetReportData();

    if (Response.data.status == 200) {
      setUnit(Response.data.data);
      setScope(Response.data.scopes);
      setFacility(Response.data.facility);
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

  const getSingleReport = async () => {
    let id = props.match.params.id;
    const Response = await reportApi.getSingleReportAPI(id);

    if (Response.data.status == 200) {
      Response.data.data.date = dateFormat(
        Response.data.data.date,
        "yyyy-mm-dd"
      );
      setData(Response.data.data);
      console.log("Response.data", Response.data);
      setCategory(Response.data.category);
      setFuel(Response.data.emissions);
      setSubCategory(Response.data.subcategory);
      // GetSingleegridData(Response.data.data.grid_region)
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
    GetReportData();
    getSingleReport();
  }, []);

  console.log(dateFormat(data.date, "yyyy-mm-dd"), "hello");
  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Edit CO2 Report</h1>
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
                  <label className="form-label" htmlFor="facility_id">
                    Facility Id
                  </label>
                  <select
                    name="facility_id"
                    id="facility_id"
                    value={data.facility_id}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select Facility Id..</option>
                    {facility &&
                      facility.length > 0 &&
                      facility.map((value, index) => (
                        <option value={value._id}>{value.facility_id}</option>
                      ))}
                  </select>
                  <span class="form-error">{error.facility_id}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="custom_factor">
                    Custom Emission Factors?
                  </label>
                  <select
                    name="custom_factor"
                    id="custom_factor"
                    value={data.custom_factor}
                    className="form-control"
                    disabled>
                    <option value="">Select Factor..</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <span class="form-error">{error.custom_factor}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="scope_id">
                    Scope
                  </label>
                  <select
                    name="scope_id"
                    id="scope_id"
                    value={data.scope_id}
                    value={data.scope_id}
                    className="form-control"
                    disabled>
                    <option value="">Select Scope..</option>
                    {scope &&
                      scope.length > 0 &&
                      scope.map((value, index) => (
                        <option value={value._id}>{value.name}</option>
                      ))}
                  </select>
                  <span class="form-error">{error.scope_id}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={data.category}
                    value={data.category}
                    className="form-control"
                    disabled>
                    <option value="">Select Category..</option>
                    {category &&
                      category.length > 0 &&
                      category.map((value, index) => (
                        <option value={value._id}>{value.name}</option>
                      ))}
                  </select>
                  <span class="form-error">{error.category}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="sub_category">
                    Subcategory
                  </label>
                  <select
                    value={data.sub_category}
                    name="sub_category"
                    id="sub_category"
                    className="form-control"
                    disabled>
                    <option value="">Select Subcategory..</option>
                    {sub_category &&
                      sub_category.length > 0 &&
                      sub_category.map((value, index) => (
                        <option value={value._id}>{value.name}</option>
                      ))}
                  </select>
                  <span class="form-error">{error.sub_category}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="name">
                    Fuel/Name
                  </label>
                  <select
                    name="name"
                    value={data.name}
                    id="name"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select..</option>
                    {name &&
                      name.length > 0 &&
                      name.map((value, index) => (
                        <option value={value._id}>{value.name}</option>
                      ))}
                  </select>

                  <span class="form-error">{error.name}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="co2_factor">
                    CO2 Factor
                  </label>
                  <input
                    type="number"
                    value={data.co2_factor}
                    name="co2_factor"
                    id="co2_factor"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="CO2 Factor"
                  />
                  <span class="form-error">{error.co2_factor}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="co2_unit">
                    CO2 Unit
                  </label>
                  <select
                    name="co2_unit"
                    id="co2_unit"
                    value={data.co2_unit}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select CO2 Unit</option>
                    <option value="Kg">Kg</option>
                    <option value="Gm">Gm</option>
                  </select>
                  <span class="form-error">{error.co2_unit}</span>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="ch4_factor">
                    CH4 Factor
                  </label>
                  <input
                    type="number"
                    name="ch4_factor"
                    value={data.ch4_factor}
                    id="ch4_factor"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="CH4 Factor"
                  />
                  <span class="form-error">{error.ch4_factor}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="ch4_unit">
                    CH4 Unit
                  </label>
                  <select
                    name="ch4_unit"
                    id="ch4_unit"
                    value={data.ch4_unit}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select CH4 Unit</option>
                    <option value="Kg">Kg</option>
                    <option value="Gm">Gm</option>
                  </select>
                  <span class="form-error">{error.ch4_unit}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="n2o_factor">
                    N2O Factor
                  </label>
                  <input
                    type="number"
                    name="n2o_factor"
                    value={data.n2o_factor}
                    id="n2o_factor"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="N2O Factor"
                  />
                  <span class="form-error">{error.n2o_factor}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="n2o_unit">
                    N2O Unit
                  </label>
                  <select
                    name="n2o_unit"
                    id="n2o_unit"
                    value={data.n2o_unit}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select N2O Unit</option>
                    <option value="Kg">Kg</option>
                    <option value="Gm">Gm</option>
                  </select>
                  <span class="form-error">{error.n2o_unit}</span>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="heat_content">
                    Heat Content
                  </label>
                  <input
                    type="text"
                    value={data.heat_content}
                    name="heat_content"
                    id="heat_content"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="Heat Content"
                  />
                  <span class="form-error">{error.heat_content}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="biogenic">
                    Biogenic
                  </label>
                  <input
                    type="number"
                    name="biogenic"
                    value={data.biogenic}
                    id="biogenic"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="Biogenic CO2 Factor"
                  />
                  <span class="form-error">{error.biogenic}</span>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="biofuel">
                    Biofuel?
                  </label>
                  <select
                    name="biofuel"
                    id="biofuel"
                    value={data.biofuel}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select..</option>
                    <option value="Yes">Yes</option>
                  </select>
                  <span class="form-error">{error.biofuel}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="formula">
                    Formula
                  </label>
                  <input
                    type="text"
                    name="formula"
                    id="formula"
                    value={data.formula}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="Formula"
                  />
                  <span class="form-error">{error.biogenic}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="gas">
                    Gas
                  </label>
                  <input
                    type="text"
                    name="gas"
                    id="gas"
                    value={data.gas}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="Gas"
                  />
                  <span class="form-error">{error.gas}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="chemical_name">
                    Chemical Name
                  </label>
                  <input
                    type="text"
                    name="chemical_name"
                    id="chemical_name"
                    value={data.chemical_name}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="Chemical Name"
                  />
                  <span class="form-error">{error.chemical_name}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="ar4">
                    Ar4
                  </label>
                  <input
                    type="text"
                    name="ar4"
                    id="ar4"
                    value={data.ar4}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="AR4(kgCO2e)"
                  />
                  <span class="form-error">{error.ar4}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="ar5">
                    Ar5
                  </label>
                  <input
                    type="text"
                    name="ar5"
                    id="ar5"
                    value={data.ar5}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                    placeholder="AR5(kgCO2e)"
                  />
                  <span class="form-error">{error.ar5}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={data.quantity}
                    placeholder="Quantity"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span class="form-error">{error.quantity}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="unit">
                    Unit
                  </label>
                  <select
                    name="unit"
                    id="unit"
                    value={data.unit}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select Unit..</option>
                    {unit &&
                      unit.length > 0 &&
                      unit.map((value, index) => (
                        <option value={value._id}>{value._id}</option>
                      ))}
                  </select>
                  <span class="form-error">{error.unit}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={data.date}
                    placeholder="date"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span class="form-error">{error.date}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="verifier">
                    Need to verify this?
                  </label>
                  <select
                    name="verifier"
                    id="verifier"
                    value={data.verifier}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select..</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <span className="form-error">{error.verifier}</span>
                </div>
              </div>

              {data.verifier == "Yes" &&
                data.verifier_email !== null &&
                data.verifier_name !== null && (
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label className="form-label" htmlFor="email">
                        Verifier Name
                      </label>
                      <input
                        type="text"
                        value={data.verifier_name}
                        name="verifier_name"
                        id="verifier_name"
                        placeholder="Verifier Name"
                        onChange={(e) => {
                          onchange(e);
                        }}
                        className="form-control"
                      />
                      <span className="form-error">{error.verifier_name}</span>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label" htmlFor="verifier_email">
                        Verifier Email
                      </label>
                      <input
                        type="email"
                        value={data.verifier_email}
                        name="verifier_email"
                        id="verifier_email"
                        placeholder="Verifier Email"
                        onChange={(e) => {
                          onchange(e);
                        }}
                        className="form-control"
                      />
                      <span className="form-error">{error.verifier_email}</span>
                    </div>
                  </div>
                )}

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
