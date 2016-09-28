/*
 * allinonegest.js
 * For licence information, read licence.txt
 *
 * event handling and scrollwheel navigation for Mouse Gestures Suite
 *
 */
"use strict";

Components.utils.import("chrome://mgsuite/content/MGStorage.jsm");

if (typeof mgsuite == 'undefined') {
  var mgsuite = {};
}

mgsuite.overlay = {
  
  // variables for mouse gestures
  aioContent: null,
  aioRendering: null,
  aioTabRendering: null,
  aioMainWin: null,
  aioStatusBar: null,
  aioLastStatusMsg: "",
  aioBlockActionStatusMsg: null,
  aioIsWin: null,
  aioIsMac: null,
  aioIsNix: null,
  aioFirstInit: true,
  aioGrid: null, // minimal gesture has to be 'grid' pixels long
  drawnGestInfo: true,
  aioDelay: 1000, // delay before aborting gesture ('timeout' in prefs)
  aioDelayTO: null,
  aioGestInProgress: false,
  aioOldX: null,
  aioOldY: null, // old coords from previous gesture stroke
  aioGestStr: null,
  aioUnknownStr: null,
  aioCurrGest: null,
  aioRockerString: null,
  aioGesturesEnabled: null,
  aioStrokes: [],
  aioLocaleGest: [],
  aioShortGest: [],
  aioLastEvtTime: null, // time of last gesture stroke
  aioOnImage: null, // contains an image DOM node
  aioSrcEvent: null, // event which started the active gesture
  aioIsRocker: false,
  aioBundle: null, // String bundle for localized strings
  aioShowContextMenu: null,
  aioGestEnabled: null,
  aioRockEnabled: null,  // prefs ....
  aioTrailEnabled: null,
  aioTrailColor: null,
  aioTrailSize: null,
  aioSmoothTrail: null,
  aioWheelEnabled: null,
  aioScrollEnabled: null,
  aioNoScrollMarker: null,
  aioStartOnLinks: null,
  aioWhatAS: null,
  aioASEnabled: null,
  aioTabSwitching: null,
  aioRockMode: null,
  aioWheelMode: null,
  aioHistIfDown: null,
  aioSpecialCursor: null,
  aioLeftDefault: null,
  aioPreferPaste: null,
  aioNoAltWithGest: null,
  aioSingleNewWindow: null,
  aioOpenLinkInNew: null,
  aioPanToAS: null,
  aioReverseScroll: null,
  aioShowTitletip: null,
  aioTTHover: null,
  aioShiftForTitle: null,
  aioTitleDelay: null,
  aioTitleDuration: null,
  aioScrollAlaAcrobat: null,
  aioNextsString: null,
  aioPrevsString: null,
  aioGestButton: null,
  aioActionString: null,
  aioFuncString: null,
  aioWheelRocker: null,
  aioGoUpInNewTab: null,
  aioNoHorizScroll: null,
  aioRockerAction: [],
  aioRockMultiple: [],
  aioTrustAutoSelect: null,
  aioDisableClickHeat: null,
  aioCrispResize: null,
  aioFxV18: null,
  aioWindowType: null,
  aioIsFx: false,
  aioDefNextSearch: null,
  aioDefPrevSearch: null,
  aioTabFocusHistory: [],
  aioGestureTab: null,  // contains reference to tab if gesture was performed on a tab
  aioSiteList: [],  // list of sites for enabling/disabling gestures
  aioSitePref: null,  // D for disabled gestures, P for gestures priority
  aioPrevParsedURL: null,

  // global variables for rocker gesture
  aioDownButton: null,
  aioBackRocking: null,
  aioRockTimer: null,
  aioRepet: [],
  aioWheelBothWays: null,

  // global variables for wheel navigation
  aioTabPU: null,
  aioHistPU: null,
  aioTTPU: null,
  aioTabCount: null,
  aioTabSrc: null,
  aioCCW: null,
  aioTTTimer: null,
  aioTTShown: false,
  aioTTNode: null,

  aioScrollRate: null,
  aioScrollMax: null,
  aioASPeriod: null,
  aioSofar: null,
  aioLastX: null,
  aioLastY: null,
  aioScrollFingerFree: null,
  aioAcceptASKeys: false,
  autoscrollInterval: null,
  aioScroll: null,
  aioOverlay: null,
  aioMarker: null,
  aioMarkerX: null,
  aioMarkerY: null,
  aioInitStarted: false,
  aioGrabTarget: null,
  aioScrollMode: null,
  aioBeingUninstalled: false,
  aioPrefObserverTimeout: null,
  aioPrefObserverDisabled: false,

  aioPrefRoot: null,
  aioPref: null,
  aioPbi: null,

  // used to prevent infinite loop when mgsuite.overlay.aioStdPrefListener called itself on changing pref
  aioIgnoreStdPrefListener: false,

  

  aioStartUp: function() {
    // rocker gesture buttons
    mgsuite.const.aioOpp = [mgsuite.const.RMB, mgsuite.const.NoB, mgsuite.const.LMB, mgsuite.const.NoB];

    // wheel navigation imgs
    mgsuite.const.aioBackURL = mgsuite.const.CHROME_DIR + "back.png";
    mgsuite.const.aioNextURL = mgsuite.const.CHROME_DIR + "next.png";
    
    // variables for autoscroll
    mgsuite.const.aioMarkerSize = 28;
    mgsuite.const.aioHalfMarker = mgsuite.const.aioMarkerSize / 2;
    mgsuite.const.aioMarkers = [mgsuite.const.CHROME_DIR + "autoscroll_all.png", mgsuite.const.CHROME_DIR + "autoscroll_v.png", mgsuite.const.CHROME_DIR + "autoscroll_h.png"];
    mgsuite.const.aioMarkerIds = ["aioscrollerNSEW", "aioscrollerNS", "aioscrollerEW"];
    mgsuite.const.aioDist =  [0, 20, 40, 60, 80, 100, 130, 180, 300, 5000];
    //mgsuite.const.aioRatio = [.0, .067, .083, .108, .145, .2, .3, .45, .65, .9];
    mgsuite.const.aioRatio = [.0, .067, .083, .108, .160, .24, .45, .85, 1.55, 2.2];
    
    mgsuite.const.aioScrollLoop = [1, 2, 4];
    mgsuite.const.aioCursors = ["move", "n-resize", "e-resize"];
    mgsuite.const.aioASBasicPeriod = 40;

    

    var aioPrefService = Components.classes["@mozilla.org/preferences-service;1"]
                         .getService(Components.interfaces.nsIPrefService);
    mgsuite.overlay.aioPrefRoot = aioPrefService.getBranch(null); // prefs: root node
    mgsuite.overlay.aioPref = aioPrefService.getBranch("allinonegest."); // prefs: AiO node
    mgsuite.overlay.aioPbi = mgsuite.overlay.aioPrefRoot.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
    mgsuite.overlay.aioPbi.addObserver(mgsuite.overlay.aioStdPrefListener.domain1, mgsuite.overlay.aioStdPrefListener, false); //set Pref observer on "general"
    mgsuite.overlay.aioPbi.addObserver(mgsuite.overlay.aioStdPrefListener.domain2, mgsuite.overlay.aioStdPrefListener, false); // and mousewheel
    mgsuite.overlay.aioPbi.addObserver(mgsuite.overlay.aioStdPrefListener.domain3, mgsuite.overlay.aioStdPrefListener, false); // and middlemouse

    try {
      Components.utils.import("resource://gre/modules/AddonManager.jsm");
      AddonManager.addAddonListener(mgsuite.overlay.aioUninstallListener);
    }
    catch (err) {}

    var isActive, prefNotExisting;
    try {
      isActive = mgsuite.overlay.aioPref.getBoolPref("isActive");
      prefNotExisting = false;
    }
    catch(err) {
      isActive = false;
      prefNotExisting = true;
    }
    
    try {
      if (!isActive) {
         mgsuite.overlay.aioPref.setBoolPref("isActive", true);
         if (prefNotExisting) mgsuite.overlay.aioPref.setBoolPref("savedAutoscroll", true); // active or not? Suppose active & autoScroll was true
       else mgsuite.overlay.aioPref.setBoolPref("savedAutoscroll", mgsuite.overlay.aioPrefRoot.getBoolPref("general.autoScroll")); // not active case
    }
    }
    catch (err) {}

    // Now that isActive and savedAutoScroll have been set, we can add the observer on AioG prefs
    mgsuite.overlay.aioPbi.addObserver(mgsuite.overlay.aioPrefListener.domain, mgsuite.overlay.aioPrefListener, false); //set Pref observer on "allinonegest"

    mgsuite.overlay.aioInit();
  },
  
  // Preferences observers
  aioPrefListener: {
    domain: "allinonegest.",
    observe: function(subject, topic, prefName) { // when AiO pref was changed, reinit
      if (topic != "nsPref:changed" || mgsuite.overlay.aioPrefObserverDisabled) return;
      mgsuite.overlay.reInit();
    }
  },
  
  reInit: function() {
    // run mgsuite.overlay.aioInit() delayed and only once because it can be called
    // multiple times in a short period by pref observer
    if (mgsuite.overlay.aioPrefObserverTimeout) {
      clearTimeout(mgsuite.overlay.aioPrefObserverTimeout);
    }

    mgsuite.overlay.aioPrefObserverTimeout = setTimeout(function() {
      //dump("reInit runs mgsuite.overlay.aioInit()\n");
      mgsuite.overlay.aioInit();
    }, 300);
  },
  
  getSessionStore: function() {
    if (typeof SessionStore != 'undefined') {
      // this global doesn't exist in SM
      return SessionStore;
    }
    let cs = mgsuite.overlay.aioIsFx
          ? Components.classes["@mozilla.org/browser/sessionstore;1"]
          : Components.classes["@mozilla.org/suite/sessionstore;1"];
    return cs.getService(Components.interfaces.nsISessionStore);
  },
  
  aioStdPrefListener: {
    domain1: "general.",
    domain2: "mousewheel.withnokey.",
    domain3: "middlemouse.",
    observe: function(subject, topic, prefName) {
      if (topic != "nsPref:changed") return;
      mgsuite.overlay.aioStdPrefChanged();
    }
  },
  
  aioShutdownListener: {
    observe: function(subject, topic, data) {
      if (topic != "quit-application") return;
      if (mgsuite.overlay.aioBeingUninstalled) mgsuite.overlay.aioUninstallCleanUp();
    }
  },
  
  aioUninstallListener: {
    onUninstalling: function(addon) {
      if (addon.id == mgsuite.const.GUID) {
        mgsuite.overlay.aioBeingUninstalled = true;
      }
    },
    onOperationCancelled: function(addon) {
      if (addon.id == mgsuite.const.GUID) {
        mgsuite.overlay.aioBeingUninstalled = false;
      }
    }
  },

  aioWindowUnload: function() {

    function freeObservers() {
      // Don't leak the observers when a window closes
      try {
        mgsuite.overlay.aioPbi.removeObserver(mgsuite.overlay.aioPrefListener.domain, mgsuite.overlay.aioPrefListener);
        mgsuite.overlay.aioPbi.removeObserver(mgsuite.overlay.aioStdPrefListener.domain1, mgsuite.overlay.aioStdPrefListener);
        mgsuite.overlay.aioPbi.removeObserver(mgsuite.overlay.aioStdPrefListener.domain2, mgsuite.overlay.aioStdPrefListener);
        mgsuite.overlay.aioPbi.removeObserver(mgsuite.overlay.aioStdPrefListener.domain3, mgsuite.overlay.aioStdPrefListener);

        Components.utils.import("resource://gre/modules/AddonManager.jsm");
        AddonManager.removeAddonListener(mgsuite.overlay.aioUninstallListener);
      }
      catch(err) {}
    }

    function getNumberOfOpenWindows(windowType) {
      var count = 0;
      var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
                    .getService(Components.interfaces.nsIWindowMediator);

      var windowIter = wm.getEnumerator(windowType);
      while (windowIter.hasMoreElements()) {
        count++;
        windowIter.getNext();
      }
    return count;
    }

    function isLastBrowserWindow() {
      return getNumberOfOpenWindows("navigator:browser") == 0;
    }

    function installQuitObserver() {
      try {
        var observerService = Components.classes["@mozilla.org/observer-service;1"]
                              .getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(mgsuite.overlay.aioShutdownListener, "quit-application", false);
      }
    catch (err) {}
    }

    freeObservers();
    if (isLastBrowserWindow()) installQuitObserver();
  },

  aioUninstallCleanUp: function() {
    // AiOG is being uninstalled. Set isActive to false and restore std prefs that were overriden.
    // Since pref observers were freed on unload, mgsuite.overlay.aioInit & aioStdPrefChanged will not be called.

    mgsuite.overlay.aioPref.setBoolPref("isActive", false);
    mgsuite.overlay.aioPrefRoot.setBoolPref("general.autoScroll", mgsuite.overlay.aioPref.getBoolPref("savedAutoscroll"));
  },

  aioStdPrefChanged: function(force) {
    if (mgsuite.overlay.aioIgnoreStdPrefListener) {
      return;
    }
    mgsuite.overlay.aioIgnoreStdPrefListener = true; // prevent infinite loop

    try {
      if (mgsuite.overlay.aioGestButton == mgsuite.const.MMB) {
        // always disable native autoscroll when middle button gestures
        mgsuite.overlay.aioPrefRoot.setBoolPref("general.autoScroll", false);
        
      } else if (mgsuite.overlay.aioPrefRoot.getBoolPref("general.autoScroll") != (mgsuite.overlay.aioASEnabled && mgsuite.overlay.aioWhatAS == 1)) {
        mgsuite.overlay.aioPrefRoot.setBoolPref("general.autoScroll", mgsuite.overlay.aioASEnabled && mgsuite.overlay.aioWhatAS == 1);
      }
    }
    catch(err) {}
    
    try {
      mgsuite.overlay.aioPreferPaste = mgsuite.overlay.aioPrefRoot.getBoolPref("middlemouse.paste");
    }
    catch(err) {mgsuite.overlay.aioPreferPaste = false;}

    mgsuite.overlay.aioIgnoreStdPrefListener = false;
  },

  aioCreateStringBundle: function(propFile) {
    try {
      var strBundleService =  Components.classes["@mozilla.org/intl/stringbundle;1"].getService(). 
                                QueryInterface(Components.interfaces.nsIStringBundleService);
      return strBundleService.createBundle(propFile);
    }
    catch(err) {return null;}
  },

  aioGetStr: function(str) {
    if (mgsuite.overlay.aioBundle) {
      try {
        return mgsuite.overlay.aioBundle.GetStringFromName(str);
      } catch (err) {
        return "?";
      }
    }
    return "";
  },

  aioGetLocalizedStrings: function() {
    mgsuite.overlay.aioBundle = mgsuite.overlay.aioCreateStringBundle(mgsuite.const.LOCALE_PROPERTIES);
    mgsuite.overlay.aioShortGest["R"] = mgsuite.overlay.aioGetStr("abbreviation.right");
    mgsuite.overlay.aioShortGest["L"] = mgsuite.overlay.aioGetStr("abbreviation.left");
    mgsuite.overlay.aioShortGest["U"] = mgsuite.overlay.aioGetStr("abbreviation.up");
    mgsuite.overlay.aioShortGest["D"] = mgsuite.overlay.aioGetStr("abbreviation.down");
    mgsuite.overlay.aioGestStr = mgsuite.overlay.aioGetStr("g.gesture");
    mgsuite.overlay.aioUnknownStr = mgsuite.overlay.aioGetStr("g.unknown");
    mgsuite.overlay.aioDefNextSearch = mgsuite.overlay.aioGetStr("g.nextTerm");
    mgsuite.overlay.aioDefPrevSearch = mgsuite.overlay.aioGetStr("g.prevTerm");
  },

  aioInit: function() { // overlay has finished loading or a pref was changed
    //dump("mgsuite.overlay.aioInit\n");
    var titleDelay, titleDuration;
    const delayTable = [250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 4000];
    const durationTable = [2000, 3000, 4000, 5000, 6000, 7000, 8000];

    if (!mgsuite.overlay.aioInitStarted) {
       mgsuite.overlay.aioInitStarted = true;
       mgsuite.overlay.aioGetLocalizedStrings();
    }

    var XULAppInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                  .getService(Components.interfaces.nsIXULAppInfo);

    if (XULAppInfo.ID != '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}') {  // SM id
      mgsuite.overlay.aioIsFx = true;  // if false, then SM
    }

    // detect window type
    switch (String(document.location)) {
      case "chrome://navigator/content/navigator.xul":
      case "chrome://browser/content/browser.xul":
       mgsuite.overlay.aioWindowType = "browser";
        break;

      case "chrome://global/content/viewSource.xul":
      case "chrome://global/content/viewPartialSource.xul":
        mgsuite.overlay.aioWindowType = "source";
        break;

      case "chrome://messenger/content/messenger.xul":
      case "chrome://messenger/content/messageWindow.xul":
        mgsuite.overlay.aioWindowType = "messenger";
        break;

      case "chrome://messenger/content/messengercompose/messengercompose.xul":
        mgsuite.overlay.aioWindowType = "mailcompose";
        break;

      default:
        mgsuite.overlay.aioWindowType = null;
    }


    // read prefs or set Defaults
    var prefFuncs = [ // get pref value, set default value, check value range
     [function(){mgsuite.overlay.aioActionString=mgsuite.overlay.aioPref.getCharPref("gestureString");}, function(){mgsuite.overlay.aioPref.setCharPref("gestureString",mgsuite.default.gestureString);}, function(){return !mgsuite.overlay.aioActionString;}],
     [function(){mgsuite.overlay.aioFuncString=mgsuite.overlay.aioPref.getCharPref("functionString");}, function(){mgsuite.overlay.aioPref.setCharPref("functionString",mgsuite.default.functionString);}, function(){return !mgsuite.overlay.aioFuncString;}],
       [function(){mgsuite.overlay.aioRockerString=mgsuite.overlay.aioPref.getCharPref("rockerString");}, function(){mgsuite.overlay.aioPref.setCharPref("rockerString",mgsuite.default.rockerString);}, function(){return !mgsuite.overlay.aioRockerString;}],
     [function(){mgsuite.overlay.aioGestButton=mgsuite.overlay.aioPref.getIntPref("mousebuttonpref");}, function(){mgsuite.overlay.aioPref.setIntPref("mousebuttonpref",mgsuite.const.RMB);}, function(){return mgsuite.overlay.aioGestButton<0||mgsuite.overlay.aioGestButton>2;}],
     [function(){mgsuite.overlay.aioGestEnabled=mgsuite.overlay.aioPref.getBoolPref("mouse");}, function(){mgsuite.overlay.aioPref.setBoolPref("mouse",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioTrailEnabled=mgsuite.overlay.aioPref.getBoolPref("gestureTrails");}, function(){mgsuite.overlay.aioPref.setBoolPref("gestureTrails",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioTrailColor=mgsuite.overlay.aioPref.getCharPref("trailColor");}, function(){mgsuite.overlay.aioPref.setCharPref("trailColor","#009900");}, function(){return false;}],
     [function(){mgsuite.overlay.aioTrailSize=mgsuite.overlay.aioPref.getIntPref("trailSize");}, function(){mgsuite.overlay.aioPref.setIntPref("trailSize",3);}, function(){return mgsuite.overlay.aioTrailSize<1||mgsuite.overlay.aioTrailSize>12;}],
     [function(){mgsuite.overlay.aioSmoothTrail=mgsuite.overlay.aioPref.getBoolPref("smoothTrail");}, function(){mgsuite.overlay.aioPref.setBoolPref("smoothTrail",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioGrid=mgsuite.overlay.aioPref.getIntPref("grid");}, function(){mgsuite.overlay.aioPref.setIntPref("grid",10);}, function(){return mgsuite.overlay.aioGrid<3 || mgsuite.overlay.aioGrid>50;}],
     [function(){mgsuite.overlay.aioDelay=mgsuite.overlay.aioPref.getIntPref("timeout");}, function(){mgsuite.overlay.aioPref.setIntPref("timeout",1000);}, function(){return mgsuite.overlay.aioDelay<200 || mgsuite.overlay.aioDelay>3000;}],
     [function(){mgsuite.overlay.drawnGestInfo=mgsuite.overlay.aioPref.getBoolPref("drawnGestInfo");}, function(){mgsuite.overlay.aioPref.setBoolPref("drawnGestInfo",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioRockEnabled=mgsuite.overlay.aioPref.getBoolPref("rocking");}, function(){mgsuite.overlay.aioPref.setBoolPref("rocking",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioWheelEnabled=mgsuite.overlay.aioPref.getBoolPref("wheelscrolling");}, function(){mgsuite.overlay.aioPref.setBoolPref("wheelscrolling",true);}, function(){return false;}], // Scroll wheel navigation
     [function(){mgsuite.overlay.aioASEnabled=mgsuite.overlay.aioPref.getBoolPref("autoscrolling2");}, function(){mgsuite.overlay.aioPref.setBoolPref("autoscrolling2",true);}, function(){return false;}], // Middle button scrolling
     [function(){mgsuite.overlay.aioTabSwitching=mgsuite.overlay.aioPref.getBoolPref("tabBar");}, function(){mgsuite.overlay.aioPref.setBoolPref("tabBar",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioWhatAS=mgsuite.overlay.aioPref.getIntPref("autoscrollpref");}, function(){mgsuite.overlay.aioPref.setIntPref("autoscrollpref",1);}, function(){return mgsuite.overlay.aioWhatAS<0||mgsuite.overlay.aioWhatAS>3;}],
     [function(){mgsuite.overlay.aioScrollRate=mgsuite.overlay.aioPref.getIntPref("autoscrollRate");}, function(){mgsuite.overlay.aioPref.setIntPref("autoscrollRate",2);}, function(){return mgsuite.overlay.aioScrollRate<0||mgsuite.overlay.aioScrollRate>2;}],
     [function(){mgsuite.overlay.aioNoScrollMarker=mgsuite.overlay.aioPref.getBoolPref("autoscrollNoMarker");}, function(){mgsuite.overlay.aioPref.setBoolPref("autoscrollNoMarker",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioWheelMode=mgsuite.overlay.aioPref.getIntPref("wheelpref2");}, function(){mgsuite.overlay.aioPref.setIntPref("wheelpref2",0);}, function(){return mgsuite.overlay.aioWheelMode<0||mgsuite.overlay.aioWheelMode>3;}],
     [function(){mgsuite.overlay.aioHistIfDown=mgsuite.overlay.aioPref.getBoolPref("wheelHistoryIfCw");}, function(){mgsuite.overlay.aioPref.setBoolPref("wheelHistoryIfCw",true);}, function(){return false;}],
     [function(){mgsuite.overlay.showTabsPopup=mgsuite.overlay.aioPref.getBoolPref("showTabsPopup");}, function(){mgsuite.overlay.aioPref.setBoolPref("showTabsPopup",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioRockMode=mgsuite.overlay.aioPref.getIntPref("rockertypepref");}, function(){mgsuite.overlay.aioPref.setIntPref("rockertypepref",1);}, function(){return mgsuite.overlay.aioRockMode<0||mgsuite.overlay.aioRockMode>1;}],
     [function(){mgsuite.overlay.aioSpecialCursor=mgsuite.overlay.aioPref.getBoolPref("autoscrollCursor");}, function(){mgsuite.overlay.aioPref.setBoolPref("autoscrollCursor",false);}, function(){return false;}],
     [function(){mgsuite.overlay.autoscrollContinue=mgsuite.overlay.aioPref.getBoolPref("autoscrollContinue");}, function(){mgsuite.overlay.aioPref.setBoolPref("autoscrollContinue",false);}, function(){return false;}],
     [function(){mgsuite.overlay.autoscrollSpeed=parseFloat(mgsuite.overlay.aioPref.getCharPref("autoscrollSpeed"));}, function(){mgsuite.overlay.aioPref.setCharPref("autoscrollSpeed",1);}, function(){return isNaN(mgsuite.overlay.autoscrollSpeed);}],
     [function(){mgsuite.overlay.aioNoAltWithGest=mgsuite.overlay.aioPref.getBoolPref("noAltGest");}, function(){mgsuite.overlay.aioPref.setBoolPref("noAltGest",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioLeftDefault=mgsuite.overlay.aioPref.getBoolPref("leftDefault");}, function(){mgsuite.overlay.aioPref.setBoolPref("leftDefault",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioSingleNewWindow=mgsuite.overlay.aioPref.getBoolPref("singleWindow");}, function(){mgsuite.overlay.aioPref.setBoolPref("singleWindow",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioOpenLinkInNew=mgsuite.overlay.aioPref.getBoolPref("openLinkInNew");}, function(){mgsuite.overlay.aioPref.setBoolPref("openLinkInNew",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioGoUpInNewTab=mgsuite.overlay.aioPref.getBoolPref("goUpInNewTab");}, function(){mgsuite.overlay.aioPref.setBoolPref("goUpInNewTab",false);}, function(){return false;}],
      [function(){mgsuite.overlay.aioReverseScroll=mgsuite.overlay.aioPref.getBoolPref("reverseScrolling");}, function(){mgsuite.overlay.aioPref.setBoolPref("reverseScrolling",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioStartOnLinks=mgsuite.overlay.aioPref.getBoolPref("evenOnLink");}, function(){mgsuite.overlay.aioPref.setBoolPref("evenOnLink",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioShowTitletip=mgsuite.overlay.aioPref.getBoolPref("showLinkTooltip");}, function(){mgsuite.overlay.aioPref.setBoolPref("showLinkTooltip",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioTTHover=mgsuite.overlay.aioPref.getBoolPref("TTHover");}, function(){mgsuite.overlay.aioPref.setBoolPref("TTHover",true);}, function(){return false;}],
     [function(){mgsuite.overlay.aioShiftForTitle=mgsuite.overlay.aioPref.getBoolPref("shiftForTitle");}, function(){mgsuite.overlay.aioPref.setBoolPref("shiftForTitle",true);}, function(){return false;}],
     [function(){titleDelay=mgsuite.overlay.aioPref.getIntPref("titleDelay");}, function(){mgsuite.overlay.aioPref.setIntPref("titleDelay",2);}, function(){return titleDelay<0||titleDelay>9;}],
     [function(){titleDuration=mgsuite.overlay.aioPref.getIntPref("titleDuration");}, function(){mgsuite.overlay.aioPref.setIntPref("titleDuration",3);}, function(){return titleDuration<0||titleDuration>6;}],
     [function(){mgsuite.overlay.aioScrollAlaAcrobat=mgsuite.overlay.aioPref.getBoolPref("dragAlaAcrobat");}, function(){mgsuite.overlay.aioPref.setBoolPref("dragAlaAcrobat",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioNoHorizScroll=mgsuite.overlay.aioPref.getBoolPref("noHorizScroll");}, function(){mgsuite.overlay.aioPref.setBoolPref("noHorizScroll",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioTrustAutoSelect=mgsuite.overlay.aioPref.getBoolPref("trustAutoSelect");}, function(){mgsuite.overlay.aioPref.setBoolPref("trustAutoSelect",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioPanToAS=mgsuite.overlay.aioPref.getBoolPref("panning");}, function(){mgsuite.overlay.aioPref.setBoolPref("panning",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioDisableClickHeat=mgsuite.overlay.aioPref.getBoolPref("disableClickHeat");}, function(){mgsuite.overlay.aioPref.setBoolPref("disableClickHeat",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioCrispResize=mgsuite.overlay.aioPref.getBoolPref("crispResize");}, function(){mgsuite.overlay.aioPref.setBoolPref("crispResize",false);}, function(){return false;}],
     [function(){mgsuite.overlay.aioPref.getBoolPref("blankTabNextToCurrent");}, function(){mgsuite.overlay.aioPref.setBoolPref("blankTabNextToCurrent",false);}, function(){return false;}]
    ];

    mgsuite.overlay.aioPrefObserverDisabled = true;

    mgsuite.overlay.aioSiteList = [];
    try {
	  var prefList = mgsuite.overlay.aioPref.getComplexValue("sitesList", Components.interfaces.nsISupportsString);

	  mgsuite.overlay.aioSiteList = JSON.parse(prefList);

    } catch (err) {
	  var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
      str.data = "[]";
      mgsuite.overlay.aioPref.setComplexValue("sitesList", Components.interfaces.nsISupportsString, str);
    }

    for (var i = 0; i < prefFuncs.length; ++i) {
      try {prefFuncs[i][0]();}
      catch(err) {prefFuncs[i][1](); prefFuncs[i][0]()}
      if (prefFuncs[i][2]()) {prefFuncs[i][1](); prefFuncs[i][0]()}
    }


    try {
      mgsuite.overlay.aioNextsString = mgsuite.overlay.aioPref.getComplexValue("nextsString", Components.interfaces.nsISupportsString).data;
    }
    catch(err) {
      var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
      str.data = mgsuite.overlay.aioDefNextSearch;
      mgsuite.overlay.aioNextsString = mgsuite.overlay.aioDefNextSearch;
      mgsuite.overlay.aioPref.setComplexValue("nextsString", Components.interfaces.nsISupportsString, str);
    }

    try {
      mgsuite.overlay.aioPrevsString = mgsuite.overlay.aioPref.getComplexValue("prevsString", Components.interfaces.nsISupportsString).data;
    }
    catch(err) {
      str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
      str.data = mgsuite.overlay.aioDefPrevSearch;
      mgsuite.overlay.aioPrevsString = mgsuite.overlay.aioDefPrevSearch;
      mgsuite.overlay.aioPref.setComplexValue("prevsString", Components.interfaces.nsISupportsString, str);
    }
	
	// read custom getures pref
	mgsuite.overlay.customGestures = [];
    try {
	  let prefStr = mgsuite.overlay.aioPref.getComplexValue("customGestures", Components.interfaces.nsISupportsString);
	  mgsuite.overlay.customGestures = JSON.parse(prefStr);

    } catch (err) {}
    
    if (!Array.isArray(mgsuite.overlay.customGestures)) {
      mgsuite.overlay.customGestures = [];
    }
	
	
    if (mgsuite.overlay.aioNoAltWithGest) mgsuite.overlay.aioLeftDefault = false;
    mgsuite.overlay.aioWheelRocker = mgsuite.overlay.aioWheelMode == 0;

    mgsuite.overlay.aioPrefObserverDisabled = false;


    mgsuite.overlay.aioStdPrefChanged();
    mgsuite.overlay.aioGesturesEnabled = (mgsuite.overlay.aioGestEnabled || mgsuite.overlay.aioRockEnabled || mgsuite.overlay.aioWheelEnabled);
    mgsuite.overlay.aioShowContextMenu = true;

    mgsuite.overlay.aioScrollEnabled = mgsuite.overlay.aioASEnabled && mgsuite.overlay.aioWhatAS != 1;
    const httpProtocolHandler = Components.classes["@mozilla.org/network/protocol;1?name=http"]
                                     .getService(Components.interfaces.nsIHttpProtocolHandler);
    var platform = httpProtocolHandler.platform.toLowerCase();
    var geckoVersion = httpProtocolHandler.misc.match(/rv:([0-9.]+)/)[1];
    var versionComparator = null;
    if ("nsIVersionComparator" in Components.interfaces)
       versionComparator = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                            .getService(Components.interfaces.nsIVersionComparator);
    else
       versionComparator = Components.classes["@mozilla.org/updates/version-checker;1"]
                            .getService(Components.interfaces.nsIVersionChecker);

    const unixRe = new RegExp("unix|linux|sun|freebsd", "i");

    if (mgsuite.overlay.aioFirstInit) {
	  mgsuite.overlay.aioIsWin = false; mgsuite.overlay.aioIsMac = false; mgsuite.overlay.aioIsNix = false;
	  if (platform.indexOf('win') != -1) mgsuite.overlay.aioIsWin = true;
	  else
		if (platform.indexOf('mac') != -1) mgsuite.overlay.aioIsMac = true;
		else mgsuite.overlay.aioIsNix = platform.search(unixRe) != -1;

      mgsuite.overlay.aioFxV18 = versionComparator.compare(geckoVersion, "18.0") >= 0;

	  window.messageManager.loadFrameScript(mgsuite.const.CHROME_DIR + "frame-script.js", true);
	  window.messageManager.addMessageListener("MouseGesturesSuite:CollectLinks", mgsuite.util.CollectLinksListener);
	  window.messageManager.addMessageListener("MouseGesturesSuite:CollectFrame", mgsuite.util.CollectFrameListener);
	  window.messageManager.addMessageListener("MouseGesturesSuite:returnWithCallback", mgsuite.util.returnWithCallback);
	  window.messageManager.addMessageListener("MouseGesturesSuite:displayGesturesList", mgsuite.util.returnWithCallback);
	  window.messageManager.addMessageListener("MouseGesturesSuite:test", mgsuite.util.testListener);
	  
	  switch (mgsuite.overlay.aioWindowType) {
		case 'browser':
		mgsuite.overlay.aioContent = document.getElementById("content");
		mgsuite.overlay.aioRendering = document.getElementById("sidebar-box").parentNode;  // hbox
		mgsuite.overlay.aioTabRendering = document.getElementById("TabsToolbar"); // Fx
		mgsuite.overlay.aioStatusBar = document.getElementById("statusbar-display");
		if (!mgsuite.overlay.aioStatusBar) {
		  mgsuite.overlay.aioStatusBar = gBrowser.getStatusPanel();
		}
  
		mgsuite.overlay.aioContent.tabContainer.addEventListener("TabSelect", mgsuite.imp.aioTabFocus, true);
		var activeId = "t" + mgsuite.imp.aioUnique++;
		if (mgsuite.overlay.aioContent.mTabContainer) {
		  mgsuite.overlay.aioContent.mTabContainer.childNodes[0].setAttribute('aioTabId', activeId);
		  mgsuite.overlay.aioTabFocusHistory.push({focused: activeId});
		}
  
		// listener for url changes
		var urlListener =
		{
		  QueryInterface: function(aIID)
		  {
		    if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
			  aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			  aIID.equals(Components.interfaces.nsISupports))
			  return this;
		    throw Components.results.NS_NOINTERFACE;
		  },
		  onLocationChange: function(aProgress, aRequest, aURI, aFlags)
		  {
		    if (!(aFlags & Components.interfaces.nsIWebProgressListener.LOCATION_CHANGE_SAME_DOCUMENT)) {
			  // don't run this when only URL hash changed or tab switched;
			  // Fx and SM 2.29.1 and later run it even on tab switching.
			  mgsuite.overlay.aioParseSiteList();
			  
			  // we remove mousemove event from content on document load because
			  // for some mysterious reason mousemove registers after dragging site icon
			  // from location bar onto a blank tab and persists, which is not desirable
			  mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:endMouseMove");
			  mgsuite.util.clearCollectedItems();
		    }
		  },
		  onStateChange: function() {},
		  onProgressChange: function() {},
		  onStatusChange: function() {},
		  onSecurityChange: function() {},
		  onLinkIconAvailable: function() {}
		};
  
		gBrowser.addProgressListener(urlListener);
  
		gBrowser.tabContainer.addEventListener("TabSelect", mgsuite.overlay.aioParseSiteList, false);
  
		window.addEventListener("activate", function() {
		  // we need delay because mgsuite.overlay.aioInit() is run with delay after pref change
		  setTimeout(mgsuite.overlay.aioParseSiteList, 600);
		});
		break;
  
		case 'messenger':
		  mgsuite.overlay.aioContent = document.getElementById("messagepane");
		  mgsuite.overlay.aioRendering = document.getElementById("messagepanebox");
		  mgsuite.overlay.aioStatusBar = document.getElementById("statusText");
		break;
  
		case 'mailcompose':
		  mgsuite.overlay.aioContent = document.getElementById("appcontent");
		  mgsuite.overlay.aioRendering = document.getElementById("sidebar-parent");
		  mgsuite.overlay.aioStatusBar = document.getElementById("statusText");
		break;
  
		case 'source':
		  mgsuite.overlay.aioContent = document.getElementById("appcontent");
		  mgsuite.overlay.aioRendering = document.getElementById("content");
		  mgsuite.overlay.aioStatusBar = document.getElementById("statusbar-line-col");
		break;
	  }


	  mgsuite.overlay.aioMainWin = document.getElementById("main-window");
  
	  mgsuite.overlay.aioRendering.addEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
	  if (mgsuite.overlay.aioTabRendering) {
		mgsuite.overlay.aioTabRendering.addEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
	  }
  
	  document.documentElement.addEventListener("popupshowing", mgsuite.overlay.aioContextMenuEnabler, true);
  
	  window.addEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
  
	  if (!mgsuite.overlay.aioIsWin) {
		window.addEventListener("mouseup", function(e) {
		  mgsuite.overlay.aioShowContextMenu = true;
		}, true);
	  }
  
	  window.addEventListener("dragstart", mgsuite.overlay.cancelGestureOnDrag, true);
	  window.addEventListener("unload", mgsuite.overlay.aioWindowUnload, false);
	  window.addEventListener("keydown", mgsuite.overlay.aioKeyPressed, true);
  
	  // init some autoscroll variables
	  mgsuite.overlay.aioSofar = [];
	  mgsuite.overlay.aioSofar[1] = 0;
	  for (var ii = 1; ii < mgsuite.const.aioDist.length - 1; ++ii) {
		 mgsuite.overlay.aioSofar[ii+1] = mgsuite.overlay.aioSofar[ii] + (mgsuite.const.aioDist[ii] - mgsuite.const.aioDist[ii-1]) * mgsuite.const.aioRatio[ii];
	  }
    }

    if (mgsuite.overlay.aioGesturesEnabled) {
      mgsuite.imp.aioInitGestTable();
  
      var rockerFuncs = mgsuite.overlay.aioRockerString.split("|");
      var rFunc;
    
      for (var i = 0; i < rockerFuncs.length; ++i) {
        if (rockerFuncs[i].charAt(0) == "/") {
          // disabled gesture
          mgsuite.overlay.aioRockerAction[i] = {
            callback: function(){void(0);}
          };
          mgsuite.overlay.aioRockMultiple[i] = 0;
        }
        else {
          rFunc = rockerFuncs[i];
           
          if (rFunc.charAt(0) == 'c') {
            // custom function
            var custGestEntry = mgsuite.overlay.getCustomGestureById(rFunc.substr(1));
            mgsuite.overlay.aioRockerAction[i] = {
              callback: custGestEntry
                ? mgsuite.imp.getCustomFunctionCallback(custGestEntry)
                : function() {},
              winTypes: custGestEntry.winTypes
            };
            mgsuite.overlay.aioRockMultiple[i] = "2";
            
          } else {
            // built-in function
            rFunc = rFunc - 0;
            
            if (rFunc < 0 || rFunc >= mgsuite.imp.aioActionTable.length) {
              rockerFuncs[i] = "0";
              rFunc = 0;
            }
            
            mgsuite.overlay.aioRockerAction[i] = {
              callback: mgsuite.imp.aioActionTable[rFunc][0]
            };
            mgsuite.overlay.aioRockMultiple[i] = mgsuite.imp.aioActionTable[rFunc][2];
          }
        }
      }
      
      mgsuite.overlay.aioWheelBothWays = (
           rockerFuncs[2].charAt(0) != "/"
        && rockerFuncs[2].charAt(0) != "c"
        && rockerFuncs[3].charAt(0) != "/"
        && rockerFuncs[3].charAt(0) != "c"
        && 
         (rockerFuncs[2] == rockerFuncs[3]
          || rockerFuncs[2] == mgsuite.imp.aioActionTable[rockerFuncs[3] - 0][3])
      );
    }

    mgsuite.overlay.aioTitleDelay = delayTable[titleDelay];
    mgsuite.overlay.aioTitleDuration = durationTable[titleDuration];
    mgsuite.overlay.aioScrollMax = mgsuite.const.aioScrollLoop[mgsuite.overlay.aioScrollRate];
    mgsuite.overlay.aioASPeriod = mgsuite.const.aioASBasicPeriod / mgsuite.overlay.aioScrollMax;

    mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	mgsuite.overlay.aioBackRocking = false;
	
    if (mgsuite.overlay.aioShowTitletip && mgsuite.overlay.aioTTHover) mgsuite.overlay.aioRendering.addEventListener("mousemove", mgsuite.tooltip.aioShowTitle, true);
    else mgsuite.overlay.aioRendering.removeEventListener("mousemove", mgsuite.tooltip.aioShowTitle, true);

    if (mgsuite.overlay.aioWindowType == "browser") {
      if (mgsuite.overlay.aioTabSwitching) {
        mgsuite.overlay.aioContent.tabContainer.addEventListener("wheel", mgsuite.overlay.aioSwitchTabs, true);
        if (platform.indexOf('linux') != -1) // hack for linux-gtk2 + xft bug
           document.getElementById("navigator-toolbox").addEventListener("wheel", mgsuite.overlay.aioSwitchTabs, true); 
     }
     else {
        mgsuite.overlay.aioContent.tabContainer.removeEventListener("wheel", mgsuite.overlay.aioSwitchTabs, true);
        if (platform.indexOf('linux') != -1)
           document.getElementById("navigator-toolbox").removeEventListener("wheel", mgsuite.overlay.aioSwitchTabs, true);
      }

	  mgsuite.overlay.aioPrevParsedURL = null;
    }

    mgsuite.overlay.aioFirstInit = false;
	mgsuite.overlay.rockerButtonsPressed = 0;
  },
  
  /* Send asyncMessage to frame script - from tab or window depending on window type */
  sendAsyncMessage: function(msgName, data) {
	if (mgsuite.overlay.aioWindowType == 'browser') {
	  gBrowser.selectedBrowser.messageManager.sendAsyncMessage(msgName, data);
	} else {
	  window.messageManager.broadcastAsyncMessage(msgName, data);
	}
  },

  /* Parse site list preferences and determine if current page should be given
   * special treatment (prioritize gestures or disable gestures)
   */
  aioParseSiteList: function() {
    var url = gBrowser.selectedBrowser.currentURI.spec;

    if (url === mgsuite.overlay.aioPrevParsedURL) {
    return;
    }

    mgsuite.overlay.aioPrevParsedURL = url;

    if (url == "about:blank") {
    mgsuite.overlay.aioSitePref = null;
    return;
    }
    var searchUrl, searchUrlEsc, urlRegex, urlToTest, matches;

    var hashPos = url.lastIndexOf('#'); // ignore hash part
    if (hashPos >= 0) {
    // strip hash
    url = url.substr(0, hashPos);
    }

    matches = url.match(/^(\w+:\/\/)?(.*)$/);
    var urlWithoutProtocol = matches[2];

    mgsuite.overlay.aioSitePref = null;

    for (var i=0, len=mgsuite.overlay.aioSiteList.length; i<len; i++) {
    searchUrl = mgsuite.overlay.aioSiteList[i][0];
    var hashPos = searchUrl.indexOf('#');
    if (hashPos >= 0) {
      // strip hash
      searchUrl = searchUrl.substr(0, hashPos);
    }

    // detect protocol (index 1)
    matches = searchUrl.match(/^(\w+:\/\/)?(.*)$/);

    if (matches[2].indexOf('/') < 0 && matches[2].indexOf('*') < 0) {
      // there should be at least 1 slash - append it
      searchUrl += "/";
    }

    if (matches[1]) {
      // has protocol - full comparison
      urlToTest = url;
    } else {
      // no protocol - omit protocol in comparison
      urlToTest = urlWithoutProtocol;
    }

    searchUrlEsc = searchUrl.replace(/([.+?^${}()|\[\]\/\\])/g, "\\$1")
      .replace(/\*/g, '.*');
    urlRegex = new RegExp('^' + searchUrlEsc + '$');

    if (urlRegex.test(urlToTest)) {
      mgsuite.overlay.aioSitePref = mgsuite.overlay.aioSiteList[i][1];
    }
    }
  },

  aioIsKeyOK: function(e) {
     return !(mgsuite.overlay.aioNoAltWithGest && e.altKey)
  },

  aioIsUnformattedXML: function(aDoc) {
    return /\/[\w+]*xml/.test(aDoc.contentType) && aDoc.styleSheets && aDoc.styleSheets.length && aDoc.styleSheets[0].href &&
           aDoc.styleSheets[0].href.substr(-31) == "/content/xml/XMLPrettyPrint.css";
  },

  aioContextMenuEnabler: function(e) {
    //dump("aioContextMenuEnabler: " + mgsuite.overlay.aioShowContextMenu + "; target: " + e.target.nodeName + "; id=" + e.target.id + "\n");
    //dump("ctx: " + e.originalTarget.nodeName + "; id=" + e.originalTarget.id + "\n");
    if (!mgsuite.overlay.aioShowContextMenu && (e.originalTarget.nodeName == "menupopup" || e.originalTarget.nodeName == "xul:menupopup")) {

	  var id = e.originalTarget.id ? e.originalTarget.id : null;
      var explicit = e.explicitOriginalTarget;
  
	  if (id == "contentAreaContextMenu"
		|| (id == "mailContext" && explicit.nodeName != "treechildren")
		|| id == "viewSourceContextMenu"
		|| id == "addonitem-popup"
		|| (mgsuite.overlay.aioIsFx && id == "toolbar-context-menu") // Fx
		|| id == "tabContextMenu" // Fx
		|| e.originalTarget.getAttribute('anonid') == "tabContextMenu" // SM
        || (id == "placesContext" && explicit.nodeName == "treechildren" && explicit.className == "sidebar-placesTreechildren")  // sidebar
        || id == "sidebarPopup"
	  ) {
		
		e.preventDefault(); e.stopPropagation();
	  }
    }
  },

  //debugAllAttr: function(elem) {
  //  var str = "", node;
  //  
  //  for (var i=0; i<elem.attributes.length; i++) {
  //    node = elem.attributes[i];
  //    str += node.nodeName + "=" + node.nodeValue + "; ";
  //  }
  //  return str;
  //},

  aioKeyPressed: function(e) {
    if (mgsuite.overlay.aioAcceptASKeys) mgsuite.overlay.aioAutoScrollKey(e);
    else mgsuite.overlay.aioShowContextMenu = !mgsuite.overlay.aioGestInProgress;
  },

  aioNukeEvent: function(e) {
    e.preventDefault(); e.stopPropagation();
  },

  aioGestMove: function(e) {
	if (e.buttons == 0 && mgsuite.overlay.buttonsPropSupported) {
	  // in some unusual circumstances mouseup may not fire so we end gesture if
	  // mouse is moved with no button pressed
	  mgsuite.overlay.aioKillGestInProgress(true);
	  return;
	}
	
    var x_dir = e.screenX - mgsuite.overlay.aioOldX;
	var absX = Math.abs(x_dir);
    var y_dir = e.screenY - mgsuite.overlay.aioOldY;
	var absY = Math.abs(y_dir);
    var tempMove;

    //only add if movement enough to make a gesture
    if (absX < mgsuite.overlay.aioGrid && absY < mgsuite.overlay.aioGrid) return;
    mgsuite.overlay.aioLastEvtTime = new Date(); // e.timeStamp is broken on Linux

    if (mgsuite.overlay.aioDelayTO) {
	  clearTimeout(mgsuite.overlay.aioDelayTO);
    }
    mgsuite.overlay.aioDelayTO = setTimeout(function() { mgsuite.trail.indicateGestureTimeout() }, mgsuite.overlay.aioDelay);

    mgsuite.trail.drawTrail(e);
    var pente = absY <= 2 ? 100 : absX / absY; // 5 (2?) should be grid/tangent(60)
    if (pente < 0.58 || pente > 1.73) { //between 30° & 60°, wait
      if (pente < 0.58) tempMove = y_dir > 0 ? "D" : "U";
       else tempMove = x_dir > 0 ? "R" : "L";
	   
      if (!mgsuite.overlay.aioStrokes.length || mgsuite.overlay.aioStrokes[mgsuite.overlay.aioStrokes.length-1] != tempMove) {
        mgsuite.overlay.aioStrokes.push(tempMove);
		mgsuite.overlay.aioLocaleGest.push(mgsuite.overlay.aioShortGest[tempMove]);

		var sequence = mgsuite.overlay.aioStrokes.join("");
		var action = mgsuite.imp.getActionData(sequence, mgsuite.overlay.aioWindowType);
		
		if (action) {
		  mgsuite.overlay.aioCurrGest = action.name;
		} else {
		  mgsuite.overlay.aioCurrGest = mgsuite.overlay.aioUnknownStr;
		}
      }
      mgsuite.imp.aioStatusMessage(mgsuite.overlay.aioGestStr + ": " + mgsuite.overlay.aioLocaleGest.join("") + " (" + mgsuite.overlay.aioCurrGest + ")", 0);
    }
    mgsuite.overlay.aioOldX = e.screenX; mgsuite.overlay.aioOldY = e.screenY;
  },

  aioGetHRef: function(node) {
    if (node.hasAttributeNS(mgsuite.const.xlinkNS, "href"))
      return makeURLAbsolute(node.baseURI, node.getAttributeNS(mgsuite.const.xlinkNS, "href"));
    return node.href;
  },

  aioFindLink: function(domNode, gesturing) { // Loop up the DOM looking for a link. Returns the node
    if (!domNode.ownerDocument) return null;
    var stopNode = domNode.ownerDocument.documentElement;
    var nextNode = domNode, currNode, nodeNameLC;
    try {
      do {
        currNode = nextNode;
        if (currNode.namespaceURI == mgsuite.const.xhtmlNS) nodeNameLC = currNode.localName;
        else nodeNameLC = currNode.nodeName.toLowerCase();

        if (nodeNameLC == "img" && !mgsuite.overlay.aioOnImage && gesturing) mgsuite.overlay.aioOnImage = currNode;
        else {
          if (nodeNameLC == "a"  || nodeNameLC == "area" || currNode.hasAttributeNS(mgsuite.const.xlinkNS, "href"))
            if (nodeNameLC == "a" && !currNode.hasAttribute("href")) return null;
              else return currNode;
        }
        nextNode = currNode.parentNode;
      } while (nextNode && currNode != stopNode);
      return null;
    }
    catch(err) {return null;}
  },

  aioIsPastable: function(targetNode) {
    var tag = targetNode.nodeName.toLowerCase();
    return tag == "input" || tag == "textarea" || tag == "textbox";
  },

  aioKillGestInProgress: function(doNotClearCollected) {
    mgsuite.overlay.aioGestInProgress = false;
    if (!doNotClearCollected) {
      mgsuite.util.clearCollectedItems();
    }
    mgsuite.trail.eraseTrail();
    window.removeEventListener("mousemove", mgsuite.overlay.aioGestMove, true);
  },
  
  killGestureOnFlash: function() {
	mgsuite.overlay.aioKillGestInProgress();
	mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:endMouseMove");
	mgsuite.overlay.unBlockMouseEventsForRocker();
	mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
  },

  aioClearRocker: function() {
    mgsuite.overlay.aioRockTimer = null;
    mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	mgsuite.overlay.rockerButtonsPressed = 0;
  },

  aioPerformRockerFunction: function(index) {
    if (mgsuite.overlay.aioRockerAction[index].winTypes) {
      // execute only in defined window types
      if (mgsuite.overlay.aioRockerAction[index].winTypes.indexOf(mgsuite.overlay.aioWindowType) < 0) {
        return;
      }
    }
    
    mgsuite.overlay.aioIsRocker = true;
    try {
      mgsuite.overlay.aioRockerAction[index].callback();
    }
    catch(err) {}
    mgsuite.overlay.aioIsRocker = false;
  },

  aioPrioritizeGestures: function(e) {
    if (mgsuite.overlay.aioSitePref == 'P' && (
      (e.button == mgsuite.const.RMB && ((mgsuite.overlay.aioGestEnabled && mgsuite.overlay.aioGestButton == mgsuite.const.RMB) || mgsuite.overlay.aioRockEnabled || mgsuite.overlay.aioWheelEnabled))
      || (e.button == mgsuite.const.MMB && ((mgsuite.overlay.aioGestEnabled && mgsuite.overlay.aioGestButton == mgsuite.const.MMB) || mgsuite.overlay.aioWheelEnabled || mgsuite.overlay.aioScrollEnabled))
      || (mgsuite.overlay.aioRockEnabled && e.button == mgsuite.const.LMB && mgsuite.overlay.aioDownButton == mgsuite.const.RMB)
      )
    ) {
    e.stopPropagation();

    var prefStr = mgsuite.overlay.aioGetStr("opt.sitePrefP");
    if (mgsuite.overlay.aioBlockActionStatusMsg.indexOf(prefStr) < 0) {
      mgsuite.overlay.aioBlockActionStatusMsg += "<" + prefStr + ">";
    }
    mgsuite.imp.aioStatusMessage(mgsuite.overlay.aioBlockActionStatusMsg, 1000);
    }
  },

  aioMouseDown: function(e) {
    var gesturesEnabled = mgsuite.overlay.aioGesturesEnabled;
	mgsuite.util.clearCollectedItems();

    if (gesturesEnabled) {
	  // detect gesture start on tab
	  mgsuite.overlay.aioGestureTab = null;
  
	  if (mgsuite.overlay.aioWindowType == "browser") {
		var tg = e.originalTarget;
		
		if (tg.nodeName == 'xul:tab'
		   || (tg.nodeName == 'tab' && tg.parentNode.nodeName.indexOf('xul:') == 0)
		   || tg.nodeName == 'xul:hbox'
		   || tg.nodeName == 'xul:label'
		   || tg.nodeName == 'xul:toolbarbutton'
		  ) {
		  // clicked on tab or on element inside tab
		  let elem = tg;
		  
		  do {
			if (elem.nodeName == 'tab' || elem.nodeName == 'xul:tab') {
			  mgsuite.overlay.aioGestureTab = elem;
			  break;
			}
			
			elem = elem.parentNode;
		  } while (elem);
		}
		
		if (mgsuite.overlay.aioGestureTab) {
		  // check if clicked on left or right half of tab
		  mgsuite.overlay.clickedTabHalf = 'R';
		  
		  if (e.screenX < mgsuite.overlay.aioGestureTab.boxObject.screenX + mgsuite.overlay.aioGestureTab.boxObject.width / 2) {
			mgsuite.overlay.clickedTabHalf = 'L';
		  }
		}
	  }
  
  
	  mgsuite.overlay.aioBlockActionStatusMsg = "";
  
	  if (mgsuite.overlay.aioSitePref == 'P') {
		// prioritize gestures - these listeners on document will prevent mouse clicks
		// from reaching it
		var addPrioritizeEvents = function(elem) {
		  elem.addEventListener("mousedown", mgsuite.overlay.aioPrioritizeGestures, true);
		  elem.addEventListener("mouseup", mgsuite.overlay.aioPrioritizeGestures, true);
  
		  if (!mgsuite.overlay.aioIsWin) {
			elem.addEventListener("contextmenu", mgsuite.overlay.aioPrioritizeGestures, true);
		  }
		}
		
		let contentWin = mgsuite.util.getContentWindow(gBrowser.selectedBrowser);
		addPrioritizeEvents(contentWin.document);
  
		var frames = contentWin.frames;
		var framesB, i, j, len, lenB;
  
		for (i=0, len=frames.length; i<len; i++) {
		  addPrioritizeEvents(frames[i]);
  
		  framesB = frames[i].frames;
  
		  for (j=0, lenB=framesB.length; j<lenB; j++) {
			addPrioritizeEvents(framesB[j]);
		  }
		}
  
	  } else if (mgsuite.overlay.aioSitePref == 'D' && !mgsuite.overlay.aioGestureTab) {
		// disable gestures
  
		// sometimes context menu can get disabled in Windows in D mode
		mgsuite.overlay.aioShowContextMenu = true;
  
		if (!mgsuite.overlay.aioGestureTab) {
		  if (e.button != mgsuite.const.LMB || mgsuite.overlay.aioGestButton == mgsuite.const.LMB) {
			mgsuite.overlay.aioBlockActionStatusMsg += "<" + mgsuite.overlay.aioGetStr("opt.sitePrefD") + ">";
			mgsuite.imp.aioStatusMessage(mgsuite.overlay.aioBlockActionStatusMsg, 1000);
		  }
		  gesturesEnabled = false;
		}
	  }
  
	  if (gesturesEnabled) {
		if (mgsuite.overlay.aioDisableClickHeat && mgsuite.overlay.aioWindowType == "browser") {
		  mgsuite.overlay.aioDisableClickHeatEvents(e);
		}
  
		mgsuite.overlay.aioShowContextMenu = false;
		mgsuite.overlay.aioBackRocking = false;
		mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:startMouseMove");
		
		// event.buttons may not be supported on all platforms (like supposedly OS X) so here we need test it
		mgsuite.overlay.buttonsPropSupported = (e.buttons != 0);
	  }
	}

    if (gesturesEnabled && e.button == mgsuite.const.aioOpp[mgsuite.overlay.aioDownButton] && mgsuite.overlay.aioRockEnabled) {
	  // rocker gesture - second click
	  var func;
	  
      if (e.button == mgsuite.const.RMB) {
        if (window.gBrowser && gBrowser.selectedBrowser) {
          var sel = mgsuite.util.getContentWindow(gBrowser.selectedBrowser).getSelection();
          sel.removeAllRanges();
        }
        
        func = 1;
        mgsuite.overlay.aioSrcEvent = e;
        setTimeout(function(){mgsuite.overlay.aioPerformRockerFunction(1);}, 0);
      }
       else {
        e.preventDefault();
        
		func = 0;
		mgsuite.overlay.aioSrcEvent = e;
		mgsuite.overlay.aioPerformRockerFunction(0);
      }
	  
	  mgsuite.overlay.blockMouseEventsForRocker();
	  mgsuite.overlay.rockerButtonsPressed = 2;
	  
	  mgsuite.overlay.aioKillGestInProgress();
	  mgsuite.imp.aioStatusMessage("", 0);
	  mgsuite.overlay.aioContent.removeEventListener("wheel", mgsuite.overlay.aioWheelNav, true);
	  if (!mgsuite.overlay.aioRockMultiple[func] || (mgsuite.overlay.aioRockMultiple[func] == 2 && mgsuite.overlay.aioRockMode == 0)) mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
       else { // multiple ops allowed
		if (mgsuite.overlay.aioRockTimer) {clearTimeout(mgsuite.overlay.aioRockTimer); mgsuite.overlay.aioRockTimer = null;}
		if (mgsuite.overlay.aioRockMultiple[func] == 2) mgsuite.overlay.aioRockTimer = setTimeout(function(){mgsuite.overlay.aioClearRocker();}, 3000);
		else mgsuite.overlay.aioRockTimer = setTimeout(function(){mgsuite.overlay.aioClearRocker();}, 10000000);
      }
    }
    else {

      if (gesturesEnabled && e.button == mgsuite.overlay.aioGestButton) {
		// start mouse gesture
        if (mgsuite.overlay.aioGestEnabled && mgsuite.overlay.aioIsKeyOK(e)) {
          mgsuite.overlay.aioSrcEvent = e;
          var targetName = e.target.nodeName.toLowerCase();

          if (targetName != 'toolbarbutton'
              && !mgsuite.overlay.aioGestInProgress) {

			mgsuite.overlay.aioGestInProgress = true;
			mgsuite.overlay.aioStrokes = [];
			mgsuite.overlay.aioLocaleGest = [];
			mgsuite.overlay.aioCurrGest = "";
			
			if (mgsuite.overlay.aioTrailEnabled) {
			  mgsuite.trail.startTrail(e);
			}
			window.addEventListener("mousemove", mgsuite.overlay.aioGestMove, true);
		  }
        }
		
         // it can be the start of a wheelscroll gesture as well
        if (mgsuite.overlay.aioWheelEnabled && (mgsuite.overlay.aioWindowType == "browser" || mgsuite.overlay.aioWindowType == "messenger" || mgsuite.overlay.aioWindowType == "source")) {
		  
		  mgsuite.overlay.aioTabCount = (mgsuite.overlay.aioWindowType == "browser") ? mgsuite.overlay.aioContent.mTabContainer.childNodes.length : 0;
		  if (mgsuite.overlay.aioWheelRocker) {
			if (!mgsuite.overlay.aioGestInProgress) {
			  mgsuite.overlay.aioSrcEvent = e;
			}
		  }
		  else mgsuite.overlay.aioTTNode = mgsuite.overlay.aioFindLink(e.target, false);
		  
		  if (mgsuite.overlay.aioWheelRocker || mgsuite.overlay.aioTabCount >= 1 || mgsuite.overlay.aioTTNode)
			mgsuite.overlay.aioContent.addEventListener("wheel", mgsuite.overlay.aioWheelNav, true);
        }
		
        mgsuite.overlay.aioOldX = e.screenX;
		mgsuite.overlay.aioOldY = e.screenY;

		mgsuite.overlay.aioDownButton = e.button;
		
      } else {
		
		if (e.button == mgsuite.const.MMB) {
		  mgsuite.overlay.aioLastX = e.screenX;
		  mgsuite.overlay.aioLastY = e.screenY;
		}
		
		mgsuite.overlay.prevDownButton = mgsuite.overlay.aioDownButton;
		mgsuite.overlay.aioDownButton = e.button;
	  }
    }
  },
  
  /* This is invoked by middle mousedown from frame script */
  middleButtonDown: function(nodeToScroll, mouseTarget) {
	mgsuite.overlay.aioScroll = nodeToScroll;
	mgsuite.overlay.middleButtonTarget = mouseTarget;
	
	if (mgsuite.overlay.prevDownButton == mgsuite.const.NoB &&
		  !(mgsuite.overlay.aioPreferPaste && mgsuite.overlay.aioIsPastable(mouseTarget))) {
	  
	  // middle button scrolling
	  mgsuite.overlay.aioShowContextMenu = false;

	  window.removeEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
	  mgsuite.overlay.aioRendering.removeEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
	  window.addEventListener("click", mgsuite.overlay.aioASClick, true);
	  mgsuite.overlay.aioLastEvtTime = new Date();
	  window.addEventListener("mousemove", mgsuite.overlay.aioScrollMove, true);
	  
	  switch (mgsuite.overlay.aioWhatAS) {
		case 0: mgsuite.overlay.aioAutoScrollStart();
			break;
		case 2: mgsuite.overlay.aioRendering.addEventListener("mouseup", mgsuite.overlay.aioStartAS, true);
			mgsuite.overlay.aioGrabTarget = mouseTarget;
			mgsuite.overlay.aioScrollMode = 1;
			break;
		case 3: mgsuite.overlay.aioGrabNDrag(mouseTarget);
	  }
	}
	
	mgsuite.overlay.aioDownButton = mgsuite.const.MMB;
	mgsuite.overlay.prevDownButton = mgsuite.const.MMB;
  },
  
  /* We need to block mouse clicks when doing rocker gestures so that links are not
   * activated */
  blockMouseEventsForRocker: function() {
	  window.addEventListener("click", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
	  window.addEventListener("mousedown", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
	  window.addEventListener("mouseup", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
  },

  unBlockMouseEventsForRocker: function() {
	setTimeout(function() {
	  window.removeEventListener("click", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
	  window.removeEventListener("mousedown", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
	  window.removeEventListener("mouseup", mgsuite.overlay.rockerBlockMouseEventsHandler, true);
	}, 1);
  },

  rockerBlockMouseEventsHandler: function(e) {
    mgsuite.overlay.aioNukeEvent(e);
    mgsuite.overlay.unBlockMouseEventsForRocker();
  },

  aioGestClickEnd: function() { // click event is not always fired
    window.removeEventListener("click", mgsuite.overlay.aioGestClickHandler, true);
  },

  aioGestClickHandler: function(e) {
    if (e.button != mgsuite.overlay.aioGestButton) return;
    mgsuite.overlay.aioNukeEvent(e);
    window.removeEventListener("click", mgsuite.overlay.aioGestClickHandler, true);
  },

  aioDisplayContextMenu: function(e) {
    mgsuite.overlay.aioShowContextMenu = true;
    if (mgsuite.overlay.aioIsWin) return; // use the default action

    var evt = Components.interfaces.nsIDOMNSEvent;
    var mods = 0;

    if (e.shiftKey) mods |= evt.SHIFT_MASK;
    if (e.ctrlKey) mods |= evt.CONTROL_MASK;
    if (e.altKey) mods |= evt.ALT_MASK;
    if (e.metaKey) mods |= evt.META_MASK;

    var dwu = e.view.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
              .getInterface(Components.interfaces.nsIDOMWindowUtils);

    dwu.sendMouseEvent("contextmenu", e.clientX, e.clientY, 2, 1, mods);
  },

  aioMouseUp: function(e) {
	mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:endMouseMove");
	mgsuite.overlay.unBlockMouseEventsForRocker();

    if (!mgsuite.overlay.aioGesturesEnabled) {
	  mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	  return;
    }
	
	if (mgsuite.overlay.rockerButtonsPressed > 0) {
	  if (mgsuite.overlay.rockerButtonsPressed == 1 && window.gBrowser) {
		mgsuite.overlay.aioNukeEvent(e);
		//var sel = mgsuite.util.getContentWindow(gBrowser.selectedBrowser).getSelection();
		//sel.removeAllRanges();
	  }
	  
	  mgsuite.overlay.rockerButtonsPressed--;
	}

    if (mgsuite.overlay.aioDelayTO) {
	  clearTimeout(mgsuite.overlay.aioDelayTO);
    }

    if (mgsuite.overlay.aioSitePref == 'D' && !mgsuite.overlay.aioGestureTab) {
	  // disable gestures
	  mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	  mgsuite.overlay.aioKillGestInProgress();
	  return;
    }
    mgsuite.overlay.aioBlockActionStatusMsg = "";

    if (mgsuite.overlay.aioIsMac && e.button == mgsuite.const.LMB && e.ctrlKey) var button = mgsuite.const.RMB;
    else button = e.button;

    if (button == mgsuite.overlay.aioDownButton) {
	  mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	  mgsuite.overlay.aioContent.removeEventListener("wheel", mgsuite.overlay.aioWheelNav, true);
	  if (button == mgsuite.const.RMB && !mgsuite.overlay.aioGestInProgress && !mgsuite.overlay.aioRockTimer) {
		mgsuite.overlay.aioDisplayContextMenu(e);
	  } else {
		if (mgsuite.overlay.aioRockTimer) clearTimeout(mgsuite.overlay.aioRockTimer);
		mgsuite.overlay.aioRockTimer = null;
	  }
    }

   if (mgsuite.overlay.aioGestInProgress) {
      var lastgesture = mgsuite.overlay.aioStrokes.join("");

      if (lastgesture) mgsuite.overlay.aioNukeEvent(e);
      mgsuite.trail.eraseTrail();

      if (lastgesture) {
        window.addEventListener("click", mgsuite.overlay.aioGestClickHandler, true);

		if ((new Date() - mgsuite.overlay.aioLastEvtTime) < mgsuite.overlay.aioDelay) {
		  setTimeout(function(a){mgsuite.imp.aioFireGesture(a, e);}, 0, lastgesture);
		  setTimeout(function(){mgsuite.overlay.aioGestClickEnd();}, 200);
		  return;
		}
		else { // abort if user pauses at the end of gesture
		  mgsuite.imp.aioStatusMessage(mgsuite.overlay.aioGetStr("g.aborted"), 2500);
		  setTimeout(function(){mgsuite.overlay.aioGestClickEnd();}, 200);
		}
      }
       else {
          mgsuite.imp.aioStatusMessage("", 0);
          if (button == mgsuite.const.RMB) mgsuite.overlay.aioDisplayContextMenu(e);
      }
      mgsuite.overlay.aioKillGestInProgress();
      mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
	}
  },

  /* Cancel gesture when user starts dragging an element. If not cancelled, then the gesture
   * may be left unfinished because mouseup event does not fire after dragging */
  cancelGestureOnDrag: function(e) {
    mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
    mgsuite.overlay.aioContent.removeEventListener("wheel", mgsuite.overlay.aioWheelNav, true);
    if (mgsuite.overlay.aioGestInProgress) {
	  mgsuite.overlay.aioKillGestInProgress(true);
	}
	mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:endMouseMove");
	mgsuite.util.clearCollectedItems();
  },

  /* Scroll Wheel gestures
     Original code by Joe4711. Rewritten by Marc Boullet  */
  aioWheelNav: function(e) {
    mgsuite.overlay.aioNukeEvent(e);
    mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
    mgsuite.overlay.aioCCW = e.deltaY < 0;

    mgsuite.overlay.aioRendering.removeEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
    mgsuite.overlay.aioContent.removeEventListener("wheel", mgsuite.overlay.aioWheelNav, true);
    window.removeEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
    if (mgsuite.overlay.aioGestInProgress) {
       mgsuite.overlay.aioKillGestInProgress(mgsuite.overlay.aioWheelRocker);
       mgsuite.imp.aioStatusMessage("", 0);  //remove gesture indication
    }

    if (mgsuite.overlay.aioWheelRocker) {
       var func = 2 + (!mgsuite.overlay.aioCCW - 0);
       mgsuite.overlay.aioSrcEvent = e;
       mgsuite.overlay.aioPerformRockerFunction(func);
       if (!mgsuite.overlay.aioRockMultiple[func] || (mgsuite.overlay.aioRockMultiple[func] == 2 && mgsuite.overlay.aioRockMode == 0)) mgsuite.overlay.aioWheelRockEnd();
       else {
          mgsuite.overlay.aioRepet[func] = true; mgsuite.overlay.aioRepet[2 + (mgsuite.overlay.aioCCW - 0)] = mgsuite.overlay.aioWheelBothWays;
          window.addEventListener("mouseup", mgsuite.overlay.aioWheelRockUp, true);
          mgsuite.overlay.aioContent.addEventListener("wheel", mgsuite.overlay.aioWheelRocking, true);
       }
       return;
    }

    if (mgsuite.overlay.aioTTNode && mgsuite.overlay.aioShowTitletip && !mgsuite.overlay.aioTTHover) {mgsuite.overlay.aioLinkTooltip(); return;}
    switch (mgsuite.overlay.aioWheelMode) {
      case 1: mgsuite.overlay.aioHistoryWheelNav();
              break;
      case 2: mgsuite.overlay.aioTabWheelNav();
              break;
      case 3: if (mgsuite.overlay.aioCCW == mgsuite.overlay.aioHistIfDown) mgsuite.overlay.aioTabWheelNav();
              else mgsuite.overlay.aioHistoryWheelNav();
    }
  },

  aioWheelRockEnd: function() {
    mgsuite.overlay.aioRestoreListeners();
    mgsuite.util.clearCollectedItems();
  },

  aioWheelRockUp: function(e) {
    window.removeEventListener("mouseup", mgsuite.overlay.aioWheelRockUp, true);
    mgsuite.overlay.aioContent.removeEventListener("wheel", mgsuite.overlay.aioWheelRocking, true);
    mgsuite.overlay.aioWheelRockEnd();
  },

  aioWheelRocking: function(e) {
    var func = 2 + ((e.deltaY >= 0) - 0);
    if (mgsuite.overlay.aioRepet[func]) {
       mgsuite.overlay.aioSrcEvent = e;
       mgsuite.overlay.aioPerformRockerFunction(func);
    }
    mgsuite.overlay.aioNukeEvent(e);
  },


  /*
    Function prototype for scrolling popups
  */
  aioPopUp: function(pActive, pStart, pLength, pLastFirst, ptype, mouseX, mouseY, revScroll, func1, func2, func3) {
    this.activeRow = pLastFirst ? pLength - pActive + pStart - 1 : pActive - pStart;
    this.initialRow = this.activeRow;
    this.initialItem = pActive;
    this.popupStart = pStart;
    this.popupLength = pLength;
    this.lastFirst = pLastFirst;
    this.popupType = ptype;
    this.popupX = mouseX;
    this.popupY = mouseY;
    this.reverseScroll = revScroll;
    this.closeFunc = func1;
    this.observeFunc = func2;
    this.scrollingFunc = func3;
    this.createPopup = mgsuite.overlay._aioCreatePU;
    this.updatePopup = mgsuite.overlay._aioUpdatePU;
    this.scrollPopup = mgsuite.overlay._aioScrollPU;
    this.closePopup = mgsuite.overlay._aioClosePU;
    this.scrollerNode = null;
  },

  _aioCreatePU: function(arg1, arg2, arg3, menuClass) {
    var popupElem, label, img;
    var SS = mgsuite.overlay.getSessionStore();
    
    if (SS.getSessionHistory) {
      var sessionH = SS.getSessionHistory(gBrowser.selectedTab); // Fx43+
    } else {
      var sessionH = getWebNavigation().sessionHistory;
    }
    
    if (this.closeFunc) window.addEventListener("mouseup", this.closeFunc, true);
    if (this.popupType == "popup") {
       this.scrollerNode = document.createElementNS(mgsuite.const.xulNS, "panel");
       this.scrollerNode.id = "aioWheelPopup";
       this.scrollerNode.setAttribute("noautohide", "true");
    }
    else this.scrollerNode = document.createElementNS(mgsuite.const.xulNS, this.popupType);
    this.scrollerNode.setAttribute("ignorekeys", "true");
    if (this.popupType == "popup") {
      for (var i = this.popupStart; i < this.popupStart + this.popupLength; ++i) {
        popupElem = document.createElementNS(mgsuite.const.xulNS, "menuitem");
        if (arg1) {
          var entry = sessionH.entries
            ? sessionH.entries[i]
            : sessionH.getEntryAtIndex(i, false);
          label = entry.title;
        }
        else {
          if (mgsuite.overlay.aioContent.mTabContainer.childNodes[i]) {
            label = mgsuite.overlay.aioContent.mTabContainer.childNodes[i].label;
          } else {
            label = mgsuite.overlay.aioContent.ownerDocument.title;
          }
        }
        
        var className = "menuitem-iconic";
        
        if (menuClass) {
          // additional styling
          className += " " + menuClass;
        }
      
        popupElem.setAttribute("class", className);
        popupElem.setAttribute("style", "max-width:40em;");
        popupElem.setAttribute("label", label);
        if (arg1) {
           img = (i < this.initialItem) ? mgsuite.const.aioBackURL : (i == this.initialItem) ?
                  mgsuite.overlay.aioContent.mTabContainer.childNodes[mgsuite.overlay.aioContent.mTabContainer.selectedIndex].getAttribute("image") : mgsuite.const.aioNextURL;
      } else {

        if (mgsuite.overlay.aioContent.mTabContainer.childNodes[i]) {
          img = mgsuite.overlay.aioContent.mTabContainer.childNodes[i].getAttribute("image");
        }
      }
        if (img) popupElem.setAttribute("image", img);

        if (this.lastFirst) this.scrollerNode.insertBefore(popupElem, this.scrollerNode.firstChild);
        else this.scrollerNode.appendChild(popupElem);
      }
    }
    else {
      this.scrollerNode.setAttribute("orient", "vertical");
      if (arg1) {
         popupElem = document.createElementNS(mgsuite.const.xulNS, "description");
         popupElem.setAttribute("style", "font-family:sans-serif;font-weight:bold;font-size:16px;" +
                         (this.reverseScroll ? "color:red;" : ""));
         this.scrollerNode.appendChild(popupElem);
         popupElem.appendChild(document.createTextNode(arg1));
      }
      if (arg3) {
         popupElem = document.createElementNS(mgsuite.const.xulNS, "description");
         popupElem.setAttribute("style", "font-family:sans-serif;font-size:12px");
         this.scrollerNode.appendChild(popupElem);
         popupElem.appendChild(document.createTextNode(arg3));
      }
      popupElem = document.createElementNS(mgsuite.const.xulNS, "description");
      popupElem.setAttribute("style", "font-family:sans-serif;font-size:12px");
      this.scrollerNode.appendChild(popupElem);
      if (arg2.length > 69) arg2 = arg2.substr(0, 33) + "..." + arg2.substr(-33);
      popupElem.appendChild(document.createTextNode(arg2));
    }
    document.popupNode = null; document.tooltipNode = null;
    mgsuite.overlay.aioMainWin.appendChild(this.scrollerNode);
    this.scrollerNode.addEventListener("popupshowing", this.observeFunc, true);
    this.scrollerNode.openPopupAtScreen(this.popupX, this.popupY, false);
  },

  _aioUpdatePU: function() {
    this.scrollerNode.removeEventListener("popupshowing", this.observeFunc, true);
    if (this.scrollingFunc) mgsuite.overlay.aioMainWin.addEventListener("wheel", this.scrollingFunc, true);
    for (var i = 0; i < arguments.length; i += 2)
      if (arguments[i] >= 0)
         this.scrollerNode.childNodes[arguments[i]].setAttribute(arguments[i + 1], "true");
  },

  _aioScrollPU: function(event) {
    event.preventDefault(); event.stopPropagation();
    this.scrollerNode.childNodes[this.activeRow].removeAttribute("_moz-menuactive");
    var goRight = this.reverseScroll ? event.deltaY < 0 : event.deltaY > 0;
    if (goRight) {if (++this.activeRow >= this.popupLength) this.activeRow = 0;}
    else if (--this.activeRow < 0) this.activeRow = this.popupLength - 1;
    this.scrollerNode.childNodes[this.activeRow].setAttribute("_moz-menuactive","true");
  },

  _aioClosePU: function(action) {
    if (this.closeFunc) window.removeEventListener("mouseup", this.closeFunc, true);
    if (this.scrollingFunc) mgsuite.overlay.aioMainWin.removeEventListener("wheel", this.scrollingFunc, true);
    this.scrollerNode.hidePopup();
    switch (action) {
      case 0: break;
      case 1: mgsuite.overlay.aioContent.mTabContainer.selectedIndex = this.activeRow;
              break;
      case 2: if (this.activeRow!=this.initialRow) {
                 var indice = this.lastFirst ? this.popupLength + this.popupStart -1 - this.activeRow
                                             : this.activeRow + this.popupStart;
                 getWebNavigation().gotoIndex(indice);
              }
    }
    mgsuite.overlay.aioMainWin.removeChild(this.scrollerNode);
  },
  // End of Popup prototype

  aioRestoreListeners: function() {
    mgsuite.overlay.aioRendering.addEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
    window.addEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
	mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:endMouseMove");
  },

  aioTabWheelNav: function() {
    var activeTab = mgsuite.overlay.aioContent.mTabContainer.selectedIndex;
    if (activeTab != mgsuite.overlay.aioTabSrc) {
       mgsuite.overlay.aioTabSrc = activeTab;
    }
    // Create and Display the popup menu
    mgsuite.overlay.aioTabPU = new mgsuite.overlay.aioPopUp(activeTab, 0, mgsuite.overlay.aioTabCount, false, "popup", mgsuite.overlay.aioOldX + 2, mgsuite.overlay.aioOldY + 2,
                            mgsuite.overlay.aioReverseScroll && !mgsuite.overlay.showTabsPopup, mgsuite.overlay.aioTabWheelEnd, mgsuite.overlay.aioTabPopping, mgsuite.overlay.aioTabWheeling);
    mgsuite.overlay.aioTabPU.createPopup(0, "", "");
	
	var prevIndex = mgsuite.overlay.getPreviousSelectedTab(true);
	
	if (prevIndex !== null) {
	  // mark previously visited tab as underlined
	  mgsuite.overlay.aioTabPU.updatePopup(mgsuite.overlay.aioTabPU.initialRow, "_moz-menuactive", mgsuite.overlay.aioTabPU.initialRow, "aioBold", prevIndex, "aioUnderline");
	} else {
	  // make sure that initial menu item is highlighted even if only 1 tab exists
	  mgsuite.overlay.aioTabPU.updatePopup(mgsuite.overlay.aioTabPU.initialRow, "_moz-menuactive", mgsuite.overlay.aioTabPU.initialRow, "aioBold");
	}
  },

  aioTabPopping: function(e) {
	if (!mgsuite.overlay.showTabsPopup) {
	  e.preventDefault(); //no popup
	  if (mgsuite.overlay.aioWheelMode == 2) mgsuite.overlay.aioContent.mTabContainer.advanceSelectedTab(mgsuite.overlay.aioCCW != mgsuite.overlay.aioReverseScroll ? -1 : 1, true);
	}
  },

  aioTabWheeling: function(e) {
    mgsuite.overlay.aioTabPU.scrollPopup(e);
	
    if (!mgsuite.overlay.showTabsPopup) mgsuite.overlay.aioContent.mTabContainer.advanceSelectedTab(e.deltaY > 0 == mgsuite.overlay.aioReverseScroll ? -1 : 1, true);
  },

  aioTabWheelEnd: function(e) {
	if (!mgsuite.overlay.showTabsPopup) {
	  mgsuite.overlay.aioTabPU.closePopup(0);
	  mgsuite.overlay.aioRestoreListeners();
	  return;
	}
	
	if (mgsuite.overlay.aioTabPU.activeRow != mgsuite.overlay.aioTabPU.initialRow) {
	  if (mgsuite.overlay.aioTabSrc != mgsuite.overlay.aioTabPU.activeRow) {
		mgsuite.overlay.aioTabSrc = mgsuite.overlay.aioTabPU.activeRow;
	  }
	}
	
	mgsuite.overlay.aioTabPU.closePopup(1);
	mgsuite.overlay.aioRestoreListeners();
  },

  aioHistoryWheelNav: function() {
    var SS = mgsuite.overlay.getSessionStore();
    
    if (SS.getSessionHistory) {
      var sessionH = SS.getSessionHistory(gBrowser.selectedTab); // Fx43+
      var sCount = sessionH.entries.length;
    } else {
      var sessionH = getWebNavigation().sessionHistory;
      var sCount = sessionH.count;
    }
    
    if (sessionH.index < 0 || sCount <= 0) { // Firefox bug: untitled tab
       mgsuite.overlay.aioRestoreListeners();
       return;
    }
    if (sCount > 15) {
       var start = Math.max(0, sessionH.index - 7);
       if (start + 15 > sCount) start = sCount - 15;
       var count = 15;
    }
    else {
       start = 0;
       count = sCount;
    }

    mgsuite.overlay.aioHistPU = new mgsuite.overlay.aioPopUp(sessionH.index, start, count, true, "popup", mgsuite.overlay.aioOldX + 2, mgsuite.overlay.aioOldY + 2,
                             false, mgsuite.overlay.aioHistWheelEnd, mgsuite.overlay.aioHistPopping, mgsuite.overlay.aioHistWheeling);
    mgsuite.overlay.aioHistPU.createPopup(1, "", "", "history");
  },

  aioHistPopping: function() {
    mgsuite.overlay.aioHistPU.updatePopup(mgsuite.overlay.aioHistPU.initialRow, "_moz-menuactive", mgsuite.overlay.aioHistPU.initialRow, "aioBold");
  },

  aioHistWheeling: function(e) {
    mgsuite.overlay.aioHistPU.scrollPopup(e);
  },

  aioHistWheelEnd: function(e) {
    mgsuite.overlay.aioHistPU.closePopup(2);
    mgsuite.overlay.aioRestoreListeners();
  },

  aioLinkTooltip: function(e) {
    mgsuite.overlay.aioTTPU = new mgsuite.overlay.aioPopUp(0, 0, 0, false, "tooltip", mgsuite.overlay.aioOldX, mgsuite.overlay.aioOldY, mgsuite.tooltip.aioHasNewWindowTarget(mgsuite.overlay.aioTTNode),
                           mgsuite.overlay.aioLinkTTEnd, mgsuite.overlay.aioLinkTTPopping, mgsuite.overlay.aioLinkTTNuke);

    mgsuite.overlay.aioTTPU.createPopup(mgsuite.tooltip.aioGetTextForTitle(mgsuite.overlay.aioTTNode), mgsuite.overlay.aioGetHRef(mgsuite.overlay.aioTTNode), "");
  },

  aioLinkTTPopping: function(e) {
    mgsuite.overlay.aioTTPU.updatePopup();
  },

  aioLinkTTNuke: function(e) {
    mgsuite.overlay.aioNukeEvent(e);
  },

  aioLinkTTEnd: function(e) {
    mgsuite.overlay.aioTTPU.closePopup(0);
    mgsuite.overlay.aioTTPU = null; mgsuite.overlay.aioTTNode = null;
    mgsuite.overlay.aioRestoreListeners();
    mgsuite.overlay.aioNukeEvent(e);
  },

  aioSwitchTabs: function(e) {
    if (typeof(TabbrowserService) == "object" || mgsuite.overlay.aioContent.mTabContainer.childNodes.length <= 1)  return;
    mgsuite.overlay.aioNukeEvent(e);
    mgsuite.overlay.aioContent.mTabContainer.advanceSelectedTab(e.deltaY > 0 == mgsuite.overlay.aioReverseScroll ? -1 : 1, true);
  },

  aioScrollMove: function(e) {
    switch (mgsuite.overlay.aioScrollMode) {
      case 0: mgsuite.overlay.aioAutoScrollMove(e);
              break;
      case 1: mgsuite.overlay.aioGrabMaybe(e);
              break;
      case 2: mgsuite.overlay.aioGrabNDragMove(e);
    }
  },

  aioAutoScrollStart: function() {
    window.addEventListener("wheel", mgsuite.overlay.aioAutoScrollStop, true);
    window.addEventListener("mouseup", mgsuite.overlay.aioAutoScrollUp, true);
    window.addEventListener("mousedown", mgsuite.overlay.aioAutoScrollUp, true);
    mgsuite.overlay.aioAcceptASKeys = true;
    mgsuite.overlay.aioScrollMode = 0;
    mgsuite.overlay.aioScrollFingerFree = false;
    mgsuite.overlay.autoScrollMoved = false;
	
	var result = mgsuite.overlay.aioAddMarker();
    
    switch (result) {
      case 0:
      case 1:
        mgsuite.overlay.scrollByXStack = 0;
        mgsuite.overlay.scrollByYStack = 0;
        
        mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:startAutoScroll", {
          whatToScroll: (result ? 'window' : 'element'),
          interval: mgsuite.overlay.aioASPeriod,
          scrollMax: mgsuite.overlay.aioScrollMax
        });
        break;
      
      case 2: ;
    }
  },
  
  /* Frame script notifies this thread */
  setAutoScrollMoved: function() {
    mgsuite.overlay.autoScrollMoved = true;
  },
  
  aioLogDist: function(aDist) {
    aDist *= 1.25;  // adjust autoscroll step distance
    
    var absDist = Math.abs(aDist);
    for (var i = 1; i < mgsuite.const.aioDist.length; ++i)
       if (absDist < mgsuite.const.aioDist[i]) {
          absDist = Math.round(mgsuite.overlay.aioSofar[i] + (absDist - mgsuite.const.aioDist[i-1]) * mgsuite.const.aioRatio[i]);
          break;
       }
    var tabDist = [0, 0, 0, 0];
    switch (mgsuite.overlay.aioScrollRate) {
      case 0: tabDist[0] = (aDist < 0) ? -absDist : absDist;
              break;
      case 1: var half = absDist >> 1;
              tabDist[1] = (aDist < 0) ? -half : half;
              tabDist[0] = (aDist < 0) ? half - absDist : absDist - half;
              break;
      case 2: var quarter = absDist >> 2; var roundQuart = quarter;
              if ((absDist & 3) > 1) ++roundQuart;
              tabDist[0] = (aDist < 0) ? -roundQuart : roundQuart;
              tabDist[2] = tabDist[0];
              tabDist[1] = (aDist < 0) ? -quarter : quarter;
              tabDist[3] = absDist - quarter - roundQuart - roundQuart;
              if (aDist < 0) tabDist[3] = -tabDist[3];
    }
    
    var factor = mgsuite.overlay.autoscrollSpeed;
    
    tabDist[0] *= factor;
    tabDist[1] *= factor;
    tabDist[2] *= factor;
    tabDist[3] *= factor;
    
    if (factor > 1) {
      var sign = 1;
      var tabDistAbs = [0,0,0,0];
      
      for (var i=0; i<4; i++) {
        if (tabDist[i] < 0) {
          sign = -1;
        }
        tabDistAbs[i] = Math.abs(tabDist[i]);
      }
      
      // check if there are too big differences between values
      var diffMoreThan1 = false;
      var firstVal = null;
      var sum = 0;
      
      for (var i=0; i<4; i++) {
        if (i == 0) {
          firstVal = tabDistAbs[0];
        }
        else if (Math.abs(tabDistAbs[i] - firstVal) > 1) {
          diffMoreThan1 = true;
        }
        
        sum += tabDistAbs[i];
      }
      
      if (diffMoreThan1) {
        // distribute values evenly, e.g.
        // 0 0 0 2 => 0 1 0 1
        var mean = Math.floor(sum / 4);
        tabDistAbs[0] = mean;
        tabDistAbs[1] = mean;
        tabDistAbs[2] = mean;
        tabDistAbs[3] = mean;
        
        var mod = sum - mean * 4;
        
        if (mod == 1) {
          tabDistAbs[3]++;
        } else if (mod == 2) {
          tabDistAbs[0]++;
          tabDistAbs[2]++;
        } else if (mod == 3) {
          tabDistAbs[0]++;
          tabDistAbs[2]++;
          tabDistAbs[3]++;
        }
      }
      
      tabDist[0] = tabDistAbs[0] * sign;
      tabDist[1] = tabDistAbs[1] * sign;
      tabDist[2] = tabDistAbs[2] * sign;
      tabDist[3] = tabDistAbs[3] * sign;
    }
   
    return tabDist;
  },

  aioAutoScrollMove: function(e) {
    // Apply pseudo logarithmic scale
    mgsuite.overlay.aioNukeEvent(e);
    mgsuite.overlay.aioScroll.dX = e.screenX - mgsuite.overlay.aioLastX;
    mgsuite.overlay.aioScroll.dY = e.screenY - mgsuite.overlay.aioLastY;
    var distX = [0, 0, 0, 0];
    var distY = [0, 0, 0, 0];
    
    switch (mgsuite.overlay.aioScroll.scrollType) {
      case 3: break;
      case 0: if (Math.abs(mgsuite.overlay.aioScroll.dX) > Math.abs(mgsuite.overlay.aioScroll.dY)) distX = mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dX);
              else distY = mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dY); // diagonal scrolling is jerky; don't do it
              break;
      case 1: distY = mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dY);
              break;
      case 2: distX = mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dX);
    }
    
    mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:setAutoScrollDist", {
      x: distX,
      y: distY
    });
  },

  aioAutoScrollKey: function(e) {
    const VK_LEFT = e.DOM_VK_LEFT, VK_UP = e.DOM_VK_UP;
    const VK_RIGHT = e.DOM_VK_RIGHT, VK_DOWN = e.DOM_VK_DOWN;
    mgsuite.overlay.aioNukeEvent(e);
    switch (e.keyCode) {
      case VK_DOWN :
      case VK_UP   : if (mgsuite.overlay.aioScroll.scrollType < 2) {
                        var inc = e.keyCode == VK_UP ? -16 : 16 ;
                        if (mgsuite.overlay.aioMarker) {
              mgsuite.overlay.aioMarker.moveBy(0, inc);
                        }

                        mgsuite.overlay.aioLastY -= inc;
                        mgsuite.overlay.aioScroll.dY += inc;
                        mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:setAutoScrollDist", {
                          x: null,
                          y: mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dY)
                        });

                     }
                     break;
      case VK_LEFT :
      case VK_RIGHT: if (!(mgsuite.overlay.aioScroll.scrollType & 1)) {
                        inc = e.keyCode == VK_LEFT ? -16 : 16 ;
                        if (mgsuite.overlay.aioMarker) {
                          mgsuite.overlay.aioMarker.moveBy(inc, 0);
                        }

                        mgsuite.overlay.aioLastX -= inc;
                        mgsuite.overlay.aioScroll.dX += inc;
                        mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:setAutoScrollDist", {
                          x: mgsuite.overlay.aioLogDist(mgsuite.overlay.aioScroll.dX),
                          y: null
                        });                     }
                     break;
      default      : mgsuite.overlay.aioAutoScrollStop(e);
   }          
  },

  aioAutoScrollStop: function(e) {
    mgsuite.overlay.aioScrollFingerFree = true;
    mgsuite.overlay.aioAutoScrollUp(e);
  },

  aioScrollEnd: function() {
    window.removeEventListener("click", mgsuite.overlay.aioASClick, true);
  },

  aioASClick: function(e) { // prevent Unix pastes
    mgsuite.overlay.aioNukeEvent(e);
  },

  aioAutoScrollUp: function(e) {
    if (mgsuite.overlay.aioScrollFingerFree || (
        ((new Date() - mgsuite.overlay.aioLastEvtTime) > 1000
          || (mgsuite.overlay.autoScrollMoved && !mgsuite.overlay.autoscrollContinue))
        
        && (!mgsuite.overlay.aioPanToAS || Math.abs(e.screenX - mgsuite.overlay.aioLastX) >= mgsuite.const.aioHalfMarker || Math.abs(e.screenY - mgsuite.overlay.aioLastY) >= mgsuite.const.aioHalfMarker))
      ) {
      
      // stop autoscroll
      mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:stopAutoScroll");
	  mgsuite.overlay.aioNukeEvent(e);
  
	  if (e.type == "mousedown") {
		mgsuite.overlay.aioRemoveMarker();
		window.removeEventListener("mousemove", mgsuite.overlay.aioScrollMove, true);
	  }
      else {
		mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
		window.removeEventListener("mouseup", mgsuite.overlay.aioAutoScrollUp, true);
		window.removeEventListener("mousedown", mgsuite.overlay.aioAutoScrollUp, true);
		window.removeEventListener("mousemove", mgsuite.overlay.aioScrollMove, true);
		window.removeEventListener("wheel", mgsuite.overlay.aioAutoScrollStop, true);
		mgsuite.overlay.aioAcceptASKeys = false;
		window.addEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
		mgsuite.overlay.aioRendering.addEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
		mgsuite.overlay.aioRemoveMarker();
		setTimeout(function(){mgsuite.overlay.aioScrollEnd();}, 200);
      }
    }
    else mgsuite.overlay.aioScrollFingerFree = true;
  },

  /* Display autoscroll marker */
  aioAddMarker: function() {
    if (mgsuite.overlay.aioScroll.scrollType == 3) { // nothing to scroll
       mgsuite.overlay.aioScrollFingerFree = true; // exit on next mouse up
       return 2;
    }

    if (mgsuite.overlay.aioSpecialCursor && !mgsuite.overlay.aioNoScrollMarker && !mgsuite.overlay.aioScroll.XMLPrettyPrint) {
      // overlay
      var el = mgsuite.overlay.aioScroll.targetDoc.createElementNS(mgsuite.const.xhtmlNS, "aioOverlay");
      el.style.position = "fixed";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.width = mgsuite.overlay.aioScroll.docWidth + "px";
      el.style.height = mgsuite.overlay.aioScroll.docHeight + "px";
      el.style.zIndex = 10001;
      el.style.background = "transparent";
      el.style.cursor = mgsuite.const.aioCursors[mgsuite.overlay.aioScroll.scrollType];
      mgsuite.overlay.aioScroll.insertionNode.appendChild(el);
      mgsuite.overlay.aioOverlay = el;
    } else {
	  mgsuite.overlay.aioOverlay = null;
    }

    // marker
    var insertionNode;

    if (!mgsuite.overlay.aioNoScrollMarker) {
    switch (mgsuite.overlay.aioWindowType) {
      case 'browser':
        insertionNode = document.getElementById("content"); // tabbrowser
        break;

      case 'messenger':
        insertionNode = document.getElementById("messagepanebox");
        break;

      case 'mailcompose':
      case 'source':
        insertionNode = document.getElementById("appcontent");
        break;
    }

    mgsuite.overlay.aioMarkerX = mgsuite.overlay.aioLastX - window.mozInnerScreenX - mgsuite.const.aioHalfMarker;
    mgsuite.overlay.aioMarkerY = mgsuite.overlay.aioLastY - window.mozInnerScreenY - mgsuite.const.aioHalfMarker;

    var canvas = document.createElementNS(mgsuite.const.xhtmlNS, "canvas");
    canvas.id = mgsuite.const.aioMarkerIds[mgsuite.overlay.aioScroll.scrollType];
    canvas.style.position = "fixed";
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 10000;

    insertionNode.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, mgsuite.overlay.aioMarkerX, mgsuite.overlay.aioMarkerY);
    }
    img.src = mgsuite.const.aioMarkers[mgsuite.overlay.aioScroll.scrollType];

    mgsuite.overlay.aioMarker = canvas;
    mgsuite.overlay.aioMarker.moveBy = function(shiftX, shiftY) {
      ctx.clearRect(mgsuite.overlay.aioMarkerX, mgsuite.overlay.aioMarkerY, mgsuite.const.aioMarkerSize, mgsuite.const.aioMarkerSize)
      mgsuite.overlay.aioMarkerX += shiftX;
      mgsuite.overlay.aioMarkerY += shiftY;
      ctx.drawImage(img, mgsuite.overlay.aioMarkerX, mgsuite.overlay.aioMarkerY);
    };

    } else {
    mgsuite.overlay.aioMarker = null;
    }

    return (mgsuite.overlay.aioScroll.isXML || mgsuite.overlay.aioScroll.isBody) - 0;
  },

  aioRemoveMarker: function() {
    if (mgsuite.overlay.aioMarker) {
      try {
        mgsuite.overlay.aioMarker.parentNode.removeChild(mgsuite.overlay.aioMarker);
    }
    catch(err) {}
      mgsuite.overlay.aioMarker = null;
    }
    if (mgsuite.overlay.aioOverlay) {
      try {
        mgsuite.overlay.aioOverlay.parentNode.removeChild(mgsuite.overlay.aioOverlay);
    }
    catch(err) {}
      mgsuite.overlay.aioOverlay = null;
    }
  },

  aioGrabMaybe: function(e) {
    if (Math.abs(e.screenX - mgsuite.overlay.aioLastX) < 3 && Math.abs(e.screenY - mgsuite.overlay.aioLastY) < 3) return;
    mgsuite.overlay.aioRendering.removeEventListener("mouseup", mgsuite.overlay.aioStartAS, true);
    mgsuite.overlay.aioGrabNDrag(mgsuite.overlay.aioGrabTarget);
    mgsuite.overlay.aioGrabNDragMove(e);
  },

  aioStartAS: function(e) {
     mgsuite.overlay.aioRendering.removeEventListener("mouseup", mgsuite.overlay.aioStartAS, true);
     mgsuite.overlay.aioAutoScrollStart(e);
     mgsuite.overlay.aioScrollFingerFree = true;
     if (mgsuite.overlay.aioScroll.scrollType == 3) mgsuite.overlay.aioAutoScrollUp(e);
  },

  aioGrabNDrag: function(target) {
    mgsuite.overlay.aioScrollMode = 2;
    window.addEventListener("mouseup", mgsuite.overlay.aioGrabNDragMouseUp, true);
    
    // mgsuite.overlay.aioScroll is set by middleButtonDown(), invoked by frame script
    if (mgsuite.overlay.aioScroll.scrollType == 3) return; // nothing to scroll
    
    if (!mgsuite.overlay.aioScroll.isXML && mgsuite.overlay.aioScroll.nodeToScroll.nodeName.toLowerCase() != "select") {
      mgsuite.overlay.aioScroll.cursorChangeable = true;
      mgsuite.overlay.aioScroll.originalCursor = mgsuite.overlay.aioScroll.nodeToScroll.style.cursor;
      mgsuite.overlay.aioScroll.nodeToScroll.style.cursor = "url(chrome://mgsuite/content/allscroll.png), move";
    }
    if (mgsuite.overlay.aioScrollAlaAcrobat) {
      mgsuite.overlay.aioScroll.ratioX = -1;
      mgsuite.overlay.aioScroll.ratioY = -1;
    }
  },

  aioGrabNDragMove: function(e) {
    if (mgsuite.overlay.aioScroll.scrollType == 3) return;
    
    var moveX = mgsuite.overlay.aioNoHorizScroll ? 0 : Math.ceil((e.screenX - mgsuite.overlay.aioLastX) * mgsuite.overlay.aioScroll.ratioX);
    var moveY = Math.ceil((e.screenY - mgsuite.overlay.aioLastY) * mgsuite.overlay.aioScroll.ratioY);
    
    mgsuite.overlay.aioLastX = e.screenX;
    mgsuite.overlay.aioLastY = e.screenY;
    
    var whatToScroll = (mgsuite.overlay.aioScroll.isXML || mgsuite.overlay.aioScroll.isBody) ? 'window' : 'element';
    
    if (moveX != 0 || moveY != 0) {
      mgsuite.overlay.sendAsyncMessage("MouseGesturesSuite:scrollWinOrElem", {
        whatToScroll: whatToScroll,
        moveX: moveX,
        moveY: moveY
      });
    }
  },

  aioGrabNDragMouseUp: function(e) {
    mgsuite.overlay.aioNukeEvent(e);
    mgsuite.overlay.aioDownButton = mgsuite.const.NoB;
    window.removeEventListener("mouseup", mgsuite.overlay.aioGrabNDragMouseUp, true);
    window.removeEventListener("mousemove", mgsuite.overlay.aioScrollMove, true);
    window.addEventListener("mouseup", mgsuite.overlay.aioMouseUp, true);
    mgsuite.overlay.aioRendering.addEventListener("mousedown", mgsuite.overlay.aioMouseDown, true);
    
    if (mgsuite.overlay.aioScroll.cursorChangeable) {
      mgsuite.overlay.aioScroll.nodeToScroll.style.cursor = mgsuite.overlay.aioScroll.originalCursor;
    }
    setTimeout(function(){mgsuite.overlay.aioScrollEnd();}, 200);
  },

  // Disable clickheat.js events, because they cause delays in gestures
  // See http://www.labsmedia.com/clickheat/index.html
  aioDisableClickHeatEvents: function(e) {
    var targetWin = e.target.ownerDocument.defaultView.wrappedJSObject;

    if (typeof targetWin.catchClickHeat == "function") {
    mgsuite.overlay._aioRemoveEventsForFunction(targetWin.document, targetWin.catchClickHeat);

    var f=targetWin.document.getElementsByTagName("iframe");
    for (var i=0; i<f.length; i++) {
      mgsuite.overlay._aioRemoveEventsForFunction(f[i], targetWin.catchClickHeat);
    }

    mgsuite.overlay.aioBlockActionStatusMsg += "<" + mgsuite.overlay.aioGetStr("g.ClickHeatDisabled") + ">";
    mgsuite.imp.aioStatusMessage(mgsuite.overlay.aioBlockActionStatusMsg, 1000);
    }
  },

  // remove all event listeners for function on given target
  _aioRemoveEventsForFunction: function(target, func) {
    var els = Components.classes["@mozilla.org/eventlistenerservice;1"]
              .getService(Components.interfaces.nsIEventListenerService);

    var handlers = els.getListenerInfoFor(target);
    var handler;

    for (var i in handlers) {
    handler = handlers[i];

    if (handler.type && (typeof handler.listenerObject) == "function"
      && handler.listenerObject.name == func.name) {
      target.removeEventListener(handler.type, handler.listenerObject, handler.capturing);
    }
    }
  },

  getPreviousSelectedTab: function(getAsIndex) {
    var lTab;
    if (mgsuite.overlay.aioTabFocusHistory.length < 2) return null;
    var tabId = mgsuite.overlay.aioTabFocusHistory[mgsuite.overlay.aioTabFocusHistory.length - 2].focused;
	
    for (var i = 0; i < mgsuite.overlay.aioContent.mTabs.length; ++i) {
      lTab = mgsuite.overlay.aioContent.mTabContainer.childNodes[i];
	  
      if (lTab.getAttribute("aioTabId") == tabId) {
		return getAsIndex ? i : lTab;
	  }
    }
    return null;
  },
  
  /**
   * Get custom gesture entry from customGestures pref.
   * @param {String} id
   * @returns {Object}
   */
  getCustomGestureById: function(id) {
    for (var i=0; i<mgsuite.overlay.customGestures.length; i++) {
      if (mgsuite.overlay.customGestures[i].id == id) {
        return mgsuite.overlay.customGestures[i];
      }
    }
    return null;
  }
}


/*
 * linkTooltip.js
 * For licence information, read licence.txt
 *
 * handling of link tooltips
 *
 */
mgsuite.tooltip = {
  
  aioHasNewWindowTarget: function(node) { // code from Chris Cook's Tabbrowser Preferences
    function notExistingFrameName(containerFrame, targetFrame) {
      for (var i = 0; i < containerFrame.length; ++i) {
         if (containerFrame[i].name == targetFrame) return false;
         if (containerFrame[i].frames.length && !notExistingFrameName(containerFrame[i].frames, targetFrame))
            return false;
      }
      return true;
    }

    var aiotarget = node.getAttribute("aiotarget");
    if (aiotarget) return aiotarget == "true";
    var target = node.getAttribute("target");
    // If link has no target attribute, check if there is a <base> with a target attribute
    if (!target) {
       var bases = node.ownerDocument.documentElement.getElementsByTagName("base");
       for (var i = bases.length - 1; i >= 0; --i) {
          target = bases[i].getAttribute("target");
          if (target) break;
       }
    }
    var hasNewWindow = target && (target == "_blank" || (target != "_self" && target !=" _parent" && target != "_top"
          && notExistingFrameName(document.commandDispatcher.focusedWindow.top.frames, target)));
    node.setAttribute("aiotarget", hasNewWindow ? "true": "false");
    return hasNewWindow;
  },

  aioGetTextForTitle: function(linkNode) { // from pageInfo.js; modified by M.B.
    function getTitleAltText(node) {
      if (node.hasAttribute("title")) {
         var altText = node.getAttribute("title");
         node.removeAttribute("title");
         return altText;
      }
      if (node.alt) return node.alt;
      altText = "";
      var length = node.childNodes.length;
      for (var i = 0; i < length; i++)
         if ((altText = getAltText(node.childNodes[i]) != undefined)) return altText;
      return "";
    }

    const nsIImageElement = Components.interfaces.nsIDOMHTMLImageElement;
    const nsIAreaElement = Components.interfaces.nsIDOMHTMLAreaElement;
    var s, childNode, nodeType;
    if (linkNode.hasAttribute("aioTitle")) return linkNode.getAttribute("aioTitle");
    if (linkNode.hasAttribute("title")) {
       var valueText = linkNode.getAttribute("title");
       linkNode.removeAttribute("title");
    }
    else {
       valueText = "";
       if (linkNode instanceof nsIAreaElement) valueText = linkNode.alt;
       else {
          var length = linkNode.childNodes.length;
          for (var i = 0; i < length; i++) {
            childNode = linkNode.childNodes[i];
            nodeType = childNode.nodeType;
            if (nodeType == Node.TEXT_NODE) valueText += " " + childNode.nodeValue;
            else if (nodeType == Node.ELEMENT_NODE)
              if (childNode instanceof nsIImageElement) {
                 s = getTitleAltText(childNode);
                 if (s) {
                    valueText = s; break;
                 }
              } 
              else valueText += " " + mgsuite.tooltip.aioGetTextForTitle(childNode);
          }
       }
    }
    var middleRE = /\s+/g;
    var endRE = /(^\s+)|(\s+$)/g;
    valueText = valueText.replace(middleRE, " ").replace(endRE, "")
    linkNode.setAttribute("aioTitle", valueText);
    return valueText;
  },

  aioShowTitle: function(e) {
    if (mgsuite.overlay.aioDownButton != mgsuite.const.NoB || mgsuite.overlay.aioTTShown || (mgsuite.overlay.aioShiftForTitle && !e.shiftKey)) return;
    var linkNode = mgsuite.overlay.aioFindLink(e.target, false);
    if (!linkNode) return;
    mgsuite.tooltip.aioGetTextForTitle(linkNode); // prevent native title to popup
    if (mgsuite.overlay.aioTTTimer) clearTimeout(mgsuite.overlay.aioTTTimer);
    linkNode.addEventListener("mouseout", mgsuite.tooltip.aioEraseTitlePopup, true);
    window.addEventListener("mousedown", mgsuite.tooltip.aioEraseTitlePopup, true);
    window.addEventListener("wheel", mgsuite.tooltip.aioEraseTitlePopup, true);
    mgsuite.overlay.aioTTNode = linkNode;
    mgsuite.overlay.aioTTTimer = setTimeout(function(a, b){mgsuite.tooltip.aioShowTitlePopup(a, b);},
                            mgsuite.overlay.aioShiftForTitle ? 50 : mgsuite.overlay.aioTitleDelay, e.screenX, e.screenY);
  },

  aioShowTitlePopup: function(X, Y) {
    mgsuite.overlay.aioTTShown = true;
    mgsuite.overlay.aioTTTimer = null;
    mgsuite.overlay.aioTTPU = new mgsuite.overlay.aioPopUp(0, 0, 0, false, "tooltip", X, Y, mgsuite.tooltip.aioHasNewWindowTarget(mgsuite.overlay.aioTTNode),
                           null, mgsuite.overlay.aioLinkTTPopping, null);
    mgsuite.overlay.aioTTPU.createPopup(mgsuite.tooltip.aioGetTextForTitle(mgsuite.overlay.aioTTNode), mgsuite.overlay.aioGetHRef(mgsuite.overlay.aioTTNode), "");
    mgsuite.overlay.aioTTTimer = setTimeout(function(){mgsuite.tooltip.aioEraseTitlePopup(null);}, mgsuite.overlay.aioTitleDuration);
  },

  aioEraseTitlePopup: function(e) {
    if (mgsuite.overlay.aioTTTimer) {
       clearTimeout(mgsuite.overlay.aioTTTimer);
       mgsuite.overlay.aioTTTimer = null;
    }
    mgsuite.overlay.aioTTNode.removeEventListener("mouseout", mgsuite.tooltip.aioEraseTitlePopup, true);
    window.removeEventListener("mousedown", mgsuite.tooltip.aioEraseTitlePopup, true);
    window.removeEventListener("wheel", mgsuite.tooltip.aioEraseTitlePopup, true);
    if (mgsuite.overlay.aioTTShown) mgsuite.overlay.aioTTPU.closePopup(0);
    mgsuite.overlay.aioTTPU = null; mgsuite.overlay.aioTTNode = null;
    if (e && e.type == "mousedown") {
       mgsuite.overlay.aioTTShown = true;
       setTimeout(function(){mgsuite.overlay.aioTTShown = false;}, 2000);
    }
    else mgsuite.overlay.aioTTShown = false;
  },
}



window.addEventListener("load",
  function() {
    if (mgsuite.overlay.aioInitStarted) return;
    mgsuite.overlay.aioStartUp();
  },
  false);

// With each window focusing we save current and previous window in global variable
// because we will need previous window for double-stack windows option
// (we can't use z-order of windows because it's broken on Linux)
window.addEventListener("activate", function() {
  var curwin = MGStorage.get("curWindow");
  
  if (curwin == window) {
	return;
  }
  
  if (curwin) {
    MGStorage.set("lastWindow", curwin);
  }
  
  MGStorage.set("curWindow", window);
});