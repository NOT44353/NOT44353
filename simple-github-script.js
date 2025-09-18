// ===== SIMPLE GITHUB PAGES COUNTER SYSTEM =====
// ระบบนับยอดผู้เข้าชมและดาวน์โหลดแบบง่ายสำหรับ GitHub Pages

// ตัวแปรสำหรับเก็บข้อมูล
let visitorCount = 0;
let downloadCount = 0;

// ฟังก์ชันสำหรับอัปเดตตัวนับ
function updateCounterDisplay(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
    console.log(`📊 ${elementId}: ${value}`);
  }
}

// ฟังก์ชันสำหรับโหลดข้อมูลจาก localStorage
function loadFromLocalStorage() {
  console.log('📊 Loading data from localStorage...');
  
  visitorCount = parseInt(localStorage.getItem('github_visitors')) || 0;
  downloadCount = parseInt(localStorage.getItem('github_downloads')) || 0;
  
  updateCounterDisplay('visitor-count', visitorCount);
  updateCounterDisplay('download-count', downloadCount);
  
  console.log(`📊 Loaded: Visitors: ${visitorCount}, Downloads: ${downloadCount}`);
}

// ฟังก์ชันสำหรับติดตาม page view
function trackPageView() {
  console.log('📊 Tracking page view...');
  
  // เพิ่มตัวนับใน localStorage
  visitorCount++;
  localStorage.setItem('github_visitors', visitorCount.toString());
  
  updateCounterDisplay('visitor-count', visitorCount);
  
  console.log(`✅ Page view tracked: ${visitorCount}`);
}

// ฟังก์ชันสำหรับติดตาม download
function trackDownload() {
  console.log('📊 Tracking download...');
  
  // เพิ่มตัวนับใน localStorage
  downloadCount++;
  localStorage.setItem('github_downloads', downloadCount.toString());
  
  updateCounterDisplay('download-count', downloadCount);
  
  console.log(`✅ Download tracked: ${downloadCount}`);
}

// ฟังก์ชันสำหรับเริ่มต้นระบบ
function initSimpleCounters() {
  console.log('🚀 Initializing Simple GitHub Pages counter system...');
  
  // โหลดข้อมูลจาก localStorage
  loadFromLocalStorage();
  
  // ติดตาม page view
  trackPageView();
  
  // เพิ่ม event listener สำหรับ download button
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    console.log('Download button found, adding event listener');
    downloadBtn.addEventListener('click', function() {
      console.log('Download button clicked!');
      trackDownload();
    });
  } else {
    console.log('Download button not found!');
  }
  
  // อัปเดตทุก 30 วินาที
  setInterval(() => {
    console.log('Refreshing data...');
    loadFromLocalStorage();
  }, 30000);
  
  console.log('✅ Simple GitHub Pages counter system initialized');
}

// เริ่มต้นระบบเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Page loaded, initializing counters...');
  initSimpleCounters();
});
