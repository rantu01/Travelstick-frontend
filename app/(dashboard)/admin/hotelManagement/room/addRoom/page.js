"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import RoomForm from "../roomForm/page";

const AddRoom = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Add New Room</h1>
        <BackButton />
      </div>
      <RoomForm />
    </div>
  );
};

export default AddRoom;
