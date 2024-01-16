import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../components/Button';
import {colors, global_styles} from '../Styles';
import ShakeableErrorText from '../components/ShakeableErrorText';
import {useAuth} from '../auth/AuthContext';
import ShakeableWarningText from '../components/ShakeableWarningText';
import sendAPICall from '../auth/APIs';
import {DismissKeyboardView} from '../components/DismissKeyboardView';
import DatePicker from "react-native-date-picker";


function CreateEventScreen({navigation, route}) {
  const {currentUser} = useAuth();

  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [sendNotification, setSendNotification] = useState(false);

  const errorMessageRef = useRef(null);
  const warningMessageRef = useRef(null);

  const {club, allEvents} = route.params;

  function handleSubmit() {
    if (!title || !datetime || !location) {
      errorMessageRef.current.setText('Please fill all the fields!');
      errorMessageRef.current.shake();
      return;
    }
    const eventData = {
      title,
      datetime,
      location,
      sendNotification,
    };

    sendAPICall(`/${club.id}/events`, 'POST', eventData, currentUser)
      .then(data => {
        console.log('Success', 'Event created!');

        Alert.alert('Success', 'Event Created!');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error creating event:', error);
        Alert.alert('Error creating event', error);
      });
  }

  function checkForConflict(date) {
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const timeDifference = new Date(date) - new Date(event.datetime);
      const isWithinAnHour = Math.abs(timeDifference) < 3600000;

      if (isWithinAnHour) {
        warningMessageRef.current.setText(
          `This time might conflict with a "${event.club}" event!`,
        );
        warningMessageRef.current.shake();

        return;
      } else {
        warningMessageRef.current.setText('');
      }
    }
  }

  return (
    <ScrollView
      overScrollMode={'never'}
      contentContainerStyle={{flexGrow: 1}}
      bounces={false}
      keyboardShouldPersistTaps={'handled'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={global_styles.mainView}>
        <DismissKeyboardView style={global_styles.mainView}>
          <Text style={global_styles.header}>
            New Event for {club.name || 'ERROR'}
          </Text>
          <Text style={global_styles.text}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Weekly Meeting"
            placeholderTextColor={colors.textLight}
          />

          <Text style={global_styles.text}>Date & Time</Text>
          {/*<DatePicker date={datetime} minuteInterval={15} minimumDate={new Date(Date.now())} textColor={colors.text} mode={"datetime"} onDateChange={ (date) => {*/}
          {/*    setDatetime(date);*/}
          {/*    checkForConflict(date);*/}
          {/*}} />*/}
          <DatePicker
            date={datetime}
            minuteInterval={15}
            minimumDate={new Date(Date.now())}
            textColor={colors.text}
            mode={'datetime'}
            onDateChange={date => {
              setDatetime(date);
              checkForConflict(date);
            }}
          />

          <Text style={global_styles.text}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Lindsay 223"
            placeholderTextColor={colors.textLight}
          />

          <View style={styles.switchContainer}>
            <Text style={global_styles.text}>Send Notification</Text>
            <Switch
              value={sendNotification}
              style={{marginLeft: 20}}
              onValueChange={setSendNotification}
            />
          </View>
          {/*{ errorMessageRef.current && errorMessageRef.current.getText() !== '' && (*/}
          <ShakeableErrorText ref={errorMessageRef} rotateShake={true} />
          {/* ) }*/}
          <ShakeableWarningText ref={warningMessageRef} rotateShake={false} />
          <Button title="Create Event" onPress={handleSubmit} />
        </DismissKeyboardView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: colors.mainContentLight,
    backgroundColor: colors.mainContent,
    color: colors.text,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default CreateEventScreen;
