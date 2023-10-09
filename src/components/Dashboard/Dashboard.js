/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext, useRef } from "react";
import * as dashboardApi from "../../api/dashboardApi";
import * as facilityApi from "../../api/facilityApi";
import { CreateNotification } from "../../Utils/notification";
import { userContext } from "../../context/userContext";
import { useHistory } from "react-router";
import { Bar } from "react-chartjs-2";
import { formatDate, getLastDays } from "../../Utils/date";
import DatePicker from "react-datepicker";
import { ThemeContext } from "../../theme";
import ReactApexChart from "react-apexcharts";
import { CircularProgress } from "@mui/material";
import Echarts from "../charts/Echarts";
import * as reportApi from "../../api/reportApi";
import "./Dashboard.css";

const scopeIdsAndNames = [
  {
    name: "scope1",
    id: "611ba1fcfceb43977507522a",
  },
  {
    name: "scope2",
    id: "611ba1fcfceb43977507523a",
  },
  {
    name: "scope3",
    id: "611ba1fcfceb43977507524a",
  },
];

// const categoryIdsAndNames = [
//   {
//     categoryId: "611ba1fcfceb43977507527a",
//     categoryName: "Steam And Heat",
//   },
//   {
//     categoryId: "611ba1fcfceb43977507525a",
//     categoryName: "Purchased Electricity",
//   },
//   {
//     categoryId: "611ba1fcfceb43977507521a",
//     categoryName: "Stationary Combustion",
//   },
//   {
//     categoryId: "611ba1fcfceb43977507523a",
//     categoryName: "Mobile Combustion",
//   },
//   {
//     categoryId: "611ba1fcfceb43977507526a",
//     categoryName: "Transportation",
//   },
// ];

const Dashboard = (props) => {
  const context = useContext(userContext);
  const history = useHistory();
  const colors = ["#E38627", "#C13C37", "#6A2135"];

  const { user } = context;
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [topTabs, setTopTabs] = useState({
    emissions: 0,
    reports: 0,
    facility: 0,
  });
  const [pieChartData, setPieChartData] = useState([]);
  const [topFiveEmissions, setTopFiveEmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barChartData, setBarChartData] = useState([]);
  const [ColumnBarChartData, setColumnBarChartData] = useState([]);
  const [facilitiesVsEmissionsData, setFacilityVsEmissionsData] = useState({
    options: {},
    series: {},
  });
  const [categories, setCategories] = useState([]);
  const maxValueForColumnChartRef = useRef();
  const maxBarChartValueRef = useRef();
  const [echartsData, setEChartsData] = useState({
    dates: [],
    realTimes: [],
  });
  const [categoriesForFilter, setCategoriesForFilter] = useState([]);

  const generateChartData = async (dataForGraph) => {
    if (!dataForGraph || !Array.isArray(dataForGraph)) {
      console.error("Invalid data for chart generation");
      return;
    }

    let lastDays = getLastDays(startDate, endDate);

    let dateGroup = lastDays.reduce((group, val) => {
      let d = new Date(val).toDateString();
      group[d] = { realTime: 0, bar: 0 };
      return group;
    }, {});

    let realTimeGroups = dataForGraph.reduce((groups, val) => {
      let date = new Date(val.date).toDateString();
      if (!groups[date]) {
        groups[date] = 0;
      }
      groups[date] += val.equivalent;
      return groups;
    }, {});

    let barGroups = dataForGraph.reduce((groups, val) => {
      let date = new Date(val.date).toDateString();
      if (!groups[date]) {
        groups[date] = 0;
      }
      groups[date]++;
      return groups;
    }, {});

    Object.entries(realTimeGroups).forEach((val) => {
      dateGroup[val[0]].realTime = val[1];
    });

    Object.entries(barGroups).forEach((val) => {
      dateGroup[val[0]].bar = val[1];
    });

    const dates = Object.keys(dateGroup);
    const realTimes = Object.values(dateGroup).map((t) => t.realTime);
    setEChartsData({
      dates,
      realTimes,
    });

    let barData = Object.entries(dateGroup)
      .sort((a, b) => a[0] < b[0])
      .map((v) => v[1].bar);

    maxBarChartValueRef.current =
      Math.max(...barData) + Math.max(...barData) * (20 / 100);

    const dataForScopeEmissionsBarChart = {
      labels: getLastDays(startDate, endDate).map((val) => formatDate(val)),
      datasets: [
        {
          label: "Reports",
          backgroundColor: "#4080ea",
          borderColor: "#4080ea",
          borderWidth: 1,
          hoverBackgroundColor: "#e0eafc",
          hoverBorderColor: "#4080ea",
          data: barData,
        },
      ],
    };

    // added column chart with static data
    const labels = ["Accepted", "Pending", "Rejected"];

    const statusColumnChartData = {
      labels,
      datasets: [
        {
          backgroundColor: ["#22c55e", "#fde047", "rgb(255, 0, 0)"],
          borderColor: ["#22c55e", "#fde047", "rgb(255, 0, 0)"],
          borderWidth: 1,
          hoverBackgroundColor: "#e0eafc",
          hoverBorderColor: "#4080ea",
          data: [
            dataForGraph.reduce(
              (count, d) => (d.status === 1 ? count + 1 : count),
              0
            ),
            dataForGraph.reduce(
              (count, d) => (d.status === 0 ? count + 1 : count),
              0
            ),
            dataForGraph.reduce(
              (count, d) => (d.status === 2 ? count + 1 : count),
              0
            ),
          ],
        },
      ],
    };

    const maxValueForStatus = Math.max(
      ...[
        dataForGraph.reduce(
          (count, d) => (d.status === 1 ? count + 1 : count),
          0
        ),
        dataForGraph.reduce(
          (count, d) => (d.status === 0 ? count + 1 : count),
          0
        ),
        dataForGraph.reduce(
          (count, d) => (d.status === 2 ? count + 1 : count),
          0
        ),
      ]
    );

    maxValueForColumnChartRef.current =
      maxValueForStatus + maxValueForStatus * (20 / 100);

    // get all facilities
    const facilitiesResponse = await facilityApi.getFacilityAPI();
    const facilitiesData = facilitiesResponse?.data?.data || [];
    // facility vs emissions chart
    const uniqueFacilityIDs = [
      ...new Set(dataForGraph.map((item) => item.facility_id)),
    ];

    const chartData = uniqueFacilityIDs.map((facilityID) => {
      const items = dataForGraph.filter(
        (item) => item.facility_id === facilityID
      );
      const sumEquivalent = items.reduce(
        (sum, item) => sum + item.equivalent,
        0
      );
      const averageEquivalent = sumEquivalent;
      return {
        x:
          facilitiesData?.find((facility) => facility?._id === facilityID)
            ?.info || "",
        y: Number(averageEquivalent.toFixed(2)),
      };
    });

    const options = {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: chartData.map((cd) => cd.x),
        title: {
          text: "Facility Info",
        },
        crosshairs: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: "Equivalent",
        },
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
      tooltip: {
        y: {
          formatter: (value) => value.toFixed(2),
          title: {
            formatter: () => `Total emissions: `,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          endingShape: "rounded",
          backgroundColor: "#fff",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
    };

    const series = [
      {
        name: "Equivalent",
        data: chartData.map((cd) => cd.y).sort((a, b) => b - a),
      },
    ];

    setFacilityVsEmissionsData({ options, series });
    setBarChartData(dataForScopeEmissionsBarChart);
    setColumnBarChartData(statusColumnChartData);
  };

  const getFacilities = (dataForGraph) => {
    const facilities = new Set();
    dataForGraph.forEach((item) => {
      facilities.add(item.facility_id);
    });
    return facilities.size;
  };

  const getCategories = async () => {
    const categoryData = [];
    await Promise.all(
      scopeIdsAndNames.map(async ({ id }) => {
        const response = await reportApi.GetScopeCategoryData(id);
        if (response?.data?.data && response?.data?.status === 200) {
          categoryData.push(...response.data.data);
        }
      })
    );
    setCategoriesForFilter(categoryData);
  };

  const getReportsData = async (sd, ed) => {
    setLoading(true);
    try {
      const response = await dashboardApi.GetReportData(sd, ed);
      if (
        response?.data?.status === 200 &&
        response?.data?.data &&
        Array.isArray(response?.data?.data)
      ) {
        const {
          data: { data },
        } = response;
        setTopTabs({
          ...topTabs,
          reports: data.length,
          facility: getFacilities(data),
          emissions: data
            .reduce((acc, curr) => acc + curr.equivalent, 0)
            .toFixed(2),
        });
        const scopesData = data.map((d) => {
          const scopeOfData = scopeIdsAndNames.find(
            ({ id }) => id === d.scope_id
          );
          d.scopeName = scopeOfData?.name || "";
          return d;
        });
        const arrOfScopes = scopeIdsAndNames.reduce((result, scope) => {
          const count = scopesData.filter(
            (s) => s.scopeName === scope.name
          ).length;
          result.push({
            title: scope.name,
            value: count,
            colors: colors[result.length],
          });
          return result;
        }, []);
        const categoriesData = data.reduce((acc, item) => {
          const existingCategory = acc.find(
            (obj) => obj.category === item.category
          );
          if (existingCategory) {
            existingCategory.numberOfReports += 1;
            existingCategory.co2Emissions += item.equivalent;
          } else {
            acc.push({
              category: item.category,
              numberOfReports: 1,
              co2Emissions: item.equivalent,
            });
          }
          return acc;
        }, []);
        setCategories(categoriesData);
        setPieChartData(arrOfScopes);
        setTopFiveEmissions(
          data
            ?.map((d) => d.equivalent)
            ?.filter((d) => d)
            ?.sort((a, b) => b - a) || []
        );
        generateChartData(data);
        setLoading(false);
      } else if (response.data.status === 401) {
        CreateNotification("danger", "Session has been expired!");
        localStorage.clear();
        props.history.push("/login");
      } else {
        CreateNotification(
          "danger",
          "Something went wrong, please try again later!"
        );
      }
    } catch (error) {
      CreateNotification("danger", error.message);
    }
  };

  useEffect(() => {
    getReportsData(startDate, endDate);
    getCategories();
    if (!user) {
      history.push("/login");
    }
    return () => {
      setPieChartData([]);
      setTopFiveEmissions([]);
      setTopTabs({
        reports: 0,
        facility: 0,
        emissions: 0,
      });
      setCategories([]);
    };
  }, [startDate, endDate]);

  const { theme } = useContext(ThemeContext);

  return (
    <div className={`container-fluid p-0 dash-${theme}`}>
      {loading && (
        <div
          style={{
            position: "fixed",
            display: "block",
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: "2",
          }}>
          <CircularProgress
            style={{ position: "absolute", top: "50%", left: "50%" }}
          />
        </div>
      )}
      {/* Dashboard and Date picker */}
      <div className={`tp-box dash-${theme}`}>
        <div className={`row`}>
          <div className={`col-auto d-none d-sm-block`}>
            <h3>Dashboard</h3>
          </div>

          <div className={`col-auto ms-auto text-end mt-n1`}>
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
          </div>
        </div>
      </div>
      {/*Top Tabs */}
      <div className={`row dash-${theme}`}>
        <div className={`col-12 col-sm-6 col-xxl-3 d-flex `}>
          <div className="card illustration flex-fill">
            <div className="card-body p-0 d-flex flex-fill">
              <div className="row g-0 w-100">
                <div className={`col-6`}>
                  <div className="illustration-text p-3 m-1">
                    <h4 className={`illustration-text`}>
                      Welcome Back, {user?.first_name || ""}!
                    </h4>
                  </div>
                </div>
                <div className="col-6 align-self-end text-end">
                  <img
                    src="/assets/img/illustrations/customer-support.png"
                    alt="Customer Support"
                    className="img-fluid illustration-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`col-12 col-sm-6 col-xxl-3 d-flex `}>
          <div className={`card flex-fill `}>
            <div className="card-body py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{topTabs?.reports || 0}</h3>
                  <p className="mb-2">Reports</p>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <i
                      className="fa fa-files-o"
                      style={{ color: "#3f80ea" }}
                      aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
          <div className="card flex-fill">
            <div className="card-body py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{topTabs?.facility || 0}</h3>
                  <p className="mb-2">Facilities</p>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <img
                      src="/assets/img/illustrations/facility-management.svg"
                      alt="Customer Support"
                      className="img-fluid illustration-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
          <div className="card flex-fill">
            <div className="card-body py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{topTabs?.emissions || 0}</h3>
                  <p className="mb-2">Carbon Emissions</p>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <img
                      src="/assets/img/illustrations/factory.svg"
                      alt="Customer Support"
                      className="img-fluid illustration-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* real time charts  */}
      <div className="row">
        {/* real time chart  */}
        <div className="d-flex col-xl-12 col-lg-12 h-60">
          <div className="flex-fill w-100 card">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown">
                  <a
                    className="-"
                    id="react-aria5187417711-7"
                    aria-expanded="false">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </a>
                  <div
                    x-placement="bottom-end"
                    aria-labelledby="react-aria5187417711-7"
                    className="dropdown-menu dropdown-menu-end"
                    data-popper-reference-hidden="false"
                    data-popper-escaped="false"
                    data-popper-placement="bottom-end">
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Action
                    </a>
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Another Action
                    </a>
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <div className="mb-0 card-title h5">Real-Time</div>
            </div>
            <div className="p-2 card-body">
              <div className="h-90">
                {/* <Line data={chartsData || []} /> */}
                <Echarts
                  dates={echartsData.dates}
                  realTimes={echartsData.realTimes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* scope and facility emissions chart  */}
      <div className="row">
        {/* pie chart for scopes  */}
        <div className="col-md-4  d-flex">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown show">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-display="static">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal align-middle">
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <h5 className="card-title mb-0">Scope Percentage</h5>
            </div>
            <div
              style={{ marginLeft: "-40px" }}
              className="card-body d-flex w-100">
              <div>
                <ReactApexChart
                  type="donut"
                  width={400}
                  height={350}
                  series={Object.values(pieChartData).map((v) => v.value)}
                  options={{
                    labels: ["Scope1", "Scope2", "Scope3"],
                    plotOptions: {
                      pie: {
                        donut: {
                          labels: {
                            show: true,
                            total: {
                              show: true,
                            },
                          },
                        },
                      },
                    },
                    legend: {
                      position: "bottom",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* top emissions by facility chart  */}
        <div className="col-md-8  d-flex">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown show">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-display="static">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal align-middle">
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <h5 className="card-title mb-0">Top Emissions (By Facility)</h5>
            </div>
            <div className="card-body d-flex w-100">
              <div className="w-100">
                <ReactApexChart
                  options={facilitiesVsEmissionsData.options}
                  series={facilitiesVsEmissionsData.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* top emissions and category chart  */}
      <div className="row">
        {/* category chart */}
        <div className="d-flex col-lg-5">
          <div className="flex-fill w-100 card">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown show">
                  <button
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    style={{ border: "none", background: "#fff" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal align-middle">
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-title">Category</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="my-0 table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>No of Reports</th>
                    <th>Carbon Emissions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map(
                    ({ category, numberOfReports, co2Emissions }) => {
                      return (
                        <tr>
                          <td>
                            {
                              categoriesForFilter?.find(
                                (c) => c._id === category
                              )?.name
                            }
                          </td>
                          <td>{numberOfReports}</td>
                          <td>{co2Emissions.toFixed(2)}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-7 d-flex">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown show">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-display="static">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal align-middle">
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <h5 className="card-title mb-0">Top 5 Emissions (Last Month)</h5>
            </div>
            <div className="card-body d-flex w-100">
              <div className="w-100   ">
                <Bar
                  data={{
                    // Name of the variables on x-axies for each bar
                    labels: [
                      "1st Highest Emission",
                      "2nd Highest Emission",
                      "3rd Highest Emission",
                      "4th Highest Emission",
                      "5th Highest Emission ",
                    ],
                    datasets: [
                      {
                        label: "Top Emissions",
                        data: topFiveEmissions,
                        backgroundColor: ["#4080ea"],
                      },
                    ],
                  }}
                  // Height of graph
                  height={400}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            // The y-axis value will start from zero
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    legend: {
                      labels: {
                        fontSize: 15,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* status and scope emissions chart  */}
      <div className="row">
        {/* column chart  */}
        <div className="d-flex col-lg-4">
          <div className="flex-fill w-100 card">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown">
                  <a
                    className="-"
                    id="react-aria5187417711-7"
                    aria-expanded="false">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </a>
                  <div
                    x-placement="bottom-end"
                    aria-labelledby="react-aria5187417711-7"
                    className="dropdown-menu dropdown-menu-end"
                    data-popper-reference-hidden="false"
                    data-popper-escaped="false"
                    data-popper-placement="bottom-end">
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Action
                    </a>
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Another Action
                    </a>
                    <a
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      role="button"
                      tabindex="0"
                      href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <div className="mb-0 card-title h5">Status</div>
            </div>
            <div className="p-2 card-body">
              <div
                style={{
                  display: "flex ",
                  margin: "auto",
                  width: "300px",
                  height: "300px",
                }}>
                <Bar
                  data={ColumnBarChartData}
                  options={{
                    scales: {
                      y: {
                        min: 0,
                        max: Math.floor(maxValueForColumnChartRef.current),
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                  height={60}
                  width={50}
                />
              </div>
            </div>
          </div>
        </div>
        {/* scope emissions date wise  */}
        <div className="col-8 col-lg-8 d-flex">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <div className="card-actions float-end">
                <div className="dropdown show">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-display="static">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal align-middle">
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-title mb-0">
                      Scope Emissions (Datewise)
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <div className="row "></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body d-flex w-100">
              <Bar
                data={barChartData}
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: maxBarChartValueRef.current,
                      beginAtZero: true,
                    },
                  },
                }}
                width={100}
                height={50}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
