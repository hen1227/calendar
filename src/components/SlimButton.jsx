import {colors, global_styles} from "../Styles";
import {Pressable, StyleSheet, Text} from "react-native";
import React from "react";

export function SlimButton(props) {
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
        paddingVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 6,
        width: '60%',
        marginVertical: 6,
        fontSize: 16,
        textAlign: "center",
        backgroundColor: color || colors.secondaryContent,
        borderColor: borderColor || colors.secondaryContentLight,
        borderStyle: "solid",
        borderWidth: 2,
    }),
})

export default SlimButton;