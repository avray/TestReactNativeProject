import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';
import react_native_test_image_logo from './assets/react_native_test_image_logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);
  
  let openImagePickerAsync = async () => {
    
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync;

    if(permissionResult.granted == false) {
      alert('Permission to access media files on your device is required');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log("Picker Result:");
    console.log(pickerResult);
    if(pickerResult.cancelled == true) {
      console.log("Image picker cancelled");
      return;
    }

    console.log("Platform.OS = " + Platform.OS);  
    if(Platform.OS === 'web') {
      // console.log('https://cors-anywhere.herokuapp.com/'+pickerResult.uri);
      let remoteURI = await uploadToAnonymousFilesAsync(pickerResult.uri);
      console.log("remoteURI = " + remoteURI);
      setSelectedImage({ localuri: pickerResult.uri, remoteURI });
    } else {
      setSelectedImage({ localuri: pickerResult.uri, remoteURI: null});
    }

  };

  let openShareDialogAsync = async () => {
    if(!(await Sharing.isAvailableAsync())) {
      alert(`The file is available for sharing at : ${selectedImage.remoteURI}`);
      // alert('Oops, sharing isn\'t supported in your platform');
      return;
    } 
    
    await Sharing.shareAsync(selectedImage.localuri);
  }; 

  if(selectedImage != null) {
    return(
      <View style={styles.container}>
        <Image 
          source={{ uri: selectedImage.localuri}}
          style={styles.thumbnail}
        />
        <Pressable
          onPress={openShareDialogAsync}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Share this</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo}/>
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!!!
      </Text>
      <StatusBar style="auto" />

      <Pressable 
        // onPress={() => alert('Hello World!')}
        onPress={openImagePickerAsync}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Pick a Photo</Text>
      </Pressable>

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10, 
  },  
  instructions: {
    color: '#888',
    fontSize: 20,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
