import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform , ToastAndroid} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const AddKidsDetail = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [uaeId, setUaeId] = useState('');
  const [sex, setSex] = useState('');
  const [nationality, setNationality] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [dob, setDob] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [errors, setErrors] = useState({});

  const genderChoices = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" }
  ];

  const insuranceChoices = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" }
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = "Full Name is required";
    if (!uaeId) newErrors.uaeId = "UAE ID Number is required";
    if (!sex) newErrors.sex = "Sex is required";
    if (!nationality) newErrors.nationality = "Nationality is required";
    if (!insuranceCompany) newErrors.insuranceCompany = "Insurance Company is required";
    if (!dob) newErrors.dob = "Date of Birth is required";
    if (!insuranceNumber) newErrors.insuranceNumber = "Insurance Number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const data = {
      full_name: fullName,
      child_id_number: uaeId,
      gender: sex,
      nationality: nationality,
      insurance: insuranceCompany,
      insurance_number: insuranceNumber,
      date_of_birth: dob
    };


    try {
      const token = await AsyncStorage.getItem('access_token');
  
      if (!token) {
        console.log('No access token found');
        return;
      }
      setAccessToken(token);

      const response = await fetch('http://192.168.1.111:8001/api/children/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.status === 201) {
        const result = await response.json();
        console.log('Submitted successfully:', result);
        ToastAndroid.show('Child added successfully!', ToastAndroid.SHORT);
        navigation.navigate('kids'); // Navigate to the Kids page
      } else {
        const errorData = await response.json();
        console.error('Failed to submit:', errorData);
        ToastAndroid.show('Failed to submit data. Please try again.', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header with Back Button and Language Switch */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.languageIcon} onPress={() => alert('Language switch clicked')}>
            <MaterialIcons name="language" size={34} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.textSection}>
          <Text style={styles.text}>Add Kid's Details</Text>
          <View style={styles.borderLine} />
        </View>

        {/* Full Name Input */}
        <Text style={styles.label}>Full Name as per UAE ID</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        {/* UAE ID Number */}
        <Text style={styles.label}>UAE ID Number</Text>
        <TextInput
          style={styles.input}
          value={uaeId}
          onChangeText={setUaeId}
          keyboardType="numeric"
        />
        {errors.uaeId && <Text style={styles.errorText}>{errors.uaeId}</Text>}

        {/* Gender Dropdown */}
        <View style={styles.row}>
  {/* Sex Input */}
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Sex</Text>
    <View style={styles.pickerContainer}> {/* Wrapping Picker with a View */}
      <Picker
        selectedValue={sex}
        style={styles.picker} // Apply general picker style
        onValueChange={setSex}
      >
        {genderChoices.map((choice) => (
          <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
        ))}
      </Picker>
    </View>
    {errors.sex && <Text style={styles.errorText}>{errors.sex}</Text>}
  </View>

  {/* Nationality Input */}
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Nationality</Text>
    <TextInput
      style={styles.input}
      value={nationality}
      onChangeText={setNationality}
    />
    {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
  </View>
</View>


        {/* Insurance Company Dropdown */}
        <View style={styles.row}>
  {/* Insurance Company Input */}
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Insurance Company</Text>
    <View style={styles.pickerContainer}> {/* Wrap the Picker in a View to style it */}
      <Picker
        selectedValue={insuranceCompany}
        style={styles.picker} // Apply the picker-specific style
        onValueChange={setInsuranceCompany}
      >
        {insuranceChoices.map((choice) => (
          <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
        ))}
      </Picker>
    </View>
    {errors.insuranceCompany && <Text style={styles.errorText}>{errors.insuranceCompany}</Text>}
  </View>

  {/* Date of Birth Input */}
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Date of Birth</Text>
    <TextInput
      style={styles.input}
      value={dob}
      onChangeText={setDob}
    />
    {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
  </View>
</View>

        {/* Insurance Number */}
        <Text style={styles.label}>Insurance Number</Text>
        <TextInput
          style={styles.input}
          value={insuranceNumber}
          onChangeText={setInsuranceNumber}
        />
        {errors.insuranceNumber && <Text style={styles.errorText}>{errors.insuranceNumber}</Text>}

        {/* Add Kid Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Kid</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1, // Ensures that the content can expand and scroll
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', // Green background
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row', // Arrange elements horizontally
    justifyContent: 'space-between', // Space out the icons
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
    width: '100%',
    height: 4,
    backgroundColor: '#2a4770',
    marginTop: 10,
  },
  languageIcon: {
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a4770',
    marginBottom: 5,
    textAlign: 'right', // Align label text to the right
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#2a4770', 
    color: '#fff', 
    height: 60, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  halfWidth: {
    width: '48%', // Ensures both inputs take half width of the row
  },
  button: {
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
   
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
  },
  errorText:{
    color:'red'
  },
 
  inputContainer: {
    width: '48%', // Adjusting width slightly to account for any spacing
  },
  pickerContainer: {
    borderWidth: 1,
    backgroundColor: '#2a4770', 
    borderColor: '#ccc',
    borderRadius: 5, // Border radius for the Picker
    overflow: 'hidden', // Ensure the border radius is visible
// Make sure the Picker has the same height as the TextInput
  },
  picker: {
    height: 58, // Ensure the Picker is properly sized
    width: '100%',
  },
});

export default AddKidsDetail;