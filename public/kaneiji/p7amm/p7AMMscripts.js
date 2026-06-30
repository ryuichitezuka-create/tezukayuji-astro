
/* 
 ================================================
 PVII Adaptive Menu Magic scripts
 Copyright (c) 2017-2018 Project Seven Development
 www.projectseven.com
 Version: 1.2.6 -build 24
 ================================================
 
 */
var p7AMM = {
	ctl: [],
	once: false,
	prf: 'none',
	defAnim: 1,
	defDuration: 360,
	defScrollDuration: 800, // was 1000
	ie: false,
	flex: false,
	body: null,
	adv: [],
	downKey: null,
	animDelay: (1000 / 60)
};
function P7_AMMset(){
	var h, hd, sh = '';
	if (!document.getElementById) {
		return;
	}
	sh += 'li.amm-root-moved {position:absolute !important;top:-9000px !important;left:-9000px !important;}\n';
	sh += 'div.p7AMM ul.amm-level-0 {width: 100%;}\n';
	sh += 'div.p7AMM ul ul {position:absolute;top:0px;left:0px;display:none;margin:0px;}\n';
	sh += 'div.p7AMM ul ul ul {top:0px;left:0px;margin:0px;}\n';
	sh += '.p7AMM ul li {list-style-type:none;vertical-align:middle;display:inline-block;position:relative;}\n';
	sh += '.p7AMM ul ul li {display:block;}\n';
	sh += '.amm-spcr {width:100%;display:none;background:none !important;}\n';
	sh += '.p7AMM.amm-fixed {position:fixed !important;top:0;left:0;width:100%;}\n';
	sh += '.p7AMM {-webkit-backface-visibility:hidden;-webkit-transform:translateZ(0);scale(1.0, 1.0);}\n';
	sh += 'div.p7AMM ul ul li a {white-space: nowrap;}\n';
	hd = document.head || document.getElementsByTagName('head')[0];
	h = document.createElement('style');
	h.type = 'text/css';
	if (h.styleSheet) {
		h.styleSheet.cssText = sh;
	} else {
		h.appendChild(document.createTextNode(sh));
	}
	hd.appendChild(h);
}

P7_AMMset();
function P7_AMMbb(){
	P7_AMMshutAll();
}

function P7_AMMaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_AMMinit, false);
		window.addEventListener("load", P7_AMMinit, false);
		window.addEventListener("unload", P7_AMMbb, false);
		window.addEventListener("resize", P7_AMMrsz, false);
		document.addEventListener("keydown", P7_AMMkey, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_amm defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_amm").onreadystatechange = function(){
			if (this.readyState == "complete") {
				P7_AMMinit();
			}
		};
		window.attachEvent("onload", P7_AMMinit);
		window.attachEvent("onunload", P7_AMMbb);
		document.attachEvent("onkeydown", P7_AMMkey);
		window.attachEvent("onresize", P7_AMMrsz);
	}
}

P7_AMMaddLoad();
function P7_AMMinit(){
	var i, j, tB, dT, tU, tD, cN, tA, p, pa, el, tx, ob, wns, dv, cl;
	if (p7AMM.once) {
		P7_AMMrsz();
		return;
	}
	p7AMM.once = true;
	p7AMM.prf = P7_AMMgetCSSPre();
	P7_AMMgetIEver();
	p7AMM.body = P7_AMMgetScrollBody();
	p7AMMclk = true;
	if (window.addEventListener) {
		document.addEventListener("click", P7_AMMbody, false);
	} else if (window.attachEvent) {
		window.attachEvent("click", P7_AMMbody, false);
	}
	dT = P7_AMMgetByAttribute('data-amm', 'p7AMM');
	for (j = 0; j < dT.length; j++) {
		p7AMM.ctl.push(dT[j]);
		tB = dT[j];
		tB.ammOpt = tB.getAttribute('data-amm').split(',');
		P7_AMMremClass(tB, 'amm-noscript');
		tB.ammShut = true;
		tB.style.position = 'relative';
		tB.style.zIndex = tB.ammOpt[2];
		if (tB.ammOpt[1] > 1 && p7AMM.prf == 'none') {
			tB.ammOpt[1] = 1;
		}
		tB.ammType = 'horiz';
		if (tB.ammOpt[14] == 1) {
			tB.ammType = 'vert';
		}
		tU = tB.getElementsByTagName('UL');
		tB.ammRoot = tU[0];
		if (tB.ammOpt[11] == 1) {
			P7_AMMcurrentMark(tB);
		}
		tB.ammRoot.setAttribute('role', 'menubar');
		if (tB.ammOpt[13] == 1) {
			dv = document.createElement('div');
			dv.setAttribute('id', tB.id.replace('_', 'spcr_'));
			dv.className = tB.className;
			P7_AMMsetClass(dv, 'amm-spcr');
			tB.parentNode.insertBefore(dv, tB.nextSibling);
			tB.ammSpacer = dv;
			dv.ammMenu = tB;
			if (!wns) {
				wns = true;
				if (window.addEventListener) {
					window.addEventListener('scroll', P7_AMMfixed, false);
				} else if (window.attachEvent) {
					window.attachEvent('onscroll', P7_AMMfixed);
				}
			}
		}
		tD = document.getElementById(tB.id.replace('_', 'tb_'));
		if (tD) {
			tD.ammDiv = tB;
			tB.ammToolbar = tD;
			cl = tB.ammRoot.className;
			if (cl && cl !== '' && cl.indexOf('opened') > -1) {
				tB.ammRoot.ammState = 'open';
				tD.ammState = 'open';
				tB.ammState = 'open';
			} else {
				P7_AMMremClass(tB.ammToolbar, 'closed');
				P7_AMMremClass(tB.ammRoot, 'closed');
				tB.ammToolbarClosed = true;
				tB.ammToolbar.ammState = 'closed';
				tB.ammState = 'closed';
				tB.ammRoot.ammState = 'closed';
			}
			tA = tD.getElementsByTagName('A');
			if (tA && tA[0]) {
				tA[0].ammDiv = tB;
				tA[0].ammToolbar = tD;
				tA[0].onclick = function(){
					P7_AMMtoolbar(this.ammDiv.id);
					return false;
				};
			}
		}
		tB.ammPriority = [];
		if (tB.ammType == 'horiz') {
			ob = document.createElement('LI');
			ob.setAttribute('class', 'amm-more amm-root-moved');
			ob.ammMoreLink = true;
			ob.ammMoreItem = ob;
			el = document.createElement('A');
			tx = document.createTextNode(tB.getAttribute('data-amm-label'));
			el.appendChild(tx);
			el.setAttribute('href', '#');
			el.setAttribute('class', 'amm-more-trigger amm-trigger');
			ob.appendChild(el);
			el = document.createElement('UL');
			tB.ammRoot.appendChild(ob);
			tB.ammMoreLI = ob;
			el = document.createElement('UL');
			ob.appendChild(el);
			tB.ammMoreUL = el;
			cN = tU[0].children;
			for (i = 0; i < cN.length; i++) {
				if (!cN[i].ammMoreLink) {
					p = parseInt(cN[i].getAttribute('data-amm-priority'), 10);
					p = (p > -1) ? p : 0;
					pa = [cN[i], p];
					tB.ammPriority.push(pa);
					el = cN[i].cloneNode(true);
					tB.ammMoreUL.appendChild(el);
					cN[i].ammMoreItem = el;
				}
			}
			tB.ammPriority.sort(function(a, b){
				return a[1] - b[1];
			});
		}
		P7_AMMinitUL(tB, tU[0], 0);
		tA = tB.ammRoot.getElementsByTagName('A')[0];
		tA.tabIndex = 0;
		tB.ammFocusObj = tA;
		tB.ammRootLI = tA.parentNode;
		P7_AMMrsPriority(tB);
		if (tB.ammOpt[10] == 1) {
			P7_AMMbindPointer(tB);
			tB.onmouseout = function(evt){
				var tg, pp, tA, tB, m = true;
				evt = (evt) ? evt : event;
				tg = (evt.toElement) ? evt.toElement : evt.relatedTarget;
				if (this.ammPointer) {
					return;
				}
				if (P7_AMMmenuMode(this) == 'accordion') {
					return;
				}
				if (tg) {
					pp = tg;
					while (pp) {
						if (pp == this) {
							m = false;
							break;
						}
						if (pp.nodeName && pp.nodeName == 'BODY') {
							break;
						}
						pp = pp.parentNode;
					}
				}
				if (m) {
					if (this.ammMouseTimer) {
						clearTimeout(this.ammMouseTimer);
					}
					if (m) {
						this.ammMouseTimer = setTimeout("P7_AMMshut('" + this.id + "')", 160);
					}
				}
			};
		}
		if (tB.ammToolbarClosed) {
			P7_AMMsetClass(tB.ammToolbar, 'closed');
			P7_AMMsetClass(tB.ammRoot, 'closed');
		}
		if (tB.ammOpt[13] == 1) {
			P7_AMMfixed();
		}
		if (tB.ammDefLink && tB.ammDefLink.ammSTE) {
			P7_AMMclick(tB.ammDefLink);
		}
	}
}

function P7_AMMinitUL(d, ul, lv){
	var i, li, cl, tA, su, tH, wH, nlv;
	P7_AMMsetClass(ul, 'amm-level-' + lv);
	ul.ammLevel = lv;
	ul.ammDiv = d;
	ul.ammSubPos = 'right';
	li = ul.childNodes;
	wH = window.location.href;
	wH = wH.replace(window.location.hash, '');
	for (i = 0; i < li.length; i++) {
		if (li[i].tagName && li[i].tagName == 'LI') {
			li[i].ammLevel = lv;
			tA = li[i].getElementsByTagName('A');
			if (tA && tA[0]) {
				tA[0].ammState = 'closed';
				tA[0].ammDiv = d.id;
				li[i].ammLink = tA[0];
				tA[0].setAttribute('role', 'menuitem');
				li[i].setAttribute('role', 'none');
				tA[0].tabIndex = -1;
				li[i].ammVis = true;
				if (/amm-ste/.test(tA[0].getAttribute('class'))) {
					tH = tA[0].href;
					tH = tH.replace(tA[0].hash, '');
					if (tH == wH) {
						tA[0].ammSTE = true;
					}
				}
				tA[0].onclick = function(evt){
					return P7_AMMclick(this);
				};
				if (d.ammOpt[10] == 1) {
					tA[0].onmouseover = function(){
						var tB = document.getElementById(this.ammDiv);
						if (tB.ammMouseTimer) {
							clearTimeout(tB.ammMouseTimer);
						}
						if (this.ammPointer) {
							return;
						}
						if (P7_AMMmenuMode(tB) == 'accordion') {
							return;
						}
						tB.ammMouseTimer = setTimeout(P7_AMMcreateTMR(this), 160);
					};
					P7_AMMbindPointer(tA[0]);
				}
				su = li[i].getElementsByTagName('UL');
				if (su && su[0]) {
					tA[0].ammSub = su[0];
					su[0].ammTrigger = tA[0];
					nlv = lv + 1;
					tA[0].setAttribute('aria-haspopup', 'true');
					tA[0].setAttribute('aria-expanded', 'false');
					su[0].setAttribute('role', 'menu');
					su[0].setAttribute('aria-label', tA[0].firstChild.textContent);
					P7_AMMinitUL(d, su[0], nlv);
				}
			}
		}
	}
}

function P7_AMMcreateTMR(el){
	return function(){
		P7_AMMtrig(el);
	};
}

function P7_AMMtrig(a){
	if (a) {
		if (a.ammPointer) {
			return;
		} else {
			P7_AMMopen(a);
		}
	}
}

function P7_AMMclick(a){
	var wH, tB, m = false;
	wH = window.location.href;
	if (a.href != wH && a.href != wH + '#') {
		if (a.href.toLowerCase().indexOf('javascript:') == -1) {
			m = true;
		}
	}
	if (m && a.ammSub && a.ammState == 'closed') {
		m = false;
	}
	tB = document.getElementById(a.ammDiv);
	if (a.ammSTE) {
		if (tB.ammOpt[13] == 1) {
			if (P7_AMMmenuMode(tB) == 'accordion') {
				P7_AMMtoolbar(a.ammDiv, 'close');
			}
		}
		P7_AMMscrollToElement(a);
		m = false;
	} else {
		if (a.ammState == 'closed') {
			P7_AMMopen(a);
		} else {
			P7_AMMclose(a);
		}
	}
	return m;
}

function P7_AMMtoolbar(d, ac){
	var tB = document.getElementById(d);
	if (tB && tB.ammToolbar) {
		if ((ac != 'close' && ac != ' open') || !ac) {
			ac = (tB.ammState == 'closed') ? 'open' : 'close';
		}
		if (ac == 'close') {
			tB.ammState = 'closed';
			P7_AMMremClass(tB.ammToolbar, 'opened');
			P7_AMMsetClass(tB.ammToolbar, 'closed');
			P7_AMMremClass(tB.ammRoot, 'opened');
			P7_AMMsetClass(tB.ammRoot, 'closed');
			if (tB.ammFixedOn) {
				tB.ammSpacer.style.height = tB.ammToolbar.offsetHeight + 'px';
			}
		} else {
			tB.ammState = 'open';
			P7_AMMremClass(tB.ammToolbar, 'closed');
			P7_AMMsetClass(tB.ammToolbar, 'opened');
			P7_AMMremClass(tB.ammRoot, 'closed');
			P7_AMMsetClass(tB.ammRoot, 'opened');
		}
	}
	return false;
}

function P7_AMMopen(a, bp){
	var i, op, tB, dur, sD, wn, ws, pL, pR, pB, bT, mT, mL, li, v, sc;
	if (a.ammState == 'open') {
		return;
	}
	tB = document.getElementById(a.ammDiv);
	op = tB.ammOpt[1];
	dur = tB.ammOpt[0];
	if (op > 0 && P7_AMMmenuMode(tB) == 'accordion') {
		op = 99;
	}
	P7_AMMtoggle(a, bp);
	if (a.ammSub) {
		sD = a.ammSub;
		a.ammState = 'open';
		P7_AMMremClass(a, 'closed');
		P7_AMMsetClass(a, 'open');
		tB.ammShut = false;
		a.setAttribute('aria-expanded', 'true');
		sD.style.visibility = 'hidden';
		sD.style.height = 'auto';
		sD.style.display = 'block';
		sD.style.overflow = 'visible';
		mT = parseInt(tB.ammOpt[3], 10);
		if (tB.ammType == 'horiz' & sD.ammLevel == 1) {
			mT = 0;
			mL = 0;
			mT = a.parentNode.offsetHeight;
			if (tB.ammOpt[7] == 1) {
				mL = ((sD.offsetWidth - a.parentNode.offsetWidth) / 2) * -1;
			} else if (tB.ammOpt[7] == 2) {
				mL = ((sD.offsetWidth - a.parentNode.offsetWidth)) * -1;
			}
			mT += parseInt(tB.ammOpt[8], 10);
			mL += parseInt(tB.ammOpt[9], 10);
		} else {
			if (tB.ammOpt[5] == 1) {
				mL = (sD.offsetWidth * -1) - parseInt(tB.ammOpt[4], 10);
				sD.ammSubPos = 'left';
			} else {
				mL = a.parentNode.offsetWidth + parseInt(tB.ammOpt[4], 10);
				sD.ammSubPos = 'right';
			}
		}
		if (tB.ammOpt[6] > 0) {
			ws = P7_AMMgetWinScroll();
			wn = P7_AMMgetWinDims();
			var adjL = 0, adjT = 0, vL, vR, pT;
			pL = mL + a.parentNode.getBoundingClientRect().left + ws[1];
			pR = pL + sD.offsetWidth;
			if (tB.ammType == 'horiz' && tB.ammOpt[6] == 2) {
				vL = tB.getBoundingClientRect().left + ws[1];
				vR = vL + tB.offsetWidth;
				if (pR > vR) {
					if (sD.ammLevel == 1) {
						mL = mL - (pR - vR);
					} else {
						mL = (sD.offsetWidth * -1) - tB.ammOpt[4];
						sD.ammSubPos = 'left';
					}
				}
				if (pL < vL) {
					if (sD.ammLevel == 1) {
						mL = mL + (vL - pL);
					} else {
						mL = a.parentNode.offsetWidth + parseInt(tB.ammOpt[4], 10);
						sD.ammSubPos = 'right';
					}
				}
				pL = mL + a.parentNode.getBoundingClientRect().left + ws[1];
				pR = pL + sD.offsetWidth;
				if (pR > vR) {
					mL = mL - (pR - vR);
				}
			}
			pL = mL + a.parentNode.getBoundingClientRect().left + ws[1];
			pR = pL + sD.offsetWidth;
			vL = ws[1];
			vR = wn[1];
			if (pR > vR) {
				if (tB.ammType == 'horiz' && sD.ammLevel == 1) {
					mL = mL - (pR - vR);
				} else {
					mL = (sD.offsetWidth * -1) - tB.ammOpt[4];
					sD.ammSubPos = 'left';
				}
			}
			pL = mL + a.parentNode.getBoundingClientRect().left + ws[1];
			if (pL < vL) {
				if (tB.ammType == 'horiz' && sD.ammLevel == 1) {
					mL = mL + (vL - pL);
				} else {
					mL = a.parentNode.offsetWidth + parseInt(tB.ammOpt[4], 10);
					sD.ammSubPos = 'right';
				}
			}
			pL = mL + a.parentNode.getBoundingClientRect().left + ws[1];
			pR = pL + sD.offsetWidth;
			if (pR > vR) {
				mL = mL - (pR - vR);
			}
			pB = mT + a.parentNode.getBoundingClientRect().top + sD.offsetHeight;
			if (pB > wn[0]) {
				mT = mT - (pB - wn[0] + 2);
			}
			pT = mT + a.parentNode.getBoundingClientRect().top;
			if (pT < 0) {
				mT = (a.parentNode.getBoundingClientRect().top * -1) + 2;
			}
		}
		sD.style.marginTop = mT + 'px';
		sD.style.marginLeft = mL + 'px';
		if (op == 1) {
			sD.style.visibility = 'hidden';
			sD.style.display = 'block';
			P7_AMMfade(sD, 2, 100, dur, 'linear');
		} else if (op == 2 || op == 3) {
			sD.style.overflow = 'hidden';
			sD.style.opacity = (op == 3) ? 0 : 1;
			if (sD.ammLevel == 1) {
				sD.style.clip = 'rect(0px auto 0px 0px)';
			} else {
				if (sD.ammSubPos == 'right') {
					sD.style.clip = 'rect(0px 0px auto 0px)';
				} else {
					sD.style.clip = 'rect(0px auto auto ' + sD.offsetWidth + 'px)';
				}
			}
			sD.offsetWidth = sD.offsetWidth;
			sD.style.visibility = 'visible';
			sD.style[p7AMM.prf + 'transition'] = 'clip ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
			if (sD.ammLevel == 1) {
				sD.style.clip = 'rect(0px auto ' + sD.offsetHeight + 'px 0px)';
			} else {
				if (sD.ammSubPos == 'right') {
					sD.style.clip = 'rect(0px ' + sD.offsetWidth + 'px auto 0px)';
				} else {
					sD.style.clip = 'rect(0px auto auto 0px)';
				}
			}
			sD.style.opacity = 1;
			sD.ammAnimC = setTimeout(function(){
				P7_AMMfinAnim(sD, 'open');
			}, dur);
		} else if (op == 4 || op == 5 || op == 6) {
			sD.style.opacity = 0;
			sc = '0,0';
			if (op == 5) {
				sc = '0,1';
			} else if (op == 6) {
				sc = '1,0';
			}
			sD.style[p7AMM.prf + 'transform'] = 'scale(' + sc + ')';
			sD.offsetWidth = sD.offsetWidth;
			sD.style.display = 'block';
			sD.style.visibility = 'visible';
			sD.style[p7AMM.prf + 'transition'] = p7AMM.prf + 'transform ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
			sD.style[p7AMM.prf + 'transform'] = 'scale(1,1)';
			sD.style.opacity = 1;
			sD.ammAnimC = setTimeout(function(){
				P7_AMMfinAnim(sD, 'open');
			}, dur);
		} else if (op == 99) {
			sD.style.overflow = 'hidden';
			P7_AMManimate(sD, 'height', 'px', 0, sD.offsetHeight, dur, 'quad', function(){
				this.style.height = 'auto';
				this.style.overflow = 'visible';
			});
		} else {
			sD.style.visibility = 'visible';
			sD.style.display = 'block';
		}
	}
}

function P7_AMMfinAnim(ul, ac){
	var st = ul.ammTrigger.ammState;
	if ((ac == 'open' && st == 'open') || (ac == 'closed' && st == 'closed')) {
		ul.style.overflow = 'visible';
		ul.style[p7AMM.prf + 'transition'] = null;
		ul.style[p7AMM.prf + 'transform'] = 'none';
		ul.style.clip = 'auto';
		if (ac == 'closed') {
			ul.style.display = 'none';
			ul.style.opacity = 1;
		}
	}
}

function P7_AMMclose(a, bp){
	var i, op, tB, sD, dur, sc;
	if (a.ammState == 'closed') {
		return;
	}
	tB = document.getElementById(a.ammDiv);
	op = tB.ammOpt[1];
	dur = tB.ammOpt[0];
	if (op > 0 && P7_AMMmenuMode(tB) == 'accordion') {
		op = 99;
	}
	if (bp == 1) {
		op = 0;
	}
	if (a.ammSub) {
		sD = a.ammSub;
		a.ammState = 'closed';
		P7_AMMremClass(a, 'open');
		P7_AMMsetClass(a, 'closed');
		a.setAttribute('aria-expanded', 'false');
		if (op == 1) {
			P7_AMMfade(sD, 100, 0, dur, 'linear', function(){
				this.style.display = 'none';
				if (this.filters) {
					this.style.filter = 'alpha(opacity=100)';
				} else {
					this.style.opacity = 1;
				}
			});
		} else if (op == 2 || op == 3) {
			if (op == 2) {
				sD.style.overflow = 'hidden';
				if (sD.ammLevel == 1) {
					sD.style.clip = 'rect(0px auto ' + sD.offsetHeight + 'px 0px)';
				} else {
					if (sD.ammSubPos == 'right') {
						sD.style.clip = 'rect(0px ' + sD.offsetWidth + 'px auto 0px)';
					} else {
						sD.style.clip = 'rect(0px auto auto 0px)';
					}
				}
			} else {
				dur = dur * 1.6;
			}
			sD.offsetWidth = sD.offsetWidth;
			sD.style[p7AMM.prf + 'transition'] = 'clip ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
			if (op == 2) {
				if (sD.ammLevel == 1) {
					sD.style.clip = 'rect(0px auto 0px 0px)';
				} else {
					if (sD.ammSubPos == 'right') {
						sD.style.clip = 'rect(0px 0px auto 0px)';
					} else {
						sD.style.clip = 'rect(0px auto auto ' + sD.offsetWidth + 'px)';
					}
				}
			}
			sD.style.opacity = 0;
			sD.ammAnimC = setTimeout(function(){
				P7_AMMfinAnim(sD, 'closed');
			}, dur);
		} else if (op == 4 || op == 5 || op == 6) {
			sD.style.opacity = 1;
			sD.style[p7AMM.prf + 'transform'] = 'scale(1,1)';
			sD.offsetWidth = sD.offsetWidth;
			sD.style[p7AMM.prf + 'transition'] = p7AMM.prf + 'transform ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
			sc = '0,0';
			if (op == 5) {
				sc = '0,1';
			} else if (op == 6) {
				sc = '1,0';
			}
			sD.style[p7AMM.prf + 'transform'] = 'scale(' + sc + ')';
			sD.style.opacity = 0;
			sD.ammAnimC = setTimeout(function(){
				P7_AMMfinAnim(sD, 'closed');
			}, dur);
		} else if (op == 99) {
			sD.style.overflow = 'hidden';
			P7_AMManimate(sD, 'height', 'px', sD.offsetHeight, 0, dur, 'quad', function(){
				this.style.display = 'none';
			});
		} else {
			sD.style.display = 'none';
		}
	}
}

function P7_AMMtoggle(a, bp){
	var i, pp, tU;
	pp = a.parentNode;
	while (pp) {
		if (pp.tagName && pp.tagName == 'UL') {
			break;
		}
		pp = pp.parentNode;
	}
	tU = pp.getElementsByTagName('UL');
	if (tU && tU.length > 0) {
		for (i = tU.length - 1; i > -1; i--) {
			if (tU[i].ammTrigger && tU[i].ammTrigger.ammState == 'open') {
				if (bp == 1 || (!bp && tU[i].ammTrigger != a)) {
					P7_AMMclose(tU[i].ammTrigger);
				}
			}
		}
	}
}

function P7_AMMshut(d, bp){
	var i, tB, tU;
	if (d) {
		tB = document.getElementById(d);
		if (tB && !tB.ammShut && tB.ammRoot) {
			tU = tB.ammRoot.getElementsByTagName('UL');
			tB.ammShut = true;
			if (tU && tU.length > 0) {
				tB.ammFocusObj.tabIndex = -1;
				tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, null, 'first');
				tB.ammFocusObj.tabIndex = 0;
				for (i = tU.length - 1; i > -1; i--) {
					if (tU[i].ammTrigger && tU[i].ammTrigger.ammState == 'open') {
						P7_AMMclose(tU[i].ammTrigger, bp);
					}
				}
			}
		}
	}
}

function P7_AMMshutAll(bp){
	var i, tB;
	for (i = 0; i < p7AMM.ctl.length; i++) {
		tB = p7AMM.ctl[i];
		if (tB && (!bp || bp != tB.id)) {
			P7_AMMshut(tB.id);
		}
	}
}

function P7_AMMbody(evt){
	evt = (evt) ? evt : event;
	var m = true, pp = (evt.fromElement) ? evt.fromElement : evt.target;
	while (pp) {
		if (pp && pp.id && typeof(pp.id) == 'string' && pp.id.indexOf('p7AMM') === 0) {
			m = false;
			break;
		}
		if (pp && pp.tagName && (pp.tagName == 'BODY' || pp.tagName == 'HTML')) {
			break;
		}
		pp = pp.parentNode;
	}
	if (m) {
		P7_AMMshutAll();
	}
}

function P7_AMMfixed(){
	var i, tB;
	if (p7AMM.ctl && p7AMM.ctl.length) {
		for (i = 0; i < p7AMM.ctl.length; i++) {
			tB = p7AMM.ctl[i];
			if (tB && tB.ammSpacer) {
				if (!tB.ammFixedOn && parseInt(tB.getBoundingClientRect().top, 10) < 0) {
					tB.ammSpacer.style.height = tB.offsetHeight + 'px';
					tB.ammSpacer.style.display = 'block';
					P7_AMMsetClass(tB, 'amm-fixed');
					tB.ammFixedOn = true;
					P7_AMMrsz();
				} else if (tB.ammFixedOn && parseInt(tB.ammSpacer.getBoundingClientRect().top, 10) >= 0) {
					tB.ammSpacer.style.display = 'none';
					P7_AMMremClass(tB, 'amm-fixed');
					tB.ammFixedOn = false;
					P7_AMMrsz();
				}
			}
		}
	}
}

function P7_AMManimate(ob, prop, un, fv, tv, dur, typ, cb){
	if (ob.p7AnimRunning) {
		ob.p7AnimRunning = false;
		clearInterval(ob.p7AMManim);
	}
	typ = (!typ) ? 'quad' : typ;
	ob.p7animType = typ;
	ob.p7animProp = prop;
	ob.p7animUnit = un;
	ob.p7animStartVal = fv;
	ob.p7animCurrentVal = ob.p7animStartVal;
	ob.p7animFinishVal = tv;
	ob.style[ob.p7animProp] = ob.p7animCurrentVal + ob.p7animUnit;
	ob.style.visibility = 'visible';
	ob.p7animStartTime = P7_AMMgetTime(0);
	ob.p7animDuration = dur;
	if (!ob.p7AnimRunning) {
		ob.p7AnimRunning = true;
		ob.p7AMManim = setInterval(function(){
			P7_AMManimator(ob, cb);
		}, p7AMM.animDelay);
	}
}

function P7_AMManimator(el, cb, op){
	var i, tB, tA, tS, et, nv, m = false;
	et = P7_AMMgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_AMManim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.style[el.p7animProp] = nv + el.p7animUnit;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7AMManim);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_AMMscrollToElement(a){
	var st, dy, op, el, t, tf, h, tb, tD;
	h = a.hash;
	if (!h || h === '') {
		return false;
	} else {
		h = h.replace('#', '');
	}
	el = document.getElementById(h);
	if (!el) {
		return false;
	}
	if (p7AMM.body.p7AnimRunning) {
		p7AMM.body.p7AnimRunning = false;
		clearInterval(p7AMM.body.p7AMManim);
	}
	if (typeof(p7STT) == 'object') {
		if (p7STT.body && p7STT.body.p7AnimRunning) {
			p7STT.body.p7AnimRunning = false;
			clearInterval(p7STT.body.p7STTanim);
		}
	}
	st = p7AMM.body.scrollTop;
	t = st + el.getBoundingClientRect().top + 1;
	tf = parseInt(a.getAttribute('data-top-offset'), 10);
	if (tf && tf !== '') {
		t -= tf;
	}
	tf = a.getAttribute('data-top-offset-id');
	if (tf && tf !== '') {
		tb = document.getElementById(tf);
		if (tb) {
			t -= tb.offsetHeight;
		}
	}
	if (p7AMM.defAnim == 1) {
		P7_AMMscrollAnim(p7AMM.body, st, t, p7AMM.defScrollDuration, 'quad');
	} else {
		p7AMM.body.scrollTop = t;
		if (typeof(P7_STTrsz) == 'function') {
			P7_STTrsz();
		}
	}
	return false;
}

function P7_AMMscrollAnim(ob, fv, tv, dur, typ, cb){
	if (ob.p7AnimRunning) {
		ob.p7AnimRunning = false;
		clearInterval(ob.p7AMManim);
	}
	typ = (!typ) ? 'quad' : typ;
	ob.p7animType = typ;
	ob.p7animStartVal = fv;
	ob.p7animCurrentVal = ob.p7animStartVal;
	ob.p7animFinishVal = tv;
	ob.p7animStartTime = P7_AMMgetTime(0);
	ob.p7animDuration = dur;
	if (!ob.p7AnimRunning) {
		ob.p7AnimRunning = true;
		ob.p7AMManim = setInterval(function(){
			P7_AMMscrollAnimator(ob, cb);
		}, p7AMM.animDelay);
	}
}

function P7_AMMscrollAnimator(el, cb, op){
	var i, tB, tA, tS, et, nv, m = false;
	et = P7_AMMgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_AMManim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.scrollTop = nv;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7AMManim);
		if (typeof(P7_STTrsz) == 'function') {
			P7_STTrsz();
		}
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_AMMgetTime(st){
	var d = new Date();
	return d.getTime() - st;
}

function P7_AMManim(tp, t, b, c, d){
	if (tp == 'quad') {
		return -c * (t /= d) * (t - 2) + b;
	} else if (tp == 'cubic') {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	} else {
		return (c * (t / d)) + b;
	}
}

function P7_AMMfade(ob, from, to, dur, typ, cb){
	if (ob.p7FadeRunning) {
		clearInterval(ob.p7Fade);
		ob.p7FadeRunning = false;
	}
	typ = (!typ) ? 'quad' : typ;
	ob.p7fadeType = typ;
	ob.p7StartFade = from;
	ob.p7FinishFade = to;
	ob.p7CurrentFade = ob.p7StartFade;
	if (ob.filters) {
		ob.style.filter = 'alpha(opacity=' + ob.p7CurrentFade + ')';
	} else {
		ob.style.opacity = ob.p7CurrentFade / 100;
	}
	ob.style.visibility = 'visible';
	ob.fadeStartTime = P7_AMMgetTime(0);
	ob.fadeDuration = dur;
	ob.p7FadeRunning = true;
	ob.p7Fade = setInterval(function(){
		P7_AMMfader(ob, cb);
	}, p7AMM.animDelay);
}

function P7_AMMfader(el, cb){
	var i, tC, tA, op, et, m = false;
	et = P7_AMMgetTime(el.fadeStartTime);
	if (et >= el.fadeDuration) {
		et = el.fadeDuration;
		m = true;
	}
	if (el.p7CurrentFade != el.p7FinishFade) {
		op = P7_AMManim(el.p7fadeType, et, el.p7StartFade, el.p7FinishFade - el.p7StartFade, el.fadeDuration);
		el.p7CurrentFade = op;
		if (el.filters) {
			el.style.filter = 'alpha(opacity=' + el.p7CurrentFade + ')';
		} else {
			el.style.opacity = el.p7CurrentFade / 100;
		}
	}
	if (m) {
		el.p7FadeRunning = false;
		clearInterval(el.p7Fade);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_AMMrsz(){
	var i, tB, w, mv;
	for (i = 0; i < p7AMM.ctl.length; i++) {
		tB = p7AMM.ctl[i];
		if (P7_AMMmenuMode(tB) != 'accordion') {
			P7_AMMshut(tB.id, 1);
		}
		if (tB.ammPriority) {
			P7_AMMrsPriority(tB);
		}
	}
}

function P7_AMMrsPriority(tB){
	var i, w, rw, mv, n, ls, cN, md, k, pw, mw, lw;
	if (tB.ammType == 'vert') {
		return;
	}
	w = 0;
	rw = tB.ammRoot.getBoundingClientRect().width;
	rw -= 4;
	mw = tB.ammMoreLI.getBoundingClientRect().width;
	mv = false;
	md = P7_AMMmenuMode(tB);
	k = -1;
	pw = 0;
	for (i = 0; i < tB.ammPriority.length; i++) {
		if (tB.ammPriority[i][0].ammMoreItem.ammLink) {
			lw = tB.ammPriority[i][0].getBoundingClientRect().width;
			pw = pw + w + lw;
			if (pw > rw) {
				k = i;
				pw = pw - lw + mw;
				if (pw > rw) {
					k -= 1;
				}
				break;
			}
		}
	}
	for (i = 0; i < tB.ammPriority.length; i++) {
		if (tB.ammPriority[i][0].ammMoreItem.ammLink) {
			P7_AMMremClass(tB.ammPriority[i][0].ammMoreItem.ammLink, 'amm-first');
			P7_AMMremClass(tB.ammPriority[i][0].ammMoreItem.ammLink, 'amm-last');
			if (md !== 'accordion' && k > -1 && i >= k) {
				mv = true;
				P7_AMMsetClass(tB.ammPriority[i][0], 'amm-root-moved');
				tB.ammPriority[i][0].ammVis = false;
				tB.ammPriority[i][0].ammMoreItem.style.display = 'block';
				tB.ammPriority[i][0].ammMoreItem.ammShow = true;
				tB.ammPriority[i][0].ammMoreItem.ammVis = true;
				ls = tB.ammPriority[i][0].ammMoreItem;
			} else {
				P7_AMMremClass(tB.ammPriority[i][0], 'amm-root-moved');
				tB.ammPriority[i][0].ammVis = true;
				tB.ammPriority[i][0].ammMoreItem.ammShow = false;
				tB.ammPriority[i][0].ammMoreItem.style.display = 'none';
				tB.ammPriority[i][0].ammMoreItem.ammVis = false;
			}
		}
	}
	cN = tB.ammMoreUL.children;
	n = 0;
	for (i = 0; i < cN.length; i++) {
		if (cN[i].ammShow) {
			n++;
			if (n == 1) {
				P7_AMMsetClass(cN[i].ammLink, 'amm-first');
			}
			ls = cN[i].ammLink;
		}
	}
	if (n > 0) {
		P7_AMMsetClass(ls, 'amm-last');
	}
	if (mv) {
		P7_AMMremClass(tB.ammMoreLI, 'amm-root-moved');
		tB.ammMoreLI.ammMoreItem.ammShow = false;
		tB.ammMoreLI.ammVis = true;
	} else {
		P7_AMMsetClass(tB.ammMoreLI, 'amm-root-moved');
		tB.ammMoreLI.ammMoreItem.ammShow = true;
		tB.ammMoreLI.ammVis = false;
	}
}

function P7_AMMbindPointer(el){
	if (typeof el.ontouchstart !== 'undefined') {
		el.addEventListener('touchstart', P7_AMMsetPointer, false);
	} else if (navigator.maxTouchPoints) {
		el.addEventListener('pointerdown', P7_AMMsetPointer, false);
		el.addEventListener('mouseover', P7_AMMsetPointer, false);
		el.addEventListener('pointerout', P7_AMMsetPointer, false);
		el.addEventListener('mouseout', P7_AMMsetPointer, false);
	} else if (navigator.msMaxTouchPoints) {
		el.addEventListener('MSPointerDown', P7_AMMsetPointer, false);
		el.addEventListener('mouseover', P7_AMMsetPointer, false);
		el.addEventListener('MSPointerOut', P7_AMMsetPointer, false);
		el.addEventListener('mouseout', P7_AMMsetPointer, false);
	}
}

function P7_AMMsetPointer(evt){
	if (evt.pointerType) {
		if (evt.MSPOINTER_TYPE_TOUCH || evt.pointerType == 'touch') {
			this.ammPointer = true;
		} else if (evt.MSPOINTER_TYPE_PEN || evt.pointerType == 'pen') {
			this.ammPointer = true;
		} else {
			this.ammPointer = false;
		}
	} else if (this.ontouchstart !== undefined) {
		this.ammPointer = true;
	}
}

function P7_AMMkey(evt){
	var dv, k, tg, ac = '', m = false;
	evt = (evt) ? evt : event;
	tg = (evt.target) ? evt.target : evt.srcElement;
	if (tg.ammDiv) {
		if (!evt.altKey && !evt.ctrlKey) {
			switch (evt.keyCode) {
				case 13:
					if (tg.ammSub) {
						ac = 'RETURN';
					}
					break;
				case 27:
					ac = 'ESC';
					break;
				case 32:
					if (tg.ammSub) {
					}
					break;
				case 33:
					ac = 'PAGEUP';
					break;
				case 34:
					ac = 'PAGEDOWN';
					break;
				case 35:
					ac = 'END';
					break;
				case 36:
					ac = 'HOME';
					break;
				case 37:
					ac = 'LEFT';
					break;
				case 38:
					ac = 'UP';
					break;
				case 39:
					ac = 'RIGHT';
					break;
				case 40:
					ac = 'DOWN';
					break;
			}
			if (ac !== '') {
				P7_AMMsetFocus(tg, ac);
				if (evt.preventDefault) {
					evt.stopPropagation();
					evt.preventDefault();
				} else {
					evt.returnValue = false;
				}
			}
		}
	}
}

function P7_AMMsetFocus(a, ac){
	var tB, li, el, ob, cN, ul, mt;
	tB = document.getElementById(a.ammDiv);
	li = a.parentNode;
	if (tB.ammType == 'vert') {
		mt = 'vert';
	} else {
		mt = 'horiz';
	}
	tB.ammFocusObj.tabIndex = -1;
	if (ac == 'SPACE' || ac == 'ENTER') {
		if (a.ammSub) {
			P7_AMMopen(a);
			tB.ammFocusObj = P7_AMMgetMenuItem(a.ammSub, a, 'first');
		} else {
		}
	} else if (ac == 'ESC') {
		if (li.ammLevel !== 0) {
			tB.ammFocusObj = li.parentNode.ammTrigger;
			P7_AMMclose(tB.ammFocusObj);
		}
	} else if (ac == 'RIGHT') {
		if (li.ammLevel === 0 && tB.ammType == 'horiz') {
			if (a.ammSub) {
				P7_AMMclose(a);
			}
			if (tB.ammFocusObj == P7_AMMgetMenuItem(tB.ammRoot, a, 'last')) {
				tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'first');
			} else {
				tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'next');
			}
		} else {
			if (a.ammSub) {
				P7_AMMopen(a);
				tB.ammFocusObj = P7_AMMgetMenuItem(a.ammSub, a, 'first');
			} else {
				ob = a.parentNode.parentNode.ammTrigger;
				P7_AMMclose(ob);
				ul = ob.parentNode.parentNode;
				if (ob == P7_AMMgetMenuItem(ul, ob, 'last')) {
					tB.ammFocusObj = P7_AMMgetMenuItem(ul, ob, 'first');
				} else {
					tB.ammFocusObj = P7_AMMgetMenuItem(ul, ob, 'next');
				}
				if (tB.ammFocusObj.ammSub) {
					P7_AMMopen(tB.ammFocusObj);
				}
			}
		}
	} else if (ac == 'LEFT') {
		if (li.ammLevel === 0 && tB.ammType == 'horiz') {
			if (a.ammSub) {
				P7_AMMclose(a);
			}
			if (tB.ammFocusObj == P7_AMMgetMenuItem(tB.ammRoot, a, 'first')) {
				tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'last');
			} else {
				tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'prev');
			}
		} else {
			ob = a.parentNode.parentNode.ammTrigger;
			P7_AMMclose(ob);
			ul = ob.parentNode.parentNode;
			if (ob == P7_AMMgetMenuItem(ul, ob, 'first')) {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, ob, 'last');
			} else {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, ob, 'prev');
			}
			if (tB.ammFocusObj.ammSub) {
				P7_AMMopen(tB.ammFocusObj);
			}
		}
	} else if (ac == 'DOWN') {
		if (li.ammLevel === 0 && tB.ammType == 'horiz') {
			if (a.ammSub) {
				P7_AMMopen(a);
				tB.ammFocusObj = P7_AMMgetMenuItem(a.ammSub, a, 'first');
			}
		} else {
			ul = a.parentNode.parentNode;
			ob = ul.ammTrigger;
			P7_AMMclose(a);
			if (tB.ammFocusObj == P7_AMMgetMenuItem(ul, a, 'last')) {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'first');
			} else {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'next');
			}
		}
	} else if (ac == 'UP') {
		if (li.ammLevel === 0 && tB.ammType == 'horiz') {
			if (a.ammSub) {
				P7_AMMopen(a);
				tB.ammFocusObj = P7_AMMgetMenuItem(a.ammSub, a, 'last');
			}
		} else {
			ul = a.parentNode.parentNode;
			ob = ul.ammTrigger;
			P7_AMMclose(a);
			if (tB.ammFocusObj == P7_AMMgetMenuItem(ul, a, 'first')) {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'last');
			} else {
				tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'prev');
			}
		}
	} else if (ac == 'HOME' || ac == 'PAGEUP') {
		if (li.ammLevel === 0) {
			P7_AMMshut(tB.id);
			tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'first');
		} else {
			ul = a.parentNode.parentNode;
			ob = ul.ammTrigger;
			tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'first');
			if (a.ammSub) {
				P7_AMMclose(a);
			}
		}
	} else if (ac == 'END' || ac == 'PAGEDOWN') {
		if (li.ammLevel === 0) {
			P7_AMMshut(tB.id);
			tB.ammFocusObj = P7_AMMgetMenuItem(tB.ammRoot, a, 'last');
		} else {
			ul = a.parentNode.parentNode;
			ob = ul.ammTrigger;
			tB.ammFocusObj = P7_AMMgetMenuItem(ul, a, 'last');
			if (a.ammSub) {
				P7_AMMclose(a);
			}
		}
	} else if (ac == 'CHAR') {
	}
	tB.ammFocusObj.tabIndex = 0;
	tB.ammFocusObj.focus();
}

function P7_AMMgetMenuItem(ul, a, md){
	var newNode, li, cN;
	cN = ul.children;
	if (md == 'first') {
		li = P7_AMMgetNextVis(ul.firstElementChild, 'next');
	} else if (md == 'next') {
		li = P7_AMMgetNextVis(a.parentNode.nextElementSibling, 'next');
	} else if (md == 'last') {
		li = P7_AMMgetNextVis(ul.lastElementChild, 'prev');
	} else if (md == 'prev') {
		li = P7_AMMgetNextVis(a.parentNode.previousElementSibling, 'prev');
	}
	if (!li) {
		li = ul.ammDiv.ammFocusObj.parentNode;
	}
	newNode = li.ammLink;
	return newNode;
}

function P7_AMMgetNextVis(el, ac){
	if (!el.ammVis) {
		while (el && !el.ammVis) {
			if (ac == 'next') {
				el = el.nextElementSibling;
			} else {
				el = el.previousElementSibling;
			}
		}
	}
	return el;
}

function P7_AMMmark(){
	p7AMM.adv.push(arguments);
}

function P7_AMMcurrentMark(el){
	var j, i, wH, cm = false, mt = ['', 1, '', ''], op, r1, k, kk, tA, aU, pp, a, im, x;
	wH = window.location.href;
	if (el.ammOpt[12] != 1) {
		wH = wH.replace(window.location.search, '');
	}
	if (wH.charAt(wH.length - 1) == '#') {
		wH = wH.substring(0, wH.length - 1);
	}
	for (k = 0; k < p7AMM.adv.length; k++) {
		if (p7AMM.adv[k][0] && p7AMM.adv[k][0] == el.id) {
			mt = p7AMM.adv[k];
			cm = true;
			break;
		}
	}
	op = mt[1];
	if (op < 1) {
		return;
	}
	r1 = /index\.[\S]*/i;
	k = -1;
	kk = -1;
	tA = el.getElementsByTagName('A');
	for (j = 0; j < tA.length; j++) {
		aU = tA[j].href.replace(r1, '');
		if (op > 0) {
			if (tA[j].href == wH || aU == wH) {
				k = j;
				kk = -1;
			}
		}
		if (op == 2) {
			if (tA[j].firstChild) {
				if (tA[j].firstChild.nodeValue == mt[2]) {
					kk = j;
				}
			}
		}
		if (op == 3 && tA[j].href.indexOf(mt[2]) > -1) {
			kk = j;
		}
		if (op == 4) {
			for (x = 2; x < mt.length; x += 2) {
				if (wH.indexOf(mt[x]) > -1) {
					if (tA[j].firstChild && tA[j].firstChild.nodeValue) {
						if (tA[j].firstChild.nodeValue == mt[x + 1]) {
							kk = j;
						}
					}
				}
			}
		}
	}
	k = (kk > k) ? kk : k;
	if (k > -1) {
		el.ammDefLink = tA[k];
		if (tA[k].ammSTE && !tA[k].ammSub) {
			P7_AMMclick(tA[k]);
		}
		pp = tA[k].parentNode;
		while (pp) {
			if (pp.tagName && pp.tagName == 'LI') {
				P7_AMMsetClass(pp, 'current_mark');
				a = pp.getElementsByTagName('A');
				if (a && a[0]) {
					P7_AMMsetClass(a[0], 'current_mark');
				}
			} else {
				if (pp == el) {
					break;
				}
			}
			pp = pp.parentNode;
		}
	}
}

function P7_AMMsupports(st){
	return document.createElement('div').style[st];
}

function P7_AMMgetByAttribute(att, cls){
	var i, nL = [], aT, rS = [], cl;
	if (document.querySelectorAll) {
		nL = document.querySelectorAll('*[' + att + ']');
	} else {
		if (typeof(document.getElementsByClassName) != 'function') {
			aT = document.getElementsByTagName('DIV');
			for (i = 0; i < aT.length; i++) {
				cl = aT[i].className;
				if (cl && cl.indexOf(cls) > -1) {
					rS[rS.length] = aT[i];
				}
			}
		} else {
			rS = document.getElementsByClassName(cls);
		}
		for (i = 0; i < rS.length; i++) {
			if (rS[i].getAttribute(att)) {
				nL[nL.length] = rS[i];
			}
		}
	}
	return nL;
}

function P7_AMMgetCSSPre(){
	var i, dV, pre = ['animationDuration', 'WebkitAnimationDuration'];
	var c = 'none', cssPre = ['', '-webkit-'];
	dV = document.createElement('div');
	for (i = 0; i < pre.length; i++) {
		if (dV.style[pre[i]] !== undefined) {
			c = cssPre[i];
			break;
		}
	}
	return c;
}

function P7_AMMsetClass(ob, cl){
	if (ob) {
		var cc, nc, r = /\s+/g;
		cc = ob.className;
		nc = cl;
		if (cc && cc.length > 0) {
			if (cc.indexOf(cl) == -1) {
				nc = cc + ' ' + cl;
			} else {
				nc = cc;
			}
		}
		nc = nc.replace(r, ' ');
		ob.className = nc;
	}
}

function P7_AMMremClass(ob, cl){
	if (ob) {
		var cc, nc;
		cc = ob.className;
		cl = cl.replace('-', '\-');
		var re = new RegExp('\\b' + cl + '\\b');
		if (re.test(cc)) {
			nc = cc.replace(re, '');
			nc = nc.replace(/\s+/g, ' ');
			nc = nc.replace(/\s$/, '');
			nc = nc.replace(/^\s/, '');
			ob.className = nc;
		}
	}
}

function P7_AMMgetStyle(el, s){
	if (el.currentStyle) {
		s = el.currentStyle[s];
	} else if (document.defaultView && document.defaultView.getComputedStyle) {
		s = document.defaultView.getComputedStyle(el, "")[s];
	} else {
		s = el.style[s];
	}
	return s;
}

function P7_AMMgetIEver(){
	var j, k, v = -1, nv;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7AMM.ie = v;
	}
	j = nv.indexOf('trident/');
	if (j > 0) {
		k = nv.indexOf('rv:');
		if (k && k > 0) {
			v = parseInt(nv.substring(k + 3, nv.indexOf('.', k)), 10);
		}
		p7AMM.ie = v;
	}
	return v;
}

function P7_AMMgetScrollBody(){
	var y, el = document.documentElement;
	if (el) {
		y = el.scrollTop;
		el.scrollTop += 1;
		if (el.scrollTop == y) {
			el = document.body;
		} else {
			el.scrollTop -= 1;
		}
	} else {
		el = document.body;
	}
	return el;
}

function P7_AMMgetWinDims(){
	var h, w, st;
	if (document.documentElement && document.documentElement.clientHeight) {
		w = document.documentElement.clientWidth;
		h = document.documentElement.clientHeight;
	} else if (window.innerHeight) {
		if (document.documentElement.clientWidth) {
			w = document.documentElement.clientWidth;
		} else {
			w = window.innerWidth;
		}
		h = window.innerHeight;
	} else if (document.body) {
		w = document.body.clientWidth;
		h = document.body.clientHeight;
	}
	return [h, w];
}

function P7_AMMgetWinScroll(){
	var t = document.body.parentNode.scrollTop || document.body.scrollTop || window.scrollY || 0;
	var l = document.body.parentNode.scrollLeft || document.body.scrollLeft || window.scrollX || 0;
	return [t, l];
}

function P7_AMMmenuMode(el){
	var mode = 'normal';
	if (P7_AMMgetStyle(el.ammRootLI, 'max-height') == '700777px') {
		mode = 'accordion';
	}
	return mode;
}
