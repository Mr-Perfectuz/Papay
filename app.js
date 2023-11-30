console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Har qanday browserdan kelayotgan requestlar uchun public folder ochiq degani

//1 Kirish codlari
app.use(express.static("public"));
//json formatdagi data ni objectga exchage qilish
app.use(express.json());
// html formdan qabul qilinadigan data larni serverga kiritish uchun
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//2 Session codlari
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // for 60 minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

// app.use(function (req, res, next) {
//   res.locals.member = req.session.number;
//   next();
// });
app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});
//3 Views codelari

// ejs orqali backend ni ichida frontend ni yashash
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/resto", router_bssr);
app.use("/", router);

module.exports = app;
