//import { v4 as uuidv4 } from 'uuid'
const uuidv4 = require("uuid").v4
/* global moment */

function makeToast (args) {
  const id = uuidv4()
  let color = ''
  if (args.type) color = `bg-${args.type} text-white`
  let toasts = document.getElementById('toasts')
  if (!toasts) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="toasts" class="toast-container" style="position: absolute;z-index: 10000;right: 1em;top:1em"></div>'
    )
    toasts = document.getElementById('toasts')
  }
  let delay = args.data_delay || 100000
  if (delay < 100) delay = 100

  toasts.innerHTML = `
<div class="toast show" id="${id}" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header ${color}">
    <strong class="me-auto">${args.header || ''}</strong>
    <small>${moment(new Date()).format('HH:mm:ss')}</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрити" onclick="this.parentElement.parentElement.remove()"></button>
  </div>
  <div class="toast-body">${args.body}</div>
</div>` + toasts.innerHTML
  setTimeout(() => { document.getElementById(id).remove() }, delay)
}

// makeToast({ header: "Тема", body: "тело", type: "warning" }) type: warning success danger (bg-)
async function fetchPost (url, data = {}, toastError) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return await readRezult(response, toastError) // or => const rez = await response.json()
//   if (!response.ok) {
//     if (toastError) makeToast({ header: 'Помилка', body: rez.message, type: 'danger', data_delay: 7000 })
//     throw rez // prevent then
//   }
//   return rez
}

async function fetchGet (url, toastError) {
  const response = await fetch(url)
  return await readRezult(response)
}

async function readRezult (response, toastError) {
  let rez = await response.text()
  try {
    rez = JSON.parse(rez)
  } catch { }
  if (!response.ok) {
    const body = typeof rez === 'string' ? rez : rez.message
    if (toastError) makeToast({ header: 'Помилка', body, type: 'danger', data_delay: 7000 })
    throw rez // prevent then
  }
  return rez
}

function loadScript (src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    document.head.append(script)
    script.onload = function () {
      resolve()
    }
  })
}

function setCookie(name, value) {
  document.cookie = name +"="+ escape(value) +
      ";path=/"
}

function deleteCookie(name) {
  setCookie(name, "");
}

function getCookie (name) {
  const matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ))
  return matches ? stringToType(decodeURIComponent(matches[1])) : undefined
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function stringToType (s) {
  s = s === 'undefined' ? undefined : s
  s = s === 'null' ? null : s
  s = s === 'true' ? null : s
  s = s === 'false' ? null : s
  return s
}

function getUrlParameter (name) {
  let result = null; let tmp = []
  const items = location.search.substr(1).split('&')
  for (let index = 0; index < items.length; index++) {
    tmp = items[index].split('=')
    if (tmp[0] === name) result = decodeURIComponent(tmp[1])
  }
  return result
}

function setUrlParameter (key, value) {
  key = encodeURIComponent(key)
  value = encodeURIComponent(value)

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp = document.location.search.substr(1).split('&')
  let i = 0

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key + '=')) {
      const pair = kvp[i].split('=')
      pair[1] = value
      kvp[i] = pair.join('=')
      break
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = [key, value].join('=')
  }

  // can return this or...
  const params = kvp.join('&')

  // reload page with new params
  document.location.search = params
}

function RandomString (length) { 
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function fallbackCopyTextToClipboard (text) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

function copyTextToClipboard (text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(function () {
    // console.log('Async: Copying to clipboard was successful!');
    makeToast({ header: 'Зкопійовано посиляння', body: text, type: 'success', data_delay: 100 })
  }, function (err) {
    console.error('Async: Could not copy text: ', err)
  })
}

const mySessionStorage = {
  getItem: function (key) {
    let val = sessionStorage.getItem(key)
    if (val === 'true') return true
    if (val === 'false') return false
    try { parseInt(val); val = parseInt(val); return val } catch { }
    try { parseFloat(val); val = parseFloat(val); return val } catch { }
    return val
  },
  setItem: function (key, value) {
    sessionStorage.setItem(key, value)
  }
}

//export { fetchPost, fetchGet, makeToast, setCookie, getCookie, deleteCookie, stringToType, loadScript, getUrlParameter, setUrlParameter, copyTextToClipboard, mySessionStorage, sleep, RandomString }
