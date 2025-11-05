// Test script to add sample cart items to localStorage
// Run this in browser console to test checkout page

const sampleCartItems = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    price: 29990000,
    quantity: 1,
    image: "https://via.placeholder.com/200x200/ff6b35/ffffff?text=iPhone",
    variant: "Titan Xanh - 256GB",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 26990000,
    quantity: 2,
    image: "https://via.placeholder.com/200x200/007ACC/ffffff?text=Samsung",
    variant: "Đen - 512GB",
  },
  {
    id: 3,
    name: "MacBook Air M3 13 inch",
    price: 27990000,
    quantity: 1,
    image: "https://via.placeholder.com/200x200/28a745/ffffff?text=MacBook",
    variant: "Xám - 256GB SSD",
  },
];

localStorage.setItem("cartItems", JSON.stringify(sampleCartItems));
console.log("✅ Sample cart items added to localStorage");
console.log("🛒 Cart items:", sampleCartItems);
console.log("🔗 Visit: http://localhost:5174/checkout");
