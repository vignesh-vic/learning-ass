import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

connectDB();


app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }   ));

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.use("/api/auth", authRoutes);
app.use(errorHandler);



app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection at:', err);
    process.exit(1);
});