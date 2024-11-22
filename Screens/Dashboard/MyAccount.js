import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccount = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false); // New state to toggle edit mode
    const [updatedProfile, setUpdatedProfile] = useState({}); // Store edited profile data

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');

                if (accessToken) {
                    const response = await fetch(`${BASE_URL}/api/profile/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setProfile(data);
                        setUpdatedProfile(data); // Initialize the updatedProfile with current profile data
                    } else {
                        Alert.alert('Error', 'Failed to fetch profile details');
                    }
                } else {
                    Alert.alert('Error', 'No access token found');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'An error occurred while fetching profile details');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditChange = (field, value) => {
        setUpdatedProfile(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');

            if (accessToken) {
                const response = await fetch(`${BASE_URL}/api/profile/`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProfile),
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data); // Update the profile with new data
                    setEditMode(false); // Exit edit mode after saving
                    Alert.alert('Success', 'Profile updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update profile');
                }
            } else {
                Alert.alert('Error', 'No access token found');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while updating the profile');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text>No profile data available</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.languageIcon}
                    onPress={() => alert('Language switch clicked')}
                >
                    <MaterialIcons name="language" size={34} color="white" />
                </TouchableOpacity>
            </View>

            {/* Back Button Icon */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <FontAwesome name="angle-left" size={34} color="rgba(24,212,184,255)" />
            </TouchableOpacity>

            {/* Scrollable Content */}
            <ScrollView style={styles.container}>
                {/* Title Section */}
                <View style={styles.textSection}>
                    <Text style={styles.text}>My Account</Text>
                    <View style={styles.borderLine} />
                </View>

                {/* Profile Image Section */}
                <View style={styles.profileSection}>
                    {/* <Image
                        source={{ uri: profile.profile_picture ? `http://192.168.1.111${profile.profile_picture}` : defaultFavicon }}
                        style={styles.profileImage}
                    /> */}
                </View>

                {/* Profile Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{profile.user.first_name} {profile.user.last_name}</Text>
                    {editMode ? (
                        <>
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.user.first_name}
                                onChangeText={(value) => handleEditChange('first_name', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.user.last_name}
                                onChangeText={(value) => handleEditChange('last_name', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.email}
                                onChangeText={(value) => handleEditChange('email', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.user.phone_number}
                                onChangeText={(value) => handleEditChange('phone_number', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.address}
                                onChangeText={(value) => handleEditChange('address', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.bio}
                                onChangeText={(value) => handleEditChange('bio', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.date_of_birth}
                                onChangeText={(value) => handleEditChange('date_of_birth', value)}
                            />
                            <TextInput
                                style={styles.cardText}
                                value={updatedProfile.gender}
                                onChangeText={(value) => handleEditChange('gender', value)}
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.cardText}>User ID: {profile.user.id_number}</Text>
                            <Text style={styles.cardText}>Email: {profile.email}</Text>
                            <Text style={styles.cardText}>Phone: {profile.user.phone_number}</Text>
                            <Text style={styles.cardText}>Address: {profile.address}</Text>
                            <Text style={styles.cardText}>Bio: {profile.bio}</Text>
                            <Text style={styles.cardText}>Date of Birth: {profile.date_of_birth}</Text>
                            <Text style={styles.cardText}>Gender: {profile.gender}</Text>
                        </>
                    )}
                </View>

                {/* Edit Button */}
                <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
                    <Text style={styles.editButtonText}>{editMode ? 'Cancel' : 'Edit Account'}</Text>
                </TouchableOpacity>

                {/* Save Button */}
                {editMode && (
                    <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
                        <Text style={styles.editButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
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
        justifyContent: 'space-between',
    },
    languageIcon: {
        marginRight: 'auto',
    },
    backButton: {
        marginLeft: 10,
        marginTop: 10,
    },
    textSection: {
        width: '100%',
        alignItems: 'flex-end',
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

    // Profile Image Section
    profileSection: {
        alignItems: 'flex-end',
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Circular image
        zIndex: 10, // Ensure image is on top
    },

    // Profile Card Section
    card: {
        backgroundColor: '#000',
        padding: 15,
        marginVertical: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'flex-end', // Align text to the right
        marginTop: -14, // Negative margin to pull up the card
        zIndex: 1, // Ensure the card stays below the profile image
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a4770', // Blue color used in the project
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#2a4770', // Black color for text
        marginBottom: 5,
    },

    // Edit Button Section
    editButton: {
        backgroundColor: 'rgba(24,212,184,255)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2a4770',
    },
});

export default MyAccount;
