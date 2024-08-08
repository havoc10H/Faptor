import React, { useState, useRef, useEffect } from 'react'
import { 
  StyleSheet, Modal, View, Platform, TouchableOpacity, FlatList, Text, TouchableWithoutFeedback, 
  ScrollView, TextInput, Button, Dimensions, Image, PermissionsAndroid, 
} from 'react-native'
import Background from '../components/Background'
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import FlashMessage, { showMessage } from 'react-native-flash-message'; // Import FlashMessage and showMessage
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { Buffer } from 'buffer'; // Import Buffer package
import HomeStyle from '../styles/HomeStyle'; // Adjust the path based on your folder structure

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
        showMessage({ message: `Storage Permission Granted.`, type: 'success' });
      } else {
        showMessage({ message: `Storage Permission Denied.`, type: 'error' });
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.GRANTED) {
      showMessage({ message: `Photo Library Permission Granted.`, type: 'success' });
    } else {
      showMessage({ message: `Storage Permission Denied.`, type: 'error' });
    }
  }
};

function prettyBytes(num) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const neg = num < 0;
  if (neg) num = -num;
  if (num < 1) return (neg ? '-' : '') + num + ' B';
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
  const unit = units[exponent];
  num = Number((num / Math.pow(1000, exponent)).toFixed(1));
  return (neg ? '-' : '') + num + ' ' + unit;
}

const mediaFileExtensions = ['.mp3', '.mp4', '.wav', '.mov', '.jpg', '.jpeg', '.png', '.gif'];

const isMediaFile = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  return mediaFileExtensions.includes(`.${extension}`);
};
  
export default function HomeScreen ({ navigation }) {
  const settingMenu = [
    {key:'0', value:'Download Directory', icon: '📁'},
    {key:'1', value:'Download Speed', icon: '⬇️'},
    {key:'2', value:'Upload Speed', icon: '⬆️'},
  ]

  const webviewRef = useRef(null);

  const [downloadUri, setDownloadUri] = useState(RNFS.DownloadDirectoryPath);
  
  const [MAX_DOWNLOAD_SPEED, setMaxDownloadSpeed] = useState(0);
  const [MAX_UPLOAD_SPEED, setMaxUploadSpeed] = useState(0);

  const [torrents, setTorrents] = useState([]);

  const sourceUri = Platform.select({
    ios: '', // Update if needed
    android: 'file:///android_asset/torrent.html' // Local HTML file for Android
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    loadSavedTorrents();
  }, []);

  useEffect(() => {
    setMaxSpeeds();
  }, [MAX_DOWNLOAD_SPEED, MAX_UPLOAD_SPEED]);

  const savedTorrentsFileName = 'torrents.json';

  const saveTorrents = async (updatedTorrents) => {
    try {
      const filteredTorrents = updatedTorrents.filter(torrent => torrent.isDownloading === false);
      const filePath = `${RNFS.DocumentDirectoryPath}/${savedTorrentsFileName}`;
      await RNFS.writeFile(filePath, JSON.stringify(filteredTorrents));
    } catch (error) {
      showMessage({ message: `Error saving torrents`, type: 'error' });
    }
  }
  
  const loadSavedTorrents = async () => {
    try {
      const filePath  = `${RNFS.DocumentDirectoryPath}/${savedTorrentsFileName}`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) { // Check if the file exists
        const content = await RNFS.readFile(filePath); // Read the file if it exists
        setTorrents(JSON.parse(content));
      } else {
        const defaultTorrents = [];
        await saveTorrents(defaultTorrents); // Create a new file with default data
        setTorrents(defaultTorrents); // Set state with default data
      }
    } catch (error) {
      showMessage({message: `Error loading saved torrents`, type: 'error'});
    }
  }

  const deleteTorrent = (torrentInfoHash) => {
    const updatedTorrents = torrents.filter(torrent => torrent.infoHash !== torrentInfoHash);
    setTorrents(updatedTorrents);
    saveTorrents(updatedTorrents);

    const message = JSON.stringify({ action: 'deleteTorrent', torrentInfoHash });
    sendMessageToWebview(message);
  }

  
  const startDownload = (torrentInfoHash) => {
    const message = JSON.stringify({ action: 'startDownload', torrentInfoHash});
    sendMessageToWebview(message);
  }

  const pauseDownload = (torrentInfoHash) => {
    const message = JSON.stringify({ action: 'pauseDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const resumeDownload = (torrentInfoHash) => {
    const message = JSON.stringify({ action: 'resumeDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const stopDownload = (torrentInfoHash) => {
    const message = JSON.stringify({ action: 'stopDownload', torrentInfoHash });
    sendMessageToWebview(message);
  }

  const stopDuplication = (torrentInfoHash) => {
    const message = JSON.stringify({ action: 'stopDuplication', torrentInfoHash });
    sendMessageToWebview(message);
  }
  const sendMessageToWebview = function(message) {
    if (webviewRef.current) {
      webviewRef.current.postMessage(message);
    }
  }

  const handleWebViewMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.flag) {
      case -1: // duplicate torrent error
        showMessage({message: `Torrent is already exists.`, type: 'warning'});
        break;
      case 0: // start torrent downloading
        const isDuplicate = torrents.some(torrent => torrent.infoHash === data.torrentInfoHash);

        if (isDuplicate) {
          showMessage({ message: `Torrent already exists.`, type: 'warning' });
          stopDuplication(data.torrentInfoHash); // Assuming stopDownload is defined
        } else {
          setTorrents(prev => [...prev, {
            infoHash: data.torrentInfoHash, currentStatus: null, 
            isDownloading: true, savedInfo: null,
            receivedChunks: false
          }]);
          startDownload(data.torrentInfoHash);
        }
       break;
      case 1: // progress
        setTorrents((prev) => {
          return prev.map((torrent) => {
            if (torrent.infoHash === data.currentStatus.infoHash) {
                return {
                    ...torrent,
                    currentStatus: data.currentStatus
                };
            }
            return torrent;
          });
        });

        break;
      case 2: // stop
        setTorrents(prev => prev.filter(torrent => torrent.infoHash !== data.torrentInfoHash));
        break;
      case 3: // done
        updateTorrentInfo(data.torrentInfo);
        break;
      case 6: // receive chunk file
        handleChunk(data.torrentInfoHash, data.fileName, data.chunk, data.chunkIndex);
        break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const updateTorrentInfo = async(torrentInfo) => {
    const downloadDir = `${downloadUri}/${torrentInfo.infoHash}`;
    setTorrents((prev) => {
      const updatedTorrents = prev.map((torrent) => {
        if (torrent.infoHash === torrentInfo.infoHash) {
          return {
            ...torrent,
            isDownloading: false,
            currentStatus: null,
            savedInfo: {
              ...torrent.savedInfo,
              torrentName: torrentInfo.torrentName,
              length: torrentInfo.length,
              fileCount: torrentInfo.fileCount,
              location: downloadDir
            }
          };
        }
        return torrent;
      });

      saveTorrents(updatedTorrents);
      return updatedTorrents;
    });
  };

  const setTorrentFiles = async(downloadDir, torrentInfoHash) => {
    const savedFiles = await loadFilesofDir(downloadDir);
      setTorrents((prev) => {
        const updatedTorrents = prev.map((torrent) => {
          if (torrent.infoHash === torrentInfoHash) {
            return {
              ...torrent,
              savedInfo: {
                ...torrent.savedInfo,
                files: savedFiles
              }
            };
          }
          return torrent;
        });

        saveTorrents(updatedTorrents);
        return updatedTorrents;
      });  
  }

  const handleChunk = async (torrentInfoHash, fileName, chunkData, chunkIndex) => {
    const downloadDir = `${downloadUri}/${torrentInfoHash}`;
    const filePath = `${downloadDir}/${fileName}`;
    const dirExists = await RNFS.exists(downloadDir);
    if (!dirExists) {
      await RNFS.mkdir(downloadDir);
    }
    await handleChunkDownload(filePath, chunkData, chunkIndex);
    setTorrentFiles(downloadDir, torrentInfoHash);
  }

  const handleChunkDownload = async (filePath, chunkData, chunkIndex) => {
    try {
      const binaryData = Buffer.from(chunkData, 'base64');
      await RNFS.appendFile(filePath, binaryData.toString('base64'), 'base64');
    } catch (error) {
      console.error('Error saving chunk:', error);
    }
  };

  const loadFilesofDir = async (dirPath) => {
    try {
      const files = await RNFS.readDir(dirPath);
      return files;
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const uriToPath = async (uri) => {
    if (uri.startsWith('content://')) {
      const splitUri = uri.split('%3A');
      const type = splitUri[0].split('/')[2];
      const relativePath = splitUri[1];
      const fullPath = `/storage/emulated/0/${relativePath}`;
      return fullPath;
    } else if (uri.startsWith('file://')) {
      return uri.replace('file://', '');
    }
    return null;
  };

  // Set settings for this app.
  const setDownloadPath = async () => {
    const res = await DocumentPicker.pickDirectory();
    if (res) {
      const uri = res.uri;

      let path;
      if (Platform.OS === 'android') {
        path = await uriToPath(uri);
      } else if (Platform.OS === 'ios') {
        path = uri.replace('file://', '');
      }
      setDownloadUri(path);
    }
  };

  const setMaxSpeeds = async () => {
    const message = JSON.stringify({ action: 'setMaxSpeeds', MAX_DOWNLOAD_SPEED, MAX_UPLOAD_SPEED });
    sendMessageToWebview(message);
  }
 
  const [isSettingOpen, setIsSettingOpen] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);
  const [torrentId, setTorrentId] = useState('');

  const handleOkPress = () => {
    setModalVisible(false);
    const message = JSON.stringify({ action: 'addTorrentLink', torrentId });
    sendMessageToWebview(message);
  };

  const handleCancelPress = () => {
    setTorrentId(''); // Clear input if needed
    setModalVisible(false);
  };

  const onClickSettingMenu = async(index) => {
    setIsSettingOpen(false)

    switch (index) {
      case 0:
        setDownloadPath();
        break;
      case 1:
        navigation.navigate('SettingScreen', {
          curSpeed: MAX_DOWNLOAD_SPEED,
          isDownload: true,
          onGoBackFromOptions: (speed) =>_onGoBackFromOptions(speed)
        })
        break;
      case 2:
        navigation.navigate('SettingScreen', {
          curSpeed: MAX_UPLOAD_SPEED,
          isDownload: false,
          onGoBackFromOptions: (item) =>_onGoBackFromOptions(item)
        })
        break;
    }    
  }

  const _onGoBackFromOptions = (item) => {
    if(item.isDownload){
      setMaxDownloadSpeed(item.speed);
    } else {
      setMaxUploadSpeed(item.speed)
    }
  }

  const openFolder = async (fileUri) => {
    DocumentPicker.pickDirectory();
  }

  

  const sortFiles = (files) => {
    return files.sort((a, b) => {
      const aIsMedia = isMediaFile(a.name);
      const bIsMedia = isMediaFile(b.name);
      if (aIsMedia && !bIsMedia) return -1;
      if (!aIsMedia && bIsMedia) return 1;
      return 0;
    });
  };

  const openFile = (fileUri, isMediaFileFlag) => {
    if (!isMediaFileFlag) {
      return;
    }
    try {
      const formattedPath = Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;

      FileViewer.open(formattedPath)
        .then(() => {
          showMessage({ message: `File opened successfully`, type: 'success' });
        })
        .catch(error => {
          showMessage({ message: `Error opening file:`, type: 'error' });
        });
    } catch (error) {
      showMessage({ message: `Error opening file:`, type: 'error' });
    }
  };


  const renderFileItem = ({ item }) => {
    const filePath = `file://${item.path}`;
    const isMediaFileFlag = isMediaFile(item.name);

    return (
      <TouchableOpacity onPress={() => openFile(filePath, isMediaFileFlag)}>
        <View style={{ height: 20, width: '100%', marginTop: 5, paddingRight: 15}}>
          <Text style={HomeStyle.itemText}>
            &#8226; {item.name} ({prettyBytes(item.size)})
            {isMediaFileFlag && (
              '▶️'
            )}
          </Text>
        </View> 
      </TouchableOpacity>
    ); 
  }

  const renderSavedTorrents = (item) => {
    return (
      <View style={HomeStyle.cellView}>
        <View style={HomeStyle.cellContentView}>

          <View style={HomeStyle.cellTitleView}>
            <Text style={HomeStyle.cellTitleText}>{item.savedInfo.torrentName}</Text>
            <TouchableOpacity style={HomeStyle.deleteButton} onPress={() => deleteTorrent(item.infoHash)}>
              <Text style={HomeStyle.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <View style={HomeStyle.savedInfo}>
            <View style={{ height: 20, width: '100%'}}>
              <Text style={HomeStyle.savedInfoItemText}>{item.infoHash}</Text>
            </View>
          
            <View style={{ height: 20, width: '100%'}}>
             <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexDirection: 'row'}}
              >
                <Text 
                  style={HomeStyle.savedInfoItemText} 
                   numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.savedInfo.location}
                </Text>
                <TouchableOpacity onPress={() => openFolder(item.savedInfo.location)}>
                  <Text style={HomeStyle.openFolderButtonText}>&#128193;</Text>
                </TouchableOpacity>
              </ScrollView>
            </View> 
          </View>

          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ position: 'absolute', top: '30%', right: 0, padding: 10, zIndex: 1 }}>
              <Text style={HomeStyle.savedInfoItemText}>
                {item.savedInfo.fileCount} files&nbsp;({item.savedInfo.length})
              </Text>
            </View>
            <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
              <FlatList
                showsVerticalScrollIndicator={true}
                style={{ flex: 1 }}
                data={sortFiles(item.savedInfo.files)}
                keyExtractor={(file) => file.name}
                renderItem={renderFileItem}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  const renderDownloadingTorrent = (item) => {
    return (
      <View style={HomeStyle.cellView}>
        <View style={HomeStyle.cellContentView}>

          <View style={HomeStyle.cellTitleView}>
            <Text style={HomeStyle.cellTitleText}>{item.currentStatus.torrentName}</Text>
          </View>

          <View style={HomeStyle.downloadingStatus}>
            <View style={{ height: 20, width: '100%'}}>
              <Text style={HomeStyle.itemText}>{item.currentStatus.numPeers}</Text>
            </View>
            <View style={{ height: 20, width: '100%'}}>
              <Text style={HomeStyle.itemText}>
                {item.currentStatus.downloaded} / {item.currentStatus.length}
                &nbsp;({item.currentStatus.remaining})
              </Text>
            </View> 
             <View style={{ height: 20, width: '100%'}}>
              <Text style={HomeStyle.itemText}>
              ⬇️{item.currentStatus.downloadSpeed} /
              ⬆️{item.currentStatus.uploadSpeed}</Text>
            </View> 
          </View>

          <View style={HomeStyle.downloadingButtons}>
            <TouchableOpacity style={HomeStyle.button} onPress={() => pauseDownload(item.infoHash)} >
              <Text style={{color:'#111', fontSize: 14}}>Pause</Text>   
            </TouchableOpacity>
            <TouchableOpacity style={HomeStyle.button} onPress={() => resumeDownload(item.infoHash)} >
              <Text style={{color:'#111', fontSize: 14}}>Resume</Text>   
            </TouchableOpacity>
            <TouchableOpacity style={HomeStyle.button} onPress={() => stopDownload(item.infoHash)} >
              <Text style={{color:'#111', fontSize: 14}}>Stop</Text>   
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderTorrent = ({ item }) => {
    if (item.isDownloading) {
      if (item.currentStatus != null) {
        return renderDownloadingTorrent(item);
      }
    } else {
      return renderSavedTorrents(item);
    }
  }

  return(
      <Background>
        <View style = {HomeStyle.navigationView}>
          <Text style={HomeStyle.titleText}>Faptor</Text>
          <TouchableOpacity style={HomeStyle.settingButton} onPress={() => setIsSettingOpen(prev => !prev)}>
            <Text style={{color: '#111'}}>&#9881; Settings</Text>
          </TouchableOpacity>
        </View>

          <View style = {HomeStyle.contentView}>
            <FlatList
              data={torrents}
              keyExtractor={(item) => item.infoHash}
              renderItem={renderTorrent}
            />
          
            {isSettingOpen &&
              <FlatList    
                style={HomeStyle.settingMenu}
                showsVerticalScrollIndicator={false}            
                data={settingMenu}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity style={HomeStyle.settingMenuItem} onPress={() => onClickSettingMenu(index)} >
                    <Text style={HomeStyle.settingMenuText}>{item.icon} {item.value}</Text>   
                  </TouchableOpacity>
                )}
              />
            }

            <View style={HomeStyle.addButtonsContainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={HomeStyle.addTorrentLinkButton}>
                <Text style={{fontSize: 13, color: '#111'}}>+ Torrent Link</Text>
              </TouchableOpacity>
              <View style={HomeStyle.gap} />
              <WebView
                ref={webviewRef}
                source={{ uri: sourceUri }}
                onMessage={handleWebViewMessage}
                originWhitelist={['*']} 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={HomeStyle.webView}
                useWebKit={true}
                javaScriptCanOpenWindowsAutomatically={false}
                startInLoadingState={true}
              />
            </View>   

           <Modal
              transparent={true}
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={HomeStyle.modalContainer}>
                <View style={HomeStyle.modalContent}>
                  <Text style={HomeStyle.modalTitle}>Torrent Link...</Text>
                  <TextInput
                    style={HomeStyle.textInput}
                    value={torrentId}
                    onChangeText={setTorrentId}
                    placeholder="Enter torrent link or magnet uri ..."
                  />
                  <View style={HomeStyle.buttonContainer}>
                    <TouchableOpacity style={HomeStyle.modalButton} onPress={handleCancelPress}>
                      <Text style={HomeStyle.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeStyle.modalButton} onPress={handleOkPress}>
                      <Text style={HomeStyle.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </View>
          <FlashMessage position="bottom" /> 
      </Background>
  );

}