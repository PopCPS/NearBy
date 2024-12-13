import { Text, useWindowDimensions } from "react-native";
import { useRef } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";

import Place, { PlaceProps } from "../place";
import { s } from "./styles";

type PlacesProps = {
  data: PlaceProps[]
}

export default function Places({
  data
}: PlacesProps) {

  const dimesions = useWindowDimensions()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = {
    min: 240, 
    max: dimesions.height - 128
  }
  
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[snapPoints.min, snapPoints.max]}
      handleIndicatorStyle={s.indicator}
      backgroundStyle={s.container}
      enableOverDrag={false}
      enableDynamicSizing={false}
    >
      <BottomSheetFlatList 
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={s.content}
        ListHeaderComponent={() => <Text style={s.title}>Explore locais perto de você</Text>}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => 
          <Place 
            data={item} 
            onPress={() => router.navigate(`/market/${item.id}`)}
          />}
      />
    </BottomSheet>
  )
}