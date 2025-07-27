// 智慧家電儀表板 JavaScript

// 模擬家電資料
const appliances = [
    {
        id: 1,
        name: '冷氣機',
        icon: '❄️',
        status: 'on',
        powerConsumption: '2.5 kW',
        location: '客廳'
    },
    {
        id: 2,
        name: '電燈',
        icon: '💡',
        status: 'on',
        powerConsumption: '0.1 kW',
        location: '全屋'
    },
    {
        id: 3,
        name: '電視',
        icon: '📺',
        status: 'on',
        powerConsumption: '0.3 kW',
        location: '客廳'
    },
    {
        id: 4,
        name: '冰箱',
        icon: '🧊',
        status: 'on',
        powerConsumption: '0.8 kW',
        location: '廚房'
    },
    {
        id: 5,
        name: '洗衣機',
        icon: '🧺',
        status: 'off',
        powerConsumption: '0 kW',
        location: '陽台'
    },
    {
        id: 6,
        name: '微波爐',
        icon: '🍽️',
        status: 'off',
        powerConsumption: '0 kW',
        location: '廚房'
    },
    {
        id: 7,
        name: '熱水器',
        icon: '🔥',
        status: 'on',
        powerConsumption: '1.2 kW',
        location: '浴室'
    },
    {
        id: 8,
        name: '電腦',
        icon: '💻',
        status: 'on',
        powerConsumption: '0.4 kW',
        location: '書房'
    }
];

// 模擬用電量資料
const weeklyData = [
    { day: '週一', usage: 45.2 },
    { day: '週二', usage: 52.8 },
    { day: '週三', usage: 48.5 },
    { day: '週四', usage: 61.3 },
    { day: '週五', usage: 58.9 },
    { day: '週六', usage: 67.2 },
    { day: '週日', usage: 72.1 }
];

const monthlyData = [
    { week: '第1週', usage: 320.5 },
    { week: '第2週', usage: 298.7 },
    { week: '第3週', usage: 345.2 },
    { week: '第4週', usage: 312.8 }
];

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateTime();
    renderAppliances();
    initializeChart('week');
    setupEventListeners();
    
    // 每秒更新時間
    setInterval(updateTime, 1000);
    
    // 每30秒更新家電狀態
    setInterval(updateApplianceStatus, 30000);
}

// 更新時間顯示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('timeDisplay').textContent = timeString;
}

// 渲染家電狀態
function renderAppliances() {
    const grid = document.getElementById('applianceGrid');
    grid.innerHTML = '';
    
    appliances.forEach(appliance => {
        const card = document.createElement('div');
        card.className = `appliance-card ${appliance.status}`;
        card.innerHTML = `
            <span class="appliance-icon">${appliance.icon}</span>
            <div class="appliance-name">${appliance.name}</div>
            <div class="appliance-status ${appliance.status}">
                ${appliance.status === 'on' ? '運作中' : '已關閉'}
            </div>
            <div class="power-consumption">${appliance.powerConsumption}</div>
        `;
        
        // 點擊切換狀態
        card.addEventListener('click', () => toggleAppliance(appliance.id));
        grid.appendChild(card);
    });
}

// 切換家電狀態
function toggleAppliance(id) {
    const appliance = appliances.find(a => a.id === id);
    if (appliance) {
        appliance.status = appliance.status === 'on' ? 'off' : 'on';
        appliance.powerConsumption = appliance.status === 'on' ? 
            getRandomPowerConsumption(appliance.name) : '0 kW';
        renderAppliances();
        updateChart();
    }
}

// 獲取隨機耗電量
function getRandomPowerConsumption(applianceName) {
    const powerRanges = {
        '冷氣機': [1.5, 3.0],
        '電燈': [0.05, 0.15],
        '電視': [0.2, 0.4],
        '冰箱': [0.6, 1.0],
        '洗衣機': [0.8, 1.5],
        '微波爐': [0.7, 1.2],
        '熱水器': [1.0, 1.5],
        '電腦': [0.3, 0.6]
    };
    
    const range = powerRanges[applianceName] || [0.1, 0.5];
    const power = (Math.random() * (range[1] - range[0]) + range[0]).toFixed(1);
    return `${power} kW`;
}

// 更新家電狀態（模擬真實環境變化）
function updateApplianceStatus() {
    appliances.forEach(appliance => {
        // 隨機改變一些家電的狀態
        if (Math.random() < 0.1) { // 10% 機率改變狀態
            appliance.status = appliance.status === 'on' ? 'off' : 'on';
            if (appliance.status === 'on') {
                appliance.powerConsumption = getRandomPowerConsumption(appliance.name);
            } else {
                appliance.powerConsumption = '0 kW';
            }
        }
    });
    renderAppliances();
}

// 設置事件監聽器
function setupEventListeners() {
    // 用電量切換按鈕
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initializeChart(btn.dataset.period);
        });
    });
}

// 初始化圖表
function initializeChart(period) {
    const data = period === 'week' ? weeklyData : monthlyData;
    const xAxisCategories = data.map(item => period === 'week' ? item.day : item.week);
    const seriesData = data.map(item => item.usage);
    
    Highcharts.chart('usageChart', {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Courier New, monospace'
            }
        },
        title: {
            text: period === 'week' ? '本週用電量趨勢' : '本月用電量趨勢',
            style: {
                color: '#00ffff',
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: xAxisCategories,
            labels: {
                style: {
                    color: '#00ffff',
                    fontSize: '12px'
                }
            },
            lineColor: '#00ffff',
            tickColor: '#00ffff'
        },
        yAxis: {
            title: {
                text: '用電量 (kWh)',
                style: {
                    color: '#00ffff',
                    fontSize: '12px'
                }
            },
            labels: {
                style: {
                    color: '#00ffff',
                    fontSize: '12px'
                }
            },
            gridLineColor: 'rgba(0, 255, 255, 0.2)'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgba(0, 255, 255, 0.3)'],
                        [1, 'rgba(0, 255, 255, 0.05)']
                    ]
                },
                marker: {
                    radius: 4,
                    fillColor: '#00ffff',
                    lineWidth: 2,
                    lineColor: '#00ffff'
                },
                lineWidth: 3,
                lineColor: '#00ffff',
                states: {
                    hover: {
                        lineWidth: 4
                    }
                }
            }
        },
        series: [{
            name: '用電量',
            data: seriesData,
            color: '#00ffff'
        }],
        credits: {
            enabled: false
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00ffff',
            borderRadius: 5,
            style: {
                color: '#00ffff'
            },
            formatter: function() {
                return `<b>${this.x}</b><br/>用電量: <b>${this.y} kWh</b>`;
            }
        }
    });
}

// 更新圖表（當家電狀態改變時）
function updateChart() {
    const activePeriod = document.querySelector('.toggle-btn.active').dataset.period;
    initializeChart(activePeriod);
}

// 獲取最高耗電家電
function getHighestPowerAppliance() {
    const runningAppliances = appliances.filter(a => a.status === 'on');
    if (runningAppliances.length === 0) return '無運作家電';
    
    const highest = runningAppliances.reduce((prev, current) => {
        const prevPower = parseFloat(prev.powerConsumption);
        const currentPower = parseFloat(current.powerConsumption);
        return currentPower > prevPower ? current : prev;
    });
    
    return highest.name;
}

// 獲取最高用電時段
function getPeakUsageTime() {
    const times = ['06:00-08:00', '12:00-14:00', '18:00-20:00', '22:00-24:00'];
    const weights = [0.3, 0.4, 0.8, 0.6]; // 權重，18:00-20:00 最高
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            return times[i];
        }
    }
    
    return times[2]; // 預設返回 18:00-20:00
}

// 定期更新統計資訊
setInterval(() => {
    document.getElementById('highestConsumer').textContent = getHighestPowerAppliance();
    document.getElementById('peakTime').textContent = getPeakUsageTime();
}, 10000);

// 添加一些動態效果
function addDynamicEffects() {
    // 隨機閃爍效果
    setInterval(() => {
        const cards = document.querySelectorAll('.appliance-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        randomCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            randomCard.style.transform = 'scale(1)';
        }, 200);
    }, 5000);
}

// 啟動動態效果
setTimeout(addDynamicEffects, 2000); 