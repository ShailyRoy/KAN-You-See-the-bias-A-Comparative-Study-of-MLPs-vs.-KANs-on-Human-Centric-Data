// ----- //
// initialization
// ----- //
// always go to the top after reloading the page
window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};

// import visualizations from chapters
import { visualizeIncomeDistribution, visualizeConfusionMatrix } from './chapter-1/chapter-1.js';
import { chapter_2_1 } from './chapter-2/chapter_2_1.js';
import { chapter_2_2 } from './chapter-2/chapter_2_2.js';
import { chapter_3_1 } from './chapter-3/chapter_3_1.js';
import { chapter_3_2 } from './chapter-3/chapter_3_2.js';
import { chapter_3_3 } from './chapter-3/chapter_3_3.js';
import { chapter_3_4 } from './chapter-3/chapter_3_4.js';
import { chapter_4_1 } from './chapter-4/chapter_4_1.js';
import { chapter_4_2 } from './chapter-4/chapter_4_2.js';
import { chapter_4_3 } from './chapter-4/chapter_4_3.js';
import { chapter_5_1 } from './chapter-5/chapter_5_1.js';
import { chapter_5_2 } from './chapter-5/chapter_5_2.js';
import { chapter_6_1 } from './chapter-6/chapter_6_1.js';

// define global variables
var scroller = scrollama();  // initialize scrollama
var currentStep = 0;  // variable to track the current step

// ----- //
// start the main script
// ----- //
// main();
document.addEventListener("DOMContentLoaded", main);


// ----- //
// the main script
// ----- //
function main() {
    // ----- //
    // initialization
    // ----- //
    // create g within the svg
    d3.select("#main-svg").append("g");
    // start from stage-0 (we always go to the top after reloading the page)
    updateVis(0);
    // ----- //

    // ----- //
    // set up scrollama
    // ----- //
    // set up the scroller
    scroller.setup({step: "#left-panel section", offset: 0.5, debug: false})  // make configurations
        .onStepEnter(function(response) {  // set up the callback
            currentStep = response.index;
            updateVis(currentStep);
        });
    // add resize event (per documentation)
    // window.addEventListener("resize", scroller.resize);  // debug: does this line cause misalignment?
    // ----- //

    // ----- //
    // set up event listeners for left-panel controls (e.g. slider and selection)
    // ----- //
    // for all selectors
    document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", function() {
        updateVis(currentStep);
        });
    });
    // for all sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener("mouseup", function() {
            updateVis(currentStep);
        });
    });
    // ----- //
}

// update visualization based on scroll position
function updateVis(index) {
    // select content
    var content = d3.select("#main-svg g");

    // transition effect: fade out previous content
    content.transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", function() {
            content.selectAll("*").remove(); // clear previous content
            content.style("opacity", 1); // reset opacity

            switch(index) {
                case 0:
                    chapter_1_1();  // chapter 1-1
                    break;
                case 1:
                    chapter_1_2();  // chapter 1-2
                    break;
                case 2:
                    chapter_1_3();  // chapter 1-3
                    break;
                case 3:
                    chapter_2_1();  // chapter 2-1
                    break;
                case 4:
                    chapter_2_2();  // chapter 2-2
                    break;
                case 5:
                    chapter_3_1();  // chapter 3-1
                    break;
                case 6:
                    chapter_3_2();  // chapter 3-2
                    break;
                case 7:
                    chapter_3_3();  // chapter 3-3
                    break;
                case 8:
                    chapter_3_4();  // chapter 3-4
                    break;
                case 9:
                    chapter_4_1();  // chapter 4-1
                    break;
                case 10:
                    chapter_4_2();  // chapter 4-2
                    break;
                case 11:
                    chapter_4_3();  // chapter 4-3
                    break;
                case 12:
                    chapter_5_1();  // chapter 5
                    break;
                case 13:
                    chapter_5_2();  // chapter 5
                    break;
                case 14:
                    chapter_6_1();  // chapter 6
                    break;
                default:
                    break;
            }
        });
}




// ----- //
// chapter 1 related
// ----- //
function chapter_1_1() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "Recent Tweet by famous machine learning researcher Yann LeCun discussing bias in ML systems.";

    // getting the dimensions of the actual content
    const contentWidth = 767;
    const contentHeight = 522;
    // getting svg dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");
    content.append("image")
        .attr("href", "photos/yann_twitter.png")
        .attr("width", "100%")
        .attr("height", "100%");
}

function chapter_1_2() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "We can observe that a higher number of males have incomes greater than 50K per year.";

    // getting the height of the actual content
    const contentHeight = 420;  
    // setting svg dimensions to match content
    d3.select("#main-svg")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");
    visualizeIncomeDistribution(content);
}

function chapter_1_3() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "Confusion matrix generated by a logistic regression model.";

    // getting the height of the actual content
    const contentHeight = 500;  
    // setting svg dimensions to match content
    d3.select("#main-svg")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");
    visualizeConfusionMatrix(content);
}











function visualizeParticipantDistribution() {
    var content = d3.select("#main-svg g");
    var attribute = document.getElementById("attribute").value;

    // simulated participant data
    var participants = d3.range(15).map(function(d) {
        return {
            id: d + 1,
            age: Math.floor(Math.random() * 50) + 20,
            gender: Math.random() > 0.5 ? "Male" : "Female",
            dominant_hand: Math.random() > 0.8 ? "Left" : "Right"
        };
    });

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var box = content.append("g")
        .attr("transform", "translate(50,50)");

    box.selectAll(".participant")
        .data(participants)
        .enter()
        .append("rect")
        .attr("class", "participant")
        .attr("x", (d, i) => (i % 5) * 60)
        .attr("y", (d, i) => Math.floor(i / 5) * 60)
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", d => {
            if (attribute === "gender") return d.gender === "Male" ? colors(0) : colors(1);
            if (attribute === "age") return d.age > 40 ? colors(2) : colors(3);
            if (attribute === "dominant_hand") return d.dominant_hand === "Right" ? colors(4) : colors(5);
            return "#ccc";
        })
        .append("title")
        .text(d => `ID: ${d.id}\nAge: ${d.age}\nGender: ${d.gender}\nDominant Hand: ${d.dominant_hand}`);
}

function visualizeSummaryStatistics() {
    var content = d3.select("#main-svg g");
    var modality = document.getElementById("stat-modality").value;
    var gender = document.getElementById("stat-gender").value;

    // simulated summary statistics
    var data = [
        { group: "Male", value: Math.random() * 10 + 70 },
        { group: "Female", value: Math.random() * 10 + 65 }
    ];

    if (gender !== "all") {
        data = data.filter(d => d.group.toLowerCase() === gender);
    }

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand().domain(data.map(d => d.group)).range([0, width]).padding(0.2);
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    var g = content.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.group))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2");

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(`Mean ${modality.replace("_", " ")} by Gender`);
}
