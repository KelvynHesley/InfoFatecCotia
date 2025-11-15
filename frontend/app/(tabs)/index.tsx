import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const profileImageUrl = require("../../assets/profile.jpg");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header com gradiente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Bem-vindo 👋</Text>
                <Text style={styles.title}>InfoFatec</Text>
                <Text style={styles.subtitle}>Cotia</Text>
              </View>
              <Link href="/perfil" asChild>
                <Pressable style={styles.profileButtonContainer}>
                  <View style={styles.profileButton}>
                    {profileImageUrl ? (
                      <Image
                        source={
                          typeof profileImageUrl === "string"
                            ? { uri: profileImageUrl }
                            : profileImageUrl
                        }
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons name="person" size={24} color="#1e40af" />
                    )}
                  </View>
                  <Text style={styles.profileButtonText}>Meu Perfil</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>

        {/* Cards de navegação */}
        <View style={styles.cardsContainer}>
          <Link href="/cultura" asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, styles.iconCultura]}>
                <Text style={styles.iconText}>🎭</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Cultura</Text>
                <Text style={styles.cardDescription}>
                  Eventos culturais e atividades
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </Link>

          <Link href="/educacao" asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, styles.iconEducacao]}>
                <Text style={styles.iconText}>📚</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Educação</Text>
                <Text style={styles.cardDescription}>
                  Cursos e informações acadêmicas
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </Link>

          <Link href="/empregos" asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, styles.iconEmpregos]}>
                <Text style={styles.iconText}>💼</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Empregos</Text>
                <Text style={styles.cardDescription}>
                  Oportunidades de carreira
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </Link>

          <Link href="/seguranca" asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, styles.iconSeguranca]}>
                <Text style={styles.iconText}>🛡️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Segurança</Text>
                <Text style={styles.cardDescription}>
                  Alertas e informações de segurança
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer informativo */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎓 Portal de informações FATEC Cotia
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#1e40af",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#bfdbfe",
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 20,
    color: "#93c5fd",
    fontWeight: "600",
  },
  profileButtonContainer: {
    alignItems: "center",
    marginLeft: 12,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileButtonText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
    marginTop: -20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconCultura: {
    backgroundColor: "#fef3c7",
  },
  iconEducacao: {
    backgroundColor: "#dbeafe",
  },
  iconEmpregos: {
    backgroundColor: "#d1fae5",
  },
  iconSeguranca: {
    backgroundColor: "#ffe4e6",
  },
  iconText: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#cbd5e1",
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});
