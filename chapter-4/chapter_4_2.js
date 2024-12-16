export { chapter_4_2 };

// data from kan
const KANsData = [
    { subjectID: 2, gender: "Male", accuracy: 0.9361332787763526 },
    { subjectID: 3, gender: "Male", accuracy: 0.9336998170746177 },
    { subjectID: 4, gender: "Male", accuracy: 0.6435330553986883 },
    { subjectID: 5, gender: "Male", accuracy: 0.9802860260540937 },
    { subjectID: 6, gender: "Male", accuracy: 0.9112157306213621 },
    { subjectID: 7, gender: "Male", accuracy: 0.9128136683874186 },
    { subjectID: 8, gender: "Female", accuracy: 0.6930120343511624 },
    { subjectID: 9, gender: "Male", accuracy: 0.8927846930457393 },
    { subjectID: 10, gender: "Male", accuracy: 0.7933456037452907 },
    { subjectID: 11, gender: "Female", accuracy: 0.9896721143505302 },
    { subjectID: 13, gender: "Male", accuracy: 0.8973101697637417 },
    { subjectID: 14, gender: "Male", accuracy: 0.7064649164552654 },
    { subjectID: 15, gender: "Male", accuracy: 0.9051345765429278 },
    { subjectID: 16, gender: "Male", accuracy: 0.9525446429299317 },
    { subjectID: 17, gender: "Female", accuracy: 0.9358561002133445 },
];
const KANsOverall = 0.8723;
const KANsMale = 0.8721;
const KANsFemale = 0.8728;

// data from mlp
const MLPsData = [
    { subjectID: 2, gender: "Male", accuracy: 0.9990040733 },
    { subjectID: 3, gender: "Male", accuracy: 0.9723027084 },
    { subjectID: 4, gender: "Male", accuracy: 0.9818198006 },
    { subjectID: 5, gender: "Male", accuracy: 0.981494 },
    { subjectID: 6, gender: "Male", accuracy: 0.9819885341 },
    { subjectID: 7, gender: "Male", accuracy: 0.9178866738 },
    { subjectID: 8, gender: "Female", accuracy: 0.835099 },
    { subjectID: 9, gender: "Male", accuracy: 0.965978 },
    { subjectID: 10, gender: "Male", accuracy: 0.9969912464 },
    { subjectID: 11, gender: "Female", accuracy: 0.999047 },
    { subjectID: 13, gender: "Male", accuracy: 0.9571921382 },
    { subjectID: 14, gender: "Male", accuracy: 0.9301304635 },
    { subjectID: 15, gender: "Male", accuracy: 0.9859260266 },
    { subjectID: 16, gender: "Male", accuracy: 0.9674401741 },
    { subjectID: 17, gender: "Female", accuracy: 0.998551 }
];
const MLPsOverall = 0.9647;
const MLPsMale = 0.9698;
const MLPsFemale = 0.9442;


function chapter_4_2() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "Performance comparison for male vs female.";

    // modify the size
    const contentWidth = 700;
    const contentHeight = 400;
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");

    console.log("Starting gender comparison visualization");

    // prepare the data
    const data = [
        { group: 'MLPs', type: 'Male', accuracy: MLPsMale * 100 },
        { group: 'MLPs', type: 'Female', accuracy: MLPsFemale * 100 },
        { group: 'KANs', type: 'Male', accuracy: KANsMale * 100 },
        { group: 'KANs', type: 'Female', accuracy: KANsFemale * 100 }
    ];

    // set up margins and dimensions
    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // set up scales
    const x0 = d3.scaleBand()
        .domain(['MLPs', 'KANs'])
        .range([0, width])
        .padding(0.4);

    const x1 = d3.scaleBand()
        .domain(['Male', 'Female'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // sreate color scale
    const color = d3.scaleOrdinal()
        .domain(['Male', 'Female'])
        .range(['#62aec5', '#ff69b4']);  // asu colors

    // create the svg container
    const g = content.append("g")
        .attr("transform", `translate(${margin.left + 50},${margin.top})`);

    // add title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("font-family", "system-ui, -apple-system, sans-serif")
        .text("Gender-based Accuracy Comparison: MLPs vs KANs");

    // create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "4px");

    // add the grouped bars
    g.selectAll(".model-group")
        .data(['MLPs', 'KANs'])
        .enter().append("g")
        .attr("class", "model-group")
        .attr("transform", d => `translate(${x0(d)},0)`)
        .selectAll("rect")
        .data(d => ['Male', 'Female'].map(type => {
            return data.find(item => item.group === d && item.type === type);
        }))
        .enter().append("rect")
        .attr("x", d => x1(d.type))
        .attr("y", d => y(d.accuracy))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.accuracy))
        .attr("fill", d => color(d.type))
        .on("mouseover", (event, d) => {
            tooltip
                .style("opacity", 1)
                .style("visibility", "visible")
                .html(`${d.group}<br>${d.type}<br>${d.accuracy.toFixed(2)}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip
                .style("opacity", 0)
                .style("visibility", "hidden");
        });

    // add the axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .attr("font-size", "12px")
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Model Type");

    g.append("g")
        .call(d3.axisLeft(y))
        .attr("font-size", "12px")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Accuracy (%)");

    // add Legend
    const legend = g.append("g")
        .attr("font-family", "system-ui, -apple-system, sans-serif")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(['Male', 'Female'])
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${width - 0}, ${i * 20 + 10})`);

    // add colored rectangles for legend
    legend.append("rect")
        .attr("x", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color);

    // add legend text
    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d);
}