import { useI18n } from "@/app/contexts/i18n";
import { getDashboardData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Empty } from "antd";
import React, { use, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const BookingPieChart = () => {
  const i18n = useI18n();
  const [data, getData] = useFetch(getDashboardData, {}, false);
  useEffect(() => {
    getData();
  }, []);
  const series = (data?.destrination?.values)?.slice(0, 4);
  const options = {
    chart: {
      type: "donut",
    },
    // labels: [i18n.t("Package"), i18n.t("Hotel"), i18n.t("Visa")],
    labels: (data?.destrination?.names)?.slice(0, 4),
    colors: ["#EB662B", "#2B9FEB", "#6ACB6D", "#F7B500"],
    dataLabels: {
      formatter: (val) => `${val.toFixed(1)}%`,
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} bookings`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            inlineSize: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full bg-white xl:p-6 lg:p-4 p-3 rounded-md">
      <h2 className="heading-3 mb-4 text-[#05073C]">
        {i18n.t("Booking Distribution")}
      </h2>
       { data?.destrination?.values ? (
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
        />
      ) : (
        <div className=" flex justify-center items-center text-[#05073C]">
          <Empty description="No Booking Found" />
        </div>
      )}
    </div>
  );
};

export default BookingPieChart;
