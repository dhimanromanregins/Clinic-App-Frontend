import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BASE_URL } from '../../../Actions/Api';

const ParentSickLeave = ({ navigation }) => {
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
          <Text style={styles.text}>Parent Sick Leave</Text>
          <View style={styles.borderLine} />
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          {/* Request Leave Button */}
          <TouchableOpacity 
            style={[styles.button, styles.greenBackground]} 
            onPress={() => navigation.navigate('ParentSick')}
          >
            <Text style={styles.buttonText}>Request Leave</Text>
          </TouchableOpacity>

          {/* Sick Leave History Button */}
          <TouchableOpacity 
            style={[styles.button, styles.greenBackground]} 
            onPress={() => navigation.navigate('ParentSickLeaveHistory')}
          >
            <Text style={styles.buttonText}>Sick Leave History</Text>
          </TouchableOpacity>
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
  buttonSection: {
    marginTop: 30,
  },
  button: {
    paddingVertical: 15,
    marginBottom: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-end', // Align text to the right
  },
  greenBackground: {
    backgroundColor: 'rgba(24,212,184,255)', // Green color for the background
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a4770',
    marginRight: 10, // Text alignment right
  },
});

export default ParentSickLeave;
