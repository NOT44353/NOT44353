// ===== GITHUB PAGES COUNTER SYSTEM =====
// ระบบนับยอดผู้เข้าชมและดาวน์โหลดสำหรับ GitHub Pages

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

// ฟังก์ชันสำหรับโหลดข้อมูลจาก GitHub API
async function loadFromGitHubAPI() {
  console.log('📊 Loading data from GitHub API...');
  
  try {
    // ใช้ GitHub API เพื่อดึงข้อมูลจากไฟล์ใน repository
    const response = await fetch('https://api.github.com/repos/NOT44353/NOT44353/contents/data.json');
    
    if (response.ok) {
      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      
      visitorCount = content.visitors || 0;
      downloadCount = content.downloads || 0;
      
      updateCounterDisplay('visitor-count', visitorCount);
      updateCounterDisplay('download-count', downloadCount);
      
      console.log('✅ Data loaded from GitHub API');
      console.log(`📊 Visitors: ${visitorCount}, Downloads: ${downloadCount}`);
    } else {
      console.log('❌ Failed to load data from GitHub API');
      updateCounterDisplay('visitor-count', '0');
      updateCounterDisplay('download-count', '0');
    }
  } catch (error) {
    console.log('❌ GitHub API error:', error);
    updateCounterDisplay('visitor-count', '0');
    updateCounterDisplay('download-count', '0');
  }
}

// ฟังก์ชันสำหรับบันทึกข้อมูลไปยัง GitHub API
async function saveToGitHubAPI(type) {
  console.log(`📊 Saving ${type} to GitHub API...`);
  
  try {
    // อัปเดตตัวนับ
    if (type === 'visitor') {
      visitorCount++;
    } else if (type === 'download') {
      downloadCount++;
    }
    
    // อัปเดตการแสดงผล
    updateCounterDisplay('visitor-count', visitorCount);
    updateCounterDisplay('download-count', downloadCount);
    
    // สร้างข้อมูลใหม่
    const newData = {
      visitors: visitorCount,
      downloads: downloadCount,
      lastUpdated: new Date().toISOString()
    };
    
    // แปลงเป็น base64
    const content = btoa(JSON.stringify(newData, null, 2));
    
    // ส่งไปยัง GitHub API
    const response = await fetch('https://api.github.com/repos/NOT44353/NOT44353/contents/data.json', {
      method: 'PUT',
      headers: {
        'Authorization': 'token YOUR_GITHUB_TOKEN', // ต้องใส่ GitHub token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update ${type} count`,
        content: content,
        sha: 'YOUR_FILE_SHA' // ต้องใส่ SHA ของไฟล์
      })
    });
    
    if (response.ok) {
      console.log(`✅ ${type} count updated successfully`);
    } else {
      console.log(`❌ Failed to update ${type} count`);
    }
  } catch (error) {
    console.log(`❌ Error updating ${type} count:`, error);
  }
}

// ฟังก์ชันสำหรับติดตาม page view
function trackPageView() {
  console.log('📊 Tracking page view...');
  
  // ใช้วิธีง่ายๆ โดยไม่ต้องใช้ GitHub API
  // เพิ่มตัวนับใน localStorage เป็น fallback
  let localVisitors = parseInt(localStorage.getItem('github_visitors')) || 0;
  localVisitors++;
  localStorage.setItem('github_visitors', localVisitors.toString());
  
  visitorCount = localVisitors;
  updateCounterDisplay('visitor-count', visitorCount);
  
  console.log(`✅ Page view tracked: ${visitorCount}`);
}

// ฟังก์ชันสำหรับติดตาม download
function trackDownload() {
  console.log('📊 Tracking download...');
  
  // ใช้วิธีง่ายๆ โดยไม่ต้องใช้ GitHub API
  // เพิ่มตัวนับใน localStorage เป็น fallback
  let localDownloads = parseInt(localStorage.getItem('github_downloads')) || 0;
  localDownloads++;
  localStorage.setItem('github_downloads', localDownloads.toString());
  
  downloadCount = localDownloads;
  updateCounterDisplay('download-count', downloadCount);
  
  console.log(`✅ Download tracked: ${downloadCount}`);
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

// ฟังก์ชันสำหรับเริ่มต้นระบบ
function initGitHubPagesCounters() {
  console.log('🚀 Initializing GitHub Pages counter system...');
  
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
  
  console.log('✅ GitHub Pages counter system initialized');
}

// เริ่มต้นระบบเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Page loaded, initializing counters...');
  initGitHubPagesCounters();
});
