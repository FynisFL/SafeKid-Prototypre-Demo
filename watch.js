const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

const state = {
  screen: 'face',
  coins: 120,
  callTimer: null,
  callSec: 0,
  holdTimer: null,
  holdProgress: 0,
  tasks: [
    { id: 1, icon:'🦷', title:'Đánh răng', sub:'+10 xu', coins:10, done:false },
    { id: 2, icon:'🎒', title:'Soạn cặp', sub:'+15 xu', coins:15, done:true },
    { id: 3, icon:'📚', title:'Đọc sách', sub:'+15 xu', coins:15, done:false }
  ],
  rewards: [
    { id: 1, icon:'🍦', title:'Kem', sub:'80 xu', cost:80 },
    { id: 2, icon:'📖', title:'Truyện', sub:'120 xu', cost:120 },
    { id: 3, icon:'🎢', title:'Công viên', sub:'300 xu', cost:300 }
  ]
};

function go(screen){
  state.screen = screen;
  document.body.dataset.watchScreen = screen;
  $$('.w-screen').forEach(s => s.classList.toggle('is-on', s.dataset.screen === screen));
  if(screen !== 'calling') stopCallTimer(false);
  if(screen !== 'sos') cancelHold();
}

function toast(msg){
  const t = $('#watchToast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('is-on'), 1900);
}

function updateClock(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  $('#clock').textContent = `${hh}:${mm}`;
  $('#tinyTime').textContent = `${hh}:${mm}`;
}

function renderCoins(){
  ['coinsFace','coinsTask','coinsReward'].forEach(id => {
    const el = $('#'+id); if(el) el.textContent = state.coins;
  });
}

function renderTasks(){
  $('#watchTasks').innerHTML = state.tasks.map(t => `
    <button class="watch-task ${t.done ? 'done':''}" data-task="${t.id}">
      <span class="task-icon">${t.icon}</span>
      <span><b>${t.title}</b><small>${t.done ? 'Đã xong' : t.sub}</small></span>
      <span class="done-btn">${t.done ? 'OK' : 'Xong'}</span>
    </button>
  `).join('');
}

function renderRewards(){
  $('#watchRewards').innerHTML = state.rewards.map(r => `
    <button class="watch-reward" data-reward="${r.id}" ${state.coins < r.cost ? 'disabled' : ''}>
      <span class="reward-icon">${r.icon}</span>
      <span><b>${r.title}</b><small>${r.sub}</small></span>
      <span class="redeem-btn">Đổi</span>
    </button>
  `).join('');
}

function completeTask(id){
  const task = state.tasks.find(t => t.id == id);
  if(!task) return;
  if(task.done){
    toast('Nhiệm vụ này xong rồi nè');
    return;
  }
  task.done = true;
  state.coins += task.coins;
  $('#taskRewardText').textContent = `+${task.coins} xu`;
  renderCoins(); renderTasks(); renderRewards();
  go('taskDone');
}

function redeem(id){
  const reward = state.rewards.find(r => r.id == id);
  if(!reward) return;
  if(state.coins < reward.cost){
    toast('Chưa đủ xu rồi');
    return;
  }
  toast('Đã gửi cho ba/mẹ duyệt 🎁');
}

function startCall(name){
  $('#callName').textContent = name;
  $('#callAvatar').textContent = name.includes('Bố') ? '👨' : name.includes('Bà') ? '👵' : '👩';
  go('calling');
  state.callSec = 0;
  $('#callTime').textContent = '00:00';
  clearInterval(state.callTimer);
  state.callTimer = setInterval(() => {
    state.callSec++;
    const m = String(Math.floor(state.callSec/60)).padStart(2,'0');
    const s = String(state.callSec%60).padStart(2,'0');
    $('#callTime').textContent = `${m}:${s}`;
  }, 1000);
}

function stopCallTimer(navigate=true){
  clearInterval(state.callTimer);
  state.callTimer = null;
  if(navigate) go('call');
}

function beginHold(){
  cancelHold();
  state.holdProgress = 0;
  $('#holdRing').style.width = '0%';
  state.holdTimer = setInterval(() => {
    state.holdProgress += 4;
    $('#holdRing').style.width = `${state.holdProgress}%`;
    if(state.holdProgress >= 100){
      cancelHold();
      triggerSOS();
    }
  }, 120);
}

function cancelHold(){
  clearInterval(state.holdTimer);
  state.holdTimer = null;
  const ring = $('#holdRing');
  if(ring) ring.style.width = '0%';
}

function triggerSOS(){
  go('sosLive');
  $('#sosLiveTitle').textContent = 'Đang gọi Mẹ…';
  setTimeout(() => {
    if(state.screen === 'sosLive') $('#sosLiveTitle').textContent = 'Đã kết nối với Mẹ';
  }, 1600);
}

function resetDemo(){
  state.coins = 120;
  state.tasks.forEach((t,i) => t.done = i === 1);
  renderCoins(); renderTasks(); renderRewards();
  toast('Đã đặt lại demo');
}

function bind(){
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-go]');
    if(nav) go(nav.dataset.go);

    const c = e.target.closest('[data-call]');
    if(c) startCall(c.dataset.call);

    const t = e.target.closest('[data-task]');
    if(t) completeTask(t.dataset.task);

    const r = e.target.closest('[data-reward]');
    if(r) redeem(Number(r.dataset.reward));
  });

  $('#sideHome').addEventListener('click', () => go('face'));
  $('#sideSOS').addEventListener('click', () => go('sos'));
  $('#endCall').addEventListener('click', () => { stopCallTimer(true); toast('Đã kết thúc cuộc gọi'); });
  $('#endSOS').addEventListener('click', () => { go('menu'); toast('SOS demo đã kết thúc'); });
  $('#resetDemo').addEventListener('click', resetDemo);
  $('#playMusic').addEventListener('click', () => toast('Đang phát nhạc offline đã duyệt'));

  const hold = $('#holdSOS');
  hold.addEventListener('mousedown', beginHold);
  hold.addEventListener('touchstart', e => { e.preventDefault(); beginHold(); }, {passive:false});
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => hold.addEventListener(evt, cancelHold));

  $('#schoolToggle').addEventListener('change', e => {
    $('#schoolTitle').textContent = e.target.checked ? 'Đang học nè' : 'Đã tắt lớp học';
    $('#schoolText').textContent = e.target.checked
      ? 'Chỉ xem giờ. Cuộc gọi lạ bị chặn. SOS vẫn hoạt động.'
      : 'Bé có thể nhận cuộc gọi từ danh bạ được duyệt.';
    toast(e.target.checked ? 'Đã bật chế độ lớp học' : 'Đã tắt chế độ lớp học');
  });
}

function init(){
  bind();
  updateClock();
  setInterval(updateClock, 15000);
  renderCoins(); renderTasks(); renderRewards();
  go('face');
  setTimeout(() => toast('Watch Demo sẵn sàng'), 500);
}

init();
