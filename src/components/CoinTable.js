import React from 'react'
import { Table, TableBody } from 'material-ui/Table'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';
import CoinRow from './CoinRow'
import CoinDetail from './CoinDetail'
import io from 'socket.io-client';


class CoinTable extends React.Component {

	constructor(props) {
		super(props)
		this.state = { open: false, symbol: ""}
		this.handleScroll = this.handleScroll.bind(this)
		this.handleCellClick = this.handleCellClick.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.socket = io.connect('https://coincap.io');
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
    	window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll(event) {
		if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500))
			this.props.fetchData()
	}

	handleCellClick(row,column,event)
	{
		if(column !== 1)
			return
		this.setState({
			open: true,
			symbol: event.target.innerHTML
		})
	}

	handleClose() {
		this.setState({
			open: false,
			symbol: ""
		})
	}

	render() {
		const actions = [
	      <FlatButton
	        label="Close"
	        primary={true}
	        onClick={this.handleClose}
	      />
	    ]

		let index = 0;
	    let rows = []
	    for(var c in this.props.coins) {
			var coin = this.props.coins[c]
			rows.push(<CoinRow key = {coin.symbol} coin = {coin} index = {++index} socket = {this.socket} />)
		}

		return <div>
					<MuiThemeProvider>
						<Table style = {{backgroundColor: "transparent", color: "#fff", fontFamily: "Times"}} onCellClick= {this.handleCellClick}>
							
							<TableBody>
									{ rows }
							</TableBody>
						</Table>					
					</MuiThemeProvider>
					<MuiThemeProvider>
						<Dialog
								  style = {{height: "600px"}}
						          open={this.state.open}
						          actions={actions}
						        >
						          <CoinDetail symbol = {this.state.symbol}/>
				        </Dialog>
					</MuiThemeProvider>
				</div>
	}
}

export default CoinTable