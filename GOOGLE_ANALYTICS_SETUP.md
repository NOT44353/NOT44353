# Google Analytics Setup Guide

## 1. สร้าง Google Analytics Account

1. ไปที่ [Google Analytics](https://analytics.google.com/)
2. สร้าง Account ใหม่
3. สร้าง Property สำหรับเว็บไซต์
4. รับ Measurement ID (รูปแบบ: G-XXXXXXXXXX)

## 2. อัปเดต Measurement ID

ในไฟล์ `index.html` แทนที่ `G-XXXXXXXXXX` ด้วย Measurement ID จริง:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 3. ตั้งค่า Custom Events

### Page View Event
- **Event Name**: `page_view`
- **Parameters**: 
  - `page_title`: "Thanapat Pisawong - Resume"
  - `page_location`: URL ของเว็บไซต์
  - `custom_parameter_1`: "resume_view"

### Download Event
- **Event Name**: `file_download`
- **Parameters**:
  - `file_name`: "resume.pdf"
  - `file_extension`: "pdf"
  - `custom_parameter_1`: "resume_download"

## 4. ดูข้อมูลใน Google Analytics

1. ไปที่ Google Analytics Dashboard
2. ดู Real-time reports
3. ดู Events section
4. ดู Custom parameters

## 5. ข้อดีของ Google Analytics

### ✅ จุดเด่น:
- **ฟรี** - ไม่มีค่าใช้จ่าย
- **Real-time** - ข้อมูลอัปเดตทันที
- **Global** - ดูได้จากทุกที่
- **Detailed** - ข้อมูลละเอียด
- **Reliable** - เสถียรและเชื่อถือได้

### 📊 ข้อมูลที่ได้:
- จำนวนผู้เข้าชม
- จำนวนการดาวน์โหลด
- ข้อมูลผู้ใช้ (ประเทศ, เมือง, อุปกรณ์)
- เวลาที่ใช้ในเว็บไซต์
- หน้าเว็บที่ได้รับความนิยม

### 🔧 การใช้งาน:
- **Automatic Tracking** - ติดตามอัตโนมัติ
- **Custom Events** - เหตุการณ์เฉพาะ
- **Real-time Reports** - รายงานแบบ real-time
- **Data Export** - ส่งออกข้อมูลได้

## 6. การทดสอบ

1. เปิดเว็บไซต์
2. เปิด Developer Tools (F12)
3. ดู Console logs
4. ดู Network tab สำหรับ GA requests
5. ตรวจสอบใน Google Analytics Dashboard

## 7. Troubleshooting

### ถ้าไม่เห็นข้อมูล:
1. ตรวจสอบ Measurement ID
2. ตรวจสอบ Console logs
3. ตรวจสอบ Network requests
4. รอ 24-48 ชั่วโมงสำหรับข้อมูลแรก

### ถ้า Console แสดง error:
1. ตรวจสอบ gtag script
2. ตรวจสอบ Measurement ID
3. ตรวจสอบ CORS settings

## 8. ระบบปัจจุบัน

### ✅ ทำงานได้:
- **Google Analytics** - ส่งข้อมูลไป GA
- **localStorage** - เก็บข้อมูลสำรอง
- **Real-time** - อัปเดตทุก 30 วินาที
- **Fallback** - ใช้ localStorage ถ้า GA ไม่ได้

### 📊 ข้อมูลที่เก็บ:
- `ga_visitor_count` - จำนวนผู้เข้าชม
- `ga_download_count` - จำนวนการดาวน์โหลด
- **Google Analytics** - events และ page views

### 🎯 ผลลัพธ์:
- ตัวเลขแสดงข้างๆ รูปโปรไฟล์
- ข้อมูล sync กับ Google Analytics
- ข้อมูลรายละเอียดใน GA Dashboard