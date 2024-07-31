import React, { useRef, useEffect, useState } from 'react';
import { View, Button, TextInput, StyleSheet, Text, FlatList, Image, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import FlashMessage, { showMessage } from 'react-native-flash-message'; // Import FlashMessage and showMessage
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import {selectDirectory} from 'react-native-directory-picker';
import { Buffer } from 'buffer'; // Import Buffer package

import { NativeModules } from 'react-native';

const { FileResolver } = NativeModules;

const resolveUri = async (uri) => {
  try {
    const localPath = await new Promise((resolve, reject) => {
      FileResolver.resolveUri(uri, resolve, reject);
    });
    console.log(`Local file path: ${localPath}`);
    // Do something with the local path
  } catch (error) {
    console.error(`Error resolving URI: ${error}`);
  }
};

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
  const webviewRef = useRef(null);

  const [savedTorrents, setSavedTorrents] = useState([]);
  const [downloadUri, setDownloadUri] = useState(RNFS.DownloadDirectoryPath);
  const [files, setFiles] = useState([]);
  
  const [MAX_DOWNLOAD_SPEED, setMaxDownloadSpeed] = useState(0);
  const [MAX_UPLOAD_SPEED, setMaxUploadSpeed] = useState(0);

  const [downloadingTorrents, setDownloadingTorrents] = useState([]);

  const sourceUri = Platform.select({
    ios: 'file:///assets/torrent.html', // Update if needed
    android: 'http://192.168.2.59:3000/' // Update with your server URL
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    loadSavedTorrents();
  }, []);

  useEffect(() => {
    loadDownloadedFiles();
  }, []);

  const loadSavedTorrents = async () => {
    try {
      const fileName = 'savedtorrents';
      const filePath  = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) { // Check if the file exists
        const content = await RNFS.readFile(filePath); // Read the file if it exists
        setSavedTorrents(content);
      } else {
        await RNFS.writeFile(filePath, ''); // Initialize with empty content or your default content
        setFileContent(''); // Set empty content or your default content
      }
    } catch (error) {
      showMessage({message: `Error loading saved torrents`, type: 'error'});
      // console.error('Error loading saved torrents:', error);
    }
  }

  const loadDownloadedFiles = async () => {
    try {
      const downloadDir = `${RNFS.DocumentDirectoryPath}/downloads`;

      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      // Read the directory
      const files = await RNFS.readDir(downloadDir);
      setFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const pauseDownload = () => {
    var torrentInfoHash = downloadingTorrents[0];
    const message = JSON.stringify({ action: 'pauseDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const resumeDownload = () => {
    var torrentInfoHash = downloadingTorrents[0];
    const message = JSON.stringify({ action: 'resumeDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const stopDownload = () => {
    var torrentInfoHash = downloadingTorrents[0];
    const message = JSON.stringify({ action: 'stopDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const sendMessageToWebview = function(message) {
    if (webviewRef.current) {
      webviewRef.current.postMessage(message);
    } else {
      console.log('WebView reference is not set.');
    }
  }

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    switch (data.flag) {
    case -1: // duplicate torrent error
      console.log('duplicated torrent error...');
      showMessage({message: `Torrent is already exists.`, type: 'warning'});
      break;
    case 0: // start torrent downloading
      console.log('start torrent downloading...');
      downloadingTorrents.push(data.infoHash);
      break;
    case 1: // progress
      console.log(data.currentStatus.downloaded);
      break;
    case 2: // stop
      console.log('stopped');
      setDownloadingTorrents(prev => prev.filter(torrent => torrent !== data.torrentInfoHash));
      break;
    case 3: // done
      console.log('done');
      const updatedTorrentInfo = { ...data.torrentInfo, location: downloadUri };

      setDownloadingTorrents(prev => prev.filter(torrent => torrent !== updatedTorrentInfo.infoHash));

      setSavedTorrents(prev => [...prev, updatedTorrentInfo]);

      handleTorrentContents(updatedTorrentInfo.torretName, data.contentData);
      break;
    }
  };

  const handleTorrentContents = async(torretName, allData) => {
    allData.forEach(data => {
      handleFileDownload(torretName, data);
    });
  }

  const handleFileDownload = async (torrentName, data) => {
    try {
      const downloadDir = `${downloadUri}/${torrentName}`;
      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      console.log(downloadDir);

      const filePath = `${downloadDir}/${data.fileName}`;
      const binaryData = Buffer.from(data.base64Data, 'base64');
      
      await RNFS.writeFile(filePath, binaryData.toString('base64'), 'base64');

      loadDownloadedFiles();
    } catch (error) {
      console.error('Error Saving file:', error);
    }
  };

  // Set settings for this app.

  const getFileFromUri = async (uri) => {
    try {
      const path = uri.replace('content://', '/storage/emulated/0/')
      console.log('File path:', path);
      return path;
    } catch (error) {
      console.error('Error getting file path:', error);
    }
  };

  const setDownloadPath = async () => {
    try {
      const uri = await selectDirectory();
      console.log('Selected directory URI:', uri);

      // Assuming `convertUriToPath` is a custom function or method
      const path = await resolveUri(uri);
      console.log('Converted directory path:', path);
      if (path) {
        setDownloadUri(path);
      }
    } catch (error) {
      console.error('Error setting download directory:', error);
      showMessage({ message: `Error setting download directory: ${error.message}`, type: 'error' });
    }
  };

  const setMaxSpeeds = async () => {
    const message = JSON.stringify({ action: 'setMaxSpeeds', MAX_DOWNLOAD_SPEED, MAX_UPLOAD_SPEED });
    sendMessageToWebview(message);
  }
 
  const openFile = (fileUri) => {
    FileViewer.open(fileUri)
      .then(() => {
        console.log('File opened successfully');
      })
      .catch(error => {
        console.error('Error opening file:', error);
      });
  };

  const renderItem = ({ item }) => {
    const fileExtension = item.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'mov', 'avi'].includes(fileExtension);
    const fileUri = `file://${item.path}`;

    return (
      <View style={styles.mediaContainer}>
        <TouchableOpacity onPress={() => openFile(fileUri)}>
          <View style={styles.textContainer}>
            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Select Download Directory" onPress={setDownloadPath} />
      <Button title="Pause" onPress={pauseDownload} />
      <Button title="Resume" onPress={resumeDownload} />
      <Button title="Stop" onPress={stopDownload} />
      <WebView
        ref={webviewRef}
        source={{ uri: sourceUri }}
        onMessage={handleWebViewMessage}
        originWhitelist={['*']} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FlashMessage position="bottom" /> 
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  mediaContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  video: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  textContainer: {
    padding: 10,
  },
  list: {
    padding: 10,
  },
});


export default App;
