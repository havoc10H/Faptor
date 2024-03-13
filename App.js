import React, { useRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, View, PermissionsAndroid, Alert, Button } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import FlashMessage, { showMessage } from 'react-native-flash-message'; // Import FlashMessage and showMessage
import {selectDirectory} from 'react-native-directory-picker';
import RNFetchBlob from 'rn-fetch-blob';
import FileAccess from 'react-native-file-access';
import styles from './css/styles';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage Permission Granted.');
      } else {
        console.log('Storage Permission Denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.GRANTED) {
      console.log('Photo Library Permission Granted.');
    } else {
      console.log('Photo Library Permission Denied.');
    }
  }
};

const App = () => {
  const [uri, setUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(RNFS.DownloadDirectoryPath);
  const webviewRef = useRef(null);
  
  const sourceUri = Platform.select({
    ios: 'file:///assets/torrent.html',
    android: `http://192.168.2.59:3000/`
    // android: 'file:///android_asset/torrent.html'
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  const setDownloadDirectory = async () => {
    selectDirectory().then((path)=>{
      setDownloadUri(path);
      console.log(path);
    });
  };

  const handleWebViewMessage = async (event) => {
    try {
      const { blob, fileName } = JSON.parse(event.nativeEvent.data);
      if (!blob || !fileName) {
        throw new Error('Invalid data received');
      }

      console.log(blob);

      const base64Data = blob;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const filePath = `${downloadUri}/${fileName}`; // Save to Downloads directory
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        // For image files, you might want to preview them instead of saving
        showMessage({
          message: `Image file received: ${fileName}`,
          type: 'success',
        });
        // You can display the image directly if desired
        // Example: setImageUri(`data:image/${fileExtension};base64,${base64Data}`);
      } else if (['mp4', 'webm'].includes(fileExtension)) {
        // For video files, you might want to preview them instead of saving
        showMessage({
          message: `Video file received: ${fileName}`,
          type: 'success',
        });
        // Example: setVideoUri(`data:video/${fileExtension};base64,${base64Data}`);
      } else {
        // For other file types, save the file
        await RNFS.writeFile(filePath, base64Data, 'base64');
        console.log('File saved to', filePath);
        showMessage({
          message: `File saved to ${filePath}`,
          type: 'success',
        });
      }
    } catch (error) {
      showMessage({
        message: `Failed to save file: ${error.message}`,
        type: 'danger',
      });
      console.error('Error handling message', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Torrent File" onPress={setDownloadDirectory} />
     
      <WebView
        ref={webviewRef}
        source={{ uri: sourceUri }} 
        style={styles.webview}
        onMessage={handleWebViewMessage}
      />
 
      <FlashMessage position="bottom" /> 
    </View>
  );
};


export default App;
