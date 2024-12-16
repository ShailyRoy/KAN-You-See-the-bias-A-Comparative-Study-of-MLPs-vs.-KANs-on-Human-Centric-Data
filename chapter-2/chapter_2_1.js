export { chapter_2_1 };

function chapter_2_1() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "A Custom visualization of the WESAD dataset. Hover over these glyphs to see the details about each participant.";

    // getting the dimensions of the actual content
    const contentWidth = 700;
    const contentHeight = 700;
    // setting svg dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");


    var svg = d3.select("#main-svg g");

    d3.csv("./chapter-2/unique_participants.csv").then(function(participantsData) {
        var participants = participantsData.map(d => ({
            subject: +d.subject,
            age: +d.age,
            gender: d.gender.trim().toLowerCase(),
            dominant_hand: d.dominant_hand.trim().toLowerCase(),
            weight: +d.weight_kg,
            height: +d.height_cm,
        }));

        var svgWidth = 1000;
        var svgHeight = 1000;

        // layout configuration for 15 participants in 5 columns
        var columns = 5;
        var rows = Math.ceil(15 / columns);

        // original dimensions before scaling
        var originalGlyphWidth = 90;
        var originalGlyphHeight = 80;
        var originalMarginX = 70;
        var originalMarginY = 170;

        // total required width/height for the grid
        var totalWidth = columns * (originalGlyphWidth + originalMarginX) - originalMarginX;
        var totalHeight = rows * (originalGlyphHeight + originalMarginY) - originalMarginY;

        // compute scale factor
        var horizontalScale = (svgWidth - 100) / totalWidth;
        var verticalScale = (svgHeight - 100) / totalHeight;
        var scaleFactor = 0.8 * Math.min(horizontalScale, verticalScale, 1);

        // apply scale factor
        var glyphWidth = originalGlyphWidth * scaleFactor;
        var glyphHeight = originalGlyphHeight * scaleFactor;
        var marginX = originalMarginX * scaleFactor;
        var marginY = originalMarginY * scaleFactor;

        var glyphGroup = svg.append("g")
            .attr("class", "glyph-overview")
            .attr("transform", `translate(50, 50) scale(${scaleFactor})`);

        // inline tooltip creation
        var tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("z-index", 1000)
            .style("background-color", "#fff")
            .style("padding", "10px")
            .style("border", "1px solid #ddd")
            .style("border-radius", "8px")
            .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
            .style("visibility", "hidden");

        // inline legend
        addInlineLegends(svg, 20, 20);

        participants.slice(0, 15).forEach((participant, i) => {
            var x = (i % columns) * (glyphWidth + marginX);
            var y = Math.floor(i / columns) * (glyphHeight + marginY);

            var glyph = glyphGroup.append("g")
                .attr("transform", `translate(${x}, ${y})`)
                .attr("class", "participant-glyph")
                .style("opacity", 0)
                .on("mouseover", function(event) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("transform", `translate(${x}, ${y}) scale(1.1)`);

                    d3.select(this).select("circle")
                        .attr("stroke", "#ff4500")
                        .attr("stroke-width", 3);

                    tooltip
                        .style("visibility", "visible")
                        .style("top", `${event.pageY + 10}px`)
                        .style("left", `${event.pageX + 10}px`)
                        .html(`
                            <strong>Participant ${participant.subject}</strong><br>
                            <strong>Age:</strong> ${participant.age}<br>
                            <strong>Gender:</strong> ${participant.gender.charAt(0).toUpperCase()+participant.gender.slice(1)}<br>
                            <strong>Height:</strong> ${participant.height} cm<br>
                            <strong>Weight:</strong> ${participant.weight} kg<br>
                            <strong>Dominant Hand:</strong> ${participant.dominant_hand.charAt(0).toUpperCase()+participant.dominant_hand.slice(1)}
                        `);
                })
                .on("mousemove", function(event) {
                    tooltip
                        .style("top", `${event.pageY + 10}px`)
                        .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("transform", `translate(${x}, ${y}) scale(1)`);

                    d3.select(this).select("circle")
                        .attr("stroke", "none")
                        .attr("stroke-width", 0);

                    tooltip.style("visibility", "hidden");
                });


            // draw the glyph
            drawGlyph(glyph, participant.subject);

            // add entrance animation with delay based on position
            glyph.transition()
                .delay(i * 80)  // 200ms delay between each glyph
                .duration(500)   // 500ms animation duration
                .style("opacity", 1)
                .attr("transform", `translate(${x}, ${y})`)
                .ease(d3.easeBackOut.overshoot(1.2));  // add a slight bounce effect
        });
    })
    .catch(error => console.error('Error loading participants data:', error));

    function addInlineLegends(svg, topMargin = 150, leftMargin = 1050, itemSpacing = 150) {
        var legendGroup = svg.append("g")
            .attr("class", "legend-group")
            .attr("transform", `translate(${leftMargin}, ${topMargin})`);

        var legendItems = [
            { label: "", symbol: "", color: "", radius: 6 },
            { label: "Male;", symbol: "circle", color: "#62aec5", radius: 10 },
            { label: "Female;", symbol: "circle", color: "#f678a7", radius: 10 },
        ];

        legendItems.forEach((item, index) => {
            var row = Math.floor(index / 5);
            var col = index % 4;
            var itemGroup = legendGroup.append("g")
                .attr("class", "legend-item")
                .attr("transform", `translate(${col * itemSpacing}, ${row * 50})`);

            if (item.symbol === "circle") {
                itemGroup.append("circle")
                    .attr("cx", -40)
                    .attr("cy", 18)
                    .attr("r", item.radius || 15)
                    .attr("fill", item.color || "none");
            }

            itemGroup.append("text")
                .attr("x", -20)
                .attr("y", 25)
                .text(item.label)
                .attr("font-size", "20px")
                .attr("font-family", "Arial, sans-serif")
                .attr("fill", "#333");
        });
    }
}








// draws a single glyph
function drawGlyph(glyph, subjectID) {
    d3.csv("./chapter-2/unique_participants.csv").then(function(participantsData) {
        var participant = participantsData.map(d => ({
            subject: +d.subject,
            age: +d.age,
            gender: d.gender.trim().toLowerCase(),
            dominant_hand: d.dominant_hand.trim().toLowerCase(),
            weight: +d.weight_kg,
            height: +d.height_cm,
        })).find(p => p.subject === subjectID);

        var gender = participant.gender === "male" ? "male" : "female";
        var heightScale = d3.scaleLinear().domain([150, 200]).range([100, 160]);
        var weightScale = d3.scaleLinear().domain([50, 100]).range([6, 12]);
        var colorScale = d3.scaleLinear().domain([24, 35]).range([0.5, 1]);

        var glyphHeight = heightScale(participant.height);
        var limbWidth = weightScale(participant.weight);
        var brightness = colorScale(participant.age / 1.1);
        var baseColor = gender === "male" ? "#62aec5" : "#f678a7";
        var bodyColor = d3.color(baseColor).brighter(brightness);
        var groundLevel = 300;
        var leftMargin = 50;
        var topMargin = groundLevel - glyphHeight;

        // head
        glyph.append("circle")
            .attr("cx", leftMargin)
            .attr("cy", topMargin - glyphHeight / 2.5)
            .attr("r", limbWidth * 1.4)
            .attr("fill", bodyColor);

        // body
        if (gender === "male") {
            glyph.append("rect")
                .attr("x", leftMargin - glyphHeight / 8)
                .attr("y", topMargin - glyphHeight / 2.5 + glyphHeight / 10)
                .attr("width", glyphHeight / 3.5)
                .attr("height", glyphHeight / 1.7)
                .attr("fill", bodyColor)
                .attr("rx", 5);
        } else {
            glyph.append("path")
                .attr("d", `
                M ${leftMargin - glyphHeight / 10} ${topMargin - glyphHeight / 2.5 + glyphHeight / 10}
                L ${leftMargin + glyphHeight / 10} ${topMargin - glyphHeight / 2.5 + glyphHeight / 10}
                L ${leftMargin + glyphHeight / 4} ${topMargin + glyphHeight / 3}
                L ${leftMargin - glyphHeight / 4} ${topMargin + glyphHeight / 3}
                Z
            `)
                .attr("fill", bodyColor);
        }

        // arms
        if (participant.dominant_hand === "right") {
            // right arm raised
            glyph.append("line")
                .attr("x1", leftMargin + 5)
                .attr("y1", topMargin + 30 - glyphHeight / 4)
                .attr("x2", leftMargin + 5 + glyphHeight / 4)
                .attr("y2", topMargin - 10 - glyphHeight / 2)
                .attr("stroke", bodyColor)
                .attr("stroke-width", limbWidth * 1.2);

            // left arm down
            glyph.append("line")
                .attr("x1", leftMargin - 13)
                .attr("y1", topMargin - 9 - glyphHeight / 5)
                .attr("x2", leftMargin - 5 - glyphHeight / 4)
                .attr("y2", topMargin + 10)
                .attr("stroke", bodyColor)
                .attr("stroke-width", limbWidth * 1.2);
        } else {
            // left arm raised
            glyph.append("line")
                .attr("x1", leftMargin - 5)
                .attr("y1", topMargin + 30 - glyphHeight / 4)
                .attr("x2", leftMargin - glyphHeight / 4)
                .attr("y2", topMargin - 5 - glyphHeight / 2)
                .attr("stroke", bodyColor)
                .attr("stroke-width", limbWidth * 1.2);

            // right arm down
            glyph.append("line")
                .attr("x1", leftMargin + 10)
                .attr("y1", topMargin - 10 - glyphHeight / 5)
                .attr("x2", leftMargin + 5 + glyphHeight / 4)
                .attr("y2", topMargin + 5)
                .attr("stroke", bodyColor)
                .attr("stroke-width", limbWidth * 1.2);
        }

        // legs
        var legSpacing = glyphHeight / 11;
        glyph.append("line")
            .attr("x1", leftMargin + 5 - legSpacing)
            .attr("y1", topMargin + glyphHeight / 6)
            .attr("x2", leftMargin + 3 - legSpacing)
            .attr("y2", groundLevel - 15)
            .attr("stroke", bodyColor)
            .attr("stroke-width", limbWidth * 1.6);

        glyph.append("line")
            .attr("x1", leftMargin + legSpacing)
            .attr("y1", topMargin + glyphHeight / 6)
            .attr("x2", leftMargin + legSpacing)
            .attr("y2", groundLevel - 15)
            .attr("stroke", bodyColor)
            .attr("stroke-width", limbWidth * 1.6);
    })
    .catch(error => console.error('Error loading participant data for glyph:', error));
}

