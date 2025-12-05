import { Stack } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { db } from "../firebaseConfig";
import { storageHelper } from "../storage";

interface MahasiswaData {
  Nama: string;
  NIM: string;
  Jurusan: string;
  Angkatan: string;
}

export default function Mahasiswa() {
  const [data, setData] = useState<MahasiswaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log("Starting fetchData...");
      const startTime = Date.now();
      setLoading(true);
      setError(null);

      // uid ambil dari mkkv
      const uid = storageHelper.getString("uid");
      console.log("Querying with UID:", uid);
      console.log("UID type:", typeof uid);
      console.log("UID length:", uid?.length);

      if (!uid) {
        throw new Error("User ID not found. Please login first.");
      }

      // query ke firestore
      console.log("Fetching data from Firestore...");
      console.log("Query: collection='mahasiswa', where userId==", uid);
      const q = query(
        collection(db, "mahasiswa"),
        where("userId", "==", uid)
      );

      const snap = await getDocs(q);
      const elapsed = Date.now() - startTime;
      console.log(`Documents found: ${snap.size} (took ${elapsed}ms)`);
      
      if (snap.size === 0) {
        console.log("NO DOCUMENTS FOUND!");
      }

      const arr: MahasiswaData[] = [];
      snap.forEach((doc) => {
        console.log("Doc ID:", doc.id, "Data:", doc.data());
        arr.push(doc.data() as MahasiswaData);
      });

      // data disimpan di array
      setData(arr);
      console.log("Data fetched successfully:", arr.length, "items");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Data Mahasiswa' }} />
      <ScrollView style={{ padding: 20 }}>
      {loading && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Loading data...</Text>
        </View>
      )}

      {error && (
        <View style={{ padding: 20, backgroundColor: "#ffebee", borderRadius: 5 }}>
          <Text style={{ color: "#c62828", fontWeight: "bold" }}>Error:</Text>
          <Text style={{ color: "#c62828", marginTop: 5 }}>{error}</Text>
        </View>
      )}

      {!loading && !error && data.length === 0 && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text>No data found. Please add mahasiswa data first.</Text>
        </View>
      )}

      {!loading && !error && data.map((mhs, i) => (
        <View key={i} style={{ padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 }}>
          <Text>Nama: {mhs.Nama || "N/A"}</Text>
          <Text>NIM: {mhs.NIM || "N/A"}</Text>
          <Text>Jurusan: {mhs.Jurusan || "N/A"}</Text>
          <Text>Angkatan: {mhs.Angkatan || "N/A"}</Text>
        </View>
      ))}
    </ScrollView>
    </>
  );
}
