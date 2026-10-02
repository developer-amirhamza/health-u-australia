import './config/env.js';
import app from "./app.js"
import type { Request, Response } from "express"
import { prisma } from "./lib/prisma.js";





const PORT = Number(process.env.PORT) || 5000;



app.get("/", (req: Request, res: Response)=>{
    res.send("<center> <h1>Welcome to Health U Australia</h1> </center>")
})




async function main() {
    await prisma.$connect();
    console.log('Database successfully connected!');
    const server = app.listen(PORT, process.env.HOST || '0.0.0.0', () => {
        console.log(`The server is running at http://localhost:${PORT}`);
    });
    const shutdown = () => {
        server.close(() => { void prisma.$disconnect().then(() => process.exit(0)); });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

main().catch(async () => {
    console.error('Unable to connect to the database. Check DATABASE_URL and start PostgreSQL.');
    await prisma.$disconnect();
    process.exit(1);
});


