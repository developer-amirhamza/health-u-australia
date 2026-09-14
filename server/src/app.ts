import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { clientOrigins } from "./config/clientUrl.js";
import scBillingRouter from "./routes/scBilling.route.js"
import serviceAgreementRouter from "./routes/serviceAgreement.route.js"


const app = express();
app.use(cors({
    credentials:true,
    origin:clientOrigins,
}))

// 20mb (rather than Express's 100kb default) so the Service Agreement Tool
// can post a generated PDF as base64 JSON to be emailed to the client.
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({
    extended:true,
    limit: "20mb",
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginEmbedderPolicy:false,
}));


app.use("/api/user/", userRouter);
app.use("/api/sc-billing", scBillingRouter);
app.use("/api/service-agreements", serviceAgreementRouter);










export default app