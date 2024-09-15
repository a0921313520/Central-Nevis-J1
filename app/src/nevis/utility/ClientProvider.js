export class ClientProvider {
	static instance;
	_client;
  
	constructor() {
	  if (!ClientProvider.instance) {
		ClientProvider.instance = this;
	  }
	  return ClientProvider.instance;
	}
  
	static getInstance() {
	  if (!ClientProvider.instance) {
		ClientProvider.instance = new ClientProvider();
	  }
  
	  return ClientProvider.instance;
	}
  
	get client() {
	  return this._client;
	}
  
	set client(value) {
	  this._client = value;
	}
  }
  