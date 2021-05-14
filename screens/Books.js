import React from "react";
import {
    View, Text,
    StyleSheet, ScrollView, Dimensions, Image, TouchableHighlight, TouchableOpacity
} from 'react-native'
import { Appbar } from 'react-native-paper';
import BooksList from '../assets/BooksList.json'
import { AppBarTheme, getBookImage, useScreenDimensions } from '../constants/data'
import SearchBar from "react-native-dynamic-search-bar";
import Icon from 'react-native-vector-icons/FontAwesome'

const Books = ({ navigation }) => {

    const [books, setBooksData] = React.useState([])
    const [searchText, setSearchText] = React.useState('')

    const Home = () => {
        navigation.navigate('Creator');
    }

    const deleteBookFromData = (id) => {
        const idx = books.findIndex((el) => el.isbn13 === id)
        const newBooksData = [...books.slice(0, idx),...books.slice(idx + 1)]
        setBooksData(newBooksData)
    };

    const dim = Dimensions.get('screen')
    const screenData = useScreenDimensions();

    const filteredBooks = (items, term) => {
        if(term.length === 0) {
            return null
        }
        if(term.trim().length === 0) {
            return null
        }
        return items.filter((item) => {
            if(
                item.title
                    .replace(/[^a-zA-Z ]/g, "")
                    .toLowerCase()
                    .indexOf(term) > -1 ){
                return (
                    item
                )
            }
        })
    }

    const getUniqueBooksData = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    const currentFilteredBooks = async (text) => {

        let fetchedBooks = []

        const validText = text
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/,/g, '')

        setSearchText(validText)

        if( validText.length <= 2) {
            return null
        } else if ( validText.length >= 2 ) {
            let url = `https://api.itbook.store/1.0/search/${validText}`
            const fetchResult = await fetch(url);
            const loadedData = await fetchResult.json();
            fetchedBooks = [
                ...filteredBooks(books, validText),
                ...loadedData.books
            ]
        }
        setBooksData(
            getUniqueBooksData(
                [...fetchedBooks, ...books],
                'isbn13'
            )
        )
    }

    return (
        <ScrollView style={{ backgroundColor: '#f8ecdd' }}>
            <View>
                <Appbar.Header theme={ AppBarTheme }>
                    <Appbar.Action
                        icon="home"
                        onPress={Home}
                    />
                    <SearchBar
                        style={{ backgroundColor: '#f8ecdd', flex: 1}}
                        placeholder="Search book"
                        onClearPress={() => {setSearchText('')}}
                        onChangeText={
                            (text) => currentFilteredBooks(text)
                        }
                    />
                    <Appbar.Action
                        icon="plus"
                        onPress={() => {
                            navigation.navigate('AddBook', {
                                books: books,
                                setBooksData: setBooksData
                            });
                        }}
                    />
                </Appbar.Header>
            </View>
           <View>
               {
                   searchText.length < 3 ?
                       <View style={{
                           height: Dimensions.get('screen').height - 200,
                           paddingTop: screenData.isLandscape ? '15%' : '65%',
                           flexDirection:'column',
                           alignItems:'center'
                       }}>
                           <Text style={{fontSize: 20}}>
                               Enter at list 3 letters
                           </Text>
                       </View> :
                   books.length === 0 ?
                       <View style={{
                           height: Dimensions.get('screen').height - 200,
                           paddingTop: screenData.isLandscape ? '15%' : '65%',
                           flexDirection:'column',
                           alignItems:'center'
                       }}>
                           <Text style={{fontSize: 20}}>
                               Books not found
                           </Text>
                       </View> :
                       books.map(( item, index) => {
                       return(
                           <View key={ index }>
                               <TouchableOpacity
                                   onPress={() => {
                                       navigation.navigate('BookInfo', {
                                           Id: item.isbn13,
                                       });
                                   }}
                               >
                                   <View style={{
                                       backgroundColor: '#C78C65',
                                       borderRadius: 30,
                                       flexDirection: 'row',
                                       margin: 10,
                                   }}>
                                       <View>
                                           <Image
                                               resizeMode="cover"
                                               source={{uri : item.image}}
                                               style={{
                                                   borderRadius: 30,
                                                   height: 200,
                                                   width: 140
                                               }}
                                           />
                                       </View>
                                       <View style={{
                                            width: screenData.isLandscape ? '100%' : '70%',
                                            marginLeft: '3%'
                                       }}>
                                           <Text style={{
                                               flex: 0,
                                               width: screenData.isLandscape ? '100%' : '55%',
                                               fontSize: 18,
                                               marginBottom: 10,
                                               marginTop: 10,
                                               textAlign: 'left',
                                           }}>
                                               {
                                                   item.title.length >= 43 ?
                                                       item.title.slice(0, 43 - 1) + '…' :
                                                       item.title
                                               }
                                           </Text>
                                           <Text style={{
                                               flex: 0,
                                               width: screenData.isLandscape ? '100%' : '55%',
                                               fontSize: 15,
                                               marginBottom: 10,
                                               marginTop: 10,
                                               textAlign: 'left',
                                           }}>
                                               {

                                                   item.subtitle.length === 0 ?
                                                       'The best book to improve your programming skills' :
                                                       item.subtitle.length >= 50 ?
                                                           item.subtitle.slice(0, 50 - 1) + '…' :
                                                           item.subtitle
                                               }
                                           </Text>
                                           <Text style={{
                                               position: 'absolute',
                                               bottom: 0,
                                               marginBottom: '5%'
                                           }}>
                                               Price: {
                                                item.price.length === 0 || item.price === 'Priceless' ?
                                                    'Priceless' :
                                                    item.price.split('$')[1] === undefined ?
                                                        '$' + item.price :
                                                        '$' + item.price.split('$')[1]
                                               }
                                           </Text>
                                       </View>
                                       <TouchableHighlight
                                           style={{
                                           position: "absolute",
                                           right: 0,
                                           width: screenData.isLandscape ? '10%' : '13%',
                                           height: '100%',
                                           borderBottomRightRadius: screenData.isLandscape ? 25 : 30,
                                           borderTopRightRadius: screenData.isLandscape ? 25 : 30,
                                           backgroundColor: '#511f1d' }}
                                           onPress={() => { deleteBookFromData(item.isbn13) }}>
                                           <View>
                                               <Icon
                                                   onPress={() => { deleteBookFromData(item.isbn13) }}
                                                   style={[{
                                                       color: '#f8ecdd',
                                                       flex: 0,
                                                       marginTop: screenData.isLandscape ? '120%' : '165%',
                                                       alignSelf: 'center',
                                                   }]}
                                                   size={25}
                                                   name={'trash'}
                                               />
                                           </View>
                                       </TouchableHighlight>
                                   </View>
                               </TouchableOpacity>
                           </View>
                       )
                   })
               }
           </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffe1ff',
        flex: 1,
        justifyContent: 'center',
        flexDirection:'column',
        alignItems:'center'
    },
    txt: {
        fontSize: 20
    },
});

export default Books
