import { useEffect, useRef, useState } from "react";
import { Alert, Modal, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useCameraPermissions, CameraView } from 'expo-camera'

import { Button } from "@/components/button";
import Loading from '@/components/loading'
import Cover from "@/components/market/cover";
import Coupon from "@/components/market/coupon";
import Details, { DetailsProps } from "@/components/market/details";

import { api } from "@/services/api";

type DataProps = DetailsProps & {
  cover: string
}

export default function Market() {
  
  const [ data, setData ] = useState<DataProps>()
  const [ coupon, setCoupon ] = useState<string | null>(null)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ couponIsFetching, setCouponIsFetching ] = useState(false)
  const [ isVisibleCameraModal, setIsVisibleCameraModal ] = useState(false)

  const [ permission, requestPermission ] = useCameraPermissions()
  const params = useLocalSearchParams<{ id: string }>()

  const qrLock = useRef(false)

  const fetchMarket = async () => {

    if(!params) {
      return
    }

    try {
      await api.get(`/markets/${params.id}`)
      .then(response => {
        setData(response.data)
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possivel carregar os dados.', [
        {
          text: 'Ok', 
          onPress: () => router.back()
        }
      ])
    }
  }

  const handleOpenCamera = async () => {
    try {
      const { granted } = await requestPermission()

      if(!granted) {
        return(
          Alert.alert('Câmera', 'Você precisa habilitar o uso da câmera')
        )
      }
      qrLock.current = false
      setIsVisibleCameraModal(true)
    } catch (error) {
      console.log(error);
      Alert.alert('Câmera', 'Não foi possivel utilizar a câmera')
    }
  }

  const getCoupon = async (id: String) => {
    try {
      setCouponIsFetching(true)

      await api.patch(`/coupons/${id}`)
      .then(reponse => {
        Alert.alert('Cupom', reponse.data.coupon)
        setCoupon(reponse.data.coupon)
      })
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possivel utilizar o cupom')
    } finally {
      setCouponIsFetching(false)
    }
  }

  const handleUseCoupon = (id: string) => {
    setIsVisibleCameraModal(false)

    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    )
  }

  useEffect(() => {
    fetchMarket()
  }, [ params.id, coupon ])

  if(isLoading) {
    return (
      <Loading />
    )
  }

  if(!data) {
    return (
      <Redirect href={'/home'} />
    )
  }

  return(
    <View style={{ flex: 1 }}>
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupon && <Coupon code={coupon} />}

      <View style={{ padding: 12 }} >
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView 
          style={{ flex: 1 }}
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true
              setTimeout(() => handleUseCoupon(data), 500)
            }
          }}
        />

        <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32}}>
          <Button 
            onPress={() => {setIsVisibleCameraModal(false)}}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}