$(function() {
var s = Snap("#svgout");
var optionSize = $('.option').css('font-size');

var opt1 = {'x': 316, 'y': 114};
var opt2 = {'x': 882, 'y': 114};
var optWin;
var optLose;

var svgGroup;
var canvasWidth = 1200;
var shakeStop = false;

// -1: left, 1: right
var winner = 0;

// A 2 Dim Array:
// [[scale_factor1, timing1],
//  [scale_factor2, timing2],
//   ...                    ]
var SQUEEZE_SCALES = [[0.8, 400],
                      [1  , 600],
                      [0.8, 400],
                      [1  , 600],
                      [0.7, 400],
                      [0.5, 1500]];
var SHAKING = 0.08;
var SHAKE_DURATION = 3890;

$("#main-form").submit(function( event ) {
    event.preventDefault();
    init();
    $('#option1').fadeOut();
    $('#option2').fadeOut();
    $('#or').fadeOut();
    $('#submit').fadeOut();
    decide();

    // We need to have a sleep here so the text can finish rendering and calculating it's actual size.
    setTimeout(moveToCenter, 1000);
});

function init() {
    opt1.svg = s.text(opt1.x, opt1.y, $('#option1').val()).attr({ fontSize: optionSize, opacity: 1, "text-anchor": "middle" });
    opt2.svg = s.text(opt2.x, opt2.y, $('#option2').val()).attr({ fontSize: optionSize, opacity: 1, "text-anchor": "middle" });
    svgGroup = s.group(opt1.svg, opt2.svg);

    opt1.w = parseInt(opt1.svg.getBBox().width);
    opt2.w = parseInt(opt2.svg.getBBox().width);
}

// Words fly to the center.
function moveToCenter() {
    // Getting the Bounding Boxes so we can calculate a relative transition
    opt1BBRight = opt1.x + (opt1.w / 2.);
    opt2BBLeft = opt2.svg.getBBox().x;

    opt1RelativeTranslateX = (canvasWidth / 2) - opt1BBRight + 2;
    opt2RelativeTranslateX = (canvasWidth / 2) - opt2BBLeft - 2;

    opt1NewX = opt1.x + opt1RelativeTranslateX;
    opt2NewX = opt2.x + opt2RelativeTranslateX;


    opt1.svg.animate({ x: opt1NewX },600, mina.easeout, function() { } );
    opt2.svg.animate({ x: opt2NewX },600, mina.easeout, function() {
        // When Finished
        // Setting the anchor point to the middle
        opt1.svg.attr({
            "text-anchor": "end",
            x: (canvasWidth / 2) + 2
        });

        opt2.svg.attr({
            "text-anchor": "start",
            x: (canvasWidth / 2) - 2
        });
        squeeze(0);
        shake(0);
    });
}

// Squeezes the Words and releases them.
// Gets called recursively for each entry in SQUEEZE_SCALES.
function squeeze(n) {
    if (n >= SQUEEZE_SCALES.length) {
        rise1();
        return;
    }

    var scaleX = SQUEEZE_SCALES[n][0];
    var timing = SQUEEZE_SCALES[n][1];
    var scaleY = getScaleY(scaleX);

    opt1TranslateX =  (0.5 - (scaleX * 0.5)) * opt1.w;
    opt2TranslateX = -(0.5 - (scaleX * 0.5)) * opt2.w;

    opt1.svg.animate({ transform: "S" + scaleX + "," + scaleY + " T" + opt1TranslateX + ",0" },
        timing, mina.easein, function() { });
    opt2.svg.animate({ transform: "S" + scaleX + "," + scaleY + " T" + opt2TranslateX + ",0" },
        timing, mina.easein, function() { 
        // When Finished
        squeeze(n + 1);
    });
}

// Shakes both words around.
function shake(n) {
    if (shakeStop) {
        return;
    }
    // Some fancy calculations to increase shaking effect over time
    var randX = SHAKING * Math.random() * n;
    var randY = SHAKING * Math.random() * n;
    var timing = (1000 * SHAKE_DURATION) / ((n+1) * 5197.);
    if (timing < 20) {
        timing = 20;
    }

    svgGroup.animate({ transform: "T" + randX + "," + randY }, timing, mina.elastic, function() {
        // When Finished
        shake(n+1);
    });
}

// Moves the winner up a little bit
function rise1() {
    // setting center for upcomming rotations
    optWin.rotX = (canvasWidth / 2) + (winner * (opt2.w / 2));
    optWin.rotY = optWin.y - 20;
    degree = winner * 10;

    optWin.riseOffset = - winner * 0.25 * optWin.w;
    optWin.svg.animate({ transform: "R" + degree + "," + opt2.rotX + "," + opt2.rotY  +
                                    "T" + optWin.riseOffset + ",-20" +
                                    "S0.5,1.2"},
        2000, mina.easeout, function() {
        // When Finished
        rise2();
    });
}

// Moves the winner up rapidly
function rise2() {
    shakeStop = true;
    optWin.riseOffset = - winner * optWin.w / 2.;
    degree = winner * 12;
    optWin.svg.animate({ transform: "T " + optWin.riseOffset + ",-30" +
                                    "S0.7,1.1" +
                                    "R" + degree + "," + opt2.rotX + "," + opt2.rotY },
        300, mina.elastic, function() {
        // When Finished    
        setTimeout(function() {
            hitDown(0);
        }, 0);
    });
}

// Hits down.
// hitDown will call hitUp and hitUp will call hitDown again.
// Double recursion. Fancy stuff.
function hitDown(n) {
    var winnerTransY = -20 + (10 * n);
    var winnerScaleX = 0.8 + (n * 0.1);
    var winnerScaleY = getScaleY(winnerScaleX);

    var loserScaleY = 0.8 - (0.4 * n);
    var loserTranslateX =  winner * (0.25) * optLose.w;
    var loserTranslateY =  8 + (n * 8);

    optWin.svg.animate({ transform:  "T " + optWin.riseOffset  + "," + winnerTransY +
                                     "S" + winnerScaleX + "," + winnerScaleY +
                                     "R0," + optWin.rotX + "," + optWin.rotY },
                                     50, mina.elastic, function() { });
    optLose.svg.animate({ transform: "T" + loserTranslateX  + "," + loserTranslateY +
                                     "R0,0,0" + 
                                     "S0.5," + loserScaleY + ""},
                                     50, mina.bounce, function() {
       // When Finished
       hitUp(n);
    });
}

// Winner goes up again
function hitUp(n) {
    if (n > 1) {
        setTimeout(function() {
            proudWinner();
        }, 300);
        return;
    }

    var transY = -30;
    var scaleX = 0.8 + (n * 0.1);
    var scaleY = getScaleY(scaleX);
    var degree = winner * 12;

    optWin.svg.animate({ transform: "T " + optWin.riseOffset + "," + transY +
                                    "S" + scaleX + "," + scaleY +
                                    "R" + degree + "," + optWin.rotX + "," + optWin.rotY },
                                    200, mina.easeout, function() {
       // When Finished
       hitDown(n + 1);
    });
}

// Zooms in the winner.
function proudWinner() {
    optWin.svg.animate({ transform: "T " + optWin.riseOffset + ",0,R0,0,0S2,2" }, 300, mina.elastic, function() { });
}

// Core.
function decide() {
    /* Let's do some magic */
    winner = 2 * (((((42 + $(document).width()) * $(window).height() %
        navigator.userAgent.length) + Date.now()) % 
        (Math.round(((Math.LOG2E + Math.sin(Math.LN10 - Math.LN2)) %
        (Math.floor(Math.E))) * (Math.PI + Math.SQRT2) % (Math.ceil(Math.SQRT1_2 +
        Math.LOG10E) + Math.max(Math.LN2, Math.LN10))))) - 0.5);

    optWin  = (winner == -1) ? opt1 : opt2;
    optLose = (winner == -1) ? opt2 : opt1;
}

// Helper
function getScaleY(scaleX) {
    return 1.4 - (0.4 * scaleX);
}

}); // jQuery
