import React, {useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import {colors, global_styles} from "../Styles";
import Button from "../components/Button";
import {useAuth} from "../auth/AuthContext";
import sendAPICall from "../auth/APIs";
import {useFocusEffect} from "@react-navigation/native";
import {DismissKeyboardView} from "../components/DismissKeyboardView";
import ShakeableErrorText from "../components/ShakeableErrorText";

const LoginScreen = ({ navigation }) => {
    const { currentUser, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const errorShakeMessage = useRef(null);
    const [success, setSuccess] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            if(currentUser){
                navigation.goBack();
            }
        }, [])
    );

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            // Alert.alert('Error', 'Passwords do not match!');
            errorShakeMessage.current.setText("Passwords do not match");
            errorShakeMessage.current.shake();
            return;
        }

        try {
            sendAPICall('/register', 'POST', {
                email,
                password
            }, null, true)
                .then((data) => {
                    login(data.accessToken, data.user);
                    navigation.goBack();
                }).catch((err) => {
                    errorShakeMessage.current.setText(err.message);
                    errorShakeMessage.current.shake();
                });
        } catch (err) {
            errorShakeMessage.current.setText(err.message);
            errorShakeMessage.current.shake();
        }
    };

    const handleLogin = async () => {
        try {
            sendAPICall('/login', 'POST', {
                email,
                password
            }, null, true)
                .then((data) => {
                    errorShakeMessage.current.setText("");
                    setSuccess("Logged in successfully");

                    login(data.accessToken, data.user);

                    // Delay 300ms
                    setTimeout(() => {
                        setSuccess("");
                        navigation.goBack();
                    }, 300);
                }).catch((err) => {
                    errorShakeMessage.current.setText("Failed to log in");
                    errorShakeMessage.current.shake();
            });
        } catch (err) {
            errorShakeMessage.current.setText(err.message);
            errorShakeMessage.current.shake();
        }
    };

    return (
        <>
            <DismissKeyboardView style={global_styles.mainView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={global_styles.mainView}
            >
                <Text style={global_styles.text}>Email</Text>
                <TextInput
                    style={global_styles.input(colors.secondaryContent, colors.secondaryContentLight)}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoCompleteType="email"
                    placeholderTextColor={colors.textLight}
                />

                <Text style={global_styles.text}>Password</Text>
                <TextInput
                    style={global_styles.input(colors.secondaryContent, colors.secondaryContentLight)}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    textContentType="password"
                    autoCompleteType="password"
                    placeholderTextColor={colors.textLight}
                />
                {!isLoginView && (
                    <>
                        <Text style={global_styles.text}>Confirm Password</Text>
                        <TextInput
                            style={global_styles.input(colors.secondaryContent, colors.secondaryContentLight)}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                            secureTextEntry={true}
                            textContentType="password"
                            autoCompleteType="password"
                            placeholderTextColor={colors.textLight}
                        />
                    </>
                )}

                {/*<Text style={global_styles.errorText}>*/}
                {/*    {error}*/}
                {/*</Text>*/}
                <Text style={global_styles.successText}>
                    {success}
                </Text>
                <ShakeableErrorText ref={errorShakeMessage} style={global_styles.errorText} />

                {isLoginView ? (
                    <Button
                        title="Login"
                        style={global_styles.button}
                        onPress={handleLogin}
                    />
                ) : (
                    <Button
                        title="Sign Up"
                        style={global_styles.button}
                        onPress={handleSignUp}
                    />
                )}
            </KeyboardAvoidingView>
            <View style={styles.bottom}>
                {isLoginView ? (
                    <Button
                        title="Don't have an account? Sign Up"
                        style={styles.bottom}
                        onPress={() => setIsLoginView(false)}
                    />
                ) : (
                    <Button
                        title="Already have an account? Login"
                        style={styles.bottom}
                        onPress={() => setIsLoginView(true)}
                    />
                )}
            </View>
            </DismissKeyboardView>
        </>
    );
}


const styles = StyleSheet.create({
    bottom: {
        marginTop: 10,
    }
});

export default LoginScreen;