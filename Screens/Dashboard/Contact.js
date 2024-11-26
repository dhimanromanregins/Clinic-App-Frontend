import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,Linking} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background


const Contact = () => {
    const handleContactPress = () => {
        console.log("Contact Us button pressed");
    };
    const openURL = (url) => {
        Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
    };

    return (
        <LinearGradient
            colors={[ '#FFFFFF','#79e5f1']}
            style={styles.gradient} 
        >
            {/* Logo */}
            <Image 
    source={require('../../assets/logo.png')} 
                style={styles.logo}
            />

            {/* Contact Us Button */}
            <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
                <Text style={styles.buttonText}>Contact Us</Text>
            </TouchableOpacity>

            {/* Phone Section */}
            <View style={styles.row}>
                <Ionicons name="call-outline" size={50} color="#000" />
                <Text style={styles.text}>+971 567 407 888</Text>
            </View>

            {/* Social Media Section */}
            <View style={styles.row}>
                <Ionicons name="logo-instagram" size={50} color="#000" onPress={() => openURL('https://www.instagram.com/halim_clinic')} />
                <Text style={styles.text} onPress={() => openURL('https://www.instagram.com/halim_clinic')}>Instagram</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="logo-facebook" size={50} color="#000" onPress={() => openURL('https://www.facebook.com/drhalimclinicuae/')}/>
                <Text style={styles.text} onPress={() => openURL('https://www.facebook.com/drhalimclinicuae/')}>Facebook</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="logo-youtube" size={50} color="#000" onPress={() => openURL('https://www.youtube.com/@dr.halimclinic/shorts')} />
                <Text style={styles.text} onPress={() => openURL('https://www.youtube.com/@dr.halimclinic/shorts')}>YouTube</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="logo-snapchat" size={50} color="#000" onPress={() => openURL('https://www.snapchat.com/add/drhalimclinic?share_id=83188bDmGEk&locale=en-US')} />
                <Text style={styles.text} onPress={() => openURL('https://www.snapchat.com/add/drhalimclinic?share_id=83188bDmGEk&locale=en-US')}>Snapchat</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    contactButton: {
        backgroundColor: '#0c90da',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Ensures vertical alignment
        justifyContent: 'flex-start', // Aligns the row contents to the left horizontally
        marginBottom: 15,
        width: '100%', // Makes the row span the full width of the parent container
        paddingHorizontal: 16, // Adds padding to the sides for better spacing
    },
    text: {
        fontSize: 18,
        marginLeft: 10,
        color: '#000',
        fontWeight: 'bold',
    },
    
});

export default Contact;
