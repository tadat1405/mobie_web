import React, { useEffect, useRef } from 'react';
import './AdminProduct.scss';
import { Button, Modal, Select, Space, Upload } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { useState } from 'react';
import { Checkbox, Form, Input } from 'antd';
import { getBase64, renderOptions } from '../../../utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';

const AdminProduct = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const user = useSelector((state) => state?.user);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateProduct, setStatteProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        rating: '',
        discount: '',
        description: '',
        newType : '',
    });
    const [stateProductDetails, setStatteProductDetails] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        rating: '',
        discount: '',
        description: '',
    });
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const mutation = useMutationHook(async (data) => {
        const { name, image, type, price, countInStock, rating, discount, description } =   data;
        console.log("data2222", data)
        const res = await ProductService.createProduct({
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            discount,
            description,
        });
        return res;
    });
    const { data, isPending, isSuccess } = mutation;

    const mutationUpdate = useMutationHook(async (data) => {
        const { id, token, ...rests } = data;
        const res = await ProductService.updateProduct(id, token, rests);
        return res;
    });
    const mutationDeleted = useMutationHook(async (data) => {
        const { id, token } = data;
        const res = await ProductService.deleteProduct(id, token);
        return res;
    });
    const mutationDeletedMany = useMutationHook(async (data) => {
        const { token,...ids } = data;
        const res = await ProductService.deleteManyProduct(ids, token);
        return res;
    });
    const {
        data: dataUpdate,
        isSuccess: isSuccessUpdate,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isSuccess: isSuccessDeleted,
    } = mutationDeleted;
    const {
        data: dataDeletedMany,
        isSuccess: isSuccessDeletedMany,
    } = mutationDeletedMany;
    
    
    useEffect(() => {
        if (isSuccess && data.status == 'OK') {
            toast.success(data.message);
            handleCancel();
        } else if (isSuccess && data?.status === 'ERR') {
            toast.error(data.message);
        }
    }, [isSuccess]);
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

    const handleDeleteManyProdcut = (ids)=>{
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
        setStatteProductDetails({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            rating: '',
            discount: '',
            description: '',
        });
        formUpdate.resetFields();
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formCreate.resetFields();
        setStatteProduct({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            rating: '',
            discount: '',
            description: '',
        });
    };
    const onFinish = () => {
        const param = {
            name: stateProduct.name,
            image: stateProduct.image,
            type: stateProduct.type ==='add_type'? stateProduct.newType : stateProduct.type,
            price: Number(stateProduct.price),
            countInStock: Number(stateProduct.countInStock),
            rating: Number(stateProduct.rating),
            discount: Number(stateProduct.discount),
            description: stateProduct.description,
        }
        console.log("discount", stateProduct)
        mutation.mutate({...param},{
                onSettled: () => {
                    refetch();
                },
            });
    };

    const handleOnchang = (e) => {
        setStatteProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangDetails = (e) => {
        setStatteProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnChangAvatar = async (file) => {
        const preview = await getBase64(file);
        setStatteProduct({
            ...stateProduct,
            image: preview,
        });
        return false;
    };
    const handleOnChangAvatarDetails = async (file) => {
        const preview = await getBase64(file);
        setStatteProductDetails({
            ...stateProductDetails,
            image: preview,
        });
        return false;
    };

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct();
        return res;
    };
     const fetchAllTypeProduct = async ()=>{
        const res = await ProductService.getAllTypeProduct()
        return res
      }
    const {
        isPending: isPendingProduct,
        data: products,
        refetch,
    } = useQuery({ queryKey: ['products'], queryFn: getAllProduct });
    const {
        isPending: isPendingTypeProduct,
        data: typeProduct,
    } = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct });
    console.log('dataaaaaaaa', typeProduct)
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
    const fetchDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStatteProductDetails({
                name: res?.data.name,
                image: res?.data.image,
                type: res?.data.type,
                price: res?.data.price,
                countInStock: res?.data.countInStock,
                rating: res?.data.rating,
                discount: res?.data.discount,
                description: res?.data.description,
            });
        }
        setIsPendingUpdate(false);
    };
    useEffect(() => {
        if (rowSelected) {
            fetchDetailsProduct(rowSelected);
        }
    }, [rowSelected]);

    useEffect(() => {
        formUpdate.setFieldsValue(stateProductDetails);
    }, [stateProductDetails, formUpdate]);

   const handleDetailsProduct = async (productId) => {
    setRowSelected(productId);
    await fetchDetailsProduct(productId);
    setIsOpenDrawer(true);
  };
    const handleDeleteClick = (productId) => {
    setRowSelected(productId);
    setIsModalOpenDelete(true);
}
    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return { ...product, key: product._id };
        });
    const onUpdateProdcut = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            token: user?.access_token,
            ...stateProductDetails,
        });
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleDeleteProduct = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    refetch();
                },
            }
        );
    };


    //Search 
  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
   //Colums
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a,b)=> a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a,b)=> a.price - b.price,
             filters: [
                    { text: '>= 50', value: '>=' },
                    { text: '<=50', value: '<=' },
                  ],
            onFilter: (value,record)=>{
              if(value === '>='){
                return record.price >=50
              }
              return record.price <= 50
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a,b)=> a.rating - b.rating,
            filters: [
                    { text: '>=4', value: '>=4' },
                    { text: '<=4', value: '<=4' },
                    
                    
                  ],
            onFilter: (value,record)=>{
              if(value === '>=4'){
                return record.rating >= 4
              }
              return record.rating <= 4
              
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            key: 'action',
              render: (text, record) => renderAction(record),
        },
    ];

    // const [typeSelect, setTypeSelect] = useState('')
    const handleChangeSelect = (value)=>{
            setStatteProduct({...stateProduct, type: value})
        
        
    }
    return (
        <div className="admin-user">
            <h1 className="admin-user__title">Quản lý người dùng</h1>
            <div className="admin-user__actions">
                <Button
                    onClick={showModal}
                    type="primary"
                    icon={<PlusOutlined />}
                    className="admin-user__add-button"
                >
                    Thêm sản phẩm
                </Button>
            </div>
            <div className="admin-user__table">
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isPending={isPendingProduct}
                    handleDeleteMany = {handleDeleteManyProdcut}
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
                <Modal
                    title="Tạo sản phẩm"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Loading isPending={isPending}>
                        <Form
                            name="basic"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 19 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                            onFinish={onFinish}
                            form={formCreate}
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
                                    value={stateProduct?.name}
                                    onChange={handleOnchang}
                                    name="name"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your type!',
                                    },
                                ]}
                            >
                                
                                <Select
                                     name='type'
                                    // defaultValue="lucy"
                                    // style={{ width: 120 }}
                                    value={stateProduct?.type}
                                    onChange={handleChangeSelect}
                                    options={renderOptions(typeProduct?.data)}
                                    />    
                            </Form.Item>
                            {stateProduct.type === 'add_type' && (
                                <Form.Item
                                label="New type"
                                name="newType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your type!',
                                    },
                                ]}
                            >
                                <Input value={stateProduct?.newType} onChange={handleOnchang} name='newType'/>        
                            </Form.Item>
                            )}
                            <Form.Item
                                label="Count instock"
                                name="countInStock"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your count inStock!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProduct?.countInStock}
                                    onChange={handleOnchang}
                                    name="countInStock"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your price!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProduct?.price}
                                    onChange={handleOnchang}
                                    name="price"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Rating"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your rating!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProduct?.rating}
                                    onChange={handleOnchang}
                                    name="rating"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Discount"
                                name="discount"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your discount!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProduct?.discount}
                                    onChange={handleOnchang}
                                    name="discount"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your description!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProduct?.description}
                                    onChange={handleOnchang}
                                    name="description"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Image"
                                name="image"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your image!',
                                    },
                                ]}
                            >
                                <Upload
                                    beforeUpload={handleOnChangAvatar}
                                    showUploadList={false}
                                >
                                    <Button>Select File</Button>
                                </Upload>
                            </Form.Item>
                            <div style={{ textAlign: 'center' }}>
                                {stateProduct?.image && (
                                    <img
                                        src={stateProduct?.image}
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
                                    Thêm sản phẩm
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </Modal>
                <DrawerComponent
                    title="Chi tiết sản phẩm"
                    isOpen={isOpenDrawer}
                    onClose={() => {
                        setIsOpenDrawer(false);
                    }}
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
                            onFinish={onUpdateProdcut}
                            form={formUpdate}
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
                                    value={stateProductDetails?.name}
                                    onChange={handleOnchangDetails}
                                    name="name"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your type!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.type}
                                    onChange={handleOnchangDetails}
                                    name="type"
                                />
                                
                            </Form.Item>

                            <Form.Item
                                label="Count instock"
                                name="countInStock"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your count inStock!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.countInStock}
                                    type="number"
                                    onChange={handleOnchangDetails}
                                    name="countInStock"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your price!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.price}
                                    type="number"
                                    onChange={handleOnchangDetails}
                                    name="price"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Rating"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your rating!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.rating}
                                    type="number"
                                    onChange={handleOnchangDetails}
                                    name="rating"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Discount"
                                name="discount"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your discount!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.discount}
                                    type="number"
                                    onChange={handleOnchangDetails}
                                    name="discount"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your description!',
                                    },
                                ]}
                            >
                                <Input
                                    value={stateProductDetails?.description}
                                    onChange={handleOnchangDetails}
                                    name="description"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Image"
                                name="image"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your image!',
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
                                {stateProductDetails?.image && (
                                    <img
                                        src={stateProductDetails?.image}
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
                                    Update Product
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawerComponent>
                <ModalComponent
                    title="Xóa sản phẩm"
                    open={isModalOpenDelete}
                    onCancel={handleCancelDelete}
                    onOk={handleDeleteProduct}
                >
                    <div>Bạn có chắc muốn xóa không ?</div>
                </ModalComponent>
            </div>
        </div>
    );
};
export default AdminProduct;
