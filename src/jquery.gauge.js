(function($) {
  $.fn.gauge = function(value, options) {
    return this.each(function() {
      if (options) {
        if ( options.type === "halfcircle") {
          return new HalfCircleGauge(this, options).value(value);
        } else {
          return new Gauge(this, options).value(value);
        }
      } else {
        return new Gauge(this, options).value(value);
      }
    });
  };
})(jQuery);

var Gauge = function(element, options) {
  var ctx = element.getContext("2d");
  var W = element.width;
  var H = element.height;

  var centerW = (W / 2);
  var position = 0;
  var new_position = 0;
  var difference = 0;
  var text = "";
  var animation_loop, redraw_loop;
  var value = 0;
  var settings = {
    min: 0,
    max: 100,
    unit: "%",
    font: "40px verdana",
    color: "lightgreen",
    colorAlpha: 1,
    bgcolor: "#222",
    type: "default"
  };

  function mergeSettings() {
    if (options) {
      settings.min = options.min || 0;
      settings.max = options.max || 100;
      settings.unit = options.unit || "%";
      settings.font = options.font || "40px verdana";
      settings.color = options.color || "lightgreen";
      settings.colorAlpha = options.colorAlpha || 1;
      settings.bgcolor = options.bgcolor || "#222";
      settings.type = options.type || "default";
    }
  }

  mergeSettings();

  // Angle in radians = angle in degrees * PI / 180
  function radians(degrees) {
    return degrees * Math.PI / 180;
  }

  function init() {
    ctx.clearRect(0, 0, W, H);

    // The gauge will be an arc
    ctx.beginPath();
    ctx.strokeStyle = settings.bgcolor;
    ctx.lineWidth = W * 0.13;
    ctx.arc(centerW, H - (centerW - ctx.lineWidth), (centerW) - ctx.lineWidth, radians(135), radians(45), false);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = W * 0.13;

    if (position > 0) {
      ctx.globalAlpha = settings.colorAlpha;
      ctx.arc(centerW, H - (centerW - ctx.lineWidth), (centerW) - ctx.lineWidth, radians(135), radians(135 + position), false);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Add the text
    ctx.fillStyle = settings.color;
    var fontArgs = ctx.font.split(' ');
    ctx.font = (W * 0.16) + 'px ' + fontArgs[fontArgs.length - 1];
    text = value + settings.unit;
    // Center the text, deducting half of text width from position x
    var text_width = ctx.measureText(text).width;
    ctx.fillText(text, centerW - text_width / 2, H - (centerW - ctx.lineWidth) + 15);
  }

  function draw() {
    // Cancel any animation if a new chart is requested
    if (typeof animation_loop !== undefined) clearInterval(animation_loop);

    new_position = Math.round((value / (settings.max - settings.min)) * 270);
    difference = new_position - position;
    animation_loop = setInterval(animate_to, 100 / difference);
  }

  // Make the chart move to new degrees
  function animate_to() {
    // Clear animation loop if degrees reaches the new_degrees
    if (position === new_position) {
      clearInterval(animation_loop);
    }

    if (position < new_position) {
      position++;
    } else {
      position--;
    }

    init();
  }

  this.value = function(v) {
    value = v;
    draw();
  };
};

var HalfCircleGauge = function (element, options){
  var ctx = element.getContext("2d");
  var W = element.width;
  var H = element.height;

  var centerW = (W / 2);
  var position = 0;
  var new_position = 0;
  var difference = 0;
  var text = "";
  var animation_loop, redraw_loop;
  var value = 0;
  var settings = {
    min: 0,
    max: 100,
    unit: "%",
    font: "40px verdana",
    color: "lightgreen",
    colorAlpha: 1,
    bgcolor: "#222",
    type: "default"
  };

  function mergeSettings() {
    if (options) {
      settings.min = options.min || 0;
      settings.max = options.max || 100;
      settings.unit = options.unit || "%";
      settings.font = options.font || "40px verdana";
      settings.color = options.color || "lightgreen";
      settings.colorAlpha = options.colorAlpha || 1;
      settings.bgcolor = options.bgcolor || "#222";
      settings.type = options.type || "default";
    }
  }

  mergeSettings();

  // Angle in radians = angle in degrees * PI / 180
  function radians(degrees) {
    return degrees * Math.PI / 180;
  }

  function init() {
    ctx.clearRect(0, 0, W, H);

    // The gauge will be an arc
    ctx.beginPath();
    ctx.strokeStyle = settings.bgcolor;
    ctx.lineWidth = W * 0.13;
    ctx.arc(centerW, H, (centerW) - ctx.lineWidth, radians(180), radians(0), false);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = W * 0.13;

    if (position > 0) {
      ctx.arc(centerW, H, (centerW) - ctx.lineWidth, radians(180), radians(180 + position), false);
      ctx.stroke();
    }

    // Add the text
    ctx.fillStyle = settings.color;
    var fontArgs = ctx.font.split(' ');
    ctx.font = (W * 0.16) + 'px ' + fontArgs[fontArgs.length - 1];
    text = value + settings.unit;
    // Center the text, deducting half of text width from position x
    text_width = ctx.measureText(text).width;
    ctx.fillText(text, centerW - text_width / 2, H - 10);
  }

  function draw() {
    // Cancel any animation if a new chart is requested
    if (typeof animation_loop !== undefined) clearInterval(animation_loop);

    new_position = Math.round((value / (settings.max - settings.min)) * 180);
    difference = new_position - position;
    animation_loop = setInterval(animate_to, 100 / difference);
  }

  // Make the chart move to new degrees
  function animate_to() {
    // Clear animation loop if degrees reaches the new_degrees
    if (position == new_position)
      clearInterval(animation_loop);

    if (position < new_position)
      position++;
    else
      position--;

    init();
  }

  this.value = function(v) {
    value = v;
    draw();
  };
};
