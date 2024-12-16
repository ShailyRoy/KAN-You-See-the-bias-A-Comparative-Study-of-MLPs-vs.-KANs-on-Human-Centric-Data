export { chapter_5_1 };


function chapter_5_1() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "Empirical comparison for MLP vs KAN.";

    // getting the dimensions of the actual content
    const contentWidth = 700;
    const contentHeight = 500;
    // setting SVG dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");
    
    var content = d3.select("#main-svg g");
    
    // metrics and models
    var metrics = ["Speed", "Generalization", "Interpretability", "Versatility", "Accuracy"];
    var models = ["MLP", "KAN"];
    
    // qualitative data representation
    var data = [
        {
            model: "MLP",
            values: [1.0, 0.5, 0.5, 1.0, 1.0] // baseline values
        },
        {
            model: "KAN",
            values: [0.5, 1.0, 1.0, 0.5, 0.5] // relative values (better=1.0, similar=0.75, worse=0.5)
        }
    ];

    var radialScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 150]);
        
    var angleSlice = (Math.PI * 2) / metrics.length;
    
    // adjust position to accommodate legend
    var g = content.append("g")
        .attr("transform", "translate(250,250)");
    
    // draw grid lines with qualitative labels
    var levels = [0.5, 0.75, 1.0];
    levels.forEach(function(level) {
        g.append("circle")
            .attr("r", radialScale(level))
            .attr("fill", "none")
            .attr("stroke", "#cdcdcd");
        
        // add qualitative labels
        var label = level === 1.0 ? "better" :
                   level === 0.75 ? "similar" :
                   "worse";
        g.append("text")
            .attr("x", 5)
            .attr("y", -radialScale(level))
            .attr("fill", "#666")
            .style("font-size", "10px")
            .text(label);
    });

    // draw axes
    metrics.forEach(function(metric, i) {
        var angle = angleSlice * i - Math.PI / 2;
        var x = radialScale(1.1) * Math.cos(angle);
        var y = radialScale(1.1) * Math.sin(angle);
        
        g.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", radialScale(1.0) * Math.cos(angle))
            .attr("y2", radialScale(1.0) * Math.sin(angle))
            .attr("stroke", "#cdcdcd");
            
        g.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(metric);
    });

    // define colors
    const colorMLP = "#8B4DA1";
    const colorKAN = "green";
    var color = d3.scaleOrdinal()
        .domain(models)
        .range([colorMLP, colorKAN]);

    // draw data
    var line = d3.lineRadial()
        .radius(d => radialScale(d.value))
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveLinearClosed);

    data.forEach(function(d) {
        g.append("path")
            .datum(d.values.map((v, i) => ({ value: v })))
            .attr("d", line)
            .attr("fill", color(d.model))
            .attr("fill-opacity", 0.3)
            .attr("stroke", color(d.model))
            .attr("stroke-width", 2);
    });

    // add legend
    var legend = g.append("g")
        .attr("transform", "translate(200, 100)");
        
    models.forEach((model, i) => {
        var legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);
            
        legendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(model))
            .attr("fill-opacity", 0.3)
            .attr("stroke", color(model));
            
        legendRow.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(model === "MLP" ? "Multi-Layer Perceptrons (MLPs)" : "Kolmogorov-Arnold Networks (KANs)")
            .style("font-size", "12px");
    });
}