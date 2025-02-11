// import * as P5Dom from '../../vendor/js/p5.dom.min';
import * as ML5 from '../../vendor/js/ml5.min'; // TODO: Try to use npm if I can use the minified file

const SIZE = 256;

const sketch = (p5) => {
  // The pre-trained Edges2Pikachu model is trained on 256x256 images
  // So the input images can only be 256x256 or 512x512, or multiple of 256
  let inputImg;
  // let inputCanvas;
  let outputContainer;
  let statusMsg;
  let pix2pix;
  let clearBtn;
  let transferBtn;
  let modelReady = false;
  let isTransfering = false;

  // Draw the input image to the canvas
  const drawImage = () => {
    p5.image(inputImg, 0, 0);
  };

  // Clear the canvas
  const clearCanvas = () => {
    p5.background(255);
  };

  // Create image tag and add to #output div
  const createImage = (src) => {
    const output = document.querySelector('#output');
    const img = document.createElement('img');
    img.src = src;
    output.appendChild(img);
  };

  const transfer = () => {
    // Set isTransfering to true
    isTransfering = true;

    // Update status message
    statusMsg.innerHTML = 'Applying Style Transfer...!';

    // Select canvas DOM element
    const canvasElement = document.querySelector('canvas'); // .elt;

    // Apply pix2pix transformation
    pix2pix.transfer(canvasElement, (err, result) => {
      if (err) {
        console.log('err:', err);
        console.log('exit because error.');
        return;
      }

      if (result && result.src) {
        // Set isTransfering back to false
        isTransfering = false;
        // Clear output container
        outputContainer.innerHTML = '';
        // Create an image based result
        // I have no idea what this original commented out function was calling
        // createImg(result.src).class('border-box').parent('output');
        createImage(result.src);
        // Show 'Done!' message
        statusMsg.innerHTML = 'Done!';
      }
    });
  };

  // A function to be called when the models have loaded
  const modelLoaded = () => {
    console.log('model loaded');

    // Show 'Model Loaded!' message
    statusMsg.innerHTML = 'Model Loaded!';

    // Set modelReady to true
    modelReady = true;

    // Call transfer function after the model is loaded
    transfer();

    // Attach a click event to the transfer button
    transferBtn.addEventListener('click', () => {
      transfer();
    });
  };

  // When mouse is released, transfer the current image if the model is loaded and it's not in the process of another transformation
  p5.mouseReleased = () => {
    if (modelReady && !isTransfering) {
      transfer();
    }
  };

  //
  // Setup and Draw functions
  //

  p5.setup = () => {
    // Create a canvas
    const inputCanvas = p5.createCanvas(SIZE, SIZE);
    inputCanvas.class('border-box').parent('canvasContainer');
    console.log('input canvas');

    // Display initial input image
    inputImg = p5.loadImage('images/pikachu.png', drawImage);

    // Selcect output div container
    outputContainer = document.querySelector('#output');
    statusMsg = document.querySelector('#status');

    // Select 'transfer' button html element
    transferBtn = document.querySelector('#transferBtn');

    // Select 'clear' button html element then assign click event.
    clearBtn = document.querySelector('#clearBtn');
    clearBtn.addEventListener('click', () => {
      console.log('clear');
      clearCanvas();
    });

    // Set stroke to black
    p5.stroke(0);
    p5.pixelDensity(1);

    // Create a pix2pix method with a pre-trained model
    pix2pix = ML5.pix2pix(
      'https://rawgit.com/ml5js/pix2pix_models/master/edges2pikachu_AtoB.pict',
      modelLoaded,
    );
  };

  // Draw on the canvas when mouse is pressed
  p5.draw = () => {
    if (p5.mouseIsPressed) {
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    }
  };
};

export default sketch;
