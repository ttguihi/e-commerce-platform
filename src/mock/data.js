import Mock from 'mockjs';

const Random = Mock.Random;

// 模拟生成 50 个商品
export const generateProducts = () => {
    const data = Mock.mock({
        'products|50': [{
            'id|+1': 1,
            'title': () => Random.ctitle(10, 20), // 商品标题
            'price|50-1000': 100, // 价格
            'sales|10-5000': 100, // 销量
            'category|1': ['男装', '女装', '鞋靴', '配饰'],
            'tags|1-2': ['新品', '热销', '折扣'],
            'image': () => Random.image('300x300', Random.color(), '#FFF', 'Product'),
            'images|4': [() => Random.image('600x600', Random.color(), '#FFF', 'Detail')], // 详情页轮播图
            'sizes': ['S', 'M', 'L', 'XL'],
            'colors': ['黑', '白', '蓝'],
            'stock|0-100': 10
        }]
    });
    return data.products;
};

// 模拟 API 调用延迟
export const fetchProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateProducts());
        }, 800);
    });
};