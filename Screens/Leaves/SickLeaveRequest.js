import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../../Actions/Api'
const SickLeaveRequest = ({ navigation }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [to, setTo] = useState('');
  const [sender, setSender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch children list on component mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log(token, '--------')
        const response = await fetch(`${BASE_URL}/children/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data, '========')
        if (response.ok) {
          setChildren(data);
        } else {
          Alert.alert('Error', 'Failed to fetch children');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred while fetching children');
      }
    };
    fetchChildren();
  }, []);

  // Submit sick leave request
  const handleSubmit = async () => {
    if (!selectedChild || !to || !sender) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/sick-leave-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          children: selectedChild,
          to,
          sender,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Sick leave request submitted successfully');
        navigation.goBack(); // Navigate back after successful submission
      } else {
        Alert.alert('Error', 'Failed to submit sick leave request');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while submitting the request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => alert('Language switch clicked')}
        >
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
        <View style={styles.textSection}>
          <Text style={styles.text}>Sick Leave Request</Text>
          <View style={styles.borderLine} />
        </View>

        {/* Kid Selector */}
        <Text style={styles.Newlabel}>Select Kid</Text>
    

  <Picker
    selectedValue={selectedChild}
    style={styles.picker}
    onValueChange={(itemValue) => setSelectedChild(itemValue)}
  >
    <Picker.Item label="Select a child" value={null} />
    {children.map((child) => (
      <Picker.Item key={child.id} label={child.full_name} value={child.id} />
    ))}
  </Picker>


        {/* To and From Section */}
        <View style={styles.row}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>To</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter To"
              value={to}
              onChangeText={setTo}
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

        {/* Additional Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.note}>
            Note: Sick leave is only issued upon medical examination or remote treatment. 
            You will receive the sick leave within 12 working hours if it is approved.
          </Text>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={[styles.applyButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.applyButtonText}>{isSubmitting ? 'Submitting...' : 'Apply'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
     paddingHorizontal: 20,
     // Padding for the content inside the ScrollView
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row', 
    alignItems: 'center',
  marginTop: 40,
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
  inputGroup: {
    marginBottom: 20,
    backgroundColor: '#2a4770',
    color:'#fff',
    borderRadius:10,
  },
  inputGroupHalf: {
    width: '48%',
    marginBottom: 20,
    marginTop:'20',
  },

  Newlabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a4770',
   marginBottom:20,
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a4770',
  
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  input: {

    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#2a4770',
    color: '#fff', 
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
    marginTop: 20,
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
  inputGroup: {
    marginBottom: 20,
    backgroundColor: '#2a4770',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  dropdownLabel: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
  },
  
  picker: {
    height: 50, 
    width: '100%', 
    color: '#fff', 
    textAlign: 'center',
    borderRadius: 10, 
    backgroundColor: '#2a4770', 
    paddingVertical: 0,
    marginTop: -8, 
    borderWidth: 5,

  },
});

export default SickLeaveRequest;
