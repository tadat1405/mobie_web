import React, { useRef } from 'react';
import './OrderAdmin.scss';
import { Button, Space } from 'antd';
import {  SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import {  Input } from 'antd';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
// import { useSelector } from 'react-redux';
import PieChartComponent from './PieChart';
import AxisLables from './AxisLables';

const OrderAdmin = () => {
    // const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder();
        return res;
    };
    const { isPending: isPendingOrders, data: orders} = useQuery({ queryKey: ['order'], queryFn: getAllOrder });

    //  Chức năng Search của table
  const handleSearch = (
    selectedKeys,
    confirm,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys , confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value ).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
             sorter: (a,b)=> a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName')
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
           
        },
        {
          title: 'Tình trạng',
          dataIndex: 'isPaid',
          filters: [
            {
              text: 'Đã thanh toán',
              value: true,
            },
            {
              text: 'Chưa thanh toán',
              value: false,
            },
          ],
          render: (isPaid) => (isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        
    ];
    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return { ...order, key: order._id, 
                userName: order?.shippingAddress?.fullName, 
                phone: order?.shippingAddress?.phone,
                address: `${order?.shippingAddress?.address} - ${order?.shippingAddress?.city}`,
                isPaid: order?.isPaid,
                time:  new Date(order?.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

            };
        });

       
   
    
    
    return (
        <div className="admin-user">
            <h1 className="admin-user__title">Quản lý đơn hàng</h1>
            <div style={{height: '300px', width: '100%', display: 'flex'}}>
            <PieChartComponent order = {orders?.data}/>
            <AxisLables />
            </div>
            <div className="admin-user__table">
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isPending={isPendingOrders}
                />
            </div>
        </div>
    );
};
export default OrderAdmin;
