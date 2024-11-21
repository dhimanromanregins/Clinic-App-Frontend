import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../Actions/Api';

const MedicalReports = ({route, navigation }) => {
  const { childData } = route.params;
  const childId = childData.id

  const [sickLeaveRecords, setSickLeaveRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch the sick leave data
  const fetchSickLeaveData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token'); 
      if (!accessToken) {
        Alert.alert("Error", "Access token is missing!");
        return;
      }

      const response = await fetch(`${BASE_URL}/children/${childId}/documents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSickLeaveRecords(data);
      } else {
        Alert.alert("Error", "Failed to fetch data!");
      }
    } catch (error) {
      console.error('Error fetching sick leave data:', error);
      Alert.alert("Error", "Something went wrong while fetching data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSickLeaveData();
  });

  // Function to open the PDF file when clicked
  const openDocument = (documentUrl) => {
    Linking.openURL(documentUrl).catch(err => console.error('Failed to open PDF', err));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section - Full width */}
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
      <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
        </TouchableOpacity> 
      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
        {/* Title Section */}
        <View style={styles.textSection}>
          <Text style={styles.text}>Medical Reports</Text>
          <View style={styles.borderLine} />
        </View>

        {isLoading ? (
          <Text>Loading...</Text> // Display loading text while data is being fetched
        ) : (
          // Display the sick leave records
          sickLeaveRecords.map((record, index) => (
            <View key={index} style={[styles.card, { backgroundColor: record.isUrgent ? '#FF0000' : '#000' }]}>
              <TouchableOpacity 
                style={styles.cardContent}
                onPress={() => openDocument(record.document_url)} // Pass document_url to open it
              >
                <Text style={styles.cardTextRight}>
                  Name: {record.Name}
                </Text>
                {/* record.leave_request_date */}
                {/* <Text style={styles.cardTextRight}>{record.title || 'Download the PDF'}</Text> */}
                <MaterialIcons name="picture-as-pdf" size={34} color="#2a4770" />
                
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop:40,
  },
  languageIcon: {
    marginRight: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  textSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a4770',
  },
  borderLine: {
    height: 4,
    backgroundColor: '#2a4770',
    marginTop: 10,
    alignSelf: 'stretch',
  },
  card: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 100, // Increased height for the card
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align the content to the right
  },
  cardTextRight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
    marginRight: 10,
  },
});

export default MedicalReports;
