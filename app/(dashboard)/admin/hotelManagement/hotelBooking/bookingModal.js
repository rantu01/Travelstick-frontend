"use client";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { getStatusClass } from "@/app/helper/utils";
import { Image, Modal, message } from "antd";
import dayjs from "dayjs";
const HotelBookingModal = ({
  viewModalOpen,
  setViewModalOpen,
  viewData,
  setViewData,
  slug = "admin",
}) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const { currency_symbol } = useCurrency();

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = dayjs(date);
    return parsed.isValid() ? parsed.format("DD MMM YYYY") : "N/A";
  };

  const getRoomName = (room) => {
    return room?.name?.[langCode] || room?.name || room?._id || "N/A";
  };

  const getLocalizedText = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value?.[langCode] || value?.en || value?.bn || "";
    }
    return String(value);
  };

  const isObjectId = (value) => {
    return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
  };

  const getRoomDisplayName = (roomDetail, idx = 0) => {
    if (!roomDetail) return "N/A";

    const room = roomDetail?.room;

    // 1) direct name/title on detail item
    const directName =
      getLocalizedText(roomDetail?.room_name) ||
      getLocalizedText(roomDetail?.name) ||
      getLocalizedText(roomDetail?.title);
    if (directName) return directName;

    // 2) populated room object
    if (room && typeof room === "object") {
      const roomName = getLocalizedText(room?.name) || getLocalizedText(room?.title);
      if (roomName) return roomName;
      if (room?._id && !isObjectId(room?._id)) return String(room._id);
    }

    // 3) room as plain string (sometimes name, sometimes ObjectId)
    if (typeof room === "string" && !isObjectId(room)) {
      return room;
    }

    // 4) booking-level fallback from new hotel booking flow
    const bookingLevelRoomName =
      getLocalizedText(viewData?._room_name) ||
      getLocalizedText(viewData?.room_name) ||
      getLocalizedText(viewData?.room?.name) ||
      getLocalizedText(viewData?.room?.title);
    if (bookingLevelRoomName) {
      return bookingLevelRoomName;
    }

    // 5) last fallback: show short room id if available, instead of N/A
    if (typeof room === "string" && room) {
      return `${i18n.t("Room ID")}: ${room.slice(-8)}`;
    }

    if (room?._id) {
      return `${i18n.t("Room ID")}: ${String(room._id).slice(-8)}`;
    }

    // if booking has one room detail item and count exists, avoid empty display
    if (idx === 0 && viewData?.room_details?.length === 1) {
      return i18n.t("Room information not available");
    }

    return "N/A";
  };

  const handleDownloadItineraryPdf = async () => {
    if (!viewData) return;

    try {
      const jspdfModule = await import("jspdf");
      const JsPdfConstructor = jspdfModule.jsPDF || jspdfModule.default;
      const pdf = new JsPdfConstructor({ unit: "pt", format: "a4" });

      const pageWidth = 595;
      const pageHeight = 841;
      const marginX = 40;
      const contentWidth = pageWidth - marginX * 2;
      let y = 0;

      // ── Color palette ──────────────────────────────────────────────
      const PRIMARY = [13, 71, 161];   // deep blue
      const ACCENT = [25, 118, 210];   // medium blue
      const LIGHT_BG = [236, 246, 255];  // light blue tint
      const DARK_TXT = [18, 18, 50];   // near-black
      const MID_TXT = [90, 90, 110];   // grey
      const WHITE = [255, 255, 255];
      const BORDER = [200, 215, 230];

      const setColor = (rgb, type = "text") => {
        if (type === "fill") pdf.setFillColor(...rgb);
        if (type === "draw") pdf.setDrawColor(...rgb);
        if (type === "text") pdf.setTextColor(...rgb);
      };

      // ── Helpers ────────────────────────────────────────────────────
      const checkPage = (needed = 60) => {
        if (y + needed > pageHeight - 30) { pdf.addPage(); y = 40; }
      };

      const hLine = (yPos, color = BORDER) => {
        setColor(color, "draw");
        pdf.setLineWidth(0.5);
        pdf.line(marginX, yPos, marginX + contentWidth, yPos);
      };

      const loadImageAsDataURL = async (url) => {
        try {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) throw new Error();
          const blob = await res.blob();
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch { return null; }
      };

      // ═══════════════════════════════════════════════════════════════
      // HEADER BANNER
      // ═══════════════════════════════════════════════════════════════
      setColor(PRIMARY, "fill");
      pdf.rect(0, 0, pageWidth, 90, "F");

      // Hotel image in header (top-left corner, small thumbnail)
      const hotelImage = viewData?.hotel?.card_image;
      let imgData = null;
      if (hotelImage) imgData = await loadImageAsDataURL(hotelImage).catch(() => null);

      let headerTextX = marginX;
      if (imgData) {
        try {
          pdf.addImage(imgData, "JPEG", marginX, 10, 70, 68, undefined, "FAST");
          headerTextX = marginX + 82;
        } catch {
          try { pdf.addImage(imgData, "PNG", marginX, 10, 70, 68, undefined, "FAST"); headerTextX = marginX + 82; }
          catch { /* skip */ }
        }
      }

      // Title
      setColor(WHITE, "text");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text(i18n.t("Hotel Booking Itinerary"), headerTextX, 38);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      setColor([180, 210, 255], "text");
      pdf.text(`${i18n.t("Booking Id")}: ${viewData?.booking_id || "N/A"}`, headerTextX, 56);

      // Date stamp top-right
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const dateStr = `${i18n.t("Booking Date")}: ${formatDate(viewData?.createdAt)}`;
      pdf.text(dateStr, pageWidth - marginX, 56, { align: "right" });

      y = 108;

      // ═══════════════════════════════════════════════════════════════
      // SECTION helper  (draws a pill header + returns new y)
      // ═══════════════════════════════════════════════════════════════
      const sectionHeader = (title) => {
        checkPage(50);
        setColor(LIGHT_BG, "fill");
        setColor(ACCENT, "draw");
        pdf.setLineWidth(0);
        pdf.rect(marginX, y, contentWidth, 22, "F");
        // left accent bar
        setColor(ACCENT, "fill");
        pdf.rect(marginX, y, 4, 22, "F");

        setColor(ACCENT, "text");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(title, marginX + 12, y + 15);
        y += 30;
      };

      // ── Two-column info block helper ──────────────────────────────
      const ROW_H = 22;
      const LABEL_W = 130;

      const infoRow = (label, value, col = 0) => {
        const colW = (contentWidth - 20) / 2;
        const x = marginX + col * (colW + 20);

        setColor(DARK_TXT, "text");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text(label, x, y + 12);

        setColor(MID_TXT, "text");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const val = String(value || "N/A");
        const maxW = colW - LABEL_W - 10;
        const lines = pdf.splitTextToSize(val, maxW > 60 ? maxW : colW - 5);
        lines.forEach((ln, i) => {
          pdf.text(ln, x + LABEL_W, y + 12 + i * 11);
        });
      };

      // ── Single full-width row ─────────────────────────────────────
      const fullRow = (label, value, highlight = false) => {
        checkPage(ROW_H + 4);
        if (highlight) {
          setColor(LIGHT_BG, "fill");
          pdf.rect(marginX, y, contentWidth, ROW_H, "F");
        }
        setColor(DARK_TXT, "text");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text(label, marginX + 8, y + 14);

        setColor(MID_TXT, "text");
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(String(value || "N/A"), contentWidth - LABEL_W - 20);
        lines.forEach((ln, i) => pdf.text(ln, marginX + LABEL_W + 20, y + 14 + i * 11));

        hLine(y + ROW_H, BORDER);
        y += ROW_H;
      };

      // ═══════════════════════════════════════════════════════════════
      // SECTION 1 — Stay Details
      // ═══════════════════════════════════════════════════════════════
      sectionHeader(`  ${i18n.t("Stay Details")}`);

      const col1Items = [
        [i18n.t("Hotel Name"), viewData?.hotel?.name?.[langCode] || viewData?.hotel?.name || "N/A"],
        [i18n.t("Check-In"), formatDate(viewData?.check_in)],
        [i18n.t("Check-Out"), formatDate(viewData?.check_out)],
      ];
      const col2Items = [
        [i18n.t("Guests"), viewData?.person],
        [i18n.t("Booking Price"), `BDT ${viewData?.amount || 0}`],
        [i18n.t("Booking Date"), formatDate(viewData?.createdAt)],
      ];

      const rows = Math.max(col1Items.length, col2Items.length);
      for (let i = 0; i < rows; i++) {
        checkPage(ROW_H + 4);
        const bg = i % 2 === 0 ? [250, 253, 255] : WHITE;
        setColor(bg, "fill");
        pdf.rect(marginX, y, contentWidth, ROW_H, "F");
        hLine(y + ROW_H, BORDER);

        if (col1Items[i]) infoRow(col1Items[i][0], col1Items[i][1], 0);
        if (col2Items[i]) infoRow(col2Items[i][0], col2Items[i][1], 1);
        y += ROW_H;
      }

      y += 16;

      // ═══════════════════════════════════════════════════════════════
      // SECTION 2 — Guest & Payment
      // ═══════════════════════════════════════════════════════════════
      sectionHeader(`  ${i18n.t("Order & Payment")}`);

      const payItems = [
        [i18n.t("User Name"), viewData?.user?.name, false],
        [i18n.t("Order Status"), viewData?.status, true],
        [i18n.t("Payment Method"), viewData?.payment?.method, false],
        [i18n.t("Transaction Id"), viewData?.payment?.transaction_id, true],
        [i18n.t("Payment Status"), viewData?.payment?.status, false],
      ];

      payItems.forEach(([label, val, hl]) => fullRow(label, val, hl));
      y += 16;

      // ═══════════════════════════════════════════════════════════════
      // SECTION 3 — Room Details
      // ═══════════════════════════════════════════════════════════════
      if (viewData?.room_details?.length > 0) {
        checkPage(60);
        sectionHeader(`  ${i18n.t("Room Details")}`);

        // Table header
        setColor(ACCENT, "fill");
        pdf.rect(marginX, y, contentWidth, 20, "F");
        setColor(WHITE, "text");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text(i18n.t("Room Name"), marginX + 8, y + 14);
        pdf.text(i18n.t("Count"), marginX + contentWidth - 50, y + 14);
        y += 20;

        viewData.room_details.forEach((rd, idx) => {
          const roomName = getRoomDisplayName(rd, idx);
          const count = String(rd?.count ?? "N/A");
          const lines = pdf.splitTextToSize(roomName, contentWidth - 80);
          const rowH = Math.max(ROW_H, lines.length * 12 + 8);
          checkPage(rowH + 4);

          const bg = idx % 2 === 0 ? [250, 253, 255] : WHITE;
          setColor(bg, "fill");
          pdf.rect(marginX, y, contentWidth, rowH, "F");
          hLine(y + rowH, BORDER);

          setColor(MID_TXT, "text");
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          lines.forEach((ln, i) => pdf.text(ln, marginX + 8, y + 14 + i * 12));
          pdf.text(count, marginX + contentWidth - 46, y + 14);
          y += rowH;
        });
      }

      y += 20;

      // ═══════════════════════════════════════════════════════════════
      // FOOTER
      // ═══════════════════════════════════════════════════════════════
      const totalPages = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        setColor(PRIMARY, "fill");
        pdf.rect(0, pageHeight - 28, pageWidth, 28, "F");
        setColor(WHITE, "text");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.text("Thank you for your booking!", marginX, pageHeight - 11);
        pdf.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 11, { align: "right" });
      }

      const bookingId = viewData?.booking_id || "hotel-booking";
      pdf.save(`hotel-itinerary-${bookingId}.pdf`);
    } catch (error) {
      console.error("Failed to generate hotel itinerary PDF:", error);
      message.error(i18n.t("Failed to download itinerary PDF"));
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Modal
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false), setViewData(null);
        }}
        footer={null}
        destroyOnClose
        width={800}
        centered
      >
        {viewData && (
          <div className="modal-wrapper">
            <div className="mt-4">
              <h2 className="text-[#05073C] heading-3 text-center">
                {i18n.t("Hotel Booking Details")}
              </h2>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded description-2"
                  onClick={handleDownloadItineraryPdf}
                >
                  {i18n.t("Download Itinerary PDF")}
                </button>
              </div>
              <div className="mt-4 flex gap-5">
                {viewData?.hotel?.card_image && (
                  <div className="">
                    <p className="text-[#05073C] description-2">Hotel Image:</p>

                    <Image
                      src={viewData?.hotel?.card_image}
                      width={200}
                      height={100}
                      alt="image"
                    />
                  </div>
                )}
                {slug === "admin" && (
                  <div className="">
                    {viewData?.user?.image && (
                      <div>
                        <p className="text-[#05073C] description-2">
                          {i18n.t("User Image")}:
                        </p>
                        <Image
                          src={viewData?.user?.image}
                          width={100}
                          height={100}
                          alt="image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <table className="w-full text-left text-[#05073C] mt-6">
                <tbody>
                  {[
                    { label: "Booking Id", value: viewData?.booking_id },
                    {
                      label: "Hotel name",
                      value: viewData?.hotel?.name?.[langCode],
                    },
                    {
                      label: "Booking Price",
                      value: `${currency_symbol} ${viewData?.amount}`,
                    },
                    {
                      label: "Booking Date",
                      value: dayjs(viewData?.createdAt).format("DD MMM YYYY"),
                    },
                    {
                      label: "Check In Date",
                      value: dayjs(viewData?.check_in).format("DD MMM YYYY"),
                    },
                    {
                      label: "Check out Date",
                      value: dayjs(viewData?.check_out).format("DD MMM YYYY"),
                    },
                    { label: "Booking Person", value: viewData?.person },
                    { label: "Order Status", value: viewData?.status },
                    { label: "User Name", value: viewData?.user?.name },
                    {
                      label: "Payment Method",
                      value: viewData?.payment?.method,
                    },
                    {
                      label: "Transaction Id",
                      value: viewData?.payment?.transaction_id,
                    },
                    {
                      label: "Payment Status",
                      value: viewData?.payment?.status,
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={index < 20 ? "border border-gray-200" : ""}
                    >
                      <td className="py-2 px-4 description-2 text-[#05073C] whitespace-pre">
                        {i18n.t(item.label)}
                      </td>
                      <td
                        className={`${getStatusClass(
                          item.value
                        )} py-3 my-1 px-4 description-1 text-[#717171] capitalize`}
                      >
                        {item.value || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Room Details */}
              {viewData?.room_details?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-[#05073C] font-semibold text-sm mb-2">
                    {i18n.t("Room Details")}
                  </h3>
                  <table className="w-full text-left text-[#05073C] border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 description-2 font-semibold">{i18n.t("Room")}</th>
                        <th className="py-2 px-4 description-2 font-semibold">{i18n.t("Count")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewData.room_details.map((rd, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="py-2 px-4 description-2 text-[#717171]">
                            {getRoomDisplayName(rd, idx)}
                          </td>
                          <td className="py-2 px-4 description-1 text-[#717171]">
                            {rd?.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HotelBookingModal;
