// components/common/AppTable.tsx
'use client';
import { Table } from 'antd';

const DashboardTable = ({
  columns = [],
  data = [],
  loading = false,
  rowKey = "_id",
  pagination = false,
  scroll = { x: '100%' },
}) => {
  return (
    <div className="overflow-x-auto bg-white ">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination ? pagination : false}
        rowKey={rowKey}
        scroll={scroll}
      />
    </div>
  );
};

export default DashboardTable;
