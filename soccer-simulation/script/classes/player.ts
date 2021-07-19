namespace end {

    // Objekterstellung
    export class Player {
        position: number[];
        name: string;
        size: number;
        speed: number;
        shirtNumber: number;
        team: number;
        shirtColor: string;
        perceptionRadius: number;
        acuracy: number;
        type: number;
        home: number[];

        constructor(_name: string, _speed: number, _team: number, _shirtNumber: number, _position: number[], _type: number) {
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
            } else {
                this.perceptionRadius = 300;
            }
            this.type = _type;

        }

        // Trikot-Farbe anpassen
        trikotAdjustment(_color1: string, _color2: string): void {
            if (this.team == 0) {
                this.shirtColor = _color1;

            } else if (this.team == 1) {
                this.shirtColor = _color2;
            } else {
                this.shirtColor = "#ffffff";
            }
        }

        // Bewegung der Spieler
        update(_ball: Ball, _touching: boolean): void {

            // Logik für Spieler
            if (this.type == 0) {
                if (!_touching && !stopped) {
                    let vector: number[];
                    if (this.distance(this.position, _ball.position) <= this.perceptionRadius && this != clickedPlayer) {
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
            } else if (this.type == 1) {
                if (!_touching && !stopped) {
                    let vector: number[];
                    if (this.distance(this.position, _ball.position) >= this.perceptionRadius * 1.5) {
                        vector = [this.speed * (_ball.position[0] - this.position[0]) / (this.distance(this.position, _ball.position) + 1), this.speed * (_ball.position[1] - this.position[1]) / (this.distance(this.position, _ball.position) + 1)];
                        this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                    }
                }
                this.draw();

            // Logik für Linienrichter
            } else if (this.type == 2) {
                if (!_touching && !stopped && _ball.position[0] < 1100) {
                    this.position = [_ball.position[0], 80];
                }
                this.draw();

            // Logik für Linienrichter
            } else if (this.type == 3) {
                if (!_touching && !stopped && _ball.position[0] > 1000) {
                    this.position = [_ball.position[0], 1290];
                }
                this.draw();

            // Logik für Auswechselspieler
            } else if (this.type == 4) {
                this.perceptionRadius = 0;
                if (!stopped) {
                    let vector: number[];
                    vector = [this.speed * (this.home[0] - this.position[0]) / (this.distance(this.position, this.home) + 1), this.speed * (this.home[1] - this.position[1]) / (this.distance(this.position, this.home) + 1)];
                    if (this.distance(this.position, this.home) <= 0.5 * this.speed) {
                        this.position = this.home;
                        vector = [0, 0];
                    }
                    this.position = [this.position[0] + vector[0], this.position[1] + vector[1]];
                }
                this.draw();

            // Logik für gewechselten Spieler
            } else if (this.type == 5) {
                this.perceptionRadius = 0;
                if (!stopped) {
                    let vector: number[];
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
        isTouching(_ball: Ball): boolean {
            if (clickedPlayer != this && this.type == 0) {
                return this.distance(this.position, _ball.position) <= this.size + _ball.size;
            } else {
                return false;
            }
        }

        // Zeichnet Spieler
        draw(): void {
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.shirtColor;
            ctx.fill();

            // Testet ob Spieler ausgewählt ist
            if (this.shirtNumber == selectedPlayer && this.team == selectedTeam && !toggled) {
                ctx.strokeStyle = "yellow";
            } else if (this.shirtNumber == replacementPlayer + 11 && this.team == selectedTeam && replacementPlayer > 0 && !toggled) {
                ctx.strokeStyle = "lime";
            } else {
                ctx.strokeStyle = "black";
            }

            ctx.lineWidth = this.size / 5;
            ctx.stroke();

            if (this.team == 0 || this.team == 1) {
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.arc(this.position[0], this.position[1], this.perceptionRadius, 0, Math.PI * 2);
                ctx.fillStyle = this.shirtColor;
                ctx.fill();
            }

        }

        // Abstand zwischen zwei Positionen
        distance(_pos1: number[], _pos2: number[]): number {
            return Math.sqrt(Math.pow(_pos2[0] - _pos1[0], 2) + Math.pow(_pos2[1] - _pos1[1], 2));
        }
    }
}