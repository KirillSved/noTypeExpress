const { Router } = require("express");
const connection = require("../code/db_con.js").con;
const bcrypt = require("bcryptjs");
const path = require("path");
const router = Router();
const auth = require("../code/auth.js");
const formidable = require('formidable');
const parentPathFor = path.resolve(__dirname, "..");
const fs =  require("fs")
let fileHolderPath = "C:/Users/user/Pictures/TBD_SHVED/Data/"
router.get("/",(req,res)=>{

    let pathFor = path.resolve(parentPathFor,"public","FileEditor.html");
    res.status(200).sendFile(pathFor);

});

router.get("/getFiles", async (req, res, next) => {
    // const { login, password } = req.body;
    const [{role,login}]= await auth.auth(req)
    let permission = ''
    if (role === 'USER') permission = 'USER'
    else if (role === 'OPERATOR') permission = ['USER', 'OPERATOR']
    else if (role === 'ADMIN') permission = ['USER', 'OPERATOR', 'ADMIN']
    await connection
    .query("SELECT `id`,`file_path`,`order` FROM fileorder where `order` in (?)", [permission])
    .then(([results]) => {
      if (results.length == 0) {
        throw new Error("check correctnes data");
      }
      let dataCon = [];
      results.forEach(el => {
        console.log(el)
       
      });
      res.send(results)
    //   fs.readdir(fileHolderPath,(err,files)=>{
    //     console.log(files)
    //     files.forEach
    //   });
    //   res.send(results)
    })
    
})

router.post("/upload", async(req, res, next) => {
    // const { login, password } = req.body;
    const [{role,login}]= await auth.auth(req)
    // new formidable.IncomingForm().parse(req, (err, fields, files) => {
    //     if (err) {
    //       console.error('Error', err)
    //       throw err
    //     }
    //     console.log('Fields', fields)
    //     console.log('Files', files)
    //     for (const file of Object.entries(files)) {
    //         console.log(file)
    //       }
    //   })
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        file.path = fileHolderPath + file.name})

    .on('file', async(name, file) => {
      console.log('Uploaded file', name, file)
   
      let el =file.path
    await connection
    .query( 'Insert into fileorder (`file_path`, `order`) values (?,?);',[el,name])
    .then(([results]) => {
      if (results.length == 0) {
        res.status(200).send('sucsess with');
        
      }else{
        res.status(200).send('sucsess');
      }
     
      
       
}).catch((err)=>{
    if (error.code == "ER_DUP_ENTRY") {
        res.status(400).send("file olready exist");
      } else res.status(500).send(error.message);
    });
    });
})


router.get("/getFile/:id", async (req, res, next) => {
    // const { login, password } = req.body;
    const [{role,login}]= await auth.auth(req)
    await connection
    .query("SELECT `file_path` FROM fileorder where `id`  = ? ", req.params.id)
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send('check correctnes data');
        throw new Error("check correctnes data");
        
      }
      let dataCon = [];
      
      let el = results[0];
      const extension = path.extname(el.file_path).toLowerCase();
        let file = fs.readFileSync(el.file_path)
        console.log(file)
        let contentType = 'application/octet-stream';
        if (extension === '.txt') {
          contentType = 'text/plain';
        } else if (extension === '.png') {
          contentType = 'image/png';
        }

        res.setHeader('content-type', contentType);
        // Image size here
        //res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(file);
   
})
})
router.post('/delete/:id', async (req, res) => {
  const [{role}] = await auth.auth(req)
  const FilePath = req.body.name;
  let permission = ''
  if (role === 'USER') permission = 'USER'
  else if (role === 'OPERATOR') permission = ['USER', 'OPERATOR'] // and `order` in (?),permission
  else if (role === 'ADMIN') permission = ['USER', 'OPERATOR', 'ADMIN']
  await connection.query("DELETE FROM fileorder WHERE `id` = ? and `order` in (?);", [req.params.id, permission])
    .then(([results]) => {
        if (results.affectedRows == 0) {
            res.status(500).send('Internal server error');
          throw new Error("130 stage");
          
        }
     

        // const FilePath = results[0].file_path
        const fileName = path.basename(FilePath);
        console.log(FilePath)
        fs.unlink(FilePath, (err => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file:"+ fileName);
              res.send(`Deleted file:  ${fileName}`)
              // Get the files in current directory
              // after deletion
             
            }
          }));
        //const decrypted = await decryptFile(encryptedFilePath);

        //fs.writeFileSync( path.join("tmp", fileName), FilePath);
        // download file to client, file path is ../tmp/file
      
      })
      .catch ((err)=> {
        console.log(err);
        res.status(500).send('Internal server error');
      })
  })

router.get('/download/:id', async (req, res) => {
    const [{role,login}] = await auth.auth(req)
    let permission = ''
    if (role === 'USER') permission = 'USER'
    else if (role === 'OPERATOR') permission = ['USER', 'OPERATOR'] // and `order` in (?),permission
    else if (role === 'ADMIN') permission = ['USER', 'OPERATOR', 'ADMIN']
   await connection.query("SELECT file_path from fileorder where `id` = ? and `order` in (?)",[req.params.id, permission])
    .then(([results]) => {
        if (results.length == 0) {
            res.status(500).send('Internal server error');
          
          throw new Error("check correctnes data");
          
        }
        const FilePath = results[0].file_path
        //const decrypted = await decryptFile(encryptedFilePath);
        const fileName = path.basename(FilePath);
        console.log(FilePath)
        //fs.writeFileSync( path.join("tmp", fileName), FilePath);
        // download file to client, file path is ../tmp/file
        res.download(FilePath)
      })
      .catch ((err)=> {
        console.log(err);
        res.status(500).send('Internal server error');
      })
    })
   
 
module.exports = router