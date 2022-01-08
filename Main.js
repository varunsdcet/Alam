import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import store from '../redux/store';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import Geolocation  from 'react-native-geolocation-service';
import * as actions from '../redux/actions';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import { EventRegister } from 'react-native-event-listeners';
import TextTicker from 'react-native-text-ticker';
import {GeocoderLocation, GeolocationInfo,Status,Home,Driver,Location} from '../backend/Api';
import {viewStyle} from '../style/style';

const flatListData = [
  {
    id: 1,
    title: 'CM & Deputy CM',
    source: require('../assets/cm.png'),
  },
  {
    id: 2,
    title: 'Ministers',
    source: require('../assets/minister.png'),
  },
  {
    id: 3,
    title: 'MLA',
    source: require('../assets/mla.png'),
  },
  {
    id: 4,
    title: 'MP',
    source: require('../assets/mp.png'),
  },
  {
    id: 5,
    title: 'Society President',
    source: require('../assets/society.png'),
  },
  {
    id: 6,
    title: 'MC',
    source: require('../assets/mc.png'),
  },
  {
    id: 7,
    title: 'Mayor & Deputy Mayor',
    source: require('../assets/mayor.png'),
  },
  {
    id: 8,
    title: 'Ambulance Booking',
    source: require('../assets/ambulance.png'),
  },
  {
    id: 9,
    title: 'Blood Donation',
    source: require('../assets/blood-donation.png'),
  },
  {
    id: 10,
    title: 'Donation',
    source: require('../assets/donation.png'),
  },
  {
    id: 11,
    title: 'Post Compliants',
    source: require('../assets/post-compliant.png'),
  },
];

const Main = ({navigation}) => {
  const [location, setLocation] = useState(`  Location`);
  const [status, setStatus] = useState(false);
    const [request, setRequest] = useState([]);
const [check, setCheck] = useState('');
const [booking, setbooking] = useState('');
const [current, setcurrent] = useState('');
  const subMenuPress = (id) => {
    if (id === 8) navigation.navigate('AmbulanceDetail');
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      key={item.id}
      onPress={() => subMenuPress(item.id)}>
      <Image source={item.source} style={styles.image_1} />
      <Text style={styles.text_1}>{item.title}</Text>
    </TouchableOpacity>
  );


const getLocatw =() =>{
  RNLocation.configure({
  distanceFilter: 100, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  // activityType: 'other',
  // allowsBackgroundLocationUpdates: false,
  // headingFilter: 1, // Degrees
  // headingOrientation: 'portrait',
  // pausesLocationUpdatesAutomatically: false,
  // showsBackgroundLocationIndicator: false,
});
let locationSubscription = null;
let locationTimeout = null;

ReactNativeForegroundService.add_task(
  () => {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    }).then((granted) => {
      console.log('Location Permissions: ', granted);
      // if has permissions try to obtain location with RN location
      if (granted) {
        locationSubscription && locationSubscription();
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          ([locations]) => {
            locationSubscription();
            locationTimeout && clearTimeout(locationTimeout);
            console.log(locations);
          },
        );
      } else {
        locationSubscription && locationSubscription();
        locationTimeout && clearTimeout(locationTimeout);
        console.log('no permissions to obtain location');
      }
    });
  },
  {
    delay: 1000,
    onLoop: true,
    taskId: 'taskid',
    onError: (e) => console.log('Error logging:', e),
  },
);
}

const set = () =>{
  setStatus(!status)
  var k = status == true ? "0" :"1"

console.log('ttttt')

var cd = {driver_id: store.getState().user.id,on_duty:k}


console.log(cd)
  Status({driver_id: store.getState().user.id,on_duty:k})
    .then((data) => {

      setIsLoading(false);
      if (data.status) {

      } else {
      //  console.log(data);
      }
    })
    .catch((error) => {
  //    console.log('error', error);
    });
}

const accept = (item,status) =>{
 console.log(JSON.stringify(item))
console.log('dehradunss')
var booking_id = item.booking_id

var k = {driver_id: store.getState().user.id,booking_id:booking_id,what:status}
console.log(k)
  Driver({driver_id: store.getState().user.id,booking_id:booking_id,what:status})
    .then((data) => {
  //alert(JSON.stringify(data))
      console.log('pagal')
    console.log(JSON.stringify(data))
    //  setIsLoading(false);
      if (data.status) {

if (status == "1"){
  if (item.booking_type == "schedule"){

  }else{
    setbooking("0")
    navigation.navigate('BookingSummary',{
      item:data.get_booking_details_data.id
    })
  }

  alert('Booking Accepted Succesfully ')
}else{
  ride()
  alert('Booking Reject Succesfully ')
}
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
}


const getlocation = () =>{
  BackgroundGeolocation.on('location', (location) => {
     // handle your locations here
     // to perform long running operation on iOS
     // you need to create background task
     BackgroundGeolocation.startTask(taskKey => {
       // execute long running task
       // eg. ajax post location
       // IMPORTANT: task has to be ended by endTask
       BackgroundGeolocation.endTask(taskKey);
     });
   });

   BackgroundGeolocation.on('stationary', (stationaryLocation) => {
     // handle stationary locations here
  //   Actions.sendLocation(stationaryLocation);
   });

   BackgroundGeolocation.on('error', (error) => {
     console.log('[ERROR] BackgroundGeolocation error:', error);
   });

   BackgroundGeolocation.on('start', () => {

     console.log('[INFO] BackgroundGeolocation service has been started');
   });

   BackgroundGeolocation.on('stop', () => {
     console.log('[INFO] BackgroundGeolocation service has been stopped');
   });

   BackgroundGeolocation.on('authorization', (status) => {
     console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
     if (status !== BackgroundGeolocation.AUTHORIZED) {
       // we need to set delay or otherwise alert may not be shown
       setTimeout(() =>
         Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
           { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
           { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
         ]), 1000);
     }
   });

   BackgroundGeolocation.on('background', () => {
     console.log('[INFO] App is in background');
   });

   BackgroundGeolocation.on('foreground', () => {
     console.log('[INFO] App is in foreground');
   });

   BackgroundGeolocation.on('abort_requested', () => {
     console.log('[INFO] Server responded with 285 Updates Not Required');

     // Here we can decide whether we want stop the updates or not.
     // If you've configured the server to return 285, then it means the server does not require further update.
     // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
     // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
   });

   BackgroundGeolocation.on('http_authorization', () => {
     console.log('[INFO] App needs to authorize the http requests');
   });

   BackgroundGeolocation.checkStatus(status => {
     console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
     console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
     console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

     // you don't need to check status before start (this is just the example)
     if (!status.isRunning) {
       BackgroundGeolocation.start(); //triggers start on start event
     }
   });

}

const updateLocations = async () => {
  const info = await GeolocationInfo();

  Geolocation.getCurrentPosition(
        position => {
          const initialPosition = JSON.stringify(position);
          console.log(initialPosition);
        },
        error => console.log('Error', JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
      );


//  alert(JSON.stringify(info))
  actions.SetCoords(info.coords);

var e = {driver_id: store.getState().user.id,latitude:info.coords.latitude,longitude:info.coords.longitude,device_id:"s",device_type:Platform.OS,device_token:store.getState().ftoken}
console.log(e)
  Location({driver_id: store.getState().user.id,latitude:info.coords.latitude,longitude:info.coords.longitude,device_id:"s",device_type:Platform.OS,device_token:store.getState().ftoken})
    .then((data) => {
updateLocations()


      if (data.status) {
        if (data.get_details.on_duty == "0"){
          if (status == true){
            setStatus(false)
          }
        }else{
          if (status == false){
            setStatus(true)
          }
        }
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      updateLocations()
      console.log('error', error);
    });

  // const res = await GeocoderLocation(
  //   info.coords.latitude,
  //   info.coords.longitude,
  // );
   console.log(JSON.stringify(info.coords));
//  alert(JSON.stringify(res.longitude))
};

  const updateLocation = async () => {
    const info = await GeolocationInfo();
    actions.SetCoords(info.coords);
    const res = await GeocoderLocation(
      info.coords.latitude,
      info.coords.longitude,
    );
     //console.log(res);
    setLocation(
      res.length > 0
        ? ` ${res[0].subLocality}, ${res[0].subAdminArea}`
        : ` Not Found`,
    );
  };


  const renderItemProduct = ({item ,index}) => {

              return (
                <View style = {{elevation:5,backgroundColor:'white',width:'95%',alignSelf:'center'}}>
                <View style={styles.coordsSelectView}>
                  <View style={styles.CSV_1}>
                    <Image
                      source={require('../assets/origin2.png')}
                      style={styles.imageOrigin}
                    />
                    <Image
                      source={require('../assets/coordsLine.png')}
                      style={styles.imageCordsLine}
                    />
                    <Image
                      source={require('../assets/destination2.png')}
                      style={styles.imageDestination}
                    />
                  </View>
                  <View style={styles.CSV_2}>
                    <TouchableOpacity
                      style={styles.pickupView}
                      onPress={() => locationSelectHandler('pickup')}>
                      <Text style={styles.textLocation}>Pickup Location</Text>
                      <Text
                        style={styles.textPickup}
                      >
                      {item.source_address}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.horizontalLine}></View>
                    <TouchableOpacity
                      style={styles.dropView}
                      //   onPress={() => locationSelectHandler('drop')}
                    >
                      <Text style={styles.textLocation}>Drop Location</Text>
                      <Text
                        style={styles.textPickup}
                        >
                    {item.destination_address}
                      </Text>
                    </TouchableOpacity>




                  </View>


                </View>
                <View style = {{flexDirection:'row',justifyContent:'space-between',width:'60%',alignSelf:'center'}}>
<View style = {{marginTop:12}}>
<Text style={styles.textLocation}>Pickup Date</Text>
<Text
style={styles.textPickup}
>
{item.date}
</Text>
</View>
<View style = {{marginTop:12,marginRight:20}}>
<Text style={styles.textLocation}>Pickup time</Text>
<Text
style={styles.textPickup}
>
{item.time}
</Text>
</View>

                </View>


                <View style = {{flexDirection:'row',marginTop:20,alignSelf:'center'}}>

   <View style = {{borderWidth:1,borderWidth:1,borderColor:'#DD0F0F',height:40,width:100}}>
   <Text  onPress={() => accept(item,"0")}
   style={{color:'#DD0F0F',fontFamily:'AvenirLTStd-Medium',fontSize:16,marginTop:12,textAlign:'center'}}
   >
   REJECT
   </Text>
   </View>

   <View style = {{borderWidth:1,borderWidth:0,marginLeft:12,backgroundColor:'#00DA4F',borderColor:'#DD0F0F',height:40,width:100}}>
   <Text onPress={() => accept(item,"1")}
   style={{color:'white',fontFamily:'AvenirLTStd-Medium',fontSize:16,marginTop:12,textAlign:'center'}}
   >
   ACCEPT
   </Text>
   </View>



                </View>
                </View>

              )}

  const menuHandler = () => navigation.openDrawer();


  const ride = () =>{
    Home({driver_id: store.getState().user.id})
      .then((data) => {
        console.log('hi')
console.log(data.current_booking)
        //alert(JSON.stringify(data))
      //  setIsLoading(false);
        if (data.status) {


          if (data.current_booking == "100"){
             EventRegister.emit('myCustomEvent', 'it works!!!')
          }

          if (data.current_booking == "9"){
            if (booking != data.current_booking){
              navigation.navigate('AmbulanceBooking',{
                item:data.current_booking_id
              })
            }


          }
          if (data.current_booking == "0"){
              if (booking != data.current_booking){
            navigation.navigate('BookingSummary',{
              item:data.current_booking_id
            })
          }

          }
          if (data.current_booking == "6"){
              if (booking != data.current_booking){
            navigation.navigate('Starting',{
              item:data.current_booking_id
            })
          }

          }
          if (data.current_booking == "7"){
              if (booking != data.current_booking){
            navigation.navigate('Trip',{
              item:data.current_booking_id
            })
          }

          }
          if (data.current_booking == "8"){
              if (booking != data.current_booking){
            navigation.navigate('Complete',{
              item:data.current_booking_id
            })
          }

          }

          if (data.current_booking == "100"){
              if (booking != data.current_booking){
                //setbooking("100")
              //  alert(booking)
              //  alert("Booking Cancelled by User")
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'MyDrawer'}],
                // })
          }

          }
        //  alert(data.current_booking)
            setbooking(data.current_booking)
// if (data.get_details.on_duty == "0"){
//   if (status == true){
//     setStatus(false)
//   }
// }else{
//   if (status == false){
//     setStatus(true)
//   }
// }j


console.log(JSON.stringify(data.request_array))
          setRequest(data.request_array)
          ride()

//alert(JSON.stringify(data))

        } else {
          ride()
          //console.log(data);
        }
      })
      .catch((error) => {
        ride()
      //  console.log('error', error);
      });
  }

const update = () =>{
  const info =  GeolocationInfo();
  alert(JSON.stringify(info))
}


  useEffect(() => {
    const backgroundgranted =  PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  {
    title: 'Background Location Permission',
    message:
      'We need access to your location ' +
      'so you can get live quality updates.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  },
);
if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
  //do your thing!
}
    getlocation()
    getLocatw()
    //alert(store.getState().user.id)
    updateLocations()
    ride()

    const unsubscribe =   navigation.addListener('focus', () => {
ride()
      })


    updateLocation();
  }, []);

  return (
    <SafeAreaView style={viewStyle.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={menuHandler}>
          <Image
            source={require('../assets/menu.png')}
            style={styles.imageMenu}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.text_2}>{`Home`}</Text>

        </View>
        <TouchableOpacity
          style={styles.headerSearchView}
          onPress={() => navigation.navigate('Search')}>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerNotificationView}
          onPress={() => navigation.navigate('Notification')}>
          <Image
            source={require('../assets/notification.png')}
            style={styles.imageNotification}
          />
        </TouchableOpacity>
      </View>
      {/* <ScrollView> */}


      <View style = {{width:'90%',height:90,backgroundColor:'white',alignSelf:'center',elevation:5,marginTop:12}}>
        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>

        <View>
<Text style = {{fontSize:18,fontFamily:'AvenirLTStd-Heavy',margin:4,marginTop:15,color:'#242E42'}}>
Mark Availability
</Text>
<Text style = {{fontSize:16,fontFamily:'AvenirLTStd-Heavy',margin:4,color:'#EF4236'}}>
{status == true ? "On" :"Off"} Duty
</Text>


        </View>

        <TouchableOpacity

          onPress={() => set()}>
        <View>
        {status == false && (
          <Image
            source={require('../assets/off.png')}
            style={{width:60,height:40,marginRight:20,resizeMode:'contain',marginTop:20}}
          />
        )}
        {status == true && (
          <Image
            source={require('../assets/on.png')}
            style={{width:60,height:40,marginRight:20,resizeMode:'contain',marginTop:20}}
          />
        )}
</View>
</TouchableOpacity>

        </View>
      </View>
      <FlatList
                                 data={request}


                                 renderItem={renderItemProduct}
                             />


      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text_1: {
    width: 80,
    textAlign: 'center',
    marginTop: 5,
    alignSelf: 'center',
      fontFamily: 'AvenirLTStd-Medium',
      fontSize:14,
      color:'#0A1F44'
  },
  text_2: {
    fontFamily: 'AvenirLTStd-Heavy',
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
  text_3: {
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '900',
    color: '#0A1F44',
  },
  image_1: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  locationImage: {
    width: 9,
    height: 13,
    resizeMode: 'contain',
  },
  view_main: {
    alignItems: 'center',
  },
  item: {
    width: 120,
    marginVertical: 4,
    marginHorizontal: 4,
    marginTop:20
  },
  headerView: {

    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginTop:0,
    height:90,
    backgroundColor:'#EF4236'
  },
  headerSearchView: {
    marginLeft: 'auto',
  },
  headerNotificationView: {
    marginHorizontal: 16,
  },
  imageMenu: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 16,
    marginVertical: 8,

  },
  imageSearch: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  imageNotification: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  subTitleText: {
    fontFamily: 'Avenir',
    fontWeight: '900',
    fontSize: 18,
    color: '#0A1F44',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  coordsSelectView: {
    flex:0,

    width: '85%',
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginTop: 30,

  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  CSV_1: {
    flex: 0.25,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: '5%',
  },
  imageOrigin: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  imageCordsLine: {
    width: 2,
    resizeMode: 'cover',
  },
  imageDestination: {
    width: 16,
    height: 22,
    resizeMode: 'contain',
  },
  CSV_2: {
    flex: 1,
    justifyContent: 'center',
  },
  pickupView: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
  },
  textPickup: {
    fontFamily: 'Avenir-Medium',
    fontWeight: '400',
    fontSize: 13,
    color: '#242E42',
  },
  dropView: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
  },
  textDrop: {
    fontFamily: 'Avenir',
    fontWeight: '400',
    fontSize: 17,
    color: '#242E42',
  },
  amountText: {
    marginTop: 8,
    fontFamily: 'Ping Fang SC',
    fontWeight: '600',
    fontSize: 16,
    color: '#EF4236',
  },
});

export default Main;
