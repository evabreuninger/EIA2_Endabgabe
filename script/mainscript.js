"use strict";
var end;
(function (end) {
    /*
       Aufgabe: Endaufgabe
       Name: Eva Breuninger
       Matrikelnummer: 266825
       Quellen: Larissa Gaede
       Datum: 19.07.2021
    */
    // Variablen für mehrere Dateien
    end.canvas = document.getElementById("FieldCanvas");
    end.ctx = end.canvas.getContext("2d");
    end.stopped = false;
    end.score = [0, 0];
    let ball = new end.Ball();
    // Array für alle moveables
    let allPos = [[200, 340], [300, 110], [415, 220], [415, 450], [300, 550], [640, 340], [900, 120], [900, 560], [650, 600], [650, 75], [950, 340], [200, 340], [300, 110], [415, 220], [415, 450], [300, 550], [640, 340], [900, 120], [900, 560], [650, 600], [650, 75], [950, 340], [340, 400], [0, 0], [0, 0]];
    let allNames = ["Morgana", "Nami", "Tristana", "Jhin", "Neeko", "Katarina", "Irelia", "Evelyn", "Kha'zix", "Fiora", "Yann Sommer", "Blitzcrank", "Nautilus", "MissFortune", "Toni Kroos", "Vladimir", "Thomas Müller", "Robin Gosens", "Mats Hummels", "Antonio Rüdiger", "Timo Werner", "Manuel Neuer", "Soraka", "Mordekaiser", "Vayne", "Shen", "Diana", "Twitch", "Alistar", "ThamKench", "Lulu", "Qiana"];
    let people = [];
    let touchingPlayer;
    let touching = false;
    let trikotOne;
    let trikotTwo;
    let oldSelectedPlayer;
    let oldReplacementPlayer;
    let oldSelectedTeamString;
    // Klicken Auf Canvas 
    end.canvas.addEventListener("click", handleClick);
    // Nach dem Laden der kompletten Seite werden Objekte erstellt
    window.addEventListener("load", setup);
    // Test ob Tastatur gedrückt wird
    document.addEventListener("keydown", function (event) {
        // Key  für  Player-Info
        if (event.key == "Control") {
            let stats = document.getElementById("PlayerInfo");
            if (end.toggled && stats != null) {
                stats.style.opacity = "1";
                end.toggled = !end.toggled;
            }
            else if (stats != null) {
                stats.style.opacity = "0";
                end.toggled = !end.toggled;
            }
        }
        // Key für Spiel-Pause
        if (event.key == "p") {
            end.stopped = !end.stopped;
        }
    });
    // Startet Kick
    function handleClick(_ev) {
        if (touching) {
            ball.kick(_ev, touchingPlayer);
            end.clickedPlayer = touchingPlayer;
        }
    }
    // Buttons in Player-Info
    document.getElementById("SaveSelect")?.addEventListener("click", saveSelected);
    document.getElementById("SaveReplace")?.addEventListener("click", saveReplacement);
    document.getElementById("ReplaceBut")?.addEventListener("click", replacePlayer);
    // Speichert ausgewählten Spieler
    function saveSelected() {
        let forms = new FormData(document.forms[1]);
        let datas = [];
        let ks = 0;
        for (var entrys of forms.entries()) {
            datas[ks] = entrys[1].toString();
            ks++;
        }
        if (end.selectedTeam == 0) {
            people[end.selectedPlayer - 1].name = datas[0];
            people[end.selectedPlayer - 1].speed = +datas[1];
            people[end.selectedPlayer - 1].acuracy = +datas[2] / 100;
        }
        else {
            people[end.selectedPlayer + 10].name = datas[0];
            people[end.selectedPlayer + 10].speed = +datas[1];
            people[end.selectedPlayer + 10].acuracy = +datas[2] / 100;
        }
    }
    // Speichert ausgewählten Ersatzspieler
    function saveReplacement() {
        let formr = new FormData(document.forms[2]);
        let datar = [];
        let kr = 0;
        for (var entryr of formr.entries()) {
            datar[kr] = entryr[1].toString();
            kr++;
        }
        if (end.selectedTeam == 0) {
            people[end.replacementPlayer + 21].name = datar[0];
            people[end.replacementPlayer + 21].speed = +datar[1];
            people[end.replacementPlayer + 21].acuracy = +datar[2] / 100;
        }
        else {
            people[end.replacementPlayer + 26].name = datar[0];
            people[end.replacementPlayer + 26].speed = +datar[1];
            people[end.replacementPlayer + 26].acuracy = +datar[2] / 100;
        }
    }
    // Auswecheln von Spielern
    function replacePlayer() {
        if (end.selectedTeam == 0) {
            [people[end.selectedPlayer - 1], people[end.replacementPlayer + 21]] = [people[end.replacementPlayer + 21], people[end.selectedPlayer - 1]];
            [people[end.selectedPlayer - 1].home, people[end.replacementPlayer + 21].home] = [people[end.replacementPlayer + 21].home, people[end.selectedPlayer - 1].home];
            [people[end.selectedPlayer - 1].perceptionRadius, people[end.replacementPlayer + 21].perceptionRadius] = [people[end.replacementPlayer + 21].perceptionRadius, people[end.selectedPlayer - 1].perceptionRadius];
            [people[end.selectedPlayer - 1].shirtNumber, people[end.replacementPlayer + 21].shirtNumber] = [people[end.replacementPlayer + 21].shirtNumber, people[end.selectedPlayer - 1].shirtNumber];
            people[end.selectedPlayer - 1].type = 5;
            people[end.replacementPlayer + 21].type = 4;
        }
        else {
            [people[end.selectedPlayer + 10], people[end.replacementPlayer + 26]] = [people[end.replacementPlayer + 26], people[end.selectedPlayer + 10]];
            [people[end.selectedPlayer + 10].home, people[end.replacementPlayer + 26].home] = [people[end.replacementPlayer + 26].home, people[end.selectedPlayer + 10].home];
            [people[end.selectedPlayer + 10].perceptionRadius, people[end.replacementPlayer + 26].perceptionRadius] = [people[end.replacementPlayer + 26].perceptionRadius, people[end.selectedPlayer + 10].perceptionRadius];
            [people[end.selectedPlayer + 10].shirtNumber, people[end.replacementPlayer + 26].shirtNumber] = [people[end.replacementPlayer + 26].shirtNumber, people[end.selectedPlayer + 10].shirtNumber];
            people[end.selectedPlayer + 10].type = 5;
            people[end.replacementPlayer + 26].type = 4;
        }
        oldSelectedTeamString = "";
    }
    // Erstellt Objekte
    function setup() {
        let k = 0;
        for (let i = 0; i < 11; i++) {
            let player = new end.Player(allNames[k], 5, 0, i + 1, [allPos[k][0] * 2, allPos[k][1] * 2], 0);
            people.push(player);
            k++;
        }
        for (let i = 0; i < 11; i++) {
            let player = new end.Player(allNames[k], 5, 1, i + 1, [end.canvas.width - allPos[k][0] * 2, allPos[k][1] * 2], 0);
            people.push(player);
            k++;
        }
        for (let i = 0; i < 5; i++) {
            let repplayer = new end.Player(allNames[k], 5, 0, i + 12, [1820 + (i * 40), 1320], 4);
            people.push(repplayer);
            k++;
        }
        for (let i = 0; i < 5; i++) {
            let repplayer = new end.Player(allNames[k], 5, 1, i + 12, [120 + (i * 40), 1320], 4);
            people.push(repplayer);
            k++;
        }
        let ref = new end.Player("Jirka", 15, 2, -1, [end.canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 1);
        k++;
        people.push(ref);
        let judge1 = new end.Player("Anna", 5, 2, -1, [end.canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 2);
        k++;
        people.push(judge1);
        let judge2 = new end.Player("Dennis", 5, 2, -1, [end.canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 3);
        k++;
        people.push(judge2);
        // Started Draw-Funktion
        setInterval(draw, 33);
    }
    // Zeichnet Canvas + Hauptfunktionen
    function draw() {
        end.ctx.clearRect(0, 0, end.canvas.width, end.canvas.height);
        touching = false;
        for (let i = 0; i < people.length; i++) {
            let touch = people[i].isTouching(ball);
            if (touch) {
                touchingPlayer = people[i];
                touching = true;
                break;
            }
        }
        // Lädt alle 3 Forms
        let form = new FormData(document.forms[0]);
        let data = [];
        let k = 0;
        for (var entry of form.entries()) {
            data[k] = entry[1].toString();
            k++;
        }
        let forms = new FormData(document.forms[1]);
        let datas = [];
        let ks = 0;
        for (var entrys of forms.entries()) {
            datas[ks] = entrys[1].toString();
            ks++;
        }
        let formr = new FormData(document.forms[2]);
        let datar = [];
        let kr = 0;
        for (var entryr of formr.entries()) {
            datar[kr] = entryr[1].toString();
            kr++;
        }
        // Weist die Form-Values zu Eigenschaften hinzu
        trikotOne = data[0];
        trikotTwo = data[1];
        let selectedTeamString = data[2];
        if (selectedTeamString != oldSelectedTeamString) {
            oldSelectedPlayer = -1;
            oldReplacementPlayer = -1;
        }
        oldSelectedTeamString = selectedTeamString;
        if (selectedTeamString == "team1") {
            end.selectedPlayer = +data[3];
            end.replacementPlayer = +data[4];
            end.selectedTeam = 0;
            if (end.selectedPlayer != oldSelectedPlayer) {
                //  Lädt Inputs
                document.forms[1]["selectedPlayerName"].value = people[end.selectedPlayer - 1]?.name;
                document.forms[1]["selectedPlayerSpeed"].value = people[end.selectedPlayer - 1]?.speed;
                document.forms[1]["selectedPlayerAcuracy"].value = people[end.selectedPlayer - 1]?.acuracy * 100;
                //  Schreibt Outputs
                document.forms[1]["sps"].innerHTML = people[end.selectedPlayer - 1]?.speed;
                document.forms[1]["spa"].innerHTML = (people[end.selectedPlayer - 1]?.acuracy * 100).toPrecision(2) + "%";
            }
            if (end.replacementPlayer != oldReplacementPlayer) {
                //  Lädt Inputs
                document.forms[2]["replacePlayerName"].value = people[end.replacementPlayer + 21]?.name;
                document.forms[2]["replacePlayerSpeed"].value = people[end.replacementPlayer + 21]?.speed;
                document.forms[2]["replacePlayerAcuracy"].value = people[end.replacementPlayer + 21]?.acuracy * 100;
                //  Schreibt Outputs
                document.forms[2]["rps"].innerHTML = people[end.replacementPlayer + 21]?.speed;
                document.forms[2]["rpa"].innerHTML = (people[end.replacementPlayer + 21]?.acuracy * 100).toPrecision(2) + "%";
            }
            oldReplacementPlayer = end.replacementPlayer;
            oldSelectedPlayer = end.selectedPlayer;
        }
        else {
            end.selectedPlayer = +data[3];
            end.replacementPlayer = +data[4];
            end.selectedTeam = 1;
            if (end.selectedPlayer != oldSelectedPlayer) {
                //  Lädt Inputs
                document.forms[1]["selectedPlayerName"].value = people[end.selectedPlayer + 10]?.name;
                document.forms[1]["selectedPlayerSpeed"].value = people[end.selectedPlayer + 10]?.speed;
                document.forms[1]["selectedPlayerAcuracy"].value = people[end.selectedPlayer + 10]?.acuracy * 100;
                //  Schreibt Outputs
                document.forms[1]["sps"].innerHTML = people[end.selectedPlayer + 10]?.speed;
                document.forms[1]["spa"].innerHTML = (people[end.selectedPlayer + 10]?.acuracy * 100).toPrecision(2) + "%";
            }
            if (end.replacementPlayer != oldReplacementPlayer) {
                //  Lädt Inputs
                document.forms[2]["replacePlayerName"].value = people[end.replacementPlayer + 26]?.name;
                document.forms[2]["replacePlayerSpeed"].value = people[end.replacementPlayer + 26]?.speed;
                document.forms[2]["replacePlayerAcuracy"].value = people[end.replacementPlayer + 26]?.acuracy * 100;
                //  Schreibt Outputs
                document.forms[2]["rps"].innerHTML = people[end.replacementPlayer + 26]?.speed;
                document.forms[2]["rpa"].innerHTML = (people[end.replacementPlayer + 26]?.acuracy * 100).toPrecision(2) + "%";
            }
            oldReplacementPlayer = end.replacementPlayer;
            oldSelectedPlayer = end.selectedPlayer;
        }
        // Scoreboard Werte
        let playerOnBall = document.getElementById("PlayerOnBall");
        if (touchingPlayer) {
            playerOnBall.innerHTML = "Player on Ball: " + touchingPlayer.name + " || Speed: " + touchingPlayer.speed + " || Accuracy: " + (touchingPlayer.acuracy * 100).toPrecision(2) + "%";
        }
        // Update der Spieldynamik
        for (let player of people) {
            player.trikotAdjustment(trikotOne, trikotTwo);
            player.update(ball, touching);
        }
        ball.update(touching);
    }
})(end || (end = {}));
//# sourceMappingURL=mainscript.js.map