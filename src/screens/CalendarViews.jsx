import PagerView from "react-native-pager-view";
import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, TouchableOpacity, Pressable, Alert} from "react-native";
import ClubsCalendar from "../calendars/ClubsCalendar";
import {useAuth} from "../auth/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassesCalendar from "../calendars/ClassesCalendar";
import {colors, global_styles} from "../Styles";

import ClubsListCalendar from "../calendars/ClubsListCalendar";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LeadersListScreen from "./LeadersListScreen";
import SubscribersListScreen from "./SubscribersListScreen";
import ClubDetailsScreen from "./ClubDetailsScreen";
import sendAPICall from "../auth/APIs";
import ShakeableErrorText from "../components/ShakeableErrorText";

import RefreshIcon from '../static/icons/rotate-solid.svg';
import ShowOnlySubsIcon from '../static/icons/square-check-solid.svg';
// import ShowAllIcon from '../../static/icons/bell-solid.svg';
import ShowAllIcon from '../static/icons/square-minus-solid.svg';
// import ShowOnlySubsIcon from '../../static/icons/bell-slash-solid.svg';

const ClubsStack = createNativeStackNavigator();
function ClubsStackStackNavigator(props) {
    const allClubs = props.allClubs;

    return (
        <>
            <ClubsStack.Navigator screenOptions={{
                headerStyle: {backgroundColor: colors.secondaryBackground},
                headerTitleStyle: {color: colors.text},
                headerTintColor: colors.textLight,
                headerBackTitle: 'Back',
            }}>
                <ClubsStack.Screen name="ClubsListCalendar" key={JSON.stringify(allClubs)} initialParams={ {allClubs: allClubs} } component={ClubsListCalendar} options={{
                    title: 'Clubs List',
                    headerShown: false,
                }}/>
                <ClubsStack.Screen name="ClubDetailsScreen" component={ClubDetailsScreen} options={{title: ''}}/>
                <ClubsStack.Screen name="LeadersListScreen" component={LeadersListScreen} options={{title: 'Leaders list'}}/>
                <ClubsStack.Screen name="SubscribersListScreen" component={SubscribersListScreen} options={{title: 'Members List'}}/>
            </ClubsStack.Navigator>
        </>
    );
}

const CalendarViews = () => {
    const { currentUser } = useAuth();
    const [allEvents, setAllEvents] = useState([]);
    const [allSubscribedClubs, setAllSubscribedClubs] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [allLedClubs, setAllLedClubs] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loadingCalendar, setLoadingCalendar] = useState(true);

    const statusBarErrorRef = React.useRef(null);

    const [showingAll, setShowingAll] = useState(false);

    const fetchData = async () => {
        setIsOnline(false);
        setLoadingCalendar(true);

        let savedAllEvents = await AsyncStorage.getItem('allEvents');
        let savedAllClubs = await AsyncStorage.getItem('allClubs');
        if (savedAllEvents && savedAllClubs) {
            setAllEvents(JSON.parse(savedAllEvents));
            setAllClubs(JSON.parse(savedAllClubs));
        }

        sendAPICall('/allData', 'GET', {}, currentUser)
        .then((data) => {

            setAllEvents(data.allEvents);
            setAllClubs(data.allClubs);
            setAllSubscribedClubs(data.subscribedClubs);
            setAllLedClubs(data.ledClubs);

            setIsOnline(true);
            saveLastUpdated(new Date());
            setLoadingCalendar(false);

            // Save to local storage
            AsyncStorage.setItem('allEvents', JSON.stringify(data.allEvents)).catch((error) => {
                console.error(error);
            });
            AsyncStorage.setItem('allClubs', JSON.stringify(data.allClubs)).catch((error) => {
                console.error(error);
            });
        })
        .catch((error) => {
            console.error(error);

            updateLastUpdated();
            statusBarErrorRef.current.shake();

            setLoadingCalendar(false);
        });
    }

    useEffect(() => {
        fetchData();

    }, [currentUser]);

    function getLastUpdateTime(){
        if (!lastUpdated) {
            return '';
        }
        const date = new Date(lastUpdated);
        const localTimeParts = date.toLocaleTimeString().split(' ');
        const ampm = localTimeParts[1]
        const hour = localTimeParts[0].split(':')[0]
        return `${String(hour).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${ampm}`;
    }

    const saveLastUpdated = async (date: Date) => {
        try {
            await AsyncStorage.setItem('lastUpdated', JSON.stringify(date));
            setLastUpdated(date);
        } catch (error) {
            console.error(error);
        }
    }

    const updateLastUpdated = async () => {
        try {
            const value = await AsyncStorage.getItem('lastUpdated');
            if (value !== null) {
                setLastUpdated(JSON.parse(value));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <View style={styles.topBar}>
                <Pressable
                    style={styles.refreshButton}
                    onPress={
                        (event) => {
                            setShowingAll(!showingAll);
                        }
                    }
                >
                    {/*<Text style={global_styles.text}>Show all</Text>*/}
                    {/*{ showingAll && (*/}
                    {/*    <ShowAllIcon color={colors.tertiaryContentRaw} style={{}} width={20} height={40}/>*/}
                    {/*)}*/}
                    {/*{ !showingAll && (*/}
                    {/*    <ShowOnlySubsIcon color={colors.tertiaryContentRaw} style={{}} width={20} height={40}/>*/}
                    {/*)}*/}
                </Pressable>
                <View style={styles.status}>
                    { isOnline && <Text style={global_styles.successText}>Online! {getLastUpdateTime()}</Text> }
                    { !isOnline && <ShakeableErrorText key={getLastUpdateTime()} initialText={`Offline. ${getLastUpdateTime()}`} ref={statusBarErrorRef}/> }
                </View>
                    <Pressable
                        style={styles.refreshButton}
                        onPress={
                            (event) => {
                                console.log("∆ Refresh ∆")
                                fetchData();
                            }
                        }
                    ><RefreshIcon color={colors.tertiaryContentRaw} style={{}} width={20} height={40}/></Pressable>
            </View>
            <PagerView style={styles.pagerView} initialPage={1}>
                <View key="0">
                    <ClubsStackStackNavigator key={JSON.stringify(allClubs)} allClubs={allClubs} />
                </View>
                <View key="1">
                    <ClubsCalendar allEvents={allEvents} allClubs={allClubs} subscribedClubs={allSubscribedClubs} ledClubs={allLedClubs} showingAll={showingAll} setShowingAll={setShowingAll}/>
                </View>
                <View key="2">
                    <ClassesCalendar />
                </View>

            </PagerView>
        </>
    );
}

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: colors.tertiaryBackground,
        minHeight: 40,
        // flex: 0.05,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    status: {
        flex: 0.7,
        justifyContent: 'center',
    },
    refreshButton: {
        textAlign: 'center',
        justifyContent: 'center',
        flex: 0.15,
        flexDirection: 'row',
        height: '100%',
        // backgroundColor:'red',
    },
    pagerView: {
        flex: 1,
    },
});

export default CalendarViews;