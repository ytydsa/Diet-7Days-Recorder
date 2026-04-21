const container = document.getElementById('weekContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 只生成 7 张卡片
for (let i = 1; i <= 7; i++) {
  const card = document.createElement('div');
  card.className = 'day-card';
  card.innerHTML = `
    <div class="day-title">第 ${i} 天</div>
    <div class="meal-box">
      <label>早餐</label>
      <textarea data-day="${i}" data-meal="breakfast" oninput="autoSave()"></textarea>
    </div>
    <div class="meal-box">
      <label>午餐</label>
      <textarea data-day="${i}" data-meal="lunch" oninput="autoSave()"></textarea>
    </div>
    <div class="meal-box">
      <label>晚餐</label>
      <textarea data-day="${i}" data-meal="dinner" oninput="autoSave()"></textarea>
    </div>
  `;
  container.appendChild(card);
}

// 翻页功能
prevBtn.addEventListener('click', () => {
  container.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
});

// 自动保存
function autoSave() {
  const data = getAllData();
  localStorage.setItem('dietData', JSON.stringify(data));
}

// 手动保存提示
function manualSave() {
  alert('已保存所有数据');
}

// 获取全部数据
function getAllData() {
  const userInfo = {
    name: "周福彬",
    gender: "男",
    age: "21",
    height: "170",
    weight: "69",
    goal: "减脂",
    activityLevel: "轻度"
  };

  const records = [];
  for (let i = 1; i <= 7; i++) {
    const breakfast = document.querySelector(`textarea[data-day="${i}"][data-meal="breakfast"]`).value.trim();
    const lunch = document.querySelector(`textarea[data-day="${i}"][data-meal="lunch"]`).value.trim();
    const dinner = document.querySelector(`textarea[data-day="${i}"][data-meal="dinner"]`).value.trim();
    records.push({ day: i, breakfast, lunch, dinner });
  }

  const now = new Date();
  const recordDate = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');

  return { userInfo, recordDate, dietRecords: records };
}

// 导出JSON + 清空数据
function exportData() {
  const data = getAllData();
  const name = data.userInfo.name || 'unknown';
  const date = data.recordDate;
  const filename = `diet_7days_${name}_${date}.json`;

  if (!confirm(`确定导出吗？\n文件名：${filename}`)) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  clearAllDietData();
}

// 清空所有饮食记录
function clearAllDietData() {
  for (let i = 1; i <= 7; i++) {
    document.querySelector(`textarea[data-day="${i}"][data-meal="breakfast"]`).value = '';
    document.querySelector(`textarea[data-day="${i}"][data-meal="lunch"]`).value = '';
    document.querySelector(`textarea[data-day="${i}"][data-meal="dinner"]`).value = '';
  }
  localStorage.removeItem('dietData');
  alert("✅ 导出成功！记录已清空");
}

// 加载本地数据
function loadSavedData() {
  const saved = localStorage.getItem('dietData');
  if (!saved) return;
  const data = JSON.parse(saved);

  data.dietRecords.forEach(record => {
    const day = record.day;
    document.querySelector(`textarea[data-day="${day}"][data-meal="breakfast"]`).value = record.breakfast || '';
    document.querySelector(`textarea[data-day="${day}"][data-meal="lunch"]`).value = record.lunch || '';
    document.querySelector(`textarea[data-day="${day}"][data-meal="dinner"]`).value = record.dinner || '';
  });
}

// 页面加载完成后读取数据
document.addEventListener('DOMContentLoaded', loadSavedData);