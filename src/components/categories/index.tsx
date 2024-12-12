import { FlatList, } from "react-native";
import { s } from "./styles";
import Category from "../category";

export type CategoriesProps = {
  name: string
  id: string
}[]

type Props = {
  data: CategoriesProps
  selected: string
  onSelect: (id: string) => void
}

export default function Categories({
  selected,
  onSelect,
  data
}: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      horizontal
      contentContainerStyle={s.content}
      style={s.container}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => 
        <Category
          iconId={item.id}
          name={item.name}
          onPress={() => onSelect(item.id)}
          isSelected={item.id === selected}  
        />
      } 
    />
  )
}