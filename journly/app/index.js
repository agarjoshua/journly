import { Link } from 'expo-router';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { API_URL, crud_urls } from '../config';

export default function Page() {

  const router = useRouter();
  const [response, setResponse] = useState(null);
  
  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const access_token = await AsyncStorage.getItem('access_token');
        
        if (!access_token) {
          // Access token is not present, navigate to login screen
          router.replace('/login');
          return;
        }

        const response = await fetch(crud_urls+"entries/", {
          headers: {
            'Authorization': `Token ${access_token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) { // Check for unauthorized error (invalid token)
            // Handle invalid token case (e.g., remove token, navigate to login)
            console.error("Error during JSON serialization:", response.body);
            // showToast("An error occurred."+ response);
          } else {
            // Handle other errors (e.g., network issues, server errors)
            console.error('Error:', response); // Or display a user-friendly error message
          }
        }

        else
        {
          // Access token is valid, display the protected page
          const data = await response.json();
          setResponse(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkAccessToken();
  });
  const handleLogout = async () => {
      await AsyncStorage.removeItem('access_token');
      router.replace('/login');
    };

    const handleEditEntry = (item) => {
      router.push({pathname: '/EditEntry',  params: item}); // Pass entry details to EditEntry screen
    };

    const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleEditEntry(item)}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>ID: {item.id}</Text>
          <Text style={styles.listItemText}>Title: {item.title}</Text>
          <Text style={styles.listItemText}>Date: {item.date}</Text>
          <Text style={styles.listItemText}>Category: {item.category}</Text>
          <Text style={styles.listItemText}>User: {item.user}</Text>
        </View>
      </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi </Text>
        <Button title="Logout" style={styles.logoutButton} onPress={handleLogout} />
      </View>
      <FlatList
        data={response}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Ensure unique key for each item
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
  },
  logoutButton: {
    backgroundColor: '#9C00E4',
  },
  listItem: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});