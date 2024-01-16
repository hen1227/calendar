import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {colors, global_styles} from "../Styles";
import {isPast} from "./SchoolClassesCalendar";
import CornerButton from "../components/CornerButton";
import {useAuth} from "../auth/AuthContext";
import Button from "../components/Button";
import sendAPICall from "../auth/APIs";

import IsSubscribedIcon from "../static/icons/user-check-solid.svg";
// import BellSlashIcon from "../../static/icons/bell-slash-solid.svg";

import ArrowRightIcon from '../static/icons/arrow-right-solid.svg'
import ArrowLeftIcon from '../static/icons/arrow-left-solid.svg'


const ClubsCalendar = ({ allEvents, allClubs, ledClubs, subscribedClubs, showingAll, setShowingAll }) => {
    const {currentUser} = useAuth();
    const [sequentialEvents, setSequentialEvents] = useState({});

    const loadSequentialEvents = () => {
        // Assuming `allEvents` exists in the outer scope and is an array of event objects.
        if (!allEvents || !Array.isArray(allEvents)) {
            console.error("allEvents should be an array");
            return;
        }

        // Sort events chronologically
        const sortedEvents = allEvents.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        const getDateKey = (date) => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const inOneWeek = new Date(today);
            inOneWeek.setDate(today.getDate() + 7);

            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            if (date.toDateString() === today.toDateString()) {
                return "Today";
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return "Tomorrow";
            } else if (date >= today && date <= inOneWeek) {
                return daysOfWeek[date.getDay()];
            } else {
                return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
            }
        };

        const getTimeString = (date) => {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutes} ${ampm}`;
        };

        const result = {};

        sortedEvents.forEach(event => {
            const eventDate = new Date(event.datetime);
            const key = getDateKey(eventDate);

            if (!result[key]) {
                result[key] = {
                    dayTitle: key,
                    day: `${eventDate.getMonth() + 1}-${eventDate.getDate()}-${eventDate.getFullYear()}`,
                    eventsList: []
                };
            }

            const eventWithTime = {
                ...event,
                time: getTimeString(eventDate)
            };

            result[key].eventsList.push(eventWithTime);
        });

        setSequentialEvents(result);
    };

    useEffect(() => {
        console.log("All events changed")
        loadSequentialEvents();
    }, [allEvents]);

    async function deleteEventDialog(id) {

        if (!currentUser) {
            Alert.alert("You must be logged in to delete an event");
            return;
        }

        Alert.alert(
            "Delete Event",
            "Are you sure you want to delete this event?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteEvent(id);
                    }
                }
            ]
        );
    }

    const deleteEvent = async (id) => {
        sendAPICall(`/events/${id}`, 'DELETE', {}, currentUser)
            .then((data)=>{
                Alert.alert("Successfully deleted event");
            })
            .catch(err => {

            })
    }

    return (
        <>
            <View style={{flex: 1}}>
                {/*{loadingCalendar &&*/}
                {/*    <View style={global_styles.mainView}>*/}
                {/*        <ActivityIndicator size="large" color="#0f0ff0"/>*/}
                {/*    </View>*/}
                {/*}*/}
                {!(Object.keys(sequentialEvents).length > 0) &&
                    <View style={global_styles.mainView}>
                        <Text style={global_styles.text}>No club events found!</Text>
                    </View>
                }
                {/*{!showingAll && !(Object.keys(sequentialEvents).length > 0) &&*/}
                {/*    <View style={global_styles.mainView}>*/}
                {/*        <Button title={"Show All Clubs"} onPress={() => {*/}
                {/*            setShowingAll(true);*/}
                {/*        }}/>*/}
                {/*        <Text style={global_styles.text}>No club events found that you are a member of!</Text>*/}
                {/*    </View>*/}
                {/*}*/}
                {Object.keys(sequentialEvents).length > 0 && (
                    <>
                        <View style={global_styles.mainView}>
                            <FlatList
                                style={{width: '100%'}}
                                data={Object.values(sequentialEvents)}
                                renderItem={({item}) => {
                                    const dayItem = item;

                                    let day = dayItem.dayTitle.split('-');
                                    if(day.length > 1) {

                                        // Convert string to Date object
                                        let dateObj = new Date(day[2], day[0] - 1, day[1]); // note that months are 0-indexed in JavaScript

                                        // Array of day names
                                        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                                        // Get day of week from Date object
                                        let dayOfWeek = daysOfWeek[dateObj.getDay()];

                                        day = `${dayOfWeek} ${day[0]}/${day[1]}`;
                                    }


                                    return (
                                        <View style={styles.dayContainer}>
                                            <Text style={styles.dayTitle}>{day}</Text>
                                            <FlatList
                                                data={dayItem.eventsList}
                                                renderItem={({item}) => {

                                                    let isSubbed = false;
                                                    let isLed = false;

                                                    if (ledClubs !== [] && subscribedClubs !== [] && item.club != null) {
                                                        const ledNames = ledClubs.map((club) => club.name);
                                                        const SubNames = subscribedClubs.map((club) => club.name);
                                                        isLed = ledNames.includes(item.club);
                                                        isSubbed = SubNames.includes(item.club);
                                                    }

                                                    return (
                                                        <>
                                                            <View style={
                                                                styles.clubCard(item.color + '30', item.color + 'CC')
                                                            }>
                                                                <View style={{flexDirection: 'row'}}>
                                                                    {isLed && (
                                                                        <CornerButton color={"#DD0000"} left={false}
                                                                                      title={"X"} onPress={async () => {
                                                                            await deleteEventDialog(item.id);
                                                                        }}/>
                                                                    )}
                                                                    <View style={styles.isSubbedCorner}>
                                                                        {isSubbed && (
                                                                            <IsSubscribedIcon color={colors.textLight}
                                                                                      width={20} height={20}/>

                                                                        )}
                                                                        {/*{!isSubbed && (*/}
                                                                        {/*    <BellSlashIcon color={colors.textLight}*/}
                                                                        {/*                   width={20} height={20}/>*/}
                                                                        {/*)}*/}
                                                                    </View>
                                                                    <View style={styles.timeCorner}>
                                                                        <Text style={{
                                                                            ...global_styles.text,
                                                                        }}>{item.time}</Text>
                                                                    </View>

                                                                    <View style={{flexDirection: 'column', width: '70%', height: 120, textAlign: 'center', flex: 1}}>
                                                                        <Text style={{
                                                                            ...global_styles.text,
                                                                            fontWeight: 'bold',
                                                                            fontSize: 15,
                                                                        }}>{item.club}</Text>
                                                                        <Text style={{
                                                                            ...global_styles.text,
                                                                        }}>{item.title}</Text>
                                                                        <Text style={global_styles.text}>{item.location}</Text>
                                                                    </View>

                                                                </View>
                                                            </View>
                                                        </>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </>
                )}
            </View>
            <View style={{
                height: 30,
                flexDirection: 'row',
                backgroundColor: colors.background,
                justifyContent: 'center'
            }}>
                <View style={{flex: 0.25, flexDirection: 'row', justifyContent: 'center'}}>
                    <ArrowLeftIcon color={'#aaa'} width={10} height={30}/><Text style={{
                    color: colors.textLight,
                    paddingVertical: 7.5,
                    justifyContent: 'center',
                    textAlign: 'center'
                }}> Clubs</Text>
                </View>
                <View style={{flex: 0.5}}/>
                <View style={{flex: 0.25, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{
                        color: colors.textLight,
                        paddingVertical: 7.5,
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>Classes </Text><ArrowRightIcon color={'#aaa'} width={10} height={30}/>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    dayContainer: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        padding: 10,
        backgroundColor: colors.background,
    },
    dayTitle: {
        flex: 0.05,
        color: colors.text,
        fontSize: 24,
        textAlign: "center",
    },
    clubCard: (color, borderColor) => ({
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 8,
        marginHorizontal: '5%',
        width: '90%',
        height: 110,

        backgroundColor: color,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: borderColor,
    }),
    isSubbedCorner: {
        position: 'absolute',
        top: -7.5,
        left: -15,
        padding: 5,
    },
    timeCorner: {
        position: 'absolute',
        top: -7.5,
        right: -5,
        padding: 5,
    }
});

export default ClubsCalendar;