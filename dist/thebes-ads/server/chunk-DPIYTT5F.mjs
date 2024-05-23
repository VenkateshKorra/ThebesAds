import './polyfills.server.mjs';
import"./chunk-FME56UVT.mjs";function x(r){"@babel/helpers - typeof";return x=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},x(r)}function ke(r,n){return ke=Object.setPrototypeOf||function(u,c){return u.__proto__=c,u},ke(r,n)}function Gt(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function se(r,n,o){return Gt()?se=Reflect.construct:se=function(c,S,y){var D=[null];D.push.apply(D,S);var k=Function.bind.apply(c,D),X=new k;return y&&ke(X,y.prototype),X},se.apply(null,arguments)}function N(r){return Wt(r)||Bt(r)||$t(r)||jt()}function Wt(r){if(Array.isArray(r))return Pe(r)}function Bt(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function $t(r,n){if(r){if(typeof r=="string")return Pe(r,n);var o=Object.prototype.toString.call(r).slice(8,-1);if(o==="Object"&&r.constructor&&(o=r.constructor.name),o==="Map"||o==="Set")return Array.from(r);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return Pe(r,n)}}function Pe(r,n){(n==null||n>r.length)&&(n=r.length);for(var o=0,u=new Array(n);o<n;o++)u[o]=r[o];return u}function jt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var Xt=Object.hasOwnProperty,ut=Object.setPrototypeOf,Yt=Object.isFrozen,Vt=Object.getPrototypeOf,qt=Object.getOwnPropertyDescriptor,h=Object.freeze,b=Object.seal,Kt=Object.create,Tt=typeof Reflect<"u"&&Reflect,fe=Tt.apply,Fe=Tt.construct;fe||(fe=function(n,o,u){return n.apply(o,u)});h||(h=function(n){return n});b||(b=function(n){return n});Fe||(Fe=function(n,o){return se(n,N(o))});var Zt=O(Array.prototype.forEach),ft=O(Array.prototype.pop),Z=O(Array.prototype.push),ue=O(String.prototype.toLowerCase),Ne=O(String.prototype.toString),ct=O(String.prototype.match),M=O(String.prototype.replace),Jt=O(String.prototype.indexOf),Qt=O(String.prototype.trim),v=O(RegExp.prototype.test),De=er(TypeError);function O(r){return function(n){for(var o=arguments.length,u=new Array(o>1?o-1:0),c=1;c<o;c++)u[c-1]=arguments[c];return fe(r,n,u)}}function er(r){return function(){for(var n=arguments.length,o=new Array(n),u=0;u<n;u++)o[u]=arguments[u];return Fe(r,o)}}function s(r,n,o){var u;o=(u=o)!==null&&u!==void 0?u:ue,ut&&ut(r,null);for(var c=n.length;c--;){var S=n[c];if(typeof S=="string"){var y=o(S);y!==S&&(Yt(n)||(n[c]=y),S=y)}r[S]=!0}return r}function H(r){var n=Kt(null),o;for(o in r)fe(Xt,r,[o])===!0&&(n[o]=r[o]);return n}function oe(r,n){for(;r!==null;){var o=qt(r,n);if(o){if(o.get)return O(o.get);if(typeof o.value=="function")return O(o.value)}r=Vt(r)}function u(c){return console.warn("fallback value for",c),null}return u}var pt=h(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ce=h(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),we=h(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),tr=h(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ie=h(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),rr=h(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),mt=h(["#text"]),dt=h(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),xe=h(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),_t=h(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),le=h(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ar=b(/\{\{[\w\W]*|[\w\W]*\}\}/gm),nr=b(/<%[\w\W]*|[\w\W]*%>/gm),ir=b(/\${[\w\W]*}/gm),or=b(/^data-[\-\w.\u00B7-\uFFFF]/),lr=b(/^aria-[\-\w]+$/),sr=b(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ur=b(/^(?:\w+script|data):/i),fr=b(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),cr=b(/^html$/i),pr=b(/^[a-z][.\w]*(-[.\w]+)+$/i),mr=function(){return typeof window>"u"?null:window},dr=function(n,o){if(x(n)!=="object"||typeof n.createPolicy!="function")return null;var u=null,c="data-tt-policy-suffix";o.currentScript&&o.currentScript.hasAttribute(c)&&(u=o.currentScript.getAttribute(c));var S="dompurify"+(u?"#"+u:"");try{return n.createPolicy(S,{createHTML:function(D){return D},createScriptURL:function(D){return D}})}catch{return console.warn("TrustedTypes policy "+S+" could not be created."),null}};function vt(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:mr(),n=function(e){return vt(e)};if(n.version="2.5.2",n.removed=[],!r||!r.document||r.document.nodeType!==9)return n.isSupported=!1,n;var o=r.document,u=r.document,c=r.DocumentFragment,S=r.HTMLTemplateElement,y=r.Node,D=r.Element,k=r.NodeFilter,X=r.NamedNodeMap,ht=X===void 0?r.NamedNodeMap||r.MozNamedAttrMap:X,Et=r.HTMLFormElement,At=r.DOMParser,J=r.trustedTypes,Q=D.prototype,yt=oe(Q,"cloneNode"),gt=oe(Q,"nextSibling"),St=oe(Q,"childNodes"),Y=oe(Q,"parentNode");if(typeof S=="function"){var ce=u.createElement("template");ce.content&&ce.content.ownerDocument&&(u=ce.content.ownerDocument)}var R=dr(J,o),pe=R?R.createHTML(""):"",ee=u,me=ee.implementation,bt=ee.createNodeIterator,Ot=ee.createDocumentFragment,Rt=ee.getElementsByTagName,Lt=o.importNode,Ue={};try{Ue=H(u).documentMode?u.documentMode:{}}catch{}var C={};n.isSupported=typeof Y=="function"&&me&&me.createHTMLDocument!==void 0&&Ue!==9;var de=ar,_e=nr,Te=ir,Mt=or,Nt=lr,Dt=ur,He=fr,Ct=pr,ve=sr,p=null,ze=s({},[].concat(N(pt),N(Ce),N(we),N(Ie),N(mt))),m=null,Ge=s({},[].concat(N(dt),N(xe),N(_t),N(le))),f=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),V=null,he=null,We=!0,Ee=!0,Be=!1,$e=!0,z=!1,je=!0,P=!1,Ae=!1,ye=!1,G=!1,te=!1,re=!1,Xe=!0,Ye=!1,wt="user-content-",ge=!0,q=!1,W={},B=null,Ve=s({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),qe=null,Ke=s({},["audio","video","img","source","image","track"]),Se=null,Ze=s({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ae="http://www.w3.org/1998/Math/MathML",ne="http://www.w3.org/2000/svg",w="http://www.w3.org/1999/xhtml",$=w,be=!1,Oe=null,It=s({},[ae,ne,w],Ne),F,xt=["application/xhtml+xml","text/html"],kt="text/html",d,j=null,Je=255,Pt=u.createElement("form"),Qe=function(e){return e instanceof RegExp||e instanceof Function},Re=function(e){j&&j===e||((!e||x(e)!=="object")&&(e={}),e=H(e),F=xt.indexOf(e.PARSER_MEDIA_TYPE)===-1?F=kt:F=e.PARSER_MEDIA_TYPE,d=F==="application/xhtml+xml"?Ne:ue,p="ALLOWED_TAGS"in e?s({},e.ALLOWED_TAGS,d):ze,m="ALLOWED_ATTR"in e?s({},e.ALLOWED_ATTR,d):Ge,Oe="ALLOWED_NAMESPACES"in e?s({},e.ALLOWED_NAMESPACES,Ne):It,Se="ADD_URI_SAFE_ATTR"in e?s(H(Ze),e.ADD_URI_SAFE_ATTR,d):Ze,qe="ADD_DATA_URI_TAGS"in e?s(H(Ke),e.ADD_DATA_URI_TAGS,d):Ke,B="FORBID_CONTENTS"in e?s({},e.FORBID_CONTENTS,d):Ve,V="FORBID_TAGS"in e?s({},e.FORBID_TAGS,d):{},he="FORBID_ATTR"in e?s({},e.FORBID_ATTR,d):{},W="USE_PROFILES"in e?e.USE_PROFILES:!1,We=e.ALLOW_ARIA_ATTR!==!1,Ee=e.ALLOW_DATA_ATTR!==!1,Be=e.ALLOW_UNKNOWN_PROTOCOLS||!1,$e=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,z=e.SAFE_FOR_TEMPLATES||!1,je=e.SAFE_FOR_XML!==!1,P=e.WHOLE_DOCUMENT||!1,G=e.RETURN_DOM||!1,te=e.RETURN_DOM_FRAGMENT||!1,re=e.RETURN_TRUSTED_TYPE||!1,ye=e.FORCE_BODY||!1,Xe=e.SANITIZE_DOM!==!1,Ye=e.SANITIZE_NAMED_PROPS||!1,ge=e.KEEP_CONTENT!==!1,q=e.IN_PLACE||!1,ve=e.ALLOWED_URI_REGEXP||ve,$=e.NAMESPACE||w,f=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&Qe(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(f.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&Qe(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(f.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(f.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),z&&(Ee=!1),te&&(G=!0),W&&(p=s({},N(mt)),m=[],W.html===!0&&(s(p,pt),s(m,dt)),W.svg===!0&&(s(p,Ce),s(m,xe),s(m,le)),W.svgFilters===!0&&(s(p,we),s(m,xe),s(m,le)),W.mathMl===!0&&(s(p,Ie),s(m,_t),s(m,le))),e.ADD_TAGS&&(p===ze&&(p=H(p)),s(p,e.ADD_TAGS,d)),e.ADD_ATTR&&(m===Ge&&(m=H(m)),s(m,e.ADD_ATTR,d)),e.ADD_URI_SAFE_ATTR&&s(Se,e.ADD_URI_SAFE_ATTR,d),e.FORBID_CONTENTS&&(B===Ve&&(B=H(B)),s(B,e.FORBID_CONTENTS,d)),ge&&(p["#text"]=!0),P&&s(p,["html","head","body"]),p.table&&(s(p,["tbody"]),delete V.tbody),h&&h(e),j=e)},et=s({},["mi","mo","mn","ms","mtext"]),tt=s({},["foreignobject","annotation-xml"]),Ft=s({},["title","style","font","a","script"]),ie=s({},Ce);s(ie,we),s(ie,tr);var Le=s({},Ie);s(Le,rr);var Ut=function(e){var t=Y(e);(!t||!t.tagName)&&(t={namespaceURI:$,tagName:"template"});var a=ue(e.tagName),l=ue(t.tagName);return Oe[e.namespaceURI]?e.namespaceURI===ne?t.namespaceURI===w?a==="svg":t.namespaceURI===ae?a==="svg"&&(l==="annotation-xml"||et[l]):!!ie[a]:e.namespaceURI===ae?t.namespaceURI===w?a==="math":t.namespaceURI===ne?a==="math"&&tt[l]:!!Le[a]:e.namespaceURI===w?t.namespaceURI===ne&&!tt[l]||t.namespaceURI===ae&&!et[l]?!1:!Le[a]&&(Ft[a]||!ie[a]):!!(F==="application/xhtml+xml"&&Oe[e.namespaceURI]):!1},g=function(e){Z(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch{try{e.outerHTML=pe}catch{e.remove()}}},Me=function(e,t){try{Z(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch{Z(n.removed,{attribute:null,from:t})}if(t.removeAttribute(e),e==="is"&&!m[e])if(G||te)try{g(t)}catch{}else try{t.setAttribute(e,"")}catch{}},rt=function(e){var t,a;if(ye)e="<remove></remove>"+e;else{var l=ct(e,/^[\r\n\t ]+/);a=l&&l[0]}F==="application/xhtml+xml"&&$===w&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var E=R?R.createHTML(e):e;if($===w)try{t=new At().parseFromString(E,F)}catch{}if(!t||!t.documentElement){t=me.createDocument($,"template",null);try{t.documentElement.innerHTML=be?pe:E}catch{}}var T=t.body||t.documentElement;return e&&a&&T.insertBefore(u.createTextNode(a),T.childNodes[0]||null),$===w?Rt.call(t,P?"html":"body")[0]:P?t.documentElement:T},at=function(e){return bt.call(e.ownerDocument||e,e,k.SHOW_ELEMENT|k.SHOW_COMMENT|k.SHOW_TEXT|k.SHOW_PROCESSING_INSTRUCTION|k.SHOW_CDATA_SECTION,null,!1)},Ht=function(e){return e instanceof Et&&(typeof e.__depth<"u"&&typeof e.__depth!="number"||typeof e.__removalCount<"u"&&typeof e.__removalCount!="number"||typeof e.nodeName!="string"||typeof e.textContent!="string"||typeof e.removeChild!="function"||!(e.attributes instanceof ht)||typeof e.removeAttribute!="function"||typeof e.setAttribute!="function"||typeof e.namespaceURI!="string"||typeof e.insertBefore!="function"||typeof e.hasChildNodes!="function")},K=function(e){return x(y)==="object"?e instanceof y:e&&x(e)==="object"&&typeof e.nodeType=="number"&&typeof e.nodeName=="string"},I=function(e,t,a){C[e]&&Zt(C[e],function(l){l.call(n,t,a,j)})},nt=function(e){var t;if(I("beforeSanitizeElements",e,null),Ht(e)||v(/[\u0080-\uFFFF]/,e.nodeName))return g(e),!0;var a=d(e.nodeName);if(I("uponSanitizeElement",e,{tagName:a,allowedTags:p}),e.hasChildNodes()&&!K(e.firstElementChild)&&(!K(e.content)||!K(e.content.firstElementChild))&&v(/<[/\w]/g,e.innerHTML)&&v(/<[/\w]/g,e.textContent)||a==="select"&&v(/<template/i,e.innerHTML)||e.nodeType===7||je&&e.nodeType===8&&v(/<[/\w]/g,e.data))return g(e),!0;if(!p[a]||V[a]){if(!V[a]&&ot(a)&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a)))return!1;if(ge&&!B[a]){var l=Y(e)||e.parentNode,E=St(e)||e.childNodes;if(E&&l)for(var T=E.length,_=T-1;_>=0;--_){var U=yt(E[_],!0);U.__removalCount=(e.__removalCount||0)+1,l.insertBefore(U,gt(e))}}return g(e),!0}return e instanceof D&&!Ut(e)||(a==="noscript"||a==="noembed"||a==="noframes")&&v(/<\/no(script|embed|frames)/i,e.innerHTML)?(g(e),!0):(z&&e.nodeType===3&&(t=e.textContent,t=M(t,de," "),t=M(t,_e," "),t=M(t,Te," "),e.textContent!==t&&(Z(n.removed,{element:e.cloneNode()}),e.textContent=t)),I("afterSanitizeElements",e,null),!1)},it=function(e,t,a){if(Xe&&(t==="id"||t==="name")&&(a in u||a in Pt))return!1;if(!(Ee&&!he[t]&&v(Mt,t))){if(!(We&&v(Nt,t))){if(!m[t]||he[t]){if(!(ot(e)&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,e)||f.tagNameCheck instanceof Function&&f.tagNameCheck(e))&&(f.attributeNameCheck instanceof RegExp&&v(f.attributeNameCheck,t)||f.attributeNameCheck instanceof Function&&f.attributeNameCheck(t))||t==="is"&&f.allowCustomizedBuiltInElements&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a))))return!1}else if(!Se[t]){if(!v(ve,M(a,He,""))){if(!((t==="src"||t==="xlink:href"||t==="href")&&e!=="script"&&Jt(a,"data:")===0&&qe[e])){if(!(Be&&!v(Dt,M(a,He,"")))){if(a)return!1}}}}}}return!0},ot=function(e){return e!=="annotation-xml"&&ct(e,Ct)},lt=function(e){var t,a,l,E;I("beforeSanitizeAttributes",e,null);var T=e.attributes;if(T){var _={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:m};for(E=T.length;E--;){t=T[E];var U=t,L=U.name,A=U.namespaceURI;if(a=L==="value"?t.value:Qt(t.value),l=d(L),_.attrName=l,_.attrValue=a,_.keepAttr=!0,_.forceKeepAttr=void 0,I("uponSanitizeAttribute",e,_),a=_.attrValue,!_.forceKeepAttr&&(Me(L,e),!!_.keepAttr)){if(!$e&&v(/\/>/i,a)){Me(L,e);continue}z&&(a=M(a,de," "),a=M(a,_e," "),a=M(a,Te," "));var st=d(e.nodeName);if(it(st,l,a)){if(Ye&&(l==="id"||l==="name")&&(Me(L,e),a=wt+a),R&&x(J)==="object"&&typeof J.getAttributeType=="function"&&!A)switch(J.getAttributeType(st,l)){case"TrustedHTML":{a=R.createHTML(a);break}case"TrustedScriptURL":{a=R.createScriptURL(a);break}}try{A?e.setAttributeNS(A,L,a):e.setAttribute(L,a),ft(n.removed)}catch{}}}}I("afterSanitizeAttributes",e,null)}},zt=function i(e){var t,a=at(e);for(I("beforeSanitizeShadowDOM",e,null);t=a.nextNode();)if(I("uponSanitizeShadowNode",t,null),!nt(t)){var l=Y(t);t.nodeType===1&&(l&&l.__depth?t.__depth=(t.__removalCount||0)+l.__depth+1:t.__depth=1),t.__depth>=Je&&g(t),t.content instanceof c&&(t.content.__depth=t.__depth,i(t.content)),lt(t)}I("afterSanitizeShadowDOM",e,null)};return n.sanitize=function(i){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t,a,l,E,T;if(be=!i,be&&(i="<!-->"),typeof i!="string"&&!K(i))if(typeof i.toString=="function"){if(i=i.toString(),typeof i!="string")throw De("dirty is not a string, aborting")}else throw De("toString is not a function");if(!n.isSupported){if(x(r.toStaticHTML)==="object"||typeof r.toStaticHTML=="function"){if(typeof i=="string")return r.toStaticHTML(i);if(K(i))return r.toStaticHTML(i.outerHTML)}return i}if(Ae||Re(e),n.removed=[],typeof i=="string"&&(q=!1),q){if(i.nodeName){var _=d(i.nodeName);if(!p[_]||V[_])throw De("root node is forbidden and cannot be sanitized in-place")}}else if(i instanceof y)t=rt("<!---->"),a=t.ownerDocument.importNode(i,!0),a.nodeType===1&&a.nodeName==="BODY"||a.nodeName==="HTML"?t=a:t.appendChild(a);else{if(!G&&!z&&!P&&i.indexOf("<")===-1)return R&&re?R.createHTML(i):i;if(t=rt(i),!t)return G?null:re?pe:""}t&&ye&&g(t.firstChild);for(var U=at(q?i:t);l=U.nextNode();)if(!(l.nodeType===3&&l===E)&&!nt(l)){var L=Y(l);l.nodeType===1&&(L&&L.__depth?l.__depth=(l.__removalCount||0)+L.__depth+1:l.__depth=1),l.__depth>=Je&&g(l),l.content instanceof c&&(l.content.__depth=l.__depth,zt(l.content)),lt(l),E=l}if(E=null,q)return i;if(G){if(te)for(T=Ot.call(t.ownerDocument);t.firstChild;)T.appendChild(t.firstChild);else T=t;return(m.shadowroot||m.shadowrootmod)&&(T=Lt.call(o,T,!0)),T}var A=P?t.outerHTML:t.innerHTML;return P&&p["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&v(cr,t.ownerDocument.doctype.name)&&(A="<!DOCTYPE "+t.ownerDocument.doctype.name+`>
`+A),z&&(A=M(A,de," "),A=M(A,_e," "),A=M(A,Te," ")),R&&re?R.createHTML(A):A},n.setConfig=function(i){Re(i),Ae=!0},n.clearConfig=function(){j=null,Ae=!1},n.isValidAttribute=function(i,e,t){j||Re({});var a=d(i),l=d(e);return it(a,l,t)},n.addHook=function(i,e){typeof e=="function"&&(C[i]=C[i]||[],Z(C[i],e))},n.removeHook=function(i){if(C[i])return ft(C[i])},n.removeHooks=function(i){C[i]&&(C[i]=[])},n.removeAllHooks=function(){C={}},n}var Tr=vt();export{Tr as default};
