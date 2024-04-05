import React from "react";
import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import Deck from "./Deck"
import './Play.css'
import { useActionData } from "react-router-dom"
import Countdown from "react-countdown"





const socket = io.connect(import.meta.env.VITE_BACKENDIP)

class Card{
    constructor(suit,value){
        this.suit = suit
        this.value = value
    }

    get color() {
        return this.suit === '♠' || this.suit === '♣' ? 'black' : 'red'
    }

    getHTML(){
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.value
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.suit}`
        return cardDiv
    }

}

function Cards (props){

    var color = "red";

    if ( props.suit == '♠' || props.suit == '♣' ){
        color = "black"
    }

    return (
        <div className={"card " + color} data-value={props.suit}>{props.value}</div>
    );

}

export default function Play(){
    
    const [ loggedIn, setLoggedIn ] = useState("");
    const [ room, setRoom ] = useState("");
    const [ roomNumber, setRoomNumber ] = useState("");

    const [ player , setPlayer ] = useState({id: "", name: "", pozitia: "", chips: 0});
    const [ game, setGame ] = useState({P1Id: "", P2Id: "", P1Name: "", P2Name: "", P1Chips: 0, P2Chips: 0, gameStatus: "-", currentPlayer: "", P1Bet: 0, P2Bet: 0, Pot: 0})

    const [ cards, setCards ] = useState([]);
    const [ oppCards, setOppCards ] = useState([]);
    const [ comCards, setComCards ] = useState([]);
    const [ BetAmount, setBetAmount ]= useState(0);
    const [ messageP1, setMessageP1] = useState("");
    const [ messageP2, setMessageP2] = useState("");
    
    var verificat = 1;
    var verificatp1 = 1;
    var verificatp2 = 1;
    
    useEffect( () => {
        if ( loggedIn != true){
            const recipeUrl = import.meta.env.VITE_BACKENDIP+'/verify_password';
            const requestData = {
                method: 'GET',
                credentials: "include",
            };
            fetch(recipeUrl, requestData)
                .then( res => res.json() )
                .then( json => {
                    if ( json.loggedIn == true ){
                        setPlayer( c => ({...c, name: json.user[0].full_name, id: json.user[0].id, chips: json.user[0].chips}));
                        setLoggedIn(true);  
                    }
                });
            }
    });
    

    socket.on('add_data', (pos,name,chips,pchips,id1,id2,pname) =>{

        if ( player.name == name )
            setPlayer( c => ({...c, pozitia: pos}));
        if ( pos == 1)
            setGame( c => ({...c, P1Id: id1, P1Chips: chips, P1Name: name}));
        if ( pos == 2)
            setGame( c => ({...c, P1Id: id1, P1Chips: pchips, P1Name: pname, P2Id: id2, P2Chips: chips, P2Name: name}));

    });

    socket.on('room_is_full', () => {
        alert("Room is full!");
    });

    const joinRoom = () => {
        if ( room != "" ){
            console.log(room);
            socket.emit("join_room", player.id,room,player.name,player.chips);
            setRoomNumber(room);
        }
        
    }

    const leaveRoom = () => {

        if ( player.pozitia == 1 ){
            setGame( c=> ({...c, P1Chips: 0, P1Name: "", P1Id: "", P2Chips: 0, P2Name: "", P2Id: ""}));
            setCards([]);
            setComCards([]);
        }
        if ( player.pozitia == 2 ){
            setGame( c=> ({...c, P2Chips: 0, P2Name: "", P2Id: "", P1Chips: 0, P1Name: "", P1Id: ""}));
            setCards([]);
            setComCards([]);
        }

        socket.emit("leave_room", player.id,room,player.pozitia);
        
        setRoomNumber("");
        setRoom("");
        
    }

    const startGame = () => {

        socket.emit("start_game", room,player.id);
        verificat = 0;
        verificatp1 = 0;
        verificatp2 = 0;

    }

    socket.on('startTheGame' , (C1, C2, cine) => {

        setComCards([]);
        setCards([]);
        setOppCards([]);
        setMessageP1("");
        setMessageP2("");
        setCards([{key: 1, value: C1.value, suit: C1.suit},{key: 2, value: C2.value, suit: C2.suit}]);
        setBetAmount(3);
        
        if ( game.P1Id == cine )
            setGame( c=> ({...c, currentPlayer: cine, P1Chips: game.P1Chips-1, P2Chips: game.P2Chips-2, P1Bet: 1, P2Bet: 2, Pot: 3, gameStatus: "preflop"}));
        if ( game.P2Id == cine )
            setGame( c=> ({...c, currentPlayer: cine, P1Chips: game.P1Chips-2, P2Chips: game.P2Chips-1, P1Bet: 2, P2Bet: 1, Pot: 3, gameStatus: "preflop"}));

    });

    const FoldHand = () => {
        
        socket.emit("folded", room,player.id);

    }

    const CheckHand = () => {

        socket.emit("check", room, player.id);
        
    }

    const CallHand = () => {

        socket.emit("call", room, player.id);

    }

    const BetHand = () => {
        
        socket.emit("bet", room, player.id, BetAmount);

    }

    socket.on('next_turn', (id, p1chips, p1bet, p2chips, p2bet, pot, status) => {
        
        setGame( c=> ({...c, currentPlayer: id, P1Chips: p1chips, P1Bet: p1bet, P2Chips: p2chips, P2Bet: p2bet, Pot: pot, gameStatus: status}));

    });

    socket.on('round_folded', ( p1chips, p2chips ) =>{

        setGame( c=> ({...c, gameStatus:"-", currentPlayer: 0, P1Chips: p1chips, P2Chips: p2chips}));

    });

    socket.on('round_over', ( p1chips, p2chips ) =>{

        setGame( c=> ({...c, currentPlayer: 0, P1Chips: p1chips, P2Chips: p2chips}));

    });
    
    socket.on('set_com_cards', (C1, C2, C3, C4, C5) => {

        setComCards([{key: 1, value: C1.value, suit: C1.suit},{key: 2, value: C2.value, suit: C2.suit},{key: 3, value: C3.value, suit: C3.suit},{key: 4, value: C4.value, suit: C4.suit},{key: 5, value: C5.value, suit: C5.suit}]);

    });

    socket.on('opp_cards', (c1v, c1s, c2v, c2s, pot) => {

        setGame( c=> ({...c, gameStatus: "showdown", p1bet: 0, p2bet: 0, Pot: pot}));
        setOppCards([{key: 1, value: c1v, suit: c1s}, {key: 2, value: c2v, suit: c2s}]);
        
        if ( room && player.id && verificat == 0){
            verificat = 1;
            socket.emit("choose_winner", room, player.id);
        }

    });

    socket.on('showdown', (message, id) => {

        if (  game.P1Id == id && verificatp1 == 0 ){
            verificatp1 = 1;
            if ( game.P1Id == id )
                setMessageP1(message);
            if ( player.id == id )
                socket.emit("give_chips", room, player.id);
        }

        if (  game.P2Id == id && verificatp2 == 0 ){
            verificatp2 = 1;
            if ( game.P2Id == id )
                setMessageP2(message);
            if ( player.id == id )
                socket.emit("give_chips", room, player.id);
        }
        

    });

    var player_1_cards_slot = null;                                                                                 // PLAYER 1 CARDS
    if ( roomNumber ){
        var ceva = [];
        if ( player.pozitia == 1 )
            ceva = cards;
        if ( player.pozitia == 2 )
            ceva = oppCards;
        player_1_cards_slot =   <div className="player1-cards card-slot">
                                    {ceva.map( (card) => {
                                        return <Cards  key = {card.key}
                                                suit = {card.suit}
                                                value = {card.value} />;
                                    })}
                                </div>;

        if ( player.pozitia == 1 && cards.length == 0 ){
            player_1_cards_slot = <div className="player1-cards card-slot"> 
                                    <img className="oppCards" src="../images/cardback.png"></img>
                                    <img className="oppCards" src="../images/cardback.png"></img>
                                </div>;
        }

        if ( player.pozitia == 2 && oppCards.length == 0 ){
            player_1_cards_slot = <div className="player1-cards card-slot"> 
                                    <img className="oppCards" src="../images/cardback.png"></img>
                                    <img className="oppCards" src="../images/cardback.png"></img>
                                </div>;
        }
    }

    var player_2_cards_slot = null;                                                                                 // PLAYER 2 CARDS
    if ( roomNumber ){
        var ceva = [];
        if ( player.pozitia == 2 )
            ceva = cards;
        if ( player.pozitia == 1 )
            ceva = oppCards; 
        player_2_cards_slot =   <div className="player2-cards card-slot">
                                    {ceva.map( (card) => {
                                        return <Cards  key = {card.key}
                                                       suit = {card.suit}
                                                       value = {card.value} />;
                                    })}
                                </div>;

    if ( player.pozitia == 2 && cards.length == 0 ){
        player_2_cards_slot = <div className="player2-cards card-slot"> 
                                <img className="oppCards" src="../images/cardback.png"></img>
                                <img className="oppCards" src="../images/cardback.png"></img>
                            </div>;
    }
    if ( player.pozitia == 1 && oppCards.length == 0 ){
        player_2_cards_slot = <div className="player2-cards card-slot"> 
                                <img className="oppCards" src="../images/cardback.png"></img>
                                <img className="oppCards" src="../images/cardback.png"></img>
                            </div>;
    }
    }

    var com_cards = <div className="community-cards"></div>;                                                        // COMMUNITY CARDS
    var game_phase = 0;
    if ( roomNumber ){
        if ( game.gameStatus == "flop" || game.gameStatus == "showdown" )
            game_phase = 3;
        if ( game.gameStatus == "turn" || game.gameStatus == "showdown" )
            game_phase = 4;
        if ( game.gameStatus == "river" || game.gameStatus == "showdown" )
            game_phase = 5;
        com_cards = <div className="community-cards">
                        {comCards.map( (card) => {
                            if ( card.key <= game_phase ){
                                return <Cards key = {card.key}
                                            suit = {card.suit}
                                            value = {card.value} />;
                            }
                        })}
                    </div>
    }

    var bet_slider = null;                                                                                          // ACTION BUTTONS
    var fold_button = null;
    var check_call_button = null;                                                                                    
    var bet_button = null;
    if ( roomNumber && player.id == game.currentPlayer && game.gameStatus != "showdown" ){
        var min_bet = 0;
        var max_bet = 0;
        if ( game.P1Bet == "CHECK" && game.P2Bet != "CHECK" ){
            min_bet = 2;
            max_bet = Math.min(+game.P1Chips, +game.P2Chips + +game.P2Bet);
        }
        if ( game.P1Bet != "CHECK" && game.P2Bet == "CHECK" ){
            min_bet = 2;
            max_bet = Math.min(+game.P1Chips+ +game.P1Bet, +game.P2Chips);
        }
        if ( game.P1Bet != "CHECK" && game.P2Bet != "CHECK" ){
            min_bet = Math.max(+game.P1Bet + +1,+game.P2Bet + +1,BetAmount,2);
            max_bet = Math.min(+game.P1Chips + +game.P1Bet, +game.P2Chips + +game.P2Bet);
        }
        bet_slider = <div className="box">
                         <input id="amount" className="range__amount" type="text" min={0} max={max_bet} value={BetAmount} onChange={(e)=>setBetAmount(e.target.value)}></input>
                         <div className="slider"> 
                            <input type="range" className="slider_range" min={0} max={max_bet} value={BetAmount} onChange={(e)=>setBetAmount(e.target.value)}></input> 
                         </div> 
                    </div>;
        fold_button = <div className="action-buttons fold" onClick={FoldHand}>FOLD</div>;
        if ( ( game.P1Bet == 0 || game.P1Bet == "CHECK" ) && ( game.P2Bet == 0 || game.P2Bet == "CHECK" ) ){
            check_call_button = <div className="action-buttons call" onClick={CheckHand}>CHECK</div>;
        }
        else{
            check_call_button = <div className="action-buttons call" onClick={CallHand}>CALL</div>;
        }
        if ( BetAmount >= min_bet && BetAmount <= max_bet )
            bet_button = <div className="action-buttons bet" onClick={BetHand}>BET</div>;
    }
    
    return(

        
        <div className="play--table">
            <div className="room-number">Room {roomNumber}</div>
            
            {roomNumber ? null : <input className="join-room-text" placeholder='room number' onChange={ (event) => { setRoom(event.target.value); }}></input> } 
            {roomNumber ? null : <button className="join-room-button" onClick={joinRoom}>Join</button> }
            {roomNumber ? ( (game.gameStatus==="-" || game.gameStatus==="showdown") ? <button className="leave-room-button" onClick={leaveRoom}>Leave room</button> : null ) : null }
    
            {roomNumber? ( (game.gameStatus==="-" || game.gameStatus==="showdown") ? <button className="start-game-button" onClick={startGame}>Start Joc</button> : null ) : null }

            {/* {roomNumber ? <div className="player1-name p1-name"></div> : null } */}
            {player_1_cards_slot}
            {roomNumber ? ( game.gameStatus==="showdown" ? <div className="message">{messageP1}</div> : null ) : null }
            {roomNumber ? <div className="player1-chips chips">CHIPS: {game.P1Chips} BET: {game.P1Bet}</div> : null }
            {roomNumber ? <div className="text-pot">POT: {game.Pot}</div> : null }
            {com_cards}
            {roomNumber ? <div className="player2-chips chips">CHIPS: {game.P2Chips} BET: {game.P2Bet}</div> : null }
            {player_2_cards_slot}
            {/* {roomNumber ? <div className="player2-name p2-name"></div> : null } */}

            {/* {roomNumber? ( currentPlayer === true? <div className="countdown">{counter}</div> : null ) : null } */}
            {roomNumber ? ( game.gameStatus==="showdown" ? <div className="message">{messageP2}</div> : null ) : null }
            {bet_slider}
            {fold_button}
            {check_call_button}
            {bet_button}
            

        </div>

    )
}