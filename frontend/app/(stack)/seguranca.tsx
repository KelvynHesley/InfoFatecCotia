import { Stack, Link, useFocusEffect, useRouter } from 'expo-router'; // 1. IMPORTAR useRouter
import { View, Text, StyleSheet, FlatList, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';

const API_URL = 'http://SEUIP:3000';

interface Alerta {
  _id: string;
  texto: string;
  imageUrl: string | null;
  data: string;
}

export default function SegurancaScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const router = useRouter(); // 2. INICIALIZAR o router

  // Função para buscar os dados da sua API
  const fetchAlertas = async () => {
    try {
      setCarregando(true);
      const response = await fetch(`${API_URL}/alertas`);
      const data = await response.json();
      setAlertas(data);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      let errorMessage = 'Não foi possível carregar os alertas.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlertas();
    }, [])
  );

  const handleExcluir = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setDeletandoId(id);
            try {
              const response = await fetch(`${API_URL}/alertas/${id}`, {
                method: 'DELETE',
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao excluir alerta');
              }
              
              await response.json(); 
              
              setAlertas((alertasAtuais) =>
                alertasAtuais.filter((alerta) => alerta._id !== id)
              );

            } catch (error) {
              console.error(error);
              let errorMessage = 'Não foi possível excluir o alerta.';
              if (error instanceof Error) {
                errorMessage = error.message;
              }
              Alert.alert('Erro', errorMessage);
            } finally {
              setDeletandoId(null);
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Segurança Cotia' }} />

      <Link href="/cadastrar-alerta" asChild>
        <Pressable style={styles.botaoAdicionar}>
          <Text style={styles.botaoAdicionarTexto}>+ Registrar Novo Alerta</Text>
        </Pressable>
      </Link>

      {carregando && (
        <ActivityIndicator size="large" color="#1d4ed8" style={{ marginTop: 30 }} />
      )}

      {!carregando && (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listaContainer}
          renderItem={({ item }) => (
            <View style={styles.cardAlerta}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.cardImagem} />
              )}
              <Text style={styles.cardTexto}>{item.texto}</Text>
              <Text style={styles.cardData}>{formatarData(item.data)}</Text>
              
              <View style={styles.botoesContainer}>
                
                {/* --- 3. BOTÃO "EDITAR" CORRIGIDO --- */}
                {/* Removemos o <Link> e usamos <Pressable> com onPress */}
                <Pressable 
                  style={[styles.botaoAcao, styles.botaoEditar]}
                  onPress={() => router.push({ 
                    pathname: "/editar-alerta", 
                    params: { id: item._id } 
                  })}
                >
                  <Text style={styles.botaoAcaoTexto}>Editar</Text>
                </Pressable>

                {/* Botão Excluir (continua o mesmo) */}
                <Pressable
                  style={[styles.botaoAcao, styles.botaoExcluir]}
                  onPress={() => handleExcluir(item._id)}
                  disabled={deletandoId === item._id}
                >
                  {deletandoId === item._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.botaoAcaoTexto}>Excluir</Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>Nenhum alerta registrado ainda.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f4f5' },
  listaContainer: { padding: 20, paddingTop: 10 },
  textoVazio: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#666' },
  botaoAdicionar: {
    backgroundColor: '#1d4ed8',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardAlerta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImagem: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTexto: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  cardData: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 10,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  botaoAcao: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  botaoEditar: {
    backgroundColor: '#f97316', // Laranja
  },
  botaoExcluir: {
    backgroundColor: '#ef4444', // Vermelho
  },
  botaoAcaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});