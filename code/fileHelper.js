const connection = require('../connection');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const auth = require('../code/auth');
const { resolve } = require('path');
var exec = require('child_process').execFile;


async function getUserFilePermissions(fileId, user){
    const ACMode = await getACMode();
    return new Promise((resolve, reject) => {
      let query = '';
      let params = [];
       if (ACMode === 'DAC') {
         query =
           'Select file_id, owner_id, user_id, `read`, `write`, `delete`, `execute`, access_time_from, access_time_to from file_permissions_dac where file_id = ? and user_id = ?';
         params = [fileId, user.id];
       } else if (ACMode === 'MAC') {
         query =
           'Select id, file_id, mandate from file_permissions_mac where file_id = ? and mandate in (?)';
         const mandatePermissions = auth.getUserPermissions(user.role);
         params = [fileId, mandatePermissions];
       }
       await connection
    .query(query, params)
    .then(([results]) => {
        if (results.length === 0) {
            console.log('File not found');
            reject('File not found');
            return;}

       resolve({result:results[0], mode: ACMode});
    }).catch((err)=>{
        console.log(err);
      reject(err)
      return;
    })
      
      
    });
  }
async function GetFileListFromDatabase(user){
    const mode = await getACMode();
    const dacPermissions = await getAllPermissionsDACForUser(user);
    //const macPermissions = await getAllPermissionsMACForUser(user);
  
    return new Promise((resolve, reject) => {
      let query = '';
      let params = [];
      if (mode === 'DAC') {
        if (user.role === 'admin') query = 'Select `id`, file_path from fileorder';
        else {
          query =
            'Select `id`, file_path from fileorder where `id` in (Select file_id from digorder where user_id = ? and `read` = 1);';
          params = [user.id];
        }
      } 
      await connection
    .query(query, params)
    .then(([results]) => {
        if (user.role !== 'ADMIN')
        results = results.filter((file) => {
          const permission = dacPermissions.find(
            (permission) => permission.file_id === file.file_id && permission.user_id === user.id,
          );
          if (!permission) return false;

         return checkAccessTime(permission);
        });

      results = results.map((file) => {
        // find permissions for file
        let permission =
          user.role === 'admin'
            ? returnFullPermissionDAC()
            : dacPermissions.find(
                (permission) =>
                  permission.file_id === file.file_id && permission.user_id === user.id,
              );
        permission.symbolic = transformPermissionIntoSymbolic(permission);

        // repack results for client
        return {
          id: file.file_id,
          fileName: path.basename(file.file_path),
          permission: permission,
        };
      });
      const transformedResults = {
        files: results,
        mode: mode,
      }
      resolve(transformedResults);

    }).catch((err)=>{
        console.log(err);
      reject(err)
      return;
    })
    });
  }

  function returnFullPermissionDAC(){
    return {
      read: 1,
      write: 1,
      delete: 1,
      execute: 1
    }
  }
  
  function getACMode(){
    return  await connection
    .query("SELECT `mode` FROM workmod where `id` = 1")
    .then(([results]) => {
      
      resolve(results[0].mode)
    }).catch((err)=>{
        console.log(err);
      reject(err)
      return;
    })
  }

  async function getAllPermissionsDACForUser(user){
    return  await connection
    .query("SELECT * FROM digorder where user_id = ?",[user.id])
    .then(([results]) => {
      
      resolve(results)
    }).catch((err)=>{
        console.log(err);
      reject(err)
      return;
    })
  }
 
 function checkAccessTime(permissions) {
  const dateNow = new Date();
  const userTimeAccessFrom = getDateFromTimeString(permissions.access_time_from);
  const userTimeAccessTo = getDateFromTimeString(permissions.access_time_to);

  // Check if the current time falls within the user's access time range for the file
  return dateNow >= userTimeAccessFrom && dateNow <= userTimeAccessTo;
}

function transformPermissionIntoSymbolic(permission){

    let symbolicPermission = '';
    if (permission.read) symbolicPermission += 'r';
    if (permission.write) symbolicPermission += 'w';
    if (permission.delete) symbolicPermission += 'd';
    if (permission.execute) symbolicPermission += 'x';

  return symbolicPermission;
}