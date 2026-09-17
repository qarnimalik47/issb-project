/**
 * Push notification registration (build prompt §10: push for daily practice,
 * digest and results). Requests permission and returns an Expo push token that
 * the app can register with the backend to schedule reminders.
 */
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export async function registerForPush(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync()
  let status = existing
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status
  }
  if (status !== 'granted') return null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync()
    return token.data
  } catch {
    return null
  }
}

/** Schedule a local daily practice reminder as a simple example. */
export async function scheduleDailyReminder(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'ISSB Prep', body: 'Time for your daily practice and flashcards.' },
    trigger: { hour: 19, minute: 0, repeats: true, type: Notifications.SchedulableTriggerInputTypes.DAILY },
  })
}
