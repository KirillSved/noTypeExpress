

//------------ функция для того чтобы изменить состояние страницы в случае разраничения ролей она должна определять скрываемые елементы 
function changeDOMAuth () {
    // .show4auth
    // .hide4auth
    let needshow = document.getElementsByClassName('show4auth')
    let needhide = document.getElementsByClassName('hide4auth')
    if (!isAuth) [needshow, needhide] = [needhide, needshow]
    for (const e of needshow) e.hidden = false
    for (const e of needhide) e.hidden = true
  
}
//------------ функция  для проверки наличия токена 
let isAuth = false
async function changeAuthView () {
  if (!getCookie('authorization')) {
    changeDOMAuthView()
    return
  }
    else{
      document.getElementById('exitplace').innerHTML = `<button class="btn btn-danger" onclick="UserLogout()" type="button">Вийти</button>`
    }
  await fetchPost('/admin/check', {}, true)
    .then(login => {
      isAuth = true
      changeDOMAuthView()
    })
    .catch(_ => {
      isAuth = false
      changeDOMAuthView()
      setCookie('authorization', "")
    })
}
//-----------
// goto login page on error
function checkAuthToken(err) {
    if (err.message === 'Auth token is not supplied' ||
      err.message === 'invalid signature' ||
      err.message === 'No such user, was deleted?' ||
      err.message === 'jwt expired' ||
      err.message.indexOf('TokenExpiredError') > 0) {
      // if(err.message.indexOf("TokenExpiredError") > 0) alert("Сессiя закiнчилася")
      // if(err.message == "jwt expired") alert("Сессiя закiнчилася")
      window.location.href = '/login'
    }
  }
  

window.UserLogout = () => {
    deleteCookie("authorization")
    document.location.reload()
  }
  