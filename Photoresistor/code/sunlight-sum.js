/*
 * extrapolated from buffer-js-help.js and this blog post: https://cycling74.com/tutorials/javascripting-the-buffer-object
 */

outlets = 1

var buf = new Buffer("sunlight")


function bang()
{
	// on bang, do this!
	var length_in_samps = buf.framecount();
	var curSum = 0;
	var curSamp;
	for (var i=0; i<length_in_samps; i++){
		// read through each sample in the buffer channel 1 and add it to the sum
		curSamp = buf.peek(1, i, 1);
		curSum = curSum + Math.abs(curSamp);
	}
	outlet(0, curSum);
}