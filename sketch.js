/* - - MediaPipe Hands tracking - - */

/*

Which tracking points can I use?
https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png

We have a total of 21 points per hand:
0 = wrist
4 = thumb tip
8 = index finger tip
20 = pinky tip

Full documentation
https://developers.google.com/mediapipe/solutions/vision/hand_landmarker

*/


/* - - Variables - - */

// webcam variables
let capture; // our webcam
let captureEvent; // callback when webcam is ready

const Ligacoes = [[4,3],[3,2],[2,1],[1,0],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[17,0]]


/* - - Setup - - */
function setup() {

  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam

  // styling
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill('white');

}


/* - - Draw - - */
function draw() {
  stroke(10)
  line(0,0,1000,1000)
  background(0);


  /* WEBCAM */
  push();
  centerOurStuff(); // center the webcam
  scale(-1, 1); // mirror webcam
  image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight); // draw webcam
  scale(-1, 1); // unset mirror
  pop();


  /* TRACKING */
  if (mediaPipe.landmarks[0]) { // is hand tracking ready?

    let Points = []
    for(let i = 0; i<20;i++){
      let indexX = map(mediaPipe.landmarks[0][i].x, 1, 0, 0, capture.scaledWidth);
      let indexY = map(mediaPipe.landmarks[0][i].y, 0, 1, 0, capture.scaledHeight);
      Points[i] = [indexX,indexY]
      // draw index finger
      push();
      centerOurStuff();
      fill('white');
      ellipse(indexX, indexY, 10, 10);
      fill('blue');
      text(String(i), indexX + 30, indexY);
      pop();

    }
    for(let i=0;i<Ligacoes.length;i++){
      let p1 = Ligacoes[i][0]
      let p2 = Ligacoes[i][1]
      if(Points[p1] && Points[p2]){
        push();
        centerOurStuff();
        fill('white');
        line(Points[p1][0],Points[p1][1],Points[p2][0],Points[p2][1])
        pop();
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

