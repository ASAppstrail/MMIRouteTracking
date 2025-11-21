/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MapplsIntouch from 'mappls-intouch-react-native';
import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { MapplsIntouch: MapplsIntouchModule } = NativeModules;
  const intouchEmitter = new NativeEventEmitter(MapplsIntouchModule);

  const CLIENT_ID =
    '96dHZVzsAusIl_xeiUYXCKWmghhNCWwXdxd4rTYuy0PY2aGMNWR9wf8OppzOR184w0XpfFlrWWVIIPpwRhJUeg==';
  const CLIENT_SECRET =
    'lrFxI-iSEg86TcL4ow0w0Eju06k_pIYRIJ6Kllb2YkQAACaCfAd6PChLljSpJJBBLq-rgGI6U5FA_6JhS91c4bNILm1iLGuh';
  const DEVICE_NAME = 'Test_Device_01';

  useEffect(() => {
    const runTest = async () => {
      try {
        console.log('1. Asking Permissions (Sequential)...');

        if (Platform.OS === 'android') {
          const fgGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (
            fgGranted === PermissionsAndroid.RESULTS.GRANTED &&
            Platform.Version >= 29
          ) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            );
          }
        }

        console.log('2. Initializing SDK...');
        const isInit = await MapplsIntouch.isInitialized();
        if (!isInit) {
          await MapplsIntouch.initialize(DEVICE_NAME, CLIENT_ID, CLIENT_SECRET);
        }

        console.log('3. Starting Tracking...');
        await MapplsIntouch.startTracking();

        console.log('Fetching single location…');
        const loc = await MapplsIntouch.getCurrentLocationUpdate();
        console.log('Location new:', loc);

        Alert.alert('Success!', 'Tracking started');

        intouchEmitter.addListener('locationUpdated', data => {
          console.log('Live Update:', data);
        });
      } catch (error: any) {
        console.error(error);
        Alert.alert('Error', error.message);
      }
    };

    runTest();

    return () => {
      intouchEmitter.removeAllListeners('locationUpdated');
    };
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
