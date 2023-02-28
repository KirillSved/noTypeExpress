// async function start () {
// function Login(){
//   const login = $("#login").val()
//   const password = $("#pwd").val()
//   $.post("/login/login",{
//     login:login,
//     password:password},function(data,status){
//       setCookie("authorization",data)
//       window.location.href = "/"
//   })
//   .fail(function(data){
//     $("#login").val("")
//     $("#pwd").val("")
//     makeToast({ header: 'Помилка', data, type: 'danger', data_delay: 7000 })
//   })
// }
// $('#loginbtn').keypress(function (event) {
//   const keycode = (event.keyCode ? event.keyCode : event.which)
//   if (keycode === '13') {
//     Login()
//   }
// })

//---------------------------------------------------------
//jQuery time
// var current_fs, next_fs, previous_fs; //fieldsets
// var left, opacity, scale; //fieldset properties which we will animate
// var animating; //flag to prevent quick multi-click glitches


// let msCon = document.createElement("form");
// msCon.id = "msform";
// msCon.innerHTML = `

// <!-- progressbar -->
// <ul id="progressbar">
//   <li class="active">Account Setup</li>
//   <li>Social Profiles</li>
//   <li>Personal Details</li>
// </ul>
// <!-- fieldsets -->
// <fieldset>
//   <h2 class="fs-title">Create your account</h2>
//   <h3 class="fs-subtitle">This is step 1</h3>
//   <input type="text" name="email" placeholder="Email" />
//   <input type="password" name="pass" placeholder="Password" />
//   <input type="password" name="cpass" placeholder="Confirm Password" />
//   <input type="button" name="next" class="next action-button" value="Next" />
// </fieldset>
// <fieldset>
//   <h2 class="fs-title">Social Profiles</h2>
//   <h3 class="fs-subtitle">Your presence on the social network</h3>
//   <input type="text" name="twitter" placeholder="Twitter" />
//   <input type="text" name="facebook" placeholder="Facebook" />
//   <input type="text" name="gplus" placeholder="Google Plus" />
//   <input type="button" name="previous" class="previous action-button" value="Previous" />
//   <input type="button" name="next" class="next action-button" value="Next" />
// </fieldset>
// <fieldset>
//   <h2 class="fs-title">Personal Details</h2>
//   <h3 class="fs-subtitle">We will never sell it</h3>
//   <input type="text" name="fname" placeholder="First Name" />
//   <input type="text" name="lname" placeholder="Last Name" />
//   <input type="text" name="phone" placeholder="Phone" />
//   <textarea name="address" placeholder="Address"></textarea>
//   <input type="button" name="previous" class="previous action-button" value="Previous" />
//   <input type="submit" name="submit" class="submit action-button" value="Submit" />
// </fieldset>

// `;
// $(document).ready(function () {
//   $("#regCrBtn").click(function () {
//     $("#Jcon")[0].innerHTML = ``;
//     $("#Jcon").append(msCon);
   
//     $(".next").click(function () {
//       if (animating) return false;
//       animating = true;

//       current_fs = $(this).parent();
//       next_fs = $(this).parent().next();

//       //activate next step on progressbar using the index of next_fs
//       $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

//       //show the next fieldset
//       next_fs.show();
//       //hide the current fieldset with style
//       current_fs.animate(
//         { opacity: 0 },
//         {
//           step: function (now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale current_fs down to 80%
//             scale = 1 - (1 - now) * 0.2;
//             //2. bring next_fs from the right(50%)
//             left = now * 50 + "%";
//             //3. increase opacity of next_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({
//               transform: "scale(" + scale + ")",
//               position: "absolute",
//             });
//             next_fs.css({ left: left, opacity: opacity });
//           },
//           duration: 800,
//           complete: function () {
//             current_fs.hide();
//             animating = false;
//           },
//           //this comes from the custom easing plugin
//           easing: "easeInOutBack",
//         }
//       );
//     });

//     $(".previous").click(function () {
//       if (animating) return false;
//       animating = true;

//       current_fs = $(this).parent();
//       previous_fs = $(this).parent().prev();

//       //de-activate current step on progressbar
//       $("#progressbar li")
//         .eq($("fieldset").index(current_fs))
//         .removeClass("active");

//       //show the previous fieldset
//       previous_fs.show();
//       //hide the current fieldset with style
//       current_fs.animate(
//         { opacity: 0 },
//         {
//           step: function (now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale previous_fs from 80% to 100%
//             scale = 0.8 + (1 - now) * 0.2;
//             //2. take current_fs to the right(50%) - from 0%
//             left = (1 - now) * 50 + "%";
//             //3. increase opacity of previous_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({ left: left });
//             previous_fs.css({
//               transform: "scale(" + scale + ")",
//               opacity: opacity,
//             });
//           },
//           duration: 800,
//           complete: function () {
//             current_fs.hide();
//             animating = false;
//           },
//           //this comes from the custom easing plugin
//           easing: "easeInOutBack",
//         }
//       );
//     });

//     $(".submit").click(function () {
//       return false;
//     });
//   });

//----------------------------------------

const loginbtn = document.getElementById("loginbtn");
loginbtn.onclick = async () => {
  const login = document.getElementById("login").value.trim();
  const password = document.getElementById("pwd").value;
  if (login !=="" && password !== ""){
    //let rez ; // try рождает мембрану 
    try{  
    var rez = await fetchPost("/login/login", { login, password }, true)
  }catch(err){
     document.getElementById("login").value = "";
     document.getElementById("pwd").value = "";
    //  makeToast({
    //   header: "Bed-request",
    //   body: err,
    //   type: "danger",
    //   data_delay: 7000,
    // });
  }
  setCookie("authorization", rez);
  const check = getCookie("lang");
  if (check === undefined) {
    setCookie("lang", "ru");
    document.location.reload();
  }
  if(rez){
  window.location.href = window.location.href.replace("/login", "/");
  }
}};

const registerbtn = document.getElementById("registerbtn");
if (registerbtn) {
  registerbtn.onclick = async () => {
    const login = document.getElementById("login").value;
    const password = document.getElementById("pwd").value;
    if (login !="" && password !=""){
    const rez = await fetchPost("login/register", { login, password }, true);
    makeToast({
      header: "Успіх",
      body: rez,
      type: "success",
      data_delay: 7000,
    });
  }else{
    makeToast({
      header: "Denaid",
      body: "Empy form field",
      type: "danger",
      data_delay: 7000,
    });
  };
}
}
const forgotbtn = document.getElementById("forgot");
if (forgotbtn) {
  forgotbtn.onclick = async () => {
    makeToast({
      header: "Успіх",
      body: "some",
      type: "success",
      data_delay: 7000,
    });
  };
}
// }

// // module.exports =
//  start()

function show() {
  var p = document.getElementById("pwd");
  p.setAttribute("type", "text");
}

function hide() {
  var p = document.getElementById("pwd");
  p.setAttribute("type", "password");
}

var pwShown = 0;

document.getElementById("eye").addEventListener(
  "click",
  function () {
    if (pwShown == 0) {
      pwShown = 1;
      show();
    } else {
      pwShown = 0;
      hide();
    }
  },
  false
);
//})