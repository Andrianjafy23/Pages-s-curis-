import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import authRoutes from "./routes/routes.js"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Front")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Atlas"))
  .catch((err) => console.error("Erreur de connexion :", err));

// Middleware pour vérifier l'authentification
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "index.html"));
});

app.get("/inscrit", (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "inscrit.html"));
});

app.get("/secure", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "secure.html"));
});

app.get("/user", (req, res) => {
  if (req.session.userName) {
    res.json({ name: req.session.userName });
  } else {
    res.status(401).json({ message: "Non connecté" });
  }
});


// Utilise les routes d'authentification
app.use(authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
