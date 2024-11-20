import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, ToastAndroid,TouchableOpacity, Image, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {BASE_URL} from "../../Actions/Api"

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Error states for fields
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    // Reset errors before validation
    setMobileError('');
    setPasswordError('');

    if (!mobile) {
      setMobileError('Mobile number is required');
    }
    if (!password) {
      setPasswordError('Password is required');
    }

    if (!mobile || !password) {
      return;
    }

    const loginData = {
      identifier: mobile,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        // If the response is successful, navigate to LoginOTP screen
        ToastAndroid.showWithGravity(
          'Otp Sent Successfully: ' + (data.message || 'Please check your phone'),
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
        navigation.navigate('LoginOTP');
      } else {
        ToastAndroid.showWithGravity(
          'Login Failed: ' + (data.message || 'Invalid credentials. Please try again'),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Network error. Please try again later.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }
  };

  // Function to toggle between languages
  const toggleLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setIsModalVisible(false); // Close the modal after selection
  };

  // Text based on the selected language
  const loginText = language === 'en' ? 'Login' : language === 'es' ? 'Iniciar sesión' : language === 'fr' ? 'Connexion' : 'لاگ ان';
  const mobileText = language === 'en' ? 'Mobile Number' : language === 'es' ? 'Número de móvil' : language === 'fr' ? 'Numéro de mobile' : 'موبائل نمبر';
  const passwordText = language === 'en' ? 'Password' : language === 'es' ? 'Contraseña' : language === 'fr' ? 'Mot de passe' : 'پاسورڈ';
  const signUpText = language === 'en' ? "Don't have an account?" : language === 'es' ? '¿No tienes una cuenta?' : language === 'fr' ? 'Vous n\'avez pas de compte?' : 'کیا آپ کا اکاؤنٹ نہیں ہے؟';
  const signUpLinkText = language === 'en' ? 'Sign Up' : language === 'es' ? 'Registrarse' : language === 'fr' ? 'S\'inscrire' : 'رجسٹر کریں';

  // Available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ur', label: 'اردو' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for both iOS and Android
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Language Switcher Icon */}
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.languageSwitcher}>
          <Ionicons name="globe" size={30} color="white" />
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
        <View style={styles.blackBox}></View>
        {/* Logo Image */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('./../../assets/logo.png')} 
            style={styles.logo}
          />
        </View>

        {/* Settings Icon */}
        <TouchableOpacity onPress={() => Alert.alert('Settings', 'Settings clicked!')} style={styles.settingsIcon}>
          <Ionicons name="settings" size={30} color="white" />
        </TouchableOpacity>

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
          {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
        </View>
        
        {/* Password Input */}
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
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')} style={styles.forgotPassword}>
  <Text style={styles.forgotPasswordText}>
    {language === 'en' ? 'Forgot Password?' : language === 'es' ? '¿Olvidaste tu contraseña?' : language === 'fr' ? 'Mot de passe oublié?' : 'پاسورڈ بھول گئے؟'}
  </Text>
</TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{loginText}</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{signUpText} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>{signUpLinkText}</Text>
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
    marginBottom: 30,  // Adjust this value for spacing between logo and inputs
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 120, // Adjust the width of the logo
    height: 120, // Adjust the height of the logo
    resizeMode: 'contain',
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-end', // Align input fields to the right of label
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2a4770',
    textAlign: 'right', // Align label text to the right
    width: '100%', // Make the label span the full width for correct alignment
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    width: '100%',
    backgroundColor: 'transparent', // No background color
    shadowColor: '#0ebeff',  // Blue shadow color
    shadowOffset: { width: 4, height: 4 }, // Shadow direction (right and bottom)
    shadowOpacity: 0.8, // Shadow opacity (controls darkness)
    shadowRadius: 10, // Shadow blur radius (controls softness)
    elevation: 5, // For Android devices, subtle shadow effect
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signUpText: {
    color: '#2a4770',
    fontSize: 16,
  },
  signUpLink: {
    color: '#2a4770',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#2a4770', // Button background color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end', // Align to the right
    marginBottom: 20, // Spacing below the link
  },
  forgotPasswordText: {
    color: '#2a4770', // Text color
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Underline the text
  },
  blackBox: {
    backgroundColor: 'black', // Black background
    height: 50, // Height of the box
    width: '100%', // Full width of the container (screen)
    marginTop: 50, // Ensure no margin around the box
    padding: 0, // Ensure no padding inside the box
  },
});