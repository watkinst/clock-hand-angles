# Clock-Hand-Angles
A visual guide to where every angle between the hour and minute hand occurs on an analog clock. Live link: [Clock Hand Angles][1]

---

## Screenshot
[![](https://watkinst.github.io/clock-hand-angles/img/cha_sm.png)][large]

---

## Motivation
Inspired by a recruiting question I saw on LinkedIn that asked what the angle between the minute and hour hands was at 3:15pm. One of my peers challenged me to provide a visual solution using the html canvas element. I also wanted to see if the exact angle that occurred at 3:15 could be found between the hour and minute hands at any other valid time. It turns out that each exact angle only ever occurs twice, with zero degrees and 180 degrees being the only exceptions to that rule ( they only occur once ). Run the project to see for yourself!

---

## Installation
1. Clone the project
    * `git clone https://github.com/watkinst/clock-hand-angles.git`
2. Install dependencies
    * cd into the project folder and run `npm install`
3. Run `gulp dev`, which:
    * creates a _**dist**_ folder containing an index.html file
    * creates _**css**_ and _**js**_ folders inside the _**dist**_ folder that contain minified css and js
    * triggers a watch on all the files in the _**src**_ folder
4. Spin up a server:
    * on Mac or Windows ( using Python 2 ):
        * cd into the _**dist**_ folder
        * run `python -m SimpleHTTPServer 8000`
        *  visit `localhost:8000` in your browser

---

## License
MIT License
https://choosealicense.com/licenses/mit/

[1]: https://watkinst.github.io/clock-hand-angles/
[large]: https://watkinst.github.io/clock-hand-angles/img/cha_lg.png
