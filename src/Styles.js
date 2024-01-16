import {StyleSheet} from "react-native";

export const colors = {
    background: "#101020",
    secondaryBackground: "#202040",
    tertiaryBackground: "#404080",
    text: "#FFFFFF",
    textLight: "#BEBEBEA0",
    mainContent: "#1040AA30",
    mainContentRaw: "#1040AA",
    mainContentLight: "#1040AACC",
    outdatedContent: "#40604030",
    outdatedContentLight: "#406040CC",
    outdatedContentRaw: "#406040",
    secondaryContent: "#10AA4030",
    secondaryContentRaw: "#10AA40",
    secondaryContentLight: "#10AA40CC",
    tertiaryContent: "#10888830",
    tertiaryContentRaw: "#108888",
    tertiaryContentLight: "#108888CC",
}

export const global_styles = StyleSheet.create({
    app: {
        backgroundColor: colors.background,
        flex:1,
    },
    background: {
        backgroundColor: colors.background,
    },
    mainView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    input: (backgroundColor, borderColor) => ({
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: colors.text,
        width: '80%',
    }),
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        justifyContent: 'center',
        textAlign: "center",
        alignItems: "center",
        backgroundColor: colors.background
    },
    text: {
        textAlign: "center",
        color: colors.text,
        paddingVertical: 5,
    },
    header: {
        textAlign: "center",
        color: colors.text,
        paddingVertical: 5,
        fontSize: 24,
        marginBottom: 30,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '800',
        paddingVertical: 5,
    },
    warningText: {
        color: 'yellow',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '800',
        paddingVertical: 5,
    },
    deleteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '800',
    },
    successText: {
        color: '#40D0A0',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '800',
        paddingVertical: 5,
    },
    mainContent: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 8,
        marginTop: 16,
        backgroundColor: colors.mainContent,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: colors.mainContentLight,
        borderRadius: 10,
    },
    secondaryContent: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 8,
        marginTop: 16,
        backgroundColor: colors.secondaryContent,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: colors.secondaryContentLight,
        borderRadius: 10,
    },
    tertiaryContent: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 8,
        marginTop: 16,
        backgroundColor: colors.tertiaryContent,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: colors.tertiaryContentLight,
        borderRadius: 10,
    },
});