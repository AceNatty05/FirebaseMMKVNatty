// import komponen
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
import { storageHelper } from "../storage";

// definisi tipe data mahasiswa
interface MahasiswaData {
  Nama: string;
  NIM: string;
  Jurusan: string;
  Angkatan: string;
}

export default function Home() {
  // State untuk menyimpan data mahasiswa, status loading, dan error
  const [data, setData] = useState<MahasiswaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fungsi untuk fetch data dari firestore
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ambil uid dari mmkv
      const uid = storageHelper.getString("uid");
      if (!uid) {
        throw new Error("User ID not found. Please login first.");
      }
      
      // query ke firestore
      const q = query(
        collection(db, "mahasiswa"),
        where("userId", "==", uid)
      );

      const snap = await getDocs(q);
      const arr: MahasiswaData[] = [];
      snap.forEach((doc) => {
        arr.push(doc.data() as MahasiswaData);
      });

      // simpan hasil query
      setData(arr);

    } catch (err) {
      console.error("ERROR during fetch:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    // hapus uid dari mmkv
    storageHelper.remove("uid");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Header Baru */}
      <View style={styles.header}>
        <Text style={styles.title}>Selamat Datang</Text>
      </View>

      <ScrollView>
        {/* Loading State */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#A9D9B0" />
            <Text style={styles.loadingText}>Memuat data ...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada data mahasiswa.
            </Text>
          </View>
        )}

        {/* Data List */}
        {!loading && !error && data.length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.sectionTitle}>
              Data Mahasiswa Anda
            </Text>
            {data.map((mhs, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Nama:</Text>
                  <Text style={styles.cardValue}>{mhs.Nama || "N/A"}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>NIM:</Text>
                  <Text style={styles.cardValue}>{mhs.NIM || "N/A"}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Jurusan:</Text>
                  <Text style={styles.cardValue}>{mhs.Jurusan || "N/A"}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Angkatan:</Text>
                  <Text style={styles.cardValue}>{mhs.Angkatan || "N/A"}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9F4", // Hijau Latar
  },
  header: {
    backgroundColor: "#A9D9B0", // Hijau Utama
    padding: 20,
    paddingTop: 60, // Jarak aman dari status bar
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF", // Teks Putih
  },
  centerContainer: {
    padding: 40,
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#c62828",
  },
  errorTitle: {
    color: "#c62828",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  dataContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#3A5A40", // Teks Hijau Tua
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    width: 90,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});