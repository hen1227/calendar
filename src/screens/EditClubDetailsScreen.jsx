import {View, Text, Alert, TextInput} from "react-native";
import React, {useState} from "react";
import {colors, global_styles} from "../Styles";
import {useAuth} from "../auth/AuthContext";
import sendAPICall from "../auth/APIs";
import {DismissKeyboardView} from "../components/DismissKeyboardView";
import ColorPicker from "react-native-wheel-color-picker";
import Button from "../components/Button";


const EditClubDetailsScreen = ({ navigation, routes}) => {
    const club = routes.params.club;

    const [clubName, setClubName] = useState(club.name);
    const [clubDescription, setClubDescription] = useState(club.description);
    const [clubColor, setClubColor] = useState(club.color)

    const {currentUser} = useAuth();

    let picker;

    const handleSubmit = async () => {
        // Handle club creation logic here
        const clubData = {
            name: clubName,
            description: clubDescription,
            color: clubColor
        };

        sendAPICall(`/${club.id}/edit`, 'POST', clubData, currentUser)
            .then((response) => {
                // Navigate back or provide feedback to the user after creation
                navigation.goBack();
            })
                .catch((error) => {
                console.log(error);
                navigation.goBack();
                Alert.alert("Could edit club details. Please try again later.")
            });

        };

        return (
            <DismissKeyboardView style={global_styles.mainView}>
                <Text style={global_styles.header}>Edit Club Details</Text>
                <Text style={global_styles.text}>Club Name</Text>
                <TextInput
                    style={global_styles.input(clubColor + "30", clubColor + "DD")}
                    value={clubName}
                    onChangeText={setClubName}
                    placeholderTextColor={colors.textLight}
                    placeholder="e.g. Computer Science Club"
                />

                <Text style={global_styles.text}>Description</Text>
                <TextInput
                    style={{...global_styles.input(clubColor + "30", clubColor + "DD"), height: 60}}
                    value={clubDescription}
                    onChangeText={setClubDescription}
                    placeholder={"e.g. A club for people who like to do things!"}
                    placeholderTextColor={colors.textLight}
                    multiline
                />


                <Text style={global_styles.text}>Club Coloring</Text>
                <View style={{flex:0.6}}>
                    <ColorPicker
                        ref={r => { picker = r }}
                        color={clubColor}
                        onColorChange={(color) => {
                            setClubColor(color);
                        }}
                        onColorChangeComplete={(color) => {setClubColor(color)}}
                        thumbSize={30}
                        sliderSize={0}
                        sliderHidden={true}
                        noSnap={true}
                        swatches={false}
                    />
                </View>

                <Button title="Apply Changes" onPress={handleSubmit} color={clubColor} />
            </DismissKeyboardView>
    );
}