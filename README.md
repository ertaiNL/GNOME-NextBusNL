# NextBusNL
ways to display your next bus. Please note that this is still in early development.


The API's are based on the OVapi REST interface.
Documentation can be found at https://github.com/skywave/KV78Turbo-OVAPI/wiki.

To find the TIMING_POINT_CODE:
- Search your stop in http://kv78turbo.ovapi.nl/stopareacode/ (please note that this is a big document)
- Note your StopAreaCode and add it to the previous url. (e.g. http://kv78turbo.ovapi.nl/stopareacode/asdhly)
- In this document you should find TimingPointCodes. Look at which "Stop"	you want to use as each goes in a different direction.
  You can find the correct one only by looking at the passes, and see which goes in the correct direction
- Use this number as TIMING_POINT_CODE (e.g. 57140010).

## gnome-shell-extension
To use it already do:

- Compile the gschema in gnome-shell-extension/src/schemas
  - Go to the directory
  - run <code>glib-compile-schemas .</code> 
- Copy gnome-shell-extension/src to ~/.local/share/gnome-shell/extensions/NextBusNL@ertai.nl
- start Tweak-Tool (if not found in gnome. Install it).
- fill in your timing-point-code.
- enable the NextBusNL extension

This should add at the right-top of your sceen a bus-icon. When you click on it you get the next busses for your stop.

## windows program
Not really usable yet. Still working on this.

Uses the following libraries:
- Newtonsoft.Json.10.0.3