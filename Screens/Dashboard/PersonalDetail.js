import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image , Modal, FlatList} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const PersonalDetail = ({ navigation }) => {
    // Set up state for form inputs
    const [myDetails, setMyDetails] = useState('');
    const [bookingHistory, setBookingHistory] = useState('');
    const [myKids, setMyKids] = useState('');
    const [language, setLanguage] = useState('en');
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Handler for button clicks (just logs for now)
    const handleButtonClick = (field) => {
        navigation.navigate('MyAccount')
        // You can later implement any specific functionality for each button
    };
    const handleButtonClickBooking = (field) => {
        navigation.navigate('MedicalHistory')
        // You can later implement any specific functionality for each button
    };

    const Booking = language === 'en' ? 'Book Medical Consultation' : 'حجز موعد';
    const Mykids = language === 'en' ? 'My kids' : 'أطفالي';
    const Telemedicine = language === 'en' ? 'Tele medicine' : 'العلاج عن بعد';
    const Calendar = language === 'en' ? 'Calendar' : 'مواعيد العيادة';
    const ContactUs = language === 'en' ? 'Contact Us' : 'معلومات العيادة';
    const MyKids = language === 'en' ? 'Reports' : 'التقارير و الملفات';
  
    const toggleLanguage = (selectedLanguage) => {
      setLanguage(selectedLanguage);
      setIsModalVisible(false); 
    };
  
    
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'ur', label: 'اردو' },
    ];

    return (
        <View style={styles.container}>
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
            {/* Header Section with Language Switcher */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.languageIcon} onPress={() => alert('Language switch clicked')}>
                    <MaterialIcons name="language" size={34} color="white" />
                </TouchableOpacity>
            </View>

            {/* Logo Section */}
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../../assets/logo.png')} // Path to logo image
                    style={styles.logo}
                />
            </View>

            {/* Page Title */}
            <View style={styles.headerWrapper}>
                <Text style={styles.header}>Personal</Text>
            </View>

            {/* Border Line */}
            <View style={styles.borderLine} />

            {/* Button Section */}
            <View style={styles.buttonSection}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleButtonClick('My Details')}>
                    <Text style={styles.buttonText}>My Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleButtonClickBooking('Booking History')}>
                    <Text style={styles.buttonText}>Booking History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('kids')}
                >
                    <Text style={styles.buttonText}>My Kids</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    languageIcon: {
        backgroundColor: 'rgba(24,212,184,255)', // Background color for the language icon
        padding: 10,
        height: 80,
        paddingTop: '25',
    },

    logoWrapper: {
        alignItems: 'center',
        marginVertical: 20, // Add some vertical spacing between elements
    },
    logo: {
        width: '60%',
        height: 150,
        resizeMode: 'contain', // Ensures the image fits proportionally
    },
    headerWrapper: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center', // Center the text horizontally
        justifyContent: 'center', // Center vertically if needed
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2a4770',
        textAlign: 'center',  // Center the text horizontally
    },
    borderLine: {
        width: '90%',  // Make the border line take up 50% of the screen width
        height: 4,
        backgroundColor: '#2a4770',
        marginTop: 10,
        alignSelf: 'center', // Center the border line
    },
    buttonSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    button: {
        height: 60,
        backgroundColor: '#fff', // White background
        borderColor: 'rgba(24,212,184,255)', // Border color set to #2a4770
        borderWidth: 1, // Adding a border to the button
        borderRadius: 5,
        justifyContent: 'center', // Aligns the button's content (text) to the right
        alignItems: 'flex-end', // Ensures the text aligns on the right
        marginBottom: 15,
        paddingRight: 10, // Add some padding to the right side of the button
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a4770', // Text color set to #2a4770
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

export default PersonalDetail;