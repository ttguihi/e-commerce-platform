import { create } from 'zustand';
import { message } from 'antd';

const useStore = create((set, get) => ({
    // 购物车数据
    cart: [],
    isCartOpen: false, // 购物车抽屉开关

    // 添加到购物车
    addToCart: (product, spec) => {
        const { cart } = get();
        // 简单查重逻辑，实际需根据 id + spec 判断
        const existingItem = cart.find(item => item.id === product.id && item.color === spec.color && item.size === spec.size);

        if (existingItem) {
            set({
                cart: cart.map(item =>
                    (item.id === product.id && item.color === spec.color && item.size === spec.size)
                        ? { ...item, count: item.count + spec.count }
                        : item
                )
            });
        } else {
            set({ cart: [...cart, { ...product, ...spec }] });
        }
        message.success('已加入购物车');
        set({ isCartOpen: true });
    },

    toggleCart: (isOpen) => set({ isCartOpen: isOpen }),

    // 简单的移除逻辑
    removeFromCart: (index) => {
        const { cart } = get();
        const newCart = [...cart];
        newCart.splice(index, 1);
        set({ cart: newCart });
    }
}));

export default useStore;