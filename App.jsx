import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarViews from "./src/screens/CalendarViews";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AccountScreen from "./src/screens/AccountScreen";
import {AuthProvider, useAuth} from "./src/auth/AuthContext";
import {colors, global_styles} from "./src/Styles";
import LeaderClubsScreen from "./src/screens/LeaderClubsScreen";
import CreateEventScreen from "./src/screens/CreateNewEvent";
import CreateClubScreen from "./src/screens/CreateNewClubScreen";
import NotificationsSetup from "./src/notifications/NotificationsSetup";
import CustomClassScreen from "./src/screens/CustomClassScreen";
import Button from './src/components/Button';
import {Text, View} from "react-native";
import CustomizeClassesScreen from "./src/screens/CustomizeClassesScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ClubLeaderDetailsScreen from "./src/screens/ClubLeaderDetailsScreen";
import SubscribersListScreen from "./src/screens/SubscribersListScreen";
import LeadersListScreen from "./src/screens/LeadersListScreen";
import ClubShareScreen from "./src/screens/ClubShareScreen.native";

import AccountIcon from './src/static/icons/user-solid.svg';
import CalendarIcon from './src/static/icons/calendar-solid.svg';
import CreateIcon from './src/static/icons/calendar-plus-solid.svg';

// enableScreens();

const linking = {
    prefixes: ['calendar-app://'],
    config: {
        initialRouteName: 'Calendar',
        screens: {
            Calendar: {
                path: 'calendar'
            },
            Subscribe: {
                path: 'subscribe/:clubId'
            }
        }
    }
};

const Tab = createBottomTabNavigator();

const CreateStack = createNativeStackNavigator();
function CreateEventStackNavigator() {
    const { currentUser, logout } = useAuth();

    return (
        <>
            {(!currentUser || (currentUser && (currentUser.email.indexOf('@sps.edu') !== -1))) && (
                <CreateStack.Navigator screenOptions={{
                    headerStyle: {backgroundColor: colors.tertiaryBackground},
                    headerTitleStyle: {color: colors.text},
                    headerTintColor: colors.textLight,
                    headerBackTitle: 'Cancel',
                }}>
                    <CreateStack.Screen name="LeaderClubsScreen" component={LeaderClubsScreen} options={{title: 'Clubs List'}}/>
                    <CreateStack.Screen name="LoginScreen" component={LoginScreen} options={{title: 'Login', headerBackVisible: false}}/>
                    <CreateStack.Screen name="ClubLeaderDetailsScreen" component={ClubLeaderDetailsScreen} options={{title: ''}}/>
                    <CreateStack.Screen name="LeadersListScreen" component={LeadersListScreen} options={{title: 'Leaders list'}}/>
                    <CreateStack.Screen name="SubscribersListScreen" component={SubscribersListScreen} options={{title: 'Members List'}}/>
                    <CreateStack.Screen name="ClubShareScreen" component={ClubShareScreen} options={{title: 'Invite'}}/>
                    <CreateStack.Screen name="CreateEventScreen" component={CreateEventScreen}
                                        options={{title: 'Create Event'}}/>
                    <CreateStack.Screen name="CreateClubScreen" component={CreateClubScreen} options={{title: 'Create Club'}}/>
                </CreateStack.Navigator>
            )}
            { (currentUser && currentUser.email.indexOf('@sps.edu') === -1) && (
                <>
                <View style={global_styles.mainView}>
                    <View style={global_styles.mainView}>
                        <Text style={global_styles.errorText}>Signed in as {currentUser.email}</Text>
                        <Text style={global_styles.errorText}>You need an email ending with `@sps.edu` to manage clubs/events.</Text>
                    </View>
                    <Button style={{marginTop: 40}} title="Logout" onPress={logout} />

                </View>
                </>
            )}
        </>
    );
}

const AccountStack = createNativeStackNavigator();

function AccountStackNavigator() {
    return (
        <AccountStack.Navigator screenOptions={{
            headerStyle: {backgroundColor: colors.tertiaryBackground},
            headerTitleStyle: {color: colors.text},
            headerTintColor: colors.textLight,
            headerBackTitle: 'Cancel',
        }}>
            <AccountStack.Screen name="AccountDetails" component={AccountScreen} options={{title: 'Account'}} />
            <AccountStack.Screen name="Login" component={LoginScreen} options={{title: 'Login'}} />
            <AccountStack.Screen name="CustomizeClasses" component={CustomizeClassesScreen} options={{ title: 'Customize Classes' }} />
            <AccountStack.Screen name="CustomClasses" component={CustomClassScreen} options={{ title: 'Customize Class' }} />
        </AccountStack.Navigator>
    );
}

export default function App() {

    return (
        <AuthProvider>
        <NotificationsSetup />
        <SafeAreaView style={global_styles.app}>
        <NavigationContainer
            linking={linking}
            fallback={
            <View style={global_styles.mainView}>
                <Text style={global_styles.header}>Loading...</Text>
            </View>}
        >
            <Tab.Navigator
                initialRouteName={'Calendar'}
                screenOptions={{
                headerStyle: {backgroundColor: colors.secondaryBackground},
                headerTitleStyle: {color: colors.text},
                tabBarStyle:{backgroundColor: colors.secondaryBackground}
            }}>
                <Tab.Screen name="Create" component={CreateEventStackNavigator} options={{
                    tabBarIcon: ({ color, size }) => (
                        <CreateIcon color={color} width={size} height={size} />
                    ),
                    tabBarLabel: 'Create',
                }}/>
                <Tab.Screen name="Calendar" component={CalendarViews} options={{
                    tabBarIcon: ({ color, size }) => (
                        <CalendarIcon color={color} width={size} height={size} />
                    ),
                }}/>
                <Tab.Screen name="Account" component={AccountStackNavigator} options={{
                    tabBarIcon: ({ color, size }) => (
                        <AccountIcon color={color} width={size} height={size} />
                    ),
                }}/>
            </Tab.Navigator>
        </NavigationContainer>
        </SafeAreaView>
        </AuthProvider>
    );
}
