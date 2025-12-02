import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, InputNumber, Divider, message, Drawer, List, Avatar } from 'antd';
import Navbar from '../components/common/Navbar';
import useStore from '../store/useStore';
import { DeleteOutlined } from '@ant-design/icons';

const ProductDetail = () => {
    const { state } = useLocation();
    const product = state?.product; // 这里的 product 来自列表页传参，实际项目应根据 useParams ID 请求详情接口

    // 规格状态
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [count, setCount] = useState(1);

    const { addToCart, cart, isCartOpen, toggleCart, removeFromCart } = useStore();

    if (!product) return <div className="pt-20 text-center">商品不存在</div>;

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            message.error('请选择完整的规格（尺码和颜色）');
            return;
        }
        addToCart(product, { size: selectedSize, color: selectedColor, count });
    };

    return (
        <div className="min-h-screen pt-20 pb-10 bg-gray-50">
            <Navbar />

            <div className="max-w-[1200px] mx-auto bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-10">

                    {/* 左侧：图片展示区 */}
                    <div className="w-full md:w-1/2">
                        <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-4 border flex items-center justify-center">
                            <img src={product.images[0]} alt="Main" className="object-contain h-full w-full" />
                        </div>
                        {/* 缩略图列表 */}
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((img, idx) => (
                                <div key={idx} className="w-20 h-20 border rounded cursor-pointer hover:border-blue-500">
                                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧：信息与规格区 */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                            <div className="text-3xl text-red-600 font-bold">¥{product.price}</div>
                        </div>

                        <Divider />

                        {/* 尺码选择 */}
                        <div>
                            <h3 className="font-bold mb-2">尺码</h3>
                            <div className="flex gap-2">
                                {product.sizes.map(size => (
                                    <div
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded cursor-pointer transition 
                      ${selectedSize === size ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:border-gray-400'}`}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 颜色选择 */}
                        <div>
                            <h3 className="font-bold mb-2">颜色</h3>
                            <div className="flex gap-2">
                                {product.colors.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded cursor-pointer transition 
                      ${selectedColor === color ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:border-gray-400'}`}
                                    >
                                        {color}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 数量与按钮 */}
                        <div className="mt-4 bg-gray-50 p-4 rounded">
                            <div className="flex items-center gap-4 mb-4">
                                <span>数量：</span>
                                <InputNumber min={1} max={product.stock} value={count} onChange={setCount} />
                                <span className="text-gray-400 text-sm">库存: {product.stock}</span>
                            </div>
                            <Button type="primary" size="large" block onClick={handleAddToCart}>
                                加入购物车
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 底部推荐 - 对应原型底部 */}
                <div className="mt-12">
                    <h3 className="font-bold text-lg mb-4">推荐/相似商品</h3>
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
                        卡片 (4-6个) - 占位符
                    </div>
                </div>
            </div>

            {/* 购物车抽屉 - 对应原型中的"购物车抽屉" */}
            <Drawer title="购物车" placement="right" onClose={() => toggleCart(false)} open={isCartOpen}>
                <List
                    itemLayout="horizontal"
                    dataSource={cart}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[<DeleteOutlined key="del" onClick={() => removeFromCart(index)} className="text-red-500 cursor-pointer" />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.image} shape="square" size={64} />}
                                title={item.title}
                                description={
                                    <div>
                                        <div>{item.color} / {item.size}</div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-red-500">¥{item.price}</span>
                                            <span>x {item.count}</span>
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                {cart.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>合计:</span>
                            <span>¥{cart.reduce((total, item) => total + item.price * item.count, 0)}</span>
                        </div>
                        <Button type="primary" block>去结算</Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default ProductDetail;