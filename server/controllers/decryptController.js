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


function decryptFunc(buffer, password) {
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = buffer.slice(0, 16);
    const encryptedData = buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
}


exports.decrypt = async (req, res) => {
    const file = req.files.file;
    const password = req.body.password;

    try {
        const originalExtension = file.name.split('.').pop(); // Получаем расширение файла
        const decrypted = decryptFunc(file.data, password);

        res.json({
            file: decrypted.toString('base64'),
            extension: `.${originalExtension}` // Возвращаем расширение файла
        });
    } catch (error) {
        res.status(400).json({ error: "Неверный пароль или поврежденный файл" });
    }
}


