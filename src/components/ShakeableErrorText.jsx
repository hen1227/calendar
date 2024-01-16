import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, Text } from 'react-native';
import {global_styles} from "../Styles";

const ShakeableErrorText = forwardRef((props, ref) => {
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
        <Animated.View style={{ transform: [{ rotate: (props.rotateShake ? shakeRotation : '0deg')}, {translateX: props.rotateShake ? 0 : shakeTranslation },], height: textValue === '' ? 0 : 30 }}>
            <Text style={{...global_styles.errorText, width: '100%', ...(props.style ? props.style : [])}}>{textValue}</Text>
        </Animated.View>
    );
});

export default ShakeableErrorText;