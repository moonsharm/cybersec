const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const path = require("path");

const domainRoutes = require('./routes/domainRoutes');
const fileProcessingRoute = require("./routes/metaRoutes");
const encryptRoute = require("./routes/encryptRoutes");
const decryptRoute = require("./routes/decryptRoutes");
const anonimityRoute = require("./routes/anonimityRoute")

const app = express();
const PORT = 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, '../public')));

// Раздаём папку main (основная страница)
app.use('/main', express.static(path.join(__dirname, '../main')));

// Раздаём все функции (если хочешь доступ по /functions/...)
app.use('/functions', express.static(path.join(__dirname, '../functions')));

// Главная страница при заходе на /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../main/index.html'));
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
        res.setHeader("Content-Disposition", "attachment");
    },
}));

// Подключаем маршруты
app.use('/api/domain-check', domainRoutes);
app.use("/api/process-file", fileProcessingRoute);
app.use("/api/encrypt", encryptRoute);
app.use("/api/decrypt", decryptRoute);
app.use("/api/ip-info", anonimityRoute);


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});