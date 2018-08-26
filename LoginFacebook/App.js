import React, { Component } from 'react';
import { 
	View, Alert, Button, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage
} from 'react-native';

export default class HomeScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null
		}
	}

	componentDidMount(){
		var self = this;

		AsyncStorage.getItem('fbtoken').then((result) => self.token = result )

		AsyncStorage.getItem('user').then((result) => self.setState({ user: result}))
			
	}

	async login() {
		var APPID = '323285108099652';

		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(APPID, {
			permissions: ['public_profile', 'email', 'user_friends'], // public_profile, email, user_friends
			behavior: 'system' // web, native, browser, system
		});

		if (type === 'success') {
			AsyncStorage.setItem('fbtoken', token);

			// Get the user's name using Facebook's Graph API
			const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

			const user = (await response.json())
			console.log('user', user);
			
			AsyncStorage.setItem('user', JSON.stringify(user));

			this.setState({
				user: user
			});
		}
	}
	
	render() {
		return (
			<View style={styles.container} >
				{
					this.state.user === null ?
						<TouchableOpacity onPress={ () => this.login() }>
					      	<Image source={require('./assets/images/facebook.png')} />
					    </TouchableOpacity>
					:
						<View>
							<Text>Welcome { this.state.user.name }!</Text>							
						</View>
				}
			</View>
		);
	}
}

var styles = StyleSheet.create({
		container: {
			padding: 30,
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#F5FCFF",
		},
		button: {
			padding: 10,
			justifyContent: "center",
			backgroundColor: "#FF0000",
			borderColor: '#0000FF',
			borderWidth: 1,
    		borderRadius: 10,
		}
});
