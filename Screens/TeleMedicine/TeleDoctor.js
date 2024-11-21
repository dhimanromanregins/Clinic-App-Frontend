import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BASE_URL } from '../../Actions/Api';

const TeleDoctor = ({route,navigation}) => {
  const { doctor } = route.params;
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

   
      </View>
     {/* Back Button Icon */}
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
          <Text style={styles.text}>TeleMedicine Doctor</Text>
          <View style={styles.borderLine} />
        </View>

        {/* Doctor Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
          <Image
            source={doctor.profile_photo ? { uri: BASE_URL + doctor.profile_photo } : require('./../../assets/img4.jpg')}
            style={styles.profileImage}
          />

          {/* Doctor's Full Name */}
          <Text style={styles.text}>{doctor.name}</Text>
        </View>

        {/* New Message Section */}
        <View style={styles.messageSection}>
          <Text style={styles.messageText}>Your request has been registered you will be contacted within 60 minutes</Text>
        </View>
          
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
    marginTop: 20,
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
    alignSelf: 'stretch', // Ensures it spans the parent's full width
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    marginBottom: 10,
  },
  messageSection: {
    alignItems: 'center',
    marginTop: 40, // Add gap from the top
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a4770',
    textAlign: 'center', // Center align the text
  },
});

export default TeleDoctor;
