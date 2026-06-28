
// On importe mongoose pour pouvoir créer un schéma et un modèle
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    // Nom complet de l'utilisateur
    name: {
      type: String,
      required: true, // champ obligatoire
      trim: true, // supprime les espaces inutiles au début/à la fin
    },

    // Adresse email de l'utilisateur
    email: {
      type: String,
      required: true,
      unique: true, // empêche les doublons d'email dans la base
      lowercase: true, // stocke toujours l'email en minuscules
      trim: true,
    },

    // Âge de l'utilisateur
    age: {
      type: Number,
      min: 0, // l'âge ne peut pas être négatif
    },

    // Ville de l'utilisateur (champ optionnel)
    city: {
      type: String,
      trim: true,
    },
  },
  {
    // timestamps ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);

// On exporte le modèle pour pouvoir l'utiliser dans server.js 
module.exports = User;
