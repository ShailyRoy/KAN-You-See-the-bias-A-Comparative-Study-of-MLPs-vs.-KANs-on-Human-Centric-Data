export { chapter_3_3 };


function chapter_3_3() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "The recently proposed Kolmogorov-Arnold Network (KAN)";

    // getting the dimensions of the actual content
    const contentWidth = 700;
    const contentHeight = 600;
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
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    content.selectAll('*').remove();

    // make kan occupy most of the space
    const networkWidth = 700;
    const networkHeight = 600;
    const startX = 0;
    const startY = 0;  // centered vertically
    
    const layers = complexity + 2;
    const nodesPerLayer = 4;
    const layerSpacing = networkWidth / (layers + 1);
    const nodeSpacing = networkHeight / (nodesPerLayer + 1);
    const colorKAN = "green";

    // Draw KAN
    let kanNodes = [];
    let kanLinks = [];
    
    for (let i = 0; i < layers; i++) {
        for (let j = 0; j < nodesPerLayer; j++) {
            kanNodes.push({
                layer: i,
                x: startX + layerSpacing * (i + 1),
                y: startY + nodeSpacing * (j + 1)
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
        .attr('stroke-width', 1.5)
        .attr('fill', 'none')
        .attr('opacity', 0.5);

    content.selectAll('.kan-node')
        .data(kanNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 6)
        .attr('fill', colorKAN);

    // Add legend
    const legend = content.append('g')
        .attr('transform', `translate(${450}, ${550})`);

    legend.append('circle')
        .attr('r', 6)
        .attr('fill', colorKAN);

    legend.append('text')
        .attr('x', 15)
        .attr('y', 4)
        .text('Kolmogorov-Arnold Networks')
        .attr('font-size', '14px');

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
            
            const offset1X = Math.sin(time * 2 + source.x) * 15;
            const offset1Y = Math.cos(time * 3 + source.y) * 15;
            const offset2X = Math.sin(time * 2.5 + target.x) * 15;
            const offset2Y = Math.cos(time * 3.5 + target.y) * 15;
            
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