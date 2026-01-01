"use client";
import { Tooltip } from "antd";
import Image from "next/image";
import { createImpression, createClick } from "@/app/helper/backend";

const Advertisement = ({ title, image, link, id }) => {

  const handleClick = async () => {
    if (!id) return console.error("Advertisement ID is missing");

    const impressionKey = `ad_impression_${id}`;
    if (localStorage.getItem(impressionKey)) {
      try {
        await createImpression({ body: { advertisement: id } });
        localStorage.setItem(impressionKey, "true");
      } catch (err) {
        console.error("Impression Error:", err);
      }
    }

    try {
      await createClick({ body: { advertisement: id } });
    } catch (err) {
      console.error("Click Error:", err);
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="border border-primary/40 flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md max-w-sm cursor-pointer">
      <div onClick={handleClick}>
        <Image
          width={500}
          height={500}
          src={image}
          alt={title}
          className="w-[100px] h-[100px] sm:w-[180px] sm:h-[150px] md:w-[220px] md:h-[200px] object-fill rounded-md"
        />
      </div>
      <div className="text-[10px] sm:text-sm md:text-lg font-semibold mt-2">
        <Tooltip title={title?.length > 20 ? title : undefined}>
          <span className="cursor-help">
            {title.length > 8 ? title.slice(0, 20) + "..." : title}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default Advertisement;
