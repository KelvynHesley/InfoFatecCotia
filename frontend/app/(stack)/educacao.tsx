import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

// Dados dos cursos que você listou
const CURSOS_DATA = [
  {
    id: '1',
    nome: 'Gestão de Produção Industrial',
    descricao: 'Focado em otimizar processos produtivos, controle de qualidade, logística e planejamento da produção na indústria.',
    icone: '⚙️',
    cor: '#3b82f6',
    corFundo: '#dbeafe',
  },
  {
    id: '2',
    nome: 'Design de Produto',
    descricao: 'Une criatividade e técnica para criar e desenvolver novos produtos, desde a concepção, ergonomia, materiais até a viabilidade de produção.',
    icone: '🎨',
    cor: '#8b5cf6',
    corFundo: '#ede9fe',
  },
  {
    id: '3',
    nome: 'Gestão Empresarial',
    descricao: 'Forma profissionais com visão estratégica para administrar diferentes áreas de uma empresa, como finanças, marketing, recursos humanos e operações.',
    icone: '💼',
    cor: '#10b981',
    corFundo: '#d1fae5',
  },
  {
    id: '4',
    nome: 'Desenvolvimento de Software Multiplataforma',
    descricao: 'Capacita o aluno a projetar, desenvolver e testar softwares que funcionam em diferentes sistemas (web, mobile e desktop).',
    icone: '💻',
    cor: '#06b6d4',
    corFundo: '#cffafe',
  },
  {
    id: '5',
    nome: 'Ciência de Dados',
    descricao: 'Focado na análise de grandes volumes de dados (Big Data) para extrair informações, identificar padrões e auxiliar na tomada de decisões estratégicas.',
    icone: '📊',
    cor: '#f59e0b',
    corFundo: '#fef3c7',
  },
  {
    id: '6',
    nome: 'Comércio Exterior',
    descricao: 'Prepara o profissional para atuar em negociações de compra e venda com empresas de outros países, cuidando de logística, legislação e câmbio.',
    icone: '🌍',
    cor: '#ec4899',
    corFundo: '#fce7f3',
  },
];

export default function EducacaoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ 
        title: 'Educação',
        headerStyle: { backgroundColor: '#3b82f6' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header decorativo */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🎓</Text>
          </View>
          <Text style={styles.headerTitle}>Cursos Superiores</Text>
          <Text style={styles.headerSubtitle}>de Tecnologia</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {CURSOS_DATA.length} cursos disponíveis
            </Text>
          </View>
        </View>

        {/* Cards dos cursos */}
        <View style={styles.cursosContainer}>
          {CURSOS_DATA.map((curso, index) => (
            <View key={curso.id} style={styles.card}>
              {/* Badge de numeração */}
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>#{index + 1}</Text>
              </View>

              {/* Ícone do curso */}
              <View style={[styles.iconContainer, { backgroundColor: curso.corFundo }]}>
                <Text style={styles.iconeTexto}>{curso.icone}</Text>
              </View>

              {/* Conteúdo do card */}
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: curso.cor }]}>
                  {curso.nome}
                </Text>
                <Text style={styles.cardDescricao}>{curso.descricao}</Text>
              </View>

              {/* Decoração inferior */}
              <View style={[styles.cardFooter, { backgroundColor: curso.corFundo }]}>
                <Text style={[styles.cardFooterText, { color: curso.cor }]}>
                  ⏱️ Duração: 3 anos
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer informativo */}
        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerIcon}>📍</Text>
            <Text style={styles.footerTitle}>FATEC Cotia</Text>
            <Text style={styles.footerText}>
              Cursos gratuitos e reconhecidos pelo MEC
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerIconText: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#bfdbfe',
    fontWeight: '600',
    marginBottom: 16,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  cursosContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardNumber: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  cardNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  iconContainer: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: {
    fontSize: 48,
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 26,
  },
  cardDescricao: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 23,
  },
  cardFooter: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  footerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footerIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});