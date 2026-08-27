import app from "./app"
import dotenv from "dotenv"
import { prisma } from "./lib/prisma";

dotenv.config()




const PORT = Number(process.env.PORT) || 5000;



app.get("/", (req,res)=>{
    res.send("<center> <h1>Welcome to Health U Australia</h1> </center>")
})


app.listen(PORT, '0.0.0.0',()=>{
    console.log(`The server is running at http://0.0.0.0:${PORT}`)
})


async function main() {
 console.log("Database successfully connected!")
}

main().finally(() => prisma.$disconnect());