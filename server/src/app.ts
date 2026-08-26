 import express from "express"
import cors from "cors";
import  cookieParser from "cookie-parser";
import morgan from "morgan"
import helmet from "helmet"






const app = express();
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL,
}))

app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginEmbedderPolicy:false,
}));
app.get("/", (req,res)=>{
    res.send("<center> <h1>Welcome to Health U Australia</h1> </center>")
})






export default app;

