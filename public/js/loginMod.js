
class viewForm {
  mainForm() {
    document.getElementById("Jcon").className = "conteiner-md p-5 b-show";

    let overDiv = document.createElement("div");
    overDiv.id = "overL";
    overDiv.className = "overlay";
    overDiv.innerHTML = ``;
    overDiv.innerHTML = `
    <!-- LOGN IN FORM -->
    <form  onsubmit="return false;">
       <!--   con = Container  for items in the form-->
       <div class="con">
       <!--     Start  header Content  -->
       <header class="head-form">
          <h2>Welcome</h2>
          <!-- login here using your username and password    A welcome message or an explanation of the login form -->
          <p>Швед Кирило БІ-443</p>
       </header>
       <!--     End  header Content  -->
       <br>
       <div class="social-container">
       <a href="#" class="social" id="faceidbtn"><i class="fab fa-facebook-f" aria-hidden="true">@SE </i><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>

       </div>
       <div class="field-set">
         
          <!--   user name -->
             <span class="input-item">
               <i class="fa fa-user-circle"></i>
             </span>
            <!--   user name Input-->
             <input class="form-input" id="login" type="text" placeholder="@Login" required>
         
          <br>
         
               <!--   Password -->
         
          <span class="input-item" style="padding-top:16px;" >
            <i class="fa fa-key"></i>
           </span>
          <!--   Password Input-->
          <input class="form-input" type="password" placeholder="Password" id="pwd"  name="password" required>
         
    <!--      Show/hide password  -->
         <span>
            <i class="fa fa-eye" aria-hidden="true"  type="button" id="eye"></i>
         </span>
         
         
          <br>
          
    <!--        buttons -->
    <!--      button LogIn -->
          <button class="log-in" id="loginbtn"> Log In </button>
       </div>
      
    <!--   other buttons -->
       <div class="other">
    <!--      Forgot Password button-->
          <button class="btn submits frgt-pass" id="crForgotbtn">Forgot Password</button>
    <!--     Sign Up button -->
          <button class="btn submits sign-up" id="regCrBtn">Sign Up 
    <!--         Sign Up font icon -->
          <i class="fa fa-user-plus" aria-hidden="true"></i>
          </button>
    <!--      End Other the Division -->
       </div>
         
    <!--   End Conrainer  -->
      </div>
      
      <!-- End Form -->
    </form>
    `;
    return overDiv;
  }
  registerForm() {
    document.getElementById("Jcon").className = "conteiner-md p-5 b-show";

    let overForm = document.createElement("form");
    overForm.id = "overform";
    overForm.innerHTML = `
<!-- multistep form -->

  <!-- progressbar -->
  <ul id="progressbar">
    <li class="active">Account Setup</li>
    <li>CREATE YOURT ACCOUNT</li>
    <li>Fase id</li>
  </ul> 


  <!-- 3 fieldsets -->

  <fieldset>
  <h2 class="fs-title">Personal Details</h2>
  <h3 class="fs-subtitle">We will never sell it</h3>
  
  
  <span class="input-item" style="padding-top:16px;padding-right: 6px;">
  <i class="fa fa-user-circle" aria-hidden="true"></i>
  </span>

  <!--   Telegram social name Input-->

  <input class="form-input" id="userName" type="text" placeholder="@YourFirstName" required="">
    <br>
  <span class="input-item">
  <i class="fa fa-brands fa-github-alt" aria-hidden="true"></i>
  </span>
  <!--   Github name Input
  <input class="form-input" type="text" placeholder="@YourSerName" id="userSername" name="" required="">
  <span>
  <i class="fa fa-question-circle-o" aria-hidden="true" type="button" id="askUs"></i>

  </span>
  <br>
  <span class="input-item">
  <i class="fa fa-key" aria-hidden="true"></i>
  </span> -->
    <!--   Password Input-->
  <input class="form-input" type="text" placeholder="@YourSerName" id="userSername" name="" required="">
  <span>
  <i class="fa fa-question-circle-o" aria-hidden="true" type="button" id="askUs"></i>
  </span>
  <br>
  <span class="input-item" style="padding-top:16px;padding-right: 6px;">
  <i class="fa fa-user-circle" aria-hidden="true"></i>
  </span>
  <select name="" id="password_type" class="form-input" style=" width: 240px;
  height: 50px;

  margin-top: 4%;
  padding: 15px;
  
  font-size: 16px;
  font-family: 'Abel', sans-serif;
  color: #5E6472;

  outline: none;
  border: none;

  border-radius: 0px 5px 5px 0px;
  transition: 0.2s linear;">
  <option value="">--Your password type--</option>
  <option value="strong">Strong</option>
  <option value="simple">Simple</option>
  </select>   
  <button class="log-in submits action-button" name="cancel" id="cancelOver"> Cancel </button>

    <button class="log-in next submits action-button" name="next" id="next" style=""> Next </button>

  </fieldset>

  <!-- 1 fieldsets -->

  <fieldset>
  
    <h2 class="fs-title">Create yourt account</h2>
    <h3 class="fs-subtitle">This is step 1</h3>
                                         
    <span class="input-item" style="padding-top:16px;padding-right: 6px;">
    <i class="fa fa-user-circle" aria-hidden="true"></i>
    </span>
    <!--   user Email-name Input-->
                            
     <input class="form-input" id="crlogin" type="text" placeholder="YourLogin@gmail.com" required="">
       <br>
     <span class="input-item">
      <i class="fa fa-key" aria-hidden="true"></i>
      </span>
      <!--   Password Input-->
      <input class="form-input" type="password" placeholder="Create password" id="crpwd" name="crpass" required="">
        <span>
       <i class="fa fa-eye" aria-hidden="true" type="button" id="eye"></i>
       </span>
         <br>
      <span class="input-item">
       <i class="fa fa-key" aria-hidden="true"></i>
       </span>
    <!--   Password Input-->
      <input class="form-input" type="password" placeholder="Confirm password" id="confpwd" name="confpass" required="">
        <span>
       <i class="fa fa-solid fa-user-lock" aria-hidden="true" type="button" id="goConfirm"></i>
       </span>
                       
             
       <button class="log-in previous submits action-button" name="previous" id="previous">  Previous</button>
 
       <button class="log-in next submits action-button" name="next" id="next"> Next </button>

           

  </fieldset>

  
  <!-- 3 fieldsets -->

  <fieldset>
  <h2 class="fs-title">Personal Details</h2>
  <h3 class="fs-subtitle">We will never sell it</h3>
  
  
  <span class="input-item " style="padding-top:16px;padding-right: 6px;">
  <i class="fa fa-user-circle" aria-hidden="true"></i>
  </span>

  <!--   Telegram social name Input-->


  <button class="form-input action-button" name="next" id="face_registerbtn" style=""> Create faceId </button>
  
<br>
<h3 class="fs-subtitle">Status face registation <span class="form-item " style="padding-top:16px;padding-right: 6px;">
<div id="statusregbad" style="height:0px">
not register
<br>
<span class="form-item " style="padding-top:16px;padding-right: 6px;">
<i class="fa fa-x-ray fa-fade" style="color:red;" aria-hidden="true"></i>
</span>
<span class="form-item " style="padding-top:16px;padding-right: 6px;">
<i class="fa fa-x-ray" style="color:red; " aria-hidden="true"></i>
<i class="fa fa-x-ray" style="color:red; " aria-hidden="true"></i>
<i class="fa fa-x-ray" style="color:red; " aria-hidden="true"></i>
<i class="fa fa-x-ray" style="color:red; " aria-hidden="true"></i>
</span>
</div>
<div class="visually-hidden" id="statusregood" style="height:0px">
register<br>
<span class="form-item " style="padding-top:16px;padding-right: 6px;">
<i class="fa fa-solid fa-check" style="color:green; " aria-hidden="true"></i>
<i class="fa fa-solid fa-check" style="color:green; " aria-hidden="true"></i>
<i class="fa fa-solid fa-check" style="color:green; " aria-hidden="true"></i>
<i class="fa fa-solid fa-check" style="color:green; " aria-hidden="true"></i>
</span>
</div>
</h3>


  <button class="log-in previous submits action-button" name="previous" id="previous"> Previous </button>

    <button class="log-in submits action-button" name="next" id="registerbtn" style=""> Sign In </button>

  </fieldset>

 
`;
    return overForm;
    //-------------------------------------------------------
  }

  forgotForm() {
    document.getElementById("Jcon").className = "conteiner-md p-5 b-show";

    let forgotForm = document.createElement("form");
    forgotForm.id = "overform";
    forgotForm.innerHTML = `
<!-- multistep form -->

  <!-- progressbar -->
  <ul id="progressbar">
    <li class="active" style="margin-left: 12%;
    width: 40%;">Password reset setup</li>
    <li>Password reset confirm</li>
  </ul> 

  <!-- 1 fieldsets -->
  <fieldset>
  <h2 class="fs-title">if you forgot password do some easy step</h2>
    <h3 class="fs-subtitle">&We sent sent reset code on your mail</h3>
 
  <span class="input-item">
  <i class="fa fa-user-circle" aria-hidden="true" ></i>
  </span>
  
  <!--   Telegram social name Input-->

  <input class="form-input" id="forgotLogin" type="email" pattern=".+@globex\.com" placeholder="@UsedForLoginEmail" required="">
  
  <br>
  <!--   phone reset  Input-->
  <span class="input-item">
  <i class="fa fa-mobile" aria-hidden="true"></i>
  </span>

  <input class="form-input" type="text" placeholder="@phoneNumer" id="phonenum" name="phone" required="">
  <span>
  <i class="fa fa-question-circle-o" aria-hidden="true" type="button" id="askUs"></i>
  </span>
  <br>
  

         
    <button class="log-in submits action-button" name="cancel" id="cancelOver"> Cancel </button>
    <button class="log-in next submits action-button" name="next" id="conCode" style=""> Send </button>
      
    

  </fieldset>
  <!-- 2 fieldsets -->

  <fieldset>


    <h2 class="fs-title">We olmoust reset your password, just keep privacy</h2>
    <h3 class="fs-subtitle">cod was cended on your login@gmail</h3>  

    <span class="input-item">
    <i class="fa fa-user-circle" aria-hidden="true"></i>
    </span>
    <!--   user Email-name Input-->
                            
     <input class="form-input" id="emailCon" type="text" placeholder="@ConfimCode" required="">
       <br>
     <span class="input-item">
      <i class="fa fa-key" aria-hidden="true"></i>
      </span>
      <!--   Password Input-->
      <input class="form-input" type="password" placeholder="Create new password" id="newpwd" name="pass" required="">
        <span>
       <i class="fa fa-eye" aria-hidden="true" type="button" id="eye"></i>
       </span>
         <br>
      <span class="input-item">
       <i class="fa fa-key" aria-hidden="true"></i>
       </span>
    <!--   Password Input-->
      <input class="form-input" type="password" placeholder="Confirm new password" id="confnewpwd" name="pass" required="">
        <span>
       <i class="fa fa-solid fa-user-lock" aria-hidden="true" type="button" id="goConfirm"></i>
       </span>
                       
       <button class="log-in previous submits action-button" name="previous" id="previous">  Previous</button>
       <button class="log-in submits action-button" name="next" id="forgotbtn"> Reset </button>

  </fieldset>

 
`;
    return forgotForm;
    //-------------------------------------------------------
  }

  nextForm() {
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating;
    $("#cancelOver").click(function (event) {
      event.preventDefault()
      console.log("cansel");
      document.getElementById("Jcon").className = "conteiner-md p-5 b-hide";
      document.getElementById("Jcon").innerHTML = ``;
      viewMainForm();
    });
    $(".next").click(function (event) {
      // event.preventDefault()
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate(
        { opacity: 0 },
        {
          step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = now * 50 + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
              transform: "scale(" + scale + ")",
              position: "absolute",
            });
            next_fs.css({ left: left, opacity: opacity });
          },
          duration: 800,
          complete: function () {
            current_fs.hide();
            animating = false;
          },
          //this comes from the custom easing plugin
          easing: "easeInOutBack",
        }
      );
    });

    $(".previous").click(function (event) {
      event.preventDefault()
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li")
        .eq($("fieldset").index(current_fs))
        .removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate(
        { opacity: 0 },
        {
          step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = (1 - now) * 50 + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({ left: left });
            previous_fs.css({
              transform: "scale(" + scale + ")",
              opacity: opacity,
            });
          },
          duration: 800,
          complete: function () {
            current_fs.hide();
            animating = false;
          },
          //this comes from the custom easing plugin
          easing: "easeInOutBack",
        }
      );
    });
  }
}

function checkPassType(password) {
  var regx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regx.test(password)) {
    return false;
  }
  return true;
}
const  faceio  =  new  faceIO ( "fioaf11d" );

function enrollNewUser(login){

  // get webcam stream
  // navigator.mediaDevices 
  //   .getUserMedia({ video: true })
  //   .then((stream) => {
  //     // Create a new FaceIO instance
  //   })
  
  // Start the facial enrollment process
  document.getElementById("overform").className = "f-hide";
 
  return faceio.enroll({
      locale: 'ru', // Default user locale
      payload: {
        login:login
      },
      userConsent: false, // Ask user for consent before starting the enrollment process
    })
    .then((userInfo) => {
      // User Successfully Enrolled!
          makeToast({
          header: "User Successfully Enrolled! Details:",
          body:    `
          Unique Facial ID: ${userInfo.facialId}
          Enrollment Date: ${userInfo.timestamp}
          Gender: ${userInfo.details.gender}
          Age Approximation: ${userInfo.details.age}`,
          type: "success",
          data_delay: 7000,
        });

      console.log(userInfo)
      document.getElementById("overform").className = " ";
      return userInfo
      // fetch('/login/createFaceId', {
      //   method: 'POST',
      //   headers: new Headers({'content-type': 'application/json'}),
      //   body: {
      //     faceID: userInfo.facialId,
      //     userID:
      //       document.getElementById('userId').value == ''
      //         ? -1
      //         : document.getElementById('userId').value,
      //   },
      // })
      //   .then(() => {
      //     alert(
      //       `Face ID saved successfully
      //       Details:
      //       Unique Facial ID: ${userInfo.facialId}
      //       Enrollment Date: ${userInfo.timestamp}
      //       Gender: ${userInfo.details.gender}
      //       Age Approximation: ${userInfo.details.age}`
      //     );

          
      //   })
      //   .catch(() => alert('Face ID not saved'));
      // // handle success, save the facial ID, redirect to dashboard...
    })
    .catch((errCode) => {
      document.getElementById("overform").className = " ";
      handleError(errCode);
      // handle enrollment failure. Visit:
      // https://faceio.net/integration-guide#error-codes
      // for the list of all possible error codes
    });
}

function authenticateUser() {
  
  // Start the facial authentication process (Identify a previously enrolled user)
  document.getElementById("Jcon").className = "conteiner-md p-5 f-hide";
  faceio.authenticate({
    "locale": "auto" // Default user locale
  }).then((userData) => {
     fetchPost("login/loginFaceId", { face_id: userData.facialId, }, false)
    .then((rez) => {
          setCookie("authorization", rez);
          const check = getCookie("lang");
          if (check === undefined) {
            setCookie("lang", "ru");
            document.location.reload();
          }
          if (rez) {
            window.location.href = window.location.href.replace("/login", "/fileEdit");
          }
          // alert(
          //   `Face ID saved successfully
          //   Details:
          //   Unique Facial ID: ${userInfo.facialId}
          //   Enrollment Date: ${userInfo.timestamp}
          //   Gender: ${userInfo.details.gender}
          //   Age Approximation: ${userInfo.details.age}`
          // );

          
        })
        .catch((err) => {
          alert(err); 
          faceio.restartSession();});
      // // handle success, save the facial ID, redirect to dashboard...
    document.getElementById("Jcon").className = "conteiner-md p-5";
  }).catch(errCode => {
    // handle authentication failure. Visit:
    // https://faceio.net/integration-guide#error-codes
    // for the list of all possible error codes
    handleError(errCode);
    
    // If you want to restart the session again without refreshing the current TAB. Just call:
    faceio.restartSession();
    document.getElementById("Jcon").className = "conteiner-md p-5";
    // restartSession() let you authenticate the same user again (in case of failure) 
    // without refreshing the entire page.
    // restartSession() is available starting from the PRO plan and up, so think of upgrading your app
    // for user usability.
  });
}
function handleError(errCode) {
  // Log all possible error codes during user interaction..
  // Refer to: https://faceio.net/integration-guide#error-codes
  // for a detailed overview when these errors are triggered.
  switch (errCode) {
    case fioErrCode.PERMISSION_REFUSED:
      console.log("Access to the Camera stream was denied by the end user");
      break;
    case fioErrCode.NO_FACES_DETECTED:
      console.log("No faces were detected during the enroll or authentication process");
      break;
    case fioErrCode.UNRECOGNIZED_FACE:
      console.log("Unrecognized face on this application's Facial Index");
      break;
    case fioErrCode.MANY_FACES:
      console.log("Two or more faces were detected during the scan process");
      break;
    case fioErrCode.FACE_DUPLICATION:
      console.log("User enrolled previously (facial features already recorded). Cannot enroll again!");
      break;
    case fioErrCode.PAD_ATTACK:
      console.log("Presentation (Spoof) Attack (PAD) detected during the scan process");
      break;
    case fioErrCode.FACE_MISMATCH:
      console.log("Calculated Facial Vectors of the user being enrolled do not matches");
      break;
    case fioErrCode.WRONG_PIN_CODE:
      console.log("Wrong PIN code supplied by the user being authenticated");
      break;
    case fioErrCode.PROCESSING_ERR:
      console.log("Server side error");
      break;
    case fioErrCode.UNAUTHORIZED:
      console.log("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information");
      break;
    case fioErrCode.TERMS_NOT_ACCEPTED:
      console.log("Terms & Conditions set out by FACEIO/host application rejected by the end user");
      break;
    case fioErrCode.UI_NOT_READY:
      console.log("The FACEIO Widget could not be (or is being) injected onto the client DOM");
      break;
    case fioErrCode.SESSION_EXPIRED:
      console.log("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly");
      break;
    case fioErrCode.TIMEOUT:
      console.log("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)");
      break;
    case fioErrCode.TOO_MANY_REQUESTS:
      console.log("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications");
      break;
    case fioErrCode.EMPTY_ORIGIN:
      console.log("Origin or Referer HTTP request header is empty or missing");
      break;
    case fioErrCode.FORBIDDDEN_ORIGIN:
      console.log("Domain origin is forbidden from instantiating fio.js");
      break;
    case fioErrCode.FORBIDDDEN_COUNTRY:
      console.log("Country ISO-3166-1 Code is forbidden from instantiating fio.js");
      break;
    case fioErrCode.SESSION_IN_PROGRESS:
      console.log("Another authentication or enrollment session is in progress");
      break;
    case fioErrCode.NETWORK_IO:
    default:
      console.log("Error while establishing network connection with the target FACEIO processing node");
      break;
  }
}

function viewMainForm() {
 
  document.getElementById("Jcon").className = "conteiner-md p-5 b-show";

  let Jcon = document.getElementById("Jcon");
  let cView = new viewForm();

  let mainForm = cView.mainForm();
  let regForm = cView.registerForm();
  let forgotForm = cView.forgotForm();

  Jcon.innerHTML = ``;

  Jcon.append(mainForm);
  const passwordInput = document.getElementById("pwd")
     passwordInput.onpaste = (event)=>{
      event.preventDefault()
     }
  var pwShown = 0;

    document.getElementById("eye").addEventListener(
      "click",
      function () {
        if (pwShown == 0) {
          pwShown = 1;
          crshow();
        } else {
          pwShown = 0;
          crhide();
        }
      },
      false
    );

    const faceidloginbtn = document.getElementById("faceidbtn")
    faceidloginbtn.onclick = async ()=>{
      faceio.restartSession();
      authenticateUser()
    }
  const loginbtn = document.getElementById("loginbtn");
  
  loginbtn.onclick = async () => {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("pwd").value;
  
    if (login !== "" && password !== "") {
      //let rez ; // try рождает мембрану
      try {
        var rez = await fetchPost("/login/login", { login, password }, true);
      } catch (err) {
        document.getElementById("login").value = "";
        document.getElementById("pwd").value = "";
        //  makeToast({
        //   header: "Bed-request",
        //   body: err,
        //   type: "danger",
        //   data_delay: 7000,
        // });
        if(err==`Password has expired,reset password` || err=="User has been locked"){
          forgotbtn.innerText="Reset Password"
        }
      }
      setCookie("authorization", rez);
      const check = getCookie("lang");
      if (check === undefined) {
        setCookie("lang", "ru");
        document.location.reload();
      }
      if (rez) {
        window.location.href = window.location.href.replace("/login", "/fileEdit");
      }
    }
  };

  const regCrBtn = document.getElementById("regCrBtn");

  regCrBtn.addEventListener("click", (event) => {
    
    event.preventDefault()
    document.getElementById("Jcon").className = "conteiner-md p-5 b-hide";
    document.getElementById("Jcon").innerHTML = ``;
    document.getElementById("Jcon").append(regForm);
    let face_id="0";
    cView.nextForm();
    crEye(["crpwd","confpwd"]);
    const face_registerbtn = document.getElementById("face_registerbtn");
    if (face_registerbtn) {
      face_registerbtn.onclick = async (event) => {
        event.preventDefault()
        const login = document.getElementById("crlogin").value;
        const badregV = document.getElementById("statusregbad")
        const goodregV =document.getElementById("statusregood") ;
        if (login != "") {
      face_id =  await enrollNewUser(login)
      face_id=face_id.facialId
        }else{
          makeToast({
            header: "Denaid",
            body: `Empty field login`,
            type: "danger",
            data_delay: 7000,
          });
        }
      if(face_id!="0"){
        badregV.classList.add("visually-hidden")
        goodregV.classList.remove("visually-hidden")
      } 
      };
    }

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
              { login, password, userName,face_id},
              true
            );
            if(rez){
            makeToast({
              header: "Успіх",
              body: rez,
              type: "success",
              data_delay: 7000,
            })
          viewMainForm()};
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
            body: "not confirm password",
            type: "danger",
            data_delay: 7000,
          });
        }
      };
    }
  });

  const forgotbtn = document.getElementById("crForgotbtn");

  forgotbtn.addEventListener("click", () => {
    document.getElementById("Jcon").className = "conteiner-md p-5 b-hide";
    document.getElementById("Jcon").innerHTML = ``;
    document.getElementById("Jcon").append(forgotForm);

    cView.nextForm();
    crEye(["newpwd","confnewpwd"])
    const conCode = document.getElementById("conCode");
    if (conCode) {
      conCode.onclick = async (event) => {
        const login = document.getElementById("forgotLogin").value;
        const conCode = document.getElementById("phonenum").value;
      
        if (login != "") {
          const rez = await fetchPost(
            "login/conCode",
            { login },
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
            body: "Empy field login",
            type: "danger",
            data_delay: 7000,
          });
        }
      };
    }
    const forgotbtn = document.getElementById("forgotbtn");
    if (forgotbtn) {
      forgotbtn.onclick = async () => {
        const login = document.getElementById("forgotLogin").value;
        const conCode = document.getElementById("emailCon").value;
        const password = document.getElementById("newpwd").value;
        const confNewPwd = document.getElementById("confnewpwd").value;
        if (login != "") {
          const rez = await fetchPost(
            "login/reset",
            { login, password, conCode },
            true
          );
          makeToast({
            header: "Успіх",
            body: rez,
            type: "success",
            data_delay: 7000,
          });
          
          viewMainForm();
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

  function show(...args) {
    args[0][0].forEach(el=>{
      let cp=document.getElementById(el);
      cp.setAttribute("type", "text");
    })
  }
  
  function crshow() {
    var cp = document.getElementById("pwd");

    cp.setAttribute("type", "text");
  }
  function crhide() {
    var cp = document.getElementById("pwd");

    cp.setAttribute("type", "password");
  }

  function hide(...args) {
     args[0][0].forEach(el=>{
      let cp =document.getElementById(el);
      cp.setAttribute("type", "password");
    })
  }

  var pwShown = 0;

 var crEye  = (...args)=>{ 
  let pwShown = 0;
  document.getElementById("eye").addEventListener(
    "click",
    function () {
      if (pwShown == 0) {
        pwShown = 1;
        show(args);
      } else {
        pwShown = 0;
        hide(args);
      }
    },
    false
  );
}}

$(function () {
  viewMainForm();
});
