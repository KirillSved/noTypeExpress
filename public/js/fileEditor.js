
let isAuth = false;
let isShow = false;
async function changeAuthView() {
  if (!getCookie("authorization")) {
    console.log("no auth");
    document.body.innerHTML = ``;
    window.location.href = "/login";
    return;
  } else {
    document.getElementById(
      "exitplace"
    ).innerHTML = `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`;
    let wMod =  await fetchPost("/fileEdit/getMode", {}, true)
    if (wMod == "dig") {
      document.getElementById(
        "modcheck"
      ).innerHTML = `  <section title=".slideThree">
          <!-- .slideThree -->
          <div class="slideThree">  
            <input type="checkbox" value="dig" id="slideThree" name="check" checked />
            <label for="slideThree"></label>
          </div>
          <!-- end .slideThree -->
        </section>`;
    } else {
      document.getElementById(
        "modcheck"
      ).innerHTML = `  <section title=".slideThree">
          <!-- .slideThree -->
          <div class="slideThree">  
            <input type="checkbox" value="dig" id="slideThree" name="check" />
            <label for="slideThree"></label>
          </div>
          <!-- end .slideThree -->
        </section>`;
    }

    // document.getElementById('exitplace').innerHTML += `<button class="btn btn-danger m-3" id="Exit" onclick="UserLogout()" type="button">Вийти</button>`
  }
  await fetchPost("/login/check", {}, true)
    .then((login) => {
      isAuth = true;
    })
    .catch((_) => {
      isAuth = false;
      setCookie("authorization", "");
      window.location.href = "/login";
    });
}

window.UserLogout = () => {
  deleteCookie("authorization");
  document.location.reload();
};
let workmod;
let Grole;
changeAuthView();
workMod();

async function workMod() {
  await fetchPost("/fileEdit/getMode", {}, true)
    .then((res) => {
      workmod = res;

      if (res === "dig") {
        showForDigAdmin();
        updateDigTable();
        updatedigUserTable();
        uploadDigFile();
      } else if (res === "man") {
        showForAdmin();
        updateTable();
        updateUserTable();
        uploadFile();
      }

      let modCheck = document.getElementById("slideThree");
      modCheck.onclick = async function (event) {
        let mode = "";
        if (modCheck.checked == false && workmod == "dig") {
          workmod = "man";
        } else {
          workmod = "dig";
        }
        await fetchPost("/fileEdit/setNewMode", { workmod }, true)
          .then((res) => {
            document.location.reload();
          })
          .catch((_) => {
            //console.log(data.role)
          });
      };
    })
    .catch((_) => {
      //console.log(data.role)
    });
  // showForAdmin()
  // updateTable()
  // updateUserTable()
  // uploadFile()

  return workmod;
}
async function setFileOrder(id, path, id_user) {
  let readOrder = document.getElementById(`readBox-${id}`);
  let writeOrder = document.getElementById(`writeBox-${id}`);
  let executeOrder = document.getElementById(`executeBox-${id}`);

  if (readOrder.checked == true && readOrder.value == "read") {
    readOrder = 1;
  } else {
    readOrder = 0;
  }
  if (writeOrder.checked == true && writeOrder.value == "write") {
    writeOrder = 1;
    readOrder = 1
  } else {
    writeOrder = 0;
  }
  if (executeOrder.checked == true && executeOrder.value == "execute") {
    executeOrder = 1;
  } else {
    executeOrder = 0;
  }
  //[readOrder,writeOrder,executeOrder] = [0,0,0]
  let access_time_from = document.getElementById("timefrom").value;
  let access_time_to = document.getElementById("timeto").value;
  let newPermissions = {
    read: readOrder,
    write: writeOrder,
    execute: executeOrder,
    access_time_to,
    access_time_from,
  };

  // fileId, owner, userId, newPerissions
  console.log({ id, id_user, newPermissions });
  await fetchPost(
    `/fileEdit/setOrder/${id}`,
    { id, id_user, newPermissions },
    true
  )
    .then(async (res) => {
      //todo toast
      const bbody =  res
        makeToast({
          header: "Успіх",
          body: bbody,
          type: "success",
          data_delay: 7000,

        })
        updateDigTable()
      console.log(res);
    })
    .catch((err) => {
      makeToast({
        header: "fail",
        body: err,
        type: "danger",
        data_delay: 7000,

      })
    });
}

async function setManFileOrder(id, path, id_user) {
  
  //[readOrder,writeOrder,executeOrder] = [0,0,0]
  let access_time_from = document.getElementById("timefrom").value;
  let access_time_to = document.getElementById("timeto").value;
  let selectFile = document.getElementById("fileManorder");
  // if (Grole == "SUPERADMIN") {
    let optionC = `<option value="ADMIN">ADMIN</option>`;
  let data ={
    id,
    access_time_from,
    access_time_to,
    order :selectFile.value
  }
 
  // fileId, owner, userId, newPerissions

  await fetchPost(
    `fileEdit/updateManFile/${id}`,
    { id, id_user, data },
    true
  )
    .then(async (res) => {
      //todo toast
      const bbody =  res
        makeToast({
          header: "Успіх",
          body: bbody,
          type: "success",
          data_delay: 7000,

        })
        updateTable()
      console.log(res);
    })
    .catch((err) => {
      makeToast({
        header: "fail",
        body: err,
        type: "danger",
        data_delay: 7000,

      })
    });
}


function createPerdigUserModalMod(data, name, user_id, file_id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }
  files = data;
  userFiles = [];
  if (data.files && data.userFiles) {
    files = data.files;
    userFiles = data.userFiles;
  }

  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";
  //if(role=="USER"){
  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.classList = "col-xs";
  header1.innerText = "Filename";
  let header2 = document.createElement("th");
  header2.classList = "col";
  header2.innerText = "Path";
  let header3 = document.createElement("th");
  header3.classList = "col";
  header3.innerText = "Read";
  let header4 = document.createElement("th");
  header4.classList = "col-xs-3";
  header4.innerText = "Write";

  let header5 = document.createElement("th");
  header5.classList = "col";
  header5.innerText = "Execute";
  let header6 = document.createElement("th");
  header6.classList = "col";
  header6.innerText = "accessTimefrom";
  let header7 = document.createElement("th");
  header7.classList = "col";
  header7.innerText = "accessTimeto";
  let header8 = document.createElement("th");
  header8.classList = "col";
  header8.innerText = "Set";

  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);

  headerRow.appendChild(header5);

  headerRow.appendChild(header6);

  headerRow.appendChild(header7);

  headerRow.appendChild(header8);

  table.appendChild(headerRow);

  // create table rows
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let row = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.classList = "col align-self-center";
    let name = file.file_path.split("Data/");
    cell1.innerText = name[1];
    let cell2 = document.createElement("td");
    cell2.classList = "col-xs";
    cell2.innerText = file.file_path;
    let cell3 = document.createElement("td");
    cell3.classList = "col align-self-center";
    if (file.permission.read == 1) {
      cell3.innerHTML = `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" name="read" value="read" id="readBox-${file.id}" checked style="
      margin-left: -18px;">
      
    </div>`;
    } else {
      cell3.innerHTML = `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" name="read" value="read" id="readBox-${file.id}" style="
      margin-left: -18px;" >
    <label class="form-check-label" for="readBox-${file.id}">
      
    </div>`;
    }

    // let writeCheck = document.createElement("div")
    // writeCheck.classList="form-check"
    // let writeCheckBox = document.createElement("input")
    // writeCheckBox.classList = `form-check-input`
    // writeCheckBox.setAttribute("type","checkbox");
    //writeCheckBox.setAttribute("checked","");
    //writeCheckBox.onclick = function (event) {
    //  writeCheckBox.setAttribute("checked","");
    //   writeCheckBox.removeAttribute("checked")
    //console.log(writeCheckBox.checked)

    //   i= 0

    //};
    //writeCheckBox.setAttribute("checked","false");
    //writeCheck.append(writeCheckBox)
    //   `
    //   <input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" checked>

    // `;
    // cell3.appendChild(writeCheck)
    let cell4 = document.createElement("td");
    cell4.classList = "col align-self-center";
    if (file.permission.write == 1) {
      cell4.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" name="write" value="write" id="writeBox-${file.id}" checked style="
    margin-left: -10px;
" >
   
  </div>`;
    } else {
      cell4.innerHTML = `<div class="form-check">
      <input class="form-check-input" type="checkbox" name="write" value="write" id="writeBox-${file.id}" disabled style="
      margin-left: -10px;
  " >
     
    </div>`;
    }
    // innerText = "Edit";
    // editButton.onclick = function () {
    //   addEditUModal(file.id,name[1]);
    // };
    // cell4.appendChild();
    let cell5 = document.createElement("td");
    cell5.classList = "col align-self-center";
    if (file.permission.execute == 1) {
      cell5.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="execute" id="executeBox-${file.id}" checked  style="
    margin-left: -10px;">
    
  </div>`;
    } else {
      cell5.innerHTML = `<div class="form-check">
      <input class="form-check-input" type="checkbox" value="execute" id="executeBox-${file.id}" disabled  style="
      margin-left: -10px;">
      
    </div>`;
    }
    let cell6 = document.createElement("td");
    cell6.classList = "col align-self-center";
    cell6.innerHTML = `<div class="cs-form">
  <input type="time" class="form-control" id="timefrom" value="${file.permission.access_time_from}" />
  </div>`;
    let cell7 = document.createElement("td");
    cell7.classList = "col align-self-center";
    cell7.innerHTML = `<div class="cs-form">
<input type="time" class="form-control" id="timeto" value="${file.permission.access_time_to}" />
</div>`;
    let cell8 = document.createElement("td");
    cell8.classList = "col";
    let filePerbtn = document.createElement("button");
    filePerbtn.innerText = "set";
    filePerbtn.onclick = function () {
      setFileOrder(file.id, file.file_path, user_id);
    };
    // let cell6 = document.createElement("td");
    // cell5.classList = "col-xs-1";
    // let dowloadButton = document.createElement("button");
    // dowloadButton.innerText = "download";
    // dowloadButton.setAttribute("onclick",`window.location.href = '/fileEdit/download/${file.id}'`)

    // cell6.appendChild(dowloadButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    //if(Grole=="ADMIN"||Grole=="OPERATOR"){
    cell8.appendChild(filePerbtn);
    row.appendChild(cell5);

    // }
    row.appendChild(cell6);
    row.appendChild(cell7);
    row.appendChild(cell8);
    table.appendChild(row);
  }

  modalCon.append(table);
  let backBtn = document.createElement("div");
  backBtn.innerHTML = `  <div class="newPost"> <div class="buttons">
<button data-func="hide" type="button">Ok</button></div> </div>`;
  modalCon.appendChild(backBtn);
  

  let i = 0;
  $(".modal").click(function (event) {
    // event.preventDefault()
    i = 1;
  });
  $("#readBox").click(function (event) {
    console.log(this.value);
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}

function createPerdigUserModal(data, name, file_id, user_id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  $(".modal").attr("style", "padding: 20px");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }
  files = data;
  userFiles = [];
 
  if (data.files && data.userFiles) {
    files = data.files;
    userFiles = data.userFiles; 
    if(file_id){
      files = files.filter((file) => {
       return file.id === file_id      
    })
  }
  }

  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";
  //if(role=="USER"){
  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.classList = "col-xs";
  header1.innerText = "Filename";
  let header2 = document.createElement("th");
  header2.classList = "col";
  header2.innerText = "Path";
  let header3 = document.createElement("th");
  header3.classList = "col";
  header3.innerText = "Read";
  let header4 = document.createElement("th");
  header4.classList = "col-xs-3";
  header4.innerText = "Write";

  let header5 = document.createElement("th");
  header5.classList = "col";
  header5.innerText = "Execute";
  let header6 = document.createElement("th");
  header6.classList = "col";
  header6.innerText = "accessTimefrom";
  let header7 = document.createElement("th");
  header7.classList = "col";
  header7.innerText = "accessTimeto";
  let header8 = document.createElement("th");
  header8.classList = "col";
  header8.innerText = "Set";

  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);

  headerRow.appendChild(header5);

  headerRow.appendChild(header6);

  headerRow.appendChild(header7);

  headerRow.appendChild(header8);

  table.appendChild(headerRow);

  // create table rows
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let row = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.classList = "col";
    let name = file.file_path.split("Data/");
    cell1.innerText = name[1];
    let cell2 = document.createElement("td");
    cell2.classList = "col-xs-5";
    cell2.innerText = file.file_path;
    let cell3 = document.createElement("td");
    cell3.classList = "col";
    if (file.permission.read == 1) {
    cell3.innerHTML = `<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" name="read" value="read" id="readBox-${file.id}">
    
  </div>`;
    }else{
      cell3.innerHTML = `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" name="read" value="read" disabled id="readBox-${file.id}">
      
    </div>`;
    }
    // let writeCheck = document.createElement("div")
    // writeCheck.classList="form-check"
    // let writeCheckBox = document.createElement("input")
    // writeCheckBox.classList = `form-check-input`
    // writeCheckBox.setAttribute("type","checkbox");
    //writeCheckBox.setAttribute("checked","");
    //writeCheckBox.onclick = function (event) {
    //  writeCheckBox.setAttribute("checked","");
    //   writeCheckBox.removeAttribute("checked")
    //console.log(writeCheckBox.checked)

    //   i= 0

    //};
    //writeCheckBox.setAttribute("checked","false");
    //writeCheck.append(writeCheckBox)
    //   `
    //   <input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" checked>

    // `;
    // cell3.appendChild(writeCheck)
    let cell4 = document.createElement("td");
    cell4.classList = "col-xs-6";
    if (file.permission.write == 1) {
    cell4.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" name="write" value="write" id="writeBox-${file.id}" >
    <label class="form-check-label" for="writeBox">
      
    </label>
  </div>`;
    }else{
      cell4.innerHTML = `<div class="form-check">
      <input class="form-check-input" type="checkbox" name="write" value="write" disabled id="writeBox-${file.id}" >
      <label class="form-check-label" for="writeBox">
        
      </label>
    </div>`;
    }
    // innerText = "Edit";
    // editButton.onclick = function () {
    //   addEditUModal(file.id,name[1]);
    // };
    // cell4.appendChild();
    let cell5 = document.createElement("td");
    cell5.classList = "col";
    if (file.permission.execute == 1) {
    cell5.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="execute" id="executeBox-${file.id}" >
    <label class="form-check-label" for="executeBox">
      
    </label>
  </div>`;
    }else{
      cell5.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="execute" disabled id="executeBox-${file.id}" >
    <label class="form-check-label" for="executeBox">
      
    </label>
  </div>`;
    }
    let cell6 = document.createElement("td");
    cell6.classList = "col";
    cell6.innerHTML = `<div class="cs-form">
  <input type="time" class="form-control" id="timefrom" value="00:00" />
  </div>`;
    let cell7 = document.createElement("td");
    cell7.classList = "col";
    cell7.innerHTML = `<div class="cs-form">
<input type="time" class="form-control" id="timeto" value="23:59" />
</div>`;
    let cell8 = document.createElement("td");
    cell8.classList = "col";
    let filePerbtn = document.createElement("button");
    filePerbtn.innerText = "set";
    filePerbtn.onclick = function () {
      setFileOrder(file.id, file.file_path, user_id);
    };
    // let cell6 = document.createElement("td");
    // cell5.classList = "col-xs-1";
    // let dowloadButton = document.createElement("button");
    // dowloadButton.innerText = "download";
    // dowloadButton.setAttribute("onclick",`window.location.href = '/fileEdit/download/${file.id}'`)

    // cell6.appendChild(dowloadButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    //if(Grole=="ADMIN"||Grole=="OPERATOR"){
    cell8.appendChild(filePerbtn);
    row.appendChild(cell5);

    // }
    row.appendChild(cell6);
    row.appendChild(cell7);
    row.appendChild(cell8);
    table.appendChild(row);
  }

  modalCon.append(table);
  let backBtn = document.createElement("div");
  backBtn.innerHTML = `  <div class="newPost"> <div class="buttons">
<button data-func="hide" type="button">Ok</button></div> </div>`;
  modalCon.appendChild(backBtn);
  // if (data instanceof Blob){

  //   const img = createImage(URL.createObjectURL(data));
  //   function createImage(src) {
  //       const img = document.createElement("img");
  //       img.style="width: 650px; "
  //       img.src = src;
  //       return img;
  //     }
  // let databox = document.createElement("div")

  // databox.append(img)
  // document.getElementById("databox").append(databox)
  //  modal_content.append(img);
  //$('.editor').appendChild(img)
  // document.querySelector('.editor').append(img)
  // document.querySelector('.buttons').classList.add("visually-hidden")
  // localStorage.removeItem("wysiwyg");

  // }else{

  let i = 0;
  $(".modal").click(function (event) {
    // event.preventDefault()
    i = 1;
  });
  $("#readBox").click(function (event) {
    console.log(this.value);
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}

function createdigUserModal(data, name, id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }
  if (data.files) files = data.files;

  files = data;
  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";
  //if(role=="USER"){
  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.classList = "col-xs-3";
  header1.innerText = "Filename";
  let header2 = document.createElement("th");
  header2.classList = "col";
  header2.innerText = "Path";
  let header3 = document.createElement("th");
  header1.classList = "col";
  header3.innerText = "Order";
  let header4 = document.createElement("th");
  header1.classList = "col";
  header4.innerText = "Edit";
  let header5 = document.createElement("th");
  header1.classList = "col";
  header5.innerText = "delete";
  let header6 = document.createElement("th");
  header6.classList = "col";
  header6.innerText = "download";
  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);

  headerRow.appendChild(header5);

  headerRow.appendChild(header6);
  table.appendChild(headerRow);

  // create table rows
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let row = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.classList = "col-xs-3";
    let name = file.file_path.split("Data/");
    cell1.innerText = name[1];
    let cell2 = document.createElement("td");
    cell2.classList = "col";
    cell2.innerText = file.file_path;
    let cell3 = document.createElement("td");
    cell3.classList = "col";
    cell3.innerText = file.permission.symbolic;
    let cell4 = document.createElement("td");
    cell4.classList = "col-xs-3";
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function () {
      addEditUModal(file.id, name[1]);
    };
    cell4.appendChild(editButton);
    let cell5 = document.createElement("td");
    cell5.classList = "col-xs-3";
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.onclick = function () {
      deleteFile(file.id, file.file_path);
    };
    let cell6 = document.createElement("td");
    cell5.classList = "col-xs-1";
    let dowloadButton = document.createElement("button");
    dowloadButton.innerText = "download";
    dowloadButton.setAttribute(
      "onclick",
      `window.location.href = '/fileEdit/download/${file.id}'`
    );

    cell6.appendChild(dowloadButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    //if(Grole=="ADMIN"||Grole=="OPERATOR"){
    cell5.appendChild(deleteButton);
    row.appendChild(cell5);

    // }
    row.appendChild(cell6);
    table.appendChild(row);
  }

  modalCon.append(table);
  // if (data instanceof Blob){

  //   const img = createImage(URL.createObjectURL(data));
  //   function createImage(src) {
  //       const img = document.createElement("img");
  //       img.style="width: 650px; "
  //       img.src = src;
  //       return img;
  //     }
  // let databox = document.createElement("div")

  // databox.append(img)
  // document.getElementById("databox").append(databox)
  //  modal_content.append(img);
  //$('.editor').appendChild(img)
  // document.querySelector('.editor').append(img)
  // document.querySelector('.buttons').classList.add("visually-hidden")
  // localStorage.removeItem("wysiwyg");

  // }else{

  let i = 0;
  $(".modal").click(function (event) {
    event.preventDefault();
    i = 1;
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}
//}
function addDigModal(id, name) {
  fetch(`/fileEdit/getUserFiles/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //createdigUserModal(data,name,id);
      //createPerdigUserModal(data,name,id)
      createPerdigUserModalMod(data, name, id);
    })
    .catch((err) => {
      console.log(err);
    });
}
// function addSetDigModal (file_id,name,user_id){
//   fetch(`/fileEdit/getAllFilesToSet/${id}`)
//   .then(response => {

//           return response.json()

//       }).then(data => {
//         createPerdigUserModal(data,name,file_id,user_id);
//       }).catch(err => {
//     console.log(err);
//   });

// }
async function addSetDigModal(user_id, name, file_id) {
  await fetchPost("/fileEdit/getAllFilesToSet", { file_id, user_id }, true)
    .then((response) => {
      return response;
    })
    .then((data) => {
      createPerdigUserModal(data, name, file_id, user_id);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createPerUserModal(data, name, file_id, user_id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  $(".modal").attr("style", "padding: 20px");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }
  files = data;
  userFiles = [];
 
  if (data.files && data.userFiles) {
    files = data.files;
    userFiles = data.userFiles; 
    if(file_id){
      files = files.filter((file) => {
       return file.id === file_id      
    })
  }
  }

  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";
  //if(role=="USER"){
  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.classList = "col-xs";
  header1.innerText = "Filename";
  let header2 = document.createElement("th");
  header2.classList = "col";
  header2.innerText = "Path";
  let header3 = document.createElement("th");
  header3.classList = "col";
  header3.innerText = "Read";
  let header4 = document.createElement("th");
  header4.classList = "col-xs-3";
  header4.innerText = "Write";

  let header5 = document.createElement("th");
  header5.classList = "col";
  header5.innerText = "Execute";
  let header6 = document.createElement("th");
  header6.classList = "col";
  header6.innerText = "accessTimefrom";
  let header7 = document.createElement("th");
  header7.classList = "col";
  header7.innerText = "accessTimeto";
  let header8 = document.createElement("th");
  header8.classList = "col";
  header8.innerText = "Set";

  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);

  headerRow.appendChild(header5);

  headerRow.appendChild(header6);

  headerRow.appendChild(header7);

  headerRow.appendChild(header8);

  table.appendChild(headerRow);

  // create table rows
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let row = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.classList = "col";
    let name = file.file_path.split("Data/");
    cell1.innerText = name[1];
    let cell2 = document.createElement("td");
    cell2.classList = "col-xs-5";
    cell2.innerText = file.file_path;
    let cell3 = document.createElement("td");
    cell3.classList = "col";
    if (file.permission.read == 1) {
    cell3.innerHTML = `<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" name="read" value="read" id="readBox-${file.id}">
    
  </div>`;
    }else{
      cell3.innerHTML = `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" name="read" value="read" disabled id="readBox-${file.id}">
      
    </div>`;
    }
    // let writeCheck = document.createElement("div")
    // writeCheck.classList="form-check"
    // let writeCheckBox = document.createElement("input")
    // writeCheckBox.classList = `form-check-input`
    // writeCheckBox.setAttribute("type","checkbox");
    //writeCheckBox.setAttribute("checked","");
    //writeCheckBox.onclick = function (event) {
    //  writeCheckBox.setAttribute("checked","");
    //   writeCheckBox.removeAttribute("checked")
    //console.log(writeCheckBox.checked)

    //   i= 0

    //};
    //writeCheckBox.setAttribute("checked","false");
    //writeCheck.append(writeCheckBox)
    //   `
    //   <input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" checked>

    // `;
    // cell3.appendChild(writeCheck)
    let cell4 = document.createElement("td");
    cell4.classList = "col-xs-6";
    if (file.permission.write == 1) {
    cell4.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" name="write" value="write" id="writeBox-${file.id}" >
    <label class="form-check-label" for="writeBox">
      
    </label>
  </div>`;
    }else{
      cell4.innerHTML = `<div class="form-check">
      <input class="form-check-input" type="checkbox" name="write" value="write" disabled id="writeBox-${file.id}" >
      <label class="form-check-label" for="writeBox">
        
      </label>
    </div>`;
    }
    // innerText = "Edit";
    // editButton.onclick = function () {
    //   addEditUModal(file.id,name[1]);
    // };
    // cell4.appendChild();
    let cell5 = document.createElement("td");
    cell5.classList = "col";
    if (file.permission.execute == 1) {
    cell5.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="execute" id="executeBox-${file.id}" >
    <label class="form-check-label" for="executeBox">
      
    </label>
  </div>`;
    }else{
      cell5.innerHTML = `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="execute" disabled id="executeBox-${file.id}" >
    <label class="form-check-label" for="executeBox">
      
    </label>
  </div>`;
    }
    let cell6 = document.createElement("td");
    cell6.classList = "col";
    cell6.innerHTML = `<div class="cs-form">
  <input type="time" class="form-control" id="timefrom" value="00:00" />
  </div>`;
    let cell7 = document.createElement("td");
    cell7.classList = "col";
    cell7.innerHTML = `<div class="cs-form">
<input type="time" class="form-control" id="timeto" value="23:59" />
</div>`;
    let cell8 = document.createElement("td");
    cell8.classList = "col";
    let filePerbtn = document.createElement("button");
    filePerbtn.innerText = "set";
    filePerbtn.onclick = function () {
      setFileOrder(file.id, file.file_path, user_id);
    };
    // let cell6 = document.createElement("td");
    // cell5.classList = "col-xs-1";
    // let dowloadButton = document.createElement("button");
    // dowloadButton.innerText = "download";
    // dowloadButton.setAttribute("onclick",`window.location.href = '/fileEdit/download/${file.id}'`)

    // cell6.appendChild(dowloadButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    //if(Grole=="ADMIN"||Grole=="OPERATOR"){
    cell8.appendChild(filePerbtn);
    row.appendChild(cell5);

    // }
    row.appendChild(cell6);
    row.appendChild(cell7);
    row.appendChild(cell8);
    table.appendChild(row);
  }

  modalCon.append(table);
  let backBtn = document.createElement("div");
  backBtn.innerHTML = `  <div class="newPost"> <div class="buttons">
<button data-func="hide" type="button">Ok</button></div> </div>`;
  modalCon.appendChild(backBtn);
  // if (data instanceof Blob){

  //   const img = createImage(URL.createObjectURL(data));
  //   function createImage(src) {
  //       const img = document.createElement("img");
  //       img.style="width: 650px; "
  //       img.src = src;
  //       return img;
  //     }
  // let databox = document.createElement("div")

  // databox.append(img)
  // document.getElementById("databox").append(databox)
  //  modal_content.append(img);
  //$('.editor').appendChild(img)
  // document.querySelector('.editor').append(img)
  // document.querySelector('.buttons').classList.add("visually-hidden")
  // localStorage.removeItem("wysiwyg");

  // }else{

  let i = 0;
  $(".modal").click(function (event) {
    // event.preventDefault()
    i = 1;
  });
  $("#readBox").click(function (event) {
    console.log(this.value);
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}


function createManUserModal(data, name, file_id, user_id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  $(".modal").attr("style", "padding: 20px");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }
  files = data;
  userFiles = [];
 
  if (data.files && data.userFiles) {
    files = data.files;
    userFiles = data.userFiles; 
    if(file_id){
      files = files.filter((file) => {
       return file.id === file_id      
    })
  }
  }

  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";
  //if(role=="USER"){
  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.classList = "col-xs";
  header1.innerText = "Filename";
  let header2 = document.createElement("th");
  header2.classList = "col";
  header2.innerText = "Path";
  let header3 = document.createElement("th");
  header3.classList = "col";
  header3.innerText = "order";
 
  let header6 = document.createElement("th");
  header6.classList = "col";
  header6.innerText = "accessTimefrom";
  let header7 = document.createElement("th");
  header7.classList = "col";
  header7.innerText = "accessTimeto";
  let header8 = document.createElement("th");
  header8.classList = "col";
  header8.innerText = "Set";

  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  // headerRow.appendChild(header4);

  // headerRow.appendChild(header5);

  headerRow.appendChild(header6);

  headerRow.appendChild(header7);

  headerRow.appendChild(header8);

  table.appendChild(headerRow);

  // create table rows
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let row = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.classList = "col";
    let name = file.file_path.split("Data/");
    cell1.innerText = name[1];
    let cell2 = document.createElement("td");
    cell2.classList = "col";
    cell2.innerText = file.file_path;
    let cell3 = document.createElement("td");
    cell3.classList = "col";
    
      cell3.innerHTML = `  
      <select class="form-select" id="fileManorder" style="
      width: 155px;
  ">
        <option selected value="USER">USER</option>
        <option value="OPERATOR">OPERATOR</option>
        <option value="ADMIN">ADMIN</option> 
      </select>`;
    
    // let writeCheck = document.createElement("div")
    // writeCheck.classList="form-check"
    // let writeCheckBox = document.createElement("input")
    // writeCheckBox.classList = `form-check-input`
    // writeCheckBox.setAttribute("type","checkbox");
    //writeCheckBox.setAttribute("checked","");
    //writeCheckBox.onclick = function (event) {
    //  writeCheckBox.setAttribute("checked","");
    //   writeCheckBox.removeAttribute("checked")
    //console.log(writeCheckBox.checked)

    //   i= 0

    //};
    //writeCheckBox.setAttribute("checked","false");
    //writeCheck.append(writeCheckBox)
    //   `
    //   <input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" checked>

    // `;
    // cell3.appendChild(writeCheck)
    let cell4 = document.createElement("td");
    cell4.classList = "col-xs-6";
  
    // innerText = "Edit";
    // editButton.onclick = function () {
    //   addEditUModal(file.id,name[1]);
    // };
    // cell4.appendChild();
    let cell5 = document.createElement("td");
    cell5.classList = "col";
   
    let cell6 = document.createElement("td");
    cell6.classList = "col";
    cell6.innerHTML = `<div class="cs-form">
  <input type="time" class="form-control" id="timefrom" value="${file.access_time_from}" />
  </div>`;
    let cell7 = document.createElement("td");
    cell7.classList = "col";
    cell7.innerHTML = `<div class="cs-form">
    <input type="time" class="form-control" id="timeto" value="${file.access_time_to}" />
    </div>`;
    let cell8 = document.createElement("td");
    cell8.classList = "col";
    let filePerbtn = document.createElement("button");
    filePerbtn.innerText = "set";
    filePerbtn.onclick = function () {
      setManFileOrder(file.id, file.file_path, user_id);
    };
    // let cell6 = document.createElement("td");
    // cell5.classList = "col-xs-1";
    // let dowloadButton = document.createElement("button");
    // dowloadButton.innerText = "download";
    // dowloadButton.setAttribute("onclick",`window.location.href = '/fileEdit/download/${file.id}'`)

    // cell6.appendChild(dowloadButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);
    row.appendChild(cell3);
   // row.appendChild(cell4);
    //if(Grole=="ADMIN"||Grole=="OPERATOR"){
    cell8.appendChild(filePerbtn);
    //row.appendChild(cell5);

    // }
    row.appendChild(cell6);
    row.appendChild(cell7);
    row.appendChild(cell8);
    table.appendChild(row);
  }

  modalCon.append(table);
  let backBtn = document.createElement("div");
  backBtn.innerHTML = `  <div class="newPost"> <div class="buttons">
<button data-func="hide" type="button">Ok</button></div> </div>`;
  modalCon.appendChild(backBtn);
  // if (data instanceof Blob){

  //   const img = createImage(URL.createObjectURL(data));
  //   function createImage(src) {
  //       const img = document.createElement("img");
  //       img.style="width: 650px; "
  //       img.src = src;
  //       return img;
  //     }
  // let databox = document.createElement("div")

  // databox.append(img)
  // document.getElementById("databox").append(databox)
  //  modal_content.append(img);
  //$('.editor').appendChild(img)
  // document.querySelector('.editor').append(img)
  // document.querySelector('.buttons').classList.add("visually-hidden")
  // localStorage.removeItem("wysiwyg");

  // }else{

  let i = 0;
  $(".modal").click(function (event) {
    // event.preventDefault()
    i = 1;
  });
  $("#readBox").click(function (event) {
    console.log(this.value);
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });
  let access_time_from = document.getElementById("timefrom")
  let access_time_to = document.getElementById("timeto")
  let selectFile = document.getElementById("fileManorder");
  selectFile.onchange =(event)=>{
    if(event.target.value=="ADMIN" && Grole == "ADMIN"){
    
   access_time_from.setAttribute("disabled","")
   access_time_to.setAttribute("disabled","")
}else{
    
  access_time_from.removeAttribute("disabled")
  access_time_to.removeAttribute("disabled")
}
  }


  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}

async function addSetModal(user_id, name, file_id) {
  await fetchPost("/fileEdit/getFilePer", { file_id, user_id }, true)
    .then((response) => {
      return response;
    })
    .then((data) => {
      createManUserModal(data, name, file_id, user_id);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  
function addUploadSetDigModal(id, name) {
  fetch(`/fileEdit/getUsers/`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      createUploadPerModal(data, name, id);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createUploadPerModal(data, name, id) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;

  // if(Grole=="ADMIN" || Grole == "OPERATOR"){
  // buttonStr = ` <button data-func="clear" type="button">clear</button>
  // <button data-func="save" type="button">save</button>`
  // }else{
  //   buttonStr = ``
  // }

  users = data;
  let table = document.createElement("table");
  table.classList = "table table-fixed bg-light";
  table.innerHTML = "";

  // create table header
  let headerRow = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.innerText = "Username";
  //   let header2 = document.createElement("th");
  //   header2.innerText = "Password Type";
  let header3 = document.createElement("th");
  header3.innerText = "setOrder";
  let header4 = document.createElement("th");
  header4.innerText = "Edit";
  let header5 = document.createElement("th");
  header5.innerText = "Delete";
  headerRow.appendChild(header1);
  //headerRow.appendChild(header2);
  headerRow.appendChild(header3);
  headerRow.appendChild(header4);
  //headerRow.appendChild(header5);
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
    let setPerbtn = document.createElement("button");
    setPerbtn.innerText = "setOrder";
    setPerbtn.onclick = async function () {
      //createUserModal(user.id_user,user.login);
      await addSetDigModal(user.id_user, user.login, id);
    };
    cell3.appendChild(setPerbtn);
    let cell4 = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function () {
      //createUserModal(user.id_user,user.login);
      addDigModal(user.id_user, user.login);
    };
    cell4.appendChild(editButton);
    let cell5 = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function () {
      deleteUser(user.id_user, user.login);
    };
    //cell5.appendChild(deleteButton);
    row.appendChild(cell1);
    //row.appendChild(cell2);

    if (user.role != "ADMIN") {
      row.appendChild(cell3);
      row.appendChild(cell4);
      row.appendChild(cell5);
    }
    table.appendChild(row);
  }

  modalCon.append(table);
  // if (data instanceof Blob){

  //   const img = createImage(URL.createObjectURL(data));
  //   function createImage(src) {
  //       const img = document.createElement("img");
  //       img.style="width: 650px; "
  //       img.src = src;
  //       return img;
  //     }
  // let databox = document.createElement("div")

  // databox.append(img)
  // document.getElementById("databox").append(databox)
  //  modal_content.append(img);
  //$('.editor').appendChild(img)
  // document.querySelector('.editor').append(img)
  // document.querySelector('.buttons').classList.add("visually-hidden")
  // localStorage.removeItem("wysiwyg");

  // }else{

  let i = 0;
  $(".modal").click(function (event) {
    // event.preventDefault()
    i = 1;
  });
  $("#readBox").click(function (event) {
    console.log(this.value);
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}

function updatedigUserTable() {
  fetch("/fileEdit/getUsers")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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
      header3.innerText = "setOrder";
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
        let setPerbtn = document.createElement("button");
        setPerbtn.innerText = "setOrder";
        setPerbtn.onclick = function () {
          //createUserModal(user.id_user,user.login);
          addSetDigModal(user.id_user, user.login);
        };
        cell3.appendChild(setPerbtn);
        let cell4 = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
          //createUserModal(user.id_user,user.login);
          addDigModal(user.id_user, user.login);
          //addSetDigModal(user.id_user,user.login)
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
          deleteUser(user.id_user, user.login);
        };
        cell5.appendChild(deleteButton);
        row.appendChild(cell1);
        //row.appendChild(cell2);

        if (user.role != "ADMIN") {
          row.appendChild(cell3);
          row.appendChild(cell4);
          row.appendChild(cell5);
        }
        table.appendChild(row);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateDigTable() {
  //changeAuthView()
  fetch("/fileEdit/getdigFiles")
    .then((response) => {
      // response = Object.assign({}, response); // {0:"a", 1:"b", 2:"c"}
      return response.json();
    })
    .then((data) => {
      files = data.files;
      let table = document.getElementById("fileTable");
      table.classList = "table table-fixed bg-light";
      table.innerHTML = "";
      //if(role=="USER"){
      // create table header
      let headerRow = document.createElement("tr");
      let header1 = document.createElement("th");
      header1.classList = "col-xs-3";
      header1.innerText = "Filename";
      let header2 = document.createElement("th");
      header2.classList = "col";
      header2.innerText = "Path";
      let header3 = document.createElement("th");
      header1.classList = "col";
      header3.innerText = "Order";
      let header4 = document.createElement("th");
      header1.classList = "col";
      header4.innerText = "Edit";
      let header5 = document.createElement("th");
      header1.classList = "col";
      header5.innerText = "delete";
      let header6 = document.createElement("th");
      header6.classList = "col";
      header6.innerText = "download";
      let header7 = document.createElement("th");
      header7.classList = "col";
      header7.innerText = "setOrder";
      headerRow.appendChild(header1);
      //headerRow.appendChild(header2);
      headerRow.appendChild(header3);
      headerRow.appendChild(header4);

      headerRow.appendChild(header5);

      headerRow.appendChild(header6);
      headerRow.appendChild(header7);
      table.appendChild(headerRow);

      // create table rows
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.classList = "col-xs-3";
        let name = file.file_path.split("Data/");
        cell1.innerText = name[1];
        let cell2 = document.createElement("td");
        cell2.classList = "col";
        cell2.innerText = file.file_path;
        let cell3 = document.createElement("td");
        cell3.classList = "col-xs-3";
        cell3.innerText = file.permission.symbolic;
        let cell4 = document.createElement("td");
        cell4.classList = "col-xs-3";
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
          addEditUModal(file.id, name[1],file.permission);
        };
        let cell5 = document.createElement("td");
        cell5.classList = "col-xs-3";
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.onclick = function () {
          deleteFile(file.id, file.file_path);
        };
        let cell6 = document.createElement("td");
        cell6.classList = "col-xs-3";
        let dowloadButton = document.createElement("button");
        dowloadButton.innerText = "download";
        dowloadButton.setAttribute(
          "onclick",
          `window.location.href = '/fileEdit/download/${file.id}'`
        );

        cell6.appendChild(dowloadButton);
        let cell7 = document.createElement("td");
        let setPerbtn = document.createElement("button");
        setPerbtn.innerText = "setOrder";
        setPerbtn.onclick = function () {
          addUploadSetDigModal(file.id, file.file_path);
        };
        cell7.appendChild(setPerbtn);
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);

        if (file.permission.write == 1) {
          cell5.appendChild(deleteButton);
        

         
        }
        cell4.appendChild(editButton);
        row.appendChild(cell4);
        row.appendChild(cell5)
        row.appendChild(cell6);
        row.appendChild(cell7);
        table.appendChild(row);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function uploadDigFile() {
  // document.body.onsubmit((event)=>{
  //     event.preventDefault();
  // })
  const uploadbtn = document.getElementById("uploadbtn");
  uploadbtn.onclick = async (event) => {
    event.preventDefault();

    

    const fileInput = document.getElementById("upload-file");
    const fileOrder = document.getElementById("fileorder");

    // Create a FormData object and append the file to it
    const formData = new FormData();
    formData.append(fileOrder.value, fileInput.files[0]);

    try {
      // Send the file to the server using fetch
      const response = await fetch("fileEdit/upload", {
        method: "POST",
        body: formData,
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
        updateDigTable();
        addUploadSetDigModal();
        fileInput.value = ``;
      } else {
        // If the response is not ok, show an error message
        const error = await response.text();
        makeToast({
          header: "Denaid",
          body: error,
          type: "danger",
          data_delay: 7000,
        });
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
  };
}

async function showForAdmin() {
  await fetchPost("/fileEdit/getRole", {}, true)
    .then((role) => {
      Grole = role;
      if(role=="SUPERADMIN"){
        let controlNav = document.getElementById("controlnav")
        controlNav.classList.remove("visually-hidden")
        let fileDiv = document.getElementById("filediv")
        let fileEditorNav = document.getElementById("fileeditnav")
        fileEditorNav.onclick = (event)=>{
          event.preventDefault()
          fileDiv.innerHTML= `
          
          <h3 class="ms-1">Список файлов</h3>
          <table id="fileTable" ></table>`
          updateTable()
        }
        let userCreateNav = document.getElementById("usercrnav")
        userCreateNav.onclick= (event)=>{
          event.preventDefault()
          fileDiv.innerHTML= `
          
    <div class="confirm">
    <i class='close'>×</i>
    <h1><i class="fa fa-check-circle fa-3x"></i>Great! Profile Created</h1>
  </div>
  <form action="#" class="userform">
    <h1>
      Create User Profile
      <br>
      <i class="fa fa-camera-retro fa-lg"></i>
    </h1>
        
    <div class="float-label">
    <input type="text" name="f-name" id="userName" />
    <label for="f-name">Name</label>
  </div>
    
    <div class="float-label">
      <input type="email" name="email" id="userlogin" />
      <label for="email">Email</label>
    </div>
      
    <div class="float-label">
      <i class="fa fa-caret-down"></i>
      <select id="roleselect" name="units">
        <option value=""></option>
        <option value="USER">USER</option>
        <option value="OPERATOR">OPERATOR</option>
        <option value="ADMIN">ADMIN</option>
      </select>    
      <label for="role"> Role</label>
    </div>
    
    <!--Row-->
    <div class='row'>
    
   
    </div>
    <div class="float-label">
      <fa class="fa eye fa-eye-slash"></fa>
      <input type="password" name="pw" id="pw" />
      <label for="pw">Password</label>
    </div>
    
    <div class="float-label">
      <textarea name="notes" id="notes"></textarea>
      <label for="notes">Notes</label>
    </div>
    <button class="Ubtn" type="submit" id="registerbtn">Submit</button>
    <button class="Ubtn" id="clear" type="reset" value="Reset">Reset</button>
  </form>  
          `

        
            function floatLabel(inputType){
              $(inputType).each(function(){
                var input = $(this).find("input, select, textarea");
                var label = $(this).find("label");
                // on focus add cladd active to label
                input.focus(function(){
                  input.next().addClass("active");
                  console.log("focus");
                });
                //on blur check field and remove class if needed
                input.blur(function(){
                  if(input.val() === '' || input.val() === 'blank'){
                    label.removeClass();
                  }
                });
              });
            }
            // just add a class of "floatLabel to any group you want to have the float label interactivity"
            floatLabel(".float-label");
            
            
          //////  Just a bunch of fluff for other interactions  ////////////////////////////////////////////////////////  
            
            //for the pw field - toggle visibility
            $(".eye").on("click" , function(){
              var $this = $(this);
              if( !$this.is(".show") ){
                $this.addClass("show")
                     .removeClass("fa-eye-slash")
                     .addClass("fa-eye").next()
                     .attr("type" , "text");
              }else{
                $this.removeClass("show")
                     .addClass("fa-eye-slash")
                     .removeClass("fa-eye")
                     .next().attr("type" , "password");
              }
            });
            
            //modal close
            $(".close").on("click" , function(){
              $(this).parent().removeClass("show");
              $("#clear").click();
            })
            //close on all click 
              $(".confirm").on("click" , function(){
              $(this).removeClass("show");
              $("#clear").click();
            })
            
            //submit button dirty validation ^-^
            $("button[type='submit']").on("click" , function(){
              if( !$("input, select, textarea").val() ){ 
                $(this).text("Please enter all Fields");
              }else{
                $(".confirm").addClass("show");
              }
              return false;
            })
            //just for reset button
            $("#clear").on("click" , function(){
              $(".active").removeClass("active");
            });
       
            addUser()
        }
        
      }
      if (role == "ADMIN" || Grole == "SUPERADMIN" )  {
        let modCheck = document.getElementById("modcheck");
          modCheck.classList.remove("visually-hidden")
        let UserListC = document.getElementById("UserListC");
        UserListC.classList.remove("visually-hidden");
      }
      if (role == "ADMIN" || role == "OPERATOR" || Grole == "SUPERADMIN") {
        isShow = true;
        let crMod = document.getElementById("addNewFile");

        crMod.classList.remove("visually-hidden");
      }
      if (role == "ADMIN"|| Grole == "SUPERADMIN") {
        let selectDfile = document.getElementById("fileorder");
        let optionC = `<option value="ADMIN">ADMIN</option>`;
        selectDfile.innerHTML += optionC;
      } else {
        let UserListC = document.getElementById("UserListC");
        UserListC.classList.add("visually-hidden");
      }
    })
    .catch((_) => {
      isShow = false;
      //console.log(data.role)
    });
}
async function showForDigAdmin() {
  await fetchPost("/fileEdit/getRole", {}, true)
    .then((role) => {
      Grole = role;
      if(role=="SUPERADMIN"){
        let controlNav = document.getElementById("controlnav")
        controlNav.classList.remove("visually-hidden")
      }
      if (role == "ADMIN" || Grole == "SUPERADMIN")  {
        let modCheck = document.getElementById("modcheck");
          modCheck.classList.remove("visually-hidden")
        let UserListC = document.getElementById("UserListC");
        UserListC.classList.remove("visually-hidden");
      }
      if (role == "ADMIN" || role == "OPERATOR" || Grole == "SUPERADMIN") {
        isShow = true;
        let crMod = document.getElementById("addNewFile");

        crMod.classList.remove("visually-hidden");
      }

      if (workmod == "dig") {
        let selectDfile = document.getElementById("fileorder");
        selectDfile.classList.add("visually-hidden");
        
        
      }
    })
    .catch((_) => {
      isShow = false;
      //console.log(data.role)
    });
}
function createUserModal(id, name) {
  let modalCon = document.getElementById("UserEditdiv");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  // modalCon = ``
  modalCon.innerHTML = ``;
  modal_content.innerHTML = `
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
</div>`;
  modalCon.append(modal_content);
  let selectUser = document.getElementById("userorder");
  if (Grole == "SUPERADMIN") {
    let optionC = `<option value="ADMIN">ADMIN</option>`;
    selectUser.innerHTML += optionC;
  } else {
  }
  let updateUserbtn = document.getElementById("updateUserbtn");
  updateUserbtn.onclick = async (event) => {
    updateUser(id, selectUser.value);
  };
}
function createModal(data, name, id,permission) {
  var buttonId = "one"; //$(this).attr('id');
  $("#modal-container").removeAttr("class").addClass(buttonId);
  $("#modal-container").addClass("modal-active");

  let modalCon = document.getElementById("modCon");
  let modal_content = document.createElement("div");
  modal_content.onclick = function (event) {
    event.preventDefault();
  };
  modalCon.innerHTML = ``;
  localStorage.removeItem("wysiwyg");
  let buttonStr;
  
  if (Grole == "ADMIN" || Grole == "OPERATOR" || Grole == "SUPERADMIN") {
    buttonStr = ` <button data-func="clear" type="button">clear</button>
    <button data-func="save" type="button">save</button>`;
    
  } else {
    buttonStr = ``;
  }
  if(permission){
  if(permission.write!=1){
    buttonStr = ``;
  }else{
    buttonStr = ` <button data-func="clear" type="button">clear</button>
    <button data-func="save" type="button">save</button>`;
  }
}
  modal_content.innerHTML = `

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
      </div>`;
  modalCon.append(modal_content);
  if (data instanceof Blob) {
    const img = createImage(URL.createObjectURL(data));
    function createImage(src) {
      const img = document.createElement("img");
      img.style = "width: 650px; ";
      img.src = src;
      return img;
    }
    // let databox = document.createElement("div")

    // databox.append(img)
    // document.getElementById("databox").append(databox)
    modal_content.append(img);
    //$('.editor').appendChild(img)
    document.querySelector(".editor").append(img);
    document.querySelector(".buttons").classList.add("visually-hidden");
    localStorage.removeItem("wysiwyg");
  } else {
    $(".newPost button[data-func]").click(function () {
      document.execCommand($(this).data("func"), false);
    });

    $(".newPost select[data-func]").change(function () {
      var $value = $(this).find(":selected").val();
      document.execCommand($(this).data("func"), false, $value);
    });
    localStorage.setItem("wysiwyg", data.toString());
    $(".editor").keypress(function () {
      $(this).find(".saved").detach();
    });
    $(".editor").text(localStorage.getItem("wysiwyg"));

    $('button[data-func="save"]').click(function () {
      $content = $(".editor").text();
      localStorage.setItem("wysiwyg", $content);
      $(".editor")
        .append('<span class="saved"><i class="fa fa-check"></i></span>')
        .fadeIn(function () {
          $(this).find(".saved").fadeOut(500);
        });
      updateFile(id, $content);
    });

    $('button[data-func="clear"]').click(function () {
      $(".editor").html("");
      localStorage.removeItem("wysiwyg");
    });
  }

  let i = 0;
  $(".modal").click(function (event) {
    event.preventDefault();
    i = 1;
  });

  $(".modal-background").click(function () {
    if (i == 0) {
      $("#modal-container").addClass("out");
      $("#modal-container").removeClass("modal-active");
    } else {
      i = 0;
    }
  });

  $('button[data-func="hide"]').click(function () {
    $("#modal-container").addClass("out");
    $("#modal-container").removeClass("modal-active");
  });

  //   localStorage.setItem("wysiwyg", data.toString());
  $(".newPost button[data-func]").click(function () {
    document.execCommand($(this).data("func"), false);
  });

  $(".newPost select[data-func]").change(function () {
    var $value = $(this).find(":selected").val();
    document.execCommand($(this).data("func"), false, $value);
  });

  //if(typeof(Storage) !== "undefined" && localStorage.getItem("wysiwyg") ) {
}
//}
function addEditUModal(id, name,permission) {
  fetch(`/fileEdit/getFile/${id}`)
    .then((response) => {
      console.log(response.headers.get("content-type"));
      console.log(response.headers.toString());
      if (response.headers.get("content-type").startsWith("image/")) {
        // return response.blob();
        return response.blob();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      createModal(data, name, id,permission);
    })
    .catch((err) => {
      console.log(err);
    });
}
function updateUserTable() {
  fetch("/fileEdit/getUsers")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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
          createUserModal(user.id_user, user.login);
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
          deleteUser(user.id_user, user.login);
        };
        cell5.appendChild(deleteButton);
        if (user.role != "SUPERADMIN" ) {
         
      
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);
        if (user.role != "ADMIN" && user.role != "SUPERADMIN" ) {
          row.appendChild(cell4);
          row.appendChild(cell5);
        }
         if(Grole == "SUPERADMIN"){
          row.appendChild(cell4);
          row.appendChild(cell5);
        }
        table.appendChild(row);
      }
    }
    })
    .catch((err) => {
      console.log(err);
    });
}
function updateTable() {
  //changeAuthView()
  fetch("/fileEdit/getFiles")
    .then((response) => {
      // response = Object.assign({}, response); // {0:"a", 1:"b", 2:"c"}
      return response.json();
    })
    .then((data) => {
      files = data;
      let table = document.getElementById("fileTable");
      table.classList = "table table-fixed bg-light";
      table.innerHTML = "";
      //if(role=="USER"){
      // create table header
      let headerRow = document.createElement("tr");
      let header1 = document.createElement("th");
      header1.classList = "col";
      header1.innerText = "Filename";
      let header2 = document.createElement("th");
      header2.classList = "col";
      header2.innerText = "Path";
      let header3 = document.createElement("th");
      header3.classList = "col";
      header3.innerText = "Order";
      let header4 = document.createElement("th");
      header4.classList = "col";
      header4.innerText = "Edit";
      let header5 = document.createElement("th");
      header5.classList = "col";
      header5.innerText = "delete";
      let header6 = document.createElement("th");
      header6.classList = "col";
      header6.innerText = "download";

      let header7 = document.createElement("th");
      header7.classList = "col";
      header7.innerText = "setOrder";
      
      headerRow.appendChild(header1);
      //headerRow.appendChild(header2);
      headerRow.appendChild(header3);
      headerRow.appendChild(header4);
      headerRow.appendChild(header6);
      if (Grole == "ADMIN" || Grole == "OPERATOR"|| Grole == "SUPERADMIN") {
        headerRow.appendChild(header5);
        if(Grole != "OPERATOR") 
        headerRow.appendChild(header7);
      }
 
      
    
      table.appendChild(headerRow);

      // create table rows
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.classList = "col-xs-3";
        let name = file.file_path.split("Data/");
        cell1.innerText = name[1];
        let cell2 = document.createElement("td");
        cell2.classList = "col";
        cell2.innerText = file.file_path;
        let cell3 = document.createElement("td");
        cell3.classList = "col";
        cell3.innerText = file.order;
        let cell4 = document.createElement("td");
        cell4.classList = "col";
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
          addEditUModal(file.id, name[1]);
        };
        cell4.appendChild(editButton);
        let cell5 = document.createElement("td");
        cell5.classList = "col";
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.onclick = function () {
          deleteFile(file.id, file.file_path);
        };
        let cell6 = document.createElement("td");
        cell5.classList = "col";
        let dowloadButton = document.createElement("button");
        dowloadButton.innerText = "download";
        dowloadButton.setAttribute(
          "onclick",
          `window.location.href = '/fileEdit/download/${file.id}'`
        );
        cell6.appendChild(dowloadButton);
        let cell7 = document.createElement("td");
        cell7.classList = "col";

        let setPerbtn = document.createElement("button");
        setPerbtn.innerText = "setOrder";
        setPerbtn.onclick = function () {
          addSetModal( "",file.file_path,file.id);
        };
        cell7.appendChild(setPerbtn);
      
        row.appendChild(cell1);
        //row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell6);
        if (Grole == "ADMIN" || Grole == "OPERATOR" || Grole == "SUPERADMIN") {
          cell5.appendChild(deleteButton);
          row.appendChild(cell5);
          if(Grole != "OPERATOR") 
          row.appendChild(cell7);
        }
    
       
       
        table.appendChild(row);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function deleteUser(id, login) {
  const rez = await fetchPost(`fileEdit/deleteUser/${id}`, { login }, true)
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((data) => {
      updateUserTable();

      if (workmod == "dig") {
        updatedigUserTable();
      }
      makeToast({
        header: "Успіх",
        body: data,
        type: "success",
        data_delay: 7000,
      });
    })
    .catch((err) => {
      makeToast({
        header: "Denaid",
        body: err.message,
        type: "danger",
        data_delay: 7000,
      });
      console.log(err);
    });
}

async function addUser() {
    const registerbtn = document.getElementById("registerbtn");
    if (registerbtn) {
      registerbtn.onclick = async (event) => {
        event.preventDefault();
        const userName = document.getElementById("userName").value;
        const login = document.getElementById("userlogin").value;
        const password = document.getElementById("pw").value;
        const selectRole  = document.getElementById("roleselect")

        let role = selectRole.value
        // let numRuleRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}\$")
        // let spRegex =new RegExp("^(?=.*[A-Za-z])(?.*\\d)(?=.*[@\$!%*#?&])[A-Za-z\\d\$!%*#?&]{8,}\$")

        if (login != "" && password != "") {
           
            const rez = await fetchPost(
              "login/register",
              { login, password, userName,role },
              true
            );
          
            makeToast({
              header: "Успіх",
              body: rez,
              type: "success",
              data_delay: 7000,
            });
            updateUserTable()
          } else {
            makeToast({
              header: "Denaid",
              body: `Empy field login`,
              type: "danger",
              data_delay: 7000,
            });
          }
   
      };
    }

}

async function uploadFile() {
  // document.body.onsubmit((event)=>{
  //     event.preventDefault();
  // })
  const uploadbtn = document.getElementById("uploadbtn");
  uploadbtn.onclick = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("upload-file");
    const fileOrder = document.getElementById("fileorder");

    // Create a FormData object and append the file to it
    const formData = new FormData();
    formData.append(fileOrder.value, fileInput.files[0]);

    try {
      // Send the file to the server using fetch
      const response = await fetch("fileEdit/upload", {
        method: "POST",
        body: formData,
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
        updateTable();
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
  };
}

async function deleteFile(id, name) {
  // document.body.onsubmit((event)=>{
  //     event.preventDefault();
  // })

  const rez = await fetchPost(`fileEdit/delete/${id}`, { name }, true)
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((data) => {
      if (workmod == "dig") {
        updateDigTable();
      } else {
        updateTable();
      }
      makeToast({
        header: "Успіх",
        body: data,
        type: "success",
        data_delay: 7000,
      });
    })
    .catch((err) => {
      makeToast({
        header: "Denaid",
        body: err.message,
        type: "danger",
        data_delay: 7000,
      });
      console.log(err);
    });
}
async function updateFile(id, data) {
  const rez = await fetchPost(`fileEdit/updateFile/${id}`, { data }, true)
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((data) => {
      updateTable();
      makeToast({
        header: "Успіх",
        body: data,
        type: "success",
        data_delay: 7000,
      });
    })
    .catch((err) => {
      makeToast({
        header: "Denaid",
        body: err.message,
        type: "danger",
        data_delay: 7000,
      });
      console.log(err);
    });
}
async function updateUser(id, data) {
  const rez = await fetchPost(`fileEdit/updateUser/${id}`, { data }, true)
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((data) => {
      updateUserTable();
      makeToast({
        header: "Успіх",
        body: data,
        type: "success",
        data_delay: 7000,
      });
    })
    .catch((err) => {
      makeToast({
        header: "Denaid",
        body: err.message,
        type: "danger",
        data_delay: 7000,
      });
      console.log(err);
    });
}
async function downloadFile(id, name) {
  // document.body.onsubmit((event)=>{
  //     event.preventDefault();
  // })
  fetch(`/fileEdit/download/${id}`)
    .then((response) => {
      console.log(response);
      return response.text();
    })
    .then((data) => {
      makeToast({
        header: "Успіх",
        body: data,
        type: "sucsess",
        data_delay: 7000,
      });
    })
    .catch((err) => {
      makeToast({
        header: "Denaid",
        body: err.message,
        type: "danger",
        data_delay: 7000,
      });
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
