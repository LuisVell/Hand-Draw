/* - - MediaPipe Hands tracking - - */

/*

Which tracking points can I use?
https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png

Full documentation
https://developers.google.com/mediapipe/solutions/vision/hand_landmarker

*/


/* - - Variables - - */

// webcam variables
let capture; // our webcam
let captureEvent; // callback when webcam is ready

let DEBUG = false;

let Badge;

const Ligacoes = [[4,3],[3,2],[2,1],[1,0],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[17,0]] //Quais pontos devem se ligar a quais

function preload(){
  Badge = loadImage('imgs/FederationBadge.png')
}

/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam

  // styling
  noStroke();
  Badge.resize(50,0)
  textAlign(LEFT, CENTER);
  fill('white');

}

/* - - Draw - - */
function draw() {
  background(0);

  /* WEBCAM */
  push();
  centerOurStuff(); // center the webcam
  scale(-1, 1); // mirror webcam
  image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight); // draw webcam
  scale(-1, 1); // unset mirror
  pop();


  /* TRACKING */
  if (mediaPipe.landmarks[0]) { // Mão foi detectada?
    let Points = []
    for(let i = 0; i<21;i++){ //Segue os pontos de cada dobra dos dedos seguindo a imagem: https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png
      let indexX = map(mediaPipe.landmarks[0][i].x, 1, 0, 0, capture.scaledWidth);
      let indexY = map(mediaPipe.landmarks[0][i].y, 0, 1, 0, capture.scaledHeight);
      Points[i] = [indexX,indexY] //Salva as coordenadas 
      
      if(DEBUG){//Pontos
        push();
        centerOurStuff();
        fill('white');
        ellipse(indexX, indexY, 20, 20);
        fill('blue');
        textSize(40);
        text(String(i), indexX + 30, indexY);
        pop();
      }
    }
  
    if(DEBUG){ //Mostra Distancias
      textSize(10);
      text("Indicador Meio: "+String(DistanceBtPoints(Points[8],Points[11])), 10, windowHeight-10)
      text("Meio Anelar: "+String(DistanceBtPoints(Points[12],Points[16])), 10, windowHeight-30)
      text("Anelar Mindinho: "+String(DistanceBtPoints(Points[15],Points[20])), 10, windowHeight-50) //<80
      text("Dedão mão: "+String(DistanceBtPoints(Points[3],Points[5])), 10, windowHeight-70) //>100
      text("Base: "+String(DistanceBtPoints(Points[5],Points[17])),10, windowHeight-90) //TODO:Calcular com base nos pontos 5 e 17 a distancia da mão
    }

    //Checar Mão
    if((DistanceBtPoints(Points[8],Points[11])<80)&&(DistanceBtPoints(Points[15],Points[20])<80)){ //Dedos Juntos
      if((DistanceBtPoints(Points[12],Points[16])>80)&&(DistanceBtPoints(Points[3],Points[5])>100)){//Espaçamentos
        if(Points[4][0]<Points[17][0]){ //Sentido certo, não detecta mão :,(
          textSize(40);
          text("Vida Longa e Próspera", Points[0][0]-200, Points[0][1]+5)
          image(Badge, Points[9][0], Points[9][1]+10)//Aplica a img
        }
      }
    }
    if(DEBUG){//Desenha as linhas
      for(let i=0;i<Ligacoes.length;i++){
        let p1 = Ligacoes[i][0]
        let p2 = Ligacoes[i][1]
        if(Points[p1] && Points[p2]){
          push();
          centerOurStuff();
          stroke(0)
          strokeWeight(10)
          line(Points[p1][0],Points[p1][1],Points[p2][0],Points[p2][1])
          pop();
        }
      }
    }
  }
}

/* - - Helper functions - - */

// function: launch webcam
function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      console.log(captureEvent.getTracks()[0].getSettings());
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      capture.srcObject = e;

      setCameraDimensions(capture);
      mediaPipe.predictWebcam(capture);
      //mediaPipe.predictWebcam(parentDiv);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

// function: resize webcam depending on orientation
function setCameraDimensions(video) {

  const vidAspectRatio = video.width / video.height; // aspect ratio of the video
  const canvasAspectRatio = width / height; // aspect ratio of the canvas

  if (vidAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas aspect ratio
    video.scaledHeight = height;
    video.scaledWidth = video.scaledHeight * vidAspectRatio;
  } else {
    // Image is taller than canvas aspect ratio
    video.scaledWidth = width;
    video.scaledHeight = video.scaledWidth / vidAspectRatio;
  }
}

// function: center our stuff
function centerOurStuff() {
  translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2); // center the webcam
}

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions(capture);
}

function DistanceBtPoints(p1, p2){
  let x1 = p1[0]
  let x2 = p2[0]
  let y1 = p1[1]
  let y2 = p2[1]
  return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

function DEBUGfun(){
  DEBUG = !DEBUG
  console.log(DEBUG)
}