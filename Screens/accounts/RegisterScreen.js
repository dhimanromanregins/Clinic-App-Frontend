import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, ToastAndroid,ActivityIndicator,Image, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import {BASE_URL} from "../../Actions/Api"

export default function RegisterScreen({ navigation }) {
  const [firstParentName, setFirstParentName] = useState('');
  const [uaeId, setUaeId] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState('en'); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validationErrors = {};
    const nameParts = firstParentName.trim().split(' ');
  
    if (!firstParentName) {
      validationErrors.firstParentName = 'Parent name is required.';
    } else if (nameParts.length < 2) {
      validationErrors.firstParentName = 'Please provide both first and last name.';
    }
  
    if (!uaeId) {
      validationErrors.uaeId = 'UAE ID is required.';
    }
  
    if (!mobile) {
      validationErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobile)) {
      validationErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
  
    if (!password) {
      validationErrors.password = 'Password is required.';
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    const data = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(' '),
      phone_number: Number(mobile),
      id_number: uaeId,
      password,
    };
  
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      console.log(response, '---------------------')
      // Check if the response is successful
      if (response.ok) {
        const responseData = await response.json(); // Parse JSON response
        console.log(responseData, "666666666666666");
        ToastAndroid.showWithGravity(
          'OTP is sent to your Mobile Number: ' + responseData?.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
        navigation.navigate('OTP'); // Navigate to OTP screen
      } else {
        // Handle non-success responses
        const errorData = await response.json(); // Parse error details
        throw new Error(errorData.message || 'Registration failed: Phone Number Already exist');
      }
    } catch (error) {
      setLoading(false);
      ToastAndroid.showWithGravity(
        'Registration Failed: ' + (error.message || 'Unknown error'),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }
  };
  const toggleLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setIsModalVisible(false);
  };

  const firstParentNameText = language === 'en' ? 'Parent Name' : language === 'ae' ? 'نام والدین' : 'نام والدین';
  const uaeIdText = language === 'en' ? 'UAE ID' : language === 'ae' ? 'UAE شناختی' : 'UAE شناختی';
  const mobileText = language === 'en' ? 'Mobile Number' : language === 'ae' ? 'موبائل نمبر' : 'موبائل نمبر';
  const passwordText = language === 'en' ? 'Password' : language === 'ae' ? 'پاسورڈ' : 'پاسورڈ';
  const registerText = language === 'en' ? 'Register' : language === 'ae' ? 'حساب جديد' : 'حساب جديد';
  const signInText = language === 'en' ? "Already have an account?" : language === 'ae' ? 'کیا آپ کا اکاؤنٹ ہے؟' : 'کیا آپ کا اکاؤنٹ ہے؟';
  const signInLinkText = language === 'en' ? 'Login' : language === 'ae' ? 'لاگ ان کریں' : 'لاگ ان کریں';
  

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ae', label: 'اردو' }, 
  ];


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.languageSwitcher}>
          <Ionicons name="globe" size={30} color="white" />
        </TouchableOpacity>

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
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('./../../assets/logo.png')} 
            style={styles.logo}
          />
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Settings', 'Settings clicked!')} style={styles.settingsIcon}>
          <Ionicons name="settings" size={30} color="white" />
        </TouchableOpacity>

        {/* First Parent Name Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{firstParentNameText}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={firstParentName}
            onChangeText={setFirstParentName}
          />
        </View>
        {errors.firstParentName && <Text style={styles.error}>{errors.firstParentName}</Text>}

        {/* UAE ID Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{uaeIdText}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={uaeId}
            onChangeText={setUaeId}
            keyboardType="numeric"
          />
        </View>

        {errors.uaeId && <Text style={styles.error}>{errors.uaeId}</Text>}

        {/* Mobile Number Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{mobileText}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
        </View>
        {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

        {/* Create Password Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{passwordText}</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder=""
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible} // Toggles between secureTextEntry and visible password
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
              <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>
        
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>{registerText}</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>{signInText} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>{signInLinkText}</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(24,212,184,255)',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSwitcher: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'transparent',
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
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 15, // Reduced gap between inputs
  },
  label: {
    color: '#2a4770',
    fontSize: 16,
    fontWeight:'bold',
    marginBottom: 5,
    textAlign: 'right', // Corrected to use 'right' within quotes
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 1,
  },
  registerButton: {
    backgroundColor: '#24d4b8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Reduced gap after register button
  },
  registerButtonText: {
    color: '#2a4770',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the text and the link
    marginTop: 10, // Reduced margin
  },
  signInText: {
    color: '#2a4770',
    fontSize: 16,
  },
  signInLink: {
    color: '#2a4770',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  line: {
    width: '100%',
    height: 1,
    marginVertical: 5,
  },
});