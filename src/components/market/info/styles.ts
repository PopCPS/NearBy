import { StyleSheet } from "react-native";
import { colors, fontFamily} from '@/styles/theme'
import { G } from "react-native-svg";

export const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    color: colors.gray[500],
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 22.4,
    flex: 1
  }
})