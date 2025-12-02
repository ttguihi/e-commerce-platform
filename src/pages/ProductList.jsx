import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Slider, Radio, Pagination, Spin, Empty, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../mock/data';
import Navbar from '../components/common/Navbar';

const ProductList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]); // 原始数据
    const [displayProducts, setDisplayProducts] = useState([]); // 展示数据

    // 筛选状态
    const [filters, setFilters] = useState({
        category: [],
        priceRange: [0, 1000]
    });
    const [sort, setSort] = useState('default'); // default, priceAsc, priceDesc, sales

    // 初始化加载
    useEffect(() => {
        fetchProducts().then(data => {
            setProducts(data);
            setDisplayProducts(data);
            setLoading(false);
        });
    }, []);

    // 监听筛选和排序变化
    useEffect(() => {
        let result = [...products];

        // 1. 筛选分类
        if (filters.category.length > 0) {
            result = result.filter(p => filters.category.includes(p.category));
        }
        // 2. 筛选价格
        result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

        // 3. 排序
        if (sort === 'priceAsc') result.sort((a, b) => a.price - b.price);
        if (sort === 'priceDesc') result.sort((a, b) => b.price - a.price);
        if (sort === 'sales') result.sort((a, b) => b.sales - a.sales);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDisplayProducts(result);
    }, [filters, sort, products]);

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-10 max-w-[1440px] mx-auto">
            <Navbar />

            <div className="flex flex-col md:flex-row gap-6">
                {/* 左侧筛选区 - 对应原型左侧 */}
                <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm h-fit">
                    <h3 className="font-bold mb-4 text-lg">筛选区</h3>

                    <div className="mb-6">
                        <h4 className="font-medium mb-2">分类</h4>
                        <Checkbox.Group
                            className="flex flex-col gap-2"
                            options={['男装', '女装', '鞋靴', '配饰']}
                            onChange={(v) => setFilters({ ...filters, category: v })}
                        />
                    </div>

                    <div className="mb-6">
                        <h4 className="font-medium mb-2">价格区间</h4>
                        <Slider
                            range
                            max={1000}
                            defaultValue={[0, 1000]}
                            onChange={(v) => setFilters({ ...filters, priceRange: v })}
                        />
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>¥{filters.priceRange[0]}</span>
                            <span>¥{filters.priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* 右侧列表区 - 对应原型右侧 */}
                <div className="flex-1">
                    {/* 排序栏 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">排序：</span>
                            <Radio.Group value={sort} onChange={e => setSort(e.target.value)} buttonStyle="solid">
                                <Radio.Button value="default">综合</Radio.Button>
                                <Radio.Button value="priceAsc">价格 ↑</Radio.Button>
                                <Radio.Button value="priceDesc">价格 ↓</Radio.Button>
                                <Radio.Button value="sales">销量</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* 商品网格 */}
                    {loading ? (
                        <div className="h-64 flex items-center justify-center"><Spin size="large" /></div>
                    ) : displayProducts.length === 0 ? (
                        <Empty description="没有找到商品" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayProducts.map(product => (
                                <Card
                                    key={product.id}
                                    hoverable
                                    cover={<img alt={product.title} src={product.image} className="h-48 object-cover" />}
                                    onClick={() => navigate(`/product/${product.id}`, { state: { product } })} // 简单传参，实际应根据ID重新请求
                                >
                                    <Card.Meta
                                        title={<div className="truncate">{product.title}</div>}
                                        description={
                                            <div>
                                                <div className="text-red-500 font-bold text-lg">¥{product.price}</div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>销量 {product.sales > 1000 ? '1k+' : product.sales}</span>
                                                    <Tag color="blue">{product.tags[0]}</Tag>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* 分页 */}
                    <div className="mt-8 text-right bg-white p-4 rounded shadow-sm sticky bottom-0">
                        <Pagination defaultCurrent={1} total={50} showSizeChanger />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;