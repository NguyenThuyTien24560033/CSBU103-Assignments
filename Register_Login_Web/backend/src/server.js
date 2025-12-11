import express from "express";
import connectDB  from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors';


const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "DELETE"],
}));

app.use("/api/users", userRoutes);



connectDB().then( () => {
    app.listen(5005, () => {
    console.log("server starts in port 5005");
    });

});
