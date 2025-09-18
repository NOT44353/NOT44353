# Google Analytics 4 Data API Setup Guide

## 1. ตั้งค่า Google Analytics 4

### สร้าง GA4 Property
1. ไปที่ [Google Analytics](https://analytics.google.com/)
2. สร้าง Account ใหม่
3. สร้าง Property สำหรับเว็บไซต์
4. รับ Measurement ID (รูปแบบ: G-XXXXXXXXXX)

### อัปเดต Measurement ID
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

## 2. ตั้งค่า Google Cloud Console

### สร้าง Project
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่
3. เปิดใช้งาน Google Analytics Reporting API

### สร้าง Service Account
1. ไปที่ IAM & Admin > Service Accounts
2. สร้าง Service Account ใหม่
3. กำหนด Role: "Viewer" สำหรับ GA4 Property
4. สร้าง JSON Key สำหรับ Service Account

## 3. ตั้งค่า GA4 Data API

### เปิดใช้งาน API
1. ไปที่ APIs & Services > Library
2. ค้นหา "Google Analytics Reporting API"
3. เปิดใช้งาน API

### กำหนดสิทธิ์
1. ไปที่ GA4 Property > Admin > Property Access Management
2. เพิ่ม Service Account email
3. กำหนดสิทธิ์ "Viewer"

## 4. ใช้ GA4 Data API

### ตัวอย่างการใช้งาน
```javascript
// ใช้ GA4 Data API เพื่อดึงข้อมูล real-time
async function loadFromGA4DataAPI() {
  try {
    const response = await fetch('/api/ga4-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: 'YOUR_PROPERTY_ID',
        metrics: ['activeUsers', 'screenPageViews'],
        dimensions: ['pageTitle']
      })
    });
    
    const data = await response.json();
    
    // อัปเดตตัวนับ
    updateCounterDisplay('visitor-count', data.activeUsers);
    updateCounterDisplay('download-count', data.downloads);
    
  } catch (error) {
    console.log('GA4 Data API error:', error);
  }
}
```

## 5. ข้อดีของ GA4 Data API

### ✅ จุดเด่น:
- **Real-time Data** - ข้อมูลแบบ real-time
- **Global** - ดูได้จากทุกที่
- **Detailed** - ข้อมูลละเอียดมาก
- **Reliable** - เสถียรและเชื่อถือได้
- **No localStorage** - ไม่ต้องใช้ localStorage

### 📊 ข้อมูลที่ได้:
- จำนวนผู้เข้าชมแบบ real-time
- จำนวนการดาวน์โหลดแบบ real-time
- ข้อมูลผู้ใช้ (ประเทศ, เมือง, อุปกรณ์)
- เวลาที่ใช้ในเว็บไซต์
- หน้าเว็บที่ได้รับความนิยม

## 6. ระบบปัจจุบัน

### ✅ ทำงานได้:
- **Google Analytics** - ส่งข้อมูลไป GA
- **No localStorage** - ไม่ใช้ localStorage
- **Real-time** - อัปเดตทุก 30 วินาที
- **GA4 Data API** - ดึงข้อมูลจาก GA4

### 📊 ข้อมูลที่เก็บ:
- **Google Analytics** - events และ page views
- **GA4 Dashboard** - ข้อมูลรายละเอียด
- **Real-time Reports** - รายงานแบบ real-time

## 7. การทดสอบ

1. เปิดเว็บไซต์
2. เปิด Developer Tools (F12)
3. ดู Console logs
4. ตรวจสอบใน Google Analytics Dashboard
5. ดู Real-time reports

## 8. Troubleshooting

### ถ้าไม่เห็นข้อมูล:
1. ตรวจสอบ Measurement ID
2. ตรวจสอบ Service Account
3. ตรวจสอบ API permissions
4. รอ 24-48 ชั่วโมงสำหรับข้อมูลแรก

### ถ้า Console แสดง error:
1. ตรวจสอบ gtag script
2. ตรวจสอบ Measurement ID
3. ตรวจสอบ API credentials
4. ตรวจสอบ CORS settings

## 9. ข้อจำกัด

### ⚠️ สิ่งที่ต้องทำเพิ่ม:
- ตั้งค่า Google Cloud Console
- สร้าง Service Account
- เปิดใช้งาน GA4 Data API
- ตั้งค่า CORS สำหรับ API calls

### 🔧 การแก้ไข:
- ใช้ Server-side API calls
- ตั้งค่า Proxy server
- ใช้ Google Analytics Embed API
