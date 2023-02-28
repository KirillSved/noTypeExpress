

// функции проверки и прогрузки страницы пользователя 
async function start () {
    await loadView()
    if (isAuth) {
      document.getElementById('editpageplace').innerHTML = `<button class="btn btn-warning" id="editpencil" type="button" data-bs-toggle="modal" data-bs-target="#editpageModal"><i class="bi bi-pencil"></i> Редагувати сторінку</button>`
      const editpencil = document.getElementById('editpencil')
      editpencil.onclick = async () => {
        window.location.href = window.location.href.replace('/page', '/editpage')
      }
    }
  }
  
  /// загрузка основной части представления для Пользователя
  async function loadView () {
    const url = window.location.pathname.replace('/page/', '')
    const pagename = `/page/getpage?id=${url}`
    let page = await fetchGet(pagename)
      .catch(_ => { })
    if (!page) page = { content: 'Сторінки не знайдено!', name: '' }
    document.getElementById('content').innerHTML = page.content
    let m0MenuName = ''
    const m0Menu = document.querySelector('.navbar').querySelector(`a[href*=${url}]`).parentElement.parentElement.parentElement
    if (m0Menu.localName === 'li') { // есть подменюшки
      const ar = [...m0Menu.children[1].children].map(e => [e.firstElementChild.innerHTML, e.firstElementChild.getAttribute('href')])
      document.getElementById('helpmenu').innerHTML = ar.map(li =>
        `<a href="${li[1]}" class="list-group-item list-group-item-action">${li[0]}</a>`
      ).join('')
      document.getElementById('helpmenu').querySelector(`a[href*=${url}]`).classList.add('active')
  
      m0MenuName = `${m0Menu.firstElementChild.innerText} / `
    } else {
      document.getElementById('helpmenu').parentNode.remove()
    }
  
    const m1MenuName = document.querySelector('.navbar').querySelector(`a[href*=${url}]`).innerText
    document.getElementById('pageTitle').innerHTML = `${page.name || m1MenuName}`
    if (page.dir_tree) {
      const url = window.location.pathname.replace('/page/', '/pages/')
      directoryViewer('#dirTreePlace', { path: `${url}${page.dir_tree}`, editable: false })
    }
  }
  