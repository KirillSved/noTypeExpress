
let isAuth = false;
let isShow = false;
async function changeAuthView () {
    if (!getCookie('authorization')) {
      console.log("no auth")
      document.body.innerHTML= ``
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
  
  let Grole;
  changeAuthView()
  showForAdmin()
  updateTable()
  updateUserTable()
  uploadFile()
  async function showForAdmin(){
    await fetchPost('/fileEdit/getRole', {}, true)
      .then(role => {
        Grole = role
        if (role =="ADMIN" || role =="OPERATOR"){
        isShow = true
        let crMod = document.getElementById("addNewFile")
        
        crMod.classList.remove("visually-hidden")
        }
        if (role =="ADMIN"){
            let selectDfile=document.getElementById("fileorder")
            let optionC = `<option value="ADMIN">ADMIN</option>`
            selectDfile.innerHTML+=optionC
            }else{
        let UserListC = document.getElementById("UserListC")
        UserListC.classList.add("visually-hidden")
            }
     
      })
      .catch(_ => {
        isShow = false
        //console.log(data.role)
      })

    
  }
  function createUserModal (id,name){
    let modalCon = document.getElementById("UserEditdiv")
    let modal_content = document.createElement("div")
    modal_content.onclick = function (event) {
      event.preventDefault();
    };
    // modalCon = ``
    modalCon.innerHTML =``
    modal_content.innerHTML =`
    <h3 class="ms-1">Изменить возможности пользователя </h3>
    <form class="row gy-2 gx-4 align-items-center" id="formEl">
        <div class="col-auto">
            <label class="visually-hidden" for="autoSizingInputGroup">FileName</label>
            <div class="input-group">
              <div class="input-group-text">${name}</div>
             
            </div>
        </div>
    
        <div class="col-auto">
          <label class="visually-hidden" for="autoSizingSelect">Preference</label>
          <select class="form-select" id="userorder">
            <option selected value="USER">USER</option>
            <option value="OPERATOR">OPERATOR</option>
            
          </select>
        </div>
       
        <div class="col-auto">
          <button type="submit" class="btn btn-primary" id="updateUserbtn">Submit</button>
        </div>
      </form>
</div>`
modalCon.append(modal_content)
let selectUser=document.getElementById("userorder")
if (Grole =="SUPERADMIN"){
    let optionC = `<option value="ADMIN">ADMIN</option>`
    selectUser.innerHTML+=optionC
    }else{


    }
let updateUserbtn =document.getElementById('updateUserbtn')
updateUserbtn.onclick = async (event) =>{

   

            updateUser(id,selectUser.value)
}
  }
  function createModal (data,name,id){

        var buttonId = "one"//$(this).attr('id');
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('#modal-container').addClass('modal-active');
     
    let modalCon = document.getElementById("modCon")
    let modal_content = document.createElement("div")
    modal_content.onclick = function (event) {
      event.preventDefault();
    };
    modalCon.innerHTML = ``;
    localStorage.removeItem("wysiwyg");
    let buttonStr;
    if(Grole=="ADMIN" || Grole == "OPERATOR"){
    buttonStr = ` <button data-func="clear" type="button">clear</button>
    <button data-func="save" type="button">save</button>`
    }else{
        buttonStr = ``
    }
    
    modal_content.innerHTML =`

    <div class="newPost">
        <h3>Операции с  файлом</h3>
        <input type="text" value="${name}" placeholder="Enter title here">
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
        <div class="editor" contenteditable id="databox"></div>
        <div class="buttons">
          <button data-func="hide" type="button">Ok</button>
         ${buttonStr}
        </div>
      </div>`
      modalCon.append(modal_content)
      if (data instanceof Blob){
        
        const img = createImage(URL.createObjectURL(data));
        function createImage(src) {
            const img = document.createElement("img");
            img.style="width: 650px; "
            img.src = src;
            return img;
          }
        // let databox = document.createElement("div")
        
        // databox.append(img)
        // document.getElementById("databox").append(databox)
         modal_content.append(img);
        //$('.editor').appendChild(img)
        document.querySelector('.editor').append(img)
        document.querySelector('.buttons').classList.add("visually-hidden")
        localStorage.removeItem("wysiwyg");

    }else{
        $('.newPost button[data-func]').click(function(){
            document.execCommand( $(this).data('func'), false 	);
          });
        
          $('.newPost select[data-func]').change(function(){
            var $value = $(this).find(':selected').val();
            document.execCommand( $(this).data('func'), false, $value);
          });
        localStorage.setItem("wysiwyg", data.toString());
        $('.editor').keypress(function(){
            $(this).find('.saved').detach();
          });
            $('.editor').text(localStorage.getItem("wysiwyg")) ;
            
            $('button[data-func="save"]').click(function(){
              $content = $('.editor').text();
              localStorage.setItem("wysiwyg", $content);
              $('.editor').append('<span class="saved"><i class="fa fa-check"></i></span>').fadeIn(function(){
                $(this).find('.saved').fadeOut(500);
              });
              updateFile(id,$content)
            });
            
            $('button[data-func="clear"]').click(function(){
              $('.editor').html('');
              localStorage.removeItem("wysiwyg");
            });
            
    }

  let i = 0;
  $('.modal').click(function(event){
    event.preventDefault()
    i=1
  })

  $('.modal-background').click(function(){
    if(i==0){
    $('#modal-container').addClass('out');
    $('#modal-container').removeClass('modal-active');
    }else{
        i = 0
    }
  })
  
  $('button[data-func="hide"]').click(function(){
    $('#modal-container').addClass('out');
    $('#modal-container').removeClass('modal-active');
  });

    //   localStorage.setItem("wysiwyg", data.toString());
      $('.newPost button[data-func]').click(function(){
        document.execCommand( $(this).data('func'), false 	);
      });
    
      $('.newPost select[data-func]').change(function(){
        var $value = $(this).find(':selected').val();
        document.execCommand( $(this).data('func'), false, $value);
      });
    
      //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
    
    
        
      } 
  //} 
  
  function addEditUModal (id,name){
    fetch(`/fileEdit/getFile/${id}`)
    .then(response => {
        console.log(response.headers.get('content-type'))
        console.log(response.headers.toString())
        if (response.headers.get('content-type').startsWith('image/')) {
           // return response.blob();
            return response.blob();
          } else {
            return response.text()
          }
        }).then(data => {
          createModal(data,name,id);
        }).catch(err => {
      console.log(err);
    });

  }
  function updateUserTable() {
    fetch("/fileEdit/getUsers").then(response => {
      return response.json();
    }).then(data => {
      users = data;
      let table = document.getElementById("userTable");
      table.classList = "table table-fixed bg-light";
      table.innerHTML = "";
  
      // create table header
      let headerRow = document.createElement("tr");
      let header1 = document.createElement("th");
      header1.innerText = "Username";
    //   let header2 = document.createElement("th");
    //   header2.innerText = "Password Type";
      let header3 = document.createElement("th");
      header3.innerText = "Role";
      let header4 = document.createElement("th");
      header4.innerText = "Edit";
      let header5 = document.createElement("th");
      header5.innerText = "Delete";
      headerRow.appendChild(header1);
      //headerRow.appendChild(header2);
      headerRow.appendChild(header3);
      headerRow.appendChild(header4);
      headerRow.appendChild(header5);
      table.appendChild(headerRow);
  
      // create table rows
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.innerText = user.login;
        let cell2 = document.createElement("td");
        //cell2.innerText = user.password_type;
        let cell3 = document.createElement("td");
        cell3.innerText = user.role;
        let cell4 = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
             createUserModal(user.id_user,user.login);
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
          deleteUser(user.id_user,user.login);
        };
        cell5.appendChild(deleteButton);
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);
        if(user.role != "ADMIN"){
        row.appendChild(cell4);
        row.appendChild(cell5);
    }
        table.appendChild(row);
      }
  
    }).catch(err => {
      console.log(err);
    });
  }
   function updateTable() {
    //changeAuthView()
    fetch('/fileEdit/getFiles')
    .then(response => {
       // response = Object.assign({}, response); // {0:"a", 1:"b", 2:"c"}
      return response.json();
    }).then(data => {
      files = data;
      let table = document.getElementById("fileTable");
      table.classList = "table table-fixed bg-light";
      table.innerHTML = "";
    //if(role=="USER"){
      // create table header
      let headerRow = document.createElement("tr");
      let header1 = document.createElement("th");
      header1.classList = "col-xs-2";
      header1.innerText = "Filename";
      let header2 = document.createElement("th");
      header2.classList = "col-xs-3";
      header2.innerText = "Path";
      let header3 = document.createElement("th");
      header1.classList = "col-xs-2";
      header3.innerText = "Order";
      let header4 = document.createElement("th");
      header1.classList = "col-xs-2";
      header4.innerText = "Edit";
      let header5 = document.createElement("th");
      header1.classList = "col-xs-2";
      header5.innerText = "delete";
      let header6 = document.createElement("th");
      header6.classList = "col-xs-2";
      header6.innerText = "download";
      headerRow.appendChild(header1);
      //headerRow.appendChild(header2);
      headerRow.appendChild(header3);
      headerRow.appendChild(header4);
      if(Grole=="ADMIN"||Grole=="OPERATOR"){
        headerRow.appendChild(header5);
      }
      headerRow.appendChild(header6);
      table.appendChild(headerRow);
  
      // create table rows
      for (let i = 0; i < files.length; i++) {
        let file =  files[i];
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.classList = "col-xs-3";
        let name =file.file_path.split("Data/")
        cell1.innerText = name[1];
        let cell2 = document.createElement("td");
        cell2.classList = "col-xs-3";
        cell2.innerText = file.file_path;
        let cell3 = document.createElement("td");
        cell3.classList = "col-xs-3";
        cell3.innerText = file.order;
        let cell4 = document.createElement("td");
        cell4.classList = "col-xs-3";
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
          addEditUModal(file.id,name[1]);
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        cell5.classList = "col-xs-3";
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.onclick = function () {
          deleteFile(file.id,file.file_path);
        };
        let cell6 = document.createElement("td");
        cell5.classList = "col-xs-3";
        let dowloadButton = document.createElement("button");
        dowloadButton.innerText = "download";
        dowloadButton.setAttribute("onclick",`window.location.href = '/fileEdit/download/${file.id}'`)
        
        cell6.appendChild(dowloadButton);
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        if(Grole=="ADMIN"||Grole=="OPERATOR"){
            cell5.appendChild(deleteButton);
            row.appendChild(cell5);

        }
        row.appendChild(cell6);
        table.appendChild(row);
      }
  
    }).catch(err => {
      console.log(err);
    });
  }
 
  
  async function deleteUser(id,login){ 
    
    const rez = await fetchPost(
        `fileEdit/deleteUser/${id}`,
        { login },
        true
      )
    .then(response => {
        console.log(response)
        return response
        }).then(data => {
             updateUserTable() 
            makeToast({
                header: "Успіх",
                body: data,
                type: "success",
                data_delay: 7000,
              });
        }).catch(err => {
            makeToast({
                header: "Denaid",
                body: err.message,
                type: "danger",
                data_delay: 7000,
              });
      console.log(err);
        })


  }

  async function addUser(){
   let  regCrBtn = document.createElement("regCrBtn")
    regCrBtn.addEventListener("click", () => {
        
        let regForm = document.createElement("form")
        regForm.classList =`row g-3`
        regForm.innerHTML=` <div class="col-md-6">
        <label for="inputEmail4" class="form-label">Email</label>
        <input type="email" class="form-control" id="inputEmail4">
      </div>
      <div class="col-md-6">
        <label for="inputPassword4" class="form-label">Password</label>
        <input type="password" class="form-control" id="inputPassword4">
      </div>
      <div class="col-12">
        <label for="inputAddress" class="form-label">Address</label>
        <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
      </div>
      <div class="col-12">
        <label for="inputAddress2" class="form-label">Address 2</label>
        <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor">
      </div>
      <div class="col-md-6">
        <label for="inputCity" class="form-label">City</label>
        <input type="text" class="form-control" id="inputCity">
      </div>
      <div class="col-md-4">
        <label for="inputState" class="form-label">State</label>
        <select id="inputState" class="form-select">
          <option selected>Choose...</option>
          <option>...</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="inputZip" class="form-label">Zip</label>
        <input type="text" class="form-control" id="inputZip">
      </div>
      <div class="col-12">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="gridCheck">
          <label class="form-check-label" for="gridCheck">
            Check me out
          </label>
        </div>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary" id="registerbtn">Create</button>
      </div>`
        let userEdd = document.getElementById("UserEditdiv");
        userEdd.innerHTML = ``;
        userEdd.append(regForm);
    
       
        const registerbtn = document.getElementById("registerbtn");
        if (registerbtn) {
          registerbtn.onclick = async (event) => {
            event.preventDefault();
            const login = document.getElementById("crlogin").value;
            const password = document.getElementById("crpwd").value;
            const confpwd = document.getElementById("confpwd").value;
            const userfirstName = document.getElementById("userName").value;
            const userSername = document.getElementById("userSername").value;
            const password_type = document.getElementById("password_type").value;
            let userName = `${userfirstName} ${userSername}`;
    
            // let numRuleRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}\$")
            // let spRegex =new RegExp("^(?=.*[A-Za-z])(?.*\\d)(?=.*[@\$!%*#?&])[A-Za-z\\d\$!%*#?&]{8,}\$")
    
            if (login != "" && password != "" && password == confpwd) {
              if (
                (password_type == "strong" && checkPassType(password)) ||
                password_type == "simple"
              ) {
                const rez = await fetchPost(
                  "login/register",
                  { login, password, userName },
                  true
                );
                makeToast({
                  header: "Успіх",
                  body: rez,
                  type: "success",
                  data_delay: 7000,
                });
              } else {
                makeToast({
                  header: "Denaid",
                  body: `password does not matches password type ${password_type}`,
                  type: "danger",
                  data_delay: 7000,
                });
              }
            } else {
              makeToast({
                header: "Denaid",
                body: "Empy field login",
                type: "danger",
                data_delay: 7000,
              });
            }
          };
        }
      });

  }

  async function uploadFile(){
    // document.body.onsubmit((event)=>{
    //     event.preventDefault();
    // })
    const uploadbtn = document.getElementById("uploadbtn");
    uploadbtn.onclick= async(event)=>{
        event.preventDefault();
        const fileInput = document.getElementById('upload-file');
        const fileOrder = document.getElementById('fileorder')
        
  // Create a FormData object and append the file to it
  const formData = new FormData();
  formData.append(fileOrder.value, fileInput.files[0]);

  try {
    // Send the file to the server using fetch
    const response = await fetch('fileEdit/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      // If the response is ok, close the modal window
      const bbody = await response.text();
      makeToast({
        header: "Успіх",
        body: bbody,
        type: "success",
        data_delay: 7000,
      });
      updateTable()
      fileInput.value = ``;
    } else {
      // If the response is not ok, show an error message
      const error = await response.text();
      
    }
  } catch (error) {
    // If an error occurs, show an error message
    makeToast({
        header: "Denaid",
        body: error.message,
        type: "danger",
        data_delay: 7000,
      });
    console.log(`Error uploading file: ${error.message}`);
  }
    }
    
  }

  async function deleteFile(id,name){
    // document.body.onsubmit((event)=>{
    //     event.preventDefault();
    // })
    
      const rez = await fetchPost(
        `fileEdit/delete/${id}`,
        { name },
        true
      )
    .then(response => {
        console.log(response)
        return response
        }).then(data => {
             updateTable() 
            makeToast({
                header: "Успіх",
                body: data,
                type: "success",
                data_delay: 7000,
              });
        }).catch(err => {
            makeToast({
                header: "Denaid",
                body: err.message,
                type: "danger",
                data_delay: 7000,
              });
      console.log(err);
        })
    
  }
  async function updateFile(id,data){
    const rez = await fetchPost(
        `fileEdit/updateFile/${id}`,
        { data },
        true
      )
    .then(response => {
        console.log(response)
        return response
        }).then(data => {
             updateTable() 
            makeToast({
                header: "Успіх",
                body: data,
                type: "success",
                data_delay: 7000,
              });
        }).catch(err => {
            makeToast({
                header: "Denaid",
                body: err.message,
                type: "danger",
                data_delay: 7000,
              });
      console.log(err);
        })
    
  }
  async function updateUser(id,data){
    const rez = await fetchPost(
        `fileEdit/updateUser/${id}`,
        { data },
        true
      )
    .then(response => {
        console.log(response)
        return response
        }).then(data => {
             updateUserTable() 
            makeToast({
                header: "Успіх",
                body: data,
                type: "success",
                data_delay: 7000,
              });
        }).catch(err => {
            makeToast({
                header: "Denaid",
                body: err.message,
                type: "danger",
                data_delay: 7000,
              });
      console.log(err);
        })
    
  }
  async function downloadFile(id,name){
    // document.body.onsubmit((event)=>{
    //     event.preventDefault();
    // })
    fetch(`/fileEdit/download/${id}`)
    .then(response => {
        console.log(response)
        return response.text()
        }).then(data => {
            makeToast({
                header: "Успіх",
                body: data,
                type: "sucsess",
                data_delay: 7000,
              });
        }).catch(err => {
            makeToast({
                header: "Denaid",
                body: err.message,
                type: "danger",
                data_delay: 7000,
              });
      console.log(err);
        })
    
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