import {View, Text, FlatList} from "react-native";
import React from "react";
import {global_styles} from "../Styles";
import Button from "../components/Button";


const LeadersListScreen = ({ navigation, route }) => {

    const leaders = route.params.leaders || [];

    return(
        <View style={global_styles.mainView}>
            <FlatList data={leaders} renderItem={
                ({item}) => {
                    return (
                        <View style={global_styles.mainContent}>
                        <Text style={global_styles.text}>{item.email}</Text>
                        </View>
                    )
                }
            } />
            <Button title={'Copy List'} onPress={()=>{
                const leadersString = leaders.map((leader) => leader.email).join(',');
                Clipboard.setString(leadersString);
            }} />
        </View>
    )
}

export default LeadersListScreen;