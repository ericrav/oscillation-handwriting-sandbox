var Oscillation = function() {
  this.hVel   = 6.2; // a
  this.vVel   = 36.56; // b
  this.hFreq  = -100; // omega x
  this.vFreq  = 100; // omega y
  this.hPhase = .46; // phi x
  this.vPhase = 20; // phi y
  this.hSweep = 2; // c
  this.dt     = 1; // time in ms

  this.t = 0; // drawing time (not changed by user)
  this.x = 0; // drawing x pos
  this.y = 0; // drawing y pos
  this.lastVelX = 0;
  this.lastVelY = 0;

  this.drawing = true;

  this.popup = window.open('', 'popup', 'width=300, height=300');
  this.popup.document.write('<head><title>Velocity Domain</title></head><body><canvas id="canvas2"></canvas></body>');

  this.context = document.getElementById('canvas').getContext('2d');
  this.popupContext = this.popup.document.getElementById('canvas2').getContext('2d');
  this.popupContext.canvas.width = 300;
  this.popupContext.canvas.height = 300;
  this.popupContext.translate(150, 150);

  var self = this;
  var timer;
  this.draw = function() {
    var x = self.hVel * Math.sin(self.hFreq * self.t + self.hPhase) + self.hSweep;
    var y = self.vVel * Math.sin(self.vFreq * self.t + self.vPhase);

    self.context.beginPath();
    self.context.strokeStyle = 'rgba(48,48,48,.5)';
    self.context.moveTo(self.x, self.y);
    self.context.lineTo(self.x + x, self.y + y);
    self.context.stroke();
    self.context.closePath();

    self.popupContext.beginPath();
    self.popupContext.strokeStyle = 'rgba(48,48,48,.5)';
    self.popupContext.moveTo(self.lastVelX, self.lastVelY);
    self.popupContext.lineTo(x, y);
    self.popupContext.stroke();
    self.popupContext.closePath();

    self.t += self.dt;
    self.x += x;
    self.y += y;
    self.lastVelX = x;
    self.lastVelY = y;

    timer = setTimeout(self.draw, self.dt);
  }

  this.randomize = function() {
    this.hVel   = (Math.random() * 200) - 100;
    this.vVel   = (Math.random() * 200) - 100;
    this.hFreq  = (Math.random() * 200) - 100;
    this.vFreq  = (Math.random() * 200) - 100;
    this.hPhase = (Math.random() * 200) - 100;
    this.vPhase = (Math.random() * 200) - 100;
    this.hSweep = (Math.random() * 100) - 50;
    // Iterate over all controllers
    for (var i in gui.__controllers) {
      gui.__controllers[i].updateDisplay();
    }
    this.clearDrawing();
  }

  this.size = function(width, height) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.translate(width / 2, height / 2);
  }

  this.clearDrawing = function() {
    this.context.translate(this.context.canvas.width / -2, this.context.canvas.height / -2);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);

    this.popupContext.translate(this.popupContext.canvas.width / -2, this.popupContext.canvas.height / -2);
    this.popupContext.clearRect(0, 0, this.popupContext.canvas.width, this.popupContext.canvas.height);
    this.popupContext.translate(this.popupContext.canvas.width / 2, this.popupContext.canvas.height / 2);
    this.popupContext.moveTo(0, 0);

    this.t = 0;
    this.x = 0;
    this.y = 0;
  }

  this.toggleDrawing = function() {
    if (this.drawing) this.draw();
    else clearTimeout(timer);
  }

  this.toggleDrawing();


}

var osc, gui;
var AlwaysUpdate = function() {
  this.autoReset = false;
  var self = this;
  this.checkReset = function() {
    if (self.autoReset) osc.clearDrawing();
  }
}
$(document).ready(function(){
  $('#canvas').width = $(window).width();
  $('#canvas').height = $(window).height();
  osc = new Oscillation();
  updater = new AlwaysUpdate();
  osc.size($(window).width(), $(window).height());
  gui = new dat.GUI();
  gui.remember(osc);
  gui.add(osc, 'hVel', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'vVel', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'hFreq', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'vFreq', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'hPhase', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'vPhase', -100, 100).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'hSweep', -50, 50).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'dt', 0.01, 10).step(0.01).onFinishChange(updater.checkReset);
  gui.add(osc, 'clearDrawing');
  gui.add(osc, 'randomize');
  var drawing = gui.add(osc, 'drawing');
  drawing.onChange(function() {
    osc.toggleDrawing();
  });
  gui.add(updater, 'autoReset');

});

$(window).resize(function() {
  $('#canvas').width = $(window).width();
  $('#canvas').height = $(window).height();
  osc.size($(window).width(), $(window).height());
})