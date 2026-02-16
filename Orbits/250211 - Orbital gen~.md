Physics setup:
- Orbital period should remain constant
- Central mass could change, but all projectiles should have the same mass 
- In general, any change to the timing of the orbit should affect all of the orbits, not just one
- Inputs: Eccentricity, central mass
- Outputs: velocity, on-ellipse position (Beta), x-y position, polar position
- Essentially, the gen~ object will receive $t/\tau$ , or the fractional orbital time from 0 to 1. That way we can standardize the period and drive each orbit generator with phasor~ objects at varying periods themselves
- I would love to have support for at least one hyperbolic orbit

1. Use position relative to center to calculate velocity vector direction and magnitude
2. Step forward along that velocity vector
3. Repeat

How to get initial velocity? All velocities should point upwards if starting on the far right.
Magnitude: Whatever magnitude would make the ellipse have a period of 1.0.


# Gen
Let's start from the beginning and build up the functionality we want to use in gen~ to make sure I'm implementing this correctly.


Initial code:
``` gen~
// Initialize all variables to zero at compile-time
History T(10);
History e(0.5);
History a(0.8);
History r(0.8);
History x(0.8);
History y(0);
History thetanorm(0);

// Constants
dt = SAMPLERATE;

// Check for updates from inlets
// (Hopefully) on runtime these will update
if (change(in1) != 0) {
		// Update period
		T = in1;
}
if (change(in2) != 0) {
	e = in2;
	a = pow(PI, -2)*pow(1-pow(in2,2), -4);
	r = a;
	x = a;
}


// Loop
vmag = 2*PI*T*sqrt(pow(a, 3)*((2/r)-(1/a)));	// Linear speed
thetadot = vmag/r;								// Angular speed
thetanorm = thetanorm + thetadot*(1/dt);		// Update theta
// Calculate new position
r = a*(1-pow(e, 2))/(1+e*cos(thetanorm*2*PI));
x = r*cos(thetanorm*2*PI);
y = r*sin(thetanorm*2*PI);



// Output
out1 = thetanorm;
out2 = vmag;
out3 = r;
out4 = x;
out5 = y;
out6 = 1;

```

## 1: Passing a number from inlet to outlet
![[Pasted image 20250212123344.png]]
![[Pasted image 20250212123358.png]]


## 2: History based feedback
![[Pasted image 20250212123539.png]]
![[Pasted image 20250212123551.png]]


## 3: History with initialization
![[Pasted image 20250212124039.png]]
![[Pasted image 20250212124049.png]]


## 4: History with initialization and powers
![[Pasted image 20250212124300.png]]
![[Pasted image 20250212124308.png]]

IMPORTANT NOTE: gen~ interprets `e` as Euler's number no matter how you treat it
T is also 10 for some reason TT ( crying)

## 5: Two history variables with initializations works
![[Pasted image 20250212144015.png]]
![[Pasted image 20250212144033.png]]
## 6: Two initialized input variables calculate a third initialized variable
![[Pasted image 20250212144357.png]]
![[Pasted image 20250212144403.png]]

## 7: Verify semimaj calculations
![[Pasted image 20250212144901.png]]
![[Pasted image 20250212144907.png]]

## 8: Verify one line semimajor axis calculation
![[Pasted image 20250212145319.png]]
![[Pasted image 20250212145327.png]]
BOO YA

## 9: Initial position values
- It isn't ideal that the radius and xpos are reset to the rightmost position when the eccentricity is changed, but I think that's okay and we can work around it


` / (1.01 -0.568*ecc +2.82*pow(ecc, 2) -1.74*pow(ecc, 3))`