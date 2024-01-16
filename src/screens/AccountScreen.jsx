import React, {useState, useContext, useEffect} from 'react';
import {useAuth} from "../auth/AuthContext";
import {TextInput, View, StyleSheet, Text, Alert, FlatList, Pressable} from "react-native";
import {colors, global_styles} from "../Styles";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import LoginScreen from "./LoginScreen";
import {getClassList} from "../calendars/SchoolClassesCalendar";
import {useFocusEffect} from "@react-navigation/native";
import {sendVerificationEmail} from "../components/VerificationEmail";
import sendAPICall from "../auth/APIs";


function AccountScreen({ navigation }) {
    const { currentUser, isAuthLoading, login, logout } = useAuth();

    return (
        <>
            { (isAuthLoading) && (
                <View style={global_styles.container}>
                    <Text style={global_styles.text}>Loading...</Text>
                </View>
            )}
            { currentUser && (
                <View style={global_styles.container}>
                    <Pressable
                        style={styles.delete}
                        onPress={() => {
                            // Confirmation alert
                            Alert.alert(
                                "Delete Account!",
                                "Are you sure you want to delete your account? This will delete all clubs that you are the only leader of!",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Delete",
                                        onPress: async () => {
                                            // Delete clubs
                                            sendAPICall(`/account`, 'DELETE', {}, currentUser, true)
                                                .then(response => {
                                                    if(!response.ok) {
                                                        // Activate Catch
                                                        throw Error("Failed to delete")
                                                    }
                                                    return response.json()
                                                })
                                                .then(data => {
                                                    console.log('Success:', data);

                                                    Alert.alert(
                                                        "Account Deleted",
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
                        <Text style={{...global_styles.deleteText, fontSize: 9}}>Delete Account</Text>
                    </Pressable>
                    <View style={{...styles.header, marginTop: 30}}>
                        <Text style={global_styles.header}>Hello, {currentUser.email}!</Text>
                    </View>
                    { currentUser.isVerified && (
                        <View style={styles.preferences}>
                            <Text style={global_styles.text}>Your email is verified!</Text>
                        </View>
                    )}
                    { !currentUser.isVerified && (
                        <View style={styles.preferences}>
                            <Text style={global_styles.text}>Your email is not verified!</Text>
                            <Button color={colors.secondaryContentRaw} title="Verify Email" onPress={() => sendVerificationEmail(currentUser)}/>
                        </View>
                    )}
                    <View style={global_styles.mainView}>
                        {/*<View style={styles.subscribedList}>*/}
                        {/*    <Text style={global_styles.text}>You are subscribed to {10} clubs</Text>*/}
                        {/*    <Button color={colors.secondaryContentRaw} buttonType={"secondary"} title="View Subscribed List" onPress={() => navigation.navigate('CustomizeClasses')}/>*/}
                        {/*</View>*/}
                        <View style={styles.preferences}>
                            {/*<Button color={colors.mainContentRaw} buttonType={"secondary"} title="Prefereneces" onPress={() => navigation.navigate('CustomizeClasses')}/>*/}
                        </View>
                        <Button color={colors.secondaryContentRaw} buttonType={"secondary"} title="Customize Classes" onPress={() => navigation.navigate('CustomizeClasses')}/>
                    </View>
                    <View style={styles.footer}>
                        <Button title="Logout" onPress={logout}/>
                    </View>
                </View>
            )}
            { !isAuthLoading && !currentUser && (
                <View style={global_styles.mainView}>
                    <Text style={global_styles.header}>You are not logged in!</Text>
                    <Button color={colors.secondaryContentRaw} buttonType={"secondary"} title="Customize Classes" onPress={() => navigation.navigate('CustomizeClasses')}/>
                    <Button title="Login" onPress={() => navigation.navigate('Login')}/>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        alignItems: 'center',
    },
    subscribedList: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 0.4,
    },
    preferences: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 0.3,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
    },
    delete: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ff000030',
        borderColor: '#ff0000cc',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        padding: 10,
        margin: 10,
        height: 35,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AccountScreen;
