import gulp from 'gulp';
import plumber from 'gulp-plumber';
import modernizr from 'gulp-modernizr';
import uglify from 'gulp-uglify';
import config from '../config';

gulp.task('mdnz', () => {
  return gulp.src('./src/js/*.js')
    .pipe(modernizr('modernizr.js', {
      // uncomment/comment based on your needs
      options: [
        "addTest",
        // "atRule",
        // "domPrefixes",
        // "hasEvent",
        // "html5shiv",
        "html5printshiv",
        // "load",
        // "mq",
        // "prefixed",
        // "prefixes",
        // "prefixedCSS",
        "setClasses",
        // "testAllProps",
        "testProp",
        // "testStyles",
        "fnBind"
      ],
      tests: [
        // "adownload",
        // "applicationcache",
        // "audio",
        // "audioloop",
        // "audiopreload",
        // "audiowebaudio",
        // "battery",
        // "batterylowbattery",
        // "blob",
        // "canvas",
        "canvasblending",
        "canvastodataurl",
        "canvaswinding",
        "canvastext",
        "contenteditable",
        // "contextmenu",
        "cookies",
        // "cors",
        // "crypto",
        // "cryptogetrandomvalues",
        "cssall",
        // "cssanimations",
        "cssappearance",
        "cssbackdropfilter",
        "cssbackgroundblendmode",
        "cssbackgroundcliptext",
        // "cssbackgroundposition-shorthand",
        // "cssbackgroundposition-xy",
        // "cssbackgroundrepeat",
        // "cssbackgroundsize",
        // "cssbackgroundsizecover",
        "cssborderimage",
        // "cssborderradius",
        // "cssboxshadow",
        // "cssboxsizing",
        // "csscalc",
        // "csschecked",
        // "csschunit",
        "csscolumns",
        // "csscubicbezierrange",
        "cssdisplayrunin",
        // "cssdisplaytable",
        "cssellipsis",
        // "cssescape",
        // "cssexunit",
        "cssfilters",
        "cssflexbox",
        "cssflexboxlegacy",
        "cssflexboxtweener",
        "cssflexwrap",
        // "cssfontface",
        // "cssgeneratedcontent",
        // "cssgradients",
        "csshairline",
        // "csshsla",
        "csshyphens",
        "cssinvalid",
        "csslastchild",
        "cssmask",
        // "cssmediaqueries",
        // "cssmultiplebgs",
        // "cssnthchild",
        "cssobjectfit",
        // "cssopacity",
        "cssoverflow-scrolling",
        "csspointerevents",
        "csspositionsticky",
        "csspseudoanimations",
        "csspseudotransitions",
        "cssreflections",
        "cssregions",
        // "cssremunit",
        "cssresize",
        // "cssrgba",
        // "cssscrollbars",
        "cssscrollsnappoints",
        "cssshapes",
        "csssiblinggeneral",
        "csssubpixelfont",
        "csssupports",
        "csstarget",
        "csstextalignlast",
        "csstextshadow",
        // "csstransforms",
        // "csstransforms3d",
        "csstransformstylepreserve3d",
        // "csstransitions",
        "cssuserselect",
        "cssvalid",
        // "cssvhunit",
        // "cssvmaxunit",
        // "cssvminunit",
        // "cssvwunit",
        "csswill-change",
        "csswrapflow",
        // "custom-protocol-handler",
        // "customevent",
        // "dart",
        // "dataview-api",
        // "domclasslist",
        // "domcreateElement-attrs",
        // "domdataset",
        // "domdocumentfragment",
        // "domhidden",
        // "dommicrodata",
        // "dommutationObserver",
        // "dompassiveeventlisteners",
        // "elembdi",
        // "elemdatalist",
        // "elemdetails",
        // "elemoutput",
        // "elempicture",
        // "elemprogress-meter",
        // "elemruby",
        // "elemtemplate",
        // "elemtime",
        // "elemtrack",
        // "elemunknown",
        // "emoji",
        // "es5array",
        // "es5date",
        // "es5function",
        // "es5object",
        // "es5specification",
        // "es5strictmode",
        // "es5string",
        // "es5syntax",
        // "es5undefined",
        // "es6array",
        // "es6collections",
        // "es6contains",
        // "es6generators",
        // "es6math",
        // "es6number",
        // "es6object",
        // "es6promises",
        // "es6string",
        // "eventdeviceorientation-motion",
        // "eventoninput",
        // "eventlistener",
        // "exif-orientation",
        "fileapi",
        "filefilesystem",
        // "flash",
        // "formscapture",
        // "formsfileinput",
        // "formsfileinputdirectory",
        // "formsformattribute",
        // "formsinputnumber-l10n",
        // "formsplaceholder",
        // "formsrequestautocomplete",
        // "formsvalidation",
        // "fullscreen-api",
        // "gamepad",
        "geolocation",
        // "hashchange",
        // "hiddenscroll",
        "history",
        // "htmlimports",
        // "ie8compat",
        // "iframesandbox",
        // "iframeseamless",
        // "iframesrcdoc",
        // "imgapng",
        // "imgcrossorigin",
        // "imgjpeg2000",
        // "imgjpegxr",
        "imgsizes",
        "imgsrcset",
        // "imgwebp",
        // "imgwebp-alpha",
        // "imgwebp-animation",
        // "imgwebp-lossless",
        // "indexeddb",
        // "indexeddbblob",
        // "input",
        // "inputformaction",
        // "inputformenctype",
        // "inputformmethod",
        // "inputformtarget",
        // "inputsearchevent",
        // "inputtypes",
        // "intl",
        // "json",
        // "ligatures",
        // "lists-reversed",
        // "mathml",
        // "mediaqueryhovermq",
        // "mediaquerypointermq",
        // "messagechannel",
        // "networkbeacon",
        // "networkconnection",
        // "networkeventsource",
        // "networkfetch",
        // "networkxhr-responsetype",
        // "networkxhr-responsetype-arraybuffer",
        // "networkxhr-responsetype-blob",
        // "networkxhr-responsetype-document",
        // "networkxhr-responsetype-json",
        // "networkxhr-responsetype-text",
        // "networkxhr2",
        // "notification",
        // "pagevisibility-api",
        "performance",
        "pointerevents",
        // "pointerlock-api",
        // "postmessage",
        // "proximity",
        // "queryselector",
        // "quota-management-api",
        // "requestanimationframe",
        // "scriptasync",
        // "scriptdefer",
        // "serviceworker",
        // "speechspeech-recognition",
        // "speechspeech-synthesis",
        // "storagelocalstorage",
        // "storagesessionstorage",
        // "storagewebsqldatabase",
        // "stylescoped",
        // "svg",
        "svgasimg",
        "svgclippaths",
        "svgfilters",
        "svgforeignobject",
        "svginline",
        // "svgsmil",
        // "templatestrings",
        // "textareamaxlength",
        // "touchevents",
        // "typed-arrays",
        // "unicode",
        // "unicode-range",
        // "urlbloburls",
        // "urldata-uri",
        // "urlparser",
        // "urlurlsearchparams",
        // "userdata",
        // "vibration",
        // "video",
        // "videoautoplay",
        // "videocrossorigin",
        // "videoloop",
        // "videopreload",
        // "vml",
        // "web-intents",
        "webanimations",
        "webgl",
        "webglextensions"/*,
        "webrtcdatachannel",
        "webrtcgetusermedia",
        "webrtcpeerconnection",
        "websockets",
        "websocketsbinary",
        "windowframed",
        "workersblobworkers",
        "workersdataworkers",
        "workerssharedworkers",
        "workerstransferables",
        "workerswebworkers",
        "xdomainrequest"*/
      ]
    }))
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(`${config.build}/js/vendor`))
});
