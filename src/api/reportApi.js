import axios from "axios";

export const GetReportData = async (data) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/add-reportdata`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const GetScopeCategoryData = async (id) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/scope-category?id=${id}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const GetSubCategoryData = async (id) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/subcategory-data?id=${id}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const GetEmissionData = async (id) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/emission-data?id=${id}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const GetFuelData = async (id) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/fuel-data?id=${id}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const getSingleReportAPI = async (id) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/single-report/${id}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const ExportCsvAPI = async (startDate, endDate) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/export-csv?startDate=${startDate}&endDate=${endDate}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const SummaryExportCsvAPI = async (startDate, endDate) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/summary-export-csv?startDate=${startDate}&endDate=${endDate}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const ExportErrorCsvAPI = async () => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/export-error-csv`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const ImportCsvAPI = async (form) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/upload-csv-Report`,
        form
      );
      console.log("response", response);
      if (response.status === 200) {
        return {
          data: response.data,
          status: 200,
          message: "Successful",
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const getReportAPI = async (pagenumber, perPage) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/report?page=${pagenumber}&perpage=${perPage}`
      );
      // console.log("LoginAPI response", response.data.data[0].equivalent);//task
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const getErrorReportAPI = async (pagenumber, perPage) => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/error-report?page=${pagenumber}&perpage=${perPage}`
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const updateReportAPI = async (data, id) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/update-report/${id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error("Something went wrong, please try again later!");
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};

export const CreateReportAPI = async (data) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/client/add-report`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log("LoginAPI response", response);
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log("error", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};
