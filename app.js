console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");

// MongDB chaqirish
const db = require("./server").db();
const mongodb = require("mongodb");

// Har qanday browserdan kelayotgan requestlar uchun public folder ochiq degani
app.use(express.static("public"));

//json formatdagi data ni objectga exchage qilish
app.use(express.json());

// html formdan qabul qilinadigan data larni serverga kiritish uchun
app.use(express.urlencoded({ extended: true }));

//2 Session codlari

//3 Views codelari
//BSSR
// ejs orqali backend ni ichida frontend ni yashash
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/", router);

module.exports = app;
