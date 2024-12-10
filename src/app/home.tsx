import { View, Alert } from "react-native";

import { api } from "@/services/api";
import { useEffect } from "react";

export default function Home() {

  const fetchCategories = async () => {
    try {
      const data = await api.get('/categories')
    } catch (error) {
      Alert.alert("Categorias", "Não foi possivel carregar as categorias")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      
    </View>
  )
}