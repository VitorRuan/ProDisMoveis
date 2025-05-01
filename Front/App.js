import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, List, Snackbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Importando o SafeAreaProvider
import { Button as PaperButton } from 'react-native-paper'; // Importando o Button do react-native-paper

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false); 

  const API_URL = 'http://192.168.56.1:3000'; 

  const carregarDados = async () => {
    try {
      const resposta = await fetch(`${API_URL}/`);
      const dados = await resposta.json();
      setUsuarios(dados);
    } catch (erro) {
      setMensagem('Erro ao carregar dados');
      setSnackbarVisible(true);
    }
  };

  const adicionarUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, telefone }),
      });
      if (response.ok) {
        setMensagem('Usuário adicionado com sucesso');
        setSnackbarVisible(true);
        carregarDados();
      }
    } catch (erro) {
      setMensagem('Erro ao adicionar usuário');
      setSnackbarVisible(true);
    }
  };


  const deletarUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMensagem('Usuário deletado');
        setSnackbarVisible(true);
        carregarDados();
      }
    } catch (erro) {
      setMensagem('Erro ao deletar usuário');
      setSnackbarVisible(true);
    }
  };


  const atualizarUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, telefone }),
      });
      if (response.ok) {
        setMensagem('Usuário atualizado com sucesso');
        setSnackbarVisible(true);
        carregarDados();
      }
    } catch (erro) {
      setMensagem('Erro ao atualizar usuário');
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          style={styles.input}
        />
      
        <PaperButton 
          mode="contained" 
          onPress={adicionarUsuario} 
          style={styles.botaoAdicionar}
        >
          Adicionar Usuário
        </PaperButton>

        <List.Section>
          {usuarios.map((usuario) => (
            <List.Item
              key={usuario._id}
              title={usuario.name}
              description={`Email: ${usuario.email} | Telefone: ${usuario.telefone}`}
              right={(props) => (
                <View style={styles.buttons}>
                  <PaperButton mode="outlined" onPress={() => atualizarUsuario(usuario._id)}>
                    Atualizar
                  </PaperButton>
                  <PaperButton mode="contained" onPress={() => deletarUsuario(usuario._id)}>
                    Deletar
                  </PaperButton>
                </View>
              )}
            />
          ))}
        </List.Section>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
        >
          {mensagem}
        </Snackbar>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoAdicionar: {
    marginBottom: 10,
    marginTop: 10,
  },
});
