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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Front")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,  // Ajouté pour éviter l'avertissement
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Sécurisation en production
  })
);



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connecté à MongoDB Atlas"))
    .catch(err => console.error("Erreur de connexion à MongoDB:", err));


// Middleware d'authentification
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/");
}

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "Front", "index.html")));
app.get("/inscrit", (req, res) => res.sendFile(path.join(__dirname, "Front", "inscrit.html")));
app.get("/secure", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "Front", "secure.html")));

app.get("/user", (req, res) => {
  if (req.session.userName) {
    res.json({ name: req.session.userName });
  } else {
    res.status(401).json({ message: "Non connecté" });
  }
});

// Routes d'authentification
app.use(authRoutes);

// Gestion des erreurs globales
process.on("uncaughtException", (err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
