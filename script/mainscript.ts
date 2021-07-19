namespace end {

   /* 
      Aufgabe: Endaufgabe
      Name: Eva Breuninger
      Matrikelnummer: 266825
      Quellen: Larissa Gaede
      Datum: 19.07.2021
   */

   // Variablen für mehrere Dateien
   export let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("FieldCanvas");
   export let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
   export let stopped: boolean = false;
   export let clickedPlayer: Player;
   export let selectedTeam: number;
   export let selectedPlayer: number;
   export let score: number[] = [0, 0];
   export let replacementPlayer: number;
   export let toggled: boolean;

   let ball: Ball = new Ball();

   // Array für alle moveables
   let allPos: number[][] = [[200, 340], [300, 110], [415, 220], [415, 450], [300, 550], [640, 340], [900, 120], [900, 560], [650, 600], [650, 75], [950, 340], [200, 340], [300, 110], [415, 220], [415, 450], [300, 550], [640, 340], [900, 120], [900, 560], [650, 600], [650, 75], [950, 340], [340, 400], [0, 0], [0, 0]];
   let allNames: string[] = ["Morgana", "Nami", "Tristana", "Jhin", "Neeko", "Katarina", "Irelia", "Evelyn", "Kha'zix", "Fiora", "Yann Sommer", "Blitzcrank", "Nautilus", "MissFortune", "Toni Kroos", "Vladimir", "Thomas Müller", "Robin Gosens", "Mats Hummels", "Antonio Rüdiger", "Timo Werner", "Manuel Neuer", "Soraka", "Mordekaiser", "Vayne", "Shen", "Diana", "Twitch", "Alistar", "ThamKench", "Lulu", "Qiana"];

   let people: Player[] = [];
   let touchingPlayer: Player;
   let touching: boolean = false;
   let trikotOne: string;
   let trikotTwo: string;
   let oldSelectedPlayer: number;
   let oldReplacementPlayer: number;
   let oldSelectedTeamString: string;

   
   // Klicken Auf Canvas 
   canvas.addEventListener("click", handleClick);
   // Nach dem Laden der kompletten Seite werden Objekte erstellt
   window.addEventListener("load", setup);

   // Test ob Tastatur gedrückt wird
   document.addEventListener("keydown", function (event: KeyboardEvent): void {

      // Key  für  Player-Info
      if (event.key == "Control") {
         let stats: HTMLDivElement = <HTMLDivElement>document.getElementById("PlayerInfo");
         if (toggled && stats != null) {
            stats.style.opacity = "1";
            toggled = !toggled;
         } else if (stats != null) {
            stats.style.opacity = "0";
            toggled = !toggled;
         }
      }

      // Key für Spiel-Pause
      if (event.key == "p") {
         stopped = !stopped;
      }
   });

   // Startet Kick
   function handleClick(_ev: MouseEvent): void {
      if (touching) {
         ball.kick(_ev, touchingPlayer);
         clickedPlayer = touchingPlayer;
      }

   }

   // Buttons in Player-Info
   document.getElementById("SaveSelect")?.addEventListener("click", saveSelected);
   document.getElementById("SaveReplace")?.addEventListener("click", saveReplacement);
   document.getElementById("ReplaceBut")?.addEventListener("click", replacePlayer);

   // Speichert ausgewählten Spieler
   function saveSelected(): void {
      let forms: FormData = new FormData(document.forms[1]);
      let datas: string[] = [];
      let ks: number = 0;
      for (var entrys of forms.entries()) {
         datas[ks] = entrys[1].toString();
         ks++;
      }

      if (selectedTeam == 0) {
         people[selectedPlayer - 1].name = datas[0];
         people[selectedPlayer - 1].speed = +datas[1];
         people[selectedPlayer - 1].acuracy = +datas[2] / 100;
      } else {
         people[selectedPlayer + 10].name = datas[0];
         people[selectedPlayer + 10].speed = +datas[1];
         people[selectedPlayer + 10].acuracy = +datas[2] / 100;
      }
   }

   // Speichert ausgewählten Ersatzspieler
   function saveReplacement(): void {
      let formr: FormData = new FormData(document.forms[2]);
      let datar: string[] = [];
      let kr: number = 0;
      for (var entryr of formr.entries()) {
         datar[kr] = entryr[1].toString();
         kr++;
      }

      if (selectedTeam == 0) {
         people[replacementPlayer + 21].name = datar[0];
         people[replacementPlayer + 21].speed = +datar[1];
         people[replacementPlayer + 21].acuracy = +datar[2] / 100;
      } else {
         people[replacementPlayer + 26].name = datar[0];
         people[replacementPlayer + 26].speed = +datar[1];
         people[replacementPlayer + 26].acuracy = +datar[2] / 100;
      }
   }

   // Auswecheln von Spielern
   function replacePlayer(): void {
      if (selectedTeam == 0) {
         [people[selectedPlayer - 1], people[replacementPlayer + 21]] = [people[replacementPlayer + 21], people[selectedPlayer - 1]];
         [people[selectedPlayer - 1].home, people[replacementPlayer + 21].home] = [people[replacementPlayer + 21].home, people[selectedPlayer - 1].home];
         [people[selectedPlayer - 1].perceptionRadius, people[replacementPlayer + 21].perceptionRadius] = [people[replacementPlayer + 21].perceptionRadius, people[selectedPlayer - 1].perceptionRadius];

         [people[selectedPlayer - 1].shirtNumber, people[replacementPlayer + 21].shirtNumber] = [people[replacementPlayer + 21].shirtNumber, people[selectedPlayer - 1].shirtNumber];
         people[selectedPlayer - 1].type = 5;
         people[replacementPlayer + 21].type = 4;
      } else {
         [people[selectedPlayer + 10], people[replacementPlayer + 26]] = [people[replacementPlayer + 26], people[selectedPlayer + 10]];
         [people[selectedPlayer + 10].home, people[replacementPlayer + 26].home] = [people[replacementPlayer + 26].home, people[selectedPlayer + 10].home];
         [people[selectedPlayer + 10].perceptionRadius, people[replacementPlayer + 26].perceptionRadius] = [people[replacementPlayer + 26].perceptionRadius, people[selectedPlayer + 10].perceptionRadius];

         [people[selectedPlayer + 10].shirtNumber, people[replacementPlayer + 26].shirtNumber] = [people[replacementPlayer + 26].shirtNumber, people[selectedPlayer + 10].shirtNumber];
         people[selectedPlayer + 10].type = 5;
         people[replacementPlayer + 26].type = 4;
      }
      oldSelectedTeamString = "";

   }

   // Erstellt Objekte
   function setup(): void {
      let k: number = 0;

      for (let i: number = 0; i < 11; i++) {
         let player: Player = new Player(allNames[k], 5, 0, i + 1, [allPos[k][0] * 2, allPos[k][1] * 2], 0);
         people.push(player);
         k++;
      }


      for (let i: number = 0; i < 11; i++) {
         let player: Player = new Player(allNames[k], 5, 1, i + 1, [canvas.width - allPos[k][0] * 2, allPos[k][1] * 2], 0);
         people.push(player);
         k++;
      }

      for (let i: number = 0; i < 5; i++) {
         let repplayer: Player = new Player(allNames[k], 5, 0, i + 12, [1820 + (i * 40), 1320], 4);
         people.push(repplayer);
         k++;
      }

      for (let i: number = 0; i < 5; i++) {
         let repplayer: Player = new Player(allNames[k], 5, 1, i + 12, [120 + (i * 40), 1320], 4);
         people.push(repplayer);
         k++;
      }

      let ref: Player = new Player("Jirka", 15, 2, -1, [canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 1);
      k++;
      people.push(ref);

      let judge1: Player = new Player("Anna", 5, 2, -1, [canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 2);
      k++;
      people.push(judge1);

      let judge2: Player = new Player("Dennis", 5, 2, -1, [canvas.width - allPos[k - 10][0] * 2, allPos[k - 10][1] * 2], 3);
      k++;
      people.push(judge2);



      // Started Draw-Funktion
      setInterval(draw, 33);
   }

   // Zeichnet Canvas + Hauptfunktionen
   function draw(): void {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      touching = false;
      for (let i: number = 0; i < people.length; i++) {
         let touch: boolean = people[i].isTouching(ball);
         if (touch) {
            touchingPlayer = people[i];
            touching = true;
            break;
         }
      }

      // Lädt alle 3 Forms
      let form: FormData = new FormData(document.forms[0]);
      let data: string[] = [];
      let k: number = 0;
      for (var entry of form.entries()) {
         data[k] = entry[1].toString();
         k++;
      }

      let forms: FormData = new FormData(document.forms[1]);
      let datas: string[] = [];
      let ks: number = 0;
      for (var entrys of forms.entries()) {
         datas[ks] = entrys[1].toString();
         ks++;
      }

      let formr: FormData = new FormData(document.forms[2]);
      let datar: string[] = [];
      let kr: number = 0;
      for (var entryr of formr.entries()) {
         datar[kr] = entryr[1].toString();
         kr++;
      }

      // Weist die Form-Values zu Eigenschaften hinzu
      trikotOne = data[0];
      trikotTwo = data[1];
      let selectedTeamString: string = data[2];
      if (selectedTeamString != oldSelectedTeamString) {
         oldSelectedPlayer = -1;
         oldReplacementPlayer = -1;
      }
      oldSelectedTeamString = selectedTeamString;
      if (selectedTeamString == "team1") {

         selectedPlayer = +data[3];
         replacementPlayer = +data[4];
         selectedTeam = 0;
         if (selectedPlayer != oldSelectedPlayer) {

            //  Lädt Inputs
            document.forms[1]["selectedPlayerName"].value = people[selectedPlayer - 1]?.name;
            document.forms[1]["selectedPlayerSpeed"].value = people[selectedPlayer - 1]?.speed;
            document.forms[1]["selectedPlayerAcuracy"].value = people[selectedPlayer - 1]?.acuracy * 100;

            //  Schreibt Outputs
            document.forms[1]["sps"].innerHTML = people[selectedPlayer - 1]?.speed;
            document.forms[1]["spa"].innerHTML = (people[selectedPlayer - 1]?.acuracy * 100).toPrecision(2) + "%";
         }
         if (replacementPlayer != oldReplacementPlayer) {

            //  Lädt Inputs
            document.forms[2]["replacePlayerName"].value = people[replacementPlayer + 21]?.name;
            document.forms[2]["replacePlayerSpeed"].value = people[replacementPlayer + 21]?.speed;
            document.forms[2]["replacePlayerAcuracy"].value = people[replacementPlayer + 21]?.acuracy * 100;

            //  Schreibt Outputs
            document.forms[2]["rps"].innerHTML = people[replacementPlayer + 21]?.speed;
            document.forms[2]["rpa"].innerHTML = (people[replacementPlayer + 21]?.acuracy * 100).toPrecision(2) + "%";

         }
         oldReplacementPlayer = replacementPlayer;
         oldSelectedPlayer = selectedPlayer;
      } else {
         selectedPlayer = +data[3];
         replacementPlayer = +data[4];
         selectedTeam = 1;
         if (selectedPlayer != oldSelectedPlayer) {

            //  Lädt Inputs
            document.forms[1]["selectedPlayerName"].value = people[selectedPlayer + 10]?.name;
            document.forms[1]["selectedPlayerSpeed"].value = people[selectedPlayer + 10]?.speed;
            document.forms[1]["selectedPlayerAcuracy"].value = people[selectedPlayer + 10]?.acuracy * 100;

            //  Schreibt Outputs
            document.forms[1]["sps"].innerHTML = people[selectedPlayer + 10]?.speed;
            document.forms[1]["spa"].innerHTML = (people[selectedPlayer + 10]?.acuracy * 100).toPrecision(2) + "%";
         }
         if (replacementPlayer != oldReplacementPlayer) {
            //  Lädt Inputs
            document.forms[2]["replacePlayerName"].value = people[replacementPlayer + 26]?.name;
            document.forms[2]["replacePlayerSpeed"].value = people[replacementPlayer + 26]?.speed;
            document.forms[2]["replacePlayerAcuracy"].value = people[replacementPlayer + 26]?.acuracy * 100;

            //  Schreibt Outputs
            document.forms[2]["rps"].innerHTML = people[replacementPlayer  + 26]?.speed;
            document.forms[2]["rpa"].innerHTML = (people[replacementPlayer  + 26]?.acuracy * 100).toPrecision(2) + "%";
         }
         oldReplacementPlayer = replacementPlayer;
         oldSelectedPlayer = selectedPlayer;
      }

      // Scoreboard Werte
      let playerOnBall: HTMLElement = <HTMLElement>document.getElementById("PlayerOnBall");
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

   


}

