import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BASE_URL } from "../../Actions/Api.js"

const BookDoctor = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]); // State for doctors
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);


  // Handle navigation to the DoctorProfile page
  const handleBookAppointment = (doctorId) => {
    navigation.navigate('Booking', { doctorId });
  };

  const handleDoctorDetail = (doctorId) => {
    navigation.navigate('DoctorDetail', { doctorId });
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.textSection}>
        <Text style={styles.text}>Book an Appointment</Text>
        <View style={styles.borderLine} />
      </View>

      {/* Display loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#2a4770" />
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {doctors.length > 0 && doctors?.map((doctor) => (
            <View key={doctor.id} style={styles.doctorItem}>
              {/* Profile Image and Details */}
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: `${BASE_URL}${doctor.profile_photo}` }}
                  style={styles.profilePic}
                />
              </View>

              {/* Book Button */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookAppointment(doctor.id)}
              >
                <Text style={styles.bookText}>Book</Text>
              </TouchableOpacity>

              {/* Exclamation Icon */}
              <View style={styles.exclamationWrapper}>
                <TouchableOpacity
                  onPress={() => handleDoctorDetail(doctor.id)}
                >
                  <FontAwesome
                    name="exclamation-circle"
                    size={24}
                    color="#2a4770"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  textSection: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
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
  scrollContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2a4770',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: '100%',
    height: 160,
    marginBottom: 20,
    position: 'relative',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 20,
  },
  bookButton: {
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 60,
    marginRight: 30,
  },
  bookText: {
    color: '#2a4770',
    fontWeight: 'bold',
  },
  exclamationWrapper: {
    position: 'absolute',
    right: -10,
    top: '60%',
    transform: [{ translateY: -16 }],
    backgroundColor: 'rgba(24,212,184,255)',
    borderRadius: 50,
    padding: 8,
  },
});

export default BookDoctor;
