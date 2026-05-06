const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const container = document.querySelector('.container');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentTab = 'all'; // 현재 선택된 탭: 'all' | 'active' | 'done'

// 할일 입력 아래에 완료 예정 시간 입력 필드를 동적으로 생성
const dueDateRow = document.createElement('div');
dueDateRow.id = 'dueDateRow';

const dueDateLabel = document.createElement('label');
dueDateLabel.htmlFor = 'dueDateInput';
dueDateLabel.textContent = '완료 예정 시간';

const dueDateInput = document.createElement('input');
dueDateInput.type = 'datetime-local';
dueDateInput.id = 'dueDateInput';

dueDateRow.appendChild(dueDateLabel);
dueDateRow.appendChild(dueDateInput);

// input-area 바로 뒤에 삽입
const inputArea = document.querySelector('.input-area');
inputArea.insertAdjacentElement('afterend', dueDateRow);

// 탭 영역을 동적으로 생성하여 dueDateRow 아래에 삽입
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

// dueDateRow 바로 뒤에 탭 삽입
dueDateRow.insertAdjacentElement('afterend', tabBar);

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

// datetime-local 값을 읽기 좋은 형태로 변환 (예: 2026-05-06T14:30 → 2026-05-06 14:30)
function formatDueDate(value) {
  if (!value) return null;
  return value.replace('T', ' ');
}

function render() {
  todoList.innerHTML = '';

  const filtered = getFiltered();

  filtered.forEach((todo) => {
    // todos 배열에서 실제 인덱스를 사용해야 토글/삭제가 올바르게 동작함
    const index = todos.indexOf(todo);

    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    // 텍스트 + 완료 예정 시간을 묶는 wrapper
    const textWrap = document.createElement('div');
    textWrap.className = 'text-wrap';

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.addEventListener('click', () => toggleDone(index));
    textWrap.appendChild(span);

    // 완료 예정 시간이 있으면 표시
    if (todo.dueDate) {
      const due = document.createElement('span');
      due.className = 'due-date';
      due.textContent = `⏰ ${todo.dueDate}`;
      textWrap.appendChild(due);
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

  todos.push({
    text,
    done: false,
    dueDate: formatDueDate(dueDateInput.value), // 완료 예정 시간 저장
  });

  input.value = '';
  dueDateInput.value = ''; // 입력 초기화
  render();
}

function toggleDone(index) {
  todos[index].done = !todos[index].done;
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
