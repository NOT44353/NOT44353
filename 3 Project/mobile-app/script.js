// HealthTracker Pro - Mobile App
class HealthTrackerApp {
    constructor() {
        this.healthData = {
            heartRate: 72,
            calories: 1250,
            steps: 8432,
            sleep: 7.5,
            water: 5
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateHealthData();
        this.createHealthChart();
        this.animateStats();
    }

    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Notification button
        document.querySelector('.notification-btn').addEventListener('click', () => {
            this.showNotification('No new notifications');
        });
    }

    handleNavigation(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        navItem.classList.add('active');

        // Handle navigation logic
        const navText = navItem.querySelector('span').textContent;
        switch(navText) {
            case 'Home':
                this.showNotification('Already on Home page');
                break;
            case 'Analytics':
                this.showNotification('Analytics page coming soon!');
                break;
            case 'Add':
                this.showNotification('Add activity feature coming soon!');
                break;
            case 'Profile':
                this.showNotification('Profile page coming soon!');
                break;
        }
    }

    updateHealthData() {
        // Simulate real-time data updates
        setInterval(() => {
            this.healthData.heartRate = 70 + Math.floor(Math.random() * 10);
            this.healthData.calories += Math.floor(Math.random() * 5);
            this.healthData.steps += Math.floor(Math.random() * 3);
            
            this.updateStatsDisplay();
        }, 5000);
    }

    updateStatsDisplay() {
        document.querySelector('.stat-card:nth-child(1) .stat-value').innerHTML = 
            `${this.healthData.heartRate} <span>bpm</span>`;
        
        document.querySelector('.stat-card:nth-child(2) .stat-value').innerHTML = 
            `${this.healthData.calories.toLocaleString()} <span>kcal</span>`;
        
        document.querySelector('.stat-card:nth-child(3) .stat-value').innerHTML = 
            `${this.healthData.steps.toLocaleString()} <span>steps</span>`;
    }

    animateStats() {
        // Animate stat cards on load
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    createHealthChart() {
        const canvas = document.getElementById('healthChart');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Chart data
        const data = [65, 70, 68, 72, 75, 73, 78, 76, 74, 72, 70, 68];
        const labels = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
        
        // Draw chart
        this.drawLineChart(ctx, data, labels, canvas.width, canvas.height);
    }

    drawLineChart(ctx, data, labels, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw data line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const valueRange = maxValue - minValue;
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#667eea';
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        labels.forEach((label, index) => {
            if (index % 2 === 0) { // Show every other label
                const x = padding + (chartWidth / (data.length - 1)) * index;
                ctx.fillText(label, x, height - 10);
            }
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-bell"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global Functions
function startWorkout() {
    document.getElementById('workoutModal').classList.add('active');
}

function logMeal() {
    document.getElementById('mealModal').classList.add('active');
}

function meditate() {
    app.showNotification('Starting meditation session...');
    setTimeout(() => {
        app.showNotification('Meditation completed! Great job!');
    }, 2000);
}

function checkWater() {
    document.getElementById('waterModal').classList.add('active');
}

function startWorkoutType(type) {
    app.showNotification(`Starting ${type} workout...`);
    closeModal('workoutModal');
}

function logMealType(type) {
    app.showNotification(`${type} logged successfully!`);
    closeModal('mealModal');
}

function addWater(glasses) {
    app.healthData.water += glasses;
    const progress = (app.healthData.water / 8) * 100;
    document.querySelector('.water-fill').style.width = `${progress}%`;
    document.querySelector('.water-tracker p').textContent = 
        `${app.healthData.water} of 8 glasses completed`;
    app.showNotification(`Added ${glasses} glass${glasses > 1 ? 'es' : ''} of water!`);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize App
const app = new HealthTrackerApp();

// Add CSS for animations
const animationStyles = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .stat-card {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .activity-item {
        opacity: 0;
        transform: translateX(-20px);
        animation: slideInRight 0.5s ease forwards;
    }
    
    .activity-item:nth-child(1) { animation-delay: 0.1s; }
    .activity-item:nth-child(2) { animation-delay: 0.2s; }
    .activity-item:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
