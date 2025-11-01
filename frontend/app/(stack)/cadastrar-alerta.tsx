import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://SEUIP:3000';

export default function CadastrarAlertaScreen() {
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [enviando, setEnviando] = useState(false);
  const router = useRouter(); 

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0]);
    }
  };

  const handleSalvar = async () => {
    if (!texto.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o alerta.');
      return;
    }
    setEnviando(true);

    const formData = new FormData();
    formData.append('texto', texto);

    if (imagem) {
      formData.append('imagem', {
        uri: imagem.uri,
        name: imagem.fileName || 'foto.jpg', 
        type: imagem.mimeType || 'image/jpeg', 
      } as any);
    }

    try {
      const response = await fetch(`${API_URL}/alertas`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao salvar o alerta');
      }

      await response.json(); 
      Alert.alert('Sucesso', 'Alerta registrado!');
      router.back();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      // --- CORREÇÃO DO CATCH ---
      let errorMessage = 'Não foi possível salvar o alerta.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage);
      // --- FIM DA CORREÇÃO ---
    } finally {
      setEnviando(false);
    }
  };

  return (
    // ... (O JSX do return continua o mesmo) ...
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Registrar Alerta' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Descreva o Alerta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua mal iluminada, atividade suspeita..."
          multiline
          value={texto}
          onChangeText={setTexto}
        />

        <Text style={styles.label}>Adicionar Foto (Opcional)</Text>
        <Pressable style={styles.botaoImagem} onPress={escolherImagem}>
          <Text style={styles.botaoImagemTexto}>Escolher da Galeria</Text>
        </Pressable>

        {imagem && (
          <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />
        )}

        <View style={{ height: 40 }} /> 

        <Pressable
          style={[styles.botaoSalvar, enviando && styles.botaoDesabilitado]}
          onPress={handleSalvar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoSalvarTexto}>Salvar Alerta</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Styles continuam os mesmos) ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 120,
  },
  botaoImagem: {
    backgroundColor: '#eef2ff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoImagemTexto: {
    color: '#1d4ed8', 
    fontWeight: 'bold',
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f4f4f5',
  },
  botaoSalvar: {
    backgroundColor: '#16a34a', // Verde
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#9ca3af',
  },
  botaoSalvarTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});