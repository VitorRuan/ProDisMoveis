const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/usuarios', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.json());

const usuarioSchema = new mongoose.Schema({
  name: String,
  email: String,
  telefone: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

app.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.post('/add', async (req, res) => {
  const { name, email, telefone } = req.body;
  try {
    const novoUsuario = new Usuario({ name, email, telefone });
    await novoUsuario.save();
    res.status(201).json({ status: 'Usuário adicionado' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar usuário' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (usuario) {
      res.json({ status: 'Usuário deletado' });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar usuário' });
  }
});

app.patch('/update/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (usuario) {
      res.json({ status: 'Usuário atualizado' });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
