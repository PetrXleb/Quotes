"use strict"
//глобальные переменные
let baseUrl;
const textH1 = document.querySelector('.text1');
let last_id;
let last_indexx_in_bd;
let content;
//кнопки
const notesEl = document.querySelector('.notes');
const addBtn = document.querySelector('.note-add');
const addBtn2 = document.querySelector('.note-theme');
const addSave = document.querySelector('.note-save');

const addBtn3 = document.querySelector('.test');
//addBtn3.classList.toggle('hidden');

//
//создание и редактирование цитат
//
function createNote(text, title, i) {
    //индификатор цитаты
    let indexx = i;

    if (i == undefined) {
      last_id++;
      indexx = last_id;
    }
  
    //console.log(indexx);

    //добавление новой верстки
  const noteEl = document.createElement('div');
  noteEl.classList.add('note');
  noteEl.innerHTML = `
    <div class="note-header">
      <textarea id="note-textarea" class="hidden">${text}</textarea>
      <div>
        <button class="note-edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="note-save"><i class="fa-solid fa-floppy-disk"></i></button>
        <button class="note-delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    <textarea id="note-title-input" class="hidden">${title}</textarea>


    <blockquote class="q-card q-card-color-3">
  <div class="content" id="note-text">${text}</div>
  <div class='author' id="note-title">${title}</div>
</blockquote>
  `

  //кнопки изменения и удаления
  const editBtn = noteEl.querySelector('.note-edit');
  const deleteBtn = noteEl.querySelector('.note-delete');
  const titleEl = noteEl.querySelector('#note-title');
  const textEl = noteEl.querySelector('#note-text');
  const titleInputEl = noteEl.querySelector('#note-title-input');
  const textInputEl = noteEl.querySelector('#note-textarea');
  
  const saveBtn = noteEl.querySelector('.note-save');
  //изменение
  editBtn.addEventListener('click', (e) => {
    titleEl.classList.toggle('hidden');
    textEl.classList.toggle('hidden');

    titleInputEl.classList.toggle('hidden');
    textInputEl.classList.toggle('hidden');

    saveBtn.classList.toggle('hidden');
  });

  //удаление
  deleteBtn.addEventListener('click', (e) => {
    let password = prompt('Пароль',)
    if (password == 999) {
        DeleteQ(indexx);
        //console.log(indexx);

            //анимация для кнопки
            deleteBtn.classList.toggle('animation-delete');
              setTimeout(() => {
                deleteBtn.classList.toggle('animation-delete');
                noteEl.remove();
              }, 1200);
    }

    
  });
  //сохранение
  saveBtn.addEventListener('click', (e) => {

    title = titleEl.innerText;
    text =  textEl.innerText;
    console.log(title);
    console.log(text);
    AddQ(title, text, indexx);

/*     console.log('indexx в бд');
    console.log(indexx);
    console.log("=============="); */

    //анимация для кнопки
    saveBtn.classList.toggle('animation-save');
    setTimeout(() => {
      saveBtn.classList.toggle('animation-save');
    }, 1200);
    
  });


  titleInputEl.addEventListener('input', (e) => {
    titleEl.innerText = e.target.value;
  });

  textInputEl.addEventListener('input', (e) => {
    textEl.innerText = e.target.value;
  });

  return noteEl;
}

//
//обработчик нажатия на кнопку создания цитаты
//
addBtn.addEventListener('click', (e) => {
    const el = createNote("Цитата", "Автор");
    notesEl.appendChild(el); 
    
            //анимация для кнопки
            addBtn.classList.toggle('animation-addBtn');
            setTimeout(() => {
              addBtn.classList.toggle('animation-addBtn');
            }, 100);
  });



  //
  //смена темы
  //
  let theme = 'day';
  addBtn2.addEventListener('click', (e) => {
    if (theme == "day") {
        theme = "night";
        localStorage.setItem('theme', theme.toString());
        document.body.style.background = "#36434d";
        textH1.style.color = '#ADD8E6';
    } else {
        //console.log(localStorage.getItem('theme'));
        theme = "day";
        localStorage.setItem('theme', theme.toString());
        document.body.style.background = "#e2ebf1";
        textH1.style.color = '#2f2f30';
    }
                //анимация для кнопки
                addBtn2.classList.toggle('animation-addBtn2');
                setTimeout(() => {
                  addBtn2.classList.toggle('animation-addBtn2');
                }, 100);
  });

//
//обращение к базе данных - получение всей базы
//
async function getResponse() {
    //Делаем запрос на данные
    //Распарсим прибывший json
     baseUrl = await fetch('https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test');
     content = await baseUrl.json();

     console.log(content);
     console.log(content.length);
     
     //создаем существующие цитаты
     for (let i = 0; i < content.length; i++) {
        //console.log(content[i].name);

        const el = createNote(content[i].text, content[i].name, content[i].id);
        notesEl.appendChild(el);

        last_id = content[i].id;
        last_indexx_in_bd = content[i].id;
     }
}


  //
  //добавление чего-либо в базу данных
  //
async function AddQ(title, text, actualIndexx) {
    //создаем объект

/*      console.log('actualIndexx');
     console.log(actualIndexx);
     console.log('last_indexx_in_bd');
     console.log(last_indexx_in_bd); */

      let data = {
        name: title,
        text: text,
        id: actualIndexx,
    } 
 

      
//смотрим - существует ли эта цитата в бд
//если да, то обновляем, если нет, то добавляем в бд

     if ((last_indexx_in_bd - actualIndexx > 0)||(last_indexx_in_bd == actualIndexx)) {

      await fetch(`https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test/${actualIndexx}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
     }); 
      //console.log('Эллемент существует в бд');

      //исправление бага - когда новую цитату сохраняют несколько раз
  } else {
        try {
          await DeleteQ(actualIndexx);
        } catch (error) {
          //Допустимая ошибка
        }

    await fetch('https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
     }); 
    //console.log('Эллемент НЕ существует в бд');
  }
   
}

//
//удаление чего-либо из базы данных
//
 async function DeleteQ(id) {
     await fetch(`https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test/${id}`, {
        method: 'DELETE',
     });
} 

//
//Обновляем цитату на сервере
//
async function UpdateQ(title, text, actualIndexx) {

  let data = {
    name: title,
    text: text,
    id: actualIndexx,
}

  await fetch('https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test', {
     method: 'PUT',
     body: JSON.stringify(data),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
  });
} 

//
//Добавление нового эллемента в бд
//
async function Add_Add(title, text, actualIndexx) {
  await fetch('https://6429d1f500dfa3b5473ae544.mockapi.io/api/v1/test', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
          'Content-type': 'application/json; charset=UTF-8',
      },
   });
}


startt();
//
//при запуске страницы
//
function startt(title, text) {
    //создаем тестовую карточку
    //const el = createNote(title, text);
    //notesEl.appendChild(el);

    //обращение к базе данных
    getResponse();
    
    //меняем тему
    if (localStorage.getItem('theme') == "night") {
        document.body.style.background = "#36434d";
        theme = 'night';
        textH1.style.color = '#ADD8E6';
    }
}



