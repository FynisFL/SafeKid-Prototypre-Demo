const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

const state = {
  screen: 'home',
  coins: 120,
  tasks: [
    { id: 1, icon:'🦷', title:'Đánh răng buổi sáng', sub:'Hoàn thành trước 7:30', coins:10, done:true },
    { id: 2, icon:'🎒', title:'Chuẩn bị cặp sách', sub:'Sách vở + bình nước', coins:15, done:true },
    { id: 3, icon:'🍱', title:'Ăn trưa đầy đủ', sub:'Phụ huynh xác nhận', coins:20, done:false },
    { id: 4, icon:'📚', title:'Đọc sách 15 phút', sub:'Sau giờ học', coins:15, done:false },
    { id: 5, icon:'😴', title:'Đi ngủ trước 21:30', sub:'Tạo thói quen ngủ đúng giờ', coins:20, done:false }
  ],
  rewards: [
    { id: 1, icon:'🍦', title:'Kem cuối tuần', sub:'Phụ huynh trao sau bữa tối', cost:80 },
    { id: 2, icon:'📚', title:'Một cuốn truyện mới', sub:'Chọn cùng bố mẹ', cost:120 },
    { id: 3, icon:'🎮', title:'30 phút chơi game', sub:'Có giới hạn thời gian', cost:150 },
    { id: 4, icon:'🎢', title:'Đi công viên', sub:'Phần thưởng lớn trong tháng', cost:300 }
  ],
  premium: 'week',
  sosTimer: null,
  sosSec: 0
};

function go(screen){
  state.screen = screen;
  $$('.screen').forEach(s => s.classList.toggle('is-active', s.dataset.screen === screen));
  $$('.tab').forEach(t => t.classList.toggle('is-on', t.dataset.go === screen));
  const tabbar = $('#tabbar');
  tabbar.style.display = ['privacy','premium','zone'].includes(screen) ? 'none' : 'grid';
  if(screen === 'map') simulateMap();
}

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('is-on'), 2100);
}

function renderCoins(){
  ['coinHome','coinHabit','coinReward'].forEach(id => {
    const el = $('#'+id); if(el) el.textContent = state.coins;
  });
}

function renderTasks(){
  const home = $('#homeTasks');
  const list = $('#taskList');
  const done = state.tasks.filter(t => t.done).length;
  const total = state.tasks.length;
  $('#doneCount').textContent = done;
  $('#totalCount').textContent = total;
  $('#hbRing').style.strokeDashoffset = 100 - Math.round((done / total) * 100);

  home.innerHTML = state.tasks.slice(0,3).map(t => `
    <li class="taskmini ${t.done ? 'done':''}">
      <span class="taskcheck">${t.done ? '✓':''}</span>
      <div class="taskbody"><p class="taskt">${t.icon} ${t.title}</p><p class="tasks">${t.sub}</p></div>
      <span class="taskcoin">+${t.coins}</span>
    </li>`).join('');

  list.innerHTML = state.tasks.map(t => `
    <li class="taskitem ${t.done ? 'done':''}">
      <span class="taskcheck">${t.done ? '✓':''}</span>
      <div class="taskbody"><p class="taskt">${t.icon} ${t.title}</p><p class="tasks">${t.sub}</p></div>
      <div class="taskactions">
        <span class="taskcoin">+${t.coins}</span>
        <button class="taskdonebtn" data-task="${t.id}">${t.done ? 'Bỏ' : 'Xong'}</button>
      </div>
    </li>`).join('');
}

function renderRewards(){
  $('#rewardList').innerHTML = state.rewards.map(r => `
    <li class="rewarditem">
      <div class="rewardleft">
        <span class="rewardico">${r.icon}</span>
        <div><p class="taskt">${r.title}</p><p class="tasks">${r.sub}</p><p class="rewardcost">🪙 ${r.cost} xu</p></div>
      </div>
      <button class="redeem" data-reward="${r.id}" ${state.coins < r.cost ? 'disabled':''}>Đổi</button>
    </li>`).join('');
}

function renderPremium(){
  const data = {
    week: ['19.000đ','/ tuần · linh hoạt cho gia đình mới dùng',''],
    month: ['49.000đ','/ tháng · phổ biến nhất','Tiết kiệm so với trả theo tuần'],
    year: ['399.000đ','/ năm · an tâm trọn năm','Tiết kiệm khoảng 32%']
  }[state.premium];
  $('#priceNum').textContent = data[0];
  $('#priceUnit').textContent = data[1];
  $('#priceSave').textContent = data[2];
  $$('.seg').forEach(s => s.classList.toggle('is-on', s.dataset.cycle === state.premium));
}

function addTask(){
  const pool = [
    ['🥛','Uống đủ nước','Uống 4 ly nước trong ngày',10],
    ['🧸','Dọn đồ chơi','Cất đồ chơi vào hộp',15],
    ['🎨','Vẽ một bức tranh','Hoạt động sáng tạo sau giờ học',15],
    ['👟','Đi bộ 1.000 bước','Tăng vận động nhẹ nhàng',20]
  ];
  const p = pool[Math.floor(Math.random()*pool.length)];
  state.tasks.push({ id: Date.now(), icon:p[0], title:p[1], sub:p[2], coins:p[3], done:false });
  renderTasks();
  toast('Đã thêm nhiệm vụ mới cho Bé An');
}

function toggleTask(id){
  const t = state.tasks.find(x => x.id == id);
  if(!t) return;
  t.done = !t.done;
  state.coins += t.done ? t.coins : -t.coins;
  renderCoins(); renderTasks(); renderRewards();
  toast(t.done ? `Bé An nhận +${t.coins} xu 🎉` : `Đã hoàn tác nhiệm vụ`);
}

function redeem(id){
  const r = state.rewards.find(x => x.id == id);
  if(!r || state.coins < r.cost) return;
  state.coins -= r.cost;
  renderCoins(); renderRewards();
  toast(`Đã gửi yêu cầu phụ huynh duyệt: ${r.title}`);
}

function startSOS(){
  $('#sosOverlay').classList.add('is-on');
  state.sosSec = 0;
  $('#callTimer').textContent = '00:00';
  clearInterval(state.sosTimer);
  state.sosTimer = setInterval(() => {
    state.sosSec++;
    const m = String(Math.floor(state.sosSec/60)).padStart(2,'0');
    const s = String(state.sosSec%60).padStart(2,'0');
    $('#callTimer').textContent = `${m}:${s}`;
    if(state.sosSec === 4) $('#sosTitle').textContent = 'Đã kết nối với Mẹ Linh';
    if(state.sosSec === 7) $('#sosSub').textContent = 'Vị trí hiện tại đã được chia sẻ cho phụ huynh';
  }, 1000);
}
function endSOS(){
  clearInterval(state.sosTimer);
  $('#sosOverlay').classList.remove('is-on');
  $('#sosTitle').textContent = 'Đang gọi Bố / Mẹ…';
  $('#sosSub').textContent = 'Bé An vừa kích hoạt SOS · Gesture chạm 3 lần';
  toast('Cuộc gọi SOS đã kết thúc');
}

function simulateMap(){
  const kid = $('#bmKid');
  if(!kid) return;
  kid.animate([
    { transform:'translate(0,0)' },
    { transform:'translate(9px,-5px)' },
    { transform:'translate(0,0)' }
  ], { duration: 2200, iterations: 1, easing:'ease-in-out' });
  $('#mapUpdated').textContent = 'Vừa cập nhật · pin 78%';
}

function botReply(text){
  const chat = $('#chat');
  const normalized = text.toLowerCase();
  let reply = 'Mình đã ghi nhận câu hỏi. Với nội dung cần kiểm tra chi tiết, mình sẽ chuyển sang nhân viên hỗ trợ để tránh trả lời sai ạ.';
  if(normalized.includes('pin')) reply = 'Pin dự kiến dùng khoảng 1–2 ngày tuỳ tần suất GPS realtime, gọi thoại và cảnh báo. Khi pin dưới 20%, phụ huynh sẽ nhận thông báo.';
  if(normalized.includes('vùng') || normalized.includes('safe')) reply = 'Để thiết lập vùng an toàn: vào Bản đồ → Vùng an toàn → chọn địa điểm → chỉnh bán kính. Khi bé ra khỏi vùng, app sẽ gửi cảnh báo cho phụ huynh.';
  if(normalized.includes('premium') || normalized.includes('gói')) reply = 'Premium mở GPS thời gian thực, lịch sử vị trí 30 ngày, Safe Zone thông minh, Gesture SOS, nhiệm vụ/đổi xu không giới hạn và cảnh báo tháo thiết bị.';
  if(normalized.includes('bảo hành')) reply = 'SafeKid dự kiến bảo hành thiết bị 12 tháng cho lỗi kỹ thuật. Với rơi vỡ, vào nước hoặc lỗi do sử dụng sai, nhân viên sẽ kiểm tra từng trường hợp.';
  if(normalized.includes('sos') || normalized.includes('khẩn cấp')) reply = 'Nếu khẩn cấp, mẹ hãy bấm SOS hoặc gọi 113. S.F AI chỉ hỗ trợ hướng dẫn, không tự xử lý tình huống khẩn cấp. App sẽ ưu tiên kết nối tới phụ huynh/người thật.';

  chat.insertAdjacentHTML('beforeend', `<div class="msg ai"><span class="msg-ava">🤖</span><div class="bubble">${reply}</div></div>`);
  chat.scrollTop = chat.scrollHeight;
}

function sendUser(text){
  if(!text.trim()) return;
  const chat = $('#chat');
  chat.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="bubble">${text}</div></div>`);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => botReply(text), 450);
}

function humanHandoff(){
  const chat = $('#chat');
  chat.insertAdjacentHTML('beforeend', `
    <div class="msg ai"><span class="msg-ava">👤</span><div class="bubble"><b>Đã chuyển sang nhân viên hỗ trợ Tier-2.</b><br>Nhân viên SafeKid sẽ tiếp nhận các vấn đề bảo hành, kỹ thuật hoặc tình huống AI không chắc chắn.</div></div>`);
  chat.scrollTop = chat.scrollHeight;
  toast('Đã tạo yêu cầu gặp nhân viên hỗ trợ');
}

function bind(){
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-go]');
    if(nav) go(nav.dataset.go);
    if(e.target.closest('[data-sos]')) startSOS();
    if(e.target.closest('[data-call]')) toast('Đang gọi Bé An qua danh bạ được duyệt');
    const task = e.target.closest('[data-task]');
    if(task) toggleTask(task.dataset.task);
    const reward = e.target.closest('[data-reward]');
    if(reward) redeem(Number(reward.dataset.reward));
  });

  $('#sosEnd').addEventListener('click', endSOS);
  $('#sosLocate').addEventListener('click', () => { endSOS(); go('map'); });
  $('#addTask').addEventListener('click', addTask);
  $('#resetTasks').addEventListener('click', () => {
    state.coins = 120;
    state.tasks.forEach((t,i) => t.done = i < 2);
    renderCoins(); renderTasks(); renderRewards(); toast('Đã đặt lại dữ liệu demo');
  });
  $('#addZone').addEventListener('click', () => toast('Demo: đã thêm vùng “Nhà ông bà”'));
  $('#histBtn').addEventListener('click', () => toast('Premium: mở lịch sử vị trí 30 ngày'));
  $('#subBtn').addEventListener('click', () => toast('Demo: bắt đầu dùng thử Premium 7 ngày'));
  $('#delData').addEventListener('click', () => toast('Demo: đã gửi yêu cầu xoá dữ liệu'));

  $('#zoneRadius').addEventListener('input', e => {
    const v = Number(e.target.value);
    $('#zoneRadiusTxt').textContent = `${v} m`;
    const size = Math.max(95, Math.min(190, v / 5));
    $('#zoneLive').style.width = size + 'px';
    $('#zoneLive').style.height = size + 'px';
  });

  $('#cycleSeg').addEventListener('click', e => {
    const seg = e.target.closest('[data-cycle]');
    if(!seg) return;
    state.premium = seg.dataset.cycle;
    renderPremium();
  });

  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#chatInput');
    sendUser(inp.value);
    inp.value = '';
  });
  $('#chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if(chip) sendUser(chip.textContent);
  });
  $('#humanBtn').addEventListener('click', humanHandoff);
  $('#humanTop').addEventListener('click', humanHandoff);
}

function init(){
  bind();
  renderCoins();
  renderTasks();
  renderRewards();
  renderPremium();
  go('home');
  setTimeout(() => toast('Prototype SafeKid Parent App đã sẵn sàng'), 500);
}

init();
