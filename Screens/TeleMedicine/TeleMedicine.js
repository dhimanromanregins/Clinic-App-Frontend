import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView , ToastAndroid} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for language icon
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the back arrow icon
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';


const TeleMedicine = ({ navigation, userId }) => { // Accept userId from props or context
  const [doctors, setDoctors] = useState([]);

  const handlePress = async (doctor) => {
    const accessToken = await AsyncStorage.getItem('access_token');
    console.log("Access Token:", accessToken); // Debug log
  
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    
    if (doctor.is_available) {
      console.log("Doctor is available, sending request to book...");
      
      // Send POST request to API
      fetch(`${BASE_URL}/create-tele-doctor/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({
          doctor_id: doctor.id, // Pass only doctor ID in the body
        }),
      })
        .then((response) => {
          if (response.status === 201) {
            ToastAndroid.show('Doctor successfully booked!', ToastAndroid.SHORT);  // Success toast
            return response.json();
          } else {
            ToastAndroid.show('Error booking doctor!', ToastAndroid.SHORT);  // Error toast
            throw new Error('Error booking doctor');
          }
        })
        .then((data) => {
          console.log("Successfully booked with response:", data);
          navigation.navigate('TeleDoctor', { doctor: doctor }); // Navigate to the TeleDoctor screen
        })
        .catch((error) => {
          console.error('Error booking doctor:', error);
        });
    } else {
      ToastAndroid.show('This doctor is currently unavailable.', ToastAndroid.SHORT);  // Unavailable toast
    }
  };

  // Fetch doctors data from the API
  useEffect(() => {
    fetch(`${BASE_URL}/doctors/`)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data.doctors); // Set the fetched doctors to state
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleDoctorDetail = (doctorId) => {
    navigation.navigate('DoctorDetail', { doctorId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Language Switcher Icon */}
        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => alert('Language switch clicked')}
        >
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>

        {/* Back Button Icon */}
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Go back to the previous screen
          style={styles.backButton}
        >
          <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
        </TouchableOpacity>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.text}>Tele Medicine Doctors</Text>
        <View style={styles.borderLine} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {doctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorItem}>
            {/* Profile Image and Details */}
            <View style={styles.profileSection}>
              <Image
                source={{ uri: `${BASE_URL}${doctor.profile_photo}` }}
                style={styles.profilePic}
              />
            </View>

            {/* Container for the Text and Available Button */}
            <View style={styles.availableSection}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <TouchableOpacity
                style={[styles.bookButton, !doctor.is_available && styles.disabledButton]}
                onPress={() => handlePress(doctor)}  // Corrected: pass doctor as argument
                disabled={!doctor.is_available}
              >
                <Text style={styles.bookText}>
                  {doctor.is_available ? 'Available' : 'Not Available'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Exclamation Icon */}
            <TouchableOpacity
              style={styles.exclamationWrapper}
              onPress={() => handleDoctorDetail(doctor.id)}
            >
              <FontAwesome name="exclamation-circle" size={24} color="#2a4770" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
    backgroundColor: '#f9f9f9', // Light background color
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', // Green background
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row', // Arrange elements horizontally
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
  scrollContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,   // Keep the rounded corners
    shadowRadius: 4,
    width: '100%',
    height: 160,
    marginBottom: 20,
    position: 'relative',

  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 20,
    borderWidth: 2,    // Border thickness
    borderColor: '#2a4770', // Border color (adjust as needed)
  },
  bookButton: {
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 60,
    marginRight: 30,
  },
  bookText: {
    color: '#2a4770',
    fontWeight: 'bold',
  },
  exclamationWrapper: {
    position: 'absolute',
    right: -10,
    top: '60%',
    transform: [{ translateY: -16 }],
    backgroundColor: 'rgba(24,212,184,255)',
    borderRadius: 50,
    padding: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TeleMedicine;
