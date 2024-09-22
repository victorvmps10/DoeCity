import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ListParticipants({ DATA }) {
    return (
        <View style={style.container}>
            <View style={style.header}>
                <Image 
                style={style.avatar}
                source={require('../../assets/avatar.png')}/>
                <Text style={style.name}>{DATA.name}</Text>
                <Text style={style.name}> - {DATA.yearOld} anos</Text>
            </View>

            <Text style={style.content}>{DATA.work}</Text>
            <View style={style.actions}>
                <TouchableOpacity
                    onPress={() => null}
                    style={style.likeButton}>
                    <Text style={{color: '#121212'}}>
                        0
                    </Text>
                    <MaterialCommunityIcons
                        name='heart-plus-outline'
                        size={20}
                        color="#E52246"
                    />
                </TouchableOpacity>
            </View>
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
    actions: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
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
    }
})