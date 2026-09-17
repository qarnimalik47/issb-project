import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { loadTokens } from './src/api/client'
import { LoginScreen } from './src/screens/Login'
import { HomeScreen } from './src/screens/Home'
import { FlashcardsScreen } from './src/screens/Flashcards'
import { DigestScreen } from './src/screens/Digest'
import { PracticeScreen } from './src/screens/Practice'
import { ProfileScreen } from './src/screens/Profile'

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Flashcards: undefined
  Digest: undefined
  Practice: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    loadTokens()
      .then(setSignedIn)
      .finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName={signedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ISSB Prep' }} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="Digest" component={DigestScreen} options={{ title: 'Daily digest' }} />
        <Stack.Screen name="Practice" component={PracticeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
