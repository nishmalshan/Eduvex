import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import connectDB from "./config/db.js"
import cors from "cors";

dotenv.config()
connectDB()

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.json());
app.use("/", authRoutes)




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
