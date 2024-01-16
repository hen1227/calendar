import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import {global_styles} from "../Styles";

const ShakeableWarningText = forwardRef((props, ref) => {
    const [textValue, setTextValue] = useState(props.initialText || '');
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
        shake: triggerShakeAnimation,
        setText: (newText) => setTextValue(newText),
        getText: () => textValue
    }));

    const triggerShakeAnimation = () => {
        shakeAnimation.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    }

    const shakeRotation = shakeAnimation.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-6deg', '6deg']
    });

    const shakeTranslation = shakeAnimation.interpolate({
        inputRange: [-10, 10],
        outputRange: [-10, 10]
    });

    return (
        <Animated.View style={styles.shakingView(props.rotateSkake, shakeRotation, shakeTranslation, textValue)}>
            <Text {...props} style={{...global_styles.warningText, width: '100%', flex: 1}}>{textValue}</Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    shakingView: (rotateShake, shakeRotation, shakeTranslation, textValue) => ({
        transform:
            [
                {rotate: (rotateShake ? shakeRotation : '0deg')},
                {translateX: rotateShake ? 0 : shakeTranslation},
            ],
        height: textValue === '' ? 0 : 30,
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexGrow: 1,
        flexDirection: 'row',
    })
});

export default ShakeableWarningText;