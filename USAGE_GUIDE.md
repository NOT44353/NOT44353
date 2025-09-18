# 🚀 คู่มือการใช้งานระบบ Backend API Counter

## ✅ ระบบพร้อมใช้งานแล้ว!

### 📊 สถานะปัจจุบัน:
- **Visitors**: 1 คน
- **Downloads**: 1 ครั้ง
- **Last Updated**: 2025-09-18T16:09:13.816Z

## 🎯 วิธีการใช้งาน:

### 1. เริ่มเซิร์ฟเวอร์
```bash
npm start
```

### 2. เปิดเว็บไซต์
```
http://localhost:3000
```

### 3. ดูผลลัพธ์
- ตัวนับจะแสดงยอดผู้เข้าชมและดาวน์โหลดแบบ real-time
- ข้อมูลจะอัปเดตทุก 30 วินาที
- ข้อมูลจะถูกบันทึกในไฟล์ `data.json`

## 🔧 API Endpoints:

### GET /api/stats
ดึงข้อมูลยอดผู้เข้าชมและดาวน์โหลด
```bash
curl http://localhost:3000/api/stats
```

### POST /api/visitor
เพิ่มยอดผู้เข้าชม
```bash
curl -X POST http://localhost:3000/api/visitor
```

### POST /api/download
เพิ่มยอดการดาวน์โหลด
```bash
curl -X POST http://localhost:3000/api/download
```

## 📁 ไฟล์ที่สำคัญ:

### `server.js`
- Backend API server
- ใช้ Express.js
- Port 3000

### `data.json`
- ไฟล์เก็บข้อมูล
- อัปเดตแบบ real-time
- ข้อมูลไม่หายเมื่อเซิร์ฟเวอร์ปิด

### `script.js`
- Frontend JavaScript
- เรียกใช้ Backend API
- อัปเดตตัวนับแบบ real-time

## 🎉 ข้อดีของระบบ:

### ✅ **ไม่ใช้ localStorage**
- ข้อมูลเก็บในไฟล์ JSON
- ข้อมูลไม่หายเมื่อปิดเบราว์เซอร์

### ✅ **ไม่ใช้ API ภายนอก**
- ใช้ Backend API ของตัวเอง
- ไม่ต้องพึ่งพาบริการภายนอก

### ✅ **Real-time**
- อัปเดตทันที
- ข้อมูลตรงกันทุกที่

### ✅ **Simple**
- ง่ายต่อการใช้งาน
- ไม่ต้องตั้งค่าซับซ้อน

### ✅ **Portable**
- ย้ายได้ง่าย
- ทำงานได้ทุกที่

## 🚀 การ Deploy:

### 1. Local Development
```bash
npm start
```

### 2. Production
```bash
# ใช้ PM2
npm install -g pm2
pm2 start server.js --name "resume-counter"

# ใช้ Docker
docker build -t resume-counter .
docker run -p 3000:3000 resume-counter
```

### 3. Cloud Deployment
- **Heroku**: `git push heroku main`
- **Vercel**: `vercel --prod`
- **Railway**: `railway up`

## 🔍 การ Debug:

### 1. ตรวจสอบเซิร์ฟเวอร์
```bash
curl http://localhost:3000/api/stats
```

### 2. ตรวจสอบ Logs
```bash
# ดู logs ของ PM2
pm2 logs resume-counter

# ดู logs ของ Docker
docker logs resume-counter
```

### 3. ตรวจสอบไฟล์ข้อมูล
```bash
cat data.json
```

## 📈 การ Monitor:

### 1. Real-time Monitoring
- เปิดเว็บไซต์
- ดูตัวนับอัปเดต
- ตรวจสอบ Console logs

### 2. API Monitoring
- ใช้ Postman
- ใช้ curl
- ใช้ browser dev tools

## 🎯 สรุป:

**ระบบ Backend API Counter พร้อมใช้งานแล้ว!**

- ✅ **เซิร์ฟเวอร์ทำงาน**: Port 3000
- ✅ **API ทำงาน**: GET/POST endpoints
- ✅ **ข้อมูลถูกบันทึก**: ในไฟล์ data.json
- ✅ **Frontend ทำงาน**: เรียกใช้ API
- ✅ **Real-time**: อัปเดตทันที

**ตอนนี้คุณสามารถเปิดเว็บไซต์ที่ `http://localhost:3000` และดูตัวนับทำงานได้เลย!** 🎉
