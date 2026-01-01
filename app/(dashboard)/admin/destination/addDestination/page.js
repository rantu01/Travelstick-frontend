'use client';
import React from "react";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useI18n } from "@/app/contexts/i18n";
import DestinationForm from "../destinationForm/page";

const addDestination = () => {
  const i18n = useI18n();
  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white px-8 pt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-[#05073C] heading-3">{i18n.t("Add New Destination")}</h2>
          <BackButton />
        </div>
        <div>
          <DestinationForm isEdit={false} />
        </div>
      </div>
    </div>
  );
};

export default addDestination;
