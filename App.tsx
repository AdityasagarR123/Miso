import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Miso</Text>
      <Text style={styles.tagline}>
        Learn a language in a few minutes a day, completely free.
      </Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: colors.rust,
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 12,
  },
  tagline: {
    color: colors.brown,
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 320,
    textAlign: 'center',
  },
});
