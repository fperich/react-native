import React, { Component } from 'react';
import {
	View, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage
} from 'react-native';

export default class HomeScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null
		}


	}

	async login() {
		var APPID = '323285108099652';

		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(APPID, {
			permissions: ['public_profile', 'email'], // public_profile, email, user_friends
			behavior: 'web' // web, native, browser, system (only web is permitted in Expo)
		});

		if (type === 'success') {

			// Get the user's name using Facebook's Graph API
			const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
			const user = await response.json()

			this.setState({
				user
			});
		}
	}

	testAgain() {
		this.setState({
			user: null
		});
	}

	renderUserInfo() {
		console.log('this.state.user', this.state.user);

		const user = this.state.user;
		const picture = user.picture.data.url;

		return (
			<View style={{ alignItems: 'center' }}>
				<Image source={{ uri: picture }} style={{ width: 200, height: 200 }} />
				<Text style={styles.name}>{user.name}</Text>

				<Text style={styles.button} onPress={() => this.testAgain()}>
					Let's test it agagin
        		</Text>
			</View>
		)
	}

	render() {

		return (
			<View style={styles.container} >
				{
					!this.state.user ?
						<TouchableOpacity onPress={() => this.login()}>
							<Image source={require('./assets/images/facebook.png')} />
						</TouchableOpacity>
					:
						this.renderUserInfo()
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
	name: {
		fontSize: 20
	},
	button: {
		marginTop: 50,
		padding: 10,
		justifyContent: "center",
		color: 'blue',
		fontSize: 20
	}
});
