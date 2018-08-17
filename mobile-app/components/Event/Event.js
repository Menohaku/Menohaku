import React from 'react'
import moment from 'moment'
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    ScrollView,
    Linking
} from 'react-native'
import HTMLView from 'react-native-htmlview'
import MapView, { Marker, UrlTile } from 'react-native-maps'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold'
    }

})
 class Chat extends React.Component {
    static navigationOptions = {
        title: 'Event'
    };
    constructor(props) {
        super(props)
        this.state = {
            urlTemplate: 'https://cdn.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}.png',
            width: 124,
            height: 134,
            mapsize: 200
        }
        this.openLink = this.openLink.bind(this)
    }

    openLink() {
        Linking.openURL(this.props.data.info_url.fi)
    }
    layoutChange = () => {
        const { width, height } = Dimensions.get('window')
        const mapsize = Math.min(width, height) * 0.8
        console.log('Layout', width, height)
        this.setState({ width, height, mapsize })
    }
    replaceHTMLTags = (string) => {
        if (string) {
            let s = string
            s = s.replace(/<p>/g, '').replace(/<\/p>/g, '\n')
            return s
        }
        return false
    }
    render() {
        const start_time = moment(new Date(this.props.data.start_time)).format('D.M.YYYY') + ' ' + (new Date(this.props.data.start_time)).toLocaleTimeString().substring(0, 5)
        let endDate = ''
        if ((new Date(this.props.data.start_time)).getDate() !== (new Date(this.props.data.end_time)).getDate()) {
            endDate = (new Date(this.props.data.end_time)).toLocaleDateString() + ' '
        }
        const end_time = endDate + (new Date(this.props.data.end_time)).toLocaleTimeString().substring(0, 5)
        const description = (this.props.data.description && this.props.data.description.fi) ? this.props.data.description.fi : this.props.data.description && this.props.data.description.fi
        const short_description = this.props.data.short_description ? this.props.data.short_description.fi : ''
        let locationFound
        let latitude
        let longitude
        if (this.props.data.location && this.props.data.location.position) {
            locationFound = true
            latitude = this.props.data.location.position.coordinates[1]
            longitude = this.props.data.location.position.coordinates[0]
        }
        return (
            <View className="event" style={styles.container} onLayout={this.layoutChange}>
                <Button title="Palaa hakutuloksiin"
                    onPress={() => {
                        Expo.Speech.stop()
                        this.props.back()
                    }}
                />
                <View style={{
                    width: '100%',
                    backgroundColor: '#efefef'
                }}
                >
                    <Text style={{ padding: 15 }}>
                        <Text style={styles.header}>
                            { this.props.data.name.fi || '' }
                        </Text>
                        {
                            `\nPaikka: ${ this.props.data.location && this.props.data.location.street_address && this.props.data.location.street_address.fi}`
                            
                        }
                        {', '}
                        {
                            this.props.data.location && this.props.data.location.postal_code
                        }
                        {' '}
                        {
                            this.props.data.location && this.props.data.location.address_locality && this.props.data.location.address_locality.fi
                        }
                        {
                            `\nAika: ${start_time} - ${end_time}`
                        }
                        {this.props.data.offers && this.props.data.offers.length > 0 &&this.props.data.offers && '\nHinta'}
                        {
                            this.props.data.offers && this.props.data.offers.length > 0 && !this.props.data.offers[0].is_free &&this.props.data.offers.map((offer) => {
                                 
                                return `\n${offer.price && offer.price.fi && offer.price.fi}`
                            })
                        }
                        {
                            this.props.data.offers && this.props.data.offers.length > 0 && this.props.data.offers[0].is_free && '\nTapahtuma on ilmainen'
                        }
                    </Text>
                    {
                        (this.props.data.info_url && this.props.data.info_url.fi) &&
                        <View style={{ marginBottom: 20 }}>
                            <Button title="Linkki" onPress={this.openLink} />
                        </View>
                    }{
                        this.props.speech === 1 &&
                        <Button
                            title="Lue"
                            onPress={() => {
                                return Expo.Speech.speak(description ? description.replace(/<[^>]+>/g, '') :
                                    'Tapahtumalle ei löydy kuvausta', { language: 'fi' })
                            }}
                        />
                    }
                </View>
                <ScrollView>
                    <View>
                        <Image />
                        <HTMLView value={description ? description : 'Tapahtumalle ei löydy kuvausta'} style={{padding: 15}}/>
                        <Text style={{ padding: 15 }}>
                            {
                                '\nAvainsanat: \n'
                            }
                            {
                                this.props.data.keywords && this.props.data.keywords.map((keyword) => {
                                    return keyword.name && `${keyword.name.fi}, `
                                })
                            }
                        </Text>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            { locationFound &&
                            <MapView
                                style={{
                                    padding: 20,
                                    height: this.state.mapsize,
                                    width: this.state.mapsize
                                }}
                                initialRegion={{
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.0012,
                                    longitudeDelta: 0.0011
                                }}
                                region={this.state.region}
                                onRegionChange={this.onRegionChange}
                                mapType="none"
                                provide={null}
                                gestureHandling="cooperative"
                            >
                                <UrlTile urlTemplate={this.state.urlTemplate} />
                                <Marker
                                    title={this.props.data.name.fi || ''}
                                    coordinate={{
                                        latitude,
                                        longitude
                                    }}
                                />
                            </MapView>}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = (store) => {
    return {
        speech: store.speech
    }
}

export default connect(mapStateToProps, null)(Chat)
