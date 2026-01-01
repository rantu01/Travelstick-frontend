
'use client';
import React, { useEffect, useState } from "react";
import { Table, Checkbox } from "antd";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useRouter, useSearchParams } from "next/navigation";
import { AssignPermissions, GetAllPermission, GetAllRoles } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { useI18n } from "@/app/contexts/i18n";
import { useUser } from "@/app/contexts/user";

export const loader = () => {
  return {
    API_URL: process.env.API_URL || "",
  };
};

const Role = () => {
  const [role, getRole] = useFetch(GetAllRoles, {}, false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const permissionId = searchParams.get("_id");
  const [data] = useFetch(GetAllPermission);
  const [permissions, setPermissions] = useState([]);
  const { user, getCurrentUser } = useUser();
  useEffect(() => {
    getCurrentUser();
  }, []);
  const i18n = useI18n();

  useEffect(() => {
    if (permissionId) {
      getRole({ _id: permissionId });
    }
  }, [permissionId]);

  useEffect(() => {
    if (role?._id) {
      setPermissions(role?.permissions || []);
    }
  }, [role]);

  const isChecked = (permissionKey) =>
    permissions.includes(permissionKey);

  const handleChange = (
    e,
    permissionKey,
    isMain = false
  ) => {
    const checked = e.target.checked;
    if (isMain) {
      const relatedPermissions = [
        `${permissionKey}_create`,
        `${permissionKey}_edit`,
        `${permissionKey}_delete`,
        `${permissionKey}_view`,
      ];

      if (checked) {
        setPermissions((prev) => [...new Set([...prev, permissionKey, ...relatedPermissions])]);
      } else {
        setPermissions((prev) => prev.filter((perm) => ![permissionKey, ...relatedPermissions].includes(perm)));
      }
    } else {
      if (checked) {
        setPermissions((prev) => [...prev, permissionKey]);
      } else {
        setPermissions((prev) => prev.filter((perm) => perm !== permissionKey));
      }
    }
  };


  const renderCheckbox = (key, isMain = false) => (
    <Checkbox
      checked={isChecked(key)}
      onChange={(e) => handleChange(e, key, isMain)}
    />
  );

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      "inline-size": "40px",
      render: (_, record) => renderCheckbox(record.permission, true),
    },
    {
      title: "Name",
      dataIndex: "name",
      "inline-size": "200px",
    },
    {
      title: "Create",
      dataIndex: "create",
      "inline-size": "200px",
      render: (_, record) =>
        renderCheckbox(`${record.permission}_create`),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      "inline-size": "200px",
      render: (_, record) =>
        renderCheckbox(`${record.permission}_edit`),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      "inline-size": "200px",
      render: (_, record) =>
        renderCheckbox(`${record.permission}_delete`),
    },
    {
      title: "View",
      dataIndex: "view",
      "inline-size": "200px",
      render: (_, record) =>
        renderCheckbox(`${record.permission}_view`),
    },
  ];

  const handleSave = async () => {
    try {
      await useAction(AssignPermissions, {
        body: {
          role: permissionId, permissions
        }
      },);
      router.push('/admin/rolePermission');
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto mt-4 px-6 py-6 dashboardModal">
      <div className=" rounded dashboardInput bg-white px-8 py-8">
        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center">
            <h2 className="pt-3 pb-2 heading-3 text-[#05073C]">{i18n.t("Roles Permission")}: {role?.name}</h2>
          </div>
          <BackButton />
        </div>
        <div className="overflow-x-auto mt-6">
          <div className="">
            {data && (
              <Table
                className="custom-table12"
                pagination={false}
                columns={columns}
                dataSource={data?.map((item, index) => ({
                  ...item,
                  key: index,
                }))}
                bordered
              />
            )}
            <button
              className="px-4 py-2 bg-primary text-white rounded mt-4"
              onClick={handleSave}
            >
              {i18n.t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
