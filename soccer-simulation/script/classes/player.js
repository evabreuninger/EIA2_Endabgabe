"use strict";
var end;
(function (end) {
    // Objekterstellung
    class Player {
        position;
        name;
        size;
        speed;
        shirtNumber;
        team;
        shirtColor;
        perceptionRadius;
        acuracy;
        type;
        home;
        constructor(_name, _speed, _team, _shirtNumber, _position, _type) {
            this.name = _name;
            this.position = _position;
            this.home = this.position;
            this.size = 25;
            this.speed = _speed;
            this.acuracy = Math.random();
            this.shirtNumber = _shirtNumber;
            this.team = _team;
            if (_type == 4) {
                this.perceptionRadius = 0;
            }
            else {
                this.perceptionRadius = 300;
            }
            this.type = _type;
        }
        // Trikot-Farbe anpassen
        trikotAdjustment(_color1, _color2) {
            if (this.team == 0) {
                this.shirtColor = _color1;
            }
            else if (this.team == 1) {
                this.shirtColor = _color2;
            }
            else {
                this.shirtColor = "#ffffff";
            }
        }
        // Bewegung der Spieler
        update(_ball, _touching) {
            // Logik für Spieler
            if (this.type == 0) {
                if (!_touching && !end.stopped) {
                    let vector;
                    if (this.distance(this.position, _ball.position) <= this.perceptionRadius && this != end.clickedPlayer) {
                        vector = [this.speed * (_ball.position[0] - this.position[0]) / (this.distance(this.position, _ball.position) + 1), this.speed * (_ball.position[1] - this.position[1]) / (this.distance(this.position, _ball.position) + 1)];
                    }
                    else {
                        vector = [this.speed * (this.home[0] - this.position[0]) / (this.distance(this.position, this.home) + 1), this.speed * (this.home[1] - this.position[1]) / (this.distance(this.position, this.home) + 1)];
                        if (this.distance(this.position, this.home) <= 0.5 * this.speed) {
                            this.position = this.home;
                            vector = [0, 0];
                        }
                    }
                    this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                }
                this.draw();
                // Logik für Schiedsrichter
            }
            else if (this.type == 1) {
                if (!_touching && !end.stopped) {
                    let vector;
                    if (this.distance(this.position, _ball.position) >= this.perceptionRadius * 1.5) {
                        vector = [this.speed * (_ball.position[0] - this.position[0]) / (this.distance(this.position, _ball.position) + 1), this.speed * (_ball.position[1] - this.position[1]) / (this.distance(this.position, _ball.position) + 1)];
                        this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                    }
                }
                this.draw();
                // Logik für Linienrichter
            }
            else if (this.type == 2) {
                if (!_touching && !end.stopped && _ball.position[0] < 1100) {
                    this.position = [_ball.position[0], 80];
                }
                this.draw();
                // Logik für Linienrichter
            }
            else if (this.type == 3) {
                if (!_touching && !end.stopped && _ball.position[0] > 1000) {
                    this.position = [_ball.position[0], 1290];
                }
                this.draw();
                // Logik für Auswechselspieler
            }
            else if (this.type == 4) {
                this.perceptionRadius = 0;
                if (!end.stopped) {
                    let vector;
                    vector = [this.speed * (this.home[0] - this.position[0]) / (this.distance(this.position, this.home) + 1), this.speed * (this.home[1] - this.position[1]) / (this.distance(this.position, this.home) + 1)];
                    if (this.distance(this.position, this.home) <= 0.5 * this.speed) {
                        this.position = this.home;
                        vector = [0, 0];
                    }
                    this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                }
                this.draw();
                // Logik für gewechselten Spieler
            }
            else if (this.type == 5) {
                this.perceptionRadius = 0;
                if (!end.stopped) {
                    let vector;
                    vector = [this.speed * (this.home[0] - this.position[0]) / (this.distance(this.position, this.home) + 1), this.speed * (this.home[1] - this.position[1]) / (this.distance(this.position, this.home) + 1)];
                    if (this.distance(this.position, this.home) <= 0.5 * this.speed) {
                        this.position = this.home;
                        vector = [0, 0];
                        this.type = 0;
                        this.perceptionRadius = 300;
                    }
                    this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                }
                this.draw();
            }
        }
        // testet ob Spieler und Ball sich berühren 
        isTouching(_ball) {
            if (end.clickedPlayer != this && this.type == 0) {
                return this.distance(this.position, _ball.position) <= this.size + _ball.size;
            }
            else {
                return false;
            }
        }
        // Zeichnet Spieler
        draw() {
            end.ctx.globalAlpha = 1;
            end.ctx.beginPath();
            end.ctx.arc(this.position[0], this.position[1], this.size, 0, Math.PI * 2);
            end.ctx.fillStyle = this.shirtColor;
            end.ctx.fill();
            // Testet ob Spieler ausgewählt ist
            if (this.shirtNumber == end.selectedPlayer && this.team == end.selectedTeam && !end.toggled) {
                end.ctx.strokeStyle = "yellow";
            }
            else if (this.shirtNumber == end.replacementPlayer + 11 && this.team == end.selectedTeam && end.replacementPlayer > 0 && !end.toggled) {
                end.ctx.strokeStyle = "lime";
            }
            else {
                end.ctx.strokeStyle = "black";
            }
            end.ctx.lineWidth = this.size / 5;
            end.ctx.stroke();
            if (this.team == 0 || this.team == 1) {
                end.ctx.globalAlpha = 0.1;
                end.ctx.beginPath();
                end.ctx.arc(this.position[0], this.position[1], this.perceptionRadius, 0, Math.PI * 2);
                end.ctx.fillStyle = this.shirtColor;
                end.ctx.fill();
            }
        }
        // Abstand zwischen zwei Positionen
        distance(_pos1, _pos2) {
            return Math.sqrt(Math.pow(_pos2[0] - _pos1[0], 2) + Math.pow(_pos2[1] - _pos1[1], 2));
        }
    }
    end.Player = Player;
})(end || (end = {}));
//# sourceMappingURL=player.js.map