import React, { useState, useEffect } from "react";
import * as facilityApi from "../../api/facilityApi";
import { CreateNotification } from "../../Utils/notification";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Dashboard = (props) => {
  let userData = JSON.parse(localStorage.getItem("userData"));

  const [error, setError] = useState({});
  const [data, setData] = useState({ subdomain: userData.subdomain });
  const [egrid, setEgrid] = useState([]);
  const [zip, setZip] = useState([]);
  const [message, setMessage] = useState("");

  const isFormValid = () => {
    const domain_regx = /^[A-Za-z0-9-]+$/;
    if (message) {
      CreateNotification("danger", message);
    } else {
      var regex_email =
        /^(([^!<>#$%^&*()[\]\\.,;:\s@\"]+(\.[^#$%^&*!<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!data.facility_id) {
        setError({ facility_id: "Facility id is required!" });
        return false;
      } else if (!data.grid_region) {
        setError({ grid_region: "Grid Region is required!" });
        return false;
      } else if (!data.zip) {
        setError({ zip: "Please select zipcode from search list" });
        return false;
      } else if (!data.info) {
        setError({ info: "Facility Info is required!" });
        return false;
      } else {
        setError({});
        return true;
      }
    }
  };

  const handleSubmit = async () => {
    const isValid = await isFormValid();

    if (isValid) {
      let id = props.match.params.id;

      const Response = await facilityApi.UpdateFacilityAPI(data, id);
      if (Response.data.status == 200) {
        CreateNotification("success", "Facility Updated Successfully.");
        // props.history.push('/facility')
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

  const GetSingleegridData = async (data) => {
    const Response = await facilityApi.GetSingleegridData(data);

    if (Response.data.status == 200) {
      setZip(Response.data.data);
    }
  };

  const onchange = async (event) => {
    setError({});

    const value = event.target.value.trimStart().replace(/ {2,}/g, " ");
    const name = event.target.name;
    if (event.target.name == "grid_region") {
      if (!event.target.value) {
        setZip([]);
        setData((prevState) => ({ ...prevState, zip: "" }));
      }
      GetSingleegridData(event.target.value);

      setData((prevState) => ({ ...prevState, zip: "" }));
    }
    if (event.target.name == "subdomain") {
      setData((prevState) => ({
        ...prevState,
        [name]: value
          .trim()
          .replace(/ {2,}/g, " ")
          .split(" ")
          .join("-")
          .toLowerCase(),
      }));
    } else {
      setData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const GetegridData = async () => {
    let id = props.match.params.id;
    const Response = await facilityApi.GetegridData();

    if (Response.data.status == 200) {
      setEgrid(Response.data.data);
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

  const getSingleFacility = async () => {
    let id = props.match.params.id;
    const Response = await facilityApi.getSingleFacilityAPI(id);

    if (Response.data.status == 200) {
      setData(Response.data.data);
      GetSingleegridData(Response.data.data.grid_region);
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
    GetegridData();
    getSingleFacility();
  }, []);

  const handleOnSearch = (string, results) => {
    setData((prevState) => ({ ...prevState, zip: "" }));
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result)
  };

  const handleOnSelect = (item) => {
    // the item selected
    setData((prevState) => ({ ...prevState, zip: item.name }));
  };

  const handleOnFocus = () => {
    // console.log('Focused')
    if (!data.grid_region) {
      CreateNotification("danger", "please select Grid Region!");
    }
  };
  const onClear = () => {
    setData((prevState) => ({ ...prevState, zip: "" }));
  };

  const formatResult = (item) => {
    console.log(item, "hellooooo");
    return item;
    // return (<p dangerouslySetInnerHTML={{__html: '<strong>'+item+'</strong>'}}></p>); //To format result as html
  };
  console.log(data, "hello");
  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Edit Facility</h1>
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
                  <input
                    type="text"
                    name="facility_id"
                    id="facility_id"
                    value={data.facility_id}
                    placeholder="Facility Id"
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.facility_id}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="last_name">
                    Grid Region
                  </label>
                  <select
                    name="grid_region"
                    id="grid_region"
                    value={data.grid_region}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control">
                    <option value="">Select Region..</option>
                    {egrid &&
                      egrid.length > 0 &&
                      egrid.map((value, index) => (
                        <option value={value._id}>{value._id}</option>
                      ))}
                  </select>
                  <span className="form-error">{error.grid_region}</span>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Zipcode
                  </label>
                  {/* <input type="text" name="zip" id="zip" placeholder="zip" value={data.zip} className="form-control" /> */}
                  {/* <Select options={zip} onKeyPress={(e)=>{OnSelectChange(e)}} isLoading={true} isSearchable={true}
                      />  */}

                  <ReactSearchAutocomplete
                    fuseOptions={{ keys: ["name"] }}
                    items={zip}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    formatResult={formatResult}
                    onClear={onClear}
                    inputSearchString={data.zip}
                    className="form-control"
                    resultStringKeyName="name"
                    styling={{
                      borderRadius: "0px",
                      height: "30px",
                    }}
                  />

                  <span className="form-error">{error.zip}</span>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                    value={data.city}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.city}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="state">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State"
                    value={data.state}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.state}</span>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Country"
                    value={data.country}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.country}</span>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="form-label" htmlFor="email">
                    Facility Info
                  </label>
                  <textarea
                    name="info"
                    id="info"
                    placeholder="Facility Info"
                    value={data.info}
                    onChange={(e) => {
                      onchange(e);
                    }}
                    className="form-control"
                  />
                  <span className="form-error">{error.info}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit();
                }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
