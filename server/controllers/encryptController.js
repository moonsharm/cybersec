const express = require("express");
const fileUpload = require("express-fileupload");
const crypto = require("crypto");
const cors = require("cors");  // Подключаем CORS
const app = express();

// Включаем CORS для всех маршрутов
app.use(cors());
app.use(fileUpload());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Original-Extension");
    next();
});

const algorithm = 'aes-256-cbc';

function encryptFunc(buffer, password) {
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return encrypted;
}
exports.encrypt = async (req, res) => {
    const file = req.files.file;
    const password = req.body.password;

    const originalExtension = file.name.split('.').pop();
    const encrypted = encryptFunc(file.data, password);

    res.setHeader("Content-Disposition", "attachment; filename=encrypted_file");
    res.json({
        file: encrypted.toString('base64'),
        extension: `.${originalExtension}`
    });
}



