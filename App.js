import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, ScrollView, StyleSheet, Text, View,useWindowDimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [record, setRecoding] = React.useState();
  const [recordings, setRecodings] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const {height} = useWindowDimensions()

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const {recording} = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );

        setRecoding(recording);
      } else {
        setMessage('Pleasegrant permission to app to access microphone');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecoding(undefined);
    await record.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const {sound, status} = await record.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: record.getURI(),
    });
    setRecodings(updatedRecordings);
   
  }
  function getDurationFormatted(milllis) {
    const minutes = milllis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay} : ${secondsDisplay}`;
  }

  return (
    <ScrollView style={{...styles.scrollViewStyle, height: height}}>
    <View style={{...styles.container}}>
        <Text>{message}</Text>
        <Pressable
        style={styles.btnRec}
          onPress={record ? stopRecording : startRecording}>
            <Entypo name="mic" size={64} color={record ? "red" :"white"} />
          </Pressable>
        
        {
          recordings.map((recordinglines, index)=>{
            return (
              <View style={[styles.row]} key={index}>
                <View>
                <Text style={styles.heading}>Recording {index + 1}</Text> 
                <Text style={styles.font}>{recordinglines.duration}</Text>
                </View>
                <Pressable onPress={()=>recordinglines.sound.replayAsync()} ><Entypo name="controller-play" size={30} color="#25316D" /></Pressable>
              </View>
            )
          })
        }
      </View></ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  btnRec: {
    height: 200,
    backgroundColor: '#25316D',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    marginTop: 200,
    marginBottom: 20
  },
  row: {
    display: 'flex',
    width: '90%',
    height: 65,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#171717',
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  font: {
    fontSize: 14,
    marginTop: 5,
  },
  scrollViewStyle: {
    width: '100%',
  }
});
