import React, { useState, useEffect } from "react";
import * as collaboratorApi from "../../api/collaboratorApi";
import { CreateNotification } from "../../Utils/notification";
import { Link} from "react-router-dom";

const Dashboard = (props) => {
  const [error, setError] = useState({});
  const [data, setData] = useState({email:'',password:''});


  const getClient = async() =>
  {
      const Response = await collaboratorApi.getCollaboratorAPI(data);
    
      if(Response.data.status == 200)
      {
        setData(Response.data.data);
      }
      else if(Response.data.status == 401)
      {
        CreateNotification("danger","Session has been expired!");
        localStorage.clear();
        props.history.push('/login')
      }
      else
      {
        CreateNotification("danger","Something went wrong, please try again later!")
      }
     
  }

  useEffect(()=>{
    getClient();
  }, []);
  
    return (
      <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Collaborator List</h1>
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
                <th>
                  Sr. No.
                </th>
                <th>
                  Name
                </th>
                <th>
                  Email
                </th>
                <th>
                  Phone No.
                </th>
               
                <th>
                  Date
                </th>
                <th>
                  Action
                </th>
              </tr>
              </thead>
              <tbody>
              {data && data.length>0 && data.map((value, index) => (
              <tr>
                <td className="py-1">
                {index+1}
                </td>
                <td>
                {value.first_name} {value.last_name}
                </td>
                <td>
                {value.email}
                </td>
                <td>
                {value.phone}
                </td>
              
                <td>
                {value.created_at}
                </td>
                <td className="table-action">
                    <Link to={`/edit-collaborator/${value._id}`}><i className="align-middle fa fa-pencil" data-feather="edit-2" /></Link>
                    {/* <a href="#"><i className="align-middle" data-feather="trash" /></a> */}
                  </td>
               
              </tr>
              ))
              }
              {data && data.length==0 && 
              <tr><td className="centre" colSpan={7}>No Data Found!</td></tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      
    );
};

export default Dashboard;