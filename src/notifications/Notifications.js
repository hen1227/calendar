import {Alert, Platform} from "react-native";
import sendAPICall from "../auth/APIs";
import {Notifications} from "react-native-notifications";

export function setupNotifications(user){
    console.log("Setting up notifications");
    console.log("for user: ", user);

    Notifications.registerRemoteNotifications();

    console.log(Notifications.events());

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
        completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerRemoteNotificationsRegistered(event => {
        if(!user) return;
        if(!user.id) return;

        sendAPICall( `/saveDeviceToken`, 'POST', {
            deviceToken: event.deviceToken,
            userId: user.id,
            platform: Platform.OS,
        }, user)
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });

        console.log("Device Token Received", event.deviceToken);
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed(event => {
        console.error(event);
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log('Notification opened by device user', notification);
        completion();
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        console.log('Notification Received - Foreground', notification);
        completion({alert: true, sound: true, badge: false});
    });
}