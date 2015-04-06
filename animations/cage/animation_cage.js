var cage;
CAGE_SCALE= 0.3;
CAGE_MOVE = 30;

animation_cage = {
    run: function(whenFinished) {
        Snap.load('animations/cage/cage.svg', function(nicolas) {
            cage = s.group();
            cage.append(nicolas);
            // cage = Snap.select('#svgout svg:last-child');
            //$('#svgout svg:last-child').css('transform-origin', 'center center');
            cage.transform('T0,0 S' + CAGE_SCALE + "," + CAGE_SCALE);
            nicolas_down();
        });
        
        function nicolas_down() {
             // SVG- "FlyIn" Path
            var pFlyIn = s.path("m 1992.0208,7.9791816 c 0,0 -274.8635,854.4141684 -992.0208,877.7351184");
            pFlyIn.attr({
                id: "squiggle",
                fill: "none",
             });
            var len = pFlyIn.getTotalLength();

            Snap.animate(0, len, function( value ) {
                movePoint = pFlyIn.getPointAtLength( value );
                cage.attr({ 
                    transform: 'S' + CAGE_SCALE + "," + CAGE_SCALE + "T" + (movePoint.x -1000) + "," + (movePoint.y - 1000)})
            }, 1000, mina.easeInOut, function() {
                nicolas_move_around();
                move_eye();
            });
        }

        function nicolas_move_around() {
            var tx = Math.random() * CAGE_MOVE * 2 - CAGE_MOVE;
            var ty = Math.random() * CAGE_MOVE * 2 - CAGE_MOVE - 170;
            cage.animate({
                transform: "T" + tx + "," + ty + ",R0,0,0S" + CAGE_SCALE + "," + CAGE_SCALE
            }, 600, mina.easeInOut, function() {
                nicolas_move_around();
            });
        }

        function move_eye() {
            var tx, ty;
            var rand = Math.floor(Math.random() * 7);
            if (rand == 1) {
                tx = 6;
                ty = -6;
            } else if (rand < 4) {
                tx = -2;
                ty = 2;
            } else {
                ty = -2;
                tx = 12;
            }
            console.log('tx: ' + tx + " ty: " + ty);
            Snap.select('#Augen').attr({
                transform: "T" + tx + "," + ty
            });
            setTimeout(move_eye, 1600);
        }

        // Zooms in the winner.
        function proudWinner() {
            optWin.svg.animate({
                transform: "T0,0,R0,0,0S4,4"
            }, 300, mina.bounce, function() {
                whenFinished();
            });
        }

        // Helper
        function getScaleY(scaleX) {
            return 1.4 - (0.4 * scaleX);
        }
    }
}
