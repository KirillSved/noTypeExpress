
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