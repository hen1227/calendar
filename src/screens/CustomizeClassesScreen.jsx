import {FlatList, View, Text} from "react-native";
import Button from "../components/Button";
import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {getClassList} from "../calendars/SchoolClassesCalendar";
import {global_styles} from "../Styles";

const CustomizeClassesScreen = ({navigation}) => {
    const [classes, setClasses] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getClassList().then((classList) => {
                setClasses(classList);
            });
        }, [])
    );

    return (
        <View style={global_styles.mainView}>
            <Text style={{...global_styles.header, marginVertical: 25}}>Customize class schedule</Text>
            <FlatList style={{width: '60%'}} data={classes} renderItem={
                ({item}) => {
                    return (
                        <Button color={item.color} style={{width: '100%'}} title={`${item.block} – ${item.name}`}
                                onPress={() => {
                                    navigation.navigate('CustomClasses', {block: item.block});
                                }}
                        />
                    );
                }
            }/>
        </View>
    );
}

export default CustomizeClassesScreen;