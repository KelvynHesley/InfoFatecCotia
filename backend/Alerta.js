const mongoose = require('mongoose');

const AlertaSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  public_id: {
    type: String,
    required: false,
  },
  data: {
    type: Date,
    default: Date.now, // Data automática
  },
});

module.exports = mongoose.model('Alerta', AlertaSchema);