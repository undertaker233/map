import React, { useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'
import { icon } from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

const Map = () => {
    const limeOptions = {
        color: 'red',
        weight: 3,
        opacity: 0.7
    };
    
    const customIcon=icon({
        iconUrl:'https://www.svgrepo.com/show/513278/bus.svg',
        iconSize:[25,41],
        iconAnchor:[12,41],
        popupAnchor:[1,-34],
    })
    const BusStopIcon=icon({
        iconUrl:'https://www.svgrepo.com/show/401245/bus-stop.svg',
        iconSize:[50,50],
        iconAnchor:[12,41],
        popupAnchor:[1,-34]
    })
    const [route,setRoute]=useState([])
    // 儲存公車路線
    const [inputBus,setInputBus]=useState('0212')
    // 儲存公車位置
    const [bus,setBus]=useState([])
    const [stops,setStops]=useState([])
    const stopurl=`https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/Keelung?$format=JSON`
    const routeurl=`https://tdx.transportdata.tw/api/basic//v2/Bus/Shape/City/Keelung/${inputBus}?$format=json`
    const busurl=`https://tdx.transportdata.tw/api/basic/v2/Bus/RealTimeByFrequency/Streaming/City/Keelung/${inputBus}?$format=JSON`
    

    const addBusLocation=(e)=>{
        e.preventDefault()
        axios({
            method:'get',
            url:busurl
        }).then(res=>{
            // console.log(res.status)
            // console.log(res.data)
            // 篩選出符合id的公車
            let busLocation=res.data.filter((bus)=>bus.RouteID===inputBus)
            console.log(busLocation)
            // 儲存公車
            setBus([...busLocation])
        })
    }
    const addBusStops=()=>{
        axios({
            method:'get',
            url:stopurl
        }).then((res)=>{
            let routeStops=res.data
            console.log(routeStops)
            routeStops=routeStops[0].Stops.map((stops)=>{return{
                StopName:stops.StopName.Zh_tw,
                PositionLat:stops.StopPosition.PositionLat,
                PositionLon:stops.StopPosition.PositionLon,
            }})
            setStops([...routeStops])
            // console.log(stops)
        })
        
    }
    const addRouteLine=(e)=>{
        e.preventDefault()
        axios({
            methods:'get',
            url:routeurl
        }).then((res)=>{
            let routeNodes=res.data
            console.log('route:',routeNodes)
            routeNodes=routeNodes[0].Geometry.replace('LINESTRING(','').replace(')','').split(',')
            let routeLine=routeNodes.map(node=>[node.split(' ')[1],node.split(' ')[0]])
            console.log(routeLine)
            setRoute([routeLine])
        })
        
    }
    return (
        <div>
            {/*
             condition by the user click  mouse_click() 
             func userclick( data )// map info

                if mouse_click()  : return [location ] //mouse_click ==true

            */}
            <form action="" onSubmit={addBusLocation}>
                
                新增路線
                <input type="text" value={inputBus} onChange={(e)=>setInputBus(e.target.value)} />
              
                <input type="submit" value={'submit'} />
            </form>
           
            {/*  userclick_info =userclick()
             */}
            <MapContainer zoom={13} center={[25.1276,121.7392]}>
            <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
            />
            {
                bus.map((bus)=>(
                    <Marker
                        key={bus.PlateNumb}
                        position={[bus.BusPosition.PositionLat,bus.BusPosition.PositionLon]}
                        icon={customIcon}
                     >
                         <Popup>{bus.PlateNumb}</Popup>                       
                    </Marker>
                ))
            }
            {
                stops.map((stop,index)=>
                    <Marker
                        position={[stop.PositionLat,stop.PositionLon]}
                        key={index}
                        icon={BusStopIcon}
                        >
                        <Popup>{stop.StopName}</Popup>
                    </Marker>
                )
            }
            {
                route.map((line,index)=>
                    <Polyline
                        pathOptions={limeOptions}
                        positions={line}
                        key={index}>

                    </Polyline>
                )
            }
            </MapContainer>
        </div>
            
    
    );
}

export default Map;
