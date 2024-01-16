import {colors, global_styles} from "../Styles";
import {Pressable, StyleSheet, Text} from "react-native";
import React from "react";

export function SmallButton(props) {
    const { onPress, color, title = 'Save' } = props;
    let style = styles.smallButton();
    if (color != undefined) {
        style = styles.smallButton(color + "30", color + "DD");  // Get the button style using the color
    }
    return (
        <Pressable style={style} onPress={onPress}>
            <Text style={global_styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    smallButton: (color, borderColor) => ({
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 8,
        width: '60%',
        marginVertical: 8,
        fontSize: 18,
        textAlign: "center",
        backgroundColor: color || colors.tertiaryContent,
        borderColor: borderColor || colors.tertiaryContentLight,
        borderStyle: "solid",
        borderWidth: 2,
    }),
});

export default SmallButton;