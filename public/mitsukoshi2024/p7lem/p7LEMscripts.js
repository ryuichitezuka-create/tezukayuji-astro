
/* 
 ================================================
 PVII Lag Effects Magic scripts
 Copyright (c) 2017 Project Seven Development
 www.projectseven.com
 Version: 1.0.3 -build 02
 ================================================
 
 */
var p7LEM = {
	ctl: [],
	once: false,
	prf: 'none'
};
function P7_LEMaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_LEMinit, false);
		window.addEventListener("load", P7_LEMinit, false);
		window.addEventListener("scroll", P7_LEMscroll, false);
		window.addEventListener("resize", P7_LEMrsz, false);
	}
}

P7_LEMaddLoad();
function P7_LEMinit(){
	var i, j, el, cl, im, cT, tB, iM, sD, bs, dt, sdb;
	if (p7LEM.once) {
		return;
	}
	p7LEM.once = true;
	p7LEM.prf = P7_LEMgetCSSPre();
	if (p7LEM.prf == 'none') {
		return;
	}
	cT = P7_LEMgetByAttribute('data-lem', 'p7LEM');
	for (j = 0; j < cT.length; j++) {
		p7LEM.ctl[p7LEM.ctl.length] = cT[j];
		tB = cT[j];
		tB.lemOpt = tB.getAttribute('data-lem').split(',');
		tB.lemDone = false;
		tB.style[p7LEM.prf + 'transform'] = p7LEM.prf + 'translate3d(0px,' + tB.lemOpt[1] + 'px, 0px)';
		if (tB.lemOpt[0] > 0) {
			tB.style.opacity = tB.lemOpt[5] / 100;
		}
	}
	P7_LEMscroll();
}

function P7_LEMlag(el){
	if (el.lemOpt[0] > 0) {
		el.style[p7LEM.prf + 'transition-property'] = p7LEM.prf + 'transform, opacity';
	} else {
		el.style[p7LEM.prf + 'transition-property'] = p7LEM.prf + 'transform';
	}
	el.style[p7LEM.prf + 'transition-property'] = p7LEM.prf + 'transform, opacity';
	el.style[p7LEM.prf + 'transition-timing-function'] = 'cubic-bezier(0.23, 1, 0.32, 1)';
	el.style[p7LEM.prf + 'transition-delay'] = el.lemOpt[3] + 'ms';
	el.style[p7LEM.prf + 'transition-duration'] = el.lemOpt[2] + 'ms';
	el.style[p7LEM.prf + 'transform'] = p7LEM.prf + 'translate3d(0px, 0px, 0px)';
	if (el.lemOpt[0] > 0) {
		el.style.opacity = 1;
	}
	el.lemDone = true;
}

function P7_LEMrsz(){
	P7_LEMscroll();
}

function P7_LEMscroll(){
	var i, tt, br, wh, el;
	if (document.documentElement && document.documentElement.clientHeight) {
		wh = document.documentElement.clientHeight;
	} else if (window.innerHeight) {
		wh = window.innerHeight;
	} else if (document.body) {
		wh = document.body.clientHeight;
	} else {
		return;
	}
	for (i = 0; i < p7LEM.ctl.length; i++) {
		el = p7LEM.ctl[i];
		if (!el.lemDone) {
			br = el.getBoundingClientRect();
			tt = br.top - el.lemOpt[1] + parseInt(el.lemOpt[4]);
			if (tt < wh) {
				P7_LEMlag(el);
			}
		}
	}
}

function P7_LEMgetWinHeight(){
	var h;
	if (document.documentElement && document.documentElement.clientHeight) {
		h = document.documentElement.clientHeight;
	} else if (window.innerHeight) {
		h = window.innerHeight;
	} else if (document.body) {
		h = document.body.clientHeight;
	}
	return h;
}

function P7_LEMgetByAttribute(att, cls){
	var i, nL = [], aT, rS = [], cl;
	if (document.querySelectorAll) {
		nL = document.querySelectorAll('*[' + att + ']');
	} else {
		if (typeof(document.getElementsByClassName) != 'function') {
			aT = document.getElementsByTagName('A');
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

function P7_LEMgetCSSPre(){
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
