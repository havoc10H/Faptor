import React from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'

export default function Background({ children }) {
  return (
    Platform.OS === 'ios'? 
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}      
    </KeyboardAvoidingView>
    :<SafeAreaView style={styles.container} behavior="padding">
      {children}      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,    
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5'
  },
})
