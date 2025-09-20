# 🛒 TechStore - E-commerce Platform

โปรเจค E-commerce ขนาดย่อมๆ ที่มีฟีเจอร์ครบครัน พร้อมระบบตะกร้าสินค้า, ชำระเงิน, และ responsive design

## ✨ Features

### 🛍️ **Core E-commerce Features**
- **Product Catalog** - แสดงสินค้าพร้อมข้อมูลครบถ้วน
- **Shopping Cart** - ระบบตะกร้าสินค้าที่ใช้งานง่าย
- **Checkout System** - ระบบชำระเงินแบบสมบูรณ์
- **Product Search** - ค้นหาสินค้าด้วยคำค้นหา
- **Category Filter** - กรองสินค้าตามหมวดหมู่

### 🎨 **UI/UX Features**
- **Modern Design** - ดีไซน์ทันสมัยและสวยงาม
- **Responsive Layout** - รองรับทุกขนาดหน้าจอ
- **Smooth Animations** - อนิเมชั่นที่นุ่มนวล
- **Interactive Elements** - องค์ประกอบที่โต้ตอบได้
- **User Notifications** - ระบบแจ้งเตือนผู้ใช้

### 📱 **Mobile Support**
- **Touch-Friendly** - ใช้งานง่ายบนมือถือ
- **Mobile Navigation** - เมนูที่เหมาะกับมือถือ
- **Responsive Cart** - ตะกร้าสินค้าที่ปรับขนาดได้
- **Mobile Checkout** - ระบบชำระเงินบนมือถือ

## 🚀 Quick Start

### วิธีใช้งาน
1. **เปิดไฟล์** `index.html` ในเบราว์เซอร์
2. **เลือกสินค้า** ที่ต้องการซื้อ
3. **เพิ่มลงตะกร้า** โดยคลิก "Add to Cart"
4. **ชำระเงิน** โดยคลิกที่ไอคอนตะกร้าและ "Checkout"

### การปรับแต่ง
```javascript
// เปลี่ยนข้อมูลสินค้า
const products = [
    {
        id: 1,
        name: 'Product Name',
        description: 'Product Description',
        price: 99.99,
        category: 'category',
        image: 'fas fa-icon',
        rating: 4.5,
        inStock: true
    }
];
```

## 🛒 E-commerce Features

### Product Management
- **Product Display** - แสดงสินค้าพร้อมรูปภาพ
- **Product Information** - ข้อมูลสินค้าครบถ้วน
- **Price Display** - แสดงราคาสินค้า
- **Stock Status** - สถานะสินค้าในสต็อก

### Shopping Cart
- **Add to Cart** - เพิ่มสินค้าลงตะกร้า
- **Remove Items** - ลบสินค้าออกจากตะกร้า
- **Update Quantity** - ปรับจำนวนสินค้า
- **Cart Total** - คำนวณยอดรวม

### Checkout Process
- **Customer Information** - ข้อมูลลูกค้า
- **Shipping Address** - ที่อยู่จัดส่ง
- **Payment Method** - วิธีการชำระเงิน
- **Order Confirmation** - ยืนยันคำสั่งซื้อ

## 🎨 Design Features

### Color Scheme
- **Primary**: #2563eb (Blue)
- **Secondary**: #10b981 (Green)
- **Accent**: #ef4444 (Red)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Font Family**: Inter
- **Headings**: Bold weights
- **Body Text**: Regular weights
- **Responsive**: Scales with screen size

### Layout
- **Grid System** - ระบบกริดที่ยืดหยุ่น
- **Flexbox** - ใช้ Flexbox สำหรับการจัดวาง
- **CSS Grid** - ใช้ CSS Grid สำหรับ layout ซับซ้อน
- **Mobile-First** - ออกแบบให้รองรับมือถือเป็นหลัก

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Collapsible Navigation** - เมนูที่ย่อได้
- **Touch Gestures** - รองรับการสัมผัส
- **Swipe Actions** - การเลื่อนดูสินค้า
- **Mobile Cart** - ตะกร้าสินค้าบนมือถือ

## 🔧 Technical Features

### Frontend
- **Vanilla JavaScript** - ไม่ใช้ framework
- **CSS3** - ใช้ CSS3 features
- **HTML5** - ใช้ HTML5 semantic elements
- **Font Awesome** - ไอคอนสวยงาม

### Performance
- **Lightweight** - ไฟล์เล็ก เบา
- **Fast Loading** - โหลดเร็ว
- **Smooth Animations** - อนิเมชั่นลื่น
- **Optimized Images** - รูปภาพที่ปรับขนาดแล้ว

### Browser Support
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 🛠️ Customization

### Adding New Products
```javascript
// เพิ่มสินค้าใหม่
const newProduct = {
    id: 9,
    name: 'New Product',
    description: 'Product description',
    price: 199.99,
    category: 'accessories',
    image: 'fas fa-icon',
    rating: 4.5,
    inStock: true
};

ecommerceApp.products.push(newProduct);
```

### Changing Categories
```javascript
// เปลี่ยนหมวดหมู่
const categories = ['all', 'laptops', 'phones', 'accessories', 'newcategory'];
```

### Customizing Colors
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
}
```

## 📊 Product Data Structure

```javascript
{
    id: number,           // ID สินค้า
    name: string,         // ชื่อสินค้า
    description: string,  // คำอธิบาย
    price: number,        // ราคา
    category: string,     // หมวดหมู่
    image: string,        // ไอคอน Font Awesome
    rating: number,       // คะแนน
    inStock: boolean      // สถานะสต็อก
}
```

## 🎯 User Experience

### Navigation
- **Smooth Scrolling** - เลื่อนหน้าลื่นไหล
- **Active States** - แสดงสถานะที่ใช้งาน
- **Breadcrumbs** - แสดงตำแหน่งปัจจุบัน

### Interactions
- **Hover Effects** - เอฟเฟกต์เมื่อเลื่อนเมาส์
- **Click Feedback** - การตอบสนองเมื่อคลิก
- **Loading States** - แสดงสถานะการโหลด

### Notifications
- **Success Messages** - ข้อความสำเร็จ
- **Error Messages** - ข้อความผิดพลาด
- **Info Messages** - ข้อความแจ้งเตือน

## 📄 License

MIT License - ใช้งานได้ฟรี

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📞 Contact

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your Profile](https://linkedin.com/in/yourprofile)

---

⭐ **Star โปรเจคนี้ถ้าชอบ!** ⭐

สร้างด้วย ❤️ โดย [Your Name]
