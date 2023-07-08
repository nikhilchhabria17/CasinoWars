import Deck from "./deck.js"

const computercardslot=document.querySelector(".computer-card-slot")
const playercardslot=document.querySelector(".player-card-slot")
const t=document.querySelector(".text")
const bal=document.querySelector(".bal")
const play=document.querySelector(".playbtn")

const CARD_VALUE_MAP=
{
	"2":2,
	"3":3,
	"4":4,
	"5":5,
	"6":6,
	"7":7,
	"8":8,
	"9":9,
	"10":10,
	"J":11,
	"Q":12,
	"K":13,
	"A":14,
	
}

let computerCard,playerCard,dDeck,inround
play.addEventListener('click',()=>
{
	let data=document.getElementById("Bid").value;
	let bid=parseInt(document.getElementById("Bid").value);
	let balance=parseInt(document.getElementById("Balance").text.substring(5,));
		
		if(balance<bid||data=="Bid");
		else{
		if(inround)
		{
			play.innerText="Play"
			cleanBeforeRound()
		}
		else
		{
			play.innerText="Shuffle"

			flipcards()
		}
	}
})
StartGame()
function StartGame()
{
	const deck=new Deck()
	deck.shuffle()
	dDeck=deck.cards
	computercardslot.appendChild(deck.cards[0].getHTML())
playercardslot.appendChild(deck.cards[1].getHTML())

	cleanBeforeRound()
}
function cleanBeforeRound()
{
		inround=false
		computercardslot.innerHTML=''
		playercardslot.innerHTML=''
		t.innerText=''
		
}
function flipcards()
{
	const deck=new Deck()
	inround=true	
	computerCard=dDeck.pop()
	playerCard=dDeck.pop()	
	playercardslot.appendChild(playerCard.getHTML())
	computercardslot.appendChild(computerCard.getHTML())	
	if(isRoundWinner(computerCard,playerCard)==0)
	{
		t.innerText="Draw"
	}
	else if(isRoundWinner(computerCard,playerCard)==1)
	{
		t.innerText="You Lose"
		deck.Lose()
	}
	else
	{
		t.innerText="You Win"
		deck.Win()		
	}	
	bal.innerHTML="Bal:₹"+deck.getbalance()+"";
	bal.setAttribute("value",deck.getbalance()+"");
}

function isRoundWinner(cardOne,cardTwo)
{
	const deck=new Deck()
	deck.shuffle()
	dDeck=deck.cards
	if(CARD_VALUE_MAP[cardOne.value]==CARD_VALUE_MAP[cardTwo.value])
		return 0;
	return CARD_VALUE_MAP[cardOne.value]>CARD_VALUE_MAP[cardTwo.value]?1:2;
}