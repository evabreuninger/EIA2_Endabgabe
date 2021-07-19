namespace end {

    // Objekterstellung
    export class Ball {
        position: number[];
        size: number;
        speed: number[];
        friction: number;

        constructor() {
            this.position = [canvas.width / 2, canvas.height / 2];
            this.size = 15;
            this.speed = [0, 0];
            this.friction = 0.96;
        }

        // Ball zeichnen
        draw(): void {
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = this.size / 5;
            ctx.stroke();
        }

        // Bewegung des Balls
        update(_touching: boolean): void {

            // Bewegungsfunktion
            if (!_touching && !stopped) {
                this.position = [this.position[0] + this.speed[0], this.position[1] + this.speed[1]];
                this.speed = [this.speed[0] * this.friction, this.speed[1] * this.friction];
            }

            // Tor für Team One 
            if (this.position[0] < 100 && this.position[1] > 604 && this.position[1] < 755) {
                let scorediv: HTMLElement = <HTMLElement>document.getElementById("ScoreTeamOne");
                score[0]++;
                scorediv.innerHTML = score[0] + "";
                clickedPlayer = new Player("n", 0, 0, 0, [0, 0], 0);
                this.position = [canvas.width / 2, canvas.height / 2];
                this.speed = [0, 0];
            }

            // Tor für Team Two
            if (this.position[0] > 2000 && this.position[1] > 604 && this.position[1] < 755) {
                let scorediv: HTMLElement = <HTMLElement>document.getElementById("ScoreTeamTwo");
                score[1]++;
                scorediv.innerHTML = score[1] + "";
                clickedPlayer = new Player("n", 0, 0, 0, [0, 0], 0);
                this.position = [canvas.width / 2, canvas.height / 2];
                this.speed = [0, 0];
            }

            // Abprallen am Spielfeldrand
            if (this.position[0] < 100) {
                this.speed = [-this.speed[0], this.speed[1]];
                this.position[0] = 101;
            } else if (this.position[0] > 2000) {
                this.speed = [-this.speed[0], this.speed[1]];
                this.position[0] = 1999;
            } else if (this.position[1] < 90) {
                this.speed = [this.speed[0], -this.speed[1]];
                this.position[1] = 91;
            } else if (this.position[1] > 1290) {
                this.speed = [this.speed[0], -this.speed[1]];
                this.position[1] = 1289;
            }

            this.draw();
        }

        // Kick-Funktion
        kick(_ev: MouseEvent, touchingPlayer: Player): void {

            // Errechnung der Mausposition
            let bounding: DOMRect = canvas.getBoundingClientRect();
            let x: number = (_ev.pageX - bounding.left) * (2100 / bounding.width);
            let y: number = (_ev.pageY - bounding.top - window.scrollY) * (2100 / bounding.width);
            let _click: number[] = [x, y];

            // Distanz Ball - Maus
            let distanceToClick: number = this.distance(this.position, _click);

            // Runden der Genauigkeit
            let acuracy: number = +touchingPlayer.acuracy.toPrecision(2);

            // Berechnted den Ungenauigkeitsradius
            let acuraryRadius: number = distanceToClick / 5;
            let adjustedX: number = (acuraryRadius * Math.random() * (1 - acuracy));
            let adjustedY: number = (acuraryRadius * Math.random() * (1 - acuracy));
            let adjustedMousePos: number[] = [_click[0] - adjustedX, _click[1] - adjustedY];

            // Berechnet Startbewegung
            this.speed = [(adjustedMousePos[0] - this.position[0]) * 0.05, (adjustedMousePos[1] - this.position[1]) * 0.05];
            this.position = [this.position[0] + this.speed[0] * this.friction, this.position[1] + this.speed[1] * this.friction];
        }

        // Berechnet Abstand zwischen zwei Positionen
        distance(_pos1: number[], _pos2: number[]): number {
            return Math.sqrt(Math.pow(_pos2[0] - _pos1[0], 2) + Math.pow(_pos2[1] - _pos1[1], 2));
        }
    }

}