import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator, Image,
    TouchableOpacity, Text, TextInput, Alert,
    Dimensions    
} from 'react-native'
import Background from '../components/Background'
import SettingStyle from '../styles/SettingStyle'; // Adjust the path based on your folder structure

export default function SettingScreen ({ navigation, route }) {
    const isDownload = route.params.isDownload
    const currentSpeed = route.params.curSpeed
    const [curSpeed, setCurSpeed] = useState(currentSpeed)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button
            title="Save"
            onPress={onClickSave}
          />
        ),
      });
    }, [navigation, curSpeed, isDownload]);

    const onClickSave = async() => {
        route.params.onGoBackFromOptions({speed: curSpeed, isDownload: isDownload})
        navigation.goBack()
    };

    return(
        <Background>
            <View style = {SettingStyle.navigationView}>
                <Text style={SettingStyle.titleText}>{isDownload ? 'Download Speed' : 'Upload Speed'}</Text>              
            </View>
           
            <View style = {SettingStyle.contentView}>  
                <Text style={SettingStyle.speedText}>Speed</Text>
                <View style ={SettingStyle.inputview}>
                    <TextInput
                        style={SettingStyle.speedInput}
                        value={curSpeed.toString()}
                        keyboardType='numeric'
                        onChangeText={ (text) => setCurSpeed(Number(text)) }
                    />
                    
                    <Text style={SettingStyle.byteText}>KB</Text>                    
                </View>

                <TouchableOpacity style={SettingStyle.saveButton} onPress={() => onClickSave()}>
                    <Text style={SettingStyle.saveText}>SAVE</Text>
                </TouchableOpacity>
            </View>
                

            {loading ? 
            (<ActivityIndicator
            color={theme.colors.primary}
            size="large"
            style={SettingStyle.preloader}
            />
            ) : null}

        </Background>
    );
}