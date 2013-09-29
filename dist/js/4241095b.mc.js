!function(){"use strict";function a(a,b,c){g[a]?console.warn("You are trying to register an already registered component: ",a):("function"==typeof b&&(c=b,b=null),g[a]={factory:c,dependencies:b,instance:null})}function b(a,c,d){console.debug("Initializing component: ",a);var e,f,h=g[a],i=[],j=d||{};if(h)if(h.instance)console.warn("You are trying to start an already started component: ",a);else try{h.dependencies&&h.dependencies.forEach(function(d){f=g[d],f?f.instance?(i.push(f.instance),console.debug("Dependency already initialized: ",d)):i.push(b(d,c)):console.warn('You were trying to initialize component "',a,'" with an unknown dependency: ',d)}),e=h.instance=h.factory.apply(null,[c].concat(i)),"function"==typeof h.instance.init&&(h.instance.init.call(c,j.mainEl),console.debug("Component started: ",a))}catch(k){console.error('There was an error starting the component "',a,'":',k.message,"\n",k.stack)}else console.warn("You are trying to start an unregistered component: ",a);return e}function c(a){var b=g[a];b?b.instance?("function"==typeof b.instance.stop&&b.instance.stop.call(),delete b.instance):console.warn("You are trying to stop a non started component: ",a):console.warn("You are trying to stop an unknown component: ",a)}function d(a){console.debug("Time until parser gets to core initialization from top document:",Date.now()-window._pageInitialTime),console.debug("Initializing core...");var c,d,e=Date.now(),g=document.querySelectorAll("*[data-comp]");for(f=a,c=0,d=g.length;d>c;c++)b(g[c].getAttribute("data-comp"),f,{mainEl:g[c]});console.debug("Time consumed to initialize the core: ",Date.now()-e," (ms)"),console.debug("Time consumed from document top until core is initialized:",Date.now()-window._pageInitialTime)}var e="MusicCenter",f={},g={};window[e]={register:a,init:d,startComponent:b,stopComponent:c}}(),function(a){"use strict";a.register("plugins/events-manager",function(){function a(a,b){var c=d[a]||[];c.push(b),d[a]=c}function b(a,b){var c,e,f=d[a],g=-1,h=!1;if(f){for(c=0,e=f.length;e>i;i++)if(f[i]===b){g=c;break}g&&(h=f.splice(g,1).length>0,d[a]=f)}return h}function c(a,b){var c=d[a];c&&c.forEach(function(c){try{c(b)}catch(d){console.warn("There was an error executing a event listener. Event name: ",a,". Context: ",b,". Listener name: ",c.name),console.error(d.stack)}})}var d={};return{listen:a,stopListening:b,trigger:c}})}(window.MusicCenter),function(a){"use strict";a.register("plugins/dom",["plugins/dom-element"],function(a,b){function c(a){return i.findById(a)}function d(a,b){return b=b||i,b.findEl(a)}function e(a,b){return b=b||i,b.findEls(a)}function f(a){a&&a.setStyle("display","none")}function g(a){a&&a.setStyle("display","inherit")}function h(a){var c=a.findEls(".tab"),d=a.findEls(".tabContent");c.forEach(function(a){a.listen("click",function(a){var e=new b(a.currentTarget);a.preventDefault(),c.forEach(function(a){a.removeClass("active")}),e.addClass("active"),d.forEach(function(a){a.setStyle("display",e.attr("data-tabContent")===a.attr("id")?"inherit":"none")})})})}var i=new b(document);return{findById:c,findEl:d,findEls:e,showEl:f,hideEl:g,configureTabs:h}})}(window.MusicCenter),function(a){"use strict";a.register("plugins/dom-element",function(){function a(a){this.el=a,this.customData={}}return a.prototype={findById:function(b){var c="function"==typeof this.el.getElementById?this.el.getElementById(b):this.el.querySelector("#"+b);return c?new a(c):null},findEl:function(b){var c=this.el.querySelector(b);return c?new a(c):null},findEls:function(b){return Array.prototype.slice.call(this.el.querySelectorAll(b)).map(function(b){return new a(b)})},parent:function(b){var c,d=this.el.parentNode,e=null;return d&&(c=new a(d),e=d.className&&d.className.match(b)?c:c.parent(b)),e},listen:function(b,c,d){return"function"==typeof c&&(d=c,c=null),c?this.el.addEventListener(b,function(b){var e,f=b||window.event,g=f.target||f.srcElement;g&&(e=new a(g),(g.className.match(c)||(e=e.parent(c)))&&d.call(null,f,e))},!1):this.el.addEventListener(b,d,!1),this},stopListening:function(a){return this.el.removeEventListener(a),this},click:function(){this.el.click()},content:function(a){return"undefined"!=typeof a&&null!==a?(this.el.innerHTML=a,this):this.el.innerHTML},text:function(a){return a?(this.el.innerText=a,this):this.el.innerText},setStyle:function(a,b){return"object"==typeof a?Object.keys(a).forEach(function(b){this.style[b]=a[b]},this.el):this.el.style[a]=b.constructor===Number?b+"px":b,this},addClass:function(a){return this.el.classList.add(a),this},removeClass:function(a){return this.el.classList.remove(a),this},toggleClass:function(a){return this.el.classList.toggle(a),this},hasClass:function(a){return this.el.classList.contains(a)},size:function(){return{width:this.el.offsetWidth,height:this.el.offsetHeight}},data:function(a,b){return"undefined"==typeof b?this.customData[a]:(this.customData[a]=b,this)},attr:function(a,b){return"undefined"==typeof b?this.el.getAttribute(a):(this.el.setAttribute(a,b),void 0)},value:function(){return this.el.value}},a})}(window.MusicCenter),function(a,b){a.register("plugins/ajax",["plugins/utils"],function(a,c){function d(a,d){var e=new XMLHttpRequest,f=b.defer(),g={method:"GET"};return d=c.merge(g,d),e.open(d.method,a,!0),e.onreadystatechange=function(){4===e.readyState&&(e.status<400||0===e.status&&e.responseText?f.resolve(e.responseText,e):f.reject(e))},e.send("POST"===d.method?d.body:null),f.promise}function e(a,b){return d(a,b)}function f(a,b){return b.method="POST",f(a,b)}function g(a,c){var e=b.defer();return d(a,c).then(function(a,b){e.resolve(JSON.parse(a),b)},function(a){e.reject(a)}),e.promise}return{send:d,get:e,post:f,getJson:g}}),console.debug("AJAX plugin registered!")}(window.MusicCenter,window.Q),function(a){a.register("plugins/utils",function(){function a(){var a={};return Array.prototype.slice.call(arguments).forEach(function(b){var c;if(b)for(c in b)a[c]=b[c]}),a}function b(a){var b,c=[];for(b in a)a.hasOwnProperty(b)&&Array.prototype.push.apply(c,[b,"=",a[b],"&"]);return c.pop(),c.join("")}return{merge:a,param:b}})}(window.MusicCenter),function(a,b){"use strict";a.register("plugins/lastfm",["plugins/ajax","plugins/models","plugins/utils"],function(a,c,d,e){function f(a,d,f){var g=b.defer(),h=m[d],i=e.merge({method:h+".search",offset:1,limit:10,api_key:l,format:"json"},f);return i[h]=a,c.getJson(k+e.param(i)).then(function(a){var b,c=[];a.error?(console.info("Lastfm search request error: ",a),g.reject(new Error(a.message))):(b=a.results[h+"matches"][h],Array.isArray(b)||(b=[b]),b.forEach(function(a){c.push(new d(a))}),g.resolve(c))},function(a){console.info("Lastfm request error: ",a),g.reject(new Error(a.message))}),g.promise}function g(a){var f=b.defer(),g=[],h={page:1,limit:20,method:"artist.gettopalbums",format:"json",api_key:l};return a.externalId?h.mbid=a.externalId:h.artist=a.name,c.getJson(k+e.param(h)).then(function(a){var b;a.error?f.reject(new Error(a.message)):(b=a.topalbums.album,b&&(Array.isArray(b)||(b=[b]),b.forEach(function(a){g.push(new d.Album(a))})),f.resolve(g))},function(a){f.reject(new Error(a.message))}),f.promise}function h(a,f){var g=b.defer(),h=e.merge({method:"album.getinfo",offset:1,limit:10,api_key:l,format:"json"},f);return a.externalId?h.mbid=a.externalId:(h.album=a.title,h.artist=a.artist.name),c.getJson(k+e.param(h)).then(function(a){a.error?(console.info("Lastfm get album info error: ",a),g.reject(new Error(a.message))):g.resolve(new d.Album(a.album))},function(a){console.error("Lastfm get album info error: ",a),g.reject(new Error(a.message))}),g.promise}function i(a,c){var e;return c.withAlbums?(e=b.defer(),f(a,d.Artist,c).then(function(a){var c=a.map(function(a){return g(a)});b.all(c).then(function(b){e.resolve(a.map(function(a,c){return a.albums=b[c],a}))},function(a){e.reject(a)})},function(a){e.reject(a)}),e.promise):f(a,d.Artist,c)}function j(a,b){return f(a,d.Album,b)}var k="http://ws.audioscrobbler.com/2.0/?",l="b57b804c3dc371d824c9adac24b7e0a2",m={};return m[d.Artist]="artist",m[d.Album]="album",m[d.Track]="track",{searchArtist:i,searchAlbum:j,getArtistAlbums:g,getAlbumInfo:h}})}(window.MusicCenter,window.Q),function(a,b){"use strict";a.register("plugins/models",function(){function a(b){var c;b?(this.externalId=b.mbid||b.externalId,b.image&&(this.images=b.image.map(function(a){return{size:a.size,url:a["#text"]}}),c={},b.image.forEach(function(a){c[a.size]=a["#text"]}),this.images=c)):this.parent=a}function c(a){this.parent(a),this.title=a.name||a.title,this.artist=a.artist,this.album=a.album,this.duration=b().startOf("day").add(b.duration({s:a.duration})).format("mm:ss"),this.externalId||(this.externalId="lfm|#|"+this.title+"|#|"+this.artist)}function d(a){if(this.parent(a),this.title=a.name,this.artist=a.artist,a.releasedate&&a.releasedate.length>4&&(this.releaseDate=b(a.releasedate.trim(),"D MMM YYYY, HH:mm"),this.releaseYear=this.releaseDate.format("YYYY")),a.tracks){var d=[],e=Array.isArray(a.tracks.track)?a.tracks.track:[a.tracks.track];e.forEach(function(a){d.push(new c({externalId:a.mbid,title:a.name,duration:a.duration,artist:a.artist.name,album:this.title}))},this),this.tracks=d}}function e(a){this.parent(a),a&&(this.name=a.name)}return a.prototype.getThumb=function(){return this.images?this.images[1].url:void 0},a.prototype.getImageUrl=function(a){var b,c,d="";if(this.images)for(b=0,c=this.images.length;c>b;b++)if(this.images[b].size===a){d=this.images[b].url;break}return d},c.prototype=new a,c.prototype.toString=function(){return"Track: "+this.title+" by "+this.album},d.prototype=new a,d.prototype.toString=function(){return"Album: "+this.title+" by "+this.artist},e.prototype=new a,e.prototype.toString=function(){return"Artist: "+this.name},{Track:c,Album:d,Artist:e}})}(window.MusicCenter,window.moment),function(a,b){"use strict";a.register("plugins/templates",["plugins/dom"],function(a,c){function d(a,d){var f=e[a];if(!f){if(f=c.findById(a),!f)throw new Error("Could not find any template with id #"+a+" in the document");f=b.compile(f.content()),e[a]=f}return Object.keys(d).forEach(function(a){Array.isArray(d[a])&&(d[a]=d[a].map(function(a,b){return a.index=b,a}))}),f(d)}var e={};return{render:d}})}(window.MusicCenter,window.Mustache),function(a,b){"use strict";a.register("plugins/goear",["plugins/ajax"],function(a,c){function d(a){var d=b.defer(),e=encodeURIComponent(a);return c.getJson(f.replace(/\{searchTerm\}/,e)).then(function(a){console.debug(a),d.resolve(a)},function(a){d.reject(a)}),d.promise}function e(a){var c=b.defer(),e=a.artist+" "+a.title;return d(e).then(function(a){a.tracks.length?c.resolve(a):(e=e.replace(/\(.*\)/,"").replace(/\[.*\]/,""),d(e).then(function(a){c.resolve(a)},function(a){c.reject(a)}))},function(a){c.reject(a)}),c.promise}var f="http://geproxy.eu01.aws.af.cm/search/{searchTerm}?timeout=2000&resultsCount=5&minQuality=128";return{getSongUrls:e}})}(window.MusicCenter,window.Q),function(a){"use strict";a.register("seekerModule",["plugins/events-manager","plugins/dom","plugins/dom-element","plugins/lastfm"],function(a,b,c,d,e){function f(a){a.preventDefault(),e.searchArtist(i.value(),{withAlbums:!0}).then(function(a){b.trigger("new-search-results",a)})}function g(a){var b;h=new d(a),i=h.findEl('input[name="query"]'),b=h.findById("searchForm"),b.listen("submit",f)}var h,i;return{init:g}})}(window.MusicCenter),function(a){"use strict";a.register("searchResultsModule",["plugins/events-manager","plugins/dom","plugins/templates","plugins/lastfm"],function(a,b,c,d,e){function f(a){var b,c;if(o)for(b=0;c=o.length,c>b;b++)if(o[b].title===a.title){o[b]=a;break}}function g(){b.listen("new-search-results",function(a){a&&a.length?(n=a,j.content(d.render("artistSearchResultTpl",{artists:a})),l.click()):alert("No artists found!")})}function h(){j.listen("click","title",function(a,b){var g=b.parent("artist"),h=g.attr("data-index"),i=g.findEl(".subheader");i&&(k.content(d.render("albumSearchResultTpl",{albums:n[h].albums})),m.click(),o=n[h].albums,n[h].albums.forEach(function(a,b){e.getAlbumInfo(a).then(function(a){var e=c.findEl('li.album[data-index="'+b+'"]');f(a),e.findEl(".subtitle").content(d.render("albumExtraInfoTpl",a)),e.findEl(".actions").setStyle("visibility","visible")},function(b){console.warn("There was an error looking for an album details:",a.title,"--",b.message),console.error(b.stack)})}))}),k.listen("click","actionIcon",function(a,c){var d=c.parent("album").attr("data-index");b.trigger("playAlbum",o[d])})}function i(){j=c.findEl("#artistResults .results"),k=c.findEl("#albumsResults .results"),l=c.findEl("*[data-tabcontent=artistResults]"),m=c.findEl("*[data-tabcontent=albumsResults]"),c.configureTabs(c.findEl("#searchResults .row")),g(),h()}var j,k,l,m,n,o;return{init:i}})}(window.MusicCenter),function(a){"use strict";a.register("playerModule",["plugins/events-manager","plugins/dom","plugins/dom-element","plugins/templates","plugins/goear"],function(a,b,c,d,e,f){function g(){o.data("visible")?(o.setStyle("left",-1*o.size().width+"px"),o.data("visible",!1)):(o.setStyle("left","0px"),o.data("visible",!0))}function h(a){var b=q.tracks[a],c=o.findEl('.track[data-index="'+a+'"]');b&&(n.content(e.render("trackItemTpl",b)),f.getSongUrls(b).then(function(d){console.debug("These are the links received:",d),d.tracks.length?(r=d.tracks,s=a,t=0,p.el.src=r[t].link,p.el.load(),p.el.play(),o.findEls(".track").forEach(function(a){a.removeClass("current")}),c.addClass("current")):(console.warn("PlayerModule::play# No file found for track:",b),h(s++))},function(a){console.warn("There was an error looking for a song links:",b),console.error(a.stack)}))}function i(){b.listen("playAlbum",function(a){q=a,o.content(e.render("playlistTpl",a)),g(),setTimeout(function(){g()},3e3),h(0)})}function j(){m.findEl(".currentTrack").listen("click",g),o.listen("click","play",function(a,b){h(b.parent("track").attr("data-index"))}),o.listen("click","change",function(a,b){b.parent("track").attr("data-index")==s&&(console.debug("Available files:",r),r&&r.length>1&&(console.debug("Current file:",r[t].link),t=t>=r.length-1?0:t+1,console.debug("New file:",r[t].link),p.el.src=r[t].link,p.el.load(),p.el.play()))})}function k(){p.listen("ended",function(){console.info("PlayerModule::configurePlayer# Song has finished!!!"),++s<q.tracks.length&&h(s)})}function l(a){m=new d(a),n=m.findEl(".currentTrack"),o=m.findEl(".playlist"),p=c.findEl("#player .audio"),k(),i(),j()}var m,n,o,p,q,r,s,t;return{init:l}})}(window.MusicCenter);