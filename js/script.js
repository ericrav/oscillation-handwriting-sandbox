var Oscillation = function() {
  this.hVel   = 35.9; // a
  this.vVel   = 62.8; // b
  this.hFreq  = 22.2; // omega x
  this.vFreq  = .46; // omega y
  this.hPhase = .46; // phi x
  this.vPhase = 20; // phi y
  this.hSweep = 50; // c
  this.dt     = 5; // time in ms

  this.t = 0; // drawing time (not changed by user)
  this.x = 0; // drawing x pos
  this.y = 0; // drawing y pos

  this.context = document.getElementById('canvas').getContext('2d');
  this.context.strokeStyle = '#ff3333';
  var self = this;
  var timer;
  this.draw = function() {
    var x = self.hVel * Math.sin(self.hFreq * self.t + self.hPhase) + self.hSweep;
    var y = self.vVel * Math.sin(self.vFreq * self.t + self.vPhase);

    self.context.beginPath();
    self.context.moveTo(self.x, self.y);
    self.context.lineTo(x, y);
    self.context.stroke();

    self.t += self.dt;
    self.x = x || 0;
    self.y = y || 0;

    timer = setTimeout(self.draw, self.dt);
  }

  this.size = function(width, height) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.translate(width / 2, height / 2);
  }

  this.clearDrawing = function() {
    this.context.translate(this.context.canvas.width / -2, this.context.canvas.width / -2);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.translate(this.context.canvas.width / 2, this.context.canvas.width / 2);
  }

  this.draw();

}

var osc;
$(document).ready(function(){
  $('#canvas').width = $(window).width();
  $('#canvas').height = $(window).height();
  osc = new Oscillation();
  osc.size($(window).width(), $(window).height());
  var gui = new dat.GUI();
  gui.remember(osc);
  gui.add(osc, 'hVel', -100, 100).step(0.01);
  gui.add(osc, 'vVel', -100, 100).step(0.01);
  gui.add(osc, 'hFreq', -100, 100).step(0.01);
  gui.add(osc, 'vFreq', -100, 100).step(0.01);
  gui.add(osc, 'hPhase', -100, 100).step(0.01);
  gui.add(osc, 'vPhase', -100, 100).step(0.01);
  gui.add(osc, 'hSweep', -100, 100).step(0.01);
  gui.add(osc, 'dt', 1, 1000);  
  gui.add(osc, 'clearDrawing');  
});

$(window).resize(function() {
  $('#canvas').width = $(window).width();
  $('#canvas').height = $(window).height();
  osc.size($(window).width(), $(window).height());
})