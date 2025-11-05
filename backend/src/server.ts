import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import connectDB from "./config/db";

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use('/api', routes);

async function startServer() {
    const PORT = process.env.PORT;

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();
