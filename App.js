import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

import LoginScreen from './Screens/accounts/LoginScreen';
import RegisterScreen from './Screens/accounts/RegisterScreen';
import OTPScreen from './Screens/accounts/OTPScreen';
import LoginOTPScreen from './Screens/accounts/LoginOTPScreen';
import ForgotScreen from './Screens/accounts/ForgotScreen';
import ForgetPasswordOTPScreen from './Screens/accounts/ForgetPasswordOTPScreen';
import ResetPassword from './Screens/accounts/ResetPassword';

import Dashboard from './Screens/Dashboard/DashboardScreen';
import BookDoctor from './Screens/Doctors/BookDoctor';
import DoctorProfile from "./Screens/Doctors/DoctorProfile"
import AddDetail from './Screens/Doctors/AddDetail';
import PersonalDetail from './Screens/Dashboard/PersonalDetail';

import Calendar from './Screens/calander/Calendar';
import MyAccount from './Screens/Dashboard/MyAccount';

// Childern

import MyKids from './Screens/Children/Mykids';
import Kids from './Screens/Children/Kids';
import AddKidsDetail from './Screens/Children/AddKidsDetail';
import TeleMedicine from './Screens/TeleMedicine/TeleMedicine';
import ReportsSick from './Screens/Leaves/ReportsSick';
import SickLeave from './Screens/Leaves/SickLeave';
import SickLeaveButton from './Screens/Leaves/SickLeaveButton';
import SickLeaveRequest from './Screens/Leaves/SickLeaveRequest';
import ParentSick from './Screens/Leaves/Parent/ParentSick';
import ParentSickLeave from './Screens/Leaves/Parent/ParentSickLeave';
import ParentSickLeaveHistory from './Screens/Leaves/Parent/ParentSickLeaveHistory';
import WhomeItMayCocern from './Screens/Leaves/Cocern/WhomeItMayCocern';

import TeleDoctor from './Screens/TeleMedicine/TeleDoctor';
import Vaccination from './Screens/Vaccination/Vaccination';
import MedicalReports from './Screens/Medical/MedicalReports';
import MedicalHistory from './Screens/Medical/MedicalHistory';


// Home Screen Component
function HomeScreen({ navigation }) {


  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Go to Dashboard"
        onPress={() => navigation.navigate('Dashboard')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

// Create a Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: '#2a4770', // Set the back icon color globally
          headerTitleStyle: {
            color: '#2a4770', // Default header text color
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#fff', // Set background color for header
            elevation: 0, // Remove shadow
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: 'Login',
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerTitle: 'Register',
          }}
        />

        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{
            headerTitle: 'Enter OTP',
          }}
        />

        <Stack.Screen
          name="LoginOTP"
          component={LoginOTPScreen}
          options={{
            headerTitle: 'Login with OTP',
          }}
        />

        <Stack.Screen
          name="Forgot"
          component={ForgotScreen}
          options={{
            headerTitle: 'ForgotPassword',
          }}
        />
        <Stack.Screen
          name="ForgotOTPVerify"
          component={ForgetPasswordOTPScreen}
          options={{
            headerTitle: 'Forget OTP Verifications',
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerTitle: 'ForgotPassword',
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="BookDoctor"
          component={BookDoctor}
          options={{
            headerTitle: '',


          }}
        />
        <Stack.Screen
          name="DoctorDetail"
          component={DoctorProfile}
          options={{
            headerTitle: '',


          }}
        />
        <Stack.Screen
          name="Booking"
          component={AddDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Mykids"
          component={MyKids}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="kids"
          component={Kids}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddKids"
          component={AddKidsDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PersonalDetails"
          component={PersonalDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TeleMedicine"
          component={TeleMedicine}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReportsSick"
          component={ReportsSick}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SickLeave"
          component={SickLeave}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SickLeaveButton"
          component={SickLeaveButton}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SickLeaveRequest"
          component={SickLeaveRequest}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="ParentSick"
          component={ParentSick}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="ParentSickLeave"
          component={ParentSickLeave}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ParentSickLeaveHistory"
          component={ParentSickLeaveHistory}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="WhomeItMayCocern"
          component={WhomeItMayCocern}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TeleDoctor"
          component={TeleDoctor}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Vaccination"
          component={Vaccination}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MedicalReports"
          component={MedicalReports}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="MedicalHistory"
          component={MedicalHistory}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="MyAccount"
          component={MyAccount}
          options={{
            headerShown: false,
            
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
