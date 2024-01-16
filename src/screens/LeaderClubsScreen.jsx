import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Pressable, Animated} from 'react-native';
import {colors, global_styles} from "../Styles";
import {useAuth} from "../auth/AuthContext";
import LoginScreen from "./LoginScreen";
import {useFocusEffect} from "@react-navigation/native";
import UserIcon from "../static/icons/user-group-solid.svg";
import CaretIcon from "../static/icons/angle-right-solid.svg";
import Button from "../components/Button";
import {sendVerificationEmail} from "../components/VerificationEmail";
import sendAPICall from "../auth/APIs";

function LeaderClubsScreen({ navigation }) {
    const {currentUser, isLoading, refreshCurrentUser} = useAuth();
    // Sample data for clubs, you'll replace this with data from your API later
    const [clubs, setClubs] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    const [isConnected, setIsConnected] = useState(false);

    const handleClubSelect = (club) => {
        navigation.navigate('ClubLeaderDetailsScreen', {club: club, allEvents: allEvents});
    }

    useFocusEffect(
        React.useCallback(() => {
            if (!currentUser && !isLoading){
                navigation.navigate('LoginScreen')
            }
            fetchLedClubs();
            fetchAllEvents();
        }, [currentUser, isLoading])
    );

    function fetchLedClubs(){
        if(currentUser && !isLoading)
            sendAPICall(`/${currentUser.id}/ledClubs`, 'GET', {}, null)
            .then(data => setClubs(data))
            .catch(error => {
                console.error('Error fetching clubs:', error);
                setClubs([])
            });
    }

    function fetchAllEvents() {
        // console.log(currentUser ? currentUser.token : '');
        sendAPICall('/events', 'GET', {}, null)
            .then(data => {
                setAllEvents(data);
                setIsConnected(true);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setIsConnected(false);
            });
    }

    const renderClubItem = ({ item }) => (
        // <Animated.View style={{ height: animatedViewHeight }}>
        <Pressable
            style={styles.clubCard((item.color + "30") || colors.mainContentLight, (item.color + "CC") || colors.mainContentLight)}
            onPress={() => handleClubSelect(item)}
        >
            <View style={{flex:1}}>
            <View style={styles.clubCardTopView}>
                <View style={styles.clubCardTitleView}>
                        <Text style={styles.clubName}>{item.name}</Text>
                    </View>
                    <View style={styles.clubCardDescriptionView}>
                        <Text lineBreakMode={"head"} numberOfLines={5} lineBreakStrategyIOS={"standard"} style={styles.clubDescription}>{item.description}</Text>
                    </View>
            </View>
            { item.subscribers && (
                <View style={styles.clubCardBottomView}>
                    <Text style={styles.membersList}>{item.subscribers.length} </Text><UserIcon width={15} height={15} style={{ color: '#fff' }} />
                    {/*<Text style={styles.membersList}>    {item.leaders.length} </Text><LeaderIcon width={15} height={15} style={{ color: '#eee' }} />*/}
                </View>
            )}
            </View>
            <View style={{justifyContent:'center'}}>
                <CaretIcon width={25} height={25} style={{ color: '#ccc' }} />
            </View>
        </Pressable>
        // </Animated.View>
    );


    return (
        <>
            {isLoading && (
                <View style={global_styles.container}>
                    <Text style={global_styles.header}>Loading...</Text>
                </View>
            )}
            {!isConnected && (
                <View style={global_styles.container}>
                    <Text style={global_styles.header}>Unable to access Clubs List</Text>
                    <Button title={'Reload'} onPress={() => {
                        fetchLedClubs();
                        fetchAllEvents();
                    }}/>
                </View>
            )}
            { isConnected && currentUser && !isLoading && !currentUser.isVerified && (
                <View style={global_styles.mainView}>
                    <Text style={global_styles.text}>You need to verify your email first</Text>
                    <Button title={'Resend Verification Email'} onPress={() => {
                        sendVerificationEmail(currentUser)
                            .then(() => {
                                alert('Verification email sent');
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    }}/>
                    <Button title={'Reload'} onPress={() => {
                        refreshCurrentUser();
                    }}/>
                </View>
            )}
            { isConnected && currentUser && !isLoading && currentUser.isVerified && clubs.length > 0 && (
                <>
                <View style={global_styles.mainView}>
                    <FlatList
                        data={clubs}
                        renderItem={renderClubItem}
                        keyExtractor={item => item.id}
                        style={{width: '80%'}}
                        // refreshControl={
                            // <RefreshControl
                            //     refreshing={isLoading}
                            //     onRefresh={fetchLedClubs}
                            // />
                        // }
                    />
                    <Pressable
                        style={styles.createClubButton}
                        onPress={() => navigation.navigate('CreateClubScreen')}
                    >
                        <Text style={styles.createClubText}>Create New Club</Text>
                    </Pressable>
                </View>
                </>
            )}
            { isConnected && currentUser && currentUser.isVerified && !isLoading && clubs.length === 0 && (
                <View style={global_styles.mainView}>
                    <Text style={global_styles.header}>You don't have any clubs yet</Text>
                    <Pressable
                        style={styles.createClubButton}
                        onPress={() => navigation.navigate('CreateClubScreen')}
                    >
                        <Text style={styles.createClubText}>Create New Club</Text>
                    </Pressable>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    clubCard: (color, borderColor) => ({
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: 2,
        width: '100%',
        height: '100%',
        // width: 300,
        borderStyle: 'solid',
        padding: 20,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1,
        flexDirection: 'row',
    }),
    clubCardTopView: {
        flexDirection: 'column',
        flex: 1,
    },
    clubCardBottomView: {
        flex: 0.05,
        marginTop: 10,
        flexDirection: 'row',
    },
    clubCardTitleView: {
        flex: 0.4,
        paddingHorizontal: 10,
        // paddingVertical: 5,
    },
    clubCardDescriptionView: {
        flex: 0.6,
        whiteSpace: 'pre-wrap',
        paddingHorizontal: 10,
        // paddingVertical: 5,
    },
    createClubButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        width: '80%',
    },
    clubName: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    clubDescription: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'normal',
    },
    membersList: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "500",
    },
});

export default LeaderClubsScreen;