import React, { useState, useEffect } from "react";
import * as USERAPI from "../../api/userApi";
import { CreateNotification } from "../../Utils/notification";

const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({});

  const isFormValid = () => {
    const { name, no_client,no_collaborator } = data;
    
    const regex_email = /^(([^!<>#$%^&*()[\]\\.,;:\s@\"]+(\.[^#$%^&*!<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!name) {
      setError({ name: "Name is required!"});
        return false;
    }
    else if (!no_client || no_client == 0) {
      setError({ no_client: "Clients is required!"});
        return false;
    }
    else if (!no_collaborator || no_collaborator == 0) {
      setError({ no_collaborator: "Collaborator is required!"});
        return false;
    }
    else {
      setError({});
        return true;
    }

}
  const handleSubmit = async() =>
  {
    const isValid = await isFormValid();

    if(isValid)
    {
      let id = props.match.params.id;
      const Response = await USERAPI.UpdateLicenceAPI(data,id);
    
      if(Response.data.status == 200)
      {
      CreateNotification("success",Response.data.message)
      }
      else if(Response.data.status == 401)
      {
      CreateNotification("danger","Session has been expired!")
        localStorage.clear();
        props.history.push('/login')
      }
      else
      {
      CreateNotification("danger",Response.data.message)
      }
    }
    
  }

  const getSingleLicence = async() =>
  {
    let id = props.match.params.id;
      const Response = await USERAPI.getSingleLicenceAPI(id);
    
      if(Response.data.status === 200)
      {
        setData(Response.data.data);
      }
      else if(Response.data.status === 401)
      {
      CreateNotification("danger","Session has been expired!")
        localStorage.clear();
        props.history.push('/login')
      }
      else
      {
      CreateNotification("danger","Something went wrong, please try again later!")
      }
     
  }

  const onchange = async(event) =>
  {
    setError({});
   
    const { name, value } = event.target;
    setData(prevState => ({ ...prevState, [name]: value }));
   
  }

  useEffect(()=>{
    getSingleLicence();
  },[]);

    return (
      <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Edit Licencing</h4>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Licence Name</label>
                  <div className="col-sm-9">
                    <input type="text" name="name" value={data.name} onChange={(e) => {onchange(e)}} className="form-control" />
                    <span className="form-error">{error.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">No. of Client</label>
                  <div className="col-sm-9">
                    <input type="number" name="no_client" value={data.no_client} min={1} onChange={(e) => {onchange(e)}} className="form-control" />
                    <span className="form-error">{error.no_client}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">No. of Collaborator</label>
                  <div className="col-sm-9">
                    <input type="number" name="no_collaborator" value={data.no_collaborator} min={1} onChange={(e) => {onchange(e)}} className="form-control" />
                    <span className="form-error">{error.no_collaborator}</span>
                  </div>
                </div>
              </div>
            </div>
            

            <button type="submit" className="btn btn-primary mr-2" onClick={() => {handleSubmit()}}>Submit</button>
           
        
        </div>
      </div>
    </div>
    );
};

export default Dashboard;