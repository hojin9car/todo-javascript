// trim: stirng 에서 앞 뒤 공백 제거해주는 메서드
// !!변수 => 불리언 타입 변환.

const TODO_LIST = "TODO_LIST";

// const inputElement = document.getElementsByClassName("form__element")[0];
const inputElement = document.querySelector(".form__element");
const todoListElement = document.querySelector(".todo__list");
let todo = "";
let todoList = [];

const handleChange = (e) => {
  todo = e.target.value;
};

const formElement = document.querySelector("form");

const handleSubmit = (e) => {
  e.preventDefault(); // 페이지 새로고침 방지
  todo = todo.trim();
  // if (todo.trim() == '') return;  엄격한 검사 안하면 사이드이펙트 발생 가능...
  if (!todo) return;

  const newItem = {
    id: Date.now(),
    todo,
    isComplete: false,
  };
  addUi(newItem); // ui update
  // console.log(newItem);
  todoList.push(newItem); // data update
  window.localStorage.setItem(TODO_LIST, JSON.stringify(todoList));
  // console.log("🚀 ~ handleSubmit ~ todoList:", todoList)
};

const handleDelete = (id) => {
  // console.log("log from handleDelete, id: ", id);
  const itemToFind = todoList.find((item) => item.id === id);
  const idx = todoList.indexOf(itemToFind);
  if (idx > -1) todoList.splice(idx, 1);
  // console.log(todoList);
  deleteUi(id);
  window.localStorage.setItem(TODO_LIST, JSON.stringify(todoList));
};

const handleEdit = (id) => {
  const editFormElement = document.querySelector(".form__element");
  console.log("editFormElement:", editFormElement);
};

const handleUpdate = (e, id) => {
  console.log("id", id);
  console.log(e.target.checked);
  todoList = todoList.map((item) => {
    // 체크 이벤트에 따른 이벤트의 isComplete 값 변경.
    // if (item.id === id) {
    //     item.isComplete = e.target.checked
    // }
    // return item;
    // 스프레드 신텍스. 배열도 복사 가능.
    return item.id === id
      ? {
          ...item, // 객체 복사.
          isComplete: e.target.checked,
        }
      : item;
  });
  // console.log('test arr', [...todoList, '후츠릿'])  //
  // console.log("todoList: ",todoList);
  console.log(todoList);
  window.localStorage.setItem(TODO_LIST, JSON.stringify(todoList)); // 로컬 스토리지에 수정된 todoList 저장.

  // updateUi 호출
  updateUi(todoList.find((item) => item.id === id));
};

const deleteUi = (id) => {
  const targetElement = document.querySelector(`.todo__item[data-id='${id}']`); // target 될 요소 네이밍,.
  // console.log("🚀 ~ deleteUi ~ deleteElement:", deleteElement)
  todoListElement.removeChild(targetElement);
};

const updateUi = (item) => {
  const { id, isComplete } = item;
  // console.log("item:", item);
  const targetElement = document.querySelector(`.todo__item[data-id='${id}']`); // target 될 요소 네이밍,.
  const todoContentElement = targetElement.querySelector(".todo__content");
  const inputElement = todoContentElement.querySelector(".checkbox");

  // if (isComplete) {
  //     todoContentElement.classList.add('complete');
  //     inputElement.checked = true;
  // } else {
  //     todoContentElement.classList.remove('complete');
  //     inputElement.checked = false;
  // }

  isComplete
    ? todoContentElement.classList.add("complete")
    : todoContentElement.classList.remove("complete");
  inputElement.checked = isComplete;
};

const addUi = (newItem) => {
  // 구조분해 할당
  const { todo: todoValue, isComplete, id } = newItem;

  // const id = newItem.id;
  // const todo = newItem.todo;
  // const isComplete = newItem.isComplete;

  // const arr = ['cat', 'dog'];
  // const [aaa, bbb] = arr;

  const li = document.createElement("li");
  // li.setAttribute('id', newItem.id);
  li.dataset.id = id; // data-id="1728722004254"
  li.classList.add("todo__item");
  li.innerHTML = `<div class="todo__content">
                    <div class="todo__item-check">
                      <label>
                        <input type="checkbox" class="checkbox" />
                        <i class="todo__item-check-icon"></i>
                        <i
                          class="todo__item-check-icon complete fas fa-check"
                        ></i>
                        <span class="todo__content-text">${todoValue}</span>
                      </label>
                    </div>
                    <div class="todo__item-buttonarea">
                      <a href="/edit.html?id=${id}" class="todo__item-button update-btn">
                        <i
                          class="todo__item-button-icon update far fa-edit"
                        ></i>
                      </a>
                      <button type="button" class="todo__item-button delete-btn">
                        <i
                          class="todo__item-button-icon delete far fa-times-circle"
                        ></i>
                      </button>
                    </div>
                  </div>`;

  todoListElement.appendChild(li); // todolist item 업데이트
  // console.log('delete btn!! =>', li.querySelector('.delete-btn'))

  // delete button
  const deleteBtnElement = li.querySelector(".delete-btn");
  deleteBtnElement.addEventListener("click", () => handleDelete(id));

  // update button
  const updateBtnElement = li.querySelector(".update-btn");
  updateBtnElement.addEventListener("click", () => handleEdit(id));

  // 체크박스
  const isCompleteCheckboxElement = li.querySelector(".checkbox");
  isCompleteCheckboxElement.addEventListener("change", (e) =>
    handleUpdate(e, id)
  );

  inputElement.value = ""; // 업데이트 하면서 input 초기화.
  todo = ""; // todo 변수 초기화.
  // console.log(todo);
};

// 페이지 로딩 완료 시 로컬스토리지 불러오기.
const getTodoList = () => {
  // const todoListFromStorage = window.localStorage.getItem(TODO_LIST); // null or array
  const todoListFromStorage = window.localStorage.getItem(TODO_LIST) || "[]";

  console.log("🚀 ~ todoListFromStorage:", todoListFromStorage);
  console.log(
    "JSON.parse(todoListFromStorage",
    JSON.parse(todoListFromStorage)
  );
  todoList = JSON.parse(todoListFromStorage); // data update
  console.log("🚀 ~ getTodoList ~ todoList:", todoList);
  todoList.forEach((item) => {
    addUi(item);
    updateUi(item);
  }); // ui update
};

// const deleteElements = document.querySelectorAll('.delete-btn')

// deleteElements.forEach((item) => {
//     console.log(item);
// })

// delete logic
// 1. delete 클릭 이벤트가 발생하면 handleDelete 함수가 호출된다.
// 2. handleDelete 함수는
// 2-1. delete 요소의 부모요소의 id 값을 temp에 저장한다.
// 2-2. temp 값에 해당하는 아이템을 todoList 배열에서 삭제한다.
// 2-3. temp 값에 해당하는 아이템을 html 에서 삭제한다.

// 다솜님. create.
// 1. input 요소 가져오기
// 2. 해당 input에서 사용자가 값을 입력하는 이벤트가 발생되면 handleChange라는 함수 실행
// 3. todo라는 변수 생성(string)
// 4-1. handleChange 함수에서 사용자가 입력하는 값 받아오기
// 4-2. 받아온 입력값을 todo에 업데이트
// 5. 사용자가 Add버튼을 클릭하거나 submit할때 handleSubmit함수 실행
// 6. todoList라는 변수 생성(array)
// 7-1. handleSubmit함수에서 todoItem데이터 세팅
// 7-2. 해당 todoItem데이터를 todoList배열에 추가
// 7-3. 해당 todoItem데이터를 UI에 보여지게 업데이트

// 다솜님. update
/**
 * 1. 체크박스 선택시 handleUpdate 함수 실행
 * 2. handleUpdate 함수
 * 2-1. todoList에서 해당 아이템의 isComplete 속성 값 변경(토글) // data update
 * 2-2. localStorage도 변경된 todoList로 업데이트
 * 2-3. todo__content 클래스명을 가진 요소에 complete 클래스 추가 // UI update
 * 3. 페이지 로드시 각 요소마다 isComplete값 확인하여 체크 표시 // UI update
 */

// const buttonEl = document.querySelector(".test-button");

// const hanldeClick = (string) => {
//   // 실행문
//   console.log("click!!", string);
// };

// 이벤트
// buttonEl.addEventListener('click', () => hanldeClick('test'))
// buttonEl.addEventListener('click', () => {
//   return hanldeClick('test')
// })

// buttonEl.addEventListener("click", () => hanldeClick("test"));

// 과제.
/**
 * 아이템 업데이트 아이콘 클릭
 * edit.html로 이동
 * edit.html 폼에 클릭한 아이템 내용 입력되어 있음.
 * 내용수정 후 업데이트 클릭 -> index.html 로 이동.
 * ui는 수정된 내용으로 업데이트 되어야 하고, 로컬스토리지도 반영되어야함.
 *
 * window.location.href = index.html...
 *
 *
 */

// 후츠릿 피드백.
// 변수 사용 잘 하기
// 콘솔 찍을 때 뭐 찍는지 같이 적어주기.
// 단일진실 공급원: 중앙집중형 관리... 모든 데이터가 단 하나의 신뢰할 수 있는 출처에서 관리되는 원칙.

window.onload = () => {
  if (window.location.href.includes("edit")) {
    console.log("여기는 edit page!");
    const getIdFromUrl = () => {
      const getParams = new URLSearchParams(window.location.search);
      console.log("id: ", getParams.get("id"));
      return getParams.get("id");
    };
    const id = getIdFromUrl();
    const todoListFromStorage = window.localStorage.getItem(TODO_LIST) || "[]";
    console.log("itemText:", JSON.parse(todoListFromStorage));
    const todoListJSON = JSON.parse(todoListFromStorage);

    const findItemById = (id) => {
      return todoListJSON.find((item) => item.id === Number(id));
    };

    const foundItem = findItemById(id);
    console.log("찾은 아이템:", foundItem);
    const itemIndex = todoListJSON.findIndex((item) => item.id === Number(id));
    console.log("item index:", itemIndex);

    inputElement.value = foundItem.todo;

    const updateData = () => {
      const editedTodo = document.querySelector(".form__element");
      foundItem.todo = editedTodo.value;
      todoListJSON.splice(itemIndex, 1, foundItem);
      console.log("edited object:", todoListJSON);
      window.localStorage.setItem(TODO_LIST, JSON.stringify(todoListJSON));
    };

    const updateBtnElement = document.querySelector(".update");
    console.log("updateBtnElement:", updateBtnElement);
    updateBtnElement.addEventListener("click", updateData);
  } else {
    // 페이지 로드 시 화면 그리기.
    getTodoList();

    formElement.addEventListener("submit", handleSubmit);
    inputElement.addEventListener("input", handleChange);
  }
};
