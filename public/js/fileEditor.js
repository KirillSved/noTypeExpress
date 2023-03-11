
let isAuth = false;
async function changeAuthView () {
    if (!getCookie('authorization')) {
      console.log("no auth")
      window.location.href = '/login'
      return
    }
      else{
        document.getElementById('exitplace').innerHTML = `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`
       // document.getElementById('exitplace').innerHTML += `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`
      }
    await fetchPost('/login/check', {}, true)
      .then(login => {
        isAuth = true
      })
      .catch(_ => {
        isAuth = false
        setCookie('authorization', "")
        window.location.href = '/login'
      })
  }
  window.UserLogout = () => {
    deleteCookie("authorization")
    document.location.reload()
  }
  
  changeAuthView()
  updateTable()

  function createModal (data,name){
    let modalCon = document.getElementById("modCon")
    let modal_content = document.createElement("div")
    modal_content.onclick = function (event) {
      event.preventDefault();
    };
    modalCon.innerHTML = ``;
    modal_content.innerHTML =`

    <div class="newPost">
        <h3>Add New Post</h3>
        <input type="text" placeholder="Enter title here">
        <div class="toolbar">
          <button type="button" data-func="bold"><i class="fa fa-bold"></i></button>
          <button type="button" data-func="italic"><i class="fa fa-italic"></i></button>
          <button type="button" data-func="underline"><i class="fa fa-underline"></i></button>
          <button type="button" data-func="justifyleft"><i class="fa fa-align-left"></i></button>
          <button type="button" data-func="justifycenter"><i class="fa fa-align-center"></i></button>
          <button type="button" data-func="justifyright"><i class="fa fa-align-right"></i></button>
          <button type="button" data-func="insertunorderedlist"><i class="fa fa-list-ul"></i></button>
          <button type="button" data-func="insertorderedlist"><i class="fa fa-list-ol"></i></button>
          <div class="customSelect">
            <select data-func="fontname">
              <optgroup label="Serif Fonts">
                <option value="Bree Serif">Bree Serif</option>
                <option value="Georgia">Georgia</option>
                 <option value="Palatino Linotype">Palatino Linotype</option>
                <option value="Times New Roman">Times New Roman</option>
              </optgroup>
              <optgroup label="Sans Serif Fonts">
                <option value="Arial">Arial</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Asap" selected>Asap</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Verdana">Verdana</option>
              </optgroup>
              <optgroup label="Monospace Fonts">
                <option value="Courier New">Courier New</option>
                <option value="Lucida Console">Lucida Console</option>
              </optgroup>
            </select>
          </div>
          <div class="customSelect">
            <select data-func="formatblock">
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h4">Subtitle</option>
              <option value="p" selected>Paragraph</option>
            </select>
          </div>
        </div>
        <div class="editor" contenteditable></div>
        <div class="buttons">
          <!--<button type="button">save draft</button>-->
          <button data-func="clear" type="button">clear</button>
          <button data-func="save" type="button">save</button>
        </div>
      </div>`
      modalCon.append(modal_content)
      localStorage.setItem("wysiwyg", data.toString());
      $('.newPost button[data-func]').click(function(){
        document.execCommand( $(this).data('func'), false 	);
      });
    
      $('.newPost select[data-func]').change(function(){
        var $value = $(this).find(':selected').val();
        document.execCommand( $(this).data('func'), false, $value);
      });
    
      if(typeof(Storage) !== "undefined") {
    
      $('.editor').keypress(function(){
        $(this).find('.saved').detach();
      });
        $('.editor').html(localStorage.getItem("wysiwyg")) ;
        
        $('button[data-func="save"]').click(function(){
          $content = $('.editor').html();
          localStorage.setItem("wysiwyg", $content);
          $('.editor').append('<span class="saved"><i class="fa fa-check"></i></span>').fadeIn(function(){
            $(this).find('.saved').fadeOut(500);
          });
        });
        
        $('button[data-func="clear"]').click(function(){
          $('.editor').html('');
          localStorage.removeItem("wysiwyg");
        });
        
        
      } 
  }
  
  function addEditUModal (id,name){
    fetch(`/fileEdit/getFile/${id}`)
    .then(response => {
        if (response.headers.get('content-type').startsWith('image/')) {
            return response.blob();
          } else {
            return response.text()
          }
        }).then(data => {
          createModal(data,name);
        }).catch(err => {
      console.log(err);
    });

  }

   function updateTable(data) {
    fetch('/fileEdit/getFiles')
    .then(response => {
       // response = Object.assign({}, response); // {0:"a", 1:"b", 2:"c"}
      return response.json();
    }).then(data => {
      files = data;
      let table = document.getElementById("fileTable");
      table.innerHTML = "";
  
      // create table header
      let headerRow = document.createElement("tr");
      let header1 = document.createElement("th");
      header1.innerText = "Filename";
      let header2 = document.createElement("th");
      header2.innerText = "Path";
      let header3 = document.createElement("th");
      header3.innerText = "Order";
      let header4 = document.createElement("th");
      header4.innerText = "Edit";
      let header5 = document.createElement("th");
      header5.innerText = "show";
      headerRow.appendChild(header1);
      //headerRow.appendChild(header2);
      headerRow.appendChild(header3);
      headerRow.appendChild(header4);
      headerRow.appendChild(header5);
      table.appendChild(headerRow);
  
      // create table rows
      for (let i = 0; i < files.length; i++) {
        let file =  files[i];
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        let name =file.file_path.split("Data/")
        cell1.innerText = name[1];
        let cell2 = document.createElement("td");
        cell2.innerText = file.file_path;
        let cell3 = document.createElement("td");
        cell3.innerText = file.order;
        let cell4 = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
          addEditUModal(file.id,name[1]);
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "show";
        deleteButton.onclick = function () {
          deleteUser(user.id);
        };
        cell5.appendChild(deleteButton);
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        table.appendChild(row);
      }
  
    }).catch(err => {
      console.log(err);
    });
  }

//   async function createFileList (){
//     await fetchPost('/fileEdit/getFile',{}, true)
//       .then(d => {
//         // isAuth = true
//         console.log(d)
//       })
//       .catch(_ => {
//         // isAuth = false
//         // setCookie('authorization', "")
//         // window.location.href = '/login'
//         console.error(_)
//       })
//   }
// createFileList()
//     .then(async (d) => {
//      console.log(d)
//     //   makeToast({ header: 'Станцiя створена', body: d, type: 'success', data_delay: 10000 })
// })
//console.log(FilePath)

//   $('.newPost button[data-func]').click(function(){
//     document.execCommand( $(this).data('func'), false 	);
//   });

//   $('.newPost select[data-func]').change(function(){
//     var $value = $(this).find(':selected').val();
//     document.execCommand( $(this).data('func'), false, $value);
//   });

//   if(typeof(Storage) !== "undefined") {

//   $('.editor').keypress(function(){
//     $(this).find('.saved').detach();
//   });
//     $('.editor').html(localStorage.getItem("wysiwyg")) ;
    
//     $('button[data-func="save"]').click(function(){
//       $content = $('.editor').html();
//       localStorage.setItem("wysiwyg", $content);
//       $('.editor').append('<span class="saved"><i class="fa fa-check"></i></span>').fadeIn(function(){
//         $(this).find('.saved').fadeOut(500);
//       });
//     });
    
//     $('button[data-func="clear"]').click(function(){
//       $('.editor').html('');
//       localStorage.removeItem("wysiwyg");
//     });
    
    
//   } 

//   let isAuth = false;
//   async function changeAuthView () {
//       if (!getCookie('authorization')) {
//         console.log("no auth")
//         window.location.href = '/login'
//         return
//       }
//         else{
//           document.getElementById('exitplace').innerHTML = `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`
//          // document.getElementById('exitplace').innerHTML += `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`
//         }
//       await fetchPost('/login/check', {}, true)
//         .then(login => {
//           isAuth = true
//         })
//         .catch(_ => {
//           isAuth = false
//           setCookie('authorization', "")
//           window.location.href = '/login'
//         })
//     }
//     window.UserLogout = () => {
//       deleteCookie("authorization")
//       document.location.reload()
//     }
    
//     changeAuthView()