import React from 'react'
import Coin from '../model/Coin'
import CoinTable from './CoinTable'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Table, TableRow, TableHeader, TableHeaderColumn } from 'material-ui/Table'
import AppBar from 'material-ui/AppBar'
import '../styles/App.css'

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			isLoading: false,
			start: 50,
			limit: 50,
			coins: {}
		}
		if (window.innerWidth > 767)
			this.fetchData = this.fetchData.bind(this)
	}

	componentDidMount() {
		this.fetchData();
		window.onresize = () => {
			this.setState({})
		}
	}

	fetchData() {
		let { isLoading, start, limit } = this.state
		if (isLoading)
			return
		this.setState({isLoading:true});
		fetch("http://coincap.io/front")
		.then((response) => response.json())
		.then((response) => {
			let coins = []
			response.slice(0,start).forEach((coin) => {
				coins[coin.short] = new Coin(coin)
			})
			start += limit
			isLoading = false
			this.setState({coins, isLoading, start})
		}).catch(function(error) {
		  console.log('There has been a problem with your fetch operation: ', error.message);
		});
	}

	render() {
		const styles = {
			background: "url(http://img.moneycontrol.co.in/images/terminal/bodyBg.jpg)",
			position: "fixed"
		}

		if (window.innerWidth <= 767) {
			return <div>Device not supported currently.</div>
		}

		return <div>
					<div style = {{height: "122px"}}>
						<MuiThemeProvider>
							<AppBar title="CoinTracker" showMenuIconButton = {false} style = {styles}/>
						</MuiThemeProvider>
						<MuiThemeProvider>
							<Table style = {{backgroundColor: "#090e14", color: "#fff", fontFamily: "Times", position: "fixed", top: "64px"}} onCellClick= {this.handleCellClick}>
								<TableHeader displaySelectAll = {false} adjustForCheckbox = { false } fixedHeader = {true}>
							      <TableRow>
							      	<TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>#</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Name</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Symbol</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Market Cap</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Price</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Circulating Supply</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>Voulme</TableHeaderColumn>
							        <TableHeaderColumn style = {{color: "#fff", fontWeight: 600}}>%24h</TableHeaderColumn>
							      </TableRow>
							    </TableHeader>
						    </Table>
					    </MuiThemeProvider>
					</div>
					<CoinTable fetchData = {this.fetchData} coins = {this.state.coins} />
				</div>
	}
}

export default App;