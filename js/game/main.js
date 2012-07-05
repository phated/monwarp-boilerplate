/*
 *
Copyright 2011 Luis Montes

http://azprogrammer.com

 */

define([
  'dojo/_base/window',
  'dojo/_base/connect',
  'dojo/ready',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/dom-geometry',
  'box2d/Box',
  'box2d/RectangleEntity',
  'box2d/PolygonEntity',
  'game/Ball',
  'mwe/GameCore',
  'mwe/ResourceManager'
], function(win, connect, ready, dom, domConstruct, domGeom, Box, RectangleEntity, PolygonEntity, Ball, GameCore, ResourceManager){

  var debug = true;

  if(localStorage && localStorage.debug === 'n'){
    debug = false;
  }

  var SCALE = 30.0;

  // Resource Manager Variables
  var rm = null;
  var exampleImg = null;

  // Mr Doob's stats
  var stats = new Stats();
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.right    = '0';
  stats.domElement.style.bottom   = '10px';

  var world = {};

  // Some Utility Functions
  // USE AT OWN RISK
  var isPointInPoly = function(poly, pt){
    // TODO: make this more readable/understandable
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
    return c;
  };

  var getGfxMouse = function(evt){
    var coordsM = domGeom.position(dom.byId('canvas'));
    return {
      x: (evt.clientX - coordsM.x) / SCALE,
      y: (evt.clientY - coordsM.y) / SCALE
    };
  };

  var getColorFade = function(start, end, percent){
    var r = Math.floor((end.r - start.r) * percent) + start.r;
    var g = Math.floor((end.g - start.g) * percent) + start.g;
    var b = Math.floor((end.b - start.b) * percent) + start.b;
    return {
      r: r,
      g: g,
      b: b
    };
  };

  var intersect = function (s1, s2, radiiSquared) {
    var distance_squared = Math.pow(s1.x  - s2.x,2) + Math.pow(s1.y - s2.y,2);
    return distance_squared < radiiSquared;  // true if intersect
  };

  var getDegrees = function(center, pt){
    //same point
    if((center.x == pt.x) && (center.y == pt.y)){
      return 0;
    } else if(center.x == pt.x){
      if(center.y < pt.y){
        return 180;
      } else {
        return 0;
      }
    } else if(center.y == pt.y){
      if(center.x > pt.x){
        return 270;
      } else {
        return 90;
      }
    } else if((center.x < pt.x) && (center.y > pt.y)){
      //quadrant 1
      return Math.atan((pt.x - center.x)/(center.y - pt.y)) * (180 / Math.PI);
    } else if((center.x < pt.x) && (center.y < pt.y)){
      //quadrant 2
      return 90 + Math.atan((pt.y - center.y)/(pt.x - center.x)) * (180 / Math.PI);
    } else if((center.x > pt.x) && (center.y < pt.y)){
      //quadrant 3
      return 180 + Math.atan((center.x - pt.x)/(pt.y - center.y)) * (180 / Math.PI);
    } else {
      //quadrant 4
      return 270 + Math.atan((center.y - pt.y)/(center.x - pt.x)) * (180 / Math.PI);
    }
  };

  var getDistance = function(a, b){
    return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
  };

  var ptOnTable = function(pt){
    if((pt.x > (38 / SCALE)) && (pt.x < (661 / SCALE)) && (pt.y > (38 / SCALE)) && (pt.y < (347 / SCALE)) ){
      return true;
    }else{
      return false;
    }
  };
  // End Utility Functions

  // Load an image
  rm = new ResourceManager();
  exampleImg = rm.loadImage('exampleImg.png');

  // On DOM ready, do manipulation and start game loop
  ready(function(){
    if(debug){
      domConstruct.place(stats.domElement, win.body(), 'last');
    }

    var game = new GameCore({
      canvasId: 'canvas',
      resourceManager: rm,
      update: function(elapsedTime){
        // Update state here
        if(debug){
          stats.update();
        }
      },
      draw: function(ctx){
        // Draw the world here
        ctx.drawImage(exampleImg, 0, 0);
      }
    });

    game.run();
  });
});