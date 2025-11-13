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
      let errorMessage = 'Não foi possível salvar o alerta.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ 
        title: 'Registrar Alerta',
        headerStyle: { backgroundColor: '#dc2626' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header informativo */}
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>📝</Text>
          <Text style={styles.headerTitle}>Novo Alerta de Segurança</Text>
          <Text style={styles.headerSubtitle}>
            Preencha as informações abaixo para registrar um novo alerta
          </Text>
        </View>

        {/* Campo de texto */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Text style={styles.labelIcon}>✍️</Text> Descrição do Alerta
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva o que está acontecendo..."
            placeholderTextColor="#94a3b8"
            multiline
            value={texto}
            onChangeText={setTexto}
            numberOfLines={6}
          />
          <Text style={styles.hint}>
            Seja claro e objetivo na descrição
          </Text>
        </View>

        {/* Seção de imagem */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <Text style={styles.labelIcon}>📷</Text> Adicionar Foto (Opcional)
          </Text>
          
          <Pressable 
            style={styles.botaoImagem} 
            onPress={escolherImagem}
          >
            <Text style={styles.botaoImagemIcone}>🖼️</Text>
            <View style={styles.botaoImagemContent}>
              <Text style={styles.botaoImagemTexto}>Escolher da Galeria</Text>
              <Text style={styles.botaoImagemSubtexto}>
                JPG, PNG até 5MB
              </Text>
            </View>
          </Pressable>

          {imagem && (
            <View style={styles.imagemContainer}>
              <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />
              <Pressable 
                style={styles.botaoRemoverImagem}
                onPress={() => setImagem(null)}
              >
                <Text style={styles.botaoRemoverTexto}>✕ Remover</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.botoesContainer}>
          <Pressable
            style={[styles.botaoSecundario]}
            onPress={() => router.back()}
            disabled={enviando}
          >
            <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={[styles.botaoSalvar, enviando && styles.botaoDesabilitado]}
            onPress={handleSalvar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.botaoSalvarIcone}>💾</Text>
                <Text style={styles.botaoSalvarTexto}>Salvar Alerta</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fef2f2' 
  },
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  labelIcon: {
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0f172a',
    textAlignVertical: 'top',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  hint: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8,
    marginLeft: 4,
  },
  botaoImagem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  botaoImagemIcone: {
    fontSize: 32,
    marginRight: 16,
  },
  botaoImagemContent: {
    flex: 1,
  },
  botaoImagemTexto: {
    color: '#1e40af',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  botaoImagemSubtexto: {
    color: '#94a3b8',
    fontSize: 12,
  },
  imagemContainer: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imagemPreview: {
    width: '100%',
    height: 220,
    backgroundColor: '#f1f5f9',
  },
  botaoRemoverImagem: {
    backgroundColor: '#fee2e2',
    padding: 12,
    alignItems: 'center',
  },
  botaoRemoverTexto: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  botaoSecundarioTexto: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoDesabilitado: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoSalvarIcone: {
    fontSize: 20,
  },
  botaoSalvarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});