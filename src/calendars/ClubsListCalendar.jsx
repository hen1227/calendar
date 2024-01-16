import {ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {colors, global_styles} from "../Styles";
import ArrowRightIcon from "../static/icons/arrow-right-solid.svg";
import UserIcon from "../static/icons/user-group-solid.svg";
import CaretIcon from "../static/icons/angle-right-solid.svg";
import IsSubscribedIcon from "../static/icons/user-check-solid.svg";

const ClubsListCalendar = ({ navigation, route }) => {
    const { allClubs, subscribedClubs } = route.params;

    // useEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <CornerButton
    //                 onPress={() => navigation.navigate('ClubsCalendarScreen')}
    //                 icon={<ArrowLeftIcon width={25} height={25} style={{ color: '#ccc' }} />}
    //             />
    //         ),
    //     });
    // }, []);

    const handleClubSelect = (club) => {
        navigation.navigate('ClubDetailsScreen', {club: club});
    }

    return (
        <>
            {/*{ loadingCalendar &&*/}
            {/*    <View style={global_styles.mainView}>*/}
            {/*        <ActivityIndicator size="large" color="#0f0ff0" />*/}
            {/*    </View>*/}
            {/*}*/}
            {/*{ !loadingCalendar && !(allClubs.length > 0) &&*/}
            {/*    <View style={global_styles.mainView}>*/}
            {/*        <Text style={global_styles.text}>No club events found!</Text>*/}
            {/*    </View>*/}
            {/*}*/}
            { !(allClubs.length > 0) && (
                <View style={global_styles.mainView}>
                    <Text style={global_styles.text}>No clubs found!</Text>
                </View>
            )}
            { allClubs.length > 0 && (
                <>
                    <View style={global_styles.mainView}>
                        <FlatList
                            style={{width:'80%'}}
                            data={allClubs}
                            renderItem={({item}) => {

                                let isSubbed = false;

                                return (
                                    <Pressable
                                        style={styles.clubCard((item.color + "30") || colors.mainContentLight, (item.color + "CC") || colors.mainContentLight)}
                                        onPress={() => handleClubSelect(item)}
                                    >
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
                                        <View style={{flex:1}}>
                                            <View style={styles.clubCardTopView}>
                                                <View style={styles.clubCardTitleView}>
                                                    <Text style={styles.clubName}>{item.name}</Text>
                                                </View>
                                                <View style={styles.clubCardDescriptionView}>
                                                    <Text lineBreakMode={"head"} numberOfLines={5} lineBreakStrategyIOS={"standard"} style={styles.clubDescription}>{item.description}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{justifyContent:'center'}}>
                                            <CaretIcon width={25} height={25} style={{ color: '#ccc' }} />
                                        </View>
                                    </Pressable>
                                );
                            }}
                        />
                    </View>
                </>
            )}
            <View style={{height: 30, flexDirection: 'row', backgroundColor: colors.background, justifyContent: 'center'}}>
                <View style={{flex:0.25, flexDirection: 'row', justifyContent: 'center'}}>

                </View>
                <View style={{flex: 0.5}} />
                <View style={{flex:0.25, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color:colors.textLight, paddingVertical: 7.5, justifyContent: 'center', textAlign: 'center'}}>Events  </Text><ArrowRightIcon color={'#aaa'} width={10} height={30}/>
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
    isSubbedCorner: {
        position: 'absolute',
        top: -7.5,
        left: -15,
        padding: 5,
    }
});

export default ClubsListCalendar;