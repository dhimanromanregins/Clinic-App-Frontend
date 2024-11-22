import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { FontAwesome } from '@expo/vector-icons'; // For the back arrow icon
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from expo-linear-gradient
import { BASE_URL } from '../../Actions/Api';
const Calendar = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch the doctors' availability data from the API
    fetch(`${BASE_URL}/api/doctors-availability/?date=2024-11-21`)
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setDoctors(data);
      })
      .catch((error) => {
        // Show an error message if the fetch fails
        ToastAndroid.show('Error fetching doctors data', ToastAndroid.SHORT);
      });
  }, []);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'short', // 'Mon', 'Tue', etc.
    day: '2-digit', // '01', '02', etc.
    month: 'short', // 'Jan', 'Feb', etc.
    year: 'numeric', // '2024'
  });

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Language Switcher Icon */}
          <TouchableOpacity 
            style={styles.languageIcon} 
            onPress={() => ToastAndroid.show('Language switch clicked', ToastAndroid.SHORT)}
          >
            <MaterialIcons name="language" size={34} color="white" />
          </TouchableOpacity>

          {/* Back Button Icon */}
          <TouchableOpacity 
            onPress={() => ToastAndroid.show('Going back', ToastAndroid.SHORT)}
            style={styles.backButton}
          >
            <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
          </TouchableOpacity>
        </View>

        {/* Calendar Title */}
        <View style={styles.textSection}>
          <Text style={styles.text}>Calendar</Text>
          <View style={styles.borderLine} />
          <Text style={styles.text}>{formattedDate}</Text>
        </View>

        {/* Doctor Cards Section with Gradient Overlay */}
        {doctors.map((doctorData, index) => {
          const doctor = doctorData.doctor;
          const isAvailable = doctor.is_available;
          const morningStart = doctorData.morning_start.split(' ')[0];
          // const morningEnd = doctorData.morning_end.split(' ')[0];
          // const afternoonStart = doctorData.afternoon_start.split(' ')[0];
          const afternoonEnd = doctorData.afternoon_end.split(' ')[0];

          return (
            <React.Fragment key={doctor.id}>
              <LinearGradient
                colors={['#fff', 'rgba(24,212,184,255)', '#fff']} // Gradient for the card section
                start={{ x: 0, y: 0 }} // Vertical gradient for the card
                end={{ x: 1, y: 0 }} // Gradient direction is horizontal
                style={styles.card}
              >
                <View style={styles.cardContent}>
                  {/* Profile Picture */}
                  <Image
                    source={{ uri: `${BASE_URL}${doctor.profile_photo}` }} // Use base URL for the image
                    style={styles.profilePicture}
                  />

                  {/* Doctor Details */}
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.specialty}>{doctor.specialty}</Text>
                    <View style={styles.bookingTimeSection}>
                      <Text style={styles.bookingTime}>{morningStart}AM</Text>
                      <MaterialIcons name="arrow-forward" size={20} color="#2a4770" style={styles.arrowIcon} />
                      <Text style={styles.bookingTime}> {afternoonEnd}PM</Text>
                    </View>
                   
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.cardSeparator} />
            </React.Fragment>
          );
        })}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1, // Ensures that the content grows to fill the screen
  },
  // Header Section
  header: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row', // Arrange elements horizontally
    alignItems: 'center',
    backgroundColor: 'rgba(24,212,184,255)', // Green background
    borderRadius: 10, // Optional: rounded corners for the header
  },
  languageIcon: {
    marginRight: 15, // Adjust spacing for the language icon
  },
  backButton: {
    marginLeft: 10, // Adjust spacing for the back button
  },
  textSection: {
    width: '90%',
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
    marginBottom: 20, // Adjust spacing for separation
  },
  // Card Section with Gradient
  card: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row', // Align profile picture and details horizontally
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    position: 'relative', // Allows absolute positioning for the doctorName
    overflow: 'hidden', // Ensure the gradient stays within the bounds of the card
  },
  cardContent: {
    flexDirection: 'row', // Horizontal alignment for image and text
    width: '100%',
    justifyContent: 'space-between', // Space out content inside the card
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15, // Space between image and text
  },
  doctorDetails: {
    justifyContent: 'flex-start', // Align items to the start
    flex: 1,
    paddingTop: 40, // Add top padding to ensure the text doesn't overlap with the name
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10, // Add bottom padding for the space from the bottom
    borderRadius: 10, // Optional: rounded corners for the background
    marginTop: 10, 
    position: 'relative', // Ensure the doctor name stays inside the card container
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#2a4770', // Background color for the doctor's name
    color: '#fff',
    padding: 10,
    position: 'absolute',
    top: -30, // Position the name at the top
    left: 10,
    right: 10,
    borderRadius: 5,
    zIndex: 100, // Ensure the name is displayed on top of other elements
  },
  bookingTimeSection: {
    flexDirection: 'row', // Align the times and arrow horizontally
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff', // White background for the booking time section
    borderRadius: 8, // Rounded corners for the section
    padding: 10, // Add padding inside the section
    shadowColor: '#000', // Optional: shadow for depth
    shadowOpacity: 0.1, // Optional: shadow opacity
    shadowRadius: 5, // Optional: shadow blur radius
    elevation: 2, // Optional: shadow for Android
  },
  bookingTime: {
    fontSize: 14,
    color: '#555', // Dark color for the booking time text
  },
  arrowIcon: {
    marginHorizontal: 5, // Space around the arrow icon
  },
  cardSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd', // Light gray line for separation
    marginVertical: 10, // Adjust spacing for separation
  },
  offButton: {
    backgroundColor: '#2a4770',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10, // Space above the "Off" button
  },
  offButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Calendar;
