// load data
d3.csv("./MLP_model_results.csv").then(function(mlpData) {
    d3.csv("./KAN_model_results2.csv").then(function(kanData) {

        // parse values from the CSV files
        mlpData.forEach(d => {
            d.subject = d.Subject === 'overall' ? 'Overall' : +d.Subject;
            d.accuracy = +d.Accuracy;
            d.model = 'MLP';
            d.gender = d.Gender;
            d.classificationReport = JSON.parse(d.Classification_Report.replace(/'/g, '"'));
            d.confusionMatrix = d.Confusion_Matrix.replace(/\[|\]/g, '').split('],[').map(row => row.split(',').map(Number));
        });

        kanData.forEach(d => {
            d.subject = d.Subject === 'overall' ? 'Overall' : +d.Subject;
            d.accuracy = +d.Accuracy;
            d.model = 'KAN';
            d.gender = d.Gender;
            d.classificationReport = JSON.parse(d.Classification_Report.replace(/'/g, '"'));
            d.confusionMatrix = JSON.parse(d.Confusion_Matrix);
        });

        // tooltip setup
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // set up dimensions for bar chart
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // function to draw the subject-wise bar chart
        function drawSubjectWiseChart(data) {
            d3.select("#viewing-area").selectAll("*").remove();
            const svgAccuracy = d3.select("#viewing-area")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // set up scales
            const x0Scale = d3.scaleBand()
                .domain(data.map(d => d.subject))
                .range([0, width])
                .padding(0.2);

            const x1Scale = d3.scaleBand()
                .domain(["MLP", "KAN"])
                .range([0, x0Scale.bandwidth()])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, 1])
                .nice()
                .range([height, 0]);

            const colorScale = d3.scaleOrdinal()
                .domain(["MLP", "KAN"])
                .range(["steelblue", "#d95f02"]);

            // add axes
            svgAccuracy.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x0Scale).tickFormat(d => d === 19.0 ? 'Overall' : `Subject ${d}`))
                .selectAll("text")
                .attr("transform", "rotate(-40)")
                .style("text-anchor", "end");

            svgAccuracy.append("g")
                .call(d3.axisLeft(yScale).ticks(10, "%"));

            // add bars
            const subjectGroups = svgAccuracy.selectAll(".subject-group")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "subject-group")
                .attr("transform", d => `translate(${x0Scale(d.subject)},0)`);

            subjectGroups.selectAll(".bar")
                .data(d => [{ key: "MLP", value: d.accuracy, subject: d.subject, report: d.classificationReport, matrix: d.confusionMatrix }, { key: "KAN", value: d.accuracy, subject: d.subject, report: d.classificationReport, matrix: d.confusionMatrix }])
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x1Scale(d.key))
                .attr("y", d => yScale(d.value))
                .attr("width", x1Scale.bandwidth())
                .attr("height", d => height - yScale(d.value))
                .attr("fill", d => colorScale(d.key))
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`${d.key} Accuracy: ${d.value}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .on("click", function(event, d) {
                    d3.select("#details-view").html(
                        `<h3>${d.key} Model - Subject ${d.subject}</h3>
                        <p><strong>Classification Report:</strong></p>
                        <pre>${JSON.stringify(d.report, null, 2)}</pre>
                        <p><strong>Confusion Matrix:</strong></p>`
                    );
                    drawConfusionMatrix(d.matrix);
                });

            // add labels
            svgAccuracy.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("Subjects");

            svgAccuracy.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("Accuracy");

            // add legend outside the chart
            const legend = d3.select("#viewing-area")
                .append("div")
                .attr("class", "legend");

            ["MLP", "KAN"].forEach((key, i) => {
                const legendItem = legend.append("div")
                    .attr("class", "legend-item")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("margin-bottom", "5px");

                legendItem.append("div")
                    .style("width", "20px")
                    .style("height", "20px")
                    .style("background-color", colorScale(key))
                    .style("margin-right", "5px");

                legendItem.append("span")
                    .text(key);
            });
        }

        // function to draw the confusion matrix
        function drawConfusionMatrix(matrix) {
            d3.select("#details-view").append("svg")
                .attr("width", 300)
                .attr("height", 300)
                .append("g")
                .attr("transform", "translate(20,20)")
                .selectAll("g")
                .data(matrix)
                .enter()
                .append("g")
                .each(function(row, rowIndex) {
                    d3.select(this).selectAll("rect")
                        .data(row)
                        .enter()
                        .append("rect")
                        .attr("x", (d, i) => i * 80)
                        .attr("y", rowIndex * 80)
                        .attr("width", 70)
                        .attr("height", 70)
                        .attr("fill", "#69b3a2")
                        .attr("stroke", "#000");

                    d3.select(this).selectAll("text")
                        .data(row)
                        .enter()
                        .append("text")
                        .attr("x", (d, i) => i * 80 + 35)
                        .attr("y", rowIndex * 80 + 45)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .text(d => d);
                });
        }

        // function to draw gender-wise accuracy comparison
        function drawGenderWiseChart(mlpData, kanData) {
            d3.select("#viewing-area").selectAll("*").remove();
            const svgAccuracy = d3.select("#viewing-area")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const genderData = [
                { gender: 'Male', model: 'MLP', accuracy: d3.mean(mlpData.filter(d => d.gender === 'Male'), d => d.accuracy) },
                { gender: 'Female', model: 'MLP', accuracy: d3.mean(mlpData.filter(d => d.gender === 'Female'), d => d.accuracy) },
                { gender: 'Male', model: 'KAN', accuracy: d3.mean(kanData.filter(d => d.gender === 'Male'), d => d.accuracy) },
                { gender: 'Female', model: 'KAN', accuracy: d3.mean(kanData.filter(d => d.gender === 'Female'), d => d.accuracy) }
            ];

            // set up scales
            const x0Scale = d3.scaleBand()
                .domain(['Male', 'Female'])
                .range([0, width])
                .padding(0.2);

            const x1Scale = d3.scaleBand()
                .domain(['MLP', 'KAN'])
                .range([0, x0Scale.bandwidth()])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, 1])
                .nice()
                .range([height, 0]);

            const colorScale = d3.scaleOrdinal()
                .domain(['MLP', 'KAN'])
                .range(['steelblue', '#d95f02']);

            // add axes
            svgAccuracy.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x0Scale));

            svgAccuracy.append("g")
                .call(d3.axisLeft(yScale).ticks(10, "%"));

            // add bars
            const genderGroups = svgAccuracy.selectAll(".gender-group")
                .data(genderData)
                .enter()
                .append("g")
                .attr("class", "gender-group")
                .attr("transform", d => `translate(${x0Scale(d.gender)},0)`);

            genderGroups.append("rect")
                .attr("class", "bar")
                .attr("x", d => x1Scale(d.model))
                .attr("y", d => yScale(d.accuracy))
                .attr("width", x1Scale.bandwidth())
                .attr("height", d => height - yScale(d.accuracy))
                .attr("fill", d => colorScale(d.model))
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`${d.model} (${d.gender}) Accuracy: ${d.accuracy}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // add labels
            svgAccuracy.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("Gender");

            svgAccuracy.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("Accuracy");

            // add legend outside the chart
            const legend = d3.select("#viewing-area")
                .append("div")
                .attr("class", "legend");

            ['MLP', 'KAN'].forEach((key, i) => {
                const legendItem = legend.append("div")
                    .attr("class", "legend-item")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("margin-bottom", "5px");

                legendItem.append("div")
                    .style("width", "20px")
                    .style("height", "20px")
                    .style("background-color", colorScale(key))
                    .style("margin-right", "5px");

                legendItem.append("span")
                    .text(key);
            });
        }

        // add buttons for different views
        d3.select("#overall-btn").on("click", function() {
            // const overallData = mlpData.concat(kanData).filter(d => d.subject === 19.0);
            const overallData = [
    {subject: 19.0, accuracy: mlpData.find(d => d.subject === 19.0).accuracy, model: "MLP"},
    {subject: 19.0, accuracy: kanData.find(d => d.subject === 19.0).accuracy, model: "KAN"}
];
            drawSubjectWiseChart(overallData);
            d3.select("#details-view").html("<p>Select a specific subject to see details.</p>");
        });

        d3.select("#genderwise-btn").on("click", function() {
            drawGenderWiseChart(mlpData, kanData);
            d3.select("#details-view").html("<p>Select a specific subject to see details.</p>");
        });

        d3.select("#subjectwise-btn").on("click", function() {
            drawSubjectWiseChart(mlpData.concat(kanData).filter(d => d.subject !== 19.0));
            d3.select("#details-view").html("<p>Select a specific subject to see details.</p>");
        });
    });
});
