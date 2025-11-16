// NOTE: Additional Perlin-noise-driven animation added by [JINGKE PAN]
// for the individual assignment (floating motion for wheels).
class Wheel {
  constructor(x, y, baseRadius, palette) {
    this.x = x;
    this.y = y;
    this.baseRadius = baseRadius;
    this.palette = palette;   // Color set for this wheel
    this.rings = [];          // All ring layers inside the wheel

    this.rotation = random(TWO_PI);          // Initial rotation
    this.rotationSpeed = random(-0.01, 0.01); // Slow spinning motion


    // === Individual Work: Perlin noise floating system ===
    // Each wheel receives unique noise seeds and a random floating radius.
    // This creates smooth drifting motion that differentiates my individual version
    // from the static group design.

    // --- Individual task: Perlin-noise-based floating position ---
    // Each wheel gets its own noise seeds so they float differently.
    this.floatNoiseX = random(1000);
    this.floatNoiseY = random(2000);

    // Randomly choose how far this wheel is allowed to drift.
    this.floatRadius = random(10, 30); // max drift in pixels

    // These will store the animated offset from the base position.
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // Create multiple ring layers with random types and colors
  initRings() {
    let numRings = floor(random(3, 6));
    let step = this.baseRadius / numRings;
    let currentInner = 0;

    for (let i = 0; i < numRings; i++) {
      let innerR = currentInner;
      let outerR = currentInner + step;
      currentInner = outerR;

      // Random ring type
      let rnd = random();
      let type = rnd < 0.33 ? "solid" : rnd < 0.66 ? "dots" : "rays";

      // Lachlan: force last ring to be solid
      if (i === numRings - 1) type = "solid";

      let mainColor = random(this.palette);
      let secondaryColor = random(this.palette);

      this.rings.push(
        new Ring(innerR, outerR, type, mainColor, secondaryColor)
      );
    }
  }

  // --- Individual Work: update noise-driven offsets ---
  // Sample Perlin noise over time to animate the wheel’s floating position.
  // Update wheel rotation and ring animations
    update() {
    // Update rotation
    this.rotation += this.rotationSpeed;

    // Update each ring
    for (let r of this.rings) {
      r.update();
    }

    // --- Individual task: update noise-driven floating offset ---
    // Use Perlin noise over time to create a smooth drifting motion.
    const t = frameCount * 0.005;

    // Noise values are in [0, 1], map them to a symmetric range.
    const nx = noise(this.floatNoiseX + t);
    const ny = noise(this.floatNoiseY + t);

    this.offsetX = map(nx, 0, 1, -this.floatRadius, this.floatRadius); // x-axis offset
    this.offsetY = map(ny, 0, 1, -this.floatRadius, this.floatRadius); // y-axis offset
  }


    // Draw wheel, its shadows, and all ring layers
  display() {
    push();
    //Individual work
    // Use animated floating offsets instead of the static group position.
    translate(this.x + this.offsetX, this.y + this.offsetY);
    rotate(this.rotation);

    // Large soft background discs to increase visual density
    noStroke();
    fill(0, 35);
    ellipse(0, 0, this.baseRadius * 3.2, this.baseRadius * 3.2);

    fill(0, 55);
    ellipse(0, 0, this.baseRadius * 2.6, this.baseRadius * 2.6);

    // Offset shadow closest to the wheel
    fill(0, 80);
    ellipse(4, 6, this.baseRadius * 2.1, this.baseRadius * 2.1);

    // Herman:
    // add a coloured core circle in the centre of the wheel
    // to echo the painted artwork's central "eye" motif.
    // --------------------------------------------------
    noStroke();
    let coreColor = this.palette[0]; // use the first colour in the palette
    fill(coreColor);
    ellipse(0, 0, this.baseRadius * 0.6, this.baseRadius * 0.6);

    // Draw all rings
    for (let r of this.rings) r.display();

    // Herman:
    // add a subtle outer outline around the main wheel area
    // to make the overall structure slightly clearer.
    // --------------------------------------------------
    noFill();
    stroke(255, 45);        // soft outline
    strokeWeight(1.2);
    drawingContext.setLineDash([6, 6]);  // dash length, gap length
    ellipse(0, 0, this.baseRadius * 2.0, this.baseRadius * 2.0);

   // Reset line dash so it does not affect other drawings
   drawingContext.setLineDash([]);
    pop();
  }
  // Return the current animated position of this wheel,
  // including the Perlin-noise-driven offset.
  // Helper function added for the individual task.
  // Allows connectors to access the wheel’s animated position.
  getCurrentPosition() {
    return createVector(this.x + this.offsetX, this.y + this.offsetY);          // Return a p5.Vector object
  }
}

