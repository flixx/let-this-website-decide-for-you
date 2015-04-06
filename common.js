/*  
 __    ____  ____
(  )  ( ___)(_  _)                                      
 )(__  )__)   )(                                        
(____)(____) (__)                                       
 ____  _   _  ____  ___                                 
(_  _)( )_( )(_  _)/ __)                                
  )(   ) _ (  _)(_ \__ \                                
 (__) (_) (_)(____)(___/                                
 _    _  ____  ____  ___  ____  ____  ____              
( \/\/ )( ___)(  _ \/ __)(_  _)(_  _)( ___)             
 )    (  )__)  ) _ <\__ \ _)(_   )(   )__)              
(__/\__)(____)(____/(___/(____) (__) (____)             
 ____  ____  ___  ____  ____  ____                      
(  _ \( ___)/ __)(_  _)(  _ \( ___)                     
 )(_) ))__)( (__  _)(_  )(_) ))__)                      
(____/(____)\___)(____)(____/(____)                     
 ____  _____  ____                                      
( ___)(  _  )(  _ \                                     
 )__)  )(_)(  )   /                                     
(__)  (_____)(_)\_)                                     
 _  _  _____  __  __                                    
( \/ )(  _  )(  )(  )                                   
 \  /  )(_)(  )(__)(                                    
 (__) (_____)(______)                                   
                                                        
                                                        
                                                        
                                                        
  ___  _____  __  __  __  __  _____  _  _     ____  ___ 
 / __)(  _  )(  \/  )(  \/  )(  _  )( \( )   (_  _)/ __)
( (__  )(_)(  )    (  )    (  )(_)(  )  (   .-_)(  \__ \
 \___)(_____)(_/\/\_)(_/\/\_)(_____)(_)\_)()\____) (___/ 

                              
*/

var s;
var optionSize;

var opt1 = {
    'x': 328 + 400,
    'y': 114 + 850
};
var opt2 = {
    'x': 871 + 400,
    'y': 114 + 850
};
var optWin;
var optLose;

var svgGroup;
var canvasWidth = 2000;
var canvasHeight = 2000;
var shakeStop = false;

// -1: left, 1: right
var winner = 0;

// A 2 Dim Array:
// [[scale_factor1, timing1],
//  [scale_factor2, timing2],
//   ...                    ]
var SQUEEZE_SCALES = [
    [0.8, 400],
    [1, 600],
    [0.8, 400],
    [1, 600],
    [0.7, 400],
    [0.5, 1500]
];
var SHAKING = 0.08;
var SHAKE_DURATION = 3890;

$(function() {

    $("#main-form").submit(function(event) {
        event.preventDefault();
        init();
        $('#option1').fadeOut();
        $('#option2').fadeOut();
        $('#or').fadeOut();
        $('#submit').fadeOut();
        decide();

        var animation_query = getQueryVariable('a');
        if (typeof animation_query == 'undefined') {
            animation_query = 'animation_sqeeze';
        }
        var animation = window[animation_query];

        // After 1s: Run animation with callback function as
        // parameter. 
        setTimeout(function() {
            animation.run(function() {
                setTimeout(finished, 1000);
            })
        }, 1000);
    });

    // Uncomment to start on init
    // $('#option1').val('Snooze');
    // $('#option2').val('Breakfast');
    // $("#main-form").submit();


    $('#btn-reset').click(function(event) {
        event.preventDefault()
        reset();
    })

    function init() {
        s = Snap("#svgout");
        optionSize = $('.option').css('font-size');
        s.clear();
        $("#svgout").show();
        opt1.svg = s.text(opt1.x, opt1.y, $('#option1').val()).attr({
            fontSize: optionSize,
            opacity: 0,
            "text-anchor": "middle"
        });
        opt2.svg = s.text(opt2.x, opt2.y, $('#option2').val()).attr({
            fontSize: optionSize,
            opacity: 0,
            "text-anchor": "middle"
        });
        opt1.svg.animate({
            opacity: 1
        }, 200, mina.linear, function() {});
        opt2.svg.animate({
            opacity: 1
        }, 200, mina.linear, function() {});

        svgGroup = s.group(opt1.svg, opt2.svg);

        opt1.w = parseInt(opt1.svg.getBBox().width);
        opt2.w = parseInt(opt2.svg.getBBox().width);
    }

    // Core.
    function decide() {
        /* Let's do some magic */
        winner = 2 * (((((42 + $(document).width()) * $(window).height() %
                navigator.userAgent.length) + Date.now()) %
            (Math.round(((Math.LOG2E + Math.sin(Math.LN10 - Math.LN2)) %
                (Math.floor(Math.E))) * (Math.PI + Math.SQRT2) % (Math.ceil(Math.SQRT1_2 +
                Math.LOG10E) + Math.max(Math.LN2, Math.LN10))))) - 0.5);

        optWin = (winner == -1) ? opt1 : opt2;
        optLose = (winner == -1) ? opt2 : opt1;
    }

    // Show the reset button
    function finished() {
        $('#btn-reset').fadeIn();
    }

    function reset() {
        $('.option').val('');
        $(this).val('');
        flyIn($('#submit'));
        flyIn($('.option'));
        flyIn($('#or'));
        flyOut($('#btn-reset'));
        flyOut($('#svgout'));
    }

    function flyIn(element) {
        element.show();
        element.velocity({
            translateX: -1500
        }, 0);
        element.velocity({
            translateX: 0
        }, 500);
    }

    function flyOut(element) {
        element.velocity({
            translateX: 1500
        }, 500, function() {
            element.hide();
            element.velocity({
                translateX: 0
            }, 0);
        });
    }

    // Gets a URL variable
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }

}); // jQuery
