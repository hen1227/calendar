import {View, TextInput, StyleSheet, Alert, Text, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getClassDetails from "../calendars/SchoolClassesCalendar";
import React, {useEffect, useState} from "react";
import {global_styles} from "../Styles";
import ColorPicker from "react-native-wheel-color-picker";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";

function CustomClassScreen({ navigation, route }) {
    const [className, setClassName] = useState('');
    const [classColor, setClassColor] = useState('#FD5000');
    const [isHumanities, setIsHumanities] = useState(false);
    const [isFirstLunch, setIsFirstLunch] = useState(true);
    let picker;


    useEffect(() => {
        async function fetchData() {
            const details = await getClassDetails(route.params.block);
            setClassName(details.name);
            setClassColor(details.color);
            setIsFirstLunch(details.isFirstLunch);
            setIsHumanities(details.isHumanities);
        }

        fetchData();
    }, []);

    const saveDetails = async () => {
        try {
            const updatedDetails = {
                block: route.params.block,
                name: className,
                duration: 45,
                color: classColor,
                isHumanities: isHumanities,
                isFirstLunch: isFirstLunch,
            };

            await AsyncStorage.setItem(route.params.block, JSON.stringify(updatedDetails));
            navigation.goBack();
        } catch (error) {
            console.error('Error saving class details:', error);
            Alert.alert('Error', 'An error occurred while saving class details.');
        }
    };

    const resetDetails = async () => {
        await AsyncStorage.removeItem(route.params.block);
        // await AsyncStorage.clear();
        navigation.goBack();
    };

    return (
        <View style={global_styles.mainView}>
            <TextInput
                style={global_styles.input(classColor+"30", classColor+"CC")}
                value={className}
                onChangeText={setClassName}
                placeholder="Class Name"
            />
            <View style={{flexDirection:'row', margin: 10}}>
                <Text style={global_styles.text}>Includes Humflex</Text>
                <Switch
                    style={{flex:0.1, marginLeft: 10}}
                    onValueChange={(value) => {
                        setIsHumanities(value);
                    }}
                    value={isHumanities}
                />
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={global_styles.text}>Has class before lunch</Text>
                <Switch
                    style={{flex:0.1, marginLeft: 10}}
                    onValueChange={(value) => {
                        setIsFirstLunch(!value);
                    }}
                    value={!isFirstLunch}
                />
            </View>
            <View style={{flex:0.65}}>
                <ColorPicker
                    ref={r => { picker = r }}
                    color={classColor}
                    onColorChange={(color) => {
                        setClassColor(color);
                    }}
                    onColorChangeComplete={(color) => {setClassColor(color)}}
                    thumbSize={30}
                    sliderSize={0}
                    discrete={true}
                    discreteLength={255}
                    sliderHidden={true}
                    noSnap={true}
                    swatches={false}
                />
            </View>
            <SmallButton title="Reset" onPress={resetDetails} />
            <Button title="Save" onPress={saveDetails} />
        </View>
    );
}


export default CustomClassScreen;