import React, { useState, useEffect } from 'react';
import {
    View, Text,
    ScrollView, Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Appbar } from 'react-native-paper';
import {AppBarTheme, useScreenDimensions} from "../../constants/data";
import SearchBar from "react-native-dynamic-search-bar";
import ImagesComponent from "./ImagesComponent";

const splitter = (arr = [], maxArrSize = 7) => {

    const result = [];

    for (let i = 0; i < Math.ceil(arr.length / maxArrSize); i++) {
        result[i] = arr.slice(i * maxArrSize, (i * maxArrSize) + maxArrSize);
    }

    return result;
};

const ImagesContainer = ({ navigation }) => {

    const [component, setComponent] = useState([]);

    const Home = () => {
        navigation.navigate('Creator');
    }

    const pickImage = async () => {
        const pickedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1
        });

        if (pickedImage.cancelled) {
            console.log('cancelled')
        } else {
            setComponent(prevState => [...prevState, { uri: pickedImage.uri }])
        }
    };

    useEffect(() => {
        const url = `https://pixabay.com/api/?key=19193969-87191e5db266905fe8936d565&q=red+cars&image_type=photo&per_page=21`;
        let cleanupFunction = false;
        const fetchData = async () => {
            try {
                const fetchResult = await fetch(url);
                const loadedData = await fetchResult.json();
                const loadedDataURIs = loadedData['hits'].map((lD) => ({ uri: lD['largeImageURL'] }));
                setComponent(loadedDataURIs)
            } catch (e) {
                console.error(e.message)
            }
        };
        fetchData();
        return () => cleanupFunction = true;
    }, []);

    const screenData = useScreenDimensions();
    console.log(component)

    const Images = splitter(component).map(
        image => (
            <ImagesComponent
                key={image[0].uri}
                imagesData={image}
                width={screenData.width / 5}
                height={
                    screenData.isLandscape ?
                        screenData.height / 2.5 :
                        screenData.height / 8
                }
            />
        )
    );

    return (
        <>
            <View>
                <Appbar.Header theme={ AppBarTheme }>
                    <Appbar.Action
                        icon="home"
                        onPress={Home}
                    />
                    <SearchBar
                        style={{ backgroundColor: '#f8ecdd', flex: 1}}
                        placeholder="Search"
                    />
                    <Appbar.Action
                        icon="plus"
                        onPress={pickImage}
                    />
                </Appbar.Header>
            </View>
            <View style={{
                flex: 1
            }}>
                {
                    component.length === 0 ?
                        <View style={{
                            backgroundColor: '#f8ecdd',
                            height: Dimensions.get('screen').height,
                            paddingTop: screenData.isLandscape ? '20%' : '65%',
                            flexDirection:'column',
                            alignItems:'center'
                        }}>
                            <Text style={{fontSize: 20}}>
                                No images
                            </Text>
                        </View> :
                        <ScrollView style={{
                            backgroundColor: '#f8ecdd'
                        }}>
                            { Images }
                        </ScrollView>
                }
            </View>
        </>
    );
};

export default ImagesContainer
