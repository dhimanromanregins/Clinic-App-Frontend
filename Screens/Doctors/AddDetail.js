import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from "../../Actions/Api"

const AddDetail = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [kids, setKids] = useState(['']);
  const [userId, setUserId] = useState(null); // Assume userId is passed or available from context or login

  useEffect(() => {
    // Fetch doctor's details
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Failed to fetch doctor details', ToastAndroid.SHORT);

      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleFetchSlots = async () => {
    if (!dateTime) {
      ToastAndroid.show('Please enter a valid date and time.', ToastAndroid.SHORT);
      return;
    }

    try {
      const selectedDate = dateTime.split(' ')[0]; // Extract date from dateTime
      const response = await fetch(
        `${BASE_URL}/doctors/${doctorId}/available_slots/?selected_date=${selectedDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      const data = await response.json();
      setTimeSlots(data.available_slots || []);
    } catch (error) {
      console.error(error);
      setTimeSlots([]);
      ToastAndroid.show('Failed to fetch available slots', ToastAndroid.SHORT);
    }
  };

  const handleAddKid = () => {
    setKids([...kids, '']); // Add a new empty input field for another kid
  };

  const handleRemoveKid = (index) => {
    const updatedKids = kids.filter((_, i) => i !== index); // Remove the kid at the specified index
    setKids(updatedKids);
  };

  const handleKidNameChange = (text, index) => {
    const updatedKids = [...kids];
    updatedKids[index] = text; // Update the kid's name at the specific index
    setKids(updatedKids);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot); // Set the selected slot
  };

  const handleBooking = async () => {
    if (kids.length === 0 || kids.every(kid => kid === '')) {

      ToastAndroid.show('Please add or select a child', ToastAndroid.SHORT);
      return;
    }

    if (!selectedSlot) {
      ToastAndroid.show('Please select a time slot', ToastAndroid.SHORT);
      return;
    }

    const childrenNames = kids.filter(kid => kid !== ''); // Filter out empty kid names

    const bookingData = {
      doctor: doctorId,
      user: 1,  // You need to get the logged-in user ID from your context or authentication
      children_names: JSON.stringify(childrenNames), // Passing as a JSON string
      slot_start: selectedSlot.start,
      slot_end: selectedSlot.end,
      date: dateTime.split(' ')[0], // Extracting date from dateTime string
    };
    console.log(bookingData, '--------------')

    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!accessToken) {
        ToastAndroid.show('User not authenticated. Please log in again.', ToastAndroid.SHORT);
        return;
      }
      const response = await fetch(`${BASE_URL}/book-slot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to book the slot');
      }

      const data = await response.json();
      ToastAndroid.show('Your slot has been successfully booked!', ToastAndroid.SHORT);

      navigation.goBack(); // Navigate back after successful booking
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to book the slot', ToastAndroid.SHORT);

    }
  };

  if (!doctor) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => alert('Language switch clicked')}>
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="angle-left" size={34} color="#2a4770" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
      {doctor.profile_photo && (
          <Image
            source={{ uri: `${BASE_URL}/${doctor.profile_photo}` }}
            style={styles.logo}
          />
        )}
        <View style={styles.blackBox}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorDesignation}>{doctor.specialty}</Text>
        </View>
      
      </View>

      <View style={styles.mainContent}>
        <View style={styles.labelContainer}>
          <Text style={styles.inputLabel}>Choose Kid</Text>
        </View>

        {/* Dynamic Kid Name Inputs */}
        {kids.map((kid, index) => (
          <View style={styles.inputContainer} key={index}>
          <TouchableOpacity style={styles.iconContainer} onPress={handleAddKid}>
            <FontAwesome name="plus" size={20} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={styles.inputField}
            value={kid}
            onChangeText={(text) => handleKidNameChange(text, index)}
            placeholder="Enter Kid's Name"
            placeholderTextColor="#A0A0A0"
          />
          
          {kids.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveKid(index)}
            >
              <MaterialIcons name="close" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
        ))}

        {/* Date and Time Section */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.inputLabel}>Date</Text>
          <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.applyButton} onPress={handleFetchSlots}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.dateTimeInputField}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder=" (YYYY-MM-DD)"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        {/* Available Slots */}
        <View style={styles.availableHoursContainer}>
          <Text style={styles.availableHoursText}>Available Hours</Text>
          <View style={styles.borderLine} />
          <View style={styles.timeSlotsContainer}>
  {timeSlots.length > 0 ? (
    timeSlots.map((slot, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.timeSlotBox,
          selectedSlot === slot && styles.selectedSlot, // Apply selectedSlot style if this slot is selected
        ]}
        onPress={() => handleSlotSelect(slot)}
      >
        <Text style={styles.timeSlotText}>
          {/* {slot.start} - {slot.end} */}
          {slot.start}
        </Text>
      </TouchableOpacity>
    ))
  ) : (
    <Text style={styles.noSlotsText}>No slots available</Text>
  )}
</View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking} // Call handleBooking on button click
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    paddingBottom: 20, 
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row', 
    alignItems: 'center',   
    justifyContent: 'space-between', 
    width: '100%',         
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2a4770',
    marginLeft: 20,
  },
  blackBox: {
    backgroundColor: 'rgba(24,212,184,255)', 
    height: 80,                                  
    width: '55%',                                
    justifyContent: 'center',                   
    alignItems: 'center',                        
    borderRadius: 20,                            
    padding: 10,    
  marginRight:30,                             
  },
  languageIcon: {
    padding: 5,
  },
  backButton: {
    padding: 20,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  labelContainer: {
    width: '100%',
    alignItems: 'flex-end', 
    marginBottom:0,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a4770',
    textAlign: 'right', 
    paddingRight: 30, 
    marginBottom:0,

  },
   inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',

    alignSelf: 'center',
    justifyContent: 'space-between', 
 
  },
  removeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color:'black'
  },
  iconContainer: {
    backgroundColor: 'rgba(24,212,184,255)', 
    padding: 10, 
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    height: 50,  
  
  },
  inputField: {
    height: 50, // Set height for the dropdown
    fontSize: 16,
    color: 'white',
    width: '60%', // Occupy 60% width
    backgroundColor: '#2a4770', // Background color for dropdown
    borderRadius: 10, // Rounded corners
    paddingLeft: 10, // Add padding for dropdown text
    marginLeft:'20',
    marginBottom:'5'
  },
  dateTimeInputField: {
    height: 50,
    fontSize: 16,
    color: 'white',
    width: '57%', 
    backgroundColor: '#2a4770', 
    borderRadius: 10,
    paddingLeft: 10, 
    alignSelf: 'flex-end', 
    marginRight: 30, 
  },
  availableHoursContainer: {
    width: '100%',
    marginTop: 30, 
    paddingHorizontal: 20,
  },
  availableHoursText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a4770',
    marginBottom: 10, 
    textAlign:'center', 
  },
  borderLine: {
    borderBottomWidth: 1,
    borderColor: '#2a4770',
    marginBottom: 15, 
  },
 
  applyButton:{
    backgroundColor: 'rgba(24,212,184,255)',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    height: 50,
    marginLeft:33,
  },

  doctorName: {
    color: 'white',           
    fontSize: 18,           
    fontWeight: 'bold',       
    textAlign: 'center',      
  },
  doctorDesignation: {
    color: 'white',          
    fontSize: 14,             
    textAlign: 'center',     
  },

  dateTimeContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column',  // Keep the label on top of the row
     // Align label to the left
  },
  
  dateTimeRow: {
    flexDirection: 'row',  // Arrange button and input in a row
    alignItems: 'center',  // Center vertically
    justifyContent: 'space-between',  // Space between button and input
    width: '100%',  // Ensure the row takes the full width
  },
  

  applyButtonText: {
    color: 'white',  // Text color for the button
    fontSize: 16,
      // Font size for the button text
      backgroundColor: 'rgba(24,212,184,255)', 
  },
  
  dateTimeInputField: {
    height: 50,
    fontSize: 16,
    color: 'white',
    width: '57%',  // Take up 57% of the row width
    backgroundColor: '#2a4770', 
    borderRadius: 10,
    paddingLeft: 10,
    alignSelf: 'flex-end',
    marginRight:'30'  // Align to the right if needed
  }
  ,
  bookButton: {
    backgroundColor: '#2a4770',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  selectedSlot: {
    backgroundColor: '#4CAF50', 
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',        // Allows wrapping of elements
    justifyContent: 'space-evenly', // Space out the items evenly in a row
    width: '100%',            // Control the width of the container
  },
  
  timeSlotBox: {
    width: '32%',            // Each time slot box takes up roughly one-third of the container's width (for 3 items per row)
    marginBottom: 10,        // Add space between rows
    backgroundColor: '#ccc',  // Change as per your style
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedSlot: {
    backgroundColor: 'rgba(24,212,184,255)',  // Apply background color when selected
  },
  
  timeSlotText: {
    color: '#2a4770',
    fontSize: 16,
    textAlign: 'center',
  },
  
  noSlotsText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  }

});

export default AddDetail;
