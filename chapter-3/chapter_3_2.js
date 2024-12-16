export { chapter_3_2 };

function chapter_3_2() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "The conventional MLP architecture.";

    // getting the dimensions of the actual content
    const contentWidth = 700;
    const contentHeight = 600;
    
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");
        
    var svg = d3.select("#main-svg");
    var content = svg.select("g");
    const complexity = parseInt(d3.select('#complexity-slider').node().value);
    
    content.selectAll('*').remove();

    // increased dimensions for larger mlp
    const networkWidth = 700;  // increased from 500
    const networkHeight = 600; // increased from 400
    const startX = 0;
    const startY = 0;
    
    const layers = complexity + 2;
    const nodesPerLayer = 4;   // increased from 4
    const layerSpacing = networkWidth / (layers + 1);
    const nodeSpacing = networkHeight / (nodesPerLayer + 1);
    const colorMLP = "#8B4DA1";
    
    // draw mlp
    let mlpNodes = [];
    let mlpLinks = [];
    
    for (let i = 0; i < layers; i++) {
        for (let j = 0; j < nodesPerLayer; j++) {
            mlpNodes.push({
                layer: i,
                x: startX + layerSpacing * (i + 1),
                y: startY + nodeSpacing * (j + 1)
            });
        }
    }
    
    mlpNodes.forEach(source => {
        mlpNodes.forEach(target => {
            if (target.layer === source.layer + 1) {
                mlpLinks.push({source, target});
            }
        });
    });
    
    content.selectAll('.mlp-link')
        .data(mlpLinks)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', colorMLP)
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    
    content.selectAll('.mlp-node')
        .data(mlpNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 6)
        .attr('fill', colorMLP);
    
    // Add legend
    const legend = content.append('g')
        .attr('transform', `translate(${450}, ${550})`);
        
    legend.append('circle')
        .attr('r', 6)
        .attr('fill', colorMLP);
        
    legend.append('text')
        .attr('x', 15)
        .attr('y', 4)
        .text('Multi-Layer Perceptron (MLP)')
        .attr('font-size', '14px');
}