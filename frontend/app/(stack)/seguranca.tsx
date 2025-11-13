import { Stack, Link, useFocusEffect, useRouter } from 'expo-router';
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
  const router = useRouter();

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
      <Stack.Screen options={{ 
        title: 'Segurança Cotia',
        headerStyle: { backgroundColor: '#dc2626' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />

      {/* Header com informações */}
      <View style={styles.headerInfo}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🛡️</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Central de Alertas</Text>
          <Text style={styles.headerSubtitle}>
            {alertas.length} {alertas.length === 1 ? 'alerta registrado' : 'alertas registrados'}
          </Text>
        </View>
      </View>

      <Link href="/cadastrar-alerta" asChild>
        <Pressable style={styles.botaoAdicionar}>
          <Text style={styles.botaoAdicionarIcone}>+</Text>
          <Text style={styles.botaoAdicionarTexto}>Registrar Novo Alerta</Text>
        </Pressable>
      </Link>

      {carregando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Carregando alertas...</Text>
        </View>
      )}

      {!carregando && (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listaContainer}
          renderItem={({ item }) => (
            <View style={styles.cardAlerta}>
              {/* Badge de status */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🚨 Alerta Ativo</Text>
              </View>

              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.cardImagem} />
              )}
              
              <View style={styles.cardContent}>
                <Text style={styles.cardTexto}>{item.texto}</Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.cardData}>📅 {formatarData(item.data)}</Text>
                </View>
              </View>
              
              <View style={styles.botoesContainer}>
                <Pressable 
                  style={[styles.botaoAcao, styles.botaoEditar]}
                  onPress={() => router.push({ 
                    pathname: "/editar-alerta", 
                    params: { id: item._id } 
                  })}
                >
                  <Text style={styles.botaoAcaoIcone}>✏️</Text>
                  <Text style={styles.botaoAcaoTexto}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.botaoAcao, styles.botaoExcluir]}
                  onPress={() => handleExcluir(item._id)}
                  disabled={deletandoId === item._id}
                >
                  {deletandoId === item._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.botaoAcaoIcone}>🗑️</Text>
                      <Text style={styles.botaoAcaoTexto}>Excluir</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhum alerta registrado</Text>
              <Text style={styles.emptySubtitle}>
                Toque no botão acima para criar seu primeiro alerta
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fef2f2' 
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 28,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  listaContainer: { 
    padding: 20, 
    paddingTop: 16 
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  botaoAdicionar: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoAdicionarIcone: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardAlerta: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  badge: {
    backgroundColor: '#fee2e2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  cardImagem: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f5f9',
  },
  cardContent: {
    padding: 16,
  },
  cardTexto: {
    fontSize: 16,
    color: '#0f172a',
    lineHeight: 24,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cardData: {
    fontSize: 13,
    color: '#64748b',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
    backgroundColor: '#fafafa',
  },
  botaoAcao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  botaoEditar: {
    backgroundColor: '#f97316',
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
  },
  botaoAcaoIcone: {
    fontSize: 16,
  },
  botaoAcaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});