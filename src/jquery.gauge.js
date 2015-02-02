(function($) {
	$.fn.gauge = function(value, options){
		return this.each(function() {

			var settings = $.extend({
				min: 0,
				max: 100,
				unit: "%",
				font: "50px verdana",
				color: "lightgreen",
				bgcolor: "#222",
				title: ""
			}, options);

			//canvas initialization
			var ctx = this.getContext("2d");

			var W = this.width;
			var H = this.height;

			var position = 0;
			var new_position = 0;
			var difference = 0;

			var text;
			var animation_loop, redraw_loop;

			// Angle in radians = angle in degrees * PI / 180
			function radians(degrees) {
				return degrees * Math.PI / 180;
			}


			function update()
			{
				ctx.clearRect(0, 0, W, H);

				// The gauge will be an arc
				ctx.beginPath();
				ctx.strokeStyle = settings.bgcolor;
				ctx.lineWidth = 30;
				ctx.arc(W/2, H/2, 100, radians(135), radians(45), false);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = settings.color;
				ctx.lineWidth = 30;

				if (position > 0) {
					ctx.arc(W/2, H/2, 100, radians(135), radians(135 + position), false);
					ctx.stroke();
				}

				// Add the text
				ctx.fillStyle = settings.color;
				ctx.font = settings.font;
				text = value + settings.unit;
				// Center the text, deducting half of text width from position x
				text_width = ctx.measureText(text).width;
				ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
			}

			function draw()
			{
				// Cancel any animation if a new chart is requested
				if(typeof animation_loop !== undefined) clearInterval(animation_loop);

				new_position = Math.round((value/(settings.max - settings.min))*270);
				difference = new_position - position;
				animation_loop = setInterval(animate_to, 100/difference);
			}

			// Make the chart move to new degrees
			function animate_to()
			{
				// Clear animation loop if degrees reaches the new_degrees
				if(position == new_position)
					clearInterval(animation_loop);

				if(position < new_position)
					position++;
				else
					position--;

				update();
			}

			draw();
		});
	};
})(jQuery);
