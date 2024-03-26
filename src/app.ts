import express from "express";
import { HOST, PORT } from "./config/secrets.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express() as express.Application; // Explicitly specify the type

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

// Routes
import appRouter from "./routes/index.js";
app.use('/api', appRouter);

app.get('/', (req, res) => {
   res.send("app working");
});

app.listen(PORT, () => console.log(`Server is running http://${HOST}:${PORT}`));
