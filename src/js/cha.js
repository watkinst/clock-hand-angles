(function () {

  var clock = (function() {
    // clock on the left that is controlled by the time inputs
    var canvas = document.querySelector("#canvas");

    // the panel that holds the second clock
    var panel2 = document.querySelector('.clock-panel-2');

    // where we append the clock that appears on the right
    var secondCanvas = document.querySelector('.second-canvas');

    // areas to display exact angles from both clocks
    var c1_negAngle = document.querySelector('.c1-neg-angle');
    var c1_posAngle = document.querySelector('.c1-pos-angle');
    var c2_negAngle = document.querySelector('.c2-neg-angle');
    var c2_posAngle = document.querySelector('.c2-pos-angle');

    // the hour, minute, and second values from our inputs
    var hour = document.querySelector('#hour');
    var minute = document.querySelector('#minute');
    var second = document.querySelector('#second');

    // disable typing in the number inputs
    var numberInputs = document.querySelectorAll('[type="number"]');
    numberInputs.forEach(function(numberInput) {
      numberInput.onkeypress = function(evt) {
        evt.preventDefault();
      };
    });

    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;

    var outerAngleDegrees = 0;
    var innerAngleDegrees = 0;

    // moves the circle origin to the center of the
    // canvas, so we get to see the whole clock
    ctx.translate(radius, radius);

    // slightly shrink the radius to allow for some
    // padding between the clock and the canvas edge
    radius = radius * 0.90

    // render the initial clock
    draw(ctx);

    function draw(ctx) {
      drawFace(ctx, radius);
      drawDegreeNumbers(ctx, radius, false);
      drawDegreeNumbers(ctx, radius, true);
      drawDegreeMarkers(ctx, radius);
      drawTimeNumbers(ctx, radius);
      drawTime(ctx, radius);
      drawAngles(ctx, radius, 0, false);

      // does the angle between the clock hands
      // occur anywhere else on the clock face?
      findSameAngle();
    }

    function findSameAngle() {
      // distance moved per second
      var hourHandDps = 0.008333333333333;
      var minuteHandDps = 0.1;

      // holds any times with a matching
      // angle between the clock hands
      var timesToRender = [];

      // degrees moved and difference
      var hourHandDegreesMoved = 0;
      var minuteHandDegreesMoved = 0;
      var difference = 0;

      // our tolerance for error
      var acceptedDiff = 0.001;

      // the hour we are currently checking
      var currentHour = 0;

      // minutes and seconds where a matching angle occurs
      var minutes = 0;
      var seconds = 0;

      // all canvases on our page
      var canvases = document.querySelectorAll('.canvas');

      // used to create a new canvas and context that
      // gets used if a matching angle is found
      var newCanvas = null;
      var context = null;

      // check through all hours, beginning at
      // noon (0), looking for a matching angle
      for (var i = 0; i <= 330; i += 30) {
        // check all 3600 seconds in each hour
        for (var j = 0; j <= 3600; j++) {
          hourHandDegreesMoved = i + (j * hourHandDps);
          minuteHandDegreesMoved = j * minuteHandDps;
          difference = minuteHandDegreesMoved - hourHandDegreesMoved;

          currentHour = 0;

          switch (i) {
            case 0:
              currentHour = 12;
              break;
            default:
              currentHour = i / 30;
          }

          // if the angle ( difference ) between the clock hands at the time
          // being tested is within 1/1000th of a degree of the positive or
          // negative angle formed by the first clock's hour and minute hands
          // then we have a match
          if((Math.abs(difference - innerAngleDegrees) < acceptedDiff) ||
             (Math.abs(difference + innerAngleDegrees) < acceptedDiff) ||
             (Math.abs(difference - outerAngleDegrees) < acceptedDiff) ||
             (Math.abs(difference + outerAngleDegrees) < acceptedDiff)) {
            // get minutes and seconds from our inner counter
            minutes = (j - (j % 60)) / 60;
            seconds = j % 60;

            // bump the hours up if we have 60 minutes
            if (minutes === 60) {
              minutes = 0;
              currentHour = currentHour + 1;
            }

            // avoid any hours like 0 or 13, 14, etc ...
            currentHour = currentHour % 12;

            if (currentHour == 0) {
              currentHour = 12;
            }

            // the same angle can't occur within the same hour
            if (currentHour != hour.value) {
              timesToRender.push({
                hour: currentHour,
                minutes: minutes,
                seconds: seconds
              });
            }
          }
        }
      }

      // since each angle actually occurs twice, but we only
      // need the one that is not during the current hour
      timesToRender.splice(1, 1);

      // delete the prior canvas before
      // creating and appending a new one
      // Must do it this way because the one we want
      // to remove is not there on initial page load
      canvases.forEach(function(canvas, index) {
        if (index !== 0) {
          canvas.parentNode.removeChild(canvases[index]);
        }
      });

      // create and append a new canvas
      newCanvas = document.createElement('canvas');
      newCanvas.setAttribute('id', 'canvas1');
      newCanvas.setAttribute('class', 'canvas');
      newCanvas.setAttribute('width', '800');
      newCanvas.setAttribute('height', '800');

      secondCanvas.appendChild(newCanvas);

      context = newCanvas.getContext("2d");

      // must reset radius before translating
      radius = radius * 1.1111111111111111;
      context.translate(radius, radius);
      radius = radius * 0.90

      // if we got any matching times/angles
      // then draw another clock
      if (timesToRender.length) {
        panel2.style.display = 'block';
        drawAdditionalClock(context, timesToRender[0]);
      } else {
        panel2.style.display = 'none';
      }
    }

    // draws the clock on the right
    function drawAdditionalClock(ctx, time) {
      drawFace(ctx, radius);
      drawDegreeNumbers(ctx, radius, false);
      drawDegreeNumbers(ctx, radius, true);
      drawDegreeMarkers(ctx, radius);
      drawTimeNumbers(ctx, radius);
      drawAdditionalTime(ctx, radius, time);
      drawAngles(ctx, radius, time, true);
    }

    // draws the time on the clock on the right
    function drawAdditionalTime(ctx, radius, time){
      var h = time.hour;
      var m = time.minutes;
      var s = time.seconds;

      //hour
      h = h % 12;
      h = convertToRadians('hours', h, m, s);
      drawHand(ctx, h, radius*0.71, radius*0.03);

      //minute
      m = convertToRadians('minutes', h, m, s);
      drawHand(ctx, m, radius*0.8, radius*0.03);

      // second
      s = convertToRadians('seconds', h, m, s);
      drawHand(ctx, s, radius*0.9, radius*0.01);
    }

    function drawFace(ctx, radius) {
      var grad;
      ctx.beginPath();

      // Parameter          Description
      // x                  The x-coordinate of the center of the circle
      // y                  The y-coordinate of the center of the circle
      // r                  The radius of the circle
      // sAngle             The starting angle, in radians (0 is at the 3 o'clock
      //                    position of the arc's circle, just like on a unit circle)
      // eAngle             The ending angle, in radians
      // counterclockwise   Optional. Specifies whether the drawing should be
      //                    counterclockwise or clockwise. False is default, and
      //                    indicates clockwise, while true indicates counter-clockwise.
      ctx.arc(0, 0, radius, 0, 2*Math.PI);

      // clock face color
      ctx.fillStyle = 'white';

      // fills the clock face
      // with the above color
      ctx.fill();

      // draws the outside ring of the clock
      grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
      grad.addColorStop(0, '#333');
      grad.addColorStop(0.5, 'white');
      grad.addColorStop(1, '#333');
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius*0.1;
      ctx.stroke();
      ctx.beginPath();

      // draws the center dot on the clock
      ctx.arc(0, 0, radius*0.05, 0, 2*Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();
    }

    function drawDegreeNumbers(ctx, radius, reverse) {
      var ang = 0;

      ctx.font = radius*0.04 + "px arial";
      ctx.textBaseline="middle";
      ctx.textAlign="center";

      // so we start at 3 o'clock
      // and move clockwise
      ctx.rotate(Math.PI/2);

      if (reverse) {
        for(var num = 0; num < 36; num++){
          ang = num * Math.PI/18;
          ctx.fillStyle = 'red';
          ctx.rotate(ang);
          ctx.translate(0, -radius*0.58);
          ctx.fillText((num*10).toString(), 0, 0);
          ctx.translate(0, radius*0.58);
          ctx.rotate(-ang);
        }
      } else {
        for(var num = 36; num > 0; num--){
          ang = num * -Math.PI/18;
          ctx.fillStyle = 'blue';
          ctx.rotate(ang);
          ctx.translate(0, -radius*0.68);
          ctx.fillText((num*10).toString(), 0, 0);
          ctx.translate(0, radius*0.68);
          ctx.rotate(-ang);
        }
      }

      ctx.rotate(-Math.PI/2);
    }

    function drawDegreeMarkers(ctx, radius) {
      var ang = 0;

      // so we start at 3 o'clock
      ctx.rotate(Math.PI/2);

      for(var num = 0; num < 360; num++) {
        ang = num * Math.PI/180;
        ctx.lineWidth = 1;
        ctx.fillStyle = 'black';
        ctx.rotate(ang);

        ctx.beginPath();

        if (num === 0 || num % 5 === 0) {
          ctx.moveTo(0, -radius*0.71);
          ctx.lineTo(0, -radius*.76);
          ctx.stroke();
        } else {
          ctx.moveTo(0, -radius*0.73);
          ctx.lineTo(0, -radius*.76);
          ctx.stroke();
        }

        ctx.moveTo(0,0);
        ctx.rotate(-ang);
      }

      ctx.rotate(-Math.PI/2);
    }

    function drawTimeNumbers(ctx, radius) {
      var ang = 0;

      ctx.font = radius*0.13 + "px arial";
      ctx.textBaseline="middle";
      ctx.textAlign="center";
      for(var num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.fillStyle = 'black';
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);       // we are rotating the canvas
        ctx.rotate(-ang);                     // here to make the clock
        ctx.fillText(num.toString(), 0, 0);   // numbers straight up and down
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
      }
    }

    // draws the time on the clock on the left
    function drawTime(ctx, radius){
      var now = new Date();
      var h = hour.value || now.getHours();
      var m = minute.value || now.getMinutes();
      var s = second.value || now.getSeconds();

      //hour
      h = h % 12;
      h = convertToRadians('hours', h, m, s);
      drawHand(ctx, h, radius*0.71, radius*0.03);

      //minute
      m = convertToRadians('minutes', h, m, s);
      drawHand(ctx, m, radius*0.8, radius*0.03);

      // second
      s = convertToRadians('seconds', h, m, s);
      drawHand(ctx, s, radius*0.9, radius*0.01);
    }

    function convertToRadians(unit, h, m, s) {
      var radians = 0;

      // so the additional clock shows
      // angle lines on page load
      if (h == 0) {
        h = 12;
      }

      switch(unit) {
        case 'hours':
          radians = (h*Math.PI/6) +          // 30 degrees for one hour
                    (m*Math.PI/(6*60)) +     // 1/60th of 30 degrees for each minute
                    (s*Math.PI/(6*60*60));   // 1/60th of 1/60th of 30 degrees for each second
          break;
        case 'minutes':
          radians = (m*Math.PI/30) +
                    (s*Math.PI/(30*60));     // 6 degrees per minute plus 1/60th of that for each second
          break;
        case 'seconds':
          radians = (s*Math.PI/30);          // because the second hand points at each minute
          break;
      }

      return radians;
    }

    // draw each clock hand
    function drawHand(ctx, pos, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.moveTo(0,0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length); // negative length because the context has been rotated
      ctx.stroke();
      ctx.rotate(-pos);
    }

    // draw the angle between the hour and minute hand
    function drawAngles(ctx, radius, time, additional) {
      var h = (additional) ? time.hour : hour.value;
      var m = (additional) ? time.minutes : minute.value;
      var s = (additional) ? time.seconds : second.value;

      var startPosition = convertToRadians('minutes', h, m, s);
      var endPosition = convertToRadians('hours', h, m, s);

      // so we start at 12 o'clock
      ctx.rotate(-Math.PI/2);

      // inner angle
      ctx.beginPath();
      ctx.arc(0, 0, radius*0.55, startPosition, endPosition);
      ctx.strokeStyle = 'red';
      ctx.stroke();

      // outer angle
      ctx.beginPath();
      ctx.arc(0, 0, radius*0.65, endPosition, startPosition);
      ctx.strokeStyle = 'blue';
      ctx.stroke();

      ctx.rotate(Math.PI/2);

      // outer angle in radians is (2*Math.PI - endPosition + startPosition)
      outerAngleDegrees = (2*Math.PI - endPosition + startPosition) * 180/Math.PI;

      // for when the minute hand wraps past the hour hand
      if (outerAngleDegrees > 360) {
        outerAngleDegrees = outerAngleDegrees - 360;
      }

      // inner angle in radians is (endPosition - startPosition)
      innerAngleDegrees = -((endPosition - startPosition) * 180/Math.PI);

      // for when the minute hand wraps past the hour hand
      if (innerAngleDegrees > 0) {
        innerAngleDegrees = -(360 - innerAngleDegrees);
      }

      if (additional) {
        // assign to right hand clock
        c2_posAngle.innerHTML = (outerAngleDegrees.toFixed(4)).toString();
        c2_negAngle.innerHTML = (innerAngleDegrees.toFixed(4)).toString();
      } else {
        // assign to left hand clock
        c1_posAngle.innerHTML = (outerAngleDegrees.toFixed(4)).toString();
        c1_negAngle.innerHTML = (innerAngleDegrees.toFixed(4)).toString();
      }

    }

    return {
      draw: draw,
      getContext: function() {
        return ctx;
      }
    }
  })();

  window.clock = clock;

})();
