// var l = console.log.bind(window.console)
class GradientLine extends PIXI.Graphics {
  constructor(start, end) {
    super();
		this.start = start;
		this.end = end;
		this.draw();
  }  

  draw() {
		this.clear();
		this.x = this.start.x;
		this.y = this.start.y;

		var getRGBChannels = function(color) {
		  var colorText = color.toString(16);
		  if (colorText.length < 6) {
		    while (colorText.length < 6) {
		      colorText = "0" + colorText;
		    }
		  }

		  return {
		    red: parseInt(colorText.slice(0, 2), 16),
		    green: parseInt(colorText.slice(2, 4), 16),
		    blue: parseInt(colorText.slice(4, 6), 16)
		  }
		}
		, colorFromData = {
    	color: this.start.c.v,
	    alpha: this.start.c.o,
	    channels: getRGBChannels(this.start.c.v)
    }
    , colorToData = {
			color: this.end.c.v,
	    alpha: this.end.c.o,
	    channels: getRGBChannels(this.end.c.v)
		}
		, prepareRGBChannelColor = function(channelColor) {
		  var colorText = channelColor.toString(16);
		  if (colorText.length < 2) {
		    while (colorText.length < 2) {
		      colorText = "0" + colorText;
		    }
		  }
		  return colorText;
		}
		, getColorOfGradient = function(from, to, coef) {
		  if (!from.alpha && from.alpha !== 0) {
		    from.alpha = 1;
		  }
		  if (!from.alpha && from.alpha !== 0) {
		    to.alpha = 1;
		  }

		  var colorRed = Math.floor(from.channels.red + coef * (to.channels.red - from.channels.red));
		  colorRed = Math.min(colorRed, 255);
		  var colorGreen = Math.floor(from.channels.green + coef * (to.channels.green - from.channels.green));
		  colorGreen = Math.min(colorGreen, 255);
		  var colorBlue = Math.floor(from.channels.blue + coef * (to.channels.blue - from.channels.blue));
		  colorBlue = Math.min(colorBlue, 255);

		  var rgb = prepareRGBChannelColor(colorRed) + 
			  				prepareRGBChannelColor(colorGreen) + 
			  				prepareRGBChannelColor(colorBlue);

		  return {
		    color: parseInt(rgb, 16),
		    alpha: from.alpha + coef * (to.alpha - from.alpha)
		  }
		}
		, getDistance = function(st, en) {
			return Math.sqrt(Math.pow(st.x-en.x,2)+Math.pow(st.y-en.y,2))
		}
		, getAngle = function(st, en) {
			var a = Math.atan((en.x-st.x)/(en.y-st.y));
			if(st.y > en.y){
				return Math.PI - a;
			}else{
				return 2*Math.PI - a;
			}
		}
		, length = getDistance(this.start, this.end)
		, stepCoef, stepColor, stepsCount = 20
		, stepHeight = length / stepsCount		
		;
		
		for (var stepIndex = 0; stepIndex < stepsCount; stepIndex++) {
		  stepCoef = stepIndex / stepsCount;
		  stepColor = getColorOfGradient(colorFromData, colorToData, stepCoef);

		  this.beginFill(stepColor.color, stepColor.alpha);
		  this.drawRect(0, length * stepCoef, 2, stepHeight);
			this.endFill();
		}

		this.rotation = getAngle(this.start, this.end);
  }
  
  update(x1, y1, x2, y2) {
		this.start.x = x1 || this.start.x;
		this.start.y = y1 || this.start.y;
		this.end.x = x2 || this.end.x;
		this.end.y = y2 || this.end.y;
	  this.draw();
  }
}

class Dot extends PIXI.Graphics {
  constructor(r, f) {
    super();
		this.r = r;
		if(f != null){
			this.fill = f;
		}else{
			this.fill = .1;
		}
		// this.vX = vX;
		// this.vY = vY;
		this.draw();
  }  

  draw() {
  	this
  	.beginFill(0xFFFFFF, this.fill)
		.drawCircle(this.x, this.y, this.r)
		.endFill()
  }
}

class Line extends PIXI.Graphics {
  constructor(points, lineSize, lineColor, op) {
    super();    
    var s = this.lineWidth = lineSize || 5;
    var c = this.lineColor = lineColor || "0x000000";
    var o = this.op = op || 1;
    this.points = points;
    this.draw(s, c, o, points);
  }
  
  draw(s, c, o, p){
    this
    .lineStyle(s, c, o)
    .moveTo(p[0], p[1])
    .lineTo(p[2], p[3])
  }

  update(p) {
   	var self = this;
    var points = this.points = p.map(function(val, index){ 
    	return val || self.points[index];
  	});
    var s = this.lineWidth, c = this.lineColor, o = this.op;    
    this.clear();
    this.draw(s, c, o, points);
  }
}

$(function(){

	var tl = new TimelineMax({ delay: 2 })
	, ctn = new PIXI.DisplayObjectContainer()
	, lineTl = new TimelineMax()
	, smPlTl = new TimelineMax()	
	, dotsTl1 = new TimelineMax({
		onUpdate: function(){
			moveDotLines(dotLineArr1)
		}
	})
	, dotsTl2 = new TimelineMax({
		onUpdate: function(){
			moveDotLines(dotLineArr2)
		}
	})
	, dotsTl3 = new TimelineMax({
		onUpdate: function(){
			moveDotLines(dotLineArr3)
		}
	})
	// , w = $(".canvas-ctn").width()
	// ,	h = $(".canvas-ctn").height()
	, w = 1920
	,	h = 1080
	, c = { x: w/2, y: h/2 }
	, pixiApp = new PIXI.Application( w, h, {
		transparent:true,
		antialias: true
	})
	, clicked = false
	, mouseover = false
	, hoverObj = {}	
	, grMouseOverTl
	, grClickTl
	, lineArr = []
	, goldLineArr = []
	, lineGrArr = []
	, goldLineGrArr = []
	, dotLineArr1 = []
	, dotLineArr2 = []
	, dotLineArr3 = []
	, dotGrArr1 = []
	, dotGrArr2 = []
	, dotGrArr3 = []
	, bigPlPosArr = []
	, bigPlScArr = []
	, smPlPosArr = []
	, bigPlGrArr = []
	, smPlGrArr = []
	, textGrArr = []
	// , sepGrArr = []
	// , subTextGrArr = []
	;

	function moveDotLines(arr){
		if(!arr.length) return;
		arr.forEach(function(obj){
			obj.line.update([
				obj.f.position.x, obj.f.position.y, 
				obj.t.position.x, obj.t.position.y
			])
		})
	}

	function resize() {
		// l(window.devicePixelRatio)

		w = window.innerWidth;
		h = window.innerHeight;
		c = { x: w/2, y: h/2 };

		pixiApp.renderer.resize(w, h);
		ctn.position.set(c.x, c.y);
		
		if(w <= 768){
			config.scrUpFactor = 2.5;
			config.pageTitleY = 625;
			ctn.scale.set(.4, .4);
		}else if(w <= 1024){
			config.scrUpFactor = 1.75;
			config.pageTitleY = 625;
			ctn.scale.set(.5, .5);
		}else if(w <= 1200){
			if(h <= 900){
				config.scrUpFactor = 1.55;
				config.pageTitleY = 675;
				ctn.scale.set(.7, .7);
			}else{
				config.scrUpFactor = 1.25;
				config.pageTitleY = 675;
				ctn.scale.set(.8, .8);
			}
		}else if(w <= 1400){	
			if(h <= 900){
				config.scrUpFactor = 1.45;
				config.pageTitleY = 650;
				ctn.scale.set(.7, .7);
			}else{
				config.scrUpFactor = 1.25;
				config.pageTitleY = 675;
				ctn.scale.set(.8, .8);
			}
		}else if(w <= 1700){
			if(h <= 900){				
				config.scrUpFactor = 1.2;
				config.pageTitleY = 600;
			}else{
				config.scrUpFactor = 1.1;
				config.pageTitleY = 600;
			}
			ctn.scale.set(.9, .9);
		}else {			
			config.scrUpFactor = 1;
			config.pageTitleY = 550;
			ctn.scale.set(1, 1);
		}
	}

	window.onresize = function(event) {
    resize();
	};

	function createCanvas(){
		// Init canvas
		pixiApp.view.style.position  = "absolute";
		pixiApp.view.style.top = pixiApp.view.style.left = 0;
		$(".canvas-ctn").append(pixiApp.view);			

		pixiApp.stage.addChild(ctn);
		ctn.pivot.set(c.x, c.y);
		ctn.position.set(c.x, c.y);

		// Dot in the center of O
		centerDot = new Dot(2, 0);
		centerDot.position.x = c.x + 21;
		centerDot.position.y = c.y + 47;	
		ctn.addChild(centerDot);

		// Data for big planets
		var bigPlArr = config.getBigPlanets()
		// Data for small planets
		, smPlArr = config.getSmallPlanets(c)
		;		

		// Dots
		dotArr1 = config.getDots(c, 1);
		dotArr2 = config.getDots(c, 2);
		dotArr3 = config.getDots(c, 3);

		// Adding dots
		dotArr1.forEach(function(obj){
			var circ = new Dot(obj.r);
			// circ.position.x = c.x + obj.init.x + 500;
			circ.position.x = c.x + obj.init.x;
			circ.position.y = c.y + obj.init.y;
			circ.posX = c.x + obj.x;
			circ.posY = c.y + obj.y;
			circ.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(circ);
			dotGrArr1.push(circ);
		})

		dotArr2.forEach(function(obj){
			var circ = new Dot(obj.r);
			// circ.position.x = c.x + obj.init.x - 500;
			circ.position.x = c.x + obj.init.x;
			circ.position.y = c.y + obj.init.y;
			circ.posX = c.x + obj.x;
			circ.posY = c.y + obj.y;
			circ.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(circ);
			dotGrArr2.push(circ);
		})

		dotArr3.forEach(function(obj){
			var circ = new Dot(obj.r);
			// circ.position.x = c.x + obj.init.x - 500;
			circ.position.x = c.x + obj.init.x;
			circ.position.y = c.y + obj.init.y;
			circ.posX = c.x + obj.x;
			circ.posY = c.y + obj.y;
			circ.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(circ);
			dotGrArr3.push(circ);
		})

		// Dot lines
		dotLineArr1 = [
			// Group 1 lines
			{
				f: dotGrArr1[0], t: dotGrArr1[1], line: {}
			},{
				f: dotGrArr1[0], t: dotGrArr1[2], line: {}
			},{
				f: dotGrArr1[0], t: dotGrArr1[4], line: {}
			},{
				f: dotGrArr1[1], t: dotGrArr1[2], line: {}
			},{
				f: dotGrArr1[2], t: dotGrArr1[4], line: {}
			},{
				f: dotGrArr1[3], t: dotGrArr1[4], line: {}
			}			
		];

		dotLineArr2 = [
			// Group 2 lines
			{
				f: dotGrArr2[0], t: dotGrArr2[2], line: {}
			},{
				f: dotGrArr2[1], t: dotGrArr2[2], line: {}
			},{
				f: dotGrArr2[0], t: dotGrArr2[3], line: {}
			},{
				f: dotGrArr2[1], t: dotGrArr2[3], line: {}
			}
		]

		dotLineArr3 = [
			// Group 3 lines
			{
				f: dotGrArr3[0], t: dotGrArr3[1], line: {}
			},{
				f: dotGrArr3[0], t: dotGrArr3[2], line: {}
			},{
				f: dotGrArr3[1], t: dotGrArr3[4], line: {}
			},{
				f: dotGrArr3[2], t: dotGrArr3[5], line: {}
			},{
				f: dotGrArr3[3], t: dotGrArr3[4], line: {}
			}
		];

		// Drawing lines between dots
		dotLineArr1.forEach(function(obj){
			var connLine = new Line([
				obj.f.position.x, obj.f.position.y,
				obj.t.position.x, obj.t.position.y
			], 1, 0xffffff, .07);			
			connLine.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(connLine);
			obj.line = connLine;
		})

		dotLineArr2.forEach(function(obj){
			var connLine = new Line([
				obj.f.position.x, obj.f.position.y,
				obj.t.position.x, obj.t.position.y
			], 1, 0xffffff, .07);			
			connLine.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(connLine);
			obj.line = connLine;
		})

		dotLineArr3.forEach(function(obj){
			var connLine = new Line([
				obj.f.position.x, obj.f.position.y,
				obj.t.position.x, obj.t.position.y
			], 1, 0xffffff, .07);			
			connLine.blendMode = PIXI.BLEND_MODES["ADD"];
			ctn.addChild(connLine);
			obj.line = connLine;
		})

		// Gold lines between planets and center
		goldLineArr = [
			{
				s:{
					x: centerDot.position.x,
					y: centerDot.position.y,
					c: { v: 0xFFFF00, o: 0}
				},
				e:{
					x: c.x + bigPlArr[0].x,
					y: c.y + bigPlArr[0].y,
					c: { v: 0xFFFF00, o: .7}
				},
				a: .6
			},{
				s:{
					x: centerDot.position.x,
					y: centerDot.position.y,
					c: { v: 0xFFFF00, o: 0}
				},
				e:{
					x: c.x + bigPlArr[1].x,
					y: c.y + bigPlArr[1].y,
					c: { v: 0xFFFF00, o: .7}
				},
				a: .6
			},{
				s:{
					x: centerDot.position.x,
					y: centerDot.position.y,
					c: { v: 0xFFFF00, o: 0}
				},
				e:{
					x: c.x + bigPlArr[2].x,
					y: c.y + bigPlArr[2].y,
					c: { v: 0xFFFF00, o: .7}
				},
				a: .6
			},{
				s:{
					x: centerDot.position.x,
					y: centerDot.position.y,
					c: { v: 0xFFFF00, o: 0}
				},
				e:{
					x: c.x + bigPlArr[3].x,
					y: c.y + bigPlArr[3].y,
					c: { v: 0xFFFF00, o: .7}
				},
				a: .6
			}
		];

		// Adding gold lines
		goldLineArr.forEach(function(obj, idx){
			var line = new GradientLine({
				x: obj.s.x,
				y: obj.s.y,
				c: obj.s.c
			},{
				x: obj.s.x,
				y: obj.s.y,
				c: obj.e.c
			});
			line.alpha = obj.a;
			ctn.addChild(line);
			goldLineGrArr.push(line);
		})

		// Start and end positions, color, alpha for the lines between planets
		lineArr = [
			{
				s:{
					x: c.x + bigPlArr[1].x,
					y: c.y + bigPlArr[1].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + bigPlArr[0].x,
					y: c.y + bigPlArr[0].y,
					c: { v: 0xFFFFFF, o: 0}
				},
				a: 1
			},{
				s:{
					x: c.x + bigPlArr[2].x,
					y: c.y + bigPlArr[2].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + bigPlArr[3].x,
					y: c.y + bigPlArr[3].y,
					c: { v: 0xFFFFFF, o: 0}
				},
				a: .7, d: .7
			},{
				s:{
					x: c.x + bigPlArr[2].x,
					y: c.y + bigPlArr[2].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + smPlArr[1].x,
					y: c.y + smPlArr[1].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				a: .5, d: 1.5
			},{
				s:{
					x: c.x + smPlArr[1].x,
					y: c.y + smPlArr[1].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + bigPlArr[3].x,
					y: c.y + bigPlArr[3].y,
					c: { v: 0xFFFFFF, o: 0}
				},
				a: .5, d: 1
			},{
				s:{
					x: c.x + bigPlArr[0].x,
					y: c.y + bigPlArr[0].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + smPlArr[2].x,
					y: c.y + smPlArr[2].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				a: .3, d: .2
			},{
				s:{
					x: c.x + smPlArr[2].x,
					y: c.y + smPlArr[2].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + smPlArr[0].x,
					y: c.y + smPlArr[0].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				a: .7, d: 1
			},{
				s:{
					x: c.x + bigPlArr[1].x,
					y: c.y + bigPlArr[1].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				e:{
					x: c.x + smPlArr[2].x,
					y: c.y + smPlArr[2].y,
					c: { v: 0xFFFFFF, o: .2}
				},
				a: .5, d: 1.3
			}
		];

		// Adding lines between planets
		lineArr.forEach(function(obj){
			var line = new GradientLine({
				x: obj.s.x,
				y: obj.s.y,
				c: obj.s.c
			},{
				x: obj.s.x,
				y: obj.s.y,
				c: obj.e.c
			});
			line.alpha = obj.a;
			obj.line = line;
			ctn.addChild(line);
			lineGrArr.push(line);
		})

		// Adding small planets
		smPlArr.forEach(function(obj){
			var img = new PIXI.Sprite( new PIXI.Texture.fromImage(obj.url) );
			img.anchor.set(0.5);
			img.width = img.height = obj.d;
			img.x = obj.init.x;
			img.y = obj.init.y;	
			img.posX = c.x + obj.x;
			img.posY = c.y + obj.y;
			ctn.addChild(img);

			smPlGrArr.push(img);
			smPlPosArr.push(img.position);
		})

		// Adding big planets
		bigPlArr.forEach(function(obj){
			
			// Main container containing the planet discs, text, subtext
			var mainGr = new PIXI.DisplayObjectContainer();
			
			// Container for the different images of a single planet
			var gr = new PIXI.DisplayObjectContainer();
			
			// Base
			var img = new PIXI.Sprite( new PIXI.Texture.fromImage(obj.base.url) );
			img.width = img.height = obj.base.d;
			img.anchor.set(0.5);
			img.name = "base";
			gr.addChild(img);

			// Border
			img = new PIXI.Sprite( new PIXI.Texture.fromImage(obj.border.url) );
			img.width = img.height = obj.border.d;
			img.anchor.set(0.5);
			img.name = "border";
			gr.addChild(img);

			// Glow
			img = new PIXI.Sprite( new PIXI.Texture.fromImage(obj.glow.url) );
			img.width = img.height = obj.glow.d;
			img.anchor.set(0.5);
			img.alpha = 0;
			img.name = "glow";
			gr.addChild(img);

			// Mesh
			img = new PIXI.Sprite( new PIXI.Texture.fromImage(obj.mesh.url) );
			img.width = img.height = obj.mesh.d;
			img.anchor.set(0.5);
			img.alpha = 0;
			img.name = "mesh";
			gr.addChild(img);			

			// Adding main text for each planet
			var text = new PIXI.Text(obj.text.v, new PIXI.TextStyle({
			  fontFamily: "title",
			  fontWeight: "bold",
			  fill: "#fff"
			}));
			text.name = "text";
			text.alpha = 0;
			text.anchor.set(0.5);			
			text.position.set(0, obj.text.yOff);
			text.clickY = obj.text.clickY;
			mainGr.addChild(text);
			textGrArr.push(text);

			// Adding separator
			var sep = new PIXI.Graphics();
			sep.beginFill(0xFFFF00);			
			sep.drawRect(0, 0, 70, 2);
			sep.alpha = 0;
			sep.name = "sep";
			sep.position.set(-35, obj.text.yOff + 25);
			mainGr.addChild(sep);			

			// Adding sub-text for each planet
			text = new PIXI.Text(obj.subText.v, new PIXI.TextStyle({
			  fontFamily: "lato",
			  align: "center",
			  fontSize: 14,
			  fill: "#fff"
			}));
			text.name = "subtext";
			text.alpha = 0;
			text.anchor.set(0.5);
			text.position.set(0, obj.text.yOff + 50);
			mainGr.addChild(text);

			// Move group to center of screen (center of letter o)			
			mainGr.position.set(centerDot.position.x, centerDot.position.y);
			bigPlPosArr.push(mainGr.position);

			// Set scale to 0, 0
			gr.scale.set(0, 0);
			bigPlScArr.push(gr.scale);

			// Final positions to animate to
			mainGr.posX = c.x + obj.x;
			mainGr.posY = c.y + obj.y;

			// Click positions to animate to
			mainGr.clickX = c.x + obj.clickX;
			mainGr.clickY = c.y + obj.clickY;

			gr.name = "discs";
			mainGr.addChild(gr);
			ctn.addChild(mainGr);
	
			// For further manipulation
			bigPlGrArr.push(mainGr);			

			// Set disc group in rotation			
			TweenMax.to(gr, 100, {
				rotation: 2*Math.PI,
				repeat: -1,
				ease: Linear.easeNone
			});

			// Mouse Events
			gr.hitArea = new PIXI.Circle(0, 0, obj.hitRadius);

			gr.mouseover = function(e){
				// l("Entered planet")
				if(!clicked){

					var discs = hoverObj.discs = e.target;
					var currGr = hoverObj.currGr = discs.parent;
					var idx = hoverObj.idx = bigPlGrArr.indexOf(currGr);
					var remGr = hoverObj.remGr = bigPlGrArr.filter(function(obj, i){
						return idx !== i;
					});
					// l(remGr)

					var toHide = hoverObj.toHide = discs.children.filter(function(x){
						return x.name == "border";
					})
					var toShow = hoverObj.toShow = discs.children.filter(function(x){
						return x.name == "mesh" || x.name == "glow";
					})
					var textGr = hoverObj.textGr = discs.parent.children.filter(function(x){
						return x.name == "text";
					})[0];
					var sepGr = hoverObj.sepGr = discs.parent.children.filter(function(x){
						return x.name == "sep";
					})[0];
					var subTextGr = hoverObj.subTextGr = discs.parent.children.filter(function(x){
						return x.name == "subtext";
					})[0];
					var lineObj = hoverObj.lineObj = $.extend({}, goldLineArr[idx]);
					var lineGr = hoverObj.lineGr = goldLineGrArr[idx];									

					grMouseOverTl = new TimelineMax({
						paused: true,
						onReverseComplete: function(){
							clicked = false;
							mouseover = false;
						}
					});

					grMouseOverTl
					.to(discs.scale, .2, { x: 1.15, y: 1.15 }, "lb0")
					.to(toHide, .3, { alpha: 0 }, "lb0")
					.to(textGr.scale, .3, { x: 1.05, y: 1.05 }, "lb0")
					.to(textGr, .3, { alpha: 1 }, "lb0")
					.to(sepGr, .3, { alpha: .6 }, "lb0")
					.to(subTextGr, .3, { alpha: .3 }, "lb0")
					.to(subTextGr.position, .3, { y: "+=10" }, "lb0")
					.to(lineObj.s, .5, {
						x: lineObj.e.x,
						y: lineObj.e.y,
						onUpdate: function(){
							lineGr.update(null, null, this.target.x, this.target.y)
						}
					}, "lb0")					
					.add("lb1", "lb0+=0.1")
					.to(toShow, .3, { alpha: 1, rotation: "+=.1" }, "lb1")

					if(!mouseover){
						// l("Timeline started")
						mouseover = true;
						grMouseOverTl.play();
					}else{
						// l("Timeline not started")
						grMouseOverTl.delay(.1).play();					
					}				
				}
			}

			gr.mouseout = function(e){
				// l("Exit")
				if(!clicked){
					grMouseOverTl.reverse().timeScale(3);
				}
			}

			gr.mousedown = function(e){
				// l("Planet clicked")
				if(!clicked){
					clicked = true;
					mouseover = true;
					grClickTl = new TimelineMax({
						onReverseComplete: function(){
							TweenMax.to(discs.scale, .3, { x: 1, y: 1 })
							grMouseOverTl.reverse().timeScale(3)
						}
					});
					if(!grClickTl.isActive()){
						var currGr = hoverObj.currGr;
						var discs = hoverObj.discs;
						var textGr = hoverObj.textGr;
						var sepGr = hoverObj.sepGr;
						var subTextGr = hoverObj.subTextGr;
						var lineObj = $.extend({}, goldLineArr[hoverObj.idx]);
						var lineGr = hoverObj.lineGr;
						var remGr = hoverObj.remGr;
						var remGrPos = [];
						remGr.forEach(function(obj){
							remGrPos.push(obj.position)						
						})

						grClickTl
							// DOM Elements
							.to(".txt-ctn .title, .txt-ctn .sub-title", .5, {scaleX:.8, scaleY:.8, opacity: .5}, "lb0")
							.to(".txt-ctn .logo, .txt-ctn .logo-txt", .5, {scaleX:.5, scaleY:.5, opacity: 0}, "lb0")
							.to(".txt-ctn .sub-title", .5, {y: "-=20"}, "lb0")
							// Canvas Elements
							.to(discs.scale, .5, { x: 2.5, y: 2.5 }, "lb0")				
							.to(currGr.position, .5, { 
								x: centerDot.position.x, 
								y: centerDot.position.y,
								onUpdate: function(){
									if(hoverObj.idx == 0){
										lineArr[0].line.update(null, null, this.target.x, this.target.y)
										lineArr[4].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 1){
										lineArr[0].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 2){
										lineArr[1].line.update(this.target.x, this.target.y, null, null)
										lineArr[2].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 3){
										lineArr[1].line.update(null, null, this.target.x, this.target.y)									
										lineArr[3].line.update(null, null, this.target.x, this.target.y)									
									}
								}
							}, "lb0")
							.to(textGr.position, .5, { 
								y: textGr.clickY
							}, "lb0")
							.to(sepGr.position, .5, { 
								y: textGr.clickY + 30
							}, "lb0")
							.to(subTextGr.position, .5, { 
								y: textGr.clickY + 70
							}, "lb0")
							.to(lineGr, .2, { alpha: 0 }, "lb0")
							// .to(lineObj.e, .5, {
							// 	x: lineObj.s.x,
							// 	y: lineObj.s.y,
							// 	onUpdate: function(){
							// 		lineGr.update(this.target.x, this.target.y, null, null)
							// 	}
							// }, "lb0")
							.to(remGrPos[0], .5, {
								x: remGr[0].clickX,
								y: remGr[0].clickY,
								onUpdate: function(){
									if(hoverObj.idx == 0){
										lineArr[0].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 1){
										lineArr[0].line.update(null, null, this.target.x, this.target.y)
										lineArr[4].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 2){
										lineArr[0].line.update(null, null, this.target.x, this.target.y)
										lineArr[4].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 3){
										lineArr[0].line.update(null, null, this.target.x, this.target.y)
										lineArr[4].line.update(this.target.x, this.target.y, null, null)
									}
								}
							}, "lb0")
							.to(remGrPos[1], .5, {
								x: remGr[1].clickX,
								y: remGr[1].clickY,
								onUpdate: function(){
									if(hoverObj.idx == 0){
										lineArr[1].line.update(this.target.x, this.target.y, null, null)
										lineArr[2].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 1){
										lineArr[1].line.update(this.target.x, this.target.y, null, null)
										lineArr[2].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 2){
										lineArr[0].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(this.target.x, this.target.y, null, null)
									}else if(hoverObj.idx == 3){
										lineArr[0].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(this.target.x, this.target.y, null, null)
									}
								}
							}, "lb0")
							.to(remGrPos[2], .5, {
								x: remGr[2].clickX,
								y: remGr[2].clickY,
								onUpdate: function(){
									if(hoverObj.idx == 0){
										lineArr[1].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(null, null, this.target.x, this.target.y)
									}else if(hoverObj.idx == 1){
										lineArr[1].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(null, null, this.target.x, this.target.y)
									}else if(hoverObj.idx == 2){
										lineArr[1].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(null, null, this.target.x, this.target.y)
									}else if(hoverObj.idx == 3){
										lineArr[2].line.update(this.target.x, this.target.y, null, null)
									}
								}
							}, "lb0")
							.staggerTo(ctn.children, .5, {
								y: "-=" + (config.scrUpFactor * h)
							}, 0, "lb1")
							.to(currGr.children[0].position, .5, {
								y: config.pageTitleY/window.devicePixelRatio
							}, "lb1")
							.to(currGr.children[1].position, .5, {
								y: config.pageTitleY/window.devicePixelRatio + 25
							}, "lb1")
							.to(currGr.children[2].position, .5, {
								y: config.pageTitleY/window.devicePixelRatio + 60
							}, "lb1")
							.to(".canvas-ctn", .5, {
								backgroundColor: "rgba(0,0,0,.7)"
							}, "lb1")
							.add("lb2", "lb1+=.1")					
							.to(".txt-ctn .inner", .5, {
								y: "-=" + h/2
							}, "lb2")
							.to(".test", .5, {left: 0}, "lb2")
						
						// Moving small planets and lines
						if(hoverObj.idx == 0){
							grClickTl
								.to(lineArr[0].line, .5, { alpha:0 }, "lb0")
								.to(smPlPosArr[0], .5, {
									x:"+=150", y: "+=25",
									onUpdate: function(){
										lineArr[5].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
								.to(smPlPosArr[1], .5, {
									x:"+=150", y: "+=100",
									onUpdate: function(){
										lineArr[2].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(this.target.x, this.target.y, null, null)
									}
								}, "lb0")
								.to(smPlPosArr[2], .5, {
									x:"-=50", y: "+=50",
									onUpdate: function(){
										lineArr[4].line.update(null, null, this.target.x, this.target.y)
										lineArr[5].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
						}else if(hoverObj.idx == 1){
							grClickTl
								.to(lineArr[0].line, .5, { alpha:0 }, "lb0")
								.to(smPlPosArr[0], .5, {
									x:"-=150", y: "-=25",
									onUpdate: function(){
										lineArr[5].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
								.to(smPlPosArr[1], .5, {
									x:"+=150", y: "+=150",
									onUpdate: function(){
										lineArr[2].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(this.target.x, this.target.y, null, null)
									}
								}, "lb0")
								.to(smPlPosArr[2], .5, {
									x:"-=150", y: "+=100",
									onUpdate: function(){
										lineArr[4].line.update(null, null, this.target.x, this.target.y)
										lineArr[5].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
						}else if(hoverObj.idx == 2){
							grClickTl
								.to(lineArr[1].line, .5, { alpha:0 }, "lb0")
								.to(smPlPosArr[0], .5, {
									x:"-=150", y: "+=50",
									onUpdate: function(){
										lineArr[5].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
								.to(smPlPosArr[1], .5, {
									x:"+=50", y: "-=250",
									onUpdate: function(){
										lineArr[2].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(this.target.x, this.target.y, null, null)
									}
								}, "lb0")
								.to(smPlPosArr[2], .5, {
									x:"-=75", y: "+=150",
									onUpdate: function(){
										lineArr[4].line.update(null, null, this.target.x, this.target.y)
										lineArr[5].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
						}else if(hoverObj.idx == 3){
							grClickTl
								.to(lineArr[1].line, .5, { alpha:0 }, "lb0")
								.to(smPlPosArr[0], .5, {
									x:"-=150", y: "+=50",
									onUpdate: function(){
										lineArr[5].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
								.to(smPlPosArr[1], .5, {
									x:"+=100", y: "+=150",
									onUpdate: function(){
										lineArr[2].line.update(null, null, this.target.x, this.target.y)
										lineArr[3].line.update(this.target.x, this.target.y, null, null)
									}
								}, "lb0")
								.to(smPlPosArr[2], .5, {
									x:"-=75", y: "+=150",
									onUpdate: function(){
										lineArr[4].line.update(null, null, this.target.x, this.target.y)
										lineArr[5].line.update(this.target.x, this.target.y, null, null)
										lineArr[6].line.update(null, null, this.target.x, this.target.y)
									}
								}, "lb0")
						}

						// Moving dot groups and ilnes
						dotGrArr1.forEach(function(obj){
							grClickTl.to(obj, .5, {
								x: "-=100",
								y: "-=50",
								onUpdate: function(){
									moveDotLines(dotLineArr1)
								}
							}, "lb0")
						})

						dotGrArr2.forEach(function(obj){
							grClickTl.to(obj, .5, {
								x: "+=100",
								y: "+=50",
								onUpdate: function(){
									moveDotLines(dotLineArr2)
								}
							}, "lb0")
						})

						dotGrArr3.forEach(function(obj){
							grClickTl.to(obj, .5, {
								x: "-=100",
								y: "+=100",
								onUpdate: function(){
									moveDotLines(dotLineArr3)
								}
							}, "lb0")
						})
					}
				}
			}
		})

	}

	function createAnim(){
		var logoImgs = $(".logo-txt-inner .anim");
		var oNorm = $(".logo-txt-inner")[1];
		var oGlow = $(".logo-txt-inner")[2];

		tl
			.to([oNorm, oGlow], 1, {scaleX:1, scaleY:1})
			.to(oGlow, 1, {opacity: 1}, "lb0")
			.to(logoImgs[0], 1.2, {x:".5%"}, "lb0")
			.to(logoImgs[1], 1.2, {x:"-56%"}, "lb0")
			.set([oNorm, oGlow], {css:{zIndex: 0}})
			.add("lb1", "lb0+=.5")
			.to(".logo img", .8, {
				x: 0,
				y: 0,
				rotationZ: 0,
				filter: "blur(0px)",
				opacity: 1
			}, "lb1")
			.to(".txt-ctn hr", .5, {
				width: 796,
				opacity: 1
			}, "lb2")
			.to(".title .inner, .sub-title .inner", 1, {
				top: 0
			}, "lb3")
			.to(".txt-ctn hr", 1.5, {
				width: 0,
				opacity: 0
			}, "lb3+=.5")				
			.staggerTo(bigPlScArr, 2, {
				x: 1,
				y: 1,
				ease: Power4.easeOut
			}, .1, "lb4")
			.staggerTo(bigPlPosArr, 4, {
				cycle:{				
					x: function(i){
						return bigPlGrArr[i].posX;
					},
					y: function(i){
						return bigPlGrArr[i].posY;
					},
					ease: [Power4.easeOut]
				}
			}, .1, "lb4")
			.add("lb5", "lb4+=2.5")
			.staggerTo(textGrArr, .4, {
				alpha: .2
			}, 0, "lb5", function(){
				// Add event listeners now
				bigPlGrArr.forEach(function(gr){
					gr.children.filter(function(x){
						return x.name == "discs";
					})[0].interactive = true;
				})
			})
			.add("lb6", "lb4+=2")
			.add(smPlTl, "lb6")
			.add("lb7", "lb5+=.1")
			.add(lineTl, "lb7")		
			.add("lb8", "lb6+=1")
			.add(dotsTl1, "lb8")
			.add("lb9", "lb8+=.5")
			.add(dotsTl2, "lb9")
			.add("lb10", "lb9+=.5")
			.add(dotsTl3, "lb10")
		.stop()

		lineArr.forEach(function(obj, idx){
			if(idx > 0){
				lineTl.add("lb"+idx, "lb"+(idx-1)+"+="+obj.d)
			}else{
				lineTl.add("lb"+idx)
			}

			lineTl
			.to(obj.s, 1, {
				x: obj.e.x,
				y: obj.e.y,
				onUpdate: function(){
					// From point constant, to point changing
					lineGrArr[idx].update(null, null, this.target.x, this.target.y)
				}
			}, "lb"+idx)
		})
		// lineTl.stop();

		smPlTl
			.add("lb0")
			.to(smPlPosArr[0], 6, {
				x: smPlGrArr[0].posX,
				y: smPlGrArr[0].posY,
				ease: Power4.easeOut
			}, "lb0")
			.add("lb1", "lb0+=1")
			.to(smPlPosArr[1], 6, {
				x: smPlGrArr[1].posX,
				y: smPlGrArr[1].posY,
				ease: Power4.easeOut
			}, "lb1")
			.add("lb2", "lb1+=1")
			.to(smPlPosArr[2], 6, {
				x: smPlGrArr[2].posX,
				y: smPlGrArr[2].posY,
				ease: Power4.easeOut
			}, "lb2")
		// .stop()

		dotsTl1
			.add("lb0")
			.to(dotGrArr1[0].position, 15, {
				x: dotGrArr1[0].posX,
				y: dotGrArr1[0].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr1[1].position, 15, {
				x: dotGrArr1[1].posX,
				y: dotGrArr1[1].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr1[2].position, 15, {
				x: dotGrArr1[2].posX,
				y: dotGrArr1[2].posY,
				ease: Power4.easeOut
			}, "lb0")
			.add("lb1", "lb0+=.5")
			.to(dotGrArr1[3].position, 15, {
				x: dotGrArr1[3].posX,
				y: dotGrArr1[3].posY,
				ease: Power4.easeOut
			}, "lb1")
			.add("lb2", "lb1+=.5")
			.to(dotGrArr1[4].position, 15, {
				x: dotGrArr1[4].posX,
				y: dotGrArr1[4].posY,
				ease: Power4.easeOut
			}, "lb2")
		// .stop()

		dotsTl2
			.add("lb0")
			.to(dotGrArr2[0].position, 15, {
				x: dotGrArr2[0].posX,
				y: dotGrArr2[0].posY,
				ease: Power4.easeOut
			}, "lb0")
			.add("lb1", "lb0+=0.3")
			.to(dotGrArr2[1].position, 15, {
				x: dotGrArr2[1].posX,
				y: dotGrArr2[1].posY,
				ease: Power4.easeOut
			}, "lb1")
			.to(dotGrArr2[2].position, 15, {
				x: dotGrArr2[2].posX,
				y: dotGrArr2[2].posY,
				ease: Power4.easeOut
			}, "lb1")
			.add("lb2", "lb1+=0.3")
			.to(dotGrArr2[3].position, 15, {
				x: dotGrArr2[3].posX,
				y: dotGrArr2[3].posY,
				ease: Power4.easeOut
			}, "lb2")
		// .stop()

		dotsTl3
			.add("lb0")
			.to(dotGrArr3[0].position, 15, {
				x: dotGrArr3[0].posX,
				y: dotGrArr3[0].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr3[1].position, 15, {
				x: dotGrArr3[1].posX,
				y: dotGrArr3[1].posY,
				ease: Power4.easeOut
			}, "lb0")			
			.to(dotGrArr3[2].position, 15, {
				x: dotGrArr3[2].posX,
				y: dotGrArr3[2].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr3[3].position, 15, {
				x: dotGrArr3[3].posX,
				y: dotGrArr3[3].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr3[4].position, 15, {
				x: dotGrArr3[4].posX,
				y: dotGrArr3[4].posY,
				ease: Power4.easeOut
			}, "lb0")
			.to(dotGrArr3[5].position, 15, {
				x: dotGrArr3[5].posX,
				y: dotGrArr3[5].posY,
				ease: Power4.easeOut
			}, "lb0")
		// .stop()
	}	

	WebFont.load({
    custom: {
      families: ['title', 'lato']
    },
    active: function(){
    	// l("font loaded")
    	$('<img/>').attr('src', 'img/bg.jpg').on('load', function() {
			  $(this).remove(); // prevent memory leaks
			  $('body').css('background', 'url(img/bg.jpg) no-repeat center');
			  $('body').css('background-size', 'cover');
				createCanvas()
				createAnim()
				resize()
				tl.play()
			});
    }
  });

	$("#start").on("click", function(){
		tl.seek("lb4").play()
	})

	$("#reset").on("click", function(){
		tl.seek(0).play()
	})

	$("#reverse").on("click", function(e){
		e.preventDefault()
		grClickTl.reverse().timeScale(2)
	})

	$(".canvas-ctn").on("click", function(){
		if(tl.isActive()){
			// l("canvas clicked")
			tl.tweenTo(tl.duration()).duration(1)
		}
	})
})