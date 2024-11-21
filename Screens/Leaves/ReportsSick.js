import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../Actions/Api'

const ReportsSick = ({ route, navigation }) => {
  const { childId } = route.params;

  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          // Handle missing token, possibly navigate to login page
          alert('No token found');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/children/${childId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setChildData(data);
        } else {
          // Handle errors (e.g. child not found, API issues)
          alert('Failed to fetch child data');
        }
      } catch (error) {
        console.error('Error fetching child details:', error);
        alert('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchChildDetails();
  }, [childId]);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Language Switcher Icon */}
        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => alert('Language switch clicked')}
        >
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>

        {/* Back Button Icon */}
      </View>

      {/* Back Button outside of header */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
      </TouchableOpacity>

      {/* Title Section */}
      <View style={styles.textSection}>
        <Text style={styles.text}>Reports & Sick Leave</Text>
        <View style={styles.borderLine} />
      </View>

      {/* Child Info */}
      {childData && (
        <View style={[styles.card, styles.cardGreen]}>
          <Image
            source={childData.gender === 'female' ? require('../../assets/img2.jpg') : require('../../assets/img3.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{childData.full_name}</Text>
            <Text style={styles.cardSubtitle}>
              Age: {childData.date_of_birth} | Grade: {childData.grade}
            </Text>
          </View>
        </View>
      )}

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        {/* Sick Leave Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() => navigation.navigate('MedicalReports',{ childData })}
        >
          <Text style={styles.buttonText}>Medical Reports</Text>
        </TouchableOpacity>

        {/* Medical History Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() =>navigation.navigate('SickLeaveButton', { childId: childId })}
        >
          <Text style={styles.buttonText}>Sick Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        {/* To Whom May Concern Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() => navigation.navigate('WhomeItMayCocern')}
        >
          <Text style={styles.buttonText}>To Whom May Concern</Text>
        </TouchableOpacity>

        {/* Parent Sick Leave Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() => navigation.navigate('ParentSickLeave')}WhomeItMayCocern
        >
          <Text style={styles.buttonText}>Parent Sick Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        {/* Receipt Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() => alert('Sick Leave Pressed')}
        >
          <Text style={styles.buttonText}>Receipt</Text>
        </TouchableOpacity>

        {/* Lab Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonShadow]}
          onPress={() => alert('Medical History Pressed')}
        >
          <Text style={styles.buttonText}>Lab</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    marginRight: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  textSection: {
    width: '100%',
    alignItems: 'right',
    marginBottom: 20,
    marginTop: 20,
    paddingLeft: 15,  // Added left padding
    paddingRight: 15, // Added right padding
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a4770',
    textAlign: 'right',  // This is correct for right-aligning the text
  },
  borderLine: {
    height: 4,
    backgroundColor: '#2a4770',
    marginTop: 10,
    alignSelf: 'stretch', // Ensures it spans the parent's full width
  },
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

   marginLeft:18,
 },

  cardGreen: {
    backgroundColor: 'black', // Green background
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingLeft: 15,  // Added left padding
    paddingRight: 15, // Added right padding
  },
  button: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24,212,184,255)', // White background for the buttons
    height: 100,
    borderWidth: 2,  // Adds a border around the button
    borderColor: 'rgba(24,212,184,255)', // Border color to match the text color
  },
  buttonText: {
    fontSize: 18,
    color: '#2a4770', // Color of the text
  },
  buttonShadow: {
    shadowColor: 'rgba(24,212,184,255)', // Custom shadow color using rgba(24,212,184,255)
    shadowOffset: { width: 0, height: 4 }, // Vertical offset for the shadow (downwards)
    shadowOpacity: 0.6,  // Set shadow opacity
    shadowRadius: 5, // Radius for shadow softness
    elevation: 10, // Elevation for Android shadow effect
  },
});

export default ReportsSick;