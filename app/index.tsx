import { Redirect } from "expo-router";
import { storageHelper } from "../storage";

export default function Index() {
  const uid = storageHelper.getString("uid");

  if (uid) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}