this.inlets = 1;
this.outlets = 5;
setoutletassist(0, "Note value [1-13]");
setoutletassist(1, "Seed [0., 1.]");
setoutletassist(2, "Chaos [0., 1.]");
setoutletassist(3, "Subset notes (list)");
setoutletassist(4, "All notes (list)");

//declareattribute("scale", "getscale", "setscale");
// Implement this at some point

// Properly initialize 'pattern' as a property of 'this'
this.pattern = [];
this.steps = 0;
this.note_list = [];
this.subset = [];
this.seed = 0;
this.chaos = 0;

// Function to process a note list
function input_note_list(a) {
    this.note_list = arguments;
	//post("Note list length: " + this.note_list.length + "\n");
	outlet(4, "clear");
	for (var i = 0; i < this.note_list.length; i++) {
		//post(this.subset[i]+"\n");
		outlet(4, this.note_list[i]);
	}
}

// Set length of the pattern array
function pattern_len(n) {
	//if (this.pattern.length < n) {
		//this.pattern = this.pattern + new Array(n-this.pattern.length+1);
		//post("Expanded");
	//}
	this.pattern = new Array(n);
	for (var i = 0; i < this.pattern.length; i++) {
		this.pattern[i] = -1;
		//post("Pattern " + i + ":" + this.pattern[i] + "\n");
	}
	//post(this.pattern.length);
}

// Function invoked whenever a new note is requested,
// generates the note pitch based on input parameters
//
// i = Note index
// M = generation mode
// s = available subset number
// c = consistency
function index(i, c) {
	// Update randomness seed
	i = Number(i);
	c = parseFloat(c);
	this.seed = this.seed + c;
	if (c==0) {
		this.seed = 0;
		this.chaos = 0;
	}
	if (this.seed > 1) {
		this.seed = 0;
	}
	if (this.chaos > 1) {
		this.chaos = 0;
	}
	// Update note value
	// If note does not yet exist in pattern, add it unconditionally
	if (this.pattern[i] == -1) {
		//post("Pattern index not defined.\n");
		var subset_index = Math.floor(this.subset.length * Math.random());
		this.pattern[i] = this.subset[subset_index];
		//post("Subset index: " + subset_index + "\n");
		//post("Subset value: " + this.subset[subset_index] + "\n");
	} else {
		// Note already exists in pattern -> check for mutation
		//post("Note exists\n");
		if (Math.random()+0.001 < this.seed) {	
			// Mutation has occured
			var newNote = this.pattern[i];
			while (newNote == this.pattern[i]) {
				newNote = this.subset[Math.floor(this.subset.length * Math.random())];
			}
			this.pattern[i] = newNote;
		}
	}
	// Subset mutations
	this.chaos = this.chaos + c * Math.random() * 0.25;
	if (this.chaos >= 1) {
		var subindex = Math.floor(Math.random()*this.subset.length);
		this.subset[subindex] = this.note_list[Math.floor(Math.random()*this.note_list.length)];
	}
	// Could add random octave shifts maybe
	outlet(0, this.pattern[i]);
	outlet(1, this.seed);
	outlet(2, this.chaos);
	outlet(3, "clear");
	for (var i = 0; i < this.subset.length; i++) {
		//post(this.subset[i]+"\n");
		outlet(3, this.subset[i]);
	}
}

function subset_len(n) {
	this.subset = new Array(n);
	// generate initial subset
	outlet(3, "clear");
	for (var i = 0; i < this.subset.length; i++) {
		this.subset[i] = this.note_list[Math.floor(Math.random()*this.note_list.length)];
		//post(this.subset[i]+"\n");
		outlet(3, this.subset[i]);
	}
	//post("Subset length: " + this.subset.length + "\n");
	
}

