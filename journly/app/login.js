import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { SocialMediaButton } from "./components/SocialMediaButton";

import { API_URL } from '../config';


export default function App() {
  const [loading, setLoading] = useState(false);
  const showToast = (message) => {
    Toast.show({
      type: "error",
      text2: message,
      position: "top",
    });
  };
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (reqdata) => {
    setLoading(true);
    const jsonData = JSON.stringify(reqdata);
    try {
      // Validate reqdata before JSON serialization (optional)
      // You can add custom validation logic here to ensure reqdata is suitable for JSON conversion
      const jsonData = JSON.stringify(reqdata);
    } catch (error) {
      console.error("Error during JSON serialization:", error);
      showToast("An error occurred while preparing data. Please check your input.");
      setLoading(false); // Set loading to false even on serialization error
      return; // Exit the function early to prevent unnecessary network request
    }
  
    try {
      const response = await fetch(API_URL+"login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }
  
      const data = await response.json();
  
      if (data.token) {
        await AsyncStorage.setItem("access_token", data.token);
        showToast("hellooo")
        console.log(data.token)
        router.replace("/");
      } else {
        showToast(data.message + "access token hakuna");
      }
    } catch (error) {
      console.error("Error during network request or response processing:", error);
      showToast("An error occurred during the login process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View
          style={{
            marginTop: 15,
            marginBottom: 40,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
        </View>
        <Text style={[styles.label, { marginBottom: 10, marginLeft: 7 }]}>
          username
        </Text>
        <View style={{ position: "relative" }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter your username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#888888"
                style={styles.field}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.errorText}>* username is required.</Text>
          )}
        </View>

        <Text
          style={[
            styles.label,
            { marginTop: 30, marginBottom: 10, marginLeft: 7 },
          ]}
        >
          Password
        </Text>
        <View style={{ position: "relative" }}>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                style={styles.field}
                placeholderTextColor="#888888"
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorText}>
              * Password should be at least 6 characters.
            </Text>
          )}
        </View>
        <Pressable onPress={handleSubmit(onSubmit)}>
          <LinearGradient
            colors={["blue", "green"]}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.button, { marginTop: 40 }]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600" }}>Log in</Text>
            )}
          </LinearGradient>
        </Pressable>
        <Link href="/register" asChild>
          <Pressable style={{ alignItems: "center", marginTop: 15 }}>
            <Text style={{ color: "#A2A2A2" }}>
              Don't have an account?{" "}
              <Text style={{ color: "#fff" }}>Register</Text>
            </Text>
          </Pressable>
        </Link>
        <Toast />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  button: {
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    color: "#fff",
    marginTop: 20,
  },
  smallText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 40,
    marginLeft: 7,
  },
  label: {
    color: "#fff",
    fontSize: 17,
  },
  errorText: {
    color: "#9C00E4",
    position: "absolute",
    top: 60,
    left: 7,
  },
  field: {
    backgroundColor: "#171717",
    borderRadius: 15,
    borderColor: "#1F1F1F",
    borderWidth: 1,
    color: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
});
