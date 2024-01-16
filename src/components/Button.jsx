import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import {colors, global_styles} from "../Styles";

function Button(props) {
    const { style, onPress, color, title = 'Save' } = props;
    let buttonStyle = styles.button();
    if (color != undefined) {
        buttonStyle = styles.button(color + "30", color + "DD");  // Get the button style using the color
    }
    buttonStyle = StyleSheet.flatten([buttonStyle, style]);

    return (
        <Pressable style={buttonStyle} onPress={onPress}>
            <Text style={global_styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: (color, borderColor) => ({
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        fontSize: 20,
        width: '80%',
        textAlign: "center",
        backgroundColor: color || colors.tertiaryContent,
        borderColor: borderColor || colors.tertiaryContentLight,
        borderStyle: "solid",
        borderWidth: 2,
    }),
});

export default Button;