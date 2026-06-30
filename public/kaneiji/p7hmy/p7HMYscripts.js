
/* 
 ================================================
 PVII Harmony Grid scripts
 Copyright (c) 2017-2018 Project Seven Development
 www.projectseven.com
 Version: 1.2.0 -build 06
 ================================================
 
 */
var p7HMY = {
	ctl: [],
	status: false,
	once: false,
	ie: false,
	flex: false,
	prf: 'none'
};
function P7_HMYaddLoad(){
	if (!document.getElementById) {
		return;
	}
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_HMYinit, false);
		window.addEventListener("load", P7_HMYinit, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_hmy defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_hmy").onreadystatechange = function(){
			if (this.readyState == "complete") {
				P7_HMYinit();
			}
		};
		window.attachEvent("onload", P7_HMYinit);
	}
}

P7_HMYaddLoad();
function P7_HMYinit(){
	var i, j, el, cl, im, mx, cT, tB, iM, sD, bs, dt, sdb;
	if (p7HMY.once) {
		return;
	}
	p7HMY.once = true;
	p7HMY.ie = P7_HMYgetIEver();
	p7HMY.prf = P7_HMYgetCSSPre();
	if (p7HMY.prf != 'none' && P7_HMYsupports(p7HMY.prf + 'flex-basis') === '') {
		if (p7HMY.ie < 0 || p7HMY.ie > 9.9) {
			p7HMY.flex = true;
		}
	}
	if (p7HMY.ie > 9.9) {
		p7HMY.flex = true;
	}
	cT = P7_HMYgetByClass(document.body, 'p7HMY', 'DIV');
	for (j = 0; j < cT.length; j++) {
		p7HMY.ctl[p7HMY.ctl.length] = cT[j];
		tB = cT[j];
		P7_HMYremClass(tB, 'hmy-noscript');
		if (!p7HMY.flex) {
			P7_HMYsetClass(tB, 'hmy-legacy');
		}
		dt = tB.getAttribute('data-hmy-max-width');
		if (dt && dt !== '') {
			sdb = dt.split(',');
			bs = sdb[0] + sdb[1];
			tB.style.maxWidth = bs;
		}
		sD = P7_HMYgetByClass(tB, 'hmy-section', 'DIV');
		for (i = 0; i < sD.length; i++) {
			dt = sD[i].getAttribute('data-hmy-basis');
			if (dt && dt !== '') {
				sdb = dt.split(',');
				bs = sdb[0] + sdb[1];
				bs = (sdb[0] === '' || sdb[0] == 'auto') ? 'auto' : bs;
			} else {
				bs = 'auto';
			}
			if (p7HMY.flex) {
				sD[i].style[p7HMY.prf + 'flex-basis'] = bs;
				if(sdb.length > 2){
					sD[i].style[p7HMY.prf + 'flex-grow'] = sdb[2];
				}
			} else {
				sD[i].style.width = bs;
			}
		}
	}
}

function P7_HMYgetIEver(){
	var j, k, v = -1, nv;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7HMY.ie = v;
	}
	j = nv.indexOf('trident/');
	if (j > 0) {
		k = nv.indexOf('rv:');
		if (k && k > 0) {
			v = parseInt(nv.substring(k + 3, nv.indexOf('.', k)), 10);
		}
		p7HMY.ie = v;
	}
	return v;
}

function P7_HMYsetClass(ob, cl){
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

function P7_HMYremClass(ob, cl){
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

function P7_HMYgetByClass(el, cls, tg){
	var i, cl, aT, rS = [];
	if (typeof(el.getElementsByClassName) != 'function') {
		aT = el.getElementsByTagName(tg);
		for (i = 0; i < aT.length; i++) {
			cl = aT[i].className;
			if (cl && cl.indexOf(cls) > -1) {
				rS[rS.length] = aT[i];
			}
		}
	} else {
		rS = el.getElementsByClassName(cls);
	}
	return rS;
}

function P7_HMYgetCSSPre(){
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

function P7_HMYsupports(st){
	return document.createElement('div').style[st];
}
