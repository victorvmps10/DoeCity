import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ListParticipants({ DATA }) {
    return (
        <View style={style.container}>
            <View style={style.header}>
                <Image
                    style={style.avatar}
                    source={DATA.photo} />
                <Text style={style.name}>{DATA.name}</Text>
                <Text style={style.name}> - {DATA.yearOld} anos</Text>
            </View>

            <Text style={style.content}>{DATA.work}</Text>
                {DATA?.insta && (
                    <TouchableOpacity
                    style={[style.button, {backgroundColor: '#E1306C'}]}
                        onPress={() => Linking.openURL(`https://instagram.com/${DATA.insta}`)}
                    >
                        <Text style={{fontSize: 25, color: '#fff'}}>Instagram</Text>
                    </TouchableOpacity>
                )}
                {DATA?.github && (
                    <TouchableOpacity
                    style={[style.button, {backgroundColor: '#24292E'}]}
                        onPress={() => Linking.openURL(`https://github.com/${DATA.github}`)}
                    >
                        <Text style={{fontSize: 25, color: '#fff'}}>GitHub</Text>
                    </TouchableOpacity>
                )}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        marginTop: 8,
        margin: 8,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 3,
        padding: 11,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        color: '#000'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 6,
    },
    content: {
        color: '#000',
        margin: 4,
    },
    timePost: {
        color: '#000'
    },
    likeButton: {
        width: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    like: {
        color: '#E52246',
        marginRight: 6,
    },
    button:{
        margin: 5,
        borderRadius: 5,
        height: 45,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})