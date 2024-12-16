export { visualizeConfusionMatrix, visualizeIncomeDistribution };


// function to process ADULT dataset and create confusion matrix
function processData(data) {
    console.log("Starting data processing");
    
    // parsing the data
    const parsedData = data.trim().split('\n').map(line => {
        const values = line.split(',').map(val => val.trim());
        return {
            income: values[14],
            gender: values[9],
            predicted: values[14]  
        };
    });

    function calculateMatrix(filtered) {
        console.log("Calculating matrix for group size:", filtered.length);
        
        if (filtered.length === 0) {
            console.log("Empty group, returning empty matrix");
            return [];
        }

        // counting occurrences
        const truePositives = filtered.filter(d => d.income === '>50K' && d.predicted === '>50K').length;
        const falsePositives = filtered.filter(d => d.income === '≤50K' && d.predicted === '>50K').length;
        const falseNegatives = filtered.filter(d => d.income === '>50K' && d.predicted === '≤50K').length;
        const trueNegatives = filtered.filter(d => d.income === '≤50K' && d.predicted === '≤50K').length;

        console.log("Matrix values:", {
            truePositives,
            falsePositives,
            falseNegatives,
            trueNegatives,
            total: filtered.length
        });

        return [
            {
                actual: "Income >50K",
                predicted: "Income >50K",
                value: truePositives
            },
            {
                actual: "Income >50K",
                predicted: "Income ≤50K",
                value: falseNegatives
            },
            {
                actual: "Income ≤50K",
                predicted: "Income >50K",
                value: falsePositives
            },
            {
                actual: "Income ≤50K",
                predicted: "Income ≤50K",
                value: trueNegatives
            }
        ];
    }

    // calculating for each group
    const result = {
        'overall': calculateMatrix(parsedData),
        'male': calculateMatrix(parsedData.filter(d => d.gender === ' Male')),
        'female': calculateMatrix(parsedData.filter(d => d.gender === ' Female'))
    };

    console.log("Final results:", result);
    return result;
}

// maining visualization function
function visualizeConfusionMatrix(content) {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const svgWidth = 800;
    const svgHeight = 500;
    const width = 400;
    const height = 400;

    const svg = content.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${(svgWidth - width) / 2 - margin.left},${(svgHeight - height) / 2})`);

    // adjusting the matrix position within the centered container
    const matrixG = svg.append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);

    // creating color scale
    const color = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolate("#FFFFFF", "#FFC627")); // White to ASU Maroon

    // creating scales
    const x = d3.scaleBand()
        .range([0, width])
        .domain(["Income ≤50K", "Income >50K"])
        .padding(0.05);

    const y = d3.scaleBand()
        .range([0, height])
        .domain(["Income >50K", "Income ≤50K"])
        .padding(0.05);

    // creating tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "4px");

    // loading the predictions data
    d3.csv("./chapter-1/predictions.csv").then(data => {
        function calculateMatrix(filtered) {
            if (filtered.length === 0) return [];
            
            const totalPositives = filtered.filter(d => d.actual === '>50K').length;
            const totalNegatives = filtered.filter(d => d.actual === '<=50K').length;
            
            const truePositives = filtered.filter(d => d.actual === '>50K' && d.predicted === '>50K').length;
            const falsePositives = filtered.filter(d => d.actual === '<=50K' && d.predicted === '>50K').length;
            const falseNegatives = filtered.filter(d => d.actual === '>50K' && d.predicted === '<=50K').length;
            const trueNegatives = filtered.filter(d => d.actual === '<=50K' && d.predicted === '<=50K').length;

            return [
                {
                    actual: "Income >50K",
                    predicted: "Income >50K",
                    value: (truePositives / totalPositives) * 100
                },
                {
                    actual: "Income >50K",
                    predicted: "Income ≤50K",
                    value: (falseNegatives / totalPositives) * 100
                },
                {
                    actual: "Income ≤50K",
                    predicted: "Income >50K",
                    value: (falsePositives / totalNegatives) * 100
                },
                {
                    actual: "Income ≤50K",
                    predicted: "Income ≤50K",
                    value: (trueNegatives / totalNegatives) * 100
                }
            ];
        }

        // calculating matrices for each demographic
        const matrices = {
            'overall': calculateMatrix(data),
            'male': calculateMatrix(data.filter(d => d.gender === '1')),  // assuming 1 is male after encoding
            'female': calculateMatrix(data.filter(d => d.gender === '0')) // assuming 0 is female after encoding
        };
        // adding x axis
        svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .attr("font-size", "12px")
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Predicted");

        // adding y axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("font-size", "12px")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -height / 2)
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Actual");

        // updating matrix when demographic is selected
        function updateMatrix(demographic) {
            const cells = svg.selectAll(".cell")
                .data(matrices[demographic]);

            cells.enter()
                .append("rect")
                .attr("class", "cell")
                .merge(cells)
                .attr("x", d => x(d.predicted))
                .attr("y", d => y(d.actual))
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .attr("fill", d => color(d.value))
                .on('mouseover', (event, d) => {
                    tooltip
                        .style("opacity", 1)
                        .style("visibility", "visible")
                        .html(`Actual: ${d.actual}<br>Predicted: ${d.predicted}<br>Value: ${d.value.toFixed(1)}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                })
                .on('mouseout', () => {
                    tooltip
                        .style("opacity", 0)
                        .style("visibility", "hidden");
                });

            cells.exit().remove();

            // updating the values in cells
            const values = svg.selectAll(".value")
                .data(matrices[demographic]);

            values.enter()
                .append("text")
                .attr("class", "value")
                .merge(values)
                .attr("x", d => x(d.predicted) + x.bandwidth() / 2)
                .attr("y", d => y(d.actual) + y.bandwidth() / 2)
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .style("font-size", "14px")
                .style("font-family", "system-ui, -apple-system, sans-serif")
                .style("font-weight", "bold")
                .text(d => d.value.toFixed(1) + "%");  // (TP)

            values.exit().remove();
        }

        // initializing with overall data
        updateMatrix(d3.select("#gender-select").property("value").toLowerCase());
    });

    // adding a title for the confusion matrix
    content.append("text")
    .attr("x", (svgWidth - width) / 2 - margin.left + width / 2)  // center over the matrix, accounting for the matrix's position
    .attr("y", margin.top / 2)  // position at half the top margin
    .attr("text-anchor", "middle")  // center the text at its position
    .style("font-size", "18px")
    .style("font-family", "system-ui, -apple-system, sans-serif")
    .style("font-weight", "bold")
    .text("Income Prediction by Gender");
}


// chapter 1 phase 2 chart 

// function to create income distribution visualization
function visualizeIncomeDistribution(content) {
    console.log("Starting income distribution visualization");

    // file path to the data
    d3.text('./chapter-1/adult.data').then(data => {
        console.log("Data loaded successfully");

        // Parsing the data
        const parsedData = data.trim().split('\n').map(line => {
            const values = line.split(',').map(val => val.trim());
            return {
                income: values[14],
                gender: values[9]
            };
        });

        // calculating statistics for each gender
        const stats = {
            male: {
                total: parsedData.filter(d => d.gender === 'Male').length,
                above50k: parsedData.filter(d => d.gender === 'Male' && d.income === '>50K').length
            },
            female: {
                total: parsedData.filter(d => d.gender === 'Female').length,
                above50k: parsedData.filter(d => d.gender === 'Female' && d.income === '>50K').length
            }
        };

        // calculating percentages
        const chartData = [
            {
                gender: 'Male',
                income: '≤50K',
                percentage: ((stats.male.total - stats.male.above50k) / stats.male.total) * 100
            },
            {
                gender: 'Male',
                income: '>50K',
                percentage: (stats.male.above50k / stats.male.total) * 100
            },
            {
                gender: 'Female',
                income: '≤50K',
                percentage: ((stats.female.total - stats.female.above50k) / stats.female.total) * 100
            },
            {
                gender: 'Female',
                income: '>50K',
                percentage: (stats.female.above50k / stats.female.total) * 100
            }
        ];

        // adjusting margins to use more of the available space
        const margin = { top: 60, right: 60, bottom: 40, left: 60 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // update the scales to use the larger space
        const x0 = d3.scaleBand()
            .domain(['Male', 'Female'])
            .range([0, width])
            .padding(0.3);

        const x1 = d3.scaleBand()
            .domain(['≤50K', '>50K'])
            .range([0, x0.bandwidth()])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // creating color scale
        const color = d3.scaleOrdinal()
            .domain(['>50K', '≤50K'])
            .range(['#8C1D40', '#FFC627']); // asu colors

        // creating the svg container
        const g = content.append("g")
            .attr("transform", `translate(${margin.left + 50},${margin.top})`);  // added 100px to x-offset

        // adding title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("font-family", "system-ui, -apple-system, sans-serif")
            .text("Income Distribution by Gender in ADULT Dataset");

        // creating tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "10px")
            .style("border-radius", "4px");

        // adding the bars
        g.selectAll(".gender-group")
            .data(['Male', 'Female'])
            .enter().append("g")
            .attr("class", "gender-group")
            .attr("transform", d => `translate(${x0(d)},0)`)
            .selectAll("rect")
            .data(d => ['>50K', '≤50K'].map(income => {
                return chartData.find(item => item.gender === d && item.income === income);
            }))
            .enter().append("rect")
            .attr("x", d => x1(d.income))
            .attr("y", d => y(d.percentage))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.percentage))
            .attr("fill", d => color(d.income))
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .style("visibility", "visible")
                    .html(`${d.gender}<br>${d.income}<br>${d.percentage.toFixed(1)}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0)
                    .style("visibility", "hidden");
            });

        // adding the axes
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
            .text("Gender");

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
            .text("Percentage (%)");

        // adding legend
        const legend = g.append("g")
            .attr("font-family", "system-ui, -apple-system, sans-serif")
            .attr("font-size", "12px")
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(['≤50K', '>50K'])
            .enter().append("g")
            .attr("transform", (d, i) => `translate(${width - 80}, ${i * 20 + 10})`);  // Adjusted position

        // adding colored rectangles for legend
        legend.append("rect")
            .attr("x", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color);

        // adding legend text
        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d => d);
    });
}
