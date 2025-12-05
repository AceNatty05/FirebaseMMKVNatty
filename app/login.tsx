// import komponen
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../firebaseConfig";
import { storageHelper } from "../storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      // verif ke firebase
      const user = await signInWithEmailAndPassword(auth, email, password);
      // simpan data ke storage
      storageHelper.setString("uid", user.user.uid);
      router.replace("/home");
    } catch (err) {
      console.log(err);
      alert("Login gagal! Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require('../login-illustration.png')} // Pastikan path ini benar
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Selamat Datang Kembali</Text>
          <Text style={styles.subtitle}>Masuk untuk melanjutkan</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.linkText}>
            Belum punya akun? <Text style={styles.linkBold}>Daftar sekarang</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9F4", // Hijau Latar
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 250,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3A5A40", // Teks Hijau Tua
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    backgroundColor: "#F3F9F4", // Latar input
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#A9D9B0", // Hijau Utama
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkBold: {
    color: "#3A5A40", // Teks Hijau Tua
    fontWeight: "700",
  },
});