import axios from "axios";


export const getLimitCheckAPI = async(data) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/limit-check`,
        data,
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
      
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}

export const getSingleCollaboratorAPI = async(id) => {
  
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/single-collaborator/${(id)?id:userData.id}`,
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}

export const getCollaboratorAPI = async(data) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/collaborator`,
        data,
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
      
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}


export const uploadImages = async(data) => {
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;
      const formData = new FormData();
      for(let file of data)
      {
      formData.append("image", file);
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/upload-images/${userData.id}`,
        formData,
        {headers:{"Content-Type":"application/json"}}
      );
      if (response.status === 200) {
      
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}

export const UpdateCollaboratorAPI = async(data,id) => {
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/update-collaborator/${(id)?id:userData.id}`,
        data,
        {headers:{"Content-Type":"application/json"}}
      );
      if (response.status === 200) {
      
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}


export const changePwAPI = async(data,id) => {
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
    try{
      axios.defaults.headers.common['Authorization'] = userData.jwt;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/change-password/${userData.id}`,
        data,
        {headers:{"Content-Type":"application/json"}}
      );
      if (response.status === 200) {
      
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }

    }catch(error){
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
}


export const CreateCollaboratorAPI = async(data) => {
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData)
  {
  try{
    axios.defaults.headers.common['Authorization'] = userData.jwt;

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/client/add-collaborator`,
      data,
      {headers:{"Content-Type":"application/json"}}
    );
    // console.log("LoginAPI response", response);
    if (response.status === 200) {
     
      return {
        data: response.data,
      };
    } else {
      throw new Error(response.message);
    }

  }catch(error){
    console.log("error", error);
    return {
      status: 400,
      message: error.message,
      data: "",
    };
  }
}
}

export const LoginAPI = async(data) => {
  console.log("LoginAPI", data);
  try{
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/client/login`,
      data,
      {headers:{"Content-Type":"application/json"}}
    );
    console.log("LoginAPI response", response);
    if (response.status === 200) {
     
      return {
        data: response.data,
      };
    } else {
      throw new Error(response.message);
    }

  }catch(error){
    console.log("error", error);
    return {
      status: 400,
      message: error.message,
      data: "",
    };
  }
}



