/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/*

@author: Shivansh Shukla
*/

import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class Echarts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps?.dates?.length !== this.props?.dates?.length &&
      prevProps?.realTimes !== this.props?.realTimes
    ) {
      this.updateOptions();
    }
  }

  updateOptions = () => {
    const options = this.getOptions();
    this.setState(
      {
        options,
      },
      () => {
        const eChartsInstance = this.echarts_react.getEchartsInstance();
        eChartsInstance.setOption(options, true);
      }
    );
  };

  getOptions = () => {
    const options = {
      xAxis: {
        type: "category",
        data: this.props.dates,
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: "axis",
      },
      axisPointer: {
        show: false
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          dataView: { readOnly: false },
          magicType: { type: ["line", "bar"] },
          restore: {
            show: true,
            title: "Reset chart",
          },
          saveAsImage: {
            show: true,
            type: "png",
          },
        },
      },
      series: [
        {
          type: "line",
          data: this.props.realTimes,
        },
      ],
    };
    return options;
  };

  render() {
    return (
      <ReactEcharts
        ref={(e) => {
          this.echarts_react = e;
        }}
        option={this.getOptions()}
      />
    );
  }
}

export default Echarts;
