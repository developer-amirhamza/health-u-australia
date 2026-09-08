import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { clientOrigins } from "./config/clientUrl.js";
import scBillingRouter from "./routes/scBilling.route.js"


const app = express();
app.use(cors({
    credentials:true,
    origin:clientOrigins,
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


app.use("/api/user/", userRouter);
app.use("/api/sc-billing", scBillingRouter);










export default app