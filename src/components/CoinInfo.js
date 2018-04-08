import React from 'react'
import Coin from '../model/Coin'
import CoinTable from './CoinTable'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import '../styles/App.css'

class CoinInfo extends React.Component {

	constructor() {
		super();
		this.state = {
			isLoading: false,
			start: 0,
			limit: 50,
			coins: []
		}
		this.fetchData = this.fetchData.bind(this)
	}

	componentDidMount() {
		this.fetchData();
		this.timer = setInterval(() => this.refreshData(), 5000)
	}

	componentWillUnMount() {
		clearInterval(this.timer)
	}

	refreshData() {
		let { isLoading, start } = this.state
		if (isLoading)
			return
		fetch("https://api.coinmarketcap.com/v1/ticker/?start="+0+"&limit="+this.state.coins.length)
		.then((response) => response.json())
		.then((response) => {
			var coins = response.map((item) => new Coin(item))
			isLoading = false
			this.setState({coins, isLoading, start})
		}).catch(function(error) {
		  console.log('There has been a problem with your fetch operation: ', error.message);
		});
	}

	fetchData() {
		let { isLoading, start, limit } = this.state
		if (isLoading)
			return
		this.setState({isLoading:true});
		fetch("https://api.coinmarketcap.com/v1/ticker/?start="+start+"&limit="+limit)
		.then((response) => response.json())
		.then((response) => {
			var coins = response.map((item) => new Coin(item))
			start += limit
			isLoading = false
			const totalCoins = this.state.coins.concat(coins)
			this.setState({coins : totalCoins, isLoading, start})
		}).catch(function(error) {
		  console.log('There has been a problem with your fetch operation: ', error.message);
		});
	}

	render() {
		const styles = {
			background: "url(http://img.moneycontrol.co.in/images/terminal/bodyBg.jpg)",
			position: "fixed"
		}

		return <div>
					<div style = {{height: "64px"}}>
						<MuiThemeProvider>
							<AppBar title="CoinTracker" showMenuIconButton = {false} style = {styles}/>
						</MuiThemeProvider>
					</div>
					<CoinTable fetchData = {this.fetchData} coins = {this.state.coins} />
				</div>
	}
}

export default CoinInfo;