Creating Multichannel Signed Distance Field (MSDF) starting from an SVG file.

This app is an electron app wrapper around [msdfgen](https://github.com/Chlumsky/msdfgen) cli.

Demo: https://x.com/luruke/status/1570099999278600194

## Build
```
npm install
npm run make_host
```

> If you have error (corrupted file) opening the mac osx app try this code in your terminal**
    
`xattr -cr /path/to/application.app`


MSDF textures are particularly effective for single-channel masks (commonly used for masking, icons, etc.). They provide superior quality at much smaller sizes compared to traditional image formats. For instance, a 64px MSDF texture can deliver better visual results than a 1024px black and white PNG, resulting in significantly reduced memory usage while maintaining crisp, high-quality rendering.


glsl usage

```glsl
float msdf(sampler2D tMap, vec2 uv) {
    vec3 tex = texture2D(tMap, uv).rgb;
	  // If you have small artifacts, try to tweak the 0.5 value.
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);
    return alpha;
}

float value = msdf(tex, vUv); 
```


All options

```
➜  svg2msdf git:(master) ./src/msdfgen/darwin/msdfgen.osx -help

Multi-channel signed distance field generator by Viktor Chlumsky v1.5
---------------------------------------------------------------------
  Usage: msdfgen <mode> <input specification> <options>

MODES
  sdf - Generate conventional monochrome signed distance field.
  psdf - Generate monochrome signed pseudo-distance field.
  msdf - Generate multi-channel signed distance field. This is used by default if no mode is specified.
  metrics - Report shape metrics only.

INPUT SPECIFICATION
  -defineshape <definition>
	Defines input shape using the ad-hoc text definition.
  -font <filename.ttf> <character code>
	Loads a single glyph from the specified font file. Format of character code is '?', 63 or 0x3F.
  -shapedesc <filename.txt>
	Loads text shape description from a file.
  -stdin
	Reads text shape description from the standard input.
  -svg <filename.svg>
	Loads the last vector path found in the specified SVG file.

OPTIONS
  -angle <angle>
	Specifies the minimum angle between adjacent edges to be considered a corner. Append D for degrees.
  -ascale <x scale> <y scale>
	Sets the scale used to convert shape units to pixels asymmetrically.
  -autoframe
	Automatically scales (unless specified) and translates the shape to fit.
  -edgecolors <sequence>
	Overrides automatic edge coloring with the specified color sequence.
  -errorcorrection <threshold>
	Changes the threshold used to detect and correct potential artifacts. 0 disables error correction.
  -exportshape <filename.txt>
	Saves the shape description into a text file that can be edited and loaded using -shapedesc.
  -format <png / bmp / text / textfloat / bin / binfloat / binfloatbe>
	Specifies the output format of the distance field. Otherwise it is chosen based on output file extension.
  -help
	Displays this help.
  -keeporder
	Disables the detection of shape orientation and keeps it as is.
  -legacy
	Uses the original (legacy) distance field algorithms.
  -o <filename>
	Sets the output file name. The default value is "output.png".
  -printmetrics
	Prints relevant metrics of the shape to the standard output.
  -pxrange <range>
	Sets the width of the range between the lowest and highest signed distance in pixels.
  -range <range>
	Sets the width of the range between the lowest and highest signed distance in shape units.
  -scale <scale>
	Sets the scale used to convert shape units to pixels.
  -size <width> <height>
	Sets the dimensions of the output image.
  -stdout
	Prints the output instead of storing it in a file. Only text formats are supported.
  -testrender <filename.png> <width> <height>
	Renders an image preview using the generated distance field and saves it as a PNG file.
  -testrendermulti <filename.png> <width> <height>
	Renders an image preview without flattening the color channels.
  -tolerance <tolerance>  (Default: 0.01)
	Tolerance when checking for point equality. Helps avoid artifacts in noisy/inaccurate input shapes.
  -translate <x> <y>
	Sets the translation of the shape in shape units.
  -reverseorder
	Disables the detection of shape orientation and reverses the order of its vertices.
  -seed <n>
	Sets the random seed for edge coloring heuristic.
  -yflip
	Inverts the Y axis in the output distance field. The default order is bottom to top.
```