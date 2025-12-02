import React from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import useStore from '../../store/useStore';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { cart, toggleCart } = useStore();
    const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-10 fixed w-full top-0 z-50">
            <Link to="/" className="text-xl font-bold">电商 Demo</Link>
            <div className="flex-1 text-center hidden md:block text-gray-500">导航栏</div>
            <div
                className="cursor-pointer hover:text-blue-500"
                onClick={() => toggleCart(true)}
            >
                <Badge count={totalItems} size="small">
                    <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                </Badge>
            </div>
        </div>
    );
};

export default Navbar;