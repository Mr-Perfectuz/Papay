console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Har qanday browserdan kelayotgan requestlar uchun public folder ochiq degani

//1 Kirish codlari
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
//json formatdagi data ni objectga exchage qilish
app.use(express.json());
// html formdan qabul qilinadigan data larni serverga kiritish uchun
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

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

const server = http.createServer(app);

//  SOCKET OI BACKEND SERVER
const io = require("socket.io")(server, {
  serveClient: false,
  origin: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user, Total:", online_users);
  socket.emit("greetMsg", { text: "welcome" });
  io.emit("infoMsg", { total: online_users });

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected, total:", online_users);
  });

  socket.on("createMsg", function (data) {
    console.log("createMsg:", data);
    io.emit("newMsg", data);
  });
});

//  SOCKET OI BACKEND SERVER
module.exports = server;
