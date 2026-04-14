/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Table from "@/app/(dashboard)/components/common/table";
import { useI18n } from "@/app/contexts/i18n";
import {
    deleteUmrahInquiry,
    getAllUmrahInquiries,
    updateUmrahInquiry,
} from "@/app/helper/backend";
import { useActionConfirm, useFetch } from "@/app/helper/hooks";
import { Select, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
    pending: "orange",
    "in-progress": "blue",
    resolved: "green",
};

const UmrahInquiryList = () => {
    const [data, getData, { loading }] = useFetch(getAllUmrahInquiries);
    console.log("Umrah inquiries data:", data);
    const i18n = useI18n();
    const router = useRouter();

    const handleStatusChange = (id, newStatus) => {
        useActionConfirm(
            updateUmrahInquiry,
            { _id: id, status: newStatus },
            getData
        );
    };

    const columns = [
        {
            text: "Name",
            dataField: "name",
            formatter: (name) => (
                <Tooltip title={name?.length > 24 ? name : undefined}>
                    <span className="cursor-help font-medium text-[#05073C]">
                        {name?.length > 24 ? name.slice(0, 24) + "..." : name}
                    </span>
                </Tooltip>
            ),
        },
        {
            text: "Email",
            dataField: "email",
            formatter: (email) => (
                <a
                    href={`mailto:${email}`}
                    className="text-blue-600 hover:underline text-sm"
                >
                    {email}
                </a>
            ),
        },
        {
            text: "Phone / WhatsApp",
            dataField: "phone",
            formatter: (phone) =>
                phone ? (
                    <a
                        href={`tel:${phone}`}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        {phone}
                    </a>
                ) : (
                    <span className="text-gray-400 text-sm">—</span>
                ),
        },
        {
            text: "Reach By",
            dataField: "reachBy",
            formatter: (val) => (
                <Tag
                    color={
                        val === "WhatsApp"
                            ? "green"
                            : val === "Phone Call"
                            ? "blue"
                            : "purple"
                    }
                >
                    {val}
                </Tag>
            ),
        },
        {
            text: "Topics",
            dataField: "topics",
            formatter: (topics) =>
                topics?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {topics.map((t, i) => (
                            <Tag key={i} color="geekblue" className="text-xs">
                                {t}
                            </Tag>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">—</span>
                ),
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (status, d) => (
                <Select
                    value={status}
                    size="small"
                    style={{ width: 130 }}
                    onChange={(val) => handleStatusChange(d._id, val)}
                    options={[
                        { value: "pending", label: "Pending" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "resolved", label: "Resolved" },
                    ]}
                    className="text-xs"
                    
                />
            ),
        },
        {
            text: "Submitted At",
            dataField: "createdAt",
            formatter: (_, d) => (
                <span className="text-sm text-gray-500">
                    {dayjs(d?.createdAt).format("DD MMM YYYY")}
                </span>
            ),
        },
    ];

    return (
        <div className="w-full overflow-x-auto mt-7 px-6">
            <div className="rounded dashboardInput bg-white">
                <div className="flex justify-between px-8 pt-8 items-center">
                    <h1 className="text-[#05073C] heading-3">
                        {i18n.t("Umrah Inquiries")}
                    </h1>
                    <BackButton />
                </div>
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    onView={(values) =>
                        router.push(
                            `/admin/umrahManagement/view?_id=${values._id}`
                        )
                    }
                    onDelete={deleteUmrahInquiry}
                    indexed
                    pagination
                />
            </div>
        </div>
    );
};

export default UmrahInquiryList;