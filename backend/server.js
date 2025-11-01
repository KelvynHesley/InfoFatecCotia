// A LINHA MAIS IMPORTANTE! Deve ser a primeira de todas.
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./db');
const Alerta = require('./Alerta');

// Inicializa o app Express
const app = express();
const PORT = 3000;

// Conecta ao Banco de Dados
connectDB();

// Configura Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura o Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- NOSSAS ROTAS (ENDPOINTS) ---

// ROTA 1: GET /alertas - Buscar todos os alertas
app.get('/alertas', async (req, res) => {
  try {
    const alertas = await Alerta.find().sort({ data: -1 });
    res.json(alertas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA 2: POST /alertas - Cadastrar um novo alerta (Atualizada)
app.post('/alertas', upload.single('imagem'), async (req, res) => {
  try {
    const { texto } = req.body;
    let imageUrl = null;
    let public_id = null; // Vamos salvar o public_id

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'infofatec' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      if (!uploadResult?.secure_url) {
        throw new Error('Falha ao fazer upload da imagem para o Cloudinary');
      }
      
      imageUrl = uploadResult.secure_url;
      public_id = uploadResult.public_id; // Salva o ID
    }

    const novoAlerta = new Alerta({
      texto: texto,
      imageUrl: imageUrl,
      public_id: public_id, // Adicionado
    });

    await novoAlerta.save();
    res.status(201).json(novoAlerta);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// --- NOVAS ROTAS ---

// ROTA 3: GET /alertas/:id - Buscar UM alerta específico (para a tela de edição)
app.get('/alertas/:id', async (req, res) => {
  try {
    const alerta = await Alerta.findById(req.params.id);
    if (!alerta) {
      return res.status(404).json({ msg: 'Alerta não encontrado' });
    }
    res.json(alerta);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA 4: DELETE /alertas/:id - Excluir um alerta
app.delete('/alertas/:id', async (req, res) => {
  try {
    const alerta = await Alerta.findById(req.params.id);
    if (!alerta) {
      return res.status(404).json({ msg: 'Alerta não encontrado' });
    }

    // Se o alerta tem uma imagem, exclui do Cloudinary primeiro
    if (alerta.public_id) {
      await cloudinary.uploader.destroy(alerta.public_id);
    }

    // Exclui do MongoDB
    await Alerta.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Alerta removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA 5: PUT /alertas/:id - Editar um alerta
app.put('/alertas/:id', upload.single('imagem'), async (req, res) => {
  try {
    const { texto } = req.body;
    const alerta = await Alerta.findById(req.params.id);
    if (!alerta) {
      return res.status(404).json({ msg: 'Alerta não encontrado' });
    }

    // Atualiza o texto
    alerta.texto = texto;

    // Se uma NOVA imagem foi enviada
    if (req.file) {
      // 1. Deleta a imagem antiga do Cloudinary (se existir)
      if (alerta.public_id) {
        await cloudinary.uploader.destroy(alerta.public_id);
      }

      // 2. Faz upload da nova imagem
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'infofatec' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      if (!uploadResult?.secure_url) {
        throw new Error('Falha ao fazer upload da nova imagem');
      }
      
      // 3. Atualiza os dados da imagem no alerta
      alerta.imageUrl = uploadResult.secure_url;
      alerta.public_id = uploadResult.public_id;
    }

    // Salva todas as alterações no MongoDB
    await alerta.save();
    res.json(alerta); // Retorna o alerta atualizado
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`API rodando na porta http://localhost:${PORT}`);
});