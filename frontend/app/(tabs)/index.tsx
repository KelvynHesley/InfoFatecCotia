import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <Text style={styles.title}>
                    InfoFatec Cotia
                </Text>

                <Link href="/cultura" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>
                            Cultura
                        </Text>
                    </Pressable>
                </Link>

                <Link href="/educacao" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>
                            Educação
                        </Text>
                    </Pressable>
                </Link>

                <Link href="/empregos" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>
                            Empregos
                        </Text>
                    </Pressable>
                </Link>

                <Link href="/seguranca" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>
                            Segurança
                        </Text>
                    </Pressable>
                </Link>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f4f5',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32, 
    },
    title: {
        fontSize: 30, 
        fontWeight: 'bold',
        color: '#27272a', 
        marginBottom: 40, 
    },
    button: {
        width: '100%',
        backgroundColor: '#ffffff', 
        padding: 20, 
        borderRadius: 12, 
        marginBottom: 20, 
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18, 
        fontWeight: '600', 
        color: '#1d4ed8', 
    },
});