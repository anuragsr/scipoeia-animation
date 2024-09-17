var config = {
	getBigPlanets: function(){
		return [
			{
				base: { url: "img/p1.png", d: 200 },
				border: { url: "img/p1-b.png", d: 175 },
				glow: { url: "img/p1-g.png", d: 200 },
				mesh: { url: "img/p1-m.png", d: 175 },
				text: { v: "Spider", yOff: 70, clickY: 140 },
				subText: { v: "Easy-to-use digital self-service \nexperiences, using smart technology."},
				hitRadius: 40,
				x: -400,
				y: -110,
				clickX: -500,
				clickY: -190
			},{
				base: { url: "img/p2.png", d: 175 },
				border: { url: "img/p2-b-sm.png", d: 165 },
				glow: { url: "img/p2-g.png", d: 175 },
				mesh: { url: "img/p2-m.png", d: 175 },
				text: { v: "Suggester", yOff: 110, clickY: 230 },
				subText: { v: "Enhance customer satisfaction and cut costs by\n reimagining applications to fully leverage cloud benefits." },
				hitRadius: 70,
				x: -220,
				y: 200,
				clickX: -320,
				clickY: 320
			},{
				base: { url: "img/p3.png", d: 335 },
				border: { url: "img/p3-b-sm.png", d: 250 },
				glow: { url: "img/p3-g.png", d: 335 },
				mesh: { url: "img/p3-m.png", d: 225 },
				text: { v: "Explorer", yOff: 150, clickY: 320 },
				subText: { v: "Ensuring ethical practices with Responsible Al,\n and seamlessly integrating them." },
				hitRadius: 95,
				x: 400,
				y: -120,
				clickX: 500,
				clickY: -200
			},{
				base: { url: "img/p4.png", d: 135 },
				border: { url: "img/p4-b-sm.png", d: 125 },
				glow: { url: "img/p4-g.png", d: 135 },
				mesh: { url: "img/p4-m.png", d: 125 },				
				text: { v: "Conf Seeker", yOff: 90, clickY: 180 },
				subText: { v: "Revolutionise your customer service with\n our Digital Transformation services." },
				hitRadius: 50,
				x: 250,
				y: 250,
				clickX: 350,
				clickY: 370
			}
		]
	},
	getSmallPlanets: function(c){
		return [
			{
				url: "img/lp1.png",
				d: 50,
				x: -650,
				y: -200,
				init: {
					x: c.x - c.x - 50,
					y: c.y - 350
				}
			},{
				url: "img/lp3.png",
				d: 50,
				x: 600,
				y: 150,
				init: {
					x: c.x + c.x + 50,
					y: c.y + 300
				}
			},{
				url: "img/lp2.png",
				d: 40,
				x: -600,
				y: 50,
				init: {
					x: c.x - c.x - 50,
					y: c.y + 175
				}
			}
		]
	},
	getDots: function(c, groupNo){
		/*
			Groups are as follows:
			Gr 1 left
			Gr 2 right
			Gr 3 left
		*/
		switch(groupNo){
			case 1:
				return [
					//  Group 1
					{					
						r: 15, init:{x: -1*c.x - 15, y: -180}, x: -700, y: -300
					},{
						r: 7, init:{x: -1*c.x - 150, y: -80}, x: -800, y: -100
					},{
						r: 7, init:{x: -1*c.x - 250, y: -180}, x: -900, y: -220
					},{
						r: 5, init:{x: -1*c.x - 250, y: -280}, x: -880, y: -430
					},{
						r: 5, init:{x: -1*c.x - 300, y: -180}, x: -950, y: -250
					}
				]
			break;

			case 2:
				return [
					//  Group 2			
					{
						r: 15, init: {x: 1*c.x + 20, y: 350}, x: 700, y: 50						
					},{
						r: 17, init: {x: 1*c.x + 40, y: 350}, x: 650, y: 400				
					},{
						r: 10, init: {x: 1*c.x + 300, y: 350}, x: 1000, y: 250
					},{
						r: 7, init: {x: 1*c.x + 300, y: -350}, x: 1100, y: -250
					}
				]
			break;

			case 3: 
				return [
					//  Group 3
					{
						r: 15, init:{x: -1*c.x - 15, y: 300}, x: -650, y: 380							
					},{
						r: 5, init:{x: -1*c.x - 15, y: 350}, x: -775, y: 450							
					},{
						r: 5, init:{x: -1*c.x - 35, y: 350}, x: -850, y: 350							
					},{
						r: 10, init:{x: -1*c.x - 35, y: 150}, x: -825, y: 100							
					},{
						r: 10, init:{x: -1*c.x - 50, y: 350}, x: -1100, y: 400							
					},{
						r: 10, init:{x: -1*c.x, y: 700}, x: -1*c.x + 100, y: 700							
					}
				]
			break;
		}
	}
}