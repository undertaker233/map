import React from 'react'
import ReactDOM from 'react-dom/client'
import "leaflet/dist/leaflet.css"
import './index.css'
import { MapContainer,TileLayer,Marker,Popup,Polyline } from 'react-leaflet'
import BusMap from './component/map.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BusMap></BusMap>
  </React.StrictMode>,
)
