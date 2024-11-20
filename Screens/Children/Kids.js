import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid,ActivityIndicator, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../Actions/Api"

const Kids = ({ navigation }) => {
  const [kids, setKids] = useState([]); // State to store kids data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token'); // Get access token from AsyncStorage
        if (!accessToken) {
          ToastAndroid.show('No access token found', ToastAndroid.SHORT);
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/children/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Pass access token in headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch kids data');
        }

        const data = await response.json();
        setKids(data); // Save kids data to state
        setLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Failed to load kids data', ToastAndroid.SHORT);
        
        setLoading(false);
      }
    };

    fetchKids();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
      </TouchableOpacity>

      {/* Section Title */}
      <View style={styles.textSection}>
        <Text style={styles.text}>Kids</Text>
        <View style={styles.borderLine} />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#2a4770" />
      ) : (
        <View>
          {kids.length > 0 ? (
            kids.map((kid, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  kid.gender.toLowerCase() === 'female' ? styles.cardBlack : styles.cardGreen
                ]}
                onPress={() => navigation.navigate('Mykids', { kidId: kid.id })}
              >
                <Image
                  source={
                    kid.gender.toLowerCase() === 'female'
                      ? require('../../assets/img4.jpg')
                      : require('../../assets/img3.jpg')
                  }
                  style={styles.profileImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{kid.full_name}</Text>
                    <Text style={styles.cardSubtitle}>
                      DOB: {kid.date_of_birth} | Gender: {kid.gender}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noKidsText}>No kids found</Text>
          )}
        </View>
      )}

      {/* Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddKids')}
      >
        <FontAwesome name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', 
    paddingVertical: 30,
    paddingHorizontal: 25,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  textSection: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a4770',
  },
  borderLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#2a4770',
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  // Card Section
  card: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardGreen: {
    backgroundColor: 'rgba(24,212,184,255)', // Green background
  },
  cardBlack: {
    backgroundColor: '#000000', // Black background
  },
  cardBlue: {
    backgroundColor: '#2a4770', // Blue background
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    alignItems: 'flex-end', // Align content to the right
    textAlign: 'right',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#dddddd',
    marginTop: 5,
    textAlign: 'right',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20, // Adjust placement from the bottom
    alignSelf: 'center', // Center horizontally
    backgroundColor: 'rgba(24,212,184,255)',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add shadow for floating effect
  },
});

export default Kids;