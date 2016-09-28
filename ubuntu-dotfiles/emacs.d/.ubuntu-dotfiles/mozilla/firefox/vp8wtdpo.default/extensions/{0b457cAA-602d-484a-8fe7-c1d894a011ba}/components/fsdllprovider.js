//********************************************************************************************************
// FireShot - Webpage Screenshots and Annotations
// Copyright (C) 2007-2016 Evgeny Suslikov (evgeny@suslikov.ru)
//********************************************************************************************************

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function FSDLLProvider() {
	this.wrappedJSObject = this;
}

FSDLLProvider.prototype = {
	classID				: Components.ID("{4266AF1E-981D-11E1-9D7B-0B916188709B}"),
	classDescription	: "FireShot Launcher",
	QueryInterface		: XPCOMUtils.generateQI([]),
	launchFunctionPtr 	: null,
	wrappedCB			: null,
	inited				: false,


	runInBrowserCallback: function(topic, url) {
		var alert = function(data) {
			Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).
				showAlertNotification("chrome://mozapps/skin/downloads/downloadIcon.png", "FireShot", data, false, "", null, "");
		};

		topic = topic.readString();
		url = url.readString();

		var data = Components.classes['@screenshot-program.com/FSObserverData;1'].getService().wrappedJSObject,
			observerService =
				Components.classes["@mozilla.org/observer-service;1"].
				getService(Components.interfaces.nsIObserverService),
			enumerator = observerService.enumerateObservers(topic);

		data.isProcessed = false;

		while (enumerator.hasMoreElements()) {
			var observer = enumerator.getNext().QueryInterface(Components.interfaces.nsIObserver);
			observer.observe(data, topic, url);
		}
	},

	launchFunctionW: function(func, param1, param2, param3) {
		if (this.launchFunctionPtr)
			return this.launchFunctionPtr(func + "", param1 + "", param2 + "", param3 + "");
		else throw "sss.dll was not initialized properly";
	},

	initObserver: function() {

		var Observer = {
			observe : function(subject, topic, data)
			{
				if (topic == "xpcom-will-shutdown")
				{
					try {
						var myComponent = Components.classes['@screenshot-program.com/FSDLLProvider;1'].getService().wrappedJSObject;
						myComponent.done();
					} catch (anError) {
							//alert("ERROR: " + anError.message);
					}
				}
			}
		};

		var observerService =
			Components.classes["@mozilla.org/observer-service;1"].
			getService(Components.interfaces.nsIObserverService);

		observerService.addObserver(Observer, "xpcom-will-shutdown", false);
	},

	init: function(libraryPath) {
		if (!this.inited) {
			Components.utils.import("resource://gre/modules/ctypes.jsm");

			var lib = null;

			try {
				lib = ctypes.open(libraryPath);
			}
			catch (x) {
				// The cause might be in the missing xmllite.dll
				try {
					// Forcing xmllite.dll to be loaded from the package
					var xmllitePath = String(libraryPath).replace("sss.dll", "xmllite.dll");
					ctypes.open(xmllitePath);
					lib = ctypes.open(libraryPath);
				}
				catch (x) {
					lib = ctypes.open("sss.dll");
				}
			}

			this.launchFunctionPtr = lib.declare("_cTypesLaunchFunctionW", ctypes.winapi_abi,
				ctypes.int,
				ctypes.jschar.ptr,
				ctypes.jschar.ptr,
				ctypes.jschar.ptr,
				ctypes.jschar.ptr);

			var runInBrowserProcType = ctypes.FunctionType(ctypes.stdcall_abi, ctypes.void_t, [ctypes.char.ptr, ctypes.jschar.ptr]).ptr,
				setupCB = lib.declare("_cTypesSetupMozillaCallback", ctypes.winapi_abi, ctypes.void_t, runInBrowserProcType);

			this.wrappedCB = runInBrowserProcType(this.runInBrowserCallback);
			if (setupCB) setupCB(this.wrappedCB);

			this.initObserver();
			this.inited = true;
		}
	},

	done: function() {
		if (this.launchFunctionPtr) {
			this.launchFunctionW("cleanupLibrary", "", "", "");
			this.launchFunctionW = null;
		}

		observerService.removeObserver(Observer, "xpcom-will-shutdown");
	}
};

var components = [FSDLLProvider];
if ("generateNSGetFactory" in XPCOMUtils)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);  // Firefox 4.0 and higher
else
  var NSGetModule = XPCOMUtils.generateNSGetModule(components);    // Firefox 3.x
