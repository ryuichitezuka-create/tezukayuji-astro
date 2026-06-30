
/* 
 ================================================
 PVII Fullscreen Slide Show scripts
 Copyright (c) 2014-2016 Project Seven Development
 www.projectseven.com
 Version: 1.2.6 -build 19
 ================================================
 
 */
var p7FSS = {
	ctl: [],
	status: false,
	once: false,
	prf: 'none',
	active: false,
	currentShow: null,
	boxAnimDuration: 400,
	swipeDuration: 400,
	animDelay: (1000 / 60)
};
function P7_FSSset(){
	var i, h, hs, hd, sh = '', ie = P7_FSSgetIEver();
	if (!document.getElementById || (ie > 4 && ie < 6)) {
		return;
	}
	sh += '.p7fss-box {position:fixed;z-index:-1;height:100%;width:100%;left:0;top:0;overflow:hidden;padding:0;margin:0;}\n';
	sh += '.p7fss-slide {position:absolute;height:100%;width:100%;top:0;left:0;overflow:hidden;visibility:hidden;padding:0;margin:0;}\n';
	sh += '.p7fss-image {width:auto;height:auto;position:absolute;top:0px;left:0px;filter:inherit;}\n';
	sh += '.p7fss-pointer {touch-action: pan-y pinch-zoom;}\n';
	sh += '.p7fss-ms-pointer {ms-touch-action: pan-y pinch-zoom;}\n';
	p7FSS.prf = P7_FSSgetCSSPre();
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

P7_FSSset();
function P7_FSSop(){
	if (!document.getElementById) {
		return;
	}
	p7FSS.ctl[p7FSS.ctl.length] = arguments;
}

function P7_FSSbb(){
}

function P7_FSSaddLoad(){
	var ie = P7_FSSgetIEver();
	if (!document.getElementById || (ie > 4 && ie < 6)) {
		return;
	}
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_FSSinit, false);
		window.addEventListener("load", P7_FSSinit, false);
		window.addEventListener("unload", P7_FSSbb, false);
		window.addEventListener("resize", P7_FSSrsz, false);
		document.addEventListener("keydown", P7_FSSkey, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_fss defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_fss").onreadystatechange = function(){
			if (this.readyState == "complete") {
				if (p7FSS.ctl.length > 0) {
					P7_FSSinit();
				}
			}
		};
		window.attachEvent("onload", P7_FSSinit);
		window.attachEvent("onunload", P7_FSSbb);
		window.attachEvent("onresize", P7_FSSrsz);
		document.attachEvent("onkeydown", P7_FSSkey);
	}
}

P7_FSSaddLoad();
function P7_FSSinit(){
	var i, j, k, tD, bx, el, tU, tA, tC, ie, pli = 0, cN, tR, cl, md;
	if (p7FSS.ctl.length < 1) {
		return;
	}
	if (p7FSS.once) {
		return;
	}
	p7FSS.once = true;
	document.p7fsspre = [];
	ie = P7_FSSgetIEver();
	for (j = 0; j < p7FSS.ctl.length; j++) {
		tD = document.getElementById(p7FSS.ctl[j][0]);
		if (tD) {
			tD.p7opt = p7FSS.ctl[j];
			bx = document.createElement('div');
			bx.setAttribute('id', tD.id.replace('_', 'box_'));
			bx.className = 'p7fss-box ' + tD.className;
			bx.style.zIndex = tD.p7opt[9];
			bx.fssDiv = tD;
			document.getElementsByTagName('body')[0].appendChild(bx);
			el = document.createElement('div');
			el.setAttribute('id', 'p7FSSloading');
			el.className = 'p7fss-loading';
			p7FSS.loading = el;
			document.getElementsByTagName('body')[0].appendChild(el);
			if (p7FSS.prf == 'none' && tD.p7opt[1] > 2) {
				tD.p7opt[1] = 1;
			}
			if (tD.p7opt[1] != 2 && ie > 4 && ie < 8) {
				tD.p7opt[1] = 0;
			}
			tD.fssStatus = 'closed';
			tD.fssShowMode = 'pause';
			tD.fssBox = bx;
			tD.fssControls = [];
			tD.fssToolbar = false;
			tC = document.getElementById(tD.id.replace('_', 'tb_'));
			if (tC) {
				document.getElementsByTagName('body')[0].appendChild(tC);
				tD.fssToolbar = tC;
				tC.style.zIndex = (tD.p7opt[9] + 10);
			}
			tD.fssPrevNext = false;
			el = document.getElementById(tD.id.replace('_', 'ar_'));
			if (el) {
				document.getElementsByTagName('body')[0].appendChild(el);
				tD.fssPrevNext = el;
			}
			tD.fssSlides = [];
			tD.fssCurrentSlideNum = 0;
			tD.fssPreviousSlideNum = 1;
			tD.fssNumPlays = 1;
			tU = document.getElementById(tD.id.replace('_', 'list_'));
			if (tD.p7opt[3] === 0) {
				P7_FSSrandomizer(tU);
				tD.p7opt[3] = 1;
			}
			tA = tU.getElementsByTagName('A');
			k = 0;
			for (i = 0; i < tA.length; i++) {
				if (tA[i].parentNode.nodeName == "LI") {
					k++;
					tD.fssSlides[k] = tA[i];
					tA[i].fssDiv = tD.id;
					tA[i].fssSlideNum = k;
					md = 'fit';
					cl = tA[i].getAttribute('class');
					md = (/fill/.test(cl)) ? 'fill' : (/center/.test(cl)) ? 'center' : 'fit';
					tA[i].fssDisplayMode = md;
					tD.fssSlideNums = tD.fssSlides.length - 1;
					document.p7fsspre[pli] = new Image();
					document.p7fsspre[pli].cmp = false;
					document.p7fsspre[pli].fssDiv = tD.id;
					tA[i].fssPreIndex = pli;
					tA[i].fssPreImage = document.p7fsspre[pli];
					if (k < 2) {
						document.p7fsspre[pli].src = tA[i].href;
					}
					pli++;
					tA[i].fssDesc = false;
					cN = tA[i].parentNode.childNodes;
					for (var kk = 0; kk < cN.length; kk++) {
						cl = cN[kk].className;
						if (cl && /fss_desc/i.test(cl)) {
							tA[i].fssDesc = cN[kk].innerHTML;
							tA[i].fssDescClass = 'p7fss-description' + cl.replace('p7fss_desc', '');
						}
					}
				}
			}
			tR = document.getElementById(tD.id.replace('_', 'trig_'));
			if (tR) {
				tR.fssDiv = tD.id;
				tR.onclick = function(){
					var n, tD = document.getElementById(this.fssDiv);
					if (tD.fssStatus != 'open') {
						n = tD.fssCurrentSlideNum;
						n = (n < 1) ? tD.p7opt[3] : n;
						P7_FSSshowImage(tD.id, n, 1);
					}
					return false;
				};
			}
			tD.fssControls[0] = P7_FSSsetCC(tD.id, 'bp_', 'prev');
			tD.fssControls[1] = P7_FSSsetCC(tD.id, 'bn_', 'next');
			el = document.getElementById(tD.id.replace('_', 'rc_'));
			if (el) {
				el.fssDiv = tD.id;
				el.onclick = function(){
					P7_FSScloseBox(this.fssDiv);
					return false;
				};
			}
			tD.fssSwipe = false;
			P7_FSSbindSwipe(tD.fssBox, function(dir){
				var tD = this.fssDiv;
				tD.fssSwipe = true;
				if (dir == 'left') {
					P7_FSScontrol(tD.id, 'next', null, true);
				} else if (dir == 'right') {
					P7_FSScontrol(tD.id, 'prev', null, true);
				}
			});
			if (tC) {
				tD.fssControls[3] = P7_FSSsetCC(tD.id, 'rp_', 'prev');
				tD.fssControls[5] = P7_FSSsetCC(tD.id, 'rn_', 'next');
				el = document.getElementById(tD.id.replace('_', 'rpp_'));
				if (el) {
					el.p7state = 'pause';
					el.fssDiv = tD.id;
					tD.fssControls[4] = el;
					el.onclick = function(){
						var ac = (this.p7state == 'play') ? 'pause' : 'play';
						P7_FSScontrol(this.fssDiv, ac);
						return false;
					};
					el.fssSetButtonState = function(st){
						var tx;
						if (st == 'play') {
							tx = 'Pause';
							P7_FSSremClass(this, 'play');
						} else {
							tx = 'Play';
							P7_FSSsetClass(this, 'play');
						}
						this.innerHTML = tx;
					};
				}
			}
			tD.fssCurrentSlideNum = tD.p7opt[3];
			cl = P7_FSSurl(tD.id);
			el = tD.fssSlides[tD.fssCurrentSlideNum];
			if (!el.fssPreImage.cmp) {
			}
			if (cl || tD.p7opt[10] == 1) {
				P7_FSSshowImage(tD.id, tD.fssCurrentSlideNum, 1);
			}
		}
	}
}

function P7_FSSctrl(dv, ac){
	return P7_FSScontrol(dv, ac, true);
}

function P7_FSScontrol(dv, ac, bp, tch){
	var i, tD, cs, ts, op, sn, eI, eC, eD, tm = 0, pauseOnAction, rs = false, m = false;
	tD = document.getElementById(dv);
	if (tD && tD.fssSlides) {
		if (tD.fssShowTimer) {
			clearTimeout(tD.fssShowTimer);
		}
		pauseOnAction = (tD.p7opt[8] == 1) ? true : false;
		cs = tD.fssCurrentSlideNum;
		ts = tD.fssSlideNums;
		op = tD.p7opt;
		if (ac == 'pause') {
			P7_FSSpause(dv);
			return m;
		}
		if (!bp && pauseOnAction) {
			P7_FSSpause(dv);
		}
		if (ac == 'play') {
			tD.fssShowMode = 'play';
			if (tD.fssControls[4]) {
				tD.fssControls[4].p7state = 'play';
				tD.fssControls[4].fssSetButtonState('play');
			}
			ac = 'next';
			rs = true;
		}
		if (ac == 'first') {
			tD.fssDirection = 'left';
			sn = 1;
		} else if (ac == 'prev') {
			tD.fssDirection = 'left';
			sn = cs - 1;
			if (sn < 1) {
				sn = ts;
			}
		} else if (ac == 'next') {
			sn = cs + 1;
			tD.fssDirection = 'right';
			if (tD.fssShowMode == 'play') {
				if (sn > ts) {
					tD.fssNumPlays++;
					if (tD.p7opt[6] > 0 && tD.fssNumPlays > tD.p7opt[6]) {
						tD.fssNumPlays = 0;
						sn = (tD.p7opt[7] == 1) ? 1 : tD.fssSlideNums;
						P7_FSSpause(tD.id);
					} else {
						sn = 1;
					}
				}
			} else {
				if (sn > ts) {
					sn = 1;
				}
			}
		} else if (ac == 'last') {
			tD.fssDirection = 'right';
			sn = ts;
		} else {
			tD.fssDirection = 'right';
			sn = ac;
		}
		sn = (sn < 1) ? 1 : sn;
		sn = (sn > tD.fssSlideNums) ? tD.fssSlideNums : sn;
		if (sn == tD.fssCurrentSlideNum && bp != 1) {
			return m;
		}
		if (rs) {
			tm = 100;
			setTimeout("P7_FSSshowImage('" + tD.id + "'," + sn + "," + bp + ")", tm);
		} else {
			P7_FSSshowImage(tD.id, sn, bp, tch);
		}
	}
	return false;
}

function P7_FSSpause(d){
	var cD, tD = document.getElementById(d);
	if (tD) {
		tD.fssShowMode = 'pause';
		if (tD.fssShowTimer) {
			clearTimeout(tD.fssShowTimer);
		}
		if (tD.fssControls[4]) {
			tD.fssControls[4].p7state = 'pause';
			tD.fssControls[4].fssSetButtonState('pause');
		}
	}
}

function P7_FSSopenBox(dv){
	var tD = document.getElementById(dv);
	if (tD.fssStatus != 'open') {
		P7_FSScloseAll();
		tD.fssStatus = 'open';
		p7FSS.currentShow = tD;
		P7_FSSsetClass(document.getElementsByTagName('BODY')[0], 'p7fss-running');
		if (tD.p7opt[1] > 0) {
			tD.fssBox.style.visibility = 'hidden';
			tD.fssBox.style.display = 'block';
			P7_FSSsetClass(tD.fssBox, 'open');
			P7_FSSfade(tD.fssBox, 5, 100, p7FSS.boxAnimDuration, 'quad');
		} else {
			tD.fssBox.style.display = 'block';
			P7_FSSsetClass(tD.fssBox, 'open');
		}
		if (tD.fssToolbar) {
			tD.fssToolbar.style.display = 'block';
		}
		if (tD.fssPrevNext) {
			tD.fssPrevNext.style.display = 'block';
		}
		if (tD.p7opt[4] == 1) {
			tD.fssShowMode = 'play';
			if (tD.fssControls[4]) {
				tD.fssControls[4].p7state = 'play';
				tD.fssControls[4].fssSetButtonState('play');
			}
			tD.fssShowTimer = setTimeout("P7_FSScontrol('" + tD.id + "','next',2)", (tD.p7opt[5] * 1000));
		}
	}
}

function P7_FSScloseBox(dv){
	var tD = document.getElementById(dv);
	if (!tD.fssBox) {
		return;
	}
	P7_FSSremClass(tD.fssBox, 'open');
	P7_FSSpause(dv);
	clearTimeout(tD.fssWait);
	p7FSS.loading.style.display = 'none';
	tD.fssStatus = 'closed';
	p7FSS.currentShow = 'null';
	P7_FSSremClass(document.getElementsByTagName('BODY')[0], 'p7fss-running');
	if (tD.p7opt[1] > 0) {
		P7_FSSfade(tD.fssBox, 100, 0, p7FSS.boxAnimDuration, 'quad', function(){
			P7_FSSremoveSlide(this, 0);
			this.style.display = 'none';
			if (this.fssDiv.fssToolbar) {
				tD.fssToolbar.style.display = 'none';
			}
			if (this.fssDiv.fssPrevNext) {
				tD.fssPrevNext.style.display = 'none';
			}
		});
	} else {
		P7_FSSremoveSlide(tD.fssBox, 0);
		tD.fssBox.style.display = 'none';
		if (tD.fssToolbar) {
			tD.fssToolbar.style.display = 'none';
		}
		if (tD.fssPrevNext) {
			tD.fssPrevNext.style.display = 'none';
		}
	}
}

function P7_FSScloseAll(){
	var i, tD;
	for (i = 0; i < p7FSS.ctl.length; i++) {
		tD = document.getElementById(p7FSS.ctl[i][0]);
		if (tD && tD.fssBox && tD.fssStatus != 'closed') {
			P7_FSScloseBox(tD.id);
		}
	}
}

function P7_FSSshowImage(dv, sn, bp, tch){
	var i, tD, tA, tB, sW, iM, el;
	bp = (bp) ? bp : null;
	tD = document.getElementById(dv);
	P7_FSSopenBox(dv);
	if (tD.fssCurrentSlideNum == sn && bp != 1) {
		return false;
	}
	if (tD.fssShowTimer) {
		clearTimeout(tD.fssShowTimer);
	}
	if (tD.fssWait) {
		clearTimeout(tD.fssWait);
	}
	if (tD.fssCurrentSlideNum !== 0) {
		tD.fssPreviousSlideNum = tD.fssCurrentSlideNum;
	}
	tD.fssCurrentSlideNum = sn;
	tA = tD.fssSlides[sn];
	tB = tD.fssBox;
	sW = document.createElement('div');
	sW.className = 'p7fss-slide p7fss-' + tA.fssDisplayMode;
	sW.fssDisplayMode = tA.fssDisplayMode;
	iM = document.createElement('img');
	iM.className = 'p7fss-image';
	P7_FSSsetImage(iM);
	iM.fssCnt = 0;
	iM.src = tA.href;
	iM.oncontextmenu = function(){
		return false;
	};
	sW.appendChild(iM);
	sW.fssDesc = tA.fssDesc;
	if (sW.fssDesc) {
		el = document.createElement('div');
		el.className = tA.fssDescClass;
		sW.appendChild(el);
		sW.fssDescription = el;
		sW.fssDescription.innerHTML = sW.fssDesc;
	}
	tB.appendChild(sW);
	sW.fssImage = iM;
	tD.fssWait = setInterval(function(){
		P7_FSSloadImage(tD, sW, iM, sn, bp, tch);
	}, 60);
}

function P7_FSSloadImage(tD, sW, im, sn, bp, tch){
	im.fssCnt++;
	if (im.cmp && im.complete && im.height > 10 && im.width > 10) {
		clearTimeout(tD.fssWait);
		p7FSS.loading.style.display = 'none';
		P7_FSSdispA(tD.id, sn, sW, bp, tch);
	} else {
		if (im.fssCnt > 3) {
			p7FSS.loading.style.display = 'block';
		}
	}
	if (im.fssCnt > 100) {
		clearTimeout(tD.fssWait);
		if (tD.fssShowMode == 'play') {
			if (tD.fssShowTimer) {
				clearTimeout(tD.fssShowTimer);
			}
			tD.fssShowTimer = setTimeout("P7_FSScontrol('" + tD.id + "','next',2)", 200);
		}
	}
}

function P7_FSSsetImage(im){
	this.p7Status = '';
	im.onload = function(){
		this.cmp = true;
	};
	im.onerror = function(){
		this.p7Status = 'load_error';
	};
}

function P7_FSSdispA(dv, sn, sW, bp, tch){
	var tD, an, x, dur;
	tD = document.getElementById(dv);
	if (tD.fssCurrentSlideNum != sn) {
		return false;
	}
	an = tD.p7opt[1];
	dur = tD.p7opt[2];
	sW.fssImgHeight = sW.fssImage.height;
	sW.fssImgWidth = sW.fssImage.width;
	P7_FSSsetClass(sW, 'current-slide');
	P7_FSSresizer(tD);
	P7_FSShideSlide(tD, null, tch);
	if (tch) {
		an = 2;
		dur = p7FSS.swipeDuration;
	}
	if (an == 1) {
		P7_FSSfade(sW, 5, 100, dur, 'quad');
		P7_FSSdispFin(dv, sn, bp);
	} else if (an == 2) {
		x = sW.offsetWidth;
		if (tD.fssDirection == 'left') {
			x = x * -1;
		}
		sW.style.left = x + 'px';
		P7_FSSanimate(sW, 'left', 'px', x, 0, dur, 'quad');
		P7_FSSdispFin(dv, sn, bp);
	} else if (an == 3) {
		x = 100;
		if (tD.fssDirection == 'left') {
			x = x * -1;
		}
		sW.style.left = x + 'px';
		sW.style.opacity = 0.1;
		sW.style.visibility = 'visible';
		sW.offsetWidth = sW.offsetWidth;
		sW.style[p7FSS.prf + 'transition'] = 'all ' + dur + 'ms ease-out';
		sW.style.left = '0px';
		sW.style.opacity = 1;
		P7_FSSdispFin(dv, sn, bp);
	} else {
		sW.style.visibility = 'visible';
		P7_FSSdispFin(dv, sn, bp);
	}
}

function P7_FSSdispFin(dv, sn, bp){
	var tD, ns, tA;
	tD = document.getElementById(dv);
	if (tD.fssCurrentSlideNum != sn) {
		return false;
	}
	ns = tD.fssCurrentSlideNum + 1;
	ns = (ns <= tD.fssSlides.length - 1) ? ns : 1;
	tA = tD.fssSlides[ns];
	if (!tA.fssPreImage.cmp) {
		tA.fssPreImage.src = tA.href;
	}
	if (tD.fssShowMode == 'play') {
		tD.fssShowMode = 'play';
		tD.fssShowResume = false;
		if (tD.fssShowTimer) {
			clearTimeout(tD.fssShowTimer);
		}
		tD.fssShowTimer = setTimeout("P7_FSScontrol('" + tD.id + "','next',2)", (tD.p7opt[5] * 1000));
	}
}

function P7_FSSremoveSlide(bX, op){
	op = (op > -1) ? op : 1;
	if (bX.hasChildNodes()) {
		while (bX.childNodes.length > op) {
			bX.removeChild(bX.childNodes[0]);
		}
	}
}

function P7_FSShideSlide(tD, ac, tch){
	var x, bX, sW, trsnd, op, an, dur;
	an = (tch) ? 2 : tD.p7opt[1];
	dur = (tch) ? p7FSS.swipeDuration : tD.p7opt[2];
	op = (ac == 'all') ? 0 : 1;
	trsnd = (p7FSS.prf == '-webkit-' ? 'webkitTransitionEnd' : 'transitionend');
	bX = tD.fssBox;
	if (bX && bX.hasChildNodes && bX.childNodes.length > op) {
		sW = bX.childNodes[0];
		P7_FSSsetClass(sW, 'closed-slide');
		if (an == 1) {
			P7_FSSfade(sW, 100, 0, dur, 'quad', function(){
				P7_FSSremoveSlide(bX, op);
			});
		} else if (an == 2) {
			x = bX.offsetWidth * -1;
			if (tD.fssDirection == 'left') {
				x = x * -1;
			}
			P7_FSSanimate(sW, 'left', 'px', 0, x, dur, 'quad', function(){
				P7_FSSremoveSlide(bX, op);
			});
		} else if (an == 3) {
			x = -100;
			if (tD.fssDirection == 'left') {
				x = x * -1;
			}
			sW.addEventListener(trsnd, function(){
				P7_FSSremoveSlide(bX, op);
			}, false);
			sW.style.left = x + 'px';
			sW.style.opacity = 0;
		} else {
			P7_FSSremoveSlide(bX, op);
		}
	}
}

function P7_FSSgetTime(st){
	var d = new Date();
	return d.getTime() - st;
}

function P7_FSSanim(tp, t, b, c, d){
	if (tp == 'quad') {
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t + b;
		} else {
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		}
	} else {
		return (c * (t / d)) + b;
	}
}

function P7_FSSfade(ob, from, to, dur, typ, cb){
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
	ob.fadeStartTime = P7_FSSgetTime(0);
	ob.fadeDuration = dur;
	ob.p7FadeRunning = true;
	ob.p7Fade = setInterval(function(){
		P7_FSSfader(ob, cb);
	}, p7FSS.animDelay);
}

function P7_FSSfader(el, cb){
	var i, tC, tA, op, et, cet, m = false;
	et = P7_FSSgetTime(el.fadeStartTime);
	if (et >= el.fadeDuration) {
		et = el.fadeDuration;
		m = true;
	}
	if (el.p7CurrentFade != el.p7FinishFade) {
		op = P7_FSSanim(el.p7fadeType, et, el.p7StartFade, el.p7FinishFade - el.p7StartFade, el.fadeDuration);
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
		if (el.filters) {
			el.style.filter = '';
		} else {
			el.style.opacity = 1;
		}
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_FSSanimate(ob, prop, un, fv, tv, dur, typ, cb){
	if (ob.p7AnimRunning) {
		ob.p7AnimRunning = false;
		clearInterval(ob.p7FSSanim);
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
	ob.p7animStartTime = P7_FSSgetTime(0);
	ob.p7animDuration = dur;
	if (!ob.p7AnimRunning) {
		ob.p7AnimRunning = true;
		ob.p7FSSanim = setInterval(function(){
			P7_FSSanimator(ob, cb);
		}, p7FSS.animDelay);
	}
}

function P7_FSSanimator(el, cb, op){
	var i, tB, tA, tS, et, nv, m = false;
	et = P7_FSSgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_FSSanim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.style[el.p7animProp] = nv + el.p7animUnit;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7FSSanim);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_FSSrsz(bp){
	var j, tD;
	for (j = 0; j < p7FSS.ctl.length; j++) {
		tD = document.getElementById(p7FSS.ctl[j][0]);
		if (tD) {
			P7_FSSresizer(tD);
		}
	}
}

function P7_FSSresizer(tD){
	var i, sW, iM, h, w, oh, ow, hh, ww, nw, nh, nt, nl, au;
	if (tD.fssBox && tD.fssBox.hasChildNodes) {
		for (i = 0; i < tD.fssBox.childNodes.length; i++) {
			sW = sW = tD.fssBox.childNodes[i];
			oh = sW.offsetHeight;
			ow = sW.offsetWidth;
			var pad = 20;
			ow -= pad;
			oh -= pad;
			if (sW.fssDisplayMode == 'fill') {
				oh = sW.offsetHeight;
				ow = sW.offsetWidth;
				ww = ow;
				hh = ww * (sW.fssImgHeight / sW.fssImgWidth);
				if (hh < oh) {
					hh = oh;
					ww = hh * (sW.fssImgWidth / sW.fssImgHeight);
					sW.fssImage.style.height = oh + 'px';
					sW.fssImage.style.width = 'auto';
					ww = sW.fssImage.offsetWidth;
				} else {
					sW.fssImage.style.height = 'auto';
					sW.fssImage.style.width = ow + 'px';
					hh = sW.fssImage.offsetHeight;
				}
				nl = (ow - ww) / 2;
				nt = (oh - hh) / 2;
				sW.fssImage.style.left = nl + 'px';
				sW.fssImage.style.top = nt + 'px';
			} else if (sW.fssDisplayMode == 'center') {
				w = sW.fssImgWidth;
				h = sW.fssImgHeight;
				if (ow < w) {
					nw = ow;
					nh = h * (nw / w);
					h = nh;
				} else {
					nw = 'auto';
				}
				if (oh < h) {
					nh = oh;
					nw = 'auto';
				} else {
					nh = 'auto';
				}
				ww = (nw == 'auto') ? 'auto' : nw + 'px';
				hh = (nh == 'auto') ? 'auto' : nh + 'px';
				sW.fssImage.style.width = ww;
				sW.fssImage.style.height = hh;
				nl = ((ow + pad) - sW.fssImage.offsetWidth) / 2;
				nt = ((oh + pad) - sW.fssImage.offsetHeight) / 2;
				sW.fssImage.style.left = nl + 'px';
				sW.fssImage.style.top = nt + 'px';
			} else {
				w = sW.fssImgWidth;
				h = sW.fssImgHeight;
				nw = ow;
				nh = h * (nw / w);
				if (nh > oh) {
					nh = oh;
					nw = 'auto';
				} else {
					nh = 'auto';
				}
				ww = (nw == 'auto') ? 'auto' : nw + 'px';
				hh = (nh == 'auto') ? 'auto' : nh + 'px';
				sW.fssImage.style.width = ww;
				sW.fssImage.style.height = hh;
				nl = ((ow + pad) - sW.fssImage.offsetWidth) / 2;
				nt = ((oh + pad) - sW.fssImage.offsetHeight) / 2;
				sW.fssImage.style.left = nl + 'px';
				sW.fssImage.style.top = nt + 'px';
			}
		}
	}
}

function P7_FSSkey(evt){
	var k, tg, nn, ac, tD, m = true;
	if (!p7FSS.currentShow) {
		return;
	}
	evt = (evt) ? evt : event;
	tg = (evt.target) ? evt.target : evt.srcElement;
	nn = tg.nodeName.toLowerCase();
	if (!evt.altKey && !evt.ctrlKey) {
		if (nn != 'input' && nn != 'textarea') {
			k = evt.keyCode;
			tD = p7FSS.currentShow;
			if (k == 27 || (k == 88 && typeof(opera) != 'object')) {
				P7_FSScloseAll();
				m = false;
			} else if (k == 33 || k == 37 || k == 109 || k == 32 && evt.shiftKey) {
				P7_FSScontrol(tD.id, 'prev');
				m = false;
			} else if (k == 34 || k == 39 || k == 107 || k == 32) {
				P7_FSScontrol(tD.id, 'next');
				m = false;
			} else if (k == 80) {
				if (tD && tD.fssShowMode) {
					ac = (tD.fssShowMode == 'play') ? 'pause' : 'play';
					P7_FSScontrol(tD.id, ac);
					m = false;
				}
			}
		}
	}
	if (!m) {
		if (evt.preventDefault) {
			evt.preventDefault();
		}
	}
	return m;
}

var p7FSStch = {
	el: null,
	fCnt: 0,
	startX: 0,
	startY: 0,
	curX: 0,
	curY: 0
};
function P7_FSStchStart(evt){
	if (evt.touches.length == 1) {
		p7FSStch.fCnt = evt.touches.length;
		p7FSStch.startX = evt.touches[0].pageX;
		p7FSStch.startY = evt.touches[0].pageY;
		if (!p7FSStch.el) {
			p7FSStch.el = this;
		}
	} else if (evt.pointerType) {
		p7FSStch.fCnt = 1;
		p7FSStch.startX = evt.clientX;
		p7FSStch.startY = evt.clientY;
		if (!p7FSStch.el) {
			p7FSStch.el = this;
		}
	} else {
		P7_FSStchCancel(evt);
	}
}

function P7_FSStchMove(evt){
	var x;
	if (p7FSStch.startX !== 0) {
		if (evt.touches.length == 1) {
			x = Math.abs(evt.touches[0].pageX - p7FSStch.startX);
			if (x > 4) {
				evt.stopPropagation();
				evt.preventDefault();
				p7FSStch.curX = evt.touches[0].pageX;
				p7FSStch.curY = evt.touches[0].pageY;
			} else {
				P7_FSStchCancel(evt);
			}
			if (x >= 72) {
				P7_FSStchEnd(evt);
			}
		} else if (evt.pointerType) {
			x = Math.abs(evt.clientX - p7FSStch.startX);
			if (x > 4 || navigator.maxTouchPoints || navigator.msMaxTouchPoints) {
				evt.stopPropagation();
				evt.preventDefault();
				p7FSStch.curX = evt.clientX;
				p7FSStch.curY = evt.clientY;
			} else {
				P7_FSStchCancel(evt);
			}
			if (x >= 72) {
				P7_FSStchEnd(evt);
			}
		} else {
			P7_FSStchCancel(evt);
		}
	} else {
		P7_FSStchCancel(evt);
	}
}

function P7_FSStchEnd(evt){
	var swl, swa, swd, x, y, z, r;
	if (p7FSStch.fCnt == 1 && p7FSStch.curX !== 0) {
		evt.preventDefault();
		swl = Math.round(Math.sqrt(Math.pow(p7FSStch.curX - p7FSStch.startX, 2) + Math.pow(p7FSStch.curY - p7FSStch.startY, 2)));
		if (swl >= 72) {
			x = p7FSStch.startX - p7FSStch.curX;
			y = p7FSStch.curY - p7FSStch.startY;
			r = Math.atan2(y, x);
			swa = Math.round(r * 180 / Math.PI);
			if (swa < 0) {
				swa = 360 - Math.abs(swa);
			}
			if ((swa <= 45) && (swa >= 0)) {
				swd = 'left';
			} else if ((swa <= 360) && (swa >= 315)) {
				swd = 'left';
			} else if ((swa >= 135) && (swa <= 225)) {
				swd = 'right';
			} else if ((swa > 45) && (swa < 135)) {
				swd = 'down';
			} else {
				swd = 'up';
			}
			p7FSStch.el.onSwiped(swd);
			P7_FSStchCancel(evt);
		} else {
			P7_FSStchCancel(evt);
		}
	} else {
		P7_FSStchCancel(evt);
	}
}

function P7_FSStchCancel(evt){
	p7FSStch.fCnt = 0;
	p7FSStch.startX = 0;
	p7FSStch.startY = 0;
	p7FSStch.curX = 0;
	p7FSStch.curY = 0;
	p7FSStch.el = null;
}

function P7_FSSbindSwipe(ob, fn){
	if (ob.addEventListener) {
		ob.onSwiped = fn;
		if ('ontouchstart' in window) {
			ob.addEventListener('touchstart', P7_FSStchStart, false);
			ob.addEventListener('touchend', P7_FSStchEnd, false);
			ob.addEventListener('touchmove', P7_FSStchMove, false);
			ob.addEventListener('touchcancel', P7_FSStchCancel, false);
		} else if (navigator.maxTouchPoints) {
			ob.addEventListener('pointerdown', P7_FSStchStart, false);
			ob.addEventListener('pointerup', P7_FSStchEnd, false);
			ob.addEventListener('pointermove', P7_FSStchMove, false);
			P7_FSSsetClass(ob, 'p7fss-pointer');
		} else if (navigator.msMaxTouchPoints) {
			ob.addEventListener('MSPointerDown', P7_FSStchStart, false);
			ob.addEventListener('MSPointerUp', P7_FSStchEnd, false);
			ob.addEventListener('MSPointerMove', P7_FSStchMove, false);
			P7_FSSsetClass(ob, 'p7fss-ms-pointer');
		}
	}
}

function P7_FSSurl(dv){
	var i, h, s, x, k, d = 'fss', tD, dd = 'fso', pn, n = dv.replace("p7FSS_", ""), m = false;
	tD = document.getElementById(dv);
	h = document.location.search;
	if (h) {
		h = h.replace('?', '');
		s = h.split(/[=&]/g);
		if (s && s.length) {
			for (i = 0; i < s.length; i += 2) {
				if (s[i] == d || s[i] == dd) {
					x = s[i + 1];
					if (n != x.charAt(0)) {
						x = false;
					}
					if (x && x.length > 2) {
						tD.fssCurrentSlideNum = P7_FSSparsePN(x);
						if (s[i] == dd) {
							m = true;
						}
					}
				}
			}
		}
	}
	h = document.location.hash;
	if (h) {
		x = h.substring(1, h.length);
		if (n != x.charAt(3)) {
			x = false;
		}
		if (x && (x.indexOf(d) === 0 || x.indexOf(dd) === 0)) {
			tD.fssCurrentSlideNum = P7_FSSparsePN(x);
			if (x.indexOf(dd) === 0) {
				m = true;
			}
		}
	}
	return m;
}

function P7_FSSparsePN(d){
	var x = d.lastIndexOf('_');
	return parseInt(d.substr(x + 1), 10);
}

function P7_FSSrandomize(){
	return 0.5 - Math.random();
}

function P7_FSSrandomizer(ul){
	var i, tI = [], cn, k = 0, rn;
	cn = ul.childNodes;
	for (i = 0; i < cn.length; i++) {
		tI[i] = cn[i];
	}
	tI.sort(P7_FSSrandomize);
	while (k < tI.length) {
		ul.appendChild(tI[k]);
		k++;
	}
}

function P7_FSSaddSheet(sh){
	var h, hd;
	h = document.createElement('style');
	h.type = 'text/css';
	h.appendChild(document.createTextNode(sh));
	hd = document.getElementsByTagName('head');
	hd[0].appendChild(h);
}

function P7_FSSgetIEver(){
	var j, v = -1, nv, m = false;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
	}
	return v;
}

function P7_FSSgetCSSPre(){
	var i, dV, pre = ['animationDuration', 'WebkitAnimationDuration'];
	var c = 'none', cssPre = ['', '-webkit-'];
	dV = document.createElement('div');
	for (i = 0; i < pre.length; i++) {
		if (dV.style[pre[i]] !== undefined) {
			c = cssPre[i];
			break;
		}
	}
	p7FSSprf = c;
	return c;
}

function P7_FSSsetCC(dd, rp, ac){
	var d, tC;
	d = dd.replace('_', rp);
	tC = document.getElementById(d);
	if (tC) {
		tC.onclick = function(){
			return P7_FSScontrol(dd, ac);
		};
	}
	return tC;
}

function P7_FSSsetClass(ob, cl){
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

function P7_FSSremClass(ob, cl){
	if (ob) {
		var cc, nc;
		cc = ob.className;
		if (cc && cc.indexOf(cl > -1)) {
			nc = cc.replace(cl, '');
			nc = nc.replace(/\s+/g, ' ');
			nc = nc.replace(/\s$/, '');
			nc = nc.replace(/^\s/, '');
			ob.className = nc;
		}
	}
}
