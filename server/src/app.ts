import './config/env.js';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { clientOrigins } from "./config/clientUrl.js";
import scBillingRouter from "./routes/scBilling.route.js"
import serviceAgreementRouter from "./routes/serviceAgreement.route.js"
import contractRouter from "./routes/contract.route.js"
import contentRouter from "./routes/content.route.js";
import imageRouter from "./routes/image.route.js";
import silHouseRouter from "./routes/silHouse.route.js";
import trainingResourceRouter from "./routes/trainingResource.route.js"
import handbookSectionRouter from "./routes/handbookSection.route.js";
import ndisRouter from './routes/ndis.route.js';
import compassionRouter from './routes/compassion.route.js';
import feedbackRouter from './routes/feedback.route.js';


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
app.use("/api/contracts", contractRouter);
app.use("/api/content", contentRouter);
app.use("/api/image", imageRouter);
app.use("/api/sil-houses", silHouseRouter);
app.use("/api/training-resources", trainingResourceRouter);
app.use('/api/pages/ndis', ndisRouter);
app.use('/api/pages/compassion-in-action', compassionRouter);
app.use('/api/pages/participant-feedback', feedbackRouter);










export default app
