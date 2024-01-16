import {View, Text, StyleSheet, Pressable, Alert} from "react-native";
import React, {useEffect} from "react";
import {global_styles, colors} from "../Styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from "../components/Button";
import SlimButton from "../components/SlimButton";
import {useAuth} from "../auth/AuthContext";
import {useFocusEffect} from "@react-navigation/native";
import sendAPICall from "../auth/APIs";

function ClubDetailsScreen({ navigation, route }) {
    const { currentUser } = useAuth();
    const { club, allEvents } = route.params;

    const [clubDetails, setClubDetails] = React.useState({});

    if(!club) {
        navigation.goBack();
        return (
            <View style={global_styles.mainView}>
                <Text style={global_styles.header}>Club not found</Text>
            </View>
        )
    }

    useEffect(() => {
        fetchClubDetails()
    }, []);

    function fetchClubDetails() {
        if (!club || !club.id) return;
        sendAPICall(`/club/${club.id}`, 'GET', null)
            .then(data => {
                setClubDetails(data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    // TODO: Add invite leaders button
    // TODO: Add Copy Emails button
    // TODO: Add Copy Link button
    // TODO: Add website to add bulk users

    return (
        <View style={global_styles.mainView}>
            <Text style={global_styles.header}>{club.name}</Text>
            <Text style={{...global_styles.text, marginBottom: 30, width: '80%'}} textBreakStrategy={'balanced'} numberOfLines={5}>{club.description}</Text>
            <SlimButton title={`${(clubDetails.subscribers || []).length} members`} onPress={ () =>
                navigation.navigate("SubscribersListScreen", { subscribers: clubDetails.subscribers || [] })
            } />
            <SlimButton title={`${(clubDetails.leaders || []).length} leaders`} onPress={ () =>
                navigation.navigate("LeadersListScreen", { leaders: clubDetails.leaders || [] })
            }/>

            { clubDetails && currentUser &&
                <View style={global_styles.container}>
                    {clubDetails.subscribers && !clubDetails.subscribers.map(member => member ? member.email : '').includes(currentUser.email) && (
                        <Button title={"Join Club"} onPress={ () =>
                            sendAPICall(`/${club.id}/subscribe`, 'POST', {}, currentUser)
                                .then(data => {
                                    console.log(data);
                                    Alert.alert('Welcome!', `You are now a member of '${clubDetails.name}'!`)
                                    navigation.goBack();
                                })
                                .catch(error => {
                                    console.error('Error subscribing to club:', error);
                                })
                        }/>
                    )}
                    {clubDetails.subscribers && clubDetails.subscribers.map(member => member ? member.email : '').includes(currentUser.email) && (
                        <Button title={"Leave Club"} onPress={ () =>
                            sendAPICall(`/${club.id}/unsubscribe`, 'POST', {}, currentUser)
                                .then(data => {
                                    console.log(data);
                                    Alert.alert('Bye!', `You are no longer a member of '${clubDetails.name}'`)
                                    navigation.goBack();
                                })
                                .catch(error => {
                                    console.error('Error subscribing to club:', error);
                                })
                        }/>
                    )}
                </View>
            }
            {!clubDetails && (
                <View style={global_styles.container}>
                    <Text style={global_styles.text}>Loading...</Text>
                </View>
            )}
            {!currentUser && (
                <View style={global_styles.container}>
                    <Text style={global_styles.text}>Please log in to join this club</Text>
                </View>
            )}
            { clubDetails && currentUser && clubDetails.leaders && clubDetails.leaders.map(leader => leader ? leader.email : '').includes(currentUser.email) && (
               <View>
                   <Text style={global_styles.text}>You are a leader of this club</Text>
               </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    delete: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    }
})

export default ClubDetailsScreen;