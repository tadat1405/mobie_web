import { Menu } from 'antd';
import React, { useState } from 'react';
import { ProductOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';

const AdminPage = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState([]);
    const [keySelect, setKeySelect] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'User':
                return <AdminUser />;
            case 'Product':
                return <AdminProduct />;
            case 'Order':
                return <OrderAdmin />
            default:
                return <></>;
        }
    };

    const onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(
            (key) => !stateOpenKeys.includes(key)
        );
        if (latestOpenKey) {
            setStateOpenKeys([latestOpenKey]);
        } else {
            setStateOpenKeys([]);
        }
    };

    const handleOnClick = ({ key }) => {
        setKeySelect(key);
    };

    const items = [
        {
            key: 'User',
            icon: <UserOutlined />,
            label: 'User',
        },
        {
            key: 'Product',
            icon: <ProductOutlined />,
            label: 'Product',
        },
        {
            key: 'Order',
            icon: <ShoppingCartOutlined />,
            label: 'Order',
        }
    ];

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddentCard />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[keySelect]}
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    style={{ width: 256, boxShadow: '1px 1px 2px #ccc' }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: '1', padding: '20px' }}>
                    {renderPage(keySelect)}
                </div>
            </div>
        </>
    );
};

export default AdminPage;
