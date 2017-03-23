## Clock-Hand-Angles
A visual guide to where every angle between the hour and minute hand occurs on an analog clock.

## Motivation
Inspired by a recruiting question I saw on LinkedIn that asked what the angle between the minute and hour hands was at 3:15pm. One of my peers challenged me to provide a visual solution using the html canvas element. I also wanted to see if the exact angle that occurred at 3:15 could be found between the hour and minute hands at any other valid time. It turns out that each exact angle only ever occurs twice, with zero degrees and 180 degrees being the only exceptions to that rule ( they only occur once ). Run the project to see for yourself!

## Installation
1) Clone the project: git clone https://github.com/watkinst/clock-hand-angles.git
2) cd into the project directory and run 'npm install'
3) Run 'gulp dev' - this will create a 'dist' folder containing an index.html file, and minfied css and js. It will also trigger a watch on all the files.
4) Spin up a server - on a mac you can simply cd into the 'dist' folder, run 'python -m SimpleHTTPServer 8000' and visit localhost:8000 in your browser

## License
MIT License
https://choosealicense.com/licenses/mit/
