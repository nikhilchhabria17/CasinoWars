const SUITS=["♦","♣","♥","♠"]
const VALUES=["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
let balance=parseInt(document.getElementById("Balance").text.substring(5,));
	
export default class Deck
{			
	constructor(cards=freshDeck())
	{
		this.cards=cards;		
	}
	getbalance()
	{
		return balance
	}
	Win()
	{			
		let bid=parseInt(document.getElementById("Bid").value);
		if(bid<balance)
		{
		console.log("Win"+bid)
		balance+=bid;
		let flag=1;
				fetch('/update', { 
				method: 'POST', 
				body: JSON.stringify({ balance,flag}),
				headers: {'Content-Type': 'application/json'}
				});		
		}
	}
	Lose()
	{		
		let bid=parseInt(document.getElementById("Bid").value);
		if(bid<balance)
		{
		console.log("lose"+bid)
		balance-=bid;
		let flag=1;
					fetch('/update', { 
				method: 'POST', 
				body: JSON.stringify({ balance,flag}),
				headers: {'Content-Type': 'application/json'}
				});		
		}
	}
	get numberOfCards()
	{
		return this.cards.length
	}
	pop()
	{
		return this.cards.shift()
	}
	shuffle()
	{
			for(let i=this.numberOfCards-1;i>0;i--)
			{
				const newIndex=Math.floor(Math.random()*(i+1))
				const oldValue=this.cards[newIndex]
				this.cards[newIndex]=this.cards[i]
				this.cards[i]=oldValue								
			}
	}
}
class Card
{
	constructor(suit,value)
	{
		this.suit=suit;
		this.value=value;
	}
	get color()
	{
		return this.suit=="♣"||this.suit=="♠"?"black":"red";	
	}
	
	getHTML()
	{
		const cardiv=document.createElement('div')
		cardiv.innerText=this.suit
		cardiv.classList.add("card",this.color)
		cardiv.dataset.value=`${this.value} ${this.suit}`
		return cardiv
	}
}
function freshDeck()
{
	return SUITS.flatMap(suit=>
	{
		return VALUES.map(value=>
		{
			return new Card(suit,value);
		})
	})
}

