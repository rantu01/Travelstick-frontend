/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
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

const UmrahInquiryList = () => {
    // getData কল করলে ডাটা রিফ্রেশ হবে
    const [data, getData, { loading }] = useFetch(getAllUmrahInquiries);
    const i18n = useI18n();
    const router = useRouter();

    const handleStatusChange = (id, newStatus) => {
        useActionConfirm(
            updateUmrahInquiry,
            { _id: id, status: newStatus },
            getData
        );
    };

    const handleDelete = (id) => {
        useActionConfirm(deleteUmrahInquiry, id, getData);
    };

    return (
        <div className="w-full mt-7 px-6">
            <div className="rounded bg-white shadow-sm pb-6">
                <div className="flex justify-between px-8 pt-8 pb-6 items-center">
                    <h1 className="text-[#05073C] text-2xl font-bold">
                        {i18n.t("Umrah Inquiries")}
                    </h1>
                    <BackButton />
                </div>

                <div className="overflow-x-auto px-8">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">#</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Contact Info</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Reach By</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Topics</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">Loading inquiries...</td>
                                </tr>
                            ) : data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <Tooltip title={item.name?.length > 20 ? item.name : ""}>
                                                <span className="font-medium text-[#05073C] block truncate w-40">
                                                    {item.name}
                                                </span>
                                            </Tooltip>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <a href={`mailto:${item.email}`} className="text-blue-600 text-xs hover:underline">
                                                    {item.email}
                                                </a>
                                                <span className="text-gray-500 text-xs">{item.phone || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Tag color={item.reachBy === "WhatsApp" ? "green" : "blue"}>
                                                {item.reachBy}
                                            </Tag>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.topics?.length > 0 ? (
                                                    item.topics.map((t, i) => (
                                                        <Tag key={i} color="geekblue" className="m-0 text-[10px]">
                                                            {t}
                                                        </Tag>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Select
                                                value={item.status}
                                                size="small"
                                                style={{ width: 120 }}
                                                onChange={(val) => handleStatusChange(item._id, val)}
                                                options={[
                                                    { value: "pending", label: "Pending" },
                                                    { value: "in-progress", label: "In Progress" },
                                                    { value: "resolved", label: "Resolved" },
                                                ]}
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {dayjs(item.createdAt).format("DD MMM YYYY")}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button 
                                                    onClick={() => router.push(`/admin/umrahManagement/view?_id=${item._id}`)}
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">No inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UmrahInquiryList;