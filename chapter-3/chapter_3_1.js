export { chapter_3_1 };


function chapter_3_1() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "A Custom visualization of architectural differences between the MLP and KAN model.";

    // getting the dimensions of the actual content
    const contentWidth = 700;
    const contentHeight = 700;
    // setting SVG dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");
    let animationFrameId;
    var svg = d3.select("#main-svg");
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    var content = svg.select("g");
    const complexity = parseInt(d3.select('#complexity-slider').node().value);
    console.log(width)
    console.log(height)
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    content.selectAll('*').remove();

    const networkWidth = 500;
    const networkHeight = 400;
    const startX = 10;
    const startY = 10;
    const yGap = 300;
    
    
    const layers = complexity + 2;
    const nodesPerLayer = 4;
    const layerSpacing = networkWidth / (layers + 1);
    const nodeSpacing = networkHeight / (nodesPerLayer + 1);
    const colorMLP = "#8B4DA1";
    const colorKAN = "green";
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
        .attr('r', 4)
        .attr('fill', colorMLP);
    
    // draw KAN
    let kanNodes = [];
    let kanLinks = [];
    
    for (let i = 0; i < layers; i++) {
        for (let j = 0; j < nodesPerLayer; j++) {
            kanNodes.push({
                layer: i,
                x: startX + layerSpacing * (i + 1),
                y: startY + yGap + nodeSpacing * (j + 1)
            });
        }
    }
    
    kanNodes.forEach(source => {
        kanNodes.forEach(target => {
            if (target.layer === source.layer + 1) {
                kanLinks.push({source, target});
            }
        });
    });
    const lineGenerator = d3.line().curve(d3.curveBasis);
    
    const kanPaths = content.selectAll('.kan-link')
        .data(kanLinks)
        .enter()
        .append('path')
        .attr('class', 'kan-link')
        .attr('stroke', colorKAN)
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('opacity', 0.5);
    content.selectAll('.kan-node')
        .data(kanNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 4)
        .attr('fill', colorKAN);
    // add legend
    const legend = content.append('g')
        .attr('transform', `translate(${450}, ${650})`);
    // mlp legend
    legend.append('circle')
        .attr('r', 4)
        .attr('fill', colorMLP);
    legend.append('text')
        .attr('x', 10)
        .attr('y', 4)
        .text('Multi-Layer Perceptron (MLP)')
        .attr('font-size', '12px');
    // KAN legend
    legend.append('circle')
        .attr('r', 4)
        .attr('cy', 20)
        .attr('fill', colorKAN);
    legend.append('text')
        .attr('x', 10)
        .attr('y', 24)
        .text('Kolmogorov-Arnold Network (KAN)')
        .attr('font-size', '12px');
    function updatePaths() {
        const time = Date.now() / 1000;
        
        kanPaths.each(function(d) {
            const path = d3.select(this);
            const source = d.source;
            const target = d.target;
            
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            
            const offset1X = Math.sin(time * 2 + source.x) * 10;
            const offset1Y = Math.cos(time * 3 + source.y) * 10;
            const offset2X = Math.sin(time * 2.5 + target.x) * 10;
            const offset2Y = Math.cos(time * 3.5 + target.y) * 10;
            
            const points = [
                [source.x, source.y],
                [midX + offset1X, midY + offset1Y],
                [midX + offset2X, midY + offset2Y],
                [target.x, target.y]
            ];
            
            path.attr('d', lineGenerator(points));
        });
        
        animationFrameId = requestAnimationFrame(updatePaths);
    }
    updatePaths();
}