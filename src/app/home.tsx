import { View, Alert, Text } from "react-native";

import { api } from "@/services/api";
import { useEffect, useState } from "react";
import Categories, { CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import Places from "@/components/places";

type MarketProps = PlaceProps & {}

export default function Home() {

  const [ categories, setCategories ] = useState<CategoriesProps>([])
  const [ category, setCategory ] = useState("")
  const [ markets, setMarkets ] = useState<MarketProps[]>([])

  const fetchCategories = async () => {
    try {
      await api.get('/categories')
      .then(response => {
        setCategories(response.data)
        setCategory(response.data[0].id)
      })
    } catch (error) {
      Alert.alert("Categorias", "Não foi possivel carregar as categorias")
      console.log(error)
    }
  }

  const fetchMarkets = async () => {  
    try {
      if(!category) {
        return
      }

      await api.get(`/markets/category/${category}`)
      .then(response => {
        setMarkets(response.data)
      })
    } catch (error) {
      Alert.alert('Locais', 'Não foi possivel carregar os locais.')
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [category])

  return (
    <View style={{ flex: 1 }}>
      <Categories 
        selected={category}
        onSelect={setCategory}
        data={categories} 
      />
      <Places
        data={markets}
      />
    </View>
  )
}