'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from "@theliaison/ui/input"
import { Button } from '@theliaison/ui/button'
import { Card, CardContent } from "@theliaison/ui/card"
import { 
  Form, 
  FormControl, 
  FormField,
  FormItem, 
  FormMessage 
} from '@theliaison/ui/form'
import { MapPin } from "lucide-react"
import { Icon } from 'leaflet'
import { getFedexLocations } from '../confirm/[giftId]/details/actions'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Locate } from 'lucide-react' 

const stores = [
  { id: 1, name: "Tienda Centro", lat: 40.416775, lng: -3.703790 },
  { id: 2, name: "Tienda Norte", lat: 40.423852, lng: -3.712416 },
  { id: 3, name: "Tienda Sur", lat: 40.398857, lng: -3.691648 },
]

// Componente para actualizar la vista del mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  console.log(center)
  return null;
}

// Icono personalizado para los marcadores
const icon = new Icon({
  iconUrl: "https://cdn.icon-icons.com/icons2/1364/PNG/512/maplocalization_89142.png",
  iconSize: [38, 38]
})

const ShippingFormSchema = z.object({
	postal_code: z
		.string({ required_error: "Your postal code is required" })
		.min(4, { message: "Your postal code should be at least 4 digits" }),
});

export default function StoreLocator() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState(null)
  const [mapCenter, setMapCenter] = useState<any[]>([40.416775, -3.703790])
  const [mapZoom, setMapZoom] = useState(12)
  const [fedexLocationData, setFedexLocationData ] = useState<any>()

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const form = useForm<z.infer<typeof ShippingFormSchema>>({
		resolver: zodResolver(ShippingFormSchema),
	});

  useEffect(() => {
    // Asegúrate de que el código que usa 'window' solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
      // Corrige el problema de los iconos de Leaflet
      //delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/placeholder.svg?height=41&width=41',
        iconUrl: '/placeholder.svg?height=25&width=41',
        shadowUrl: '/placeholder.svg?height=41&width=41',
      })
    }
  }, [])

  async function onSubmit(data: z.infer<typeof ShippingFormSchema>) {
		//setIsLoading(true)
		try {
			//toast.info("Loading location...");
			const fedexLocation = await getFedexLocations(data.postal_code);
			setFedexLocationData(fedexLocation?.locationDetailList);
      setMapCenter([
        fedexLocation?.locationDetailList?.[0]?.geoPositionalCoordinates?.latitude,
        fedexLocation?.locationDetailList?.[0]?.geoPositionalCoordinates?.longitude
      ])
			
		} catch (error) {
			console.error(error)
		} 
    // finally {
		// 	// toast.success("FedEx locations fetched successfully!");
		// 	// setIsLoading(false)
		// }
	}

  //console.log(fedexLocationData?.[0].geoPositionalCoordinates.latitude)
  console.log(mapCenter)

  return (
    <div className="flex h-[800px]">
      <div className="w-1/3 overflow-auto">
        <div className="mb-10 w-full ">
          <div className='text-2xl font-semibold mb-10'>
            <p>Search by Zip Code</p>
          </div>
          <Form {...form}>
            <form
            className='grid grid-flow-col gap-2 p-2'
            onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
              	control={form.control}
						    name="postal_code"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                    <Input
                      type="text"
                      placeholder="Search for zip code..."
                      className="w-full h-14 border border-black" 
                      {...field}
                    />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />
            <Button 
            className='bg-foreground text-background hover:bg-foreground/70 h-14'
            >
              Search
            </Button>
            </form>
          </Form>
        </div>
        {fedexLocationData?.map(store => (
          <div 
            key={store.locationId} 
            className={`cursor-pointer mr-2 ${selectedStore === store.locationId ? 'border-2 border-black' : 'border'}`}
            onClick={() => {
              setSelectedStore(store.locationId)
              setMapCenter([store.geoPositionalCoordinates.latitude, store.geoPositionalCoordinates.longitude])
              setMapZoom(14)
            }}
          >
            <div className="p-2">
            <div className="w-full font-light h-20 grid grid-rows-2 gap-1 grid-flow-col">
							<div>
				 					<p className="font-semibold">
				 						{store.contactAndAddress.address.streetLines[0]}
				 					</p>
                  <div className='flex gap-2'>
				 					<p>{store.contactAndAddress.address.city}</p>
				 					<p>{store.contactAndAddress.address.stateOrProvinceCode}</p>
                  </div>
				 				</div>
				 				<div className="flex gap-2 mt-1">
									<p className="font-semibold">{store.distance.value}</p>
				 					<p>{store.distance.units}</p>
				 				</div>
							</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          
						  // attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						  // url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}"
							// accessToken="7SSU9Se75NtpK92WwEVKe4DlN5A8oMtdngksuZyqoObtxmfUJP5nhubhTM21UwEC"
							// minZoom={0}
							// maxZoom={22}
          />
          {/* {stores.map(store => (
            <Marker 
              key={store.id}
              position={[store.lat, store.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedStore(store.id)
                  setMapCenter([store.lat, store.lng])
                  setMapZoom(14)
                },
              }}
            >
            </Marker>
          ))} */}
          						  {
							fedexLocationData?.map((location) => (
						  <Marker
						  key={location.locationId}
						   eventHandlers={{
							click: () => selectedAddress(
								location.contactAndAddress.address.streetLines[0],
								location.contactAndAddress.address.city,
								location.contactAndAddress.address.stateOrProvinceCode,
								location.distance.value,
								location.distance.units
							)
						   }}
						   position={[location.geoPositionalCoordinates.latitude, location.geoPositionalCoordinates.longitude]} 
						   icon={icon}
						   >
						  </Marker>

							))
						  }
        </MapContainer>
      </div>
    </div>
  )
}