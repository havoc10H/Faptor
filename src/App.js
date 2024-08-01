import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { 
    SettingScreen,
    HomeScreen,
 } from './screens';

const Stack = createStackNavigator()

export default function App() {
    return(        
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            >
                <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                <Stack.Screen name="SettingScreen" component={SettingScreen}/>
            </Stack.Navigator>

        </NavigationContainer>
    );
}
