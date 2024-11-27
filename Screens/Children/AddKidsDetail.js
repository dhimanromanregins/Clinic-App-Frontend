import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView,Modal,FlatList, Platform , ToastAndroid} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../../Actions/Api';
import { useFocusEffect } from '@react-navigation/native';

const AddKidsDetail = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [uaeId, setUaeId] = useState('');
  const [sex, setSex] = useState('');
  const [nationality, setNationality] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [dob, setDob] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [language, setLanguage] = useState('en');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [errors, setErrors] = useState({});


  const AddKidsDetail = language === 'en' ? "Add Kid's Detail" : 'أضف تفاصيل الطفل';
  const UAENumber = language === 'en' ? 'UAE ID Number' : 'رقم الهويه الأماراتية';
  const Sex = language === 'en' ? 'Sex' : 'الجنس';
  const Nationality = language === 'en' ? 'Nationality' : 'الجنسيه';
  const AddKid = language === 'en' ? 'Add Kid' : 'أضف طفل';
  const DOB = language === 'en' ? 'Date Of Birth' : 'تاريخ الميلاد';
  const InsuranceCompany = language === 'en' ? 'Insurance Company' : 'شركة التأمين';  
  const InsuranceCompanyNumber = language === 'en' ? 'Insurance Number' : 'رقم التأمين'; 
  const FullNameasUAEID = language === 'en' ? 'Full Name as UAE ID' : 'ألأسم الكامل (حسب الهويه الأماراتية)';


  const toggleLanguage = async (selectedLanguage) => {
    try {
      setLanguage(selectedLanguage);
      await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving language to local storage:', error);
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ur', label: 'العربية' },
  ];

  useFocusEffect(
    useCallback(() => {
      const loadSelectedLanguage = async () => {
        try {
          const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
          if (savedLanguage) {
            setLanguage(savedLanguage);
            console.log(`Loaded language from storage: ${savedLanguage}`); // Debugging log
          }
        } catch (error) {
          console.error('Error loading language from local storage:', error);
        }
      };

      loadSelectedLanguage(); // Invoke the function to load the language
    }, [])
  );

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

      const response = await fetch(`${BASE_URL}/api/children/`, {
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
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>
      
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
        </TouchableOpacity>
      {/* Modal for Language Selection */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleLanguage(item.code)} style={styles.languageOption}>
                  <Text style={styles.languageText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.code}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content Section */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Section Title */}
          <View style={styles.textSection}>
            <Text style={styles.text}>{AddKidsDetail}</Text>
            <View style={styles.borderLine} />
          </View>

          {/* Full Name Input */}
          <Text style={styles.label}>{FullNameasUAEID}</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          {/* UAE ID Number */}
          <Text style={styles.label}>{UAENumber}</Text>
          <TextInput
            style={styles.input}
            value={uaeId}
            onChangeText={setUaeId}
            keyboardType="numeric"
          />
          {errors.uaeId && <Text style={styles.errorText}>{errors.uaeId}</Text>}

          {/* Gender Dropdown */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{Sex}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sex}
                  style={styles.picker}
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
              <Text style={styles.label}>{Nationality}</Text>
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{InsuranceCompany}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={insuranceCompany}
                  style={styles.picker}
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
              <Text style={styles.label}>{DOB}</Text>
              <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
              />
              {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            </View>
          </View>

          {/* Insurance Number */}
          <Text style={styles.label}>{InsuranceCompanyNumber}</Text>
          <TextInput
            style={styles.input}
            value={insuranceNumber}
            onChangeText={setInsuranceNumber}
          />
          {errors.insuranceNumber && <Text style={styles.errorText}>{errors.insuranceNumber}</Text>}

          {/* Add Kid Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{AddKid}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
   padding:20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1, // Ensures that the content can expand and scroll
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)', // Green background
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row', // Arrange elements horizontally
    justifyContent: 'space-between', // Space out the icons
    padding:0,
    marginTop:30,
  },

  textSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:0,

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
    color:'#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Background overlay
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  languageOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  languageText: {
    fontSize: 18,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#24d4b8',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AddKidsDetail;