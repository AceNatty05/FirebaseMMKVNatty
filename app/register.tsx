// import komponen
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { storageHelper } from "../storage";

export default function Register() {
  // state untuk form akun
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  //  state untuk form data mahasiswa
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");
  
  // state loading
  const [loading, setLoading] = useState(false);

  const register = async () => {
    try {
      // validasi input
      if (!email || !password || !nama || !nim || !jurusan || !angkatan) {
        alert("Semua field harus diisi!");
        return;
      }
      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak sama!");
        return;
      }
      if (password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
      }

      setLoading(true);

      // buat user di firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // siapkan data untuk disimpan ke firestore
      const mahasiswaData = {
        userId: userId,
        email: email,
        Nama: nama,
        NIM: nim,
        Jurusan: jurusan,
        Angkatan: angkatan,
        createdAt: new Date().toISOString(),
      };
      
      // simpan ke koleksi mahasiswa
      await addDoc(collection(db, "mahasiswa"), mahasiswaData);

      // simpan uid ke mmkv
      storageHelper.setString("uid", userId);

      alert("Registrasi berhasil!");
      router.replace("/home");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage = "Registrasi gagal!";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar!";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid!";
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Registrasi Akun</Text>
      
      {/* Account Information Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        
        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="contoh@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Minimal 6 karakter"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Konfirmasi Password:</Text>
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Ulangi password"
          placeholderTextColor="#999"
          style={styles.input}
        />
      </View>

      {/* Student Information Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Mahasiswa</Text>

        <Text style={styles.label}>Nama Lengkap:</Text>
        <TextInput
          value={nama}
          onChangeText={setNama}
          placeholder="Nama lengkap mahasiswa"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>NIM:</Text>
        <TextInput
          value={nim}
          onChangeText={setNim}
          placeholder="Nomor Induk Mahasiswa"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Jurusan:</Text>
        <TextInput
          value={jurusan}
          onChangeText={setJurusan}
          placeholder="Contoh: Informatika"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Angkatan:</Text>
        <TextInput
          value={angkatan}
          onChangeText={setAngkatan}
          placeholder="Contoh: 2023"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={register}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity 
        style={styles.linkContainer}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.linkText}>
          Sudah punya akun? <Text style={styles.linkBold}>Login di sini</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9F4", // Hijau Latar
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40, // Beri jarak dari atas
    textAlign: "center",
    color: "#3A5A40", // Teks Hijau Tua
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#3A5A40", // Teks Hijau Tua
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#A9D9B0", // Hijau Utama
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkBold: {
    color: "#3A5A40", // Teks Hijau Tua
    fontWeight: "600",
  },
});