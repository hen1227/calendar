import {View, Text, StyleSheet} from "react-native";
import React, {useRef} from "react";
import {global_styles, colors} from "../Styles";
import QRCode from "react-native-qrcode-svg";
// import {CameraRoll} from "@react-native-camera-roll/camera-roll";
// import {captureRef} from "react-native-view-shot";
import Button from "../components/Button";
import RNPrint from "react-native-print";


const ClubShareScreen = ({ navigation, route }) => {
    const { club } = route.params;
    const qrRef = useRef(null);


    if(!club){
        console.log(club);
        navigation.goBack();
        return (
            <View style={global_styles.mainView}>
                <Text>Club not found</Text>
            </View>
        );
    }

    const downloadQR = async () => {
        captureQR().then(uri => {
            if (uri) {
                saveQR(uri);
            }
        }).catch(error => {
            console.error("Failed to download QR:", error);
        });
    };

    const saveQR = async (uri) => {
        try {
            await CameraRoll.save(uri, {type: 'photo'});
        } catch (error) {
            console.error("Failed to save QR:", error);
        }
    };

    const printQR = async () => {
        captureQR().then(uri => {
            if (uri) {
                RNPrint.print({ filePath: uri });
            }
        }).catch(error => {
            console.error("Failed to print QR:", error);
        });
    };

    const captureQR = async () => {
        try {
            const uri = await captureRef(qrRef, {
                format: 'png',
                quality: 0.8,
            });
            return uri;
        } catch (error) {
            console.error("Failed to capture QR:", error);
        }
    };

    return (
        <View style={global_styles.mainView}>
            <View style={styles.qrcodeBorder}>
            <QRCode
                value={`calendar-app://subscribe/${club.id}`}
                color={"#000"}
                backgroundColor={'#fff'}
                size={240}
                style={{width:'100%'}}
                getRef={(c) => (qrRef.current = c)}
            />
            </View>
            {/*<Button title="Download QR" onPress={downloadQR} />*/}
            <Button title="Print QR" onPress={printQR} />
        </View>
    )
}

const styles = StyleSheet.create({
    qrcodeBorder: {
        borderWidth: 1,
        borderColor: colors.secondaryBackground,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    }
});


export default ClubShareScreen