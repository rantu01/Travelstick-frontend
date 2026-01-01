import { useI18n } from "@/app/contexts/i18n";
import { getDashboardData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const RevenueChart = () => {
  const i18n = useI18n();
  const [data, getData] = useFetch(getDashboardData, {}, false);
  useEffect(() => {
    getData();
  }, []);
  const revenue = data?.payment;

  const options = {
    chart: {
      type: "bar",
      blockSize: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        inlineSize: "50%",
        borderRadius: 8,
        endingShape: "rounded",
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      inlineSize: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value}`,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    colors: ["#EB662B", "#2B9FEB", "#6ACB6D"],
    legend: {
      position: "top",
    },
  };

  return (
    <div className="lg:w-full bg-white xl:p-6 lg:p-4 p-3 rounded-md w-[700px] sm:w-full overflow-x-auto">
      <h2 className="heading-3 mb-4 text-[#05073C]">
        {i18n.t("Revenue Trend")}
      </h2>
      {/*  */}

      { revenue ? (
        <ReactApexChart
          options={options}
          series={revenue}
          type="bar"
          height={350}
        />
      ) : (
        <p className=" flex justify-center items-center text-[#05073C]">
          {i18n.t("No Data Found")}
        </p>
      )}
    </div>
  );
};

export default RevenueChart;
