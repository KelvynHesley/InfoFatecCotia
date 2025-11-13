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
        let errorMessage = 'Não foi possível carregar os dados do alerta.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        Alert.alert('Erro', errorMessage);
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
      let errorMessage = 'Não foi possível atualizar o alerta.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ 
          title: 'Editar Alerta',
          headerStyle: { backgroundColor: '#f97316' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ 
        title: 'Editar Alerta',
        headerStyle: { backgroundColor: '#f97316' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header informativo */}
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>✏️</Text>
          <Text style={styles.headerTitle}>Editar Alerta</Text>
          <Text style={styles.headerSubtitle}>
            Atualize as informações do alerta de segurança
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
            <Text style={styles.labelIcon}>📷</Text> Foto (Opcional)
          </Text>
          
          <Pressable 
            style={styles.botaoImagem} 
            onPress={escolherImagem}
          >
            <Text style={styles.botaoImagemIcone}>🔄</Text>
            <View style={styles.botaoImagemContent}>
              <Text style={styles.botaoImagemTexto}>Trocar Imagem</Text>
              <Text style={styles.botaoImagemSubtexto}>
                {(imagem || imagemAntigaUrl) ? 'Escolher nova foto' : 'Adicionar foto'}
              </Text>
            </View>
          </Pressable>

          {imagem && (
            <View style={styles.imagemContainer}>
              <View style={styles.imagemBadge}>
                <Text style={styles.imagemBadgeText}>✨ Nova imagem</Text>
              </View>
              <Image source={{ uri: imagem.uri }} style={styles.imagemPreview} />
              <Pressable 
                style={styles.botaoRemoverImagem}
                onPress={() => setImagem(null)}
              >
                <Text style={styles.botaoRemoverTexto}>✕ Remover</Text>
              </Pressable>
            </View>
          )}
          
          {!imagem && imagemAntigaUrl && (
            <View style={styles.imagemContainer}>
              <View style={styles.imagemBadge}>
                <Text style={styles.imagemBadgeText}>📸 Imagem atual</Text>
              </View>
              <Image source={{ uri: imagemAntigaUrl }} style={styles.imagemPreview} />
            </View>
          )}
          
          {!imagem && !imagemAntigaUrl && (
            <View style={[styles.imagemContainer, styles.imagemPlaceholder]}>
              <Text style={styles.imagemPlaceholderIcone}>🖼️</Text>
              <Text style={styles.imagemPlaceholderTexto}>Nenhuma imagem</Text>
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
            style={[styles.botaoAtualizar, enviando && styles.botaoDesabilitado]}
            onPress={handleAtualizar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.botaoAtualizarIcone}>💾</Text>
                <Text style={styles.botaoAtualizarTexto}>Atualizar</Text>
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
    backgroundColor: '#fff7ed' 
  },
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
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
    color: '#f97316',
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
  imagemBadge: {
    backgroundColor: '#fed7aa',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  imagemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9a3412',
  },
  imagemPreview: {
    width: '100%',
    height: 220,
    backgroundColor: '#f1f5f9',
  },
  imagemPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  imagemPlaceholderIcone: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.3,
  },
  imagemPlaceholderTexto: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
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
  botaoAtualizar: {
    flex: 1,
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#f97316',
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
  botaoAtualizarIcone: {
    fontSize: 20,
  },
  botaoAtualizarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});