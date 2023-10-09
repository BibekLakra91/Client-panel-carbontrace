import React, { useState, useEffect } from "react";
import * as facilityApi from "../../api/facilityApi";
import { CreateNotification } from "../../Utils/notification";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import CustomDropdownInput from "react-custom-dropdown-input";

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
        setError({ zip: "Please select zipcode!" });
        return false;
      } else if (data.zip && data.zip.length < 3) {
        setError({ zip: "Zip code should be of at least three characters" });
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
      const Response = await facilityApi.CreateFacilityAPI(data);
      if (Response.data.status === 200) {
        CreateNotification("success", "Facility added Successfully.");
        props.history.push("/facility");
      } else if (Response.data.status === 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification("danger", Response.data.message);
      }
    }

    // props.history.push('/')
  };

  const onchange = async (event) => {
    setError({});

    const value = event.target.value.trimStart().replace(/ {2,}/g, " ");
    const name = event.target.name;
    if (event.target.name === "grid_region") {
      if (!event.target.value) {
        setZip([]);
        setData((prevState) => ({ ...prevState, zip: "" }));
      }
      const Response = await facilityApi.GetSingleegridData(event.target.value);

      if (Response.data.status === 200) {
        setZip(Response.data.data);
        setData((prevState) => ({ ...prevState, zip: "" }));
      }
    }
    if (event.target.name === "subdomain") {
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

    if (Response.data.status === 200) {
      var data = [];
      for (let val of Response.data.data) {
        // console.log(val._id);
        data.push({ id: val._id, label: val._id });
      }
      console.log(data);

      setEgrid(data);
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
    GetegridData();
  }, []);

  const OnSelectChange = async (event, e) => {
    console.log(event, e, "jellooo");
  };

  const handleOnSearch = (string, results) => {
    setData((prevState) => ({ ...prevState, zip: string }));
  };

  const handleSelected = async (option) => {
    ///option is the option selected on the dropdown
    console.log(option, "option");
    setData((prevState) => ({ ...prevState, grid_region: option.id }));
    const Response = await facilityApi.GetSingleegridData(option.id);

    if (Response.data.status === 200) {
      setZip(Response.data.data);
      setData((prevState) => ({ ...prevState, zip: "" }));
    }
  };

  const handleChange = (value) => {
    //value is the input typed
    console.log(value, "value");
    setData((prevState) => ({ ...prevState, grid_region: value }));
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result)
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log("item ", item);
    setData((prevState) => ({ ...prevState, zip: item.name }));
  };

  // const handleOnFocus = () => {
  //   // console.log('Focused')
  //   if(!data.grid_region)
  //   {
  //   CreateNotification("danger","please select Grid Region!")
  //   }
  // }
  const onClear = () => {
    setData((prevState) => ({ ...prevState, zip: "" }));
  };
  const inputSearchString = () => {
    // console.log(result,'result')
  };

  const formatResult = (item) => {
    return item;
    // return (<p dangerouslySetInnerHTML={{__html: '<strong>'+item+'</strong>'}}></p>); //To format result as html
  };
  console.log(data, "hello");
  return (
    <div className="container-fluid p-0">
      <div className="tp-box">
        <h1 className="h3">Add Facility</h1>
      </div>
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
                  <CustomDropdownInput
                    values={egrid}
                    handleSelected={handleSelected}
                    handleChange={handleChange}
                  />
                  {/* <select name="grid_region" id="grid_region"  onChange={(e) => {onchange(e)}} className="form-control" >
                  <option value="">Select Region..</option>
                  {egrid && egrid.length>0 && egrid.map((value, index) => (
                  <option value={value._id}>{value._id}</option>
                            ))}
                  </select> */}
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
                    items={zip}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    // onFocus={handleOnFocus}
                    formatResult={formatResult}
                    onClear={onClear}
                    className="form-control"
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
