import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import appointmentRoutes from "./routes/appointmentRoutes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://oticasvizz.com.br",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "A API do Backend está funcionando!" });
});

app.use("/api/agendamentos", appointmentRoutes);

if (!process.env.MONGODB_URI) {
  console.error(
    "ERRO FATAL: A variável de ambiente MONGODB_URI não está definida."
  );
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso."))
  .catch((err) => console.error("❌ Falha ao conectar ao MongoDB.", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da aplicação rodando na porta ${PORT}`);
});
