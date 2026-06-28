require("dotenv").config({ path: "./config/.env" });

// Express : framework pour créer le serveur et gérer les routes
const express = require("express");
//  Force Node à utiliser un DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


// Mongoose : permet de se connecter à MongoDB et de manipuler les documents
const mongoose = require("mongoose");

// On importe le modèle User que l'on a défini dans models/User.js
const User = require("./models/User");



const app = express();


app.use(express.json());

const PORT = process.env.PORT || 3002;



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
  });



// 1) GET : retourner tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    // User.find() sans filtre renvoie tous les documents de la collection
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    // En cas d'erreur serveur, on renvoie un code 500 avec le message d'erreur
    res.status(500).json({ message: error.message });
  }
});

// 2) POST : ajouter un nouvel utilisateur à la base de données
app.post("/users", async (req, res) => {
  try {
    // req.body contient les données envoyées par le client (ex: via Postman)
    // On crée un nouveau document User avec ces données
    const newUser = new User(req.body);

    // .save() insère le document dans la base de données
    const savedUser = await newUser.save();

    // 201 = Created : on confirme la création avec l'utilisateur sauvegardé
    res.status(201).json(savedUser);
  } catch (error) {
    // 400 = Bad Request : utile si la validation du schéma échoue
    // (ex: email manquant, email dupliqué, etc.)
    res.status(400).json({ message: error.message });
  }
});

// 3) PUT : éditer un utilisateur par ID
app.put("/users/:id", async (req, res) => {
  try {
    // req.params.id récupère l'ID passé dans l'URL (ex: /users/64f1...)
    const { id } = req.params;

   
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Si aucun utilisateur ne correspond à cet ID, on renvoie une erreur 404
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4) DELETE : supprimer un utilisateur par ID
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

  
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
