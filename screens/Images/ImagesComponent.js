import React from 'react';
import {View, StyleSheet} from 'react-native';
import Image from 'react-native-image-progress';

const styles = StyleSheet.create({
    imageBlockContainer: {
        display: "flex",
        flexDirection: "row",
    },
    smallImageContainer: {
        display: "flex",
        flexDirection: "column"
    }
})

const ImagesComponent = ({ imagesData, width, height}) => {

    const normalImageSize = {
        width: width,
        height: height
    }

    const tripleImageSize = {
        width: width * 3,
        height: height * 3,
    };

    const ImageItem = (uri, optionsStyles = normalImageSize) => (
        <Image
            style={optionsStyles}
            source={uri}
            threshold={150}
        />
    );

    return (
        <>
            <View style={styles.imageBlockContainer}>
                <View style={styles.smallImageContainer}>
                    {imagesData[0] && ImageItem(imagesData[0])}
                    {imagesData[3] && ImageItem(imagesData[1])}
                    {imagesData[5] && ImageItem(imagesData[2])}
                </View>
                {imagesData[1] && ImageItem(imagesData[0], tripleImageSize)}
                <View style={styles.smallImageContainer}>
                    {imagesData[2] && ImageItem(imagesData[3])}
                    {imagesData[4] && ImageItem(imagesData[4])}
                    {imagesData[6] && ImageItem(imagesData[5])}
                </View>
            </View>
        </>
    );
};

export default ImagesComponent
