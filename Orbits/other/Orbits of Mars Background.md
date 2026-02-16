I was motivated to explore elliptical orbits and celestial mechanics as a method of sequencing music, specifically because of Steve Reich's use of circular rhythms in his music. My algorithm starts with the physics of orbiting bodies.

## Physics
I started with the physics of orbits, two equations in particular:
$$T=2\pi\sqrt{\frac{a^3}{\mu}}$$
This relates the period of revolution to the semimajor axis and $\mu$, which is a function of the force acting on the object.
$$v=\sqrt{\mu(\frac{2}{r}-\frac{1}{a})}$$
This is known as the "vis-viva equation", which relates the velocity of the particle to its radius from the focus of the orbit.
$\mu$ appears in both of these equations, allowing me to directly relate the desired quantities (velocity and radius) to the system's inputs (period and eccentricity).
*Note: My algorithm uses the eccentricity as the parameter describing the shape of the orbit, so the semimajor axis is calculated with the assumption that all orbits have the same area, regardless of eccentricity.*
With this, I could implement a numerical physics simulation in `gen~` (which took the better part of 12 hours). The end product is a signal ranging from 0 to 1, representing the normalized "true anomaly" of the particle, AKA the angular position in the ellipse. A particle with eccentricity=0 will process in a perfect circle, and its theta function will look like a saw wave. With greater eccentricities, the particle will move faster the closer it is to the focus, and slower the further it is away, giving a variable speed of procession.

## Sequencing
As the particle moves around its orbit, it triggers steps of a step sequencer to be played, keeping with it its unique speed variations. These triggers are then quantized, and sent off to the melody generator.
My melody generating algorithm was inspired by a synth module called "Turing Machine". The user inputs a list of notes, and then the machine selects a subset of those notes based on the user's input. When a trigger is received, the machine selects a random note from that subset and outputs it to MIDI. The 'chance' parameter can be used to increase the likelihood of a note's value changing -- setting it all the way to zero will keep your pattern exactly the way it is, giving a musical balance of randomness and repetition. Occasionally, the chaos bar will fill up, triggering an autonomous change in the selected subset of notes, to prevent the melody from becoming stale.

## Recording
For this piece, I used the A minor pentatonic scale as input to the turing machine, and used the orbital sequencer to drive several MIDI devices in Live. All sequences were generated with this algorithm, except for the bass, which I played along with the algorithmically generated MIDI. 