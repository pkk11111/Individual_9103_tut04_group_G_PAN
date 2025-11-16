class Connector {
  constructor(startWheel, endPos) {
    this.startWheel = startWheel;  // Wheel where the connector begins
    this.endPos = endPos.copy();   // End point of the curve
    this.t = random(TWO_PI);       // Time offset for animation

    // Instead of a fixed colour, pick from the wheel's palette.
    this.color = random(this.startWheel.palette);

    this.baseStroke = 3.0;         // base stroke width
    this.strokeAnim = this.baseStroke;

    // --- Individual task: Perlin-noise wobble for the curve ---
    // Each connector also gets its own noise seeds to animate the control point.
    this.noiseSeedX = random(3000);
    this.noiseSeedY = random(4000);
    this.ctrlOffsetX = 0;
    this.ctrlOffsetY = 0;
  }

  // Animate the connector's slight wobble
  update() {
    // Simple time-based wobble (existing behaviour)
    this.t += 0.02;

    // --- Individual task: Perlin-noise-based control point offset ---
    // Use Perlin noise so the middle of the curve drifts smoothly over time.
    const t = frameCount * 0.01;

    const nx = noise(this.noiseSeedX + t);
    const ny = noise(this.noiseSeedY + t);

    // Map to a small range so the curve feels alive but not chaotic.
    this.ctrlOffsetX = map(nx, 0, 1, -20, 20);
    this.ctrlOffsetY = map(ny, 0, 1, -20, 20);
  }

    display() {
    // Get the wheel's current animated position (including floating offset)
    let startPos;

    if (this.startWheel.getCurrentPosition) {
      // Use the helper if available (individual task behaviour).
      startPos = this.startWheel.getCurrentPosition();
    } else {
      // Fallback: base wheel position (group behaviour).
      startPos = createVector(this.startWheel.x, this.startWheel.y);
    }

    const x1 = startPos.x;
    const y1 = startPos.y;
    const x2 = this.endPos.x;
    const y2 = this.endPos.y;

    // Base control point around the midpoint between start and end
    let cx = (x1 + x2) * 0.5;
    let cy = (y1 + y2) * 0.5;

    // Existing small wobble using sin/cos and this.t (if you have it, keep it)
    // For example (if already present):
    // cx += cos(this.t) * 15;
    // cy += sin(this.t) * 15;

    // --- Individual task: add Perlin-noise-based offset to the control point ---
    cx += this.ctrlOffsetX;
    cy += this.ctrlOffsetY;

    // Now draw the curve as before
    // Shadow curve
    stroke(0, 120);
    strokeWeight(this.strokeAnim + 2);
    noFill();
    beginShape();
    vertex(x1, y1);
    quadraticVertex(cx, cy, x2, y2);
    endShape();

    // Main coloured curve
    stroke(this.color);
    strokeWeight(this.strokeAnim);
    noFill();
    beginShape();
    vertex(x1, y1);
    quadraticVertex(cx, cy, x2, y2);
    endShape();

    // Dot at the starting point
    noStroke();
    fill(this.color);
    ellipse(x1, y1, 10, 10);
  }
}
