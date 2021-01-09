import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet, PermissionsAndroid} from "react-native";
import Tuner from "./tuner";
import Note from "./note";
import Meter from "./meter";
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {
  state = {
    note: {
      name: "A",
      octave: 4,
      frequency: 440,
    },
  };

  _update(note) {
    this.setState({ note });
  }

  async componentDidMount() {
    SplashScreen.hide();
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const tuner = new Tuner();
    tuner.start();
    tuner.onNoteDetected = (note) => {
      if (this._lastNoteName === note.name) {
        this._update(note);
      } else {
        this._lastNoteName = note.name;
      }
    };
    admob()
    .setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.PG,
  
      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: true,
  
      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,
    })
    .then(() => {
      // Request config successfully set!
    });
  }

  render() {
    return (
      <View style={style.body}>
        <StatusBar backgroundColor="#000" translucent />
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <Text style={style.frequency}>
          {this.state.note.frequency.toFixed(1)} Hz
        </Text>
        <View style={{marginTop:50,marginBottom:10}}>        
        <BannerAd
            unitId={"ca-app-pub-7042395532979448/8682376001"} 
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(error) => {
            console.error('Erro: ', error);}}
          />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent:"flex-end",
    alignItems: "center",
  },
  frequency: {
    fontSize: 28,
    color: "#37474f",
  },
});

