/**
 * YIN Pitch Detection Algorithm Web Worker
 * 
 * Receives raw Float32Array PCM audio buffer data, calculates the fundamental
 * frequency (pitch in Hz) using cumulative mean normalized differences,
 * and posts the calculated pitch back to the main thread.
 */

self.onmessage = function (e) {
  const { buffer, sampleRate, threshold = 0.15 } = e.data;
  
  if (!buffer || !sampleRate) {
    self.postMessage({ pitch: -1, clarity: 0 });
    return;
  }

  const pitchData = detectPitchYin(buffer, sampleRate, threshold);
  self.postMessage(pitchData);
};

/**
 * YIN Pitch Detection algorithm implementation
 * Reference: De Cheveigné, A., & Kawahara, H. (2002). YIN, a fundamental frequency estimator for speech and music.
 */
function detectPitchYin(buffer, sampleRate, threshold) {
  const size = buffer.length;
  const halfSize = Math.floor(size / 2);
  
  // step 1: difference function
  const yinBuffer = new Float32Array(halfSize);
  for (let tau = 0; tau < halfSize; tau++) {
    let sum = 0;
    for (let i = 0; i < halfSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    yinBuffer[tau] = sum;
  }

  // step 2: cumulative mean normalized difference
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < halfSize; tau++) {
    runningSum += yinBuffer[tau];
    if (runningSum === 0) {
      yinBuffer[tau] = 1;
    } else {
      yinBuffer[tau] = yinBuffer[tau] / (runningSum / tau);
    }
  }

  // step 3: absolute thresholding
  let tauResult = -1;
  for (let tau = 1; tau < halfSize; tau++) {
    if (yinBuffer[tau] < threshold) {
      tauResult = tau;
      break;
    }
  }

  // If no peak was found below the threshold, look for the global minimum
  if (tauResult === -1) {
    let minVal = 1e9;
    let minTau = -1;
    for (let tau = 1; tau < halfSize; tau++) {
      if (yinBuffer[tau] < minVal) {
        minVal = yinBuffer[tau];
        minTau = tau;
      }
    }
    tauResult = minTau;
  }

  // If tauResult is invalid or represents a frequency outside practical bounds
  if (tauResult === -1 || tauResult >= halfSize) {
    return { pitch: -1, clarity: 0 };
  }

  // step 4: parabolic interpolation for sub-sample accuracy
  let betterTau = tauResult;
  if (tauResult > 0 && tauResult < halfSize - 1) {
    const s0 = yinBuffer[tauResult - 1];
    const s1 = yinBuffer[tauResult];
    const s2 = yinBuffer[tauResult + 1];
    const denom = s2 - 2 * s1 + s0;
    if (denom !== 0) {
      betterTau = tauResult + (s0 - s2) / (2 * denom);
    }
  }

  // step 5: calculate exact pitch frequency in Hz
  const pitch = sampleRate / betterTau;
  const clarity = 1 - yinBuffer[tauResult]; // clarity is inversely related to normalized difference error

  // Human vocal range check (singing pitch filtering: 95Hz to 1400Hz with high clarity)
  if (pitch >= 95 && pitch <= 1400 && clarity > 0.65) {
    return { pitch, clarity };
  }

  return { pitch: -1, clarity: 0 };
}
