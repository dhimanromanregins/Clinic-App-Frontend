import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';

const BookingConfirm = ({ route, navigation }) => {
  const { bookingData, doctor_details } = route.params;

  const generatePDF = async () => {
    const htmlContent = `
      <h1 style="text-align: center; color: #2a4770;">Booking Confirmation</h1>
      <p><b>Kid Names:</b> ${(() => {
        try {
          const names = JSON.parse(bookingData.children_names);
          return names.map(name => name.trim()).join(', ');
        } catch {
          return 'Invalid Data';
        }
      })()}</p>
      <p><b>Date:</b> ${bookingData.date}</p>
      <p><b>Time:</b> ${bookingData.slot_start} - ${bookingData.slot_end}</p>
      <p><b>Doctor Name:</b> ${doctor_details.name}</p>
      <p><b>ID Number:</b> 2024145</p>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'BookingConfirmation',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF Generated', `Saved to ${file.filePath}`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('Error', 'Could not generate the PDF. Try again later.');
    }
  };
  return (
    <View style={{ flex: 1 }}>

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => alert('Language switch clicked')}
        >
          <MaterialIcons name="language" size={34} color="white" />
        </TouchableOpacity>
      </View>


      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
      </TouchableOpacity>


      <ScrollView style={styles.container}>
        {/* Title Section */}
        <View style={styles.textSection}>
          <Text style={styles.text}>Booking Confirmed</Text>
          <View style={styles.borderLine} />
        </View>


        <View style={styles.bookingTickContainer}>
          <View style={styles.bookingTickCircle}>
            <AntDesign name="checkcircle" size={40} color="green" />
          </View>
        </View>


        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Booking to Kid Name</Text>
        </View>


        <View style={styles.detailRow}>
          <Text style={styles.detailTextLeft}>{bookingData.date}</Text>
          <Text style={styles.detailTextRight}>Date</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTextLeft}>2024145</Text>
          <Text style={styles.detailTextRight}>Id number</Text>
        </View>


        <View style={styles.detailRow}>
          <Text style={styles.detailTextLeft}>{bookingData.slot_start} {bookingData.slot_end}</Text>
          <Text style={styles.detailTextRight}>Time</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTextLeft}>{doctor_details.name}</Text>
          <Text style={styles.detailTextRight}>Doctor Name</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTextLeft}>
            {(() => {
              try {
                const names = JSON.parse(bookingData.children_names);
                return Array.isArray(names)
                  ? names
                    .map(name => name.trim().charAt(0).toUpperCase() + name.trim().slice(1))
                    .join(', ')
                  : 'No children names provided';
              } catch (error) {
                console.error('Error parsing children names:', error);
                return 'Invalid data';
              }
            })()}
          </Text>
          <Text style={styles.detailTextRight}>Kids Names</Text>
        </View>



        {/* <View style={styles.detailRow}>
        <Text style={styles.detailTextLeft}>{bookingData.slot_start} {bookingData.slot_end}</Text>
          <Text style={styles.detailTextRight}>Doctor Time</Text>
        </View> */}

        {/* Download Button */}
        <TouchableOpacity
        style={styles.downloadButton}
        // onPress={generatePDF}
      >
        <Text style={styles.buttonText}>Download PDF</Text>
      </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Home Page</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(24,212,184,255)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    marginRight: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  textSection: {
    width: '100%',
    alignItems: 'right',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a4770',
    textAlign: 'right',
  },
  borderLine: {
    height: 4,
    backgroundColor: '#2a4770',
    marginTop: 10,
    alignSelf: 'stretch',
  },
  bookingTickContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bookingTickCircle: {
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2a4770',
    borderWidth: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'right',
    marginBottom: 20,
    width: '100%',
  },
  detailText: {
    fontSize: 24, 
    color: '#2a4770',
    textAlign: 'right',
    width: '100%',
    fontWeight: 'bold',
  },
  detailTextLeft: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    width: '45%',
  },
  detailTextRight: {
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
    width: '45%',
    fontWeight: 'bold',
  },

  downloadButton: {
    backgroundColor: '#24D4B8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },

  homeButton: {
    backgroundColor: '#24D4B8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#2a4770',
    fontSize: 18,

  },
});

export default BookingConfirm;
