import PokerTable from './PokerTable'
import User from '../Data/User'

class PokerPlayer{

    constructor( socketio,gameSocket ){
        this.socketio = socketio;
        this.gameSocket = gameSocket;
        this.currentTable = undefined;
        this.currentSeat = undefined;
        this.user = undefined;

        gameSocket.on('disconnect', this.disconnectFromTable);
        gameSocket.on('leaveTable', this.disconnectFromTable);

        gameSocket.on('createTable', this.createTable);
        gameSocket.on('joinTable', this.joinActiveTable);
        gameSocket.on('sitTable', this.sitTable);
        gameSocket.on('foldTable', this.foldTable);
        gameSocket.on('checkTable', this.checkTable);
        gameSocket.on('raiseTable', this.raiseTable);
        gameSocket.on('betTable', this.betTable);
        gameSocket.on('callTable', this.callTable);


    }

}

joinActiveTable = data =>{

    this.disconnectFromTable();
    var{tableId} = data;

    var tableRoom = this.socketio.sockets.adapter.roms.get(tableId);

    var table = activeTables[tableId];

    if ( tableRoom === undefined || table === undefined ){
        this.gameSocket.emit('status', 'Unknown poker table')
        ReadableStreamDefaultController
    }

}