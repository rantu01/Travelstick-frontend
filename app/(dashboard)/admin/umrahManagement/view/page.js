"use client";
import React, { useEffect } from "react";
import { getSingleUmrahInquiry, updateUmrahInquiry } from "@/app/helper/backend";
import { useFetch, useActionConfirm } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { Select, Tag } from "antd";
import dayjs from "dayjs";

const STATUS_COLORS = {
    pending: "orange",
    "in-progress": "blue",
    resolved: "green",
};

const TOPIC_COLORS = [
    "geekblue", "purple", "cyan", "volcano", "gold", "magenta", "lime",
];

const Field = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#9a8e80] uppercase tracking-wide">
            {label}
        </span>
        <span className="description-1 text-[#05073C]">{value || "—"}</span>
    </div>
);

const ViewUmrahInquiry = () => {
    const [data, getData] = useFetch(getSingleUmrahInquiry, {}, false);
    const searchParams = useSearchParams();
    const id = searchParams.get("_id");
    const i18n = useI18n();

    useEffect(() => {
        if (id) getData({ _id: id });
    }, [id]);

    const inquiry = data;

    const handleStatusChange = (newStatus) => {
        useActionConfirm(
            updateUmrahInquiry,
            { _id: id, status: newStatus },
            () => getData({ _id: id })
        );
    };

    return (
        <div className="w-full overflow-x-auto mt-7 px-6">
            <div className="rounded dashboardInput bg-white">
                {/* Header */}
                <div className="flex justify-between px-6 pt-6 pb-4 items-center border-b border-gray-100">
                    <h1 className="text-[#05073C] heading-3">
                        {i18n.t("Umrah Inquiry Details")}
                    </h1>
                    <BackButton />
                </div>

                {inquiry && (
                    <div className="px-6 py-8 space-y-8">

                        {/* ── Status Banner ── */}
                        <div className="flex items-center gap-4 bg-[#f7f3ec] border border-[#ede7d9] rounded-xl px-5 py-4">
                            <span className="text-2xl">🕌</span>
                            <div className="flex-1">
                                <p className="text-xs text-[#9a8e80] font-semibold uppercase tracking-wide mb-1">
                                    Inquiry Status
                                </p>
                                <Select
                                    value={inquiry.status}
                                    onChange={handleStatusChange}
                                    style={{ width: 160 }}
                                    options={[
                                        { value: "pending", label: "⏳ Pending" },
                                        { value: "in-progress", label: "🔄 In Progress" },
                                        { value: "resolved", label: "✅ Resolved" },
                                    ]}
                                />
                            </div>
                            <Tag
                                color={STATUS_COLORS[inquiry.status]}
                                className="text-sm px-3 py-1 font-semibold capitalize"
                            >
                                {inquiry.status}
                            </Tag>
                        </div>

                        {/* ── Contact Info ── */}
                        <div>
                            <h2 className="heading-4 text-[#05073C] mb-4">
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-5">
                                <Field label="Full Name" value={inquiry.name} />
                                <Field
                                    label="Email"
                                    value={
                                        <a
                                            href={`mailto:${inquiry.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {inquiry.email}
                                        </a>
                                    }
                                />
                                <Field
                                    label="Phone / WhatsApp"
                                    value={
                                        inquiry.phone ? (
                                            <a
                                                href={`tel:${inquiry.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {inquiry.phone}
                                            </a>
                                        ) : null
                                    }
                                />
                                <Field
                                    label="Best Way to Reach"
                                    value={
                                        <Tag
                                            color={
                                                inquiry.reachBy === "WhatsApp"
                                                    ? "green"
                                                    : inquiry.reachBy === "Phone Call"
                                                    ? "blue"
                                                    : "purple"
                                            }
                                        >
                                            {inquiry.reachBy}
                                        </Tag>
                                    }
                                />
                                <Field
                                    label="Submitted At"
                                    value={dayjs(inquiry.createdAt).format(
                                        "DD MMM YYYY, hh:mm A"
                                    )}
                                />
                            </div>
                        </div>

                        {/* ── Topics ── */}
                        {inquiry.topics?.length > 0 && (
                            <div>
                                <h2 className="heading-4 text-[#05073C] mb-3">
                                    Selected Topics
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {inquiry.topics.map((t, i) => (
                                        <Tag
                                            key={i}
                                            color={TOPIC_COLORS[i % TOPIC_COLORS.length]}
                                            className="text-sm px-3 py-1"
                                        >
                                            {t}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Question / Intention ── */}
                        {inquiry.question && (
                            <div>
                                <h2 className="heading-4 text-[#05073C] mb-3">
                                    Question / Intention
                                </h2>
                                <div className="bg-[#f7f3ec] border border-[#ede7d9] border-l-4 border-l-[#c8a96e] rounded-xl px-5 py-4">
                                    <p className="description-1 text-[#7a7060] leading-relaxed italic">
                                        ❝ {inquiry.question}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Quick Actions ── */}
                        <div>
                            <h2 className="heading-4 text-[#05073C] mb-3">
                                Quick Actions
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {inquiry.phone && (
                                    <a
                                        href={`https://wa.me/${inquiry.phone.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <span>📲</span> WhatsApp
                                    </a>
                                )}
                                <a
                                    href={`mailto:${inquiry.email}`}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <span>✉️</span> Send Email
                                </a>
                                {inquiry.phone && (
                                    <a
                                        href={`tel:${inquiry.phone}`}
                                        className="flex items-center gap-2 bg-[#1a4fa0] hover:bg-[#153d80] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <span>📞</span> Call
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewUmrahInquiry;