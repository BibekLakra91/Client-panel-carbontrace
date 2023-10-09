import axios from "axios";

export const GetDashboardData = async () => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/dashboard`
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
      console.log("e  rror", error);
      return {
        status: 400,
        message: error.message,
        data: "",
      };
    }
  }
};
export const getReportsOfScopes = async () => {
  // console.log("CreateClientAPI", data);
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/dashboard/getReportsOfScopes`
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

export const GetReportData = async (startDate, endDate) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/dashboard/report-data?startDate=${startDate}&endDate=${endDate}`
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

export const getTopFiveRecordsOfLastMonth = async () => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    try {
      axios.defaults.headers.common["Authorization"] = userData.jwt;
      // axios.defaults.headers.common['Accept'] = 'application/json';
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client/dashboard/getTopFiveRecordsOfLastMonth`
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
