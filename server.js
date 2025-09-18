const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ไฟล์ข้อมูล
const DATA_FILE = path.join(__dirname, 'data.json');

// อ่านข้อมูลจากไฟล์
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Error reading data file:', error);
    return { visitors: 0, downloads: 0, lastUpdated: new Date().toISOString() };
  }
}

// เขียนข้อมูลลงไฟล์
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.log('Error writing data file:', error);
    return false;
  }
}

// API Routes
app.get('/api/stats', (req, res) => {
  const data = readData();
  res.json({
    success: true,
    data: {
      visitors: data.visitors,
      downloads: data.downloads,
      lastUpdated: data.lastUpdated
    }
  });
});

app.post('/api/visitor', (req, res) => {
  const data = readData();
  data.visitors += 1;
  data.lastUpdated = new Date().toISOString();
  
  if (writeData(data)) {
    res.json({
      success: true,
      message: 'Visitor count updated',
      data: {
        visitors: data.visitors,
        downloads: data.downloads,
        lastUpdated: data.lastUpdated
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor count'
    });
  }
});

app.post('/api/download', (req, res) => {
  const data = readData();
  data.downloads += 1;
  data.lastUpdated = new Date().toISOString();
  
  if (writeData(data)) {
    res.json({
      success: true,
      message: 'Download count updated',
      data: {
        visitors: data.visitors,
        downloads: data.downloads,
        lastUpdated: data.lastUpdated
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to update download count'
    });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Data file: ${DATA_FILE}`);
  console.log(`📈 API endpoints:`);
  console.log(`   GET  /api/stats - Get current stats`);
  console.log(`   POST /api/visitor - Increment visitor count`);
  console.log(`   POST /api/download - Increment download count`);
});
