const { Router } = require("express");
const connection = require("../code/db_con.js").con;
const bcrypt = require("bcryptjs");
const path = require("path");
const router = Router();
const auth = require("../code/auth.js");
const formidable = require("formidable");
const parentPathFor = path.resolve(__dirname, "..");
const fs = require("fs");
let fileHolderPath = "C:/Users/user/Pictures/TBD_SHVED/Data/";

router.get("/", (req, res) => {
  let pathFor = path.resolve(parentPathFor, "public", "FileEditor.html");
  res.status(200).sendFile(pathFor);
});

var exec = require("child_process").execFile;

async function getUserFilePermissions(fileId, user_id) {
  const ACMode = await getACMode();
  return new Promise(async (resolve, reject) => {
    let query = "";
    let params = [];
    if (ACMode === "dig") {
      query =
        "Select file_id, owner_id, user_id, `read`, `write`, `execute`, access_time_from, access_time_to from digorder where file_id in(?) and user_id = ?";
      params = [fileId, user_id];
    }
    await connection
      .query(query, params)
      .then(([results]) => {
        if (results.length === 0) {
          console.log("File not found");
          reject("File not found");
          return;
        }

        resolve({ result: results[0], mode: ACMode });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
        return;
      });
  });
}

async function GetManFileFromDatabase(user, file_id) {
  const mode = await getACMode();
  const manPermissions = await getAllManPermissionsForUser(user);
  //let userPer = await getAllPermissionsDACForUserid(userid);
  //const macPermissions = await getAllPermissionsMACForUser(user);

  return new Promise(async (resolve, reject) => {
    let query = "";
    let params =file_id ;
    if (user.role !== "ADMIN") {
      // if (user.role === 'ADMIN') query = 'Select `id`, file_path from fileorder';
      // else {
      query =
        "Select id,file_path,`order`, access_time_from, access_time_to from fileorder where id in(?);";

    
      // }
    } else {
      query =
      "Select id,file_path,`order`, access_time_from, access_time_to from fileorder where id in(?);";
    }
    await connection
      .query(query, file_id)
      .then(([results]) => {

        if (user.role !== "ADMIN" && user.role!=="SUPERADMIN")
          results = results.filter((file) => {
            const permission = manPermissions.find(
              (permission) =>
                permission.file_id === file.id &&
                permission.user_id === user.id_user
            );
            if (!permission) return false;

            return checkAccessTime(permission);
          });

        results = results.map((file) => {
          // find permissions for file
          let permission =
            user.role === "ADMIN" || user.role =="SUPERADMIN"
              ? returnFullPermissionDAC()
              : manPermissions.find(
                  (permission) =>
                    permission.file_id === file.id &&
                    permission.user_id === user.id_user
                );
          permission.symbolic = transformPermissionIntoSymbolic(permission);

          // repack results for client
          return {
            id: file.id,
            file_path: file.file_path, //path.basename(file.file_path),
            access_time_from:file.access_time_from,
            access_time_to:file.access_time_to,
            permission: permission,
          };
        });
      
        const transformedResults = {
          files: results,
          userFiles: "bres",
        };
        resolve(transformedResults);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
        return;
      });
  });
}
async function GetFileListFromDatabase(user, userid) {
  const mode = await getACMode();
  const dacPermissions = await getAllPermissionsDACForUser(user);
  let userPer = await getAllPermissionsDACForUserid(userid);
  //const macPermissions = await getAllPermissionsMACForUser(user);

  return new Promise(async (resolve, reject) => {
    let query = "";
    let params = [];
    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      // if (user.role === 'ADMIN') query = 'Select `id`, file_path from fileorder';
      // else {
      query =
        "Select `id`, file_path from fileorder where `id` in (Select file_id from digorder where user_id = ? and `read` = 1);";

      params = [user.id_user];
      // }
    } else {
      query =
        "Select `id`, file_path from fileorder where `id` in (Select file_id from digorder where `read` = 1);";
    }
    await connection
      .query(query, params)
      .then(([results]) => {
        let bres = results.filter((file) => {
          const permission = userPer.find(
            (permission) =>
              permission.file_id === file.id && permission.user_id == userid
          );
          if (!permission) return false;

          return checkAccessTime(permission);
        });

        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN")
          results = results.filter((file) => {
            const permission = dacPermissions.find(
              (permission) =>
                permission.file_id === file.id &&
                permission.user_id === user.id_user
            );
            if (!permission) return false;

            return checkAccessTime(permission);
          });

        results = results.map((file) => {
          // find permissions for file
          let permission =
            user.role == "ADMIN" || user.role == "SUPERADMIN"
              ? returnFullPermissionDAC()
              : dacPermissions.find(
                  (permission) =>
                    permission.file_id === file.id &&
                    permission.user_id === user.id_user
                );
          permission.symbolic = transformPermissionIntoSymbolic(permission);

          // repack results for client
          return {
            id: file.id,
            file_path: file.file_path, //path.basename(file.file_path),
            permission: permission,
          };
        });
        if (userPer.length != 0) {
          bres = bres.map((file) => {
            let permission = userPer.find(
              (permission) =>
                permission.file_id === file.id && permission.user_id == userid
            );
            permission.symbolic = transformPermissionIntoSymbolic(permission);

            // repack results for client
            return {
              id: file.id,
              file_path: file.file_path, //path.basename(file.file_path),
              permission: permission,
            };
          });
        }
        const transformedResults = {
          files: results,
          userFiles: bres,
        };
        resolve(transformedResults);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
        return;
      });
  });
}

async function getFileFromDatabase(file_id, user_id) {
  const mode = await getACMode();
  const dacPermissions = await getAllPermissionsDACForUser(user);
  let userPer = await getAllPermissionsDACForUserid(userid);
  //const macPermissions = await getAllPermissionsMACForUser(user);

  return new Promise(async (resolve, reject) => {
    let query = "";
    let params = [];
    if (user.role !== "ADMIN") {
      // if (user.role === 'ADMIN') query = 'Select `id`, file_path from fileorder';
      // else {
      query =
        "Select `id`, file_path from fileorder where `id` in (Select file_id from digorder where user_id = ? and `read` = 1);";

      params = [id_user];
      // }
    } else {
      query =
        "Select `id`, file_path from fileorder where `id` in (Select file_id from digorder where `read` = 1);";
    }
    await connection
      .query(query, params)
      .then(([results]) => {
        let bres = results.filter((file) => {
          const permission = userPer.find(
            (permission) =>
              permission.file_id === file.id && permission.user_id == userid
          );
          if (!permission) return false;

          return checkAccessTime(permission);
        });

        if (user.role !== "ADMIN")
          results = results.filter((file) => {
            const permission = dacPermissions.find(
              (permission) =>
                permission.file_id === file.id &&
                permission.user_id === user.id_user
            );
            if (!permission) return false;

            return checkAccessTime(permission);
          });

        results = results.map((file) => {
          // find permissions for file
          let permission =
            user.role === "ADMIN"
              ? returnFullPermissionDAC()
              : dacPermissions.find(
                  (permission) =>
                    permission.file_id === file.id &&
                    permission.user_id === user.id_user
                );
          permission.symbolic = transformPermissionIntoSymbolic(permission);

          // repack results for client
          return {
            id: file.id,
            file_path: file.file_path, //path.basename(file.file_path),
            permission: permission,
          };
        });
        if (userPer.length != 0) {
          bres = bres.map((file) => {
            let permission = userPer.find(
              (permission) =>
                permission.file_id === file.id && permission.user_id == userid
            );
            permission.symbolic = transformPermissionIntoSymbolic(permission);

            // repack results for client
            return {
              id: file.id,
              file_path: file.file_path, //path.basename(file.file_path),
              permission: permission,
            };
          });
        }
        const transformedResults = {
          files: results,
          userFiles: bres,
        };
        resolve(transformedResults);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
        return;
      });
  });
}

function returnFullPermissionDAC() {
  return {
    read: 1,
    write: 1,
    execute: 1,
  };
}

async function getACMode() {
  return await connection
    .query("SELECT `mod` FROM workmod where `id` = 1")
    .then(([results]) => {
      return results[0].mod;
    })
    .catch((err) => {
      console.log(err);

      return;
    });
}

async function getAllPermissionsDACForUser(user) {
  return await connection
    .query("SELECT * FROM digorder where user_id = ?", [user.id_user])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);

      return;
    });
}
async function getAllManPermissionsForUser(user) {
  let permission = "";
  let role = user.role;
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  return await connection
    .query("SELECT * FROM fileorder where  `order` in (?)", [permission])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);

      return;
    });
}
async function getAllPermissionsDACForUserid(userid) {
  return await connection
    .query("SELECT * FROM digorder where user_id = ?", [userid])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);

      return;
    });
}
async function checkFileAccessPermission(fileId, user, action) {
  try {
    // If the user is an admin, allow full access
    if (user.role === "admin") return true;

    // Get file permissions for the user
    const filePermissions = await getUserFilePermissions(fileId, user);

    // Check the type of file permissions and call the appropriate function to check for access
    if (filePermissions.mode === "DAC") {
      if (action === "change")
        return filePermissions.result.owner_id === user.id;
      return checkDacPermissions(filePermissions.result, user, action);
    } else if (filePermissions.mode === "MAC") {
      return checkMacPermissions(filePermissions.result, user);
    }

    // If file permissions are not defined or unrecognized, deny access
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getUserById(userId) {
  return await connection
    .query("Select id_user, name, role from users where id_user = ?", [userId])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);
      // reject(err)
      return;
    });
}
async function SetFilePermission(fileId, owner, userId, newPermissions) {
  try {
    //if (!await checkFileAccessPermission(fileId, owner, 'change')) return Promise.reject('Access denied');

    const user = await getUserById(userId);
    //owner = await getUserById(6);
    // Get file permissions for the user, if getUsersFilePermissions returns an error, then user does not have permissions to this file yet
    const filePermissions = await getUserFilePermissions(fileId, user[0].id_user).catch(
      (err) => {
        return null;
      }
    );

    return new Promise(async (resolve, reject) => {
      let query = "";
      let params = [];
      if (!filePermissions) {
        query =
          "INSERT INTO digorder (file_id, owner_id, user_id, `read`, `write`, `execute`, access_time_from, access_time_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        params = [
          fileId,
          owner.id_user,
          user[0].id_user,
          newPermissions.read ? newPermissions.read : 0,
          newPermissions.write ? newPermissions.write : 0,
          //newPermissions.delete? newPermissions.delete: 0,
          newPermissions.execute ? newPermissions.execute : 0,
          newPermissions.access_time_from,
          newPermissions.access_time_to,
        ];
      } else {
        query =
          "UPDATE digorder SET `read` = ?, `write` = ?, `execute` = ?, access_time_from = ?, access_time_to = ? WHERE file_id = ? AND user_id = ?";
        params = [
          // newPermissions.read ? filePermissions.result.read  : newPermissions.read ,
          // newPermissions.write ? filePermissions.result.write  : newPermissions.write,
          // newPermissions.execute
          //   ? filePermissions.result.execute
          //   : newPermissions.execute,
          newPermissions.read ? newPermissions.read : 0,
          newPermissions.write ? newPermissions.write : 0,
          //newPermissions.delete? newPermissions.delete: 0,
          newPermissions.execute ? newPermissions.execute : 0,

          newPermissions.access_time_from,
          newPermissions.access_time_to,
          fileId,
          user[0].id_user,
        ];
      }
      await connection
        .query(query, params)
        .then(([results]) => {
          if (results.affectedRows === 0) {
            console.log("File not found");
            reject("File not found");
            return;
          }
          resolve("File permissions updated successfully");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
          return;
        });
    });
  } catch (err) {
    // error list: File not found, Access denied
    console.log({ function: "SetFilePermission", err });
    return Promise.reject(err);
  }
}

function checkAccessTime(permissions) {
  const dateNow = new Date();
  const userTimeAccessFrom = getDateFromTimeString(
    permissions.access_time_from
  );
  const userTimeAccessTo = getDateFromTimeString(permissions.access_time_to);

  // Check if the current time falls within the user's access time range for the file
  return dateNow >= userTimeAccessFrom && dateNow <= userTimeAccessTo;
}
function getDateFromTimeString(time) {
  const date = new Date();
  const timeArr = time.split(":");
  date.setHours(timeArr[0]);
  date.setMinutes(timeArr[1]);

  return date;
}

function transformPermissionIntoSymbolic(permission) {
  let symbolicPermission = "";
  if (permission.read) symbolicPermission += "r";
  if (permission.write) symbolicPermission += "w";
  if (permission.execute) symbolicPermission += "x";

  return symbolicPermission;
}


async function SetNewACMode(mode) {
  return new Promise(async(resolve, reject) => {
     await connection.query('UPDATE `workmod` SET `mod` = ? WHERE `id` =1',[mode] )
     .then(([results]) => {
    
      if (results.affectedRows === 0) {
        console.log('File not found');
        reject('File not found');
        return;
      }
      resolve('File permissions updated successfully');
    }).catch((err)=>{
      console.log(err);
      reject(err);
      return;
    });
  });
}
router.post("/setNewMode", async (req, res, next) => {
let mode = req.body.workmod;

SetNewACMode(mode)
.then((results) => {
res.send(results)
}).catch((err)=>{

})

})
router.get("/getdigFiles", async (req, res, next) => {
  // const { login, password } = req.body;
  var userrr = await auth.auth(req).then((u) => {
    return u[0];
  });
  GetFileListFromDatabase(userrr)
    .then((resFor) => {
      res.send(resFor);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });

  // await connection
  // .query("SELECT `id`,`file_path`,`order` FROM fileorder where `order` in (?)", [permission])
  // .then(([results]) => {
  //   if (results.length == 0) {
  //     res.status(500).send('check correctnes data');
  //     throw new Error("check correctnes data");
  //   }
  //   // let dataCon = [];
  //   // results.forEach(el => {
  //   //   console.log(el)

  //   // });
  //   res.send(results)
  // //   fs.readdir(fileHolderPath,(err,files)=>{
  // //     console.log(files)
  // //     files.forEach
  // //   });
  // //   res.send(results)
  // }).catch((err)=>{
  //   res.status(500).send('check correctnes data');
  //   throw new Error("check correctnes data");
  // })
});
router.get("/getAllFilesToSet/:id", async (req, res, next) => {
  // const { login, password } = req.body;
  var userrr = await auth.auth(req).then((u) => {
    return u[0];
  });
  GetFileListFromDatabase(userrr) //,req.params.id)
    .then((resFor) => {
      res.send(resFor);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });
});
router.post("/getAllFilesToSet", async (req, res, next) => {
  // const { login, password } = req.body;
  const { file_id, user_id } = req.body;
  var userrr = await auth.auth(req).then((u) => {
    return u[0];
  });
 GetFileListFromDatabase(userrr) //,req.params.id)
    .then((resFor) => {
      res.send(resFor);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });
});

router.post("/getFilePer", async (req, res, next) => {
  // const { login, password } = req.body;
  const { file_id, user_id } = req.body;
  var userrr = await auth.auth(req).then((u) => {
    return u[0];
  });
 GetManFileFromDatabase(userrr,file_id) //,req.params.id)
    .then((resFor) => {
      res.send(resFor);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });
});
router.get("/getUserFiles/:id", async (req, res, next) => {
  // const { login, password } = req.body;
  var userrr = await auth.auth(req).then((u) => {
    return u[0];
  });
  GetFileListFromDatabase(userrr, req.params.id)
    .then((resFor) => {
      res.send(resFor.userFiles);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });

  // await connection
  // .query("SELECT `id`,`file_path`,`order` FROM fileorder where `order` in (?)", [permission])
  // .then(([results]) => {
  //   if (results.length == 0) {
  //     res.status(500).send('check correctnes data');
  //     throw new Error("check correctnes data");
  //   }
  //   // let dataCon = [];
  //   // results.forEach(el => {
  //   //   console.log(el)

  //   // });
  //   res.send(results)
  // //   fs.readdir(fileHolderPath,(err,files)=>{
  // //     console.log(files)
  // //     files.forEach
  // //   });
  // //   res.send(results)
  // }).catch((err)=>{
  //   res.status(500).send('check correctnes data');
  //   throw new Error("check correctnes data");
  // })
});
router.post("/setOrder/:id", async (req, res) => {
  var owner = await auth.auth(req).then((u) => {
    return u[0];
  });
  let role = owner.role;
  const { id, id_user, newPermissions } = req.body;

  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await SetFilePermission(id, owner, id_user, newPermissions)
    .then((resFor) => {
      res.send(resFor);
      console.log(resFor);
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });
});

router.get("/getFiles", async (req, res, next) => {
  // const { login, password } = req.body;
  const [{ role, login }] = await auth.auth(req);
  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR") permission = ["USER", "OPERATOR"];
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];
  await connection
    .query(
      "SELECT `id`,`file_path`,`order`,`access_time_from`,`access_time_to` FROM fileorder where `order` in (?)",
      [permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("check correctnes data");
        throw new Error("check correctnes data");
      }
      if(role!="ADMIN" && role!="SUPERADMIN"){
      results = results.filter((file) => {
        return checkAccessTime(file);
      });
    
    }
      // let dataCon = [];
      // results.forEach(el => {
      //   console.log(el)

      // });
      res.send(results);
      //   fs.readdir(fileHolderPath,(err,files)=>{
      //     console.log(files)
      //     files.forEach
      //   });
      //   res.send(results)
    })
    .catch((err) => {
      res.status(500).send("check correctnes data");
      throw new Error("check correctnes data");
    });
});

router.post("/upload", async (req, res, next) => {
  // const { login, password } = req.body;
  let mode = await getACMode()
  const [{ id_user, role, login }] = await auth.auth(req);
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
  new formidable.IncomingForm()
    .parse(req)
    .on("fileBegin", (name, file) => {
      file.path = fileHolderPath + file.name;
    })

    .on("file", async (name, file) => {
      console.log("Uploaded file", name, file);

      let el = file.path;
      if (mode == "dig") {
        name = role;
      }
      await connection
        .query("Insert into fileorder (`file_path`, `order`) values (?,?);", [
          el,
          name,
        ])
        .then(async ([results]) => {
          if (results.length == 0) {
            res.status(200).send("sucsess with it");
          } else {
            await connection.query(
              "INSERT INTO digorder (file_id, owner_id, user_id, `read`, `write`, `execute`, access_time_from, access_time_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [results.insertId, id_user, id_user, 1, 1, 1, "00:00", "23:59"]
            );
            res.status(200).send("sucsess with norm");
          }
        })
        .catch((err) => {
          if (err.code == "ER_DUP_ENTRY") {
            res.status(400).send("file olready exist");
          } else res.status(500).send(err.message);
          throw new Error(err.message);
        });
    });
});

router.get("/getFile/:id", async (req, res, next) => {
  // const { login, password } = req.body;
  const [{ role, login }] = await auth.auth(req);
  await connection
    .query("SELECT `file_path` FROM fileorder where `id`  = ? ", req.params.id)
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("check correctnes data");
        throw new Error("check correctnes data");
      }
      let dataCon = [];

      let el = results[0];
      const extension = path.extname(el.file_path).toLowerCase();
      let file = fs.readFileSync(el.file_path);
      console.log(file);
      let contentType = "application/octet-stream";
      if (extension === ".txt") {
        contentType = "text/plain";
      } else if (extension === ".png") {
        contentType = "image/png";
      }else if (extension === ".jpg") {
        contentType = "image/jpg";
      }else if (extension === ".exe") {
        contentType = "excute/file";
      }

      res.setHeader("content-type", contentType);
      // Image size here
      //res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(file);
    });
});
router.post("/updateUser/:id", async (req, res) => {
  const [{ role }] = await auth.auth(req);
  const newRole = req.body.data;

  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query(
      "UPDATE `users` SET `role` = ? WHERE `id_user` =? and `role` in (?);",
      [newRole, req.params.id, permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("Internal server error");
        throw new Error("130 stage");
      } else {
        res.send("Change complete");
      }

      // const FilePath = results[0].file_path

      //const decrypted = await decryptFile(encryptedFilePath);

      //fs.writeFileSync( path.join("tmp", fileName), FilePath);
      // download file to client, file path is ../tmp/file
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});
router.post("/updateManFile/:id", async (req, res) => {
  const [{ role }] = await auth.auth(req);
  const {id,id_user,data} = req.body;

  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query(
      "UPDATE `fileorder` SET `order` = ?, `access_time_from` = ?, `access_time_to` = ? WHERE `id` =? and `order` in (?);",
      [data.order,data.access_time_from,data.access_time_to, req.params.id, permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("Internal server error");
        throw new Error("130 stage");
      } else {
        res.send("Change complete");
      }

      // const FilePath = results[0].file_path

      //const decrypted = await decryptFile(encryptedFilePath);

      //fs.writeFileSync( path.join("tmp", fileName), FilePath);
      // download file to client, file path is ../tmp/file
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});
router.post("/updateFile/:id", async (req, res) => {
  const [{ role }] = await auth.auth(req);
  const newFile = req.body.data;

  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query(
      "SELECT file_path from fileorder where `id` = ? and `order` in (?)",
      [req.params.id, permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("Internal server error");
        throw new Error("160 stage");
      }

      const FilePath = results[0].file_path;
      const fileName = path.basename(FilePath);
      console.log(FilePath);
      fs.writeFile(FilePath, newFile, function (error) {
        if (error) {
          res.status(500).send("bedWriteFile");
          throw new Error("160 stage");
        } // если возникла ошибка
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});
router.post("/delete/:id", async (req, res) => {
  const [{ role }] = await auth.auth(req);
  const FilePath = req.body.name;
  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query("DELETE FROM fileorder WHERE `id` = ? and `order` in (?);", [
      req.params.id,
      permission,
    ])
    .then(([results]) => {
      if (results.affectedRows == 0) {
        res.status(500).send("Internal server error");
        throw new Error("130 stage");
      }

      // const FilePath = results[0].file_path
      const fileName = path.basename(FilePath);
      console.log(FilePath);
      fs.unlink(FilePath, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file:" + fileName);
          res.send(`Deleted file:  ${fileName}`);
          // Get the files in current directory
          // after deletion
        }
      });
      //const decrypted = await decryptFile(encryptedFilePath);

      //fs.writeFileSync( path.join("tmp", fileName), FilePath);
      // download file to client, file path is ../tmp/file
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

router.post("/deleteUser/:id", async (req, res) => {
  const [{ role }] = await auth.auth(req);
  const deleteLogin = req.body.login;
  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query("DELETE FROM users WHERE `id_user` = ? and `role` in (?);", [
      req.params.id,
      permission,
    ])
    .then(([results]) => {
      if (results.affectedRows == 0) {
        res.status(500).send("Internal server error");
        throw new Error("130 stage");
      }

      res.send(`User was deleted ${deleteLogin}`);
      // const FilePath = results[0].file_path
      // const fileName = path.basename(FilePath);
      // console.log(FilePath)

      //const decrypted = await decryptFile(encryptedFilePath);

      //fs.writeFileSync( path.join("tmp", fileName), FilePath);
      // download file to client, file path is ../tmp/file
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

router.get("/download/:id", async (req, res) => {
  const [{ role, login }] = await auth.auth(req);
  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR")
    permission = ["USER", "OPERATOR"]; // and `order` in (?),permission
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query(
      "SELECT file_path from fileorder where `id` = ? and `order` in (?)",
      [req.params.id, permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send("Internal server error");

        throw new Error("check correctnes data");
      }
      const FilePath = results[0].file_path;
      //const decrypted = await decryptFile(encryptedFilePath);
      const fileName = path.basename(FilePath);
      console.log(FilePath);
      //fs.writeFileSync( path.join("tmp", fileName), FilePath);
      // download file to client, file path is ../tmp/file
      res.download(FilePath);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

router.get("/getUsers", async (req, res) => {
  const [{ role, login }] = await auth.auth(req);
  let permission = "";
  if (role === "USER") permission = "USER";
  else if (role === "OPERATOR") permission = ["USER", "OPERATOR"];
  else if (role === "ADMIN") permission = ["USER", "OPERATOR", "ADMIN"];
  else if (role === "SUPERADMIN") permission = ["USER", "OPERATOR", "ADMIN","SUPERADMIN"];

  await connection
    .query(
      "SELECT `id_user`,`name`, `login`, `role` FROM users where role in(?);",
      [permission]
    )
    .then(([results]) => {
      if (results.length == 0) {
        throw new Error("check correctnes data");
      }

      res.send(results);
      //   fs.readdir(fileHolderPath,(err,files)=>{
      //     console.log(files)
      //     files.forEach
      //   });
      //   res.send(results)
    });
});

router.post("/getRole", (req, res) => {
  auth
    .auth(req)
    .then((u) => {
      res.json(u[0].role);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
router.post("/getMode", async (req, res) => {
  const mode = await getACMode();
  if (mode) {
    res.send(mode);
  } else {
    res.status(500).send("HAVE NOT WORK MODE");
  }
});
//   router.get('/getdigUsers', async (req, res) => {

//     const [{role,login}]= await auth.auth(req)
//     let permission = ''
//     if (role === 'USER') permission = 'USER'
//     else if (role === 'OPERATOR') permission = ['USER', 'OPERATOR']
//     else if (role === 'ADMIN') permission = ['USER', 'OPERATOR', 'ADMIN']
//     await connection
//     .query("SELECT `id_user`,`name`, `login`, `role` FROM users where role in(?);", [permission])
//     .then(([results]) => {
//       if (results.length == 0) {
//         throw new Error("check correctnes data");
//       }

//       res.send(results)
//     //   fs.readdir(fileHolderPath,(err,files)=>{
//     //     console.log(files)
//     //     files.forEach
//     //   });
//     //   res.send(results)
//     })

// });

module.exports = router;
