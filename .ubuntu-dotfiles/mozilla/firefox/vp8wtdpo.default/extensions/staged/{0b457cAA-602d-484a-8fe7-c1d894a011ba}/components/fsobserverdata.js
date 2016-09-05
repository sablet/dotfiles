//********************************************************************************************************
// FireShot - Webpage Screenshots and Annotations
// Copyright (C) 2007-2016 Evgeny Suslikov (evgeny@suslikov.ru)
//********************************************************************************************************

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function FSObserverData() { 
	this.wrappedJSObject = this; 
}

FSObserverData.prototype = {
	classID: Components.ID("{8998EE52-98FD-11E1-8C2D-B1F16088709B}"),
	QueryInterface: XPCOMUtils.generateQI(),
	isProcessed: false
};

var components = [FSObserverData];
if ("generateNSGetFactory" in XPCOMUtils)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);  // Firefox 4.0 and higher
else
  var NSGetModule = XPCOMUtils.generateNSGetModule(components);    // Firefox 3.x
