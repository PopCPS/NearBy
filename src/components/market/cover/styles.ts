import { StyleSheet } from "react-native";
import { colors } from '@/styles/theme'

export const s = StyleSheet.create({
  container: {
    width: '100%',
    height: 232,
    marginBottom: -32,
    backgroundAttachment: colors.gray[200] 
  },
  header: {
    padding: 24,
    paddingBottom: 56
  }
})