import express from 'express';
import path from 'path';
import RouterAdmin from './router_admin'; // route Admin hosil qilganimizda ishlatiladi
import router from './router';
import morgan from "morgan"
import { MORGAN_FORMAT } from './libs/config';
import session from 'express-session';
import ConnectMongoDB from "connect-mongodb-session";
import { T } from './libs/types/common';
import cookieParser from 'cookie-parser';
import cors from "cors"

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection:"session",
});


/** 1-enterance  */
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads")); app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    cors({ 
        credentials: true, 
        origin: true}));
app.use(morgan(MORGAN_FORMAT))
app.use(cookieParser())
 /* 
 2-Sessions
 */

 app.use(
    session({
        secret:String(process.env.SESSION_SECRET),
        cookie:{
            maxAge:1000*3600*60, // 60h
        },
        store: store,
        resave:true,
        saveUninitialized: true,
    })
 );

app.use(function (req, res, next ){
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/** 3-Views */
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

 /** 4-Routers */
 // full tizim Architectual pattern

 // ADMIN ka loyihasini qurish sifatida:::: SSR :EJS
app.use("/admin", RouterAdmin); //SSR :EJS
app.use("/", router);//MiddleWare DP :::: SPA: react loyihasiga restAPI sifatida


export default app;   //moduleni export qilish  