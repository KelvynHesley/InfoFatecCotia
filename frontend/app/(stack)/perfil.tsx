import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Perfil() {
  const profileImageUrl = require("../../assets/profile.jpg");

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "logo-linkedin",
      url: "https://br.linkedin.com/in/kelvyn-hesley-lima-de-queiroz-0927a917b",
      color: "#0077b5",
      bgColor: "#e7f3ff",
    },
    {
      name: "GitHub",
      icon: "logo-github",
      url: "https://github.com/KelvynHesley",
      color: "#333333",
      bgColor: "#f6f8fa",
    },
    {
      name: "E-mail",
      icon: "mail-outline",
      url: "mailto:kelvyn.queiroz@fatec.sp.gov.br",
      color: "#dc2626",
      bgColor: "#fee2e2",
    },
  ];

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header com gradiente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Desenvolvedor 👨‍💻</Text>
            <Text style={styles.name}>Kelvyn Hesley</Text>
            <Text style={styles.subtitle}>Lima de Queiroz</Text>
          </View>
        </View>

        {/* Foto de perfil */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImage}>
              {profileImageUrl ? (
                <Image
                  source={
                    typeof profileImageUrl === "string"
                      ? { uri: profileImageUrl }
                      : profileImageUrl
                  }
                  style={styles.profileImageActual}
                />
              ) : (
                <Text style={styles.profileImageText}>KH</Text>
              )}
            </View>
            <View style={styles.statusIndicator} />
          </View>
        </View>

        {/* Sobre mim */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={24} color="#1e40af" />
            <Text style={styles.sectionTitle}>Sobre Mim</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Estudante de Análise e Desenvolvimento de Software Multiplataforma
              na FATEC Cotia, apaixonado por tecnologia e desenvolvimento de
              software. Experiência em desenvolvimento web e mobile, com foco em
              criar soluções inovadoras e intuitivas que melhoram a experiência
              do usuário.
            </Text>
            <View style={styles.skillsContainer}>
              <View style={styles.skillTag}>
                <Text style={styles.skillText}>TypeScript</Text>
              </View>
              <View style={styles.skillTag}>
                <Text style={styles.skillText}>React Native</Text>
              </View>
              <View style={styles.skillTag}>
                <Text style={styles.skillText}>Python</Text>
              </View>
              <View style={styles.skillTag}>
                <Text style={styles.skillText}>Machine Learning</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Links de perfis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link-outline" size={24} color="#1e40af" />
            <Text style={styles.sectionTitle}>Conecte-se Comigo</Text>
          </View>
          <View style={styles.linksContainer}>
            {socialLinks.map((link, index) => (
              <Pressable
                key={index}
                style={styles.linkCard}
                onPress={() => handlePress(link.url)}
              >
                <View
                  style={[
                    styles.linkIconContainer,
                    { backgroundColor: link.bgColor },
                  ]}
                >
                  <Ionicons
                    name={link.icon as any}
                    size={28}
                    color={link.color}
                  />
                </View>
                <View style={styles.linkContent}>
                  <Text style={styles.linkName}>{link.name}</Text>
                  <Text style={styles.linkDescription}>Ver perfil</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#cbd5e1" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Informações adicionais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#1e40af"
            />
            <Text style={styles.sectionTitle}>Informações</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={20} color="#64748b" />
              <Text style={styles.infoText}>FATEC Cotia - DSM</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#64748b" />
              <Text style={styles.infoText}>São Paulo, Cotia, Brasil</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#64748b" />
              <Text style={styles.infoText}>Membro desde 2023</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>💙 Feito com dedicação</Text>
          <Text style={styles.footerSubtext}>InfoFatec Cotia © 2025</Text>
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
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#1e40af",
    paddingTop: 20,
    paddingBottom: 80,
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
  greeting: {
    fontSize: 16,
    color: "#bfdbfe",
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#93c5fd",
    fontWeight: "600",
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#ffffff",
    overflow: "hidden",
  },
  profileImageActual: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1e40af",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  aboutText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 13,
    color: "#1e40af",
    fontWeight: "600",
  },
  linksContainer: {
    gap: 12,
  },
  linkCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
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
  linkIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  linkContent: {
    flex: 1,
  },
  linkName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  linkDescription: {
    fontSize: 13,
    color: "#64748b",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#475569",
  },
  footer: {
    padding: 24,
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
  },
});
