import { useI18n } from "@/app/contexts/i18n";
import { Empty, Form, message, Progress, Rate } from "antd";
import Image from "next/image";
import { GoStarFill } from "react-icons/go";
import FormInput from "../form/input";
import { fetchPublicSettings, postReview } from "@/app/helper/backend";
import { useState } from "react";
import dayjs from "dayjs";
import { useAction, useFetch } from "@/app/helper/hooks";
import AuthModal from "../site/common/component/authModal";
import { useUser } from "@/app/contexts/user";
import CommonContact from "./commonConatc";
const Rating = ({ data, getData, slug, checked }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useUser();
  const [settingData] = useFetch(fetchPublicSettings);
  const totalRating = data?.review_calculation?.rating_five + data?.review_calculation?.rating_four + data?.review_calculation?.rating_three + data?.review_calculation?.rating_two + data?.review_calculation?.rating_one;
  const progressData = [
    {
      id: 1,
      title: "5",
      percentage: (data?.review_calculation?.rating_five / totalRating) * 100,
    },
    {
      id: 2,
      title: "4",
      percentage: (data?.review_calculation?.rating_four / totalRating) * 100,
    },
    {
      id: 3,
      title: "3",
      percentage: (data?.review_calculation?.rating_three / totalRating) * 100,
    },
    {
      id: 4,
      title: "2",
      percentage: (data?.review_calculation?.rating_two / totalRating) * 100,
    },
    {
      id: 5,
      title: "1",
      percentage: (data?.review_calculation?.rating_one / totalRating) * 100,
    },
  ];
  const ratingData = [
    {
      id: 1,
      title: "Location",
      rating: data?.review_calculation?.location,
      image: "/theme1/package/location.png",
    },
    {
      id: 2,
      title: "Service",
      rating: data?.review_calculation?.service,
      image: "/theme1/package/service.png",
    },
    {
      id: 3,
      title: "Amenities",
      rating: data?.review_calculation?.amenities,
      image: "/theme1/package/ame.png",
    },
    {
      id: 4,
      title: "Price",
      rating: data?.review_calculation?.price,
      image: "/theme1/package/icons.png",
    },
    {
      id: 5,
      title: "Room",
      rating: data?.review_calculation?.room,
      image: "/theme1/package/home.png",
    },
  ];
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [locationRating, setLocationRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(4);
  const [amenitiesRating, setAmenitiesRating] = useState(4);
  const [roomRating, setRoomRating] = useState(4);
  const [priceRating, setPriceRating] = useState(4);
  const handleSubmit = async (values) => {
    if (user) {
      if (checked) {
        await useAction(postReview, {
          body: {
            ...slug === 'hotel' ? { hotel: data?._id } : { package: data?._id },
            location: locationRating,
            service: serviceRating,
            amenities: amenitiesRating,
            price: priceRating,
            room: roomRating,
            comment: values.message,
          }
        });
        form.resetFields();
        getData();
      }
      else {
        message.error(i18n.t(`You have not booked this ${slug} yet, please book first.`));
      }
    }
    else {
      setAuthModalOpen(true);
    }
  };
  return (
    <div>
      {
        data?.review?.length > 0 && data?.review_calculation ? (
          <div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2">
                <GoStarFill className="text-[#FBBF24] heading-1" />
                <h1 className="heading-1 text-[#FBBF24]">{data?.review_calculation?.rating}/ 5</h1>
              </div>
              <h4 className="description-3 text-[#05073C] xl:mt-6 lg:mt-5 md:mt-4 mt-3">
                {
                  slug === 'hotel' ? i18n.t("Hotel Rating") : i18n.t("Traveler Rating")
                }
              </h4>
              <p className="description-1 text-[#717171] xl:mt-4 lg:mt-3 mt-2 max-w-[520px]">
                {i18n.t("This place is a traveler favorite, thanks to its high ratings, glowing reviews, and trusted reliability—perfect for your next adventure")}
              </p>
            </div>
            {/* Progress bar */}
            <div className="flex flex-col lg:flex-row w-full xl:mt-14 lg:mt-11 md:mt-8 mt-6 gap-4 border xl:p-6 lg:p-5 md:p-4 sm:p-3 p-2 rounded-[10px] lg:rounded-[20px]">
              <div className="lg:w-[30%] w-full border-r-0 lg:border-r lg:pr-8 pr-0">
                <p className="description-2 !font-semibold">{i18n.t("Overall rating")}</p>
                <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-3">
                  {progressData?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 progress">
                      <p className="description-1 text-[#05073C] !font-semibold">{i18n.t(item.title)}</p>
                      <Progress
                        percent={item?.percentage}
                        strokeColor="#EF8248"
                        trailColor="#ECEEF2"
                        format={() => ''}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 md:mt-5 lg:mt-0 w-full grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                {
                  ratingData?.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center last:border-r-0 sm:border-r sm:mt-0 mt-10"
                    >
                      <p className="description-2 !font-semibold text-center">
                        {i18n.t(item.title)}
                      </p>
                      <div className="md:lg-4 mt-2 flex items-center lg:gap-2 gap-1">
                        <GoStarFill className="text-[#FBBF24] description-2 !font-semibold" />
                        <h1 className="description-2 !font-semibold text-[#05073C]">{item.rating}</h1>
                      </div>
                      <div className="xl:mt-12 lg:mt-10 md:mt-8 mt-2">
                        <Image
                          src={item.image}
                          alt="rating"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* User Review show*/}
            <div className="w-full xl:mt-14 lg:mt-11 md:mt-8 mt-6 xl:p-6 lg:p-5 md:p-4 sm:p-3 p-2 rounded-[10px] lg:rounded-[20px] grid grid-cols-1 lg:grid-cols-2 xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
              {
                data?.review?.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2 border rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 sm:p-3 p-2 border-[#E8EAE8]">
                    <div className="flex gap-2">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <Image
                          src={item?.user?.image}
                          alt="rating"
                          width={1000}
                          height={1000}
                          className="rounded-full w-20 h-20 object-cover"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-1 w-full">
                          <p className="description-2 !font-semibold">{item?.user?.name}</p>
                          <p className="description-1 text-[#717171]">{dayjs(item?.created_at).format('DD MMMM YYYY')}</p>
                        </div>
                        <Rate className="text-primary description-1 mt-2" disabled count={5} value={item?.rating} />
                        <p className="description-1 text-[#717171] mt-3 capitalize">{item?.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <Empty description="No review found" />
        )
      }
      {/* User Review Input Form and contact*/}
      <div className="w-full xl:mt-24 lg:mt-20 md:mt-12 mt-10 flex flex-col lg:flex-row xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
        {/* User Review Input Form */}
        <div className="lg:w-[70%] w-full">
          <Form
            className="relative"
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
          >
            <p className="heading-1 text-[#05073C]">{i18n.t("Leave a Feedback")}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 xl:mt-10 lg:mt-8 md:mt-6 sm:mt-5 mt-4">
              <div className="flex flex-col last:border-r-0 sm:border-r sm:mt-0 mt-10">
                <p className="description-2 !font-semibold pl-4">
                  {i18n.t("Location")}
                </p>
                <Rate
                  onChange={(value) => setLocationRating(value)}
                  className="text-primary description-2 mt-2"
                  defaultValue={4}
                  count={5}
                />
              </div>
              <div className="flex flex-col items-center sm:border-r sm:mt-0 ">
                <p className="description-2 !font-semibold">
                  {i18n.t("Service")}
                </p>
                <Rate
                  onChange={(value) => setServiceRating(value)}
                  className="text-primary description-2 mt-2"
                  defaultValue={4}
                  count={5}
                />
              </div>
              <div className="flex flex-col items-center sm:border-r sm:mt-0 ">
                <p className="description-2 !font-semibold">
                  {i18n.t("Amenities")}
                </p>
                <Rate
                  onChange={(value) => setAmenitiesRating(value)}
                  className="text-primary description-2 mt-2"
                  defaultValue={4}
                  count={5}
                />
              </div>
              <div className="flex flex-col items-center sm:border-r sm:mt-0 ">
                <p className="description-2 !font-semibold">
                  {i18n.t("Price")}
                </p>
                <Rate
                  onChange={(value) => setPriceRating(value)}
                  className="text-primary description-2 mt-2"
                  defaultValue={4}
                  count={5}
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="description-2 !font-semibold">
                  {i18n.t("Room")}
                </p>
                <Rate
                  onChange={(value) => setRoomRating(value)}
                  className="text-primary description-2 mt-2"
                  defaultValue={4}
                  count={5}
                />
              </div>
            </div>
            <div className="xl:mt-10 lg:mt-8 md:mt-6 sm:mt-5 mt-4">
              <FormInput
                textArea={true}
                rows={4}
                className="w-full p-2 sm:p-3 xl:p-4 focus:outline-primary glass-effect rounded-[10px] lg:rounded-[20px] !border !border-[#E8EAE8] "
                // label="Message"
                type="text"
                name="message"
                placeholder="Enter your message ..."
                required={true}
              />
            </div>
            <div className="xl:mt-10 lg:mt-8 md:mt-6 sm:mt-5 mt-4">
              <button className="common-btn bg-primary text-white">
                {i18n.t("Submit Feedback")}
              </button>
            </div>
          </Form>
        </div>
        <div className="lg:w-[30%] w-full">
          <CommonContact/>
        </div>
      </div>
      <AuthModal authModalOpen={authModalOpen} slug={`/package/${data?._id}`} setAuthModalOpen={setAuthModalOpen} />
    </div>
  );
}

export default Rating;
