const imagesRouter = require("express").Router()
const jwt = require('jsonwebtoken')
const config = require('../config')

const multer = require('multer');
const path = require('path');
const os = require('os');
const baseDir = config.UPLOAD_DIR || os.homedir();
const fs = require('fs');
let username;

// 设置 multer 的存储方式为磁盘存储方式
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const token = req.token;
        const decodedToken = jwt.verify(token, config.SECRET);
        username = decodedToken.username;
        const dir = path.join(baseDir, 'images', username);

        // 如果目录不存在，创建目录
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const date = Date.now();
        const name = path.parse(file.originalname).name;
        const ext = path.parse(file.originalname).ext;
        const newName = `${name}-${date}${ext}`;
        cb(null, newName);
    }
});

const upload = multer({
    storage: storage, limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

imagesRouter.post('/', upload.single('file'), async (request, response) => {
    const file = request.file;
    if (!file) {
        return response.status(400).json({error: 'No file uploaded'});
    }
    // 返回文件的访问路径（统一使用正斜杠，Windows 下 path.join 会生成反斜杠导致 URL 404）
    const url = `${request.protocol}://${request.get('host')}/images/${username}/${file.filename.split('\\').join('/')}`;
    response.json({success: true, imageUrl: url});
});


module.exports = imagesRouter
