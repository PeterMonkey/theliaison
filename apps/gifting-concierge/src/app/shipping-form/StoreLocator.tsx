'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from "@theliaison/ui/input"
import { Button } from '@theliaison/ui/button'
import { Card, CardContent } from "@theliaison/ui/card"
import { MapPin } from "lucide-react"
import { Icon } from 'leaflet'
import { getFedexLocations } from './action'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const stores = [
  { id: 1, name: "Tienda Centro", lat: 40.416775, lng: -3.703790 },
  { id: 2, name: "Tienda Norte", lat: 40.423852, lng: -3.712416 },
  { id: 3, name: "Tienda Sur", lat: 40.398857, lng: -3.691648 },
]

// Componente para actualizar la vista del mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Icono personalizado para los marcadores
const icon = new Icon({
  iconUrl: "https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_mark_icon_148684.png",
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
  const [mapCenter, setMapCenter] = useState([40.416775, -3.703790])
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
			//console.log(fedexLocation);
			
		} catch (error) {
			console.error(error)
		} 
    // finally {
		// 	toast.success("FedEx locations fetched successfully!");
		// 	setIsLoading(false)
		// }
	}


  return (
    <div className="flex h-[600px] mx-2">
      <div className="w-1/3 p-4 overflow-auto">
        <div className="mb-4">
          <form
          className='flex gap-2'
          onSubmit={form.handleSubmit(onSubmit)}
          >
          <Input
            type="text"
            placeholder="Search for zip code..."
            value={searchTerm}
            //onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button 
          className='bg-foreground text-background hover:bg-foreground/70'
          >
            Search
          </Button>
          </form>
        </div>
        {filteredStores.map(store => (
          <Card 
            key={store.id} 
            className={`mb-2 cursor-pointer ${selectedStore === store.id ? 'border-primary' : ''}`}
            onClick={() => {
              setSelectedStore(store.id)
              setMapCenter([store.lat, store.lng])
              setMapZoom(14)
            }}
          >
            <CardContent className="p-4">
              <h3 className="font-bold">{store.name}</h3>
              <p className="text-sm text-muted-foreground">Lat: {store.lat}, Lng: {store.lng}</p>
            </CardContent>
          </Card>
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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stores.map(store => (
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
          ))}
        </MapContainer>
      </div>
    </div>
  )
}