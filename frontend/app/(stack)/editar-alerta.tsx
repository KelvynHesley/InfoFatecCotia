import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://SEUIP:3000';

export default function EditarAlertaScreen() {
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagemAntigaUrl, setImagemAntigaUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  
  const router = useRouter(); 
  const { id } = useLocalSearchParams(); 

  useEffect(() => {
    if (!id) return;
    const fetchAlerta = async () => {
      try {
        const response = await fetch(`${API_URL}/alertas/${id}`);
        const data = await response.json();
        setTexto(data.texto);
        setImagemAntigaUrl(data.imageUrl);
      } catch (error) {
        console.error(error);
        // --- CORREÇÃO DO CATCH ---
        let errorMessage = 'Não foi possível carregar os dados do alerta.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        Alert.alert('Erro', errorMessage);
        // --- FIM DA CORREÇÃO ---
      } finally {
        setCarregando(false);
      }
    };
    fetchAlerta();
  }, [id]);
  
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
      setImagemAntigaUrl(null);
    }
  };

  const handleAtualizar = async () => {
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
      const response = await fetch(`${API_URL}/alertas/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao atualizar o alerta');
      }

      await response.json();
      Alert.alert('Sucesso', 'Alerta atualizado!');
      router.back();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      // --- CORREÇÃO DO CATCH ---
      let errorMessage = 'Não foi possível atualizar o alerta.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage);
      // --- FIM DA CORREÇÃO ---
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    // ... (O JSX do return continua o mesmo) ...
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Editar Alerta' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Descreva o Alerta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua mal iluminada, atividade suspeita..."
          multiline
          value={texto}
          onChangeText={setTexto}
        />

        <Text style={styles.label}>Foto (Opcional)</Text>
        <Pressable style={styles.botaoImagem} onPress={escolherImagem}>
          <Text style={styles.botaoImagemTexto}>Trocar Imagem</Text>
        </Pressable>

        {imagem && (
          <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />
        )}
        {!imagem && imagemAntigaUrl && (
          <Image source={{ uri: imagemAntigaUrl }} style={styles.imagemPreview} />
        )}
        {!imagem && !imagemAntigaUrl && (
           <View style={[styles.imagemPreview, styles.imagemPlaceholder]}>
             <Text style={styles.imagemPlaceholderTexto}>Sem imagem</Text>
           </View>
        )}

        <View style={{ height: 40 }} /> 

        <Pressable
          style={[styles.botaoSalvar, enviando && styles.botaoDesabilitado]}
          onPress={handleAtualizar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoSalvarTexto}>Atualizar Alerta</Text>
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
  imagemPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemPlaceholderTexto: {
    color: '#9ca3af',
    fontSize: 16,
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