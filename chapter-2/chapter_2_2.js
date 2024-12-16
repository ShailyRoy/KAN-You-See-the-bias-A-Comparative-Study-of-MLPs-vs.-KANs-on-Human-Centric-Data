export { chapter_2_2 };

function chapter_2_2() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "Raw signal visualization for Participant 2";

    // getting the dimensions of the actual content
    const contentWidth = 900;
    const contentHeight = 800;
    // setting SVG dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    // get the selected gender from the dropdown
    var genderSelect = document.getElementById('gender-select-chapter-2');
    var subjectID = genderSelect.value === 'Male' ? 2 : 17;
    var signalColor = genderSelect.value === 'Male' ? '#62aec5' : '#ff69b4'; // blue for male, pink for female
    
    var svg = d3.select("#main-svg g");
    Promise.all([
        d3.csv("./chapter-2/unique_participants.csv"),
        d3.csv("./chapter-2/processed_participants.csv")
    ])
    .then(([participantsData, signalsData]) => {
        var participants = participantsData.map(d => ({
            subject: +d.subject,
            age: +d.age,
            gender: d.gender.trim().toLowerCase(),
            dominant_hand: d.dominant_hand.trim().toLowerCase(),
            weight: +d.weight_kg,
            height: +d.height_cm,
        }));

        var groupedSignals = d3.group(signalsData, d => +d.subject);
        var participant = participants.find(p => p.subject === subjectID);
        var signals = groupedSignals.get(participant.subject);

        var width = 1000;
        var height = 1000;

        svg.selectAll("*").remove();

        var signalTypes = ["EDA", "BVP", "TEMP"];
        var numCols = 2;
        var margin = { top: 50, right: 50, bottom: 50, left: 100 };
        var plotWidth = (width - 100) / numCols;
        var plotHeight = (height / 2) - 100;

        signalTypes.forEach((signalType, index) => {
            var chartGroup = svg.append("g")
                .attr("transform", `translate(${(index % numCols) * plotWidth + margin.left}, ${(Math.floor(index / numCols) * plotHeight) + margin.top})`);

            var signalData = signals.filter(d => d.signal === signalType);
            drawScatterAndLinePlot(chartGroup, signalData, {
                width: plotWidth - margin.left - margin.right,
                height: plotHeight - margin.top - margin.bottom,
                margin: margin,
                title: `${signalType} (Participant ${participant.subject})`
            });
        });

        function drawScatterAndLinePlot(chartGroup, data, { width, height, margin, title }) {
            var xScale = d3.scaleLinear()
                .domain([0, data.length - 1])
                .range([0, width])
                .nice();

            var yScale = d3.scaleLinear()
                .domain([d3.min(data, d => +d.mean), d3.max(data, d => +d.mean)])
                .range([height, 0])
                .nice();

        // add x-axis with label
        chartGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(5));
        
        // add x-axis label
        chartGroup.append("text")
            .attr("x", width / 2.1)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("font-family", "Arial, sans-serif")
            .text("Time Step");

        // add y-axis with label
        chartGroup.append("g")
            .call(d3.axisLeft(yScale).ticks(5));
        
        // add y-axis label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("font-family", "Arial, sans-serif")
            .text("Value");

            chartGroup.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale).ticks(5));

            chartGroup.append("g")
                .call(d3.axisLeft(yScale).ticks(5));

            var line = d3.line()
                .x((d, i) => xScale(i))
                .y(d => yScale(+d.mean))
                .curve(d3.curveMonotoneX);

            chartGroup.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", signalColor)  // using the gender-based color
                .attr("stroke-width", 2)
                .attr("d", line);

            var localTooltip = d3.select("body").append("div")
                .attr("class", "lineplot-tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("z-index", 1000)
                .style("opacity", 0)
                .style("background", "#000")
                .style("color", "#fff")
                .style("padding", "5px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "5px");

            chartGroup.selectAll(".scatter-point")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "scatter-point")
                .attr("cx", (d, i) => xScale(i))
                .attr("cy", d => yScale(+d.mean))
                .attr("r", 3)
                .attr("fill", signalColor)  // using the gender-based color
                .on("mouseover", function(event, d) {
                    localTooltip
                        .html(`
                            <strong>Signal:</strong> ${d.signal}<br>
                            <strong>Mean:</strong> ${(+d.mean).toFixed(2)}<br>
                            <strong>Min:</strong> ${(+d.min).toFixed(2)}<br>
                            <strong>Max:</strong> ${(+d.max).toFixed(2)}<br>
                            <strong>Std:</strong> ${(+d.std).toFixed(2)}
                        `)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`)
                        .style("opacity", 1);
                })
                .on("mouseout", function() {
                    localTooltip.style("opacity", 0).style("left", "-9999px");
                });

            chartGroup.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("font-family", "Arial, sans-serif")
                .text(title);
        }
    })
    .catch(error => console.error('Error loading data:', error));
}

// add event listener to redraw when gender changes
document.getElementById('gender-select-chapter-2').addEventListener('change', chapter_2_2);
