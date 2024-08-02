import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const SettingStyle = StyleSheet.create({
    preloader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
    },
  
    navigationView: {
        width: '100%',
        height: 60,
        backgroundColor: '#8bc34a',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
  
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f5f5f5'
    },

    contentView: {
        width: '100%',
        paddingHorizontal: 12,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    speedText: {
        marginTop: 44,
        marginBottom: 6,
        alignSelf: 'flex-start',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '500',
        color: '#111'
    },

    inputview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    speedInput: {
        flex: 1,
        height: 36,
        borderRadius: 4,
        fontSize: 12,
        borderColor: '#888',
        borderWidth: 1,
        paddingLeft: 12,
        paddingRight: 12,
    },

    byteText:{
        marginLeft: 8,
        fontSize: 12,
    },

    saveButton: {
        width: 120,
        height: 36,
        marginTop: 32,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8bc34a'
    },

    saveText: {
        fontSize: 13,
        color: '#111'
    },   
})

export default SettingStyle;