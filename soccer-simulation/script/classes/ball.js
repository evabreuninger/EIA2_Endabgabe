"use strict";
var end;
(function (end) {
    // Objekterstellung
    class Ball {
        position;
        size;
        speed;
        friction;
        constructor() {
            this.position = [end.canvas.width / 2, end.canvas.height / 2];
            this.size = 15;
            this.speed = [0, 0];
            this.friction = 0.96;
        }
        // Ball zeichnen
        draw() {
            end.ctx.globalAlpha = 1;
            end.ctx.beginPath();
            end.ctx.arc(this.position[0], this.position[1], this.size, 0, Math.PI * 2);
            end.ctx.fillStyle = "white";
            end.ctx.fill();
            end.ctx.strokeStyle = "black";
            end.ctx.lineWidth = this.size / 5;
            end.ctx.stroke();
        }
        // Bewegung des Balls
        update(_touching) {
            // Bewegungsfunktion
            if (!_touching && !end.stopped) {
                this.position = [this.position[0] + this.speed[0], this.position[1] + this.speed[1]];
                this.speed = [this.speed[0] * this.friction, this.speed[1] * this.friction];
            }
            // Tor für Team One 
            if (this.position[0] < 100 && this.position[1] > 604 && this.position[1] < 755) {
                let scorediv = document.getElementById("ScoreTeamOne");
                end.score[0]++;
                scorediv.innerHTML = end.score[0] + "";
                end.clickedPlayer = new end.Player("n", 0, 0, 0, [0, 0], 0);
                this.position = [end.canvas.width / 2, end.canvas.height / 2];
                this.speed = [0, 0];
            }
            // Tor für Team Two
            if (this.position[0] > 2000 && this.position[1] > 604 && this.position[1] < 755) {
                let scorediv = document.getElementById("ScoreTeamTwo");
                end.score[1]++;
                scorediv.innerHTML = end.score[1] + "";
                end.clickedPlayer = new end.Player("n", 0, 0, 0, [0, 0], 0);
                this.position = [end.canvas.width / 2, end.canvas.height / 2];
                this.speed = [0, 0];
            }
            // Abprallen am Spielfeldrand
            if (this.position[0] < 100) {
                this.speed = [-this.speed[0], this.speed[1]];
                this.position[0] = 101;
            }
            else if (this.position[0] > 2000) {
                this.speed = [-this.speed[0], this.speed[1]];
                this.position[0] = 1999;
            }
            else if (this.position[1] < 90) {
                this.speed = [this.speed[0], -this.speed[1]];
                this.position[1] = 91;
            }
            else if (this.position[1] > 1290) {
                this.speed = [this.speed[0], -this.speed[1]];
                this.position[1] = 1289;
            }
            this.draw();
        }
        // Kick-Funktion
        kick(_ev, touchingPlayer) {
            // Errechnung der Mausposition
            let bounding = end.canvas.getBoundingClientRect();
            let x = (_ev.pageX - bounding.left) * (2100 / bounding.width);
            let y = (_ev.pageY - bounding.top - window.scrollY) * (2100 / bounding.width);
            let _click = [x, y];
            // Distanz Ball - Maus
            let distanceToClick = this.distance(this.position, _click);
            // Runden der Genauigkeit
            let acuracy = +touchingPlayer.acuracy.toPrecision(2);
            // Berechnted den Ungenauigkeitsradius
            let acuraryRadius = distanceToClick / 5;
            let adjustedX = (acuraryRadius * Math.random() * (1 - acuracy));
            let adjustedY = (acuraryRadius * Math.random() * (1 - acuracy));
            let adjustedMousePos = [_click[0] - adjustedX, _click[1] - adjustedY];
            // Berechnet Startbewegung
            this.speed = [(adjustedMousePos[0] - this.position[0]) * 0.05, (adjustedMousePos[1] - this.position[1]) * 0.05];
            this.position = [this.position[0] + this.speed[0] * this.friction, this.position[1] + this.speed[1] * this.friction];
        }
        // Berechnet Abstand zwischen zwei Positionen
        distance(_pos1, _pos2) {
            return Math.sqrt(Math.pow(_pos2[0] - _pos1[0], 2) + Math.pow(_pos2[1] - _pos1[1], 2));
        }
    }
    end.Ball = Ball;
})(end || (end = {}));
//# sourceMappingURL=ball.js.map