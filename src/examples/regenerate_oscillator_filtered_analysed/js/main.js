window.addEventListener('load', function() {

  var context = new AudioContext();
  var oscillator = new Oscillator(context);
  var filter = context.createBiquadFilter();
  var analyser = context.createAnalyser();
  analyser.fftSize = 512;
  var analyserCanvas = document.querySelector('canvas');
  var analyserTimeData = new Float32Array(analyser.frequencyBinCount);

  oscillator.type = 'square';
  oscillator.frequency = 110;
  oscillator.output.connect(filter);
  filter.connect(analyser);
  analyser.connect(context.destination);
  
  var button = document.querySelector('button');
  var playing = false;
  var messagePlaying = 'stop';
  var messageStopped = 'beep';
  var frequencySlider = document.getElementById('frequency');
  var qSlider = document.getElementById('q');

  button.addEventListener('click', togglePlay);

  frequencySlider.addEventListener('input', updateFrequency);
  qSlider.addEventListener('input', updateQ);
  updateFrequency();
  updateQ();

  requestAnimationFrame(animate);

  function togglePlay() {
    if(playing) {
      oscillator.stop();
      button.innerHTML = messageStopped;
    } else {
      oscillator.start();
      oscillator.output.gain.setValueAtTime(0.5, context.currentTime);
      button.innerHTML = messagePlaying;
    }
    playing = !playing;
  }

  function animate() {
    requestAnimationFrame(animate);

    analyser.getFloatTimeDomainData(analyserTimeData);
    drawTimeDomainSample(analyserCanvas, analyserTimeData);
  }

  function updateFrequency() {
    var v = frequencySlider.value * 1;
    filter.frequency.linearRampToValueAtTime(v, context.currentTime);
  }

  function updateQ() {
    var v = qSlider.value * 1;
    filter.Q.linearRampToValueAtTime(v, context.currentTime);
  }


});
