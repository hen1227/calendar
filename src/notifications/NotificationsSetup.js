import {useAuth} from "../auth/AuthContext";
import {useEffect} from "react";
import {setupNotifications} from "./Notifications";

const NotificationsSetup = () => {
    const { currentUser } = useAuth();

    useEffect(() => {
        if(currentUser && currentUser.isVerified) {
            setupNotifications(currentUser);
        }
    }, [currentUser]);

    return (<></>);
};

export default NotificationsSetup;