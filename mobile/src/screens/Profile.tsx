import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../App'
import { api, logout } from '../api/client'
import type { PublicUser } from '../api/types'

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>

export function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<PublicUser | null>(null)

  useEffect(() => {
    api<{ user: PublicUser }>('/api/me')
      .then((d) => setUser(d.user))
      .catch(() => {})
  }, [])

  async function signOut() {
    await logout()
    navigation.replace('Login')
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.meta}>{user.emailVerified ? 'Email verified' : 'Email not verified'}</Text>
        </>
      ) : (
        <Text>Loading…</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  name: { fontSize: 22, fontWeight: '600' },
  email: { color: '#444' },
  meta: { color: '#888' },
  button: { marginTop: 24, borderWidth: 1, borderColor: '#c00', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#c00', fontWeight: '600' },
})
