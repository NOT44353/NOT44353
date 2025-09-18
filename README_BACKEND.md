# Backend API Counter System

## ระบบนับยอดผู้เข้าชมและดาวน์โหลดแบบ Backend API

### ไฟล์ที่สร้างขึ้น:
- `server.js` - Backend API server
- `package.json` - Dependencies
- `data.json` - ไฟล์เก็บข้อมูล
- `script.js` - Frontend ที่เรียกใช้ API

### วิธีการใช้งาน:

#### 1. ติดตั้ง Dependencies
```bash
npm install
```

#### 2. เริ่มเซิร์ฟเวอร์
```bash
npm start
```

#### 3. เปิดเว็บไซต์
```
http://localhost:3000
```

### API Endpoints:

#### GET /api/stats
ดึงข้อมูลยอดผู้เข้าชมและดาวน์โหลด
```json
{
  "success": true,
  "data": {
    "visitors": 10,
    "downloads": 5,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/visitor
เพิ่มยอดผู้เข้าชม
```json
{
  "success": true,
  "message": "Visitor count updated",
  "data": {
    "visitors": 11,
    "downloads": 5,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/download
เพิ่มยอดการดาวน์โหลด
```json
{
  "success": true,
  "message": "Download count updated",
  "data": {
    "visitors": 10,
    "downloads": 6,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### ข้อดี:
- ✅ **ไม่ใช้ localStorage** - ข้อมูลเก็บในไฟล์ JSON
- ✅ **ไม่ใช้ API ภายนอก** - ใช้ Backend API ของตัวเอง
- ✅ **Real-time** - อัปเดตทันที
- ✅ **Simple** - ง่ายต่อการใช้งาน
- ✅ **Portable** - ย้ายได้ง่าย

### ข้อจำกัด:
- ⚠️ **ต้องรันเซิร์ฟเวอร์** - ต้องเปิด server.js
- ⚠️ **Single Server** - ข้อมูลเก็บในเซิร์ฟเวอร์เดียว
- ⚠️ **No Persistence** - ข้อมูลหายเมื่อเซิร์ฟเวอร์ปิด

### การแก้ไข:
- ใช้ Database แทนไฟล์ JSON
- ใช้ Redis สำหรับ caching
- ใช้ Docker สำหรับ deployment
- ใช้ PM2 สำหรับ process management
