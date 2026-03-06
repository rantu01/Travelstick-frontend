/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Form, Upload, Modal, message, Input as AntInput } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActionConfirm } from "@/app/helper/hooks";
import { deleteImage } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";

const MultiImageWithTextInput = (props) => {
    const i18n = useI18n();
    let max = props.max || 1;
    let name = props.name || "img_with_text";
    let label = props.label;

    return (
        <Form.Item
            name={name}
            label={i18n.t(label)}
            rules={[{ required: props?.required, message: `Please upload ${label || "images"}` }]}
        >
            <CustomInput max={max} />
        </Form.Item>
    );
};

const CustomInput = ({ value = [], onChange, max }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // স্ল্যাশ ফিক্স করার ফাংশন
    const fixPath = (path) => {
        if (!path) return "";
        return path.replace(/\\/g, '/');
    };

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(fixPath(file?.url || file?.preview));
        setPreviewVisible(true);
    };

    const handleChange = ({ fileList }) => {
        // নতুন ফাইলগুলোর পাথও ক্লিন করে রাখা
        const cleanedList = fileList.map(file => ({
            ...file,
            url: file.url ? fixPath(file.url) : file.url,
            // যদি রেসপন্স থেকে সরাসরি ডাটা আসে
            thumbUrl: file.response?.data?.image ? fixPath(file.response.data.image) : file.thumbUrl
        }));
        onChange(cleanedList);
    };

    const handleTextChange = (index, textValue) => {
        const newList = [...value];
        newList[index].text = textValue;
        onChange(newList);
    };

    const handleRemove = async (file) => {
        if (file.url) {
            try {
                const payload = { file: fixPath(file.url) };
                await useActionConfirm(() => deleteImage(payload));
            } catch (error) {
                message.error("Failed to delete file.");
                return false;
            }
        }
    };

    return (
        <>
            <Upload
                accept="image/png, image/gif, image/jpeg, image/webp"
                listType="picture-card"
                // Ant Design কে সঠিক ফরম্যাটে ডাটা দেওয়া হচ্ছে
                fileList={value.map((item, idx) => ({
                    ...item,
                    uid: item.uid || idx,
                    status: 'done',
                    url: fixPath(item.url)
                }))}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                maxCount={max}
            >
                {value.length < max && "+ Upload"}
            </Upload>

            <div className="mt-4 grid grid-cols-1 gap-2">
                {value.map((file, index) => (
                    <div key={file.uid || index} className="flex items-center gap-2 mb-2 p-2 border rounded bg-gray-50 shadow-sm">
                        <div className="relative w-10 h-10 overflow-hidden rounded border bg-white">
                            <img 
                                src={fixPath(file.url || file.thumbUrl || "")} 
                                alt="thumb" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/40x40?text=Error"; // ইমেজ না পেলে প্লেসহোল্ডার
                                }}
                            />
                        </div>
                        <AntInput 
                            placeholder="Enter title/text"
                            value={file.text || ""}
                            onChange={(e) => handleTextChange(index, e.target.value)}
                            className="flex-1"
                        />
                    </div>
                ))}
            </div>

            <Modal open={previewVisible} footer={null} onCancel={handleCancel} title="Preview">
                <div className="relative w-full h-[400px]">
                    <img 
                        alt="preview" 
                        style={{ width: '100%', height: 'auto' }} 
                        src={fixPath(previewImage)} 
                    />
                </div>
            </Modal>
        </>
    );
};

export default MultiImageWithTextInput;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}