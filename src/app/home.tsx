import { useEffect, useState } from "react";
import { View, Alert, Text } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { router } from "expo-router";
import * as Location from 'expo-location'

import { api } from "@/services/api";
import { colors, fontFamily } from "@/styles/theme";

import Places from "@/components/places";
import { PlaceProps } from "@/components/place";
import Categories, { CategoriesProps } from "@/components/categories";

type MarketProps = PlaceProps & {
  latitude: number,
  longitude: number,
  phone: string,
  categoryId: string
}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
}

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

  const getCurrentLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync()

      if(granted) {
        const location = await Location.getCurrentPositionAsync({})
        console.log(location);
      }
    } catch (error) {
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

    <MapView 
      style={{ flex: 1 }} 
      showsCompass={false}
      rotateEnabled={false}
      initialRegion={{
        latitude: currentLocation.latitude, 
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }} 
    >
      <Marker  
        identifier="current"
        image={require('@/assets/location.png')}
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }}
      />
      {markets.map(item => {
        return (
          <Marker
            key={item.id}
            identifier={item.id}
            image={require('@/assets/pin.png')}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude
            }}
          >
            <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
              <View>
                <Text 
                  style={{ 
                    fontSize: 14, 
                    color: colors.gray[600],
                    fontFamily: fontFamily.medium
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ 
                    fontSize: 12, 
                    color: colors.gray[600],
                    fontFamily: fontFamily.regular
                  }}
                >{item.address}</Text>
              </View>
            </Callout>
          </Marker>
        )
      })}
    </MapView>

      <Places
        data={markets}
      />
    </View>
  )
}