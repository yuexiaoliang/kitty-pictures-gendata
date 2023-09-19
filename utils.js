const fs = require('fs');
const base64 = require('base64-js');
const { customAlphabet } = require('nanoid')

// 随机 ID
function genRandomID(len = 15) {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', len)

  return nanoid()
}

// 数组去重
function unique(arr) {
  return Array.from(new Set(arr));
}

// base64 转文件
function base64ToFile(base64String, filePath) {
  const byteArray = base64.toByteArray(base64String);
  fs.writeFileSync(filePath, byteArray);
}

// 随机文件名
function genRandomFileName(extension) {
  return genRandomID(15) + extension;
}

// 检测目录是否存在，如果不存在则创建
function checkDirExist(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 删除特殊字符
function excludeSpecialChar(str) {
  return str.replace(/[\\/:*?"<>|]/g, '');
}

module.exports = {
  unique,
  base64ToFile,
  genRandomID,
  genRandomFileName,
  checkDirExist,
  excludeSpecialChar
};
