import {View, Text, StyleSheet, Pressable, Alert, Linking} from "react-native";
import React from "react";
import {global_styles, colors} from "../Styles";
import Button from "../components/Button";
import SlimButton from "../components/SlimButton";
import {useAuth} from "../auth/AuthContext";
import sendAPICall from "../auth/APIs";

function ClubLeaderDetailsScreen({ navigation, route }) {
    const { currentUser } = useAuth();
    const { club, allEvents } = route.params;
    const subscribers = club.subscribers || [];
    const leaders = club.leaders || [];

    if(!club) {
        navigation.goBack();
        return (
            <View style={global_styles.mainView}>
                <Text style={global_styles.header}>Club not found</Text>
            </View>
        )
    }

    return (
        <View style={global_styles.mainView}>
            <Pressable
                style={styles.delete}
                onPress={() => {
                    // Confirmation alert
                    Alert.alert(
                        "Delete Club",
                        "Are you sure you want to delete this club?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "Delete",
                                onPress: async () => {
                                    // Delete clubs
                                    sendAPICall(`/club/${club.id}`, 'DELETE', null, currentUser)
                                        .then(data => {
                                            Alert.alert(
                                                "Club Deleted",
                                                "The club has been deleted.",
                                                [
                                                    {
                                                        text: "OK",
                                                        onPress: () => navigation.goBack(),
                                                        style: "cancel"
                                                    }
                                                ],
                                                { cancelable: false }
                                            );
                                        })
                                        .catch((error) => {
                                            console.error('Error:', error);
                                            Alert.alert("Failed to delete")
                                        });
                                },
                                style: "destructive"
                            }
                        ],
                        { cancelable: false }
                    );
                }}>
                <Text style={global_styles.deleteText}>Delete</Text>
            </Pressable>
            <Text style={{...global_styles.header, marginTop: 35}}>{club.name}</Text>
            <SlimButton title={`${subscribers.length} members`} onPress={ () =>
                navigation.navigate("SubscribersListScreen", { subscribers: subscribers })
            } />
            <SlimButton title={`${leaders.length} leaders`} onPress={ () =>
                navigation.navigate("LeadersListScreen", { leaders: leaders })
            }/>

            { subscribers && subscribers.length > 0 &&
                <Button color={colors.tertiaryContentRaw} title={"Open Email"} onPress={ () => {
                    const recipients = subscribers.map(user => user.email).join(',');
                    const ccRecipients = leaders.map(user => user.email).join(',');

                    const subject = encodeURIComponent(club.name);
                    const body = encodeURIComponent('');

                    const mailURL = `mailto:${recipients}?cc=${ccRecipients}&subject=${subject}&body=${body}`;

                    Linking.canOpenURL(mailURL)
                        .then((supported) => {
                            if (!supported) {
                                console.log("Can't handle url: " + mailURL);
                            } else {
                                return Linking.openURL(mailURL);
                            }
                        })
                        .catch((err) => console.error('An error occurred', err));
                }}/>
            }

            <Button title={"Invite another leader"} onPress={ () =>
                Alert.prompt("Add another leader", "This person will have the same control over this club as you. This cannot be undone!", [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Invite",
                        onPress: async (email) => {
                            // Invite user
                            sendAPICall(`/club/${club.id}/inviteLeader`, 'POST', { email: email }, currentUser)
                                .then(data => {
                                    Alert.alert(
                                        "Leader Invited",
                                        "The leader has been invited.",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => navigation.goBack(),
                                                style: "cancel"
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                    Alert.alert("Failed to invite", error.message)
                                });
                        },
                        style: "destructive"
                    }
                ])
            }/>

            <View style={global_styles.container}>
            {/*    <Button title={"Invite"} onPress={ () =>*/}
            {/*        navigation.navigate("ClubShareScreen", { club: club })*/}
            {/*    }/>*/}
                <Button style={{width: '80%', marginBottom: 20}} title={"Edit Club Details"} onPress={ () =>
                    navigation.navigate("EditClubDetailsScreen", { club: club, allEvents: allEvents })
                }/>
            </View>
                <Button style={{width: '80%', marginBottom: 20}} title={"Create New Event"} onPress={ () =>
                    navigation.navigate("CreateEventScreen", { club: club, allEvents: allEvents })
                }/>
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

export default ClubLeaderDetailsScreen;