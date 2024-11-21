import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const WhomeItMayCocern = ({ navigation }) => {
  const [kids, setKids] = useState([{ name: '' }]);
  const [concern, setConcern] = useState('');  // Use concern field
  const [sentTo, setSentTo] = useState('');
  const [ParentName, setParentName] = useState('');
  const [sender, setSender] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');  // New state for additional notes

  const handleAddKid = () => {
    setKids([...kids, { name: '' }]);
  };

  const handleInputChange = (index, value) => {
    const newKids = [...kids];
    newKids[index].name = value;
    setKids(newKids);
  };

  const handleRemoveKid = (index) => {
    const newKids = kids.filter((_, i) => i !== index);
    setKids(newKids);
  };

  const handleSubmit = async () => {
    try {
      // Get the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('access_token');
      
      // Decode the token to get user information (optional based on the backend logic)
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;

      // Prepare child names as a comma-separated string
      const childNames = kids.map(kid => kid.name).join(', ');

      // Prepare data object to be sent to the API
      const data = {
        concern: concern, 
        user: userId,      
        child_name: childNames, 
        sent_to: sentTo,   
        sender: sender,     
        additional_notes: additionalNotes  
      };

      // Send the data to the backend API
      const response = await fetch('http://192.168.1.111:8001/to-whom-it-may-concern/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,  // Send access token for authentication
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      // Check if the response is successful
      if (response.ok) {
        ToastAndroid.show('Request submitted successfully!', ToastAndroid.SHORT);
        navigation.goBack();  // Navigate back on success
      } else {
        ToastAndroid.show('Failed to submit request: ' + responseData.message, ToastAndroid.LONG);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('An error occurred while submitting the request.', ToastAndroid.LONG);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section - Full width */}
      <View style={styles.header}>
        {/* Language Switcher Icon */}
        <TouchableOpacity 
          style={styles.languageIcon} 
          onPress={() => ToastAndroid.show('Language switch clicked', ToastAndroid.SHORT)}
        >
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>
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
          <Text style={styles.text}>To Whome It May Cocern</Text>
          <View style={styles.borderLine} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Concern</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Concern" 
            value={concern} // Bind to concern state
            onChangeText={setConcern}  // Update concern state
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parent Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Parent Name " 
            value={ParentName} // Bind to concern state
            onChangeText={setParentName}  // Update concern state
          />
        </View>

        {/* Kid Names Section - Dynamic Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kid Name</Text>
          {kids.map((kid, index) => (
            <View key={index} style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="Enter Kid's Name"
                value={kid.name}
                onChangeText={(value) => handleInputChange(index, value)}
              />
              {index !== 0 && (
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => handleRemoveKid(index)}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              )}
              {index === kids.length - 1 && (
                <TouchableOpacity style={styles.plusButton} onPress={handleAddKid}>
                  <MaterialIcons name="add" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* To and From Section */}
        <View style={styles.row}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>To</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter To" 
              value={sentTo}
              onChangeText={setSentTo}
            />
          </View>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>From</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter From" 
              value={sender}
              onChangeText={setSender}
            />
          </View>
        </View>

        {/* Additional Notes Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Add your additional notes" 
            value={additionalNotes} // Bind to additionalNotes state
            onChangeText={setAdditionalNotes} // Update additionalNotes state
          />
        </View>

        {/* Notes Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.note}>
            Note: Sick leave is only issued upon medical examination or remote treatment. 
            You will receive the sick leave within 12 working hours if it is approved.
          </Text>
          <Text style={styles.note}>
            You will receive a companion leave if it is approved within 12 working hours.
          </Text>
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleSubmit}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
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
    marginTop: 0,
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
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupHalf: {
    width: '48%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a4770',
    marginBottom: 5,
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#2a4770',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures even spacing between items
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2a4770',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  applyButton: {
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 0,
  },
  applyButtonText: {
    color: '#2a4770',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 16,
    color: '#2a4770',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default WhomeItMayCocern;
