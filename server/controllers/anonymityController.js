const express = require("express");
const cors = require("cors");  // Подключаем CORS
const app = express();
const axios = require('axios');


// Включаем CORS для всех маршрутов
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Original-Extension");
    next();
});

exports.getClientIPInfo = async (req, res) => {
  try {
    const response = await axios.get('http://ip-api.com/json/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить данные IP' });
  }
};