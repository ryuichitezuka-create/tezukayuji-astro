
/* 
 ================================================
 PVII Style Class Switcher scripts
 Copyright (c) 2018 Project Seven Development
 www.projectseven.com
 Version: 1.1.3 -build 11
 ================================================
 
 */
var p7SCS = {
	ctl: [],
	once: false
};
function P7_SCSaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_SCSinit, false);
		window.addEventListener("load", P7_SCSinit, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", P7_SCSinit);
	}
}

P7_SCSaddLoad();
function P7_SCSinit(){
	var i, j, dT, tB, nL, el;
	if (p7SCS.once) {
		return;
	}
	p7SCS.once = true;
	if (document.querySelectorAll) {
		dT = document.querySelectorAll('*[data-scs]');
	} else {
		return;
	}
	for (j = 0; j < dT.length; j++) {
		p7SCS.ctl.push(dT[j]);
		tB = dT[j];
		tB.scsOpt = tB.getAttribute('data-scs').split(',');
		tB.scsState = 'off';
		if (tB.scsOpt[3] && tB.scsOpt[3] !== '') {
			tB.scsEl = document.getElementById(tB.scsOpt[3]);
			P7_SCSremClass(document.getElementById(tB.scsOpt[3]), 'scs-noscript');
		} else {
			tB.scsEl = tB;
		}
		P7_SCSremClass(tB, 'scs-noscript');
		P7_SCSbindPointer(tB);
		P7_SCSaddEvent(tB, 'mousedown', function(evt){
			if (!this.scsEl) {
				return;
			}
			if (this.scsOpt[1] == 1 && this.scsState == 'on') {
				P7_SCSswitch(this, 'off');
			} else {
				P7_SCSswitch(this, 'on');
			}
			return false;
		});
		if (tB.tagName && tB.tagName == 'A') {
			P7_SCSaddEvent(tB, 'click', function(evt){
				var m = false, wH = window.location.href;
				if (this.href != wH && this.href != wH + '#') {
					if (this.href.toLowerCase().indexOf('javascript:') == -1) {
						m = true;
					}
				}
				if (!m) {
					evt.preventDefault();
				}
				return m;
			});
		}
		if (tB.scsOpt[2] == 1) {
			P7_SCSaddEvent(tB, 'mouseover', function(evt){
				if (!this.scsEl) {
					return;
				}
				if (this.scsPointer) {
					return;
				}
				P7_SCSswitch(this, 'on');
			});
			if (tB.scsOpt[1] == 1) {
				P7_SCSaddEvent(tB, 'mouseout', function(evt){
					var tg, pp, m = true;
					if (!this.scsEl) {
						return;
					}
					if (this.scsPointer) {
						return;
					}
					evt = (evt) ? evt : event;
					tg = (evt.toElement) ? evt.toElement : evt.relatedTarget;
					if (tg) {
						pp = tg;
						while (pp) {
							if (pp == this) {
								m = false;
								break;
							}
							pp = pp.parentNode;
						}
						if (m) {
							P7_SCSswitch(this, 'off');
						}
					}
				});
			}
		}
	}
}

function P7_SCSswitch(el, ac){
	if (!el.scsEl) {
		return;
	}
	if (ac == 'off') {
		if (el.scsOpt[5] == 1) {
			P7_SCSremClass(el, 'scs-active');
		}
		P7_SCSremClass(el.scsEl, el.scsOpt[0]);
		el.scsState = 'off';
	} else {
		if (el.scsOpt[5] == 1) {
			P7_SCSsetClass(el, 'scs-active');
		}
		if (el.scsOpt[6] && el.scsOpt[6] !== '') {
			P7_SCStoggle(el, el.scsOpt[6]);
		}
		if (el.scsOpt[4] == 1) {
			el.scsEl.className = el.scsOpt[0];
		} else {
			P7_SCSsetClass(el.scsEl, el.scsOpt[0]);
		}
		el.scsState = 'on';
	}
}

function P7_SCStoggle(el, cl){
	var i, j, cT, dT;
	cT = document.querySelectorAll('.' + cl);
	if (cT && cl && cl !== '') {
		for (i = 0; i < cT.length; i++) {
			dT = cT[i].querySelectorAll('*[data-scs]');
			if (dT) {
				for (j = 0; j < dT.length; j++) {
					if (dT[j].scsState == 'on' && dT[j] != el) {
						P7_SCSswitch(dT[j], 'off');
					}
				}
			}
		}
	}
}

function P7_SCSsetClass(ob, cl){
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

function P7_SCSremClass(ob, cl){
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
			if (nc === '' || nc === ' ') {
				ob.removeAttribute('class');
			} else {
				ob.className = nc;
			}
		}
	}
}

function P7_SCSaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_SCSbindPointer(el){
	if (typeof el.ontouchstart !== 'undefined') {
		el.addEventListener('touchstart', P7_SCSsetPointer, false);
	} else if (navigator.maxTouchPoints) {
		el.addEventListener('pointerdown', P7_SCSsetPointer, false);
		el.addEventListener('mouseover', P7_SCSsetPointer, false);
		el.addEventListener('pointerout', P7_SCSsetPointer, false);
		el.addEventListener('mouseout', P7_SCSsetPointer, false);
	} else if (navigator.msMaxTouchPoints) {
		el.addEventListener('MSPointerDown', P7_SCSsetPointer, false);
		el.addEventListener('mouseover', P7_SCSsetPointer, false);
		el.addEventListener('MSPointerOut', P7_SCSsetPointer, false);
		el.addEventListener('mouseout', P7_SCSsetPointer, false);
	}
}

function P7_SCSsetPointer(evt){
	if (evt.pointerType) {
		if (evt.MSPOINTER_TYPE_TOUCH || evt.pointerType == 'touch') {
			this.scsPointer = true;
		} else if (evt.MSPOINTER_TYPE_PEN || evt.pointerType == 'pen') {
			this.scsPointer = true;
		} else {
			this.scsPointer = false;
		}
	} else if (this.ontouchstart !== undefined) {
		this.scsPointer = true;
	}
}
