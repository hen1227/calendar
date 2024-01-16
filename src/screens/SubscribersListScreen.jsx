import {View, Text, FlatList} from "react-native";
import React from "react";
import {global_styles} from "../Styles";
import Button from "../components/Button";
import Clipboard from '@react-native-clipboard/clipboard';


const SubscribersListScreen = ({ navigation, route }) => {
    const subscribers = route.params.subscribers || [];

    return (
        <View style={global_styles.mainView}>
            {subscribers.length === 0 &&
                <View style={global_styles.tertiaryContent}>
                    <Text style={global_styles.text}>No members</Text>
                </View>
            }
            {subscribers.length > 0 && (
                <>
                    <Text style={global_styles.text}>Members:</Text>
                    <FlatList data={subscribers} renderItem={
                        ({item}) => {
                            return (
                                <View style={global_styles.mainContent}>
                                    <Text style={global_styles.text}>{item.email}</Text>
                                </View>
                            )
                        }
                    }/>
                    <Button title={'Copy List'} onPress={()=>{
                        const subscribersString = subscribers.map((user) => user.email).join(',');
                        Clipboard.setString(subscribersString);
                    }} />
                </>
            )}
        </View>
    )
}

export default SubscribersListScreen;