import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import {colors, global_styles} from "../Styles";

function CornerButton(props) {
    const { style, onPress, color, left = false, title = 'Save', isDelete } = props;
    let buttonStyle = styles.cornerButton(left);
    if (color != undefined) {
        buttonStyle = styles.cornerButton(left, color + "DD", color + "FF");  // Get the button style using the color
    }
    buttonStyle = StyleSheet.flatten([buttonStyle, style]);

    return (
        <Pressable style={buttonStyle} onPress={onPress}>
            <Text style={global_styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cornerButton: (left, color, borderColor) => ({
        borderRadius: 15,
        width: 30,
        aspectRatio: 1,
        marginVertical: 0,
        fontSize: 12,
        textAlign: "center",
        backgroundColor: color || colors.tertiaryContentLight,
        borderColor: borderColor || colors.tertiaryContentLight,
        borderStyle: "solid",
        borderWidth: 2,
        position: "absolute",
        top: -20,
        left: left ? -30 : undefined,
        right: left ? undefined : -30,
        zIndex: 100,
    }),
});

export default CornerButton;