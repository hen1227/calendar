import {FlatList, View, Text, StyleSheet, ActivityIndicator, Animated, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {colors, global_styles} from "../Styles";
import getClassDetails, {getScheduleForWeek, isPast} from "./SchoolClassesCalendar";
import {useFocusEffect} from "@react-navigation/native";
import ArrowLeftIcon from "../static/icons/arrow-left-solid.svg";



const ClassesCalendar = () => {
    const [data, setData] = useState([]);
    const [loadingCalendar, setLoadingCalendar] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                try {
                    const schedule = await getScheduleForWeek();
                    setData(schedule);
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                } finally {
                    setLoadingCalendar(false);
                }
            }

            fetchData();
        }, [])
    );


    return (
        <>
            {loadingCalendar &&
                <View style={global_styles.mainView}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            }
            {!loadingCalendar && data.length === 0 &&
                <View style={global_styles.mainView}>
                    <Text style={global_styles.text}>No classes found!</Text>
                </View>
            }
            {!loadingCalendar && data.length > 0 && (
                <View style={global_styles.mainView}>
                    <FlatList
                        scrollToOverflowEnabled={false}
                        style={{width: '100%'}}
                        data={data}
                        renderItem={
                            ({item}) => {
                                const dayItem = item;

                                return (
                                    <View style={styles.dayContainer}>
                                        <Text style={styles.dayTitle}>{item.day}</Text>
                                        <FlatList data={item.classTimes} renderItem={
                                            ({item}) => {
                                                const hasPast = isPast(dayItem.day, item.endTime);

                                                return (
                                                    <View style={hasPast ? styles.classCard(item.duration, colors.outdatedContent, colors.outdatedContentLight) : styles.classCard(item.duration, item.color + '30', item.color + 'CC')}>
                                                        <Text style={{...global_styles.text, width: '60%', textAlign: 'left'}}>{item.block + (item.name === '' ? '' : (" - " + item.name))}</Text>
                                                        <Text style={global_styles.text}>{item.startTime} - {item.endTime}</Text>
                                                    </View>
                                                )
                                            }
                                        }/>
                                    </View>
                                )
                            }
                        }/>
                </View>
            )}
            <View style={{height: 30, flexDirection: 'row', backgroundColor: colors.background, justifyContent: 'center'}}>
                <View style={{flex:0.25, flexDirection: 'row', justifyContent: 'center'}}>
                    <ArrowLeftIcon color={'#aaa'} width={10} height={30}/><Text style={{color:colors.textLight, paddingVertical: 7.5, justifyContent: 'center', textAlign: 'center'}}>Events  </Text>
                </View>
                <View style={{flex: 0.5}} />
                <View style={{flex:0.25, flexDirection: 'row', justifyContent: 'center'}}>

                </View>
            </View>
        </>
    )
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
    classCard: (height, color, borderColor) => ({
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 8,
        marginHorizontal: '5%',
        width: '90%',
        height: height + 20,
        maxHeight: 100,
        minHeight: 40,

        backgroundColor: color,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: borderColor,
    }),
});

export default ClassesCalendar;