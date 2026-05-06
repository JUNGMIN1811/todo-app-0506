const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentTab = 'all'; // 현재 선택된 탭: 'all' | 'active' | 'done'

// 탭 영역을 동적으로 생성
const tabBar = document.createElement('div');
tabBar.id = 'tabBar';

const tabConfig = [
  { id: 'all',    label: '전체보기' },
  { id: 'active', label: '진행중' },
  { id: 'done',   label: '완료' },
];

tabConfig.forEach(({ id, label }) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.dataset.tab = id;
  btn.addEventListener('click', () => {
    currentTab = id;
    renderTabs();
    render();
  });
  tabBar.appendChild(btn);
});

// input-area 바로 뒤에 탭 삽입
const inputArea = document.querySelector('.input-area');
inputArea.insertAdjacentElement('afterend', tabBar);

// 탭 활성 상태 업데이트
function renderTabs() {
  tabBar.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === currentTab);
  });
}

// 현재 탭에 맞는 항목 필터링
function getFiltered() {
  if (currentTab === 'active') return todos.filter(t => !t.done);
  if (currentTab === 'done')   return todos.filter(t => t.done);
  return todos;
}

// Date 객체를 읽기 좋은 형태로 변환 (예: 2026-05-06 14:30)
function formatNow() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function render() {
  todoList.innerHTML = '';

  const filtered = getFiltered();

  filtered.forEach((todo) => {
    // todos 배열에서 실제 인덱스를 사용해야 토글/삭제가 올바르게 동작함
    const index = todos.indexOf(todo);

    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    // 텍스트 + 완료 시간을 묶는 wrapper
    const textWrap = document.createElement('div');
    textWrap.className = 'text-wrap';

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.addEventListener('click', () => toggleDone(index));
    textWrap.appendChild(span);

    // 완료 처리된 경우 완료 시간 표시
    if (todo.done && todo.doneAt) {
      const doneTime = document.createElement('span');
      doneTime.className = 'due-date';
      doneTime.textContent = `✓ ${todo.doneAt}`;
      textWrap.appendChild(doneTime);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    li.appendChild(textWrap);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text, done: false, doneAt: null });

  input.value = '';
  render();
}

function toggleDone(index) {
  const todo = todos[index];
  todo.done = !todo.done;
  // 완료 처리 시 현재 시각 기록, 완료 취소 시 초기화
  todo.doneAt = todo.done ? formatNow() : null;
  render();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 초기 렌더링
renderTabs();
render();
