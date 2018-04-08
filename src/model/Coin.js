class Coin {

    constructor(coin) {
	    this.name = coin.long
	    this.symbol = coin.short
	    this.price_usd = parseFloat(coin.price)
        this.market_cap_usd = coin.mktcap
        this.available_supply = coin.supply
        this.percent_change_24h = coin.cap24hrChange
        this.volume = coin.usdVolume
    }
    // "24h_volume_usd": "", 
    // "market_cap_usd": "", 
    // "available_supply": "", 
    // "total_supply": "", 
    // "max_supply": "", 
    // "percent_change_1h": "", 
    // "percent_change_24h": "", 
    // "percent_change_7d": "", 
    // "last_updated": ""
}

export default Coin;