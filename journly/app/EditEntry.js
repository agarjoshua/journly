import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";

import Toast from "react-native-toast-message";
import { API_URL, crud_urls } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";


// const token = AsyncStorage.getItem('access_token');

const EditEntry = () => {

    const token = AsyncStorage.getItem('access_token');
  const navigation = useNavigation();
  const route = useRouter();

  const [entry, setEntry] = useState({}); // State to hold entry details

  const item = useLocalSearchParams();
  

  useEffect(() => {
    const initialEntry = route.state?.item || {}; // Get entry from context
    setEntry(initialEntry);
  }, [route.state]);

  try {
    const access_token = AsyncStorage.getItem("access_token");
    console.log(access_token);

    if (!access_token) {
      // Access token is not present, navigate to login screen
      router.replace("/login");
      return;
    }
  } catch (error) {
    console.log(error);
  }


  const handleEdit = async () => {

    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log(token)
      const response = await fetch(crud_urls + `entries/${item.id}/`, {
        method: "GET",
        headers: {
            'Authorization': `Token ${token}`,
        },
      });
      
      console.log(response.status)

      if (response.status === 204) {
        const error = await response.json();
        console.log("Entry deleted successfully");
        navigation.goBack();
      }

      if (!response.ok) {
        navigation.goBack();
      }
    } catch (error) {
      navigation.goBack();
    }
    console.log("Updating entry:");
    navigation.goBack(); 
  };

 

  const handleDelete = async () => {


    try {
        const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(crud_urls + `entries/${item.id}/`, {
        method: "DELETE",
        headers: {
            'Authorization': `Token ${token}`,
        },
      });
      
      console.log(response.status)

      if (response.status === 204) {
        const error = await response.json();
        console.log("Entry deleted successfully");
        navigation.goBack();
      }

      if (!response.ok) {
        navigation.goBack();
      }
    } catch (error) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Entry</Text>
      <TextInput
        style={styles.input}
        value={item.title || ""} 
        onChangeText={(text) => setEntry({ ...entry, title: text })}
        placeholder="Title"
      />
      <TextInput
        style={styles.wideinput}
        value={item.content || ""} 
        onChangeText={(text) => setEntry({ ...entry, content: text })}
        placeholder="Content"
        multiline={true} 
      />
      <TextInput
        style={styles.input}
        value={item.date?.toString() || ""} 
        onChangeText={(text) => setEntry({ ...entry, date: text })} 
        placeholder="Date (YYYY-MM-DD)"
      />
      
      <TextInput
        style={styles.input}
        value={item.category || ""} // Pre-fill with category if available
        onChangeText={(text) => setEntry({ ...entry, category: text })}
        placeholder="Category"
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleEdit} />
        <Button title="Delete" onPress={handleDelete} color="red" />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "",
    padding: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1F1F1F",
    padding: 10,
    marginBottom: 10,
  },
  wideinput: {
    borderWidth: 1,
    borderColor: "#1F1F1F",
    alignItems: 'stretch',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default EditEntry;
