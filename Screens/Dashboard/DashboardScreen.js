import React, { useState, useEffect,useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal,Image, Dimensions, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BASE_URL } from "../../Actions/Api"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);  
  const [images, setImages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const MyFiles = language === 'en' ? 'My Kid Files' : 'ملفات طفلي';
  const Booking = language === 'en' ? 'Book Medical Consultation' : 'حجز موعد';
  const Mykids = language === 'en' ? 'My kids' : 'أطفالي';
  const Telemedicine = language === 'en' ? 'Tele medicine' : 'العلاج عن بعد';
  const Calendar = language === 'en' ? 'Calendar' : 'مواعيد العيادة';
  const ContactUs = language === 'en' ? 'Contact Us' : 'معلومات العيادة';
  const MyKids = language === 'en' ? 'Reports' : 'التقارير و الملفات';

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
    { code: 'ur', label: 'اردو' },
  ];
  // Fetch banners from the API using fetch
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/banners/`);
        const data = await response.json();

        const bannerImages = data.map(banner => {
          return `${BASE_URL}/${banner.image}`; // Construct the full URL for the image
        });

        setImages(bannerImages);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []); 


  const getAccessToken = async () => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    const token = await getAccessToken();

    if (!token) {
      Alert.alert('Error', 'Access token is missing.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/notifications/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Filter unread notifications
        const unreadCount = data.filter((notification) => !notification.is_read).length;

        // Update states
        setNotifications(data);
        setUnreadCount(unreadCount);
      } else {
        Alert.alert('Error', 'Failed to fetch notifications.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

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
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const renderSliderItem = ({ item, index }) => (
    <Image source={{ uri: item }} style={[styles.sliderImage, { display: currentIndex === index ? 'flex' : 'none' }]} />
  );

  const renderDots = () => {
    return images.map((_, index) => (
      <View
        key={index}
        style={[styles.dot, currentIndex === index && styles.activeDot]}
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.leftHeaderIcons}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <MaterialIcons name="language" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationicon} onPress={() => navigation.navigate('Notification')}>
              <MaterialIcons name="notifications" size={34} color="white" />
              {unreadCount >= 1 && <Text style={styles.topIcons}>{unreadCount}</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.rightHeaderIcons}>
            <TouchableOpacity onPress={() => alert('Location clicked')}>
              <MaterialIcons name="place" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PersonalDetails')}
            >
              <MaterialIcons name="account-circle" size={34} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('./../../assets/logo.png')} // Path to your logo image
            style={styles.logoImage}
          />
        </View>

        {/* Custom Image Slider Section */}
        <View style={styles.sliderContainer}>
          <FlatList
            data={images}
            renderItem={renderSliderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        </View>

        {/* Navigation Buttons and Dots */}
        <View style={styles.sliderNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
            <MaterialIcons name="chevron-left" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <MaterialIcons name="chevron-right" size={40} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dotsContainer}>
          {renderDots()}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={() => navigation.navigate('BookDoctor')}
          >
            <Text style={styles.fullWidthButtonText}>{Booking}</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MyFiles')}>
              <MaterialIcons name="folder" size={34} color="#2a4770" />
              <Text style={styles.iconButtonText}>{MyFiles}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Calendar')}>
              <MaterialIcons name="calendar-today" size={34} color="#2a4770" />
              <Text style={styles.iconButtonText}>{Calendar}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('kids')}>
              <MaterialIcons name="people" size={34} color="#2a4770" />
              <Text style={styles.iconButtonText}>{Mykids}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeleMedicine')} // Navigate to TeleMedicine screen
            >
              <MaterialIcons name="video-call" size={34} color="#2a4770" />
              <Text style={styles.iconButtonText}>{Telemedicine}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => alert('Contact Us clicked')}>
              <MaterialIcons name="phone" size={34} color="#2a4770" />
              <Text style={styles.iconButtonText}>{ContactUs}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(24,212,184,255)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  leftHeaderIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '50%',
    
  },
  rightHeaderIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%',
  },
  logoContainer: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  sliderContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderImage: {
    width: screenWidth * 0.9,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  sliderNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 350,
    width: '100%',
  },
  navButton: {
    padding: 10,
    borderRadius: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    margin: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  content: {
    marginTop: 20,
    padding: 20,
  },
  fullWidthButton: {
    backgroundColor: 'rgba(24,212,184,255)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthButtonText: {
    color: '#2a4770',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: 'rgba(24,212,184,255)',
    width: '30%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconButtonText: {
    marginTop: 5,
    color: '#2a4770',
    fontSize: 14,
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
  notificationicon:{
    position:'relative',
  },
  topIcons:{
position:'absolute',
top:'-8',
left:'20',
color:'red',
fontSize:20,
fontWeight:600
  }
});

export default Dashboard;
