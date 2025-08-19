import React, { useEffect, useRef } from 'react';
import './AdminUser.scss';
import { Button, Modal, Radio, Space, Upload } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { useState } from 'react';
import { Checkbox, Form, Input } from 'antd';
import { getBase64 } from '../../../utils';
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
    });
    const [form] = Form.useForm();

    const mutationUpdate = useMutationHook(async (data) => {
        const { id, token, ...rests } = data;
        const res = await UserService.updateUser(id, {...rests},token);
        return res;
    });
    const mutationDeleted = useMutationHook(async (data) => {
        const { id, token } = data;
        const res = await UserService.deleteUser(id, token);
        return res;
    });
     const mutationDeletedMany = useMutationHook(async (data) => {
            const { token,...ids } = data;
            const res = await UserService.deleteManyUser(ids, token);
            return res;
        });
    const {
        data: dataUpdate,
        isSuccess: isSuccessUpdate,
    } = mutationUpdate;
    console.log("dataUpdate",dataUpdate)
    const {
        data: dataDeleted,
        isSuccess: isSuccessDeleted,
    } = mutationDeleted;

    const {
        data: dataDeletedMany,
        isSuccess: isSuccessDeletedMany,
    } = mutationDeletedMany;

    useEffect(() => {
        if (isSuccessUpdate && dataUpdate.status == 'OK') {
            toast.success(dataUpdate.message);
            refetch();
            handleCloseDrawer();
        } else if (isSuccessUpdate && dataUpdate?.status === 'ERR') {
            toast.error(dataUpdate.message);
        }
    }, [isSuccessUpdate]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted.status == 'OK') {
            toast.success(dataDeleted.message);
            handleCancelDelete();
        } else if (isSuccessDeleted && dataDeleted?.status === 'ERR') {
            toast.error(dataDeleted.message);
        }
    }, [isSuccessDeleted]);
    useEffect(() => {
            if (isSuccessDeletedMany && dataDeletedMany.status == 'OK') {
                toast.success(dataDeletedMany.message);
                
            } else if (isSuccessDeletedMany && dataDeletedMany?.status === 'ERR') {
                toast.error(dataDeletedMany.message);
            }
        }, [isSuccessDeletedMany]);

     const handleDeleteManyUser = (ids)=>{
    mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    refetch();
                },
            }
        )
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            avatar: '',
            address: '',
        });
        form.resetFields();

    };
    

    // const handleCancel = () => {
    //     setIsModalOpen(false);
    //     setStateUser({
    //         name: '',
    //         email: '',
    //         phone: '',
    //         isAdmin: false,
    //     });
    //      form.resetFields();
    // };

    const handleOnchangDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };
    // const handleOnChangAvatar = async (file) => {
    //     const preview = await getBase64(file);
    //     setStateUser({
    //         ...stateUser,
    //         image: preview,
    //     });
    //     return false;
    // };
    // const handleOnChangAvatarDetails = async (file) => {
    //     const preview = await getBase64(file);
    //     setStateUserDetails({
    //         ...stateUserDetails,
    //         image: preview,
    //     });
    //     return false;
    // };

    const getAllUser = async () => {
        const res = await UserService.getAllUser();
        return res;
    };
    const {
        isPending: isPendingUsers,
        data: users,
        refetch,
    } = useQuery({ queryKey: ['users'], queryFn: getAllUser });
    const renderAction = (record) => {
  return (
    <div className="action">
      <DeleteOutlined
        className="action delete"
        onClick={() => handleDeleteClick(record._id)}
      />
      <EditOutlined
        className="action edit"
        onClick={() => handleDetailsProduct(record._id)}
      />
    </div>
  );
};

   const fetchDetailsUser = async (rowSelected) => {
    setIsPendingUpdate(true);
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
        setStateUserDetails({
            name: res?.data.name,
            email: res?.data.email,
            phone: res?.data.phone,
            isAdmin: res?.data.isAdmin,
            avatar: res?.data.avatar,
            address: res?.data.address
        });
    }
    setIsPendingUpdate(false);
};
  const handleOnChangAvatarDetails = async (file) => {
        const preview = await getBase64(file);
        setStateUserDetails({
            ...stateUserDetails,
            avatar: preview,
        });
        return false;
    };

    useEffect(() => {
        if (rowSelected) {
            fetchDetailsUser(rowSelected);
        }
    }, [rowSelected]);
    
    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [stateUserDetails, form]);

   const handleDetailsProduct = async (userId) => {
  setRowSelected(userId); // cập nhật trước
  await fetchDetailsUser(userId); // fetch theo ID mới
  setIsOpenDrawer(true); // mở sau khi có dữ liệu
};
const handleDeleteClick = (userId) => {
  setRowSelected(userId);
  setIsModalOpenDelete(true);
};


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
            dataIndex: 'name',
             sorter: (a,b)=> a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
             sorter: (a,b)=> a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
          title: 'Admin',
          dataIndex: 'isAdmin',
          filters: [
            {
              text: 'TRUE',
              value: true,
            },
            {
              text: 'FALSE',
              value: false,
            },
          ],
          onFilter: (value, record) => record.isAdmin === value,
          render: (isAdmin) => (isAdmin ? 'TRUE' : 'FALSE'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => renderAction(record),
        },
    ];
    const dataTable =
        users?.data?.length &&
        users?.data?.map((user) => {
            return { ...user,  phone: user.phone?.toString() || '',address: user.address?.toString() || '',key: user._id};
        });
        console.log('heheeh',dataTable)
    const onUpdateUser = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            token: user?.access_token,
            ...stateUserDetails,
        });
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleDeleteUser = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    refetch();
                },
            }
        );
    };
    return (
        <div className="admin-user">
            <h1 className="admin-user__title">Quản lý người dùng</h1>
            <div className="admin-user__table">
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isPending={isPendingUsers}
                    handleDeleteMany = {handleDeleteManyUser}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id);
                            },
                        };
                    }}
                />
            </div>
            <div>
                <DrawerComponent
                    title="Chi tiết người dùng"
                    isOpen={isOpenDrawer}
                    onClose={handleCloseDrawer}
                    width="40%"
                >
                    <Loading isPending={isPendingUpdate}>
                        <Form
                            name="basic"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 19 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                            onFinish={onUpdateUser}
                            form={form}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateUserDetails?.name}
                                    onChange={handleOnchangDetails}
                                    name="name"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateUserDetails?.email}
                                    onChange={handleOnchangDetails}
                                    name="email"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your count phone!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateUserDetails?.phone}
                                    onChange={handleOnchangDetails}
                                    name="phone"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your address!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateUserDetails?.address}
                                    onChange={handleOnchangDetails}
                                    name="address"
                                />
                            </Form.Item>
                            <Form.Item
                              label="Admin"
                              name="isAdmin"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn quyền admin!',
                                },
                              ]}
                            >
                              <Radio.Group
                                onChange={(e) =>
                                  setStateUserDetails((prev) => ({
                                    ...prev,
                                    isAdmin: e.target.value,
                                  }))
                                }
                                value={stateUserDetails?.isAdmin}
                              >
                                <Radio value={true}>Có</Radio>
                                <Radio value={false}>Không</Radio>
                              </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label="Avatar"
                                name="avatar"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your avatar!',
                                    },
                                ]}
                            >
                                <Upload
                                    beforeUpload={handleOnChangAvatarDetails}
                                    showUploadList={false}
                                >
                                    <Button>Select File</Button>
                                </Upload>
                            </Form.Item>
                            <div style={{ textAlign: 'center' }}>
                                {stateUserDetails?.avatar && (
                                    <img
                                        src={stateUserDetails?.avatar}
                                        style={{
                                            height: '150px',
                                            width: '150px',
                                            borderRadius: '10px',
                                            objectFit: 'cover',
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </div>

                            <Form.Item label={null}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        marginLeft: '55px',
                                        marginTop: '20px',
                                    }}
                                >
                                    Update User
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawerComponent>
                <ModalComponent
                    title="Xóa người dùng"
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteUser}
                >
                    <div>Bạn có chắc muốn xóa tài khoản này không ?</div>
                </ModalComponent>
            </div>
        </div>
    );
};
export default AdminUser;
