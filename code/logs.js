const connection = require('../code/database2').con

module.exports.add = async function (d) {
  const toinsert = {}
  toinsert.type = d.type || 'VARIA'
  toinsert.description = d.description || ''
  toinsert.date_update = d.date_update || new Date()
  if (d.req) {
    toinsert.browser = parse_browser_data(d.req)
    toinsert.ulogid = d.req.cookies.ulogid ? d.req.cookies.ulogid : null
  }
  if (d.json_args) toinsert.json_args = JSON.stringify(d.json_args)
  if (d.user) {
    toinsert.user = d.user.login
  }

  connection.query('INSERT INTO logs SET ?', toinsert)
    .then(([rez]) => {})
    .catch(err => { console.log(err) })
}

// все запросы после auth, некоторые изза частоты игнорим
const ignore_url = ['/novyny-i-anonsy/total_count']
module.exports.add_user_log_post = async function (req, user) {
  if (ignore_url.includes(req.originalUrl)) return
  let json_args = req.body
  if (isEmpty(req.body)) {
    json_args = req.fields
  }
  if (req.originalUrl == '/admin/check') return
  module.exports.add({ type: 'USER_POST', description: req.originalUrl, req, user, json_args })
}
function isEmpty(obj) {
  if (!obj.__proto__) obj = JSON.parse(JSON.stringify(obj))
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) { return false }
  }
  return JSON.stringify(obj) === JSON.stringify({})
}

module.exports.addUserLogGet = async function (req, user) {
  if (req.method == 'POST') return
  if (ignore_url.includes(req.originalUrl)) return
  if (req.originalUrl.endsWith('.svg') || req.originalUrl.endsWith('.jpg') || req.originalUrl.endsWith('.png') || req.originalUrl.endsWith('.ico') || req.originalUrl.endsWith('.mp3')) return
  module.exports.add({ type: 'USER_GET', description: req.originalUrl, req, user, json_args: req.body })
}

function parse_browser_data(req) {
  const user_agent = req.headers?.['user-agent']
  const rez = {
    ip: req.ip
  }
  if (user_agent) rez['user-agent'] = user_agent
  return JSON.stringify(rez)
}
