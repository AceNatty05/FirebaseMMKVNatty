import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export const storageHelper = {
    setString: (key: string, value: string) => storage.set(key, value),
    getString: (key: string) => storage.getString(key),
    remove: (key: string) => storage.remove(key),
};