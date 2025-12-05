import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 1. Import komponen yang kita butuhkan
import { Platform, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  // 2. Cek apakah kita sedang di platform 'web'
  const isWeb = Platform.OS === 'web';

  return (
    <ThemeProvider value={DefaultTheme}>
      {/* 3. Bungkus semuanya dengan View container baru */}
      <View style={styles.container}>
        
        {/* 4. Buat "pembungkus" (wrapper) yang akan membatasi lebar di web */}
        <View style={isWeb ? styles.webWrapper : styles.mobileWrapper}>
          
          {/* Ini adalah aplikasi Anda */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>

        </View>
      </View>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

// 5. Tambahkan StyleSheet di bawah
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Di web, buat background-nya sama dengan warna app & pusatkan kontennya
    backgroundColor: Platform.OS === 'web' ? '#F3F9F4' : '#FFFFFF',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  webWrapper: {
    flex: 1,
    width: '100%',
    // Ini kuncinya: batasi lebar maksimum!
    maxWidth: 450, 
    // Opsional: Beri sedikit border agar terlihat seperti "bingkai HP"
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  mobileWrapper: {
    flex: 1,
  }
});