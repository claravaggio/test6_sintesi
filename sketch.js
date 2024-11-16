let rectX; // Posizione iniziale del rettangolo bianco
let rectY; // Posizione verticale del rettangolo bianco
let rectWidth = 10; // Larghezza del rettangolo bianco
let rectHeight = 100; // Altezza del rettangolo bianco

let greenRectX; // Posizione iniziale del rettangolo verde
let greenRectY; // Posizione verticale del rettangolo verde
let greenRectWidth = 20; // Larghezza del rettangolo verde
let greenRectHeight = rectHeight;
let greenSpeed = -1.5; // Velocità del rettangolo verde verso sinistra
let greenRectVisible = false; // Flag per mostrare il rettangolo verde

let containerX; // Posizione iniziale del contorno
let containerY; // Posizione verticale del contorno
let containerWidth = rectHeight; // Larghezza del contorno (molto più lungo)
let containerHeight = 500;

let counter = 0; // Contatore che funge da tachimetro
let speedIncrease = 0.5; // Velocità di aumento del contatore
let decreaseFactor = 0.1; // Fattore di riduzione del contatore
let spacePressed = false; // Flag per controllare se spacebar è premuto

// Variabili per le auto
let auto1X = 10;
let auto2X = 200;
let auto2Speed = 1.5; // Velocità della seconda auto

let gameOver = false;
let simulationStarted = false;

let progress = 0; // This variable will track the progress of the bar.
let roundedCorner = 30;

let rectColor = 255; // Colore iniziale bianco

function preload() {
  img1 = loadImage("assets/car1.png");
  img2 = loadImage("assets/car2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Posizioni iniziali calcolate in base al centro dello schermo
  containerX = width / 2 - containerWidth * 2;
  containerY = height / 4;
}

function draw() {
  if (gameOver) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(100);
    text("GAME OVER", width / 2, height / 2 - 100);
    return;
  }
  background(0);
  fill(255, 255, 255);
  rect(0, 0, windowWidth, 80);

  fill(255);
  textSize(50);
  textAlign(LEFT);
  text("6", 20, height - 30);

  image(img1, auto1X, 10, img1.width / 8, img1.height / 8);
  image(img2, auto2X, 10, img2.width / 8, img2.height / 8);

  if (simulationStarted) {
    auto2X += auto2Speed;
    if (auto2X > width - img2.width / 8) {
      auto2X = width - img2.width / 8;
      auto2Speed = 0;
    }
  }

  fill(180);
  rect(containerX, containerY, containerWidth, containerHeight, roundedCorner);

  progress = constrain(progress, 0, width);

  // Aumenta il contatore quando tieni premuto invio
  if (keyIsDown(ENTER)) {
    if (!simulationStarted) {
      simulationStarted = true; // Inizia la simulazione con la prima pressione di ENTER
    }
    counter += speedIncrease;
    counter = constrain(counter, 0, 100);
    progress += 2;

    auto1X += map(counter, 0, 100, 0, 5);

    if (rectX > containerX + containerWidth - rectWidth) {
      rectX = containerX + containerWidth - rectWidth;
    }
  } else {
    counter -= decreaseFactor;
    counter = max(counter, 0);
    if (!spacePressed) {
      progress -= 0.5;
    }
    auto1X += map(counter, 0, 100, 0, 3);
  }

  if (keyIsDown(32)) {
    if (!greenRectVisible) {
      greenRectX = containerX - containerWidth / 2;
      greenRectY = containerY + (containerHeight - progress);
      greenRectVisible = true;
    }
    spacePressed = true;
    counter -= decreaseFactor * 3;
    counter = max(counter, 0);
    progress -= 2;
    auto1X += map(counter, 0, 100, 0, 1);

    if (rectX < containerX) {
      rectX = containerX;
    }
  } else {
    spacePressed = false;
  }

  if (greenRectVisible) {
    greenRectY -= greenSpeed;

    // Cambia colore del rettangolo bianco in base alla posizione del progress rispetto al rettangolo verde
    let greenTopEdge =
      containerY + containerHeight - (greenRectY + greenRectHeight);
    let greenBottomEdge = containerY + containerHeight - greenRectY;

    if (progress >= greenTopEdge && progress <= greenBottomEdge) {
      rectColor = color(130, 255, 134); // Verde se è all'interno del rettangolo verde
    } else if (progress > greenBottomEdge && progress <= greenBottomEdge + 20) {
      rectColor = color(255, 204, 0); // Giallo se è vicino al limite del rettangolo verde
    } else {
      rectColor = color(255, 0, 0); // Rosso se è fuori dal limite del rettangolo verde
    }
  } else {
    rectColor = 255; // Bianco quando il rettangolo verde non è visibile
  }

  if (
    greenRectVisible &&
    (greenRectY > containerY + containerHeight || rectX <= containerX)
  ) {
    greenRectVisible = false;
  }

  if (greenRectVisible) {
    fill(130, 255, 134, 255);
    noStroke();
    rect(
      greenRectX,
      greenRectY,
      greenRectWidth,
      greenRectHeight,
      roundedCorner
    );
  }

  if (auto1X + img1.width / 8 > auto2X) {
    gameOver = true;
  }

  fill(rectColor); // Imposta il colore del rettangolo in base alla logica sopra
  noStroke();
  rect(
    containerX,
    containerY + containerHeight,
    containerWidth,
    -progress,
    roundedCorner
  );

  if (gameOver == false) {
    textAlign(CENTER, CENTER);
    textSize(180);
    fill(255);
    textFont("aktiv-grotesk");
    textStyle(BOLD);
    text(int(counter), width / 2 + 100, height / 2);
  }
}
