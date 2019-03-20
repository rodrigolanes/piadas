import mongoose = require("mongoose");

const PiadaSchema = new mongoose.Schema({
  pergunta: String,
  resposta: String,
  votes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Piada", PiadaSchema);
