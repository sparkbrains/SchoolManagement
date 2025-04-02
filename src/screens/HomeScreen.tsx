import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {HomeScreenProps} from '../types/screen-props';
import StyledText from '../components/Text'; // Make sure to import the StyledText component
import Button from '../components/button';
import {fontSize} from '../styles/base';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <StyledText
          text="Welcome, Teacher!"
          fontSize={fontSize.header}
          style={styles.welcomeText}
        />
      </View>
      <View style={styles.section}>
        <StyledText
          text="Upcoming Classes"
          fontSize={fontSize.h1}
          style={styles.sectionTitle}
        />
        <View style={styles.card}>
          <StyledText
            text="Math - Class 10"
            fontSize={fontSize.h3}
            style={styles.cardTitle}
          />
          <StyledText
            text="Date: 2025-04-05"
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
          <StyledText
            text="Time: 10:00 AM - 11:00 AM"
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
        </View>
        <View style={styles.card}>
          <StyledText
            text="Science - Class 9"
            fontSize={fontSize.h3}
            style={styles.cardTitle}
          />
          <StyledText
            text="Date: 2025-04-06"
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
          <StyledText
            text="Time: 12:00 PM - 01:00 PM"
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
        </View>
      </View>
      <View style={styles.section}>
        <StyledText
          text="Announcements"
          fontSize={fontSize.h1}
          style={styles.sectionTitle}
        />
        <View style={styles.card}>
          <StyledText
            text="School Annual Day"
            fontSize={fontSize.h3}
            style={styles.cardTitle}
          />
          <StyledText
            text="Join us for the annual day celebration on 2025-04-20."
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
        </View>
        <View style={styles.card}>
          <StyledText
            text="New Exam Schedule"
            fontSize={fontSize.h3}
            style={styles.cardTitle}
          />
          <StyledText
            text="The new exam schedule for Class 10 has been released."
            fontSize={fontSize.h4}
            style={styles.cardText}
          />
        </View>
      </View>
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#212529',
  },
  cardText: {
    color: '#6c757d',
  },
});

export default HomeScreen;
