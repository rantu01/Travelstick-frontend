"use client";
import { useParams } from "next/navigation";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import RoomForm from "../../roomForm/page";
import { getRoomById } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";

const EditRoom = () => {
  const { id } = useParams();
  const [data, getData, { loading }] = useFetch(getRoomById, { id: id });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Edit Room</h1>
        <BackButton />
      </div>
      {loading ? (
        <div className="text-center py-10">Loading room data...</div>
      ) : (
        <RoomForm isEdit={true} data={data} />
      )}
    </div>
  );
};

export default EditRoom;
