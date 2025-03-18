import express, { Application } from "express";
import messageRoutes from "./routes/messageRoutes";
import errorHandler from "./middlewares/errorHandling";

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/api", messageRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
